package helen.catering.service.printing;

import helen.catering.Utils;
import helen.catering.dao.PosPrinterDao;
import helen.catering.dao.PrintPacketDao;
import helen.catering.model.PrinterSession;
import helen.catering.model.entities.PosPrinter;
import helen.catering.model.entities.PrintPacket;

import java.io.InputStream;
import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.apache.mina.core.buffer.IoBuffer;
import org.apache.mina.core.future.WriteFuture;
import org.apache.mina.core.service.IoHandlerAdapter;
import org.apache.mina.core.session.IdleStatus;
import org.apache.mina.core.session.IoSession;
import org.apache.mina.filter.codec.ProtocolCodecFilter;
import org.apache.mina.filter.logging.LoggingFilter;
import org.apache.mina.transport.socket.SocketSessionConfig;
import org.apache.mina.transport.socket.nio.NioSocketAcceptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class PrintingServer extends IoHandlerAdapter {
	volatile Map<Long, PrinterSession> printers = new HashMap<Long, PrinterSession>();

	private static final Logger logger = LoggerFactory
			.getLogger(PrintingServer.class);
	static final long CHECK_STATUS_TIMEOUT = 20000;
	static final long HEARTBEAT_TIMEOUT = 5 * 60 * 1000;
	static final long LOGINT_REFRESH_TIMEOUT = 20 * 60 * 1000;
	static final int CHECK_QUEUE_INTERVAL = 1;// 5 seconds
	static final int MAX_PACKET_LENGHT = 1344;

	@Autowired
	private PosPrinterDao posPrinterDao;

	@Autowired
	private PrintPacketDao _printPacketDao;

	@Override
	public void exceptionCaught(IoSession session, Throwable cause)
			throws Exception {
		// no need to log manually
		// logger.error(getPrinterBySession(session) + "-unknow:", cause);
	}

	private PrinterSession getPrinterBySession(IoSession session) {
		for (PrinterSession printer : printers.values())
			if (session == printer.getSession())
				return printer;
		return null;
	}

	private void initialize() throws Exception {
		try {
			// Create an Acceptor
			NioSocketAcceptor acceptor = new NioSocketAcceptor();
			InputStream in = this.getClass().getClassLoader()
					.getResourceAsStream("db.properties");
			Properties p = new Properties();
			p.load(in);

			// Add Handler
			acceptor.setHandler(this);

			acceptor.getFilterChain().addLast("logging", new LoggingFilter());
			acceptor.getFilterChain().addLast("codec",
					new ProtocolCodecFilter(new FlightCodecFactory()));

			// Create Session Configuration
			SocketSessionConfig dcfg = acceptor.getSessionConfig();
			dcfg.setReuseAddress(true);
			acceptor.bind(new InetSocketAddress(Integer.parseInt(p
					.getProperty("db.com"))));
			in.close();
		} catch (Exception ex) {
			Thread.sleep(10000);
			initialize();
		}
	}

	public PrintingServer() throws Exception {
		initialize();
	}

	@Override
	public void messageReceived(IoSession session, Object message)
			throws Exception {
		IoBuffer buf = (IoBuffer) message;
		byte[] bytes = new byte[buf.limit()];
		buf.get(bytes);
		if (buf.limit() <= 0)
			return;

		// is login message
		if (bytes.length > 3 && bytes[2] == 0 && bytes[3] == 1) {
			try {
				Integer printerNo = Integer.parseInt(new String(bytes, 6, 4));
				PosPrinter posPrinter = posPrinterDao
						.getPrinterByNumber(printerNo);
				String commandSet = posPrinter.getCommandSet();
				logger.info("commandSet:" + commandSet);
				PrinterSession printer = new PrinterSession(session);
				printer.setCommandSet(commandSet);
				printer.setId(posPrinter.getId());
				printer.setPrinterNo(printerNo);
				printer.setLastHearbeat(System.currentTimeMillis());
				printer.setLoginTime(System.currentTimeMillis());
				if (printers.containsKey(posPrinter.getId()))
					printer.setQueue(printers.get(posPrinter.getId())
							.getQueue());
				// printer登录消息
				printers.put(posPrinter.getId(), printer);
				logger.info(session.getRemoteAddress() + "-printerLogin:"
						+ printerNo);
				printQueue(posPrinter.getId());
			} catch (Exception ex) {
				logger.error(session.getRemoteAddress()
						+ "-printerLogin failed", ex);
			}
			return;
		} else if (bytes.length > 3 && bytes[2] == 0 && bytes[3] == 3) {
			// is heart beat message
			try {
				Integer printerNo = Integer.parseInt(new String(bytes, 6, 4));
				PosPrinter posPrinter = posPrinterDao
						.getPrinterByNumber(printerNo);
				String commandSet = posPrinter.getCommandSet();
				PrinterSession printer;
				if (printers.containsKey(posPrinter.getId())) {
					printer = printers.get(posPrinter.getId());
					printer.setId(posPrinter.getId());
					printer.setPrinterNo(printerNo);
					printer.setCommandSet(commandSet);
					printer.setSession(session);
					printer.setLastHearbeat(System.currentTimeMillis());
					printers.put(posPrinter.getId(), printer);
				} else {
					printer = new PrinterSession(session);
					printer.setCommandSet(commandSet);
					printer.setId(posPrinter.getId());
					printer.setPrinterNo(printerNo);
					printer.setLastHearbeat(System.currentTimeMillis());
					printers.put(posPrinter.getId(), printer);
				}
				logger.info(session.getRemoteAddress() + "-printerHeartbeat:"
						+ printerNo);
				printQueue(posPrinter.getId());
			} catch (Exception ex) {
				logger.error(session.getRemoteAddress()
						+ "-printerHeartbeat failed", ex);
			}
			return;
		}

		PrinterSession printer = getPrinterBySession(session);
		if (printer != null) {
			if (PosPrinter.COMMANDSET_ESCPOS.equals(printer.getCommandSet())) {
				if (bytes[0] >= 18) {// is printer status return, avoid
					int status = bytes[0];
					boolean isReady = (status & 4) == 4 && (status & 8) != 8;
					printer.setState(isReady ? 1 : 0);
					logger.info(printer.getId() + "-checkStatus response:"
							+ Utils.bytesToString(bytes));
					synchronized (session) {
						session.notifyAll();
					}
					return;
				}
			} else if (PosPrinter.COMMANDSET_BASIC.equals(printer
					.getCommandSet())) {
				int status = bytes[0];
				boolean isReady = status == 0 || status == 32;
				printer.setState(isReady ? 1 : 0);
				logger.info(printer.getId() + "-checkStatus response:"
						+ Utils.bytesToString(bytes));
				synchronized (session) {
					session.notifyAll();
				}
				return;
			}
		}
	}

	private void printQueue(final Long printerId) {
		final PrinterSession printer = printers.get(printerId);
		// not a gprs printer, do not print actively
		if (printer.getPrinterNo() == 0)
			return;
		// ensure only one thread per one print queue;
		if (printer.isTryPrinting())
			return;
		printer.setTryPrinting(true);
		final LinkedList<PrintPacket> queue = printer.getQueue();

		Thread printQueueThread = new Thread(new Runnable() {
			@Override
			public void run() {

				try {
					List<PrintPacket> failPacket = _printPacketDao
							.popPrintPacketsByPrinterId(printer.getId());
					if (failPacket != null)
						queue.addAll(failPacket);
				} catch (Exception ex) {
				}
				long curTimeStamp = System.currentTimeMillis();
				if (queue.isEmpty()) {
					// should check printer status before print, as
					// client's IP will change and no exception when
					// send
					boolean isReady = isPrinterReady(printer.getId());
					printer.setReady(isReady);
					if (!isReady) {
						printer.setTryPrinting(false);
						return;
					}
				}
				// check queue every CHECK_QUEUE_INTERVAL seconds
				for (int i = 0; i < 60 / CHECK_QUEUE_INTERVAL - 2; i++) {
					if (System.currentTimeMillis() - curTimeStamp > 57 * 1000)
						break;
					try {
						while (!queue.isEmpty()) {
							logger.info(printerId
									+ "-printOrder:printing queue length "
									+ queue.size());

							PrintPacket printPacket = queue.poll();

							if (!printPacket.isPostCheck()) {
								boolean isReady = isPrinterReady(printer
										.getId());
								printer.setReady(isReady);
								if (!isReady) {
									// don't check too often,
									// or package will be sticky
									printPacket.setErrorLog(printerId
											+ "-precheck not ready\r\n");
									_printPacketDao.save(printPacket);
									try {
										Thread.sleep(5000);
									} catch (Exception ex) {
									}
									break;
								} else {
									// stop and wait for heartbeat come,or
									// DTU will drop message
									if (System.currentTimeMillis()
											- curTimeStamp > 55 * 1000){
										queue.offerFirst(printPacket);
										break;
									}
								}
							}

							IoSession session = printer.getSession();
							// get session every time before printing
							if (session == null) {
								printPacket.setErrorLog(printerId
										+ "-session is null\r\n");
								_printPacketDao.save(printPacket);
								continue;
							}

							WriteFuture writeFuture = session.write(printPacket
									.getPrintData());
							writeFuture.awaitUninterruptibly();
							if (!writeFuture.isWritten()
									|| writeFuture.getException() != null) {
								printPacket.setErrorLog(printerId
										+ "-printing exception\r\n"
										+ writeFuture.getException()
												.getMessage());
								_printPacketDao.save(printPacket);
								continue;
							}

							Thread.sleep(printPacket.getSleepTime() * 100 + 1000);

							if (printPacket.isPostCheck()) {
								boolean isReady = isPrinterReady(printer
										.getId());
								printer.setReady(isReady);
								if (!isReady) {
									// don't check too often,
									// or package will be sticky
									printPacket.setErrorLog(printerId
											+ "-postcheck not ready\r\n");
									_printPacketDao.save(printPacket);
									try {
										Thread.sleep(5000);
									} catch (Exception ex) {
									}
									break;
								}
							}
						}

					} catch (Exception e) {
						logger.error("-printQueue thread exception", e);
					}
					try {
						Thread.sleep(CHECK_QUEUE_INTERVAL * 1000);
					} catch (Exception ex) {
					}
				}
				printer.setTryPrinting(false);
			}

		});
		printQueueThread.start();

	}

	@Override
	public void sessionIdle(IoSession session, IdleStatus status)
			throws Exception {
		logger.info("-sessionIdle:IDLE " + session.getIdleCount(status));
	}

	private boolean doubleCheckAlive(long printerId) {
		boolean flag = isPrinterReady(printerId);
		if (!flag) {// try again
			flag = isPrinterReady(printerId);
		}
		return flag;
	}

	public boolean isPrinterReady(Long printerId) {
		try {
			logger.info(printerId
					+ "-isPrinterReady: send check printer status");
			if (!printers.containsKey(printerId))
				return false;
			PrinterSession printer = printers.get(printerId);
			IoSession session = printer.getSession();
			if (session == null)
				return false;
			WriteFuture writeFuture = null;

			if (PosPrinter.COMMANDSET_ESCPOS.equals(printer.getCommandSet())) {
				writeFuture = session.write(new byte[] { 0x10, 0x04, 0x01 });
			} else if (PosPrinter.COMMANDSET_BASIC.equals(printer
					.getCommandSet())) {
				writeFuture = session.write(new byte[] { 0x1B, 0x21, 0x3F });
			}

			writeFuture.awaitUninterruptibly(5000);
			if (writeFuture.getException() != null) {
				logger.error(printerId + "-isPrinterReady: send exceptiion ",
						writeFuture.getException());
				return false;
			}

			long preCheckTime = System.currentTimeMillis();
			synchronized (session) {
				session.wait(CHECK_STATUS_TIMEOUT);
			}
			long postCheckTime = System.currentTimeMillis();
			if (postCheckTime - preCheckTime >= CHECK_STATUS_TIMEOUT)
				printers.get(printerId).setState(-1);
			if (printer.getState() == 1) {
				logger.info(printerId + "-isPrinterReady: printer is ready ");
				printer.setReady(true);
				return true;
			} else {
				logger.info(printerId
						+ "-isPrinterReady: printer is NOT ready ");
				printer.setReady(false);
				return false;
			}
		} catch (Exception ex) {
			logger.error(printerId + "-isPrinterReady: error ", ex);
			return false;
		}
	}

	public int getPrinterCount() {
		return printers.size();
	}

	public int getPrinterQueueLength(Long printerId) {
		LinkedList<PrintPacket> queue = printers.get(printerId)
				.getQueue();
		return queue.size();
	}

	public int getPrinterState(Long printerId) {
		if (printers.containsKey(printerId)
				&& printers.get(printerId).isReady()) {
			if (System.currentTimeMillis()
					- printers.get(printerId).getLastHearbeat() > HEARTBEAT_TIMEOUT) {
				printers.get(printerId).setReady(false);
				return 0;
			}
			return 1;
		}
		return 0;
	}

	public void print(long printerId, byte[] printData, boolean postCheck)
			throws Exception {
		PrintPacket printPacket = createPrintPacket(printerId, printData,
				postCheck);
		PrinterSession printer = printers.get(printerId);
		if (printer == null) {
			printPacket.setErrorLog(printerId + "-printer is null\r\n");
			_printPacketDao.save(printPacket);
			return;
		}

		List<byte[]> printPacketParts = splicePrintPacket(printPacket
				.getPrintData());
		for (int i = 0; i < printPacketParts.size(); i++) {
			PrintPacket printPacketPart = createPrintPacket(
					printPacket.getPosPrinterId(), printPacketParts.get(i),
					printPacket.isPostCheck());
			printer.getQueue().offer(printPacketPart);
		}

	}

	private List<byte[]> splicePrintPacket(byte[] printData) {
		byte[] remain = Arrays.copyOf(printData, printData.length);
		List<byte[]> result = new ArrayList<byte[]>();
		while (remain.length > MAX_PACKET_LENGHT) {
			int i = MAX_PACKET_LENGHT - 1;
			for (; i >= 0; i--) {
				// count from MAX_PACKET_LENGHT backward until we get a newline
				if (printData[i] == 0x0A)
					break;
			}
			// if slice length too short, do not slice
			if (i < MAX_PACKET_LENGHT / 2)
				i = MAX_PACKET_LENGHT;
			result.add(Arrays.copyOfRange(remain, 0, i + 1));
			remain = Arrays.copyOfRange(remain, i + 1, remain.length);
		}
		if (remain.length > 0)
			result.add(remain);
		return result;
	}

	public List<PrintPacket> getPrintPacket(List<Long> printerIds) {
		List<PrintPacket> result = new ArrayList<PrintPacket>();
		for (long printerId : printerIds) {
			PrinterSession printer = printers.get(printerId);
			if (printer == null) {
				printer = new PrinterSession(null);
				printer.setId(printerId);
				printer.setQueue(new LinkedList<PrintPacket>());
				printers.put(printerId, printer);
			}
			LinkedList<PrintPacket> queue = printer.getQueue();

			try {
				List<PrintPacket> failPacket = _printPacketDao
						.popPrintPacketsByPrinterId(printerId);
				if (failPacket != null)
					queue.addAll(failPacket);
			} catch (Exception ex) {
				logger.error("getPrintPacket exception", ex);
			}

			PrintPacket pp = queue.poll();
			result.add(pp);
		}
		return result;
	}

	public int emptyPrinterQueue(long printerId) {
		LinkedList<PrintPacket> queue = printers.get(printerId)
				.getQueue();
		int result = queue.size();
		queue.clear();
		return result;
	}

	public PosPrinter getPrinter(long printerId) {
		return posPrinterDao.find(printerId);
	}

	private PrintPacket createPrintPacket(long printerId, byte[] printData,
			boolean postCheck) {
		PrintPacket printPacket = new PrintPacket();
		printPacket.setPosPrinterId(printerId);
		printPacket.setPrintData(printData);
		printPacket.setRetryTimes(2);
		printPacket.setPostCheck(postCheck);
		printPacket.setPrintTime(System.currentTimeMillis());
		int lineBreakIndex = 0;
		int sleepTime = 0;
		for (int i = 0; i < printData.length; i++) {
			if (printPacket.getPrintData()[i] == 0x0A) {
				lineBreakIndex++;
			}
		}
		sleepTime = lineBreakIndex / 2;
		printPacket.setSleepTime(sleepTime);
		return printPacket;
	}

	public static void writeLog(String text) {
		logger.info(text);
	}
}

package helen.catering.model;

import helen.catering.model.entities.PrintPacket;

import java.util.LinkedList;

import org.apache.mina.core.session.IoSession;

public class PrinterSession {
	private long id;
	private int printerNo;
	private IoSession session;
	private boolean isReady;
	private boolean isTryPrinting;
	private int state;
	private long loginTime;
	private long lastHearbeat;
	private LinkedList<PrintPacket> queue;
	private String commandSet;

	public PrinterSession(IoSession session) {
		this.session = session;
		this.isReady = false;
		this.state = -1;
		this.lastHearbeat = System.currentTimeMillis();
		this.queue = new LinkedList<PrintPacket>();
	}

	public IoSession getSession() {
		return session;
	}

	public void setSession(IoSession session) {
		this.session = session;
	}

	public boolean isReady() {
		return isReady;
	}

	public void setReady(boolean isReady) {
		this.isReady = isReady;
	}

	public long getLastHearbeat() {
		return lastHearbeat;
	}

	public void setLastHearbeat(long lastHearbeat) {
		this.lastHearbeat = lastHearbeat;
	}

	public LinkedList<PrintPacket> getQueue() {
		return queue;
	}

	public void setQueue(LinkedList<PrintPacket> queue) {
		this.queue = queue;
	}

	public int getState() {
		return state;
	}

	public void setState(int state) {
		this.state = state;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getCommandSet() {
		return commandSet;
	}

	public void setCommandSet(String commandSet) {
		this.commandSet = commandSet;
	}

	public boolean isTryPrinting() {
		return isTryPrinting;
	}

	public void setTryPrinting(boolean isTryPrinting) {
		this.isTryPrinting = isTryPrinting;
	}

	public long getLoginTime() {
		return loginTime;
	}

	public void setLoginTime(long loginTime) {
		this.loginTime = loginTime;
	}

	public int getPrinterNo() {
		return printerNo;
	}

	public void setPrinterNo(int printerNo) {
		this.printerNo = printerNo;
	}
}
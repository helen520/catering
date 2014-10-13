package helen.catering.service;

import helen.catering.Utils;
import helen.catering.dao.DepartmentDao;
import helen.catering.dao.DeskDao;
import helen.catering.dao.DishOrderDao;
import helen.catering.dao.EmployeeDao;
import helen.catering.dao.PosPrinterDao;
import helen.catering.dao.StoreDao;
import helen.catering.dao.UserAccountDao;
import helen.catering.model.FinanceStat;
import helen.catering.model.entities.Department;
import helen.catering.model.entities.Desk;
import helen.catering.model.entities.DishOrder;
import helen.catering.model.entities.Employee;
import helen.catering.model.entities.OrderItem;
import helen.catering.model.entities.PosPrinter;
import helen.catering.model.entities.Store;
import helen.catering.model.entities.UserAccount;
import helen.catering.service.printing.PrintingDataGenerator;
import helen.catering.service.printing.PrintingServer;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class DishOrderPrintingService {

	private static final Logger logger = LoggerFactory
			.getLogger(DishOrderPrintingService.class);

	@Autowired
	PrintingServer _printingServer;

	@Autowired
	DepartmentDao _departmentDao;

	@Autowired
	DishOrderDao _dishOrderDao;

	@Autowired
	StoreDao _storeDao;

	@Autowired
	PosPrinterDao _posPrinterDao;

	@Autowired
	EmployeeDao _employeeDao;

	@Autowired
	UserAccountDao _userAccountDao;

	@Autowired
	DeskDao _deskDao;

	public long[] getPrinterIdsByStoreId(long storeId) {
		List<PosPrinter> printers = _posPrinterDao
				.getPrintersByStoreId(storeId);

		long[] printerIds = new long[printers.size()];
		int i = 0;
		for (PosPrinter printer : printers) {
			printerIds[i++] = printer.getId();
		}
		return printerIds;
	}

	public void printDishOrder(long employeeId, long dishOrderId, Long printerId)
			throws Exception {
		DishOrder dishOrder = _dishOrderDao.getDishOrderById(dishOrderId);

		printCookingAndDeliveryNote(employeeId, dishOrder);

		if (printerId != null) {
			printCustomerNoter(employeeId, dishOrderId, printerId);
		}
	}

	public void printCustomerNoter(long employeeId, long dishOrderId,
			Long printerId) throws Exception {
		DishOrder dishOrder = _dishOrderDao.getDishOrderById(dishOrderId);

		printCustomerNote(dishOrder.getCreatorEmployeeId(), printerId,
				dishOrder, true);
	}

	public void reprintCustomerNote(Long printerId, long dishOrderId)
			throws Exception {
		DishOrder dishOrder = _dishOrderDao.getDishOrderById(dishOrderId);
		printCustomerNote(dishOrder.getCreatorEmployeeId(), printerId,
				dishOrder, false);
	}

	public void printCustomerNote(long employeeId, Long printerId,
			DishOrder dishOrder, boolean waitingOnly) throws Exception {

		logger.info("printCustomerNote by printerId start - " + printerId);
		List<OrderItem> orderItems = new ArrayList<OrderItem>();

		Store store = _storeDao.find(dishOrder.getStoreId());
		Employee employee = _employeeDao.find(employeeId);

		PosPrinter posPrinter = _posPrinterDao.find(printerId);
		for (OrderItem item : dishOrder.getOrderItems()) {
			if (item.getNoCustomerNote()) {
				continue;
			}
			if (waitingOnly) {
				if (item.getCustomerNotePrinted()) {
					continue;
				}
				orderItems.add(item);
			} else {
				if (item.getState() != OrderItem.STATE_CANCELLED) {
					orderItems.add(item);
				}
			}
		}
		// use specified printer id
		if (orderItems.size() == 0 || posPrinter == null) {
			logger.info("printCustomerNote finished  printerId is --> null");
			return;
		}

		byte[] printData = PrintingDataGenerator.getCustomerNoteDataPacket(
				posPrinter, employee, store, dishOrder, orderItems);
		// send PrintData before check printer status, so to print quickly
		_printingServer.print(posPrinter.getId(), printData, true);

		for (OrderItem item : dishOrder.getOrderItems()) {
			item.setCustomerNotePrinted(true);
			_dishOrderDao.saveOrderItem(item);
		}
		logger.info("printCustomerNote by printerId finished");
	}

	public void printCookingAndDeliveryNote(long employeeId, DishOrder dishOrder)
			throws Exception {

		logger.info("printCookingAndDeliveryNote start");
		HashMap<Long, List<OrderItem>> oiListByDepIDMap = new HashMap<Long, List<OrderItem>>();
		HashMap<PosPrinter, List<OrderItem>> oiListByDNPPMap = new HashMap<PosPrinter, List<OrderItem>>();
		HashMap<PosPrinter, List<OrderItem>> oiListBySDNPPMap = new HashMap<PosPrinter, List<OrderItem>>();
		HashMap<Long, String> setMealNameListByTriggerIdMap = new HashMap<Long, String>();

		Employee employee = _employeeDao.find(employeeId);
		Store store = _storeDao.find(dishOrder.getStoreId());

		for (OrderItem item : dishOrder.getOrderItems()) {
			if (item.getHasMealDealItems()) {
				if (!setMealNameListByTriggerIdMap.containsKey(item.getId())) {
					setMealNameListByTriggerIdMap.put(item.getId(),
							item.getDishName());
				}
				continue;
			}

			if (item.getState() == OrderItem.STATE_WAITING
					&& !item.getNoCookingNote()) {
				Long depId = item.getDepartmentId();
				Department department = _departmentDao.find(depId);

				if (department == null)
					continue;

				if (!item.getNoCookingNote()) {
					if (!oiListByDepIDMap.containsKey(depId)) {
						List<OrderItem> oiList = new ArrayList<OrderItem>();
						oiListByDepIDMap.put(depId, oiList);
					}
					oiListByDepIDMap.get(depId).add(item);
				}

				if (department.getDelivererNotePrinterId() != null) {
					PosPrinter posPrinter = _posPrinterDao.find(department
							.getDelivererNotePrinterId());
					if (posPrinter != null) {
						if (!oiListByDNPPMap.containsKey(posPrinter)) {
							List<OrderItem> oiList = new ArrayList<OrderItem>();
							oiListByDNPPMap.put(posPrinter, oiList);
						}
						oiListByDNPPMap.get(posPrinter).add(item);
					}
				}

				if (department.getSecondaryDelivererNotePrinterId() != null) {
					PosPrinter posPrinter = _posPrinterDao.find(department
							.getSecondaryDelivererNotePrinterId());
					if (posPrinter != null) {
						if (!oiListBySDNPPMap.containsKey(posPrinter)) {
							List<OrderItem> oiList = new ArrayList<OrderItem>();
							oiListBySDNPPMap.put(posPrinter, oiList);
						}
						oiListBySDNPPMap.get(posPrinter).add(item);
					}
				}
			}
		}
		for (Long depId : oiListByDepIDMap.keySet()) {
			Department department = _departmentDao.find(depId);
			if (department.getCookingNotePrinterId() == null)
				return;

			PosPrinter posPrinter = _posPrinterDao.find(department
					.getCookingNotePrinterId());

			if (posPrinter == null)
				continue;

			if (department.getSliceCookingNotes()) {
				int totalCookingNoteCount = oiListByDepIDMap.get(depId).size();
				int curCookingNoteIndex = 0;
				for (OrderItem item : oiListByDepIDMap.get(depId)) {
					curCookingNoteIndex++;
					List<OrderItem> orderItemList = new ArrayList<OrderItem>();
					orderItemList.add(item);

					byte[] printData = PrintingDataGenerator
							.getCookingNoteDataPacket(employee, posPrinter,
									dishOrder, orderItemList, store,
									setMealNameListByTriggerIdMap, true,
									curCookingNoteIndex, totalCookingNoteCount);
					logger.info("printCookingNote data :"
							+ Utils.bytesToString(printData));
					_printingServer.print(posPrinter.getId(), printData, false);
				}
			} else {
				byte[] printData = PrintingDataGenerator
						.getCookingNoteDataPacket(employee, posPrinter,
								dishOrder, oiListByDepIDMap.get(depId), store,
								setMealNameListByTriggerIdMap, false, 0, 0);
				logger.info("printCookingNote data :"
						+ Utils.bytesToString(printData));
				_printingServer.print(posPrinter.getId(), printData, false);
			}
		}

		for (PosPrinter posPrinter : oiListByDNPPMap.keySet()) {
			byte[] printData = PrintingDataGenerator.getDeliveryNoteDataPacket(
					posPrinter, store, employee, dishOrder,
					oiListByDNPPMap.get(posPrinter));
			logger.info("printDeliveryNote data :"
					+ Utils.bytesToString(printData));
			_printingServer.print(posPrinter.getId(), printData, false);
		}

		for (PosPrinter posPrinter : oiListBySDNPPMap.keySet()) {
			byte[] printData = PrintingDataGenerator.getDeliveryNoteDataPacket(
					posPrinter, store, employee, dishOrder,
					oiListBySDNPPMap.get(posPrinter));
			logger.info("printSecondaryDeliveryNote data :"
					+ Utils.bytesToString(printData));
			_printingServer.print(posPrinter.getId(), printData, false);
		}

		for (OrderItem item : dishOrder.getOrderItems()) {
			if (item.getState() == OrderItem.STATE_WAITING) {
				item.setState(OrderItem.STATE_COOKING);
			}
		}
		_dishOrderDao.save(dishOrder);
		logger.info("printCookingAndDeliveryNote finished");
	}

	public void printCheckoutNote(long employeeId, DishOrder dishOrder)
			throws Exception {
		logger.info("printCheckoutNote start");

		Store store = _storeDao.find(dishOrder.getStoreId());
		PosPrinter posPrinter = _posPrinterDao.find(store
				.getCheckoutPosPrinterId());
		if (posPrinter == null)
			return;

		Employee employee = _employeeDao.find(employeeId);
		UserAccount user = null;
		if (dishOrder.getUserAccountId() != null) {
			user = _userAccountDao.find(dishOrder.getUserAccountId());
		}

		byte[] printData = PrintingDataGenerator.getCheckoutBillDataPacket(
				posPrinter, store, employee, dishOrder, user, false);

		// int itemCount = 0;
		for (OrderItem item : dishOrder.getOrderItems()) {
			if (item.getState() == OrderItem.STATE_DELIVERING
					|| item.getState() == OrderItem.STATE_COOKING) {
				// itemCount++;
				item.setState(OrderItem.STATE_SERVED);
			}

			if (dishOrder.getState() == DishOrder.STATE_CANCELLED) {
				item.setState(OrderItem.STATE_CANCELLED);
			}
		}

		// send PrintData before check printer status, so to print quickly
		// if (itemCount > 0) {
		_printingServer.print(posPrinter.getId(), printData, true);
		// }

		_dishOrderDao.save(dishOrder);
		logger.info("printCheckoutNote finished");
	}

	public void printChangeDeskNote(long employeeId, long currentDeskId,
			DishOrder dishOrder, List<OrderItem> oiList) throws Exception {
		logger.info("rePrintToKitchen start");

		Desk desk = _deskDao.getDeskById(currentDeskId);
		if (desk == null || dishOrder == null) {
			logger.info("rePrintToKitchen desk or dishOrder is null break");
			return;
		}

		Store store = _storeDao.find(dishOrder.getStoreId());
		HashMap<Long, List<OrderItem>> oiListByDepIDMap = new HashMap<Long, List<OrderItem>>();

		for (OrderItem item : oiList) {
			Long depId = item.getDepartmentId();
			if (!oiListByDepIDMap.containsKey(depId)) {
				oiListByDepIDMap.put(depId, new ArrayList<OrderItem>());
			}

			oiListByDepIDMap.get(depId).add(item);
		}

		for (Long depId : oiListByDepIDMap.keySet()) {

			Department department = _departmentDao.find(depId);
			if (department.getCookingNotePrinterId() == null)
				return;

			PosPrinter posPrinter = _posPrinterDao.find(department
					.getCookingNotePrinterId());
			if (posPrinter == null)
				return;
			Employee operator = _employeeDao.find(employeeId);
			Employee employee = _employeeDao.find(dishOrder
					.getCreatorEmployeeId());

			byte[] printData = PrintingDataGenerator.getRePrintToKitchenPacket(
					operator, employee, store, dishOrder,
					oiListByDepIDMap.get(depId), desk.getName());
			_printingServer.print(posPrinter.getId(), printData, false);

			if (department.getDelivererNotePrinterId() != null) {
				PosPrinter delivererPrinter = _posPrinterDao.find(department
						.getDelivererNotePrinterId());
				if (delivererPrinter != null) {
					_printingServer.print(delivererPrinter.getId(), printData,
							false);
				}
			}
		}

		for (OrderItem orderItem : dishOrder.getOrderItems()) {
			for (OrderItem item : oiList) {
				if (orderItem.getId() == item.getId()) {
					orderItem.setState(OrderItem.STATE_COOKING);
					break;
				}
			}
		}
		_dishOrderDao.save(dishOrder);

		logger.info("rePrintToKitchen finished");
	}

	public void printCancelOrderItemNote(Employee employee, DishOrder dishOrder,
			OrderItem orderItem) throws Exception {
		logger.info("printCancelOrderItemNote start");

		if (orderItem == null || dishOrder == null) {
			logger.info("printCancelOrderItemNote orderItem or dishOrder is null break");
			return;
		}

		Department department = _departmentDao
				.find(orderItem.getDepartmentId());
		if (department == null || department.getCookingNotePrinterId() == null)
			return;

		PosPrinter posPrinter = _posPrinterDao.find(department
				.getCookingNotePrinterId());
		if (posPrinter == null)
			return;

		byte[] printData = PrintingDataGenerator.getCancelOrderItemDataPacket(
				employee, posPrinter, dishOrder, orderItem, true);
		_printingServer.print(posPrinter.getId(), printData, false);

		if (department.getDelivererNotePrinterId() != null) {
			posPrinter = _posPrinterDao.find(department
					.getDelivererNotePrinterId());
			if (posPrinter != null) {
				printData = PrintingDataGenerator.getCancelOrderItemDataPacket(
						employee, posPrinter, dishOrder, orderItem, false);
				_printingServer.print(posPrinter.getId(), printData, false);
			}
		}

		logger.info("printCancelOrderItemNote finished");
	}

	public boolean prePrintCheckoutBill(long employeeId, DishOrder dishOrder)
			throws Exception {
		logger.info("prePrintCheckoutBill start");

		Store store = _storeDao.find(dishOrder.getStoreId());
		PosPrinter posPrinter = _posPrinterDao.find(store
				.getCheckoutPosPrinterId());
		if (posPrinter == null)
			return false;

		Employee employee = _employeeDao.find(employeeId);

		byte[] printData = PrintingDataGenerator.getCheckoutBillDataPacket(
				posPrinter, store, employee, dishOrder, null, true);
		// send PrintData before check printer status, so to print quickly
		_printingServer.print(posPrinter.getId(), printData, false);

		if (!dishOrder.getPrePrintCheckoutNotePrinted()) {
			_dishOrderDao.updateDishOrderPrePrintCheckoutNotePrinted(true,
					dishOrder.getId());
		}

		logger.info("prePrintCheckoutBill finished");
		return true;
	}

	public void printShiftClassNote(long employeeId, long storeId,
			FinanceStat financeStat) throws Exception {
		logger.info("printShiftClassNote start");
		Store store = _storeDao.find(storeId);
		PosPrinter posPrinter = _posPrinterDao.find(store
				.getCheckoutPosPrinterId());
		if (posPrinter == null)
			return;

		Employee employee = _employeeDao.find(employeeId);

		byte[] printData = PrintingDataGenerator.getShiftClassReportPacket(
				financeStat, posPrinter, store, employee);

		_printingServer.print(posPrinter.getId(), printData, false);

		logger.info("printShiftClassNote finished");
	}

	public void printRechargeBalanceNote(long employeeId, long userAccountId,
			long storeId, double amount) throws Exception {
		logger.info("printRechargeBalanceNote start");
		Store store = _storeDao.find(storeId);
		PosPrinter posPrinter = _posPrinterDao.find(store
				.getCheckoutPosPrinterId());
		if (posPrinter == null)
			return;

		Employee employee = _employeeDao.find(employeeId);
		UserAccount member = _userAccountDao.find(userAccountId);

		byte[] printData = PrintingDataGenerator.getRechargeBalanceNotePacket(
				member, posPrinter, store, employee, amount);

		_printingServer.print(posPrinter.getId(), printData, false);

		logger.info("printRechargeBalanceNote finished");
	}

	public boolean testingPosPrinter(long printerId) throws Exception {
		logger.info("testingPosPrinter start");
		PosPrinter posPrinter = _posPrinterDao.find(printerId);
		if (posPrinter == null)
			return false;

		byte[] printData = PrintingDataGenerator.getTestingPacket();

		_printingServer.print(posPrinter.getId(), printData, false);

		logger.info("testingPosPrinter finished");
		return true;
	}
}

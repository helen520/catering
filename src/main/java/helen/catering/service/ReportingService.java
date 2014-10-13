package helen.catering.service;

import helen.catering.FinanceStatHelper;
import helen.catering.SellStatHelper;
import helen.catering.dao.BOMLineDao;
import helen.catering.dao.BalanceOperationLogDao;
import helen.catering.dao.DepartmentDao;
import helen.catering.dao.DeskDao;
import helen.catering.dao.DishOrderDao;
import helen.catering.dao.EmployeeDao;
import helen.catering.dao.MenuDao;
import helen.catering.dao.ReportDataDao;
import helen.catering.dao.UserAccountDao;
import helen.catering.model.CookerDishStat;
import helen.catering.model.FinanceStat;
import helen.catering.model.MemberBalanceStat;
import helen.catering.model.PayRecordInfo;
import helen.catering.model.ReportData;
import helen.catering.model.SellStat;
import helen.catering.model.entities.BOMLine;
import helen.catering.model.entities.BalanceOperationLog;
import helen.catering.model.entities.Department;
import helen.catering.model.entities.Desk;
import helen.catering.model.entities.Dish;
import helen.catering.model.entities.DishCategory;
import helen.catering.model.entities.DishOrder;
import helen.catering.model.entities.Employee;
import helen.catering.model.entities.MaterialRecord;
import helen.catering.model.entities.Menu;
import helen.catering.model.entities.OrderItem;
import helen.catering.model.entities.PayRecord;
import helen.catering.model.entities.UserAccount;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class ReportingService {

	@Autowired
	ReportDataDao _reportDataDao;
	@Autowired
	DepartmentDao _departmentDao;
	@Autowired
	DishOrderDao _dishOrderDao;
	@Autowired
	MenuDao _menuDao;
	@Autowired
	DeskDao _deskDao;
	@Autowired
	EmployeeDao _employeeDao;
	@Autowired
	UserAccountDao _userAccountDao;
	@Autowired
	BalanceOperationLogDao _balanceOperationLogDao;
	@Autowired
	BOMLineDao _bomLineDao;

	public ReportData getReportDataByStoreId(long storeId) {

		double totalPrice = 0;
		double discountedTotalPrice = 0;
		double totalServiceFee = 0;
		double totalIncome = 0;

		ReportData reportData = new ReportData();
		List<PayRecordInfo> payRecordInfos = new ArrayList<PayRecordInfo>();
		HashMap<String, List<PayRecord>> payRecordTypeNameMap = new HashMap<String, List<PayRecord>>();

		List<DishOrder> dishOrders = _dishOrderDao
				.getShiftClassDishOrdersByStoreId(storeId);
		List<PayRecord> payRecords = new ArrayList<PayRecord>();

		for (DishOrder dishOrder : dishOrders) {
			totalPrice += dishOrder.getTotalPrice();
			discountedTotalPrice += dishOrder.getDiscountedPrice();
			totalServiceFee += dishOrder.getServiceFee();
			payRecords.addAll(_reportDataDao
					.getPayRecordsByDishOrderId(dishOrder.getId()));
		}

		for (PayRecord payRecord : payRecords) {
			if (!payRecordTypeNameMap.containsKey(payRecord.getTypeName())) {
				payRecordTypeNameMap.put(payRecord.getTypeName(),
						new ArrayList<PayRecord>());
			}
			payRecordTypeNameMap.get(payRecord.getTypeName()).add(payRecord);
			totalIncome += payRecord.getAmount() * payRecord.getExchangeRate();
		}

		for (Map.Entry<String, List<PayRecord>> payRecordMap : payRecordTypeNameMap
				.entrySet()) {
			PayRecordInfo payRecordInfo = new PayRecordInfo();
			payRecordInfo.setName(payRecordMap.getKey());
			payRecordInfo.setCount(payRecordMap.getValue().size());
			payRecordInfo.setExchangeRate(payRecordMap.getValue().get(0)
					.getExchangeRate());
			double totalPayRecordPrice = 0;
			double finalPrice = 0;
			for (PayRecord payRecord : payRecordMap.getValue()) {
				totalPayRecordPrice += payRecord.getAmount();
				finalPrice += payRecord.getAmount()
						* payRecord.getExchangeRate();
			}
			payRecordInfo.setTotalPrice(totalPayRecordPrice);
			payRecordInfo.setFinalPrice(Math.round(finalPrice * 10) / 10.0);
			payRecordInfos.add(payRecordInfo);
		}

		reportData.setDishOrderCount(dishOrders.size());
		reportData.setTotalPrice(totalPrice);
		reportData.setDiscountedTotalPrice(discountedTotalPrice);
		reportData.setTotalServiceFee(totalServiceFee);
		reportData.setTotalIncome(totalIncome);
		reportData.setPayRecordInfos(payRecordInfos);

		return reportData;
	}

	public FinanceStat getCurrentClassFinanceStat(long storeId) {
		List<Department> departmentList = this._departmentDao
				.getDepartments(storeId);
		List<Dish> dishList = this.getDishListByStoreId(storeId);

		List<DishOrder> dishOrderList = this._dishOrderDao
				.getShiftClassDishOrdersByStoreId(storeId);
		FinanceStat financeStat = FinanceStatHelper.generateFinanceStat(
				departmentList, dishList, dishOrderList);

		return financeStat;
	}

	public HashMap<Long, String> getArchivingTimeMapByStoreId(long storeId) {

		return this._reportDataDao
				.getArchivingTimeMapByStoreId(storeId, 0, 100);
	}

	public HashMap<Long, String> getDepartmentByStoreId(long storeId) {
		List<Department> departments = this._departmentDao
				.getDepartments(storeId);
		HashMap<Long, String> departmentMap = new HashMap<Long, String>();
		for (Department department : departments) {
			departmentMap.put(department.getId(), department.getName());
		}

		return departmentMap;
	}

	public FinanceStat getClassFinanceStatByADT(long storeId, long archivedTime) {
		List<Department> departmentList = this._departmentDao
				.getDepartments(storeId);
		List<Dish> dishList = this.getDishListByStoreId(storeId);

		List<DishOrder> dishOrderList = this._reportDataDao
				.getDishOrderListByArchivedTime(storeId,
						DishOrder.STATE_ARCHIVED, archivedTime, 0, 10000);

		FinanceStat financeStat = FinanceStatHelper.generateFinanceStat(
				departmentList, dishList, dishOrderList);

		return financeStat;
	}

	public FinanceStat getAggregatedClassFinanceStatInTimeRange(long storeId,
			boolean onlyForeignAccounting, long startTime, long endTime) {
		List<Department> departmentList = this._departmentDao
				.getDepartments(storeId);
		List<Dish> dishList = this.getDishListByStoreId(storeId);

		List<DishOrder> dishOrderList = this._reportDataDao
				.getDishOrderListInArchivedTimeRange(storeId,
						DishOrder.STATE_ARCHIVED, startTime, endTime, 0, 10000);

		FinanceStat financeStat = FinanceStatHelper.generateFinanceStat(
				departmentList, dishList, dishOrderList);

		return financeStat;
	}

	public FinanceStat getDailyFinancialStat(long storeId, long startTime,
			long endTime) {
		List<Department> departmentList = this._departmentDao
				.getDepartments(storeId);
		List<Dish> dishList = this.getDishListByStoreId(storeId);

		List<DishOrder> dishOrderList = this._reportDataDao
				.getDishOrderListInTimeRange(storeId, startTime, endTime, 0,
						10000);

		FinanceStat financeStat = FinanceStatHelper.generateFinanceStat(
				departmentList, dishList, dishOrderList);

		return financeStat;
	}

	public FinanceStat getFinancialStatInTimeRange(long storeId,
			long startTime, long endTime) {
		List<Department> departmentList = this._departmentDao
				.getDepartments(storeId);
		List<Dish> dishList = this.getDishListByStoreId(storeId);

		List<DishOrder> dishOrderList = this._reportDataDao
				.getDishOrderListInTimeRange(storeId, startTime, endTime, 0,
						10000);

		FinanceStat financeStat = FinanceStatHelper.generateFinanceStat(
				departmentList, dishList, dishOrderList);

		return financeStat;
	}

	public List<SellStat> getDishCategorySellStats(long storeId,
			long startDate, long endDate, boolean isContainDetail) {

		List<DishCategory> dcList = this.dishCategoryListByStoreId(storeId);
		List<Dish> dishList = this.getDishListByStoreId(storeId);
		DishCategory.linkDishes(dcList, dishList);

		List<DishOrder> dishOrderList = this._reportDataDao
				.getDishOrderListInTimeRange(storeId, startDate, endDate, 0,
						10000);
		List<OrderItem> orderItemList = new ArrayList<OrderItem>();

		for (DishOrder dishOrder : dishOrderList) {
			if (dishOrder.getOrderItems().size() > 0) {
				orderItemList.addAll(dishOrder.getOrderItems());
			}
		}
		return SellStatHelper.generateDishCategorySellStats(dcList, dishList,
				orderItemList, isContainDetail);
	}

	public List<SellStat> getDeskSellStats(long storeId, long startDate,
			long endDate) {

		List<Desk> deskList = this._deskDao.getDesks(storeId);
		List<DishOrder> dishOrderList = this._reportDataDao
				.getDishOrderListInTimeRange(storeId, startDate, endDate, 0,
						10000);

		return SellStatHelper.generateDeskSellStats(dishOrderList, deskList);

	}

	public List<SellStat> getDishSellStats(long storeId, long dishCategoryId,
			long startDate, long endDate) {

		List<Dish> dishList = getDishListByStoreIdAndDishCategoryId(storeId,
				dishCategoryId);

		List<DishOrder> dishOrderList = this._reportDataDao
				.getDishOrderListInTimeRange(storeId, startDate, endDate, 0,
						10000);

		List<OrderItem> orderItemList = new ArrayList<OrderItem>();
		for (DishOrder dishOrder : dishOrderList) {
			orderItemList.addAll(dishOrder.getOrderItems());
		}

		return SellStatHelper.generateDishSellStats(dishList, orderItemList);

	}

	public List<OrderItem> getOrderItemListByDishID(long storeId, long dishID,
			long startDate, long endDate) {

		List<DishOrder> dishOrderList = this._reportDataDao
				.getDishOrderListInTimeRange(storeId, startDate, endDate, 0,
						10000);

		List<OrderItem> orderItemList = new ArrayList<OrderItem>();

		for (DishOrder dishOrder : dishOrderList) {
			for (OrderItem oi : dishOrder.getOrderItems()) {
				if (oi.getState() == OrderItem.STATE_CANCELLED) {
					// || oi.getState() == OrderItem.STATUS_DELETED
					continue;
				}
				if (oi.getDishId() == dishID) {
					oi.setDeskName(dishOrder.getDeskName());
					orderItemList.add(oi);
				}
			}
		}
		return orderItemList;

	}

	public List<SellStat> getEmployeeSellStats(long storeId, long startTime,
			long endTime) {

		List<Employee> employees = _employeeDao
				.getEmployeeListByStoreId(storeId);

		HashMap<Long, List<OrderItem>> orderItemsByEmployeeIdMap = new HashMap<Long, List<OrderItem>>();

		for (Employee employee : employees) {
			List<OrderItem> orderItems = _dishOrderDao
					.getOrderItemsByEmployeeIdAndTime(employee.getId(),
							startTime, endTime);
			if (!orderItemsByEmployeeIdMap.containsKey(employee.getId())) {
				orderItemsByEmployeeIdMap.put(employee.getId(), orderItems);
			}
		}

		return SellStatHelper.generateEmployeeSellStats(storeId, employees,
				orderItemsByEmployeeIdMap);
	}

	public List<SellStat> getDepartmentSellStats(long storeId, long startDate,
			long endDate, long departmentID) {
		List<Desk> deskList = this._deskDao.getDesks(storeId);
		List<Dish> dishList = this.getDishListByStoreId(storeId);

		List<DishOrder> dishOrderList = this._reportDataDao
				.getDishOrderListInTimeRange(storeId, startDate, endDate, 0,
						10000);

		return SellStatHelper.generateDepartmentSellStats(storeId,
				departmentID, deskList, dishList, dishOrderList);

	}

	public List<SellStat> getDishTagStats(long storeId, long startDate,
			long endDate) {
		return new ArrayList<SellStat>();
	}

	public FinanceStat getFinancialStatBetweenTimeStamps(long storeId,
			long startTime, long endTime) {

		List<Department> departmentList = this._departmentDao
				.getDepartments(storeId);
		List<Dish> dishList = this.getDishListByStoreId(storeId);

		List<DishOrder> dishOrderList = this._reportDataDao
				.getDishOrderListInADTRange(storeId, startTime, endTime);

		FinanceStat result = FinanceStatHelper.generateFinanceStat(
				departmentList, dishList, dishOrderList);

		return result;
	}

	private List<Dish> getDishListByStoreId(long storeId) {
		List<Menu> menuList = this._menuDao.getMenusByStoreId(storeId);
		List<Dish> dishList = new ArrayList<Dish>();
		if (menuList != null) {
			for (Menu menu : menuList) {
				for (DishCategory dishCategory : menu.getDishCategories()) {
					dishList.addAll(dishCategory.getDishes());
				}
			}
		}
		return dishList;
	}

	private List<Dish> getDishListByStoreIdAndDishCategoryId(long storeId,
			long dishCategoryId) {
		List<Menu> menuList = this._menuDao.getMenusByStoreId(storeId);
		List<Dish> dishList = new ArrayList<Dish>();
		if (menuList != null) {
			for (Menu menu : menuList) {
				for (DishCategory dishCategory : menu.getDishCategories()) {
					if (dishCategory.getId() == dishCategoryId) {
						dishList.addAll(dishCategory.getDishes());
					}
				}
			}
		}
		return dishList;
	}

	private List<DishCategory> dishCategoryListByStoreId(long storeId) {
		List<Menu> menuList = this._menuDao.getMenusByStoreId(storeId);
		List<DishCategory> dishCategoryList = new ArrayList<DishCategory>();
		if (menuList != null) {
			for (Menu menu : menuList) {
				dishCategoryList.addAll(menu.getDishCategories());
			}
		}
		return dishCategoryList;
	}

	public Map<String, List<CookerDishStat>> getCookerDishStatCookerNameMapInTimeRangeByStoreId(
			long storeId, long startTime, long endTime) {

		Map<String, List<CookerDishStat>> cookerDishStatList = this._reportDataDao
				.getCookerDishStatMapByCookerNameInTimeRangeByStoreId(storeId,
						startTime, endTime);
		return cookerDishStatList;
	}

	public DishOrder getDishOrderByID(long dishOrderID) {
		return _dishOrderDao.getDishOrderById(dishOrderID);
	}

	public List<OrderItem> getOrderItemListByEmployeeID(long employeeId,
			long startTime, long endTime) {
		return _dishOrderDao.getOrderItemsByEmployeeIdAndTime(employeeId,
				startTime, endTime);
	}

	public List<MemberBalanceStat> getMemberBalanceStatsByStoreId(long storeId) {
		List<MemberBalanceStat> stats = new ArrayList<MemberBalanceStat>();
		List<UserAccount> members = _userAccountDao
				.getAllMemberListByStoreId(storeId);

		for (UserAccount member : members) {

			MemberBalanceStat stat = new MemberBalanceStat();
			double totalRechargedAmount = 0;
			double totalExpenditure = 0;

			stat.setBalance(member.getBalance());
			stat.setMemberCardNo(member.getMemberCardNo());
			stat.setCreateTimeStr(member.getCreateTimeStr());
			stat.setName(member.getName());
			stat.setMobilePhone(member.getMobileNo());
			stat.setMemberId(member.getId());

			List<BalanceOperationLog> logs = _balanceOperationLogDao
					.getMemberOperationLogsByUserAccountId(member.getId());

			for (BalanceOperationLog log : logs) {
				double amount = Double.parseDouble(log.getDataSnapShot().split(
						" ")[2]);
				if (log.getOperationType().endsWith(
						BalanceOperationLog.BALANCE_OP_RECHARGE)) {
					totalRechargedAmount += amount;
				} else if (log.getOperationType().endsWith(
						BalanceOperationLog.BALANCE_OP_PREPAY_DISHORDER)) {
					totalExpenditure += amount;
				} else if (log.getOperationType().endsWith(
						BalanceOperationLog.BALANCE_OP_PAY_FOR_DISHORDER)) {
					totalExpenditure += amount;
				} else {
					totalExpenditure -= amount;
				}
			}

			stat.setTotalExpenditure(totalExpenditure);
			stat.setTotalRechargedAmount(totalRechargedAmount);
			stats.add(stat);
		}
		return stats;
	}

	public void setMaterialRecordOnShiftClass(long storeId) {
		List<DishOrder> orders = _dishOrderDao
				.getShiftClassDishOrdersByStoreId(storeId);

		HashMap<Long, BOMLine> bomLineMapByMaterialId = new HashMap<Long, BOMLine>();
		for (DishOrder dishOrder : orders) {
			if (dishOrder.getOrderItems().size() > 0) {
				for (OrderItem oi : dishOrder.getOrderItems()) {
					if (oi.getState() == OrderItem.STATE_SERVED) {
						List<BOMLine> bomLines = _bomLineDao
								.getBOMLineByDishId(oi.getDishId());
						for (BOMLine bom : bomLines) {

							if (!bomLineMapByMaterialId.containsKey(bom
									.getMaterialId())) {
								BOMLine bomLine = new BOMLine();
								bomLine.setDishId(bom.getDishId());
								bomLine.setDishName(bom.getDishName());
								bomLine.setMaterialId(bom.getMaterialId());
								bomLine.setMaterialName(bom.getMaterialName());
								bomLine.setWeight(0);
								bomLineMapByMaterialId.put(bom.getMaterialId(),
										bomLine);
							}

							BOMLine bomLine = bomLineMapByMaterialId.get(bom
									.getMaterialId());
							bomLine.setWeight(bomLine.getWeight()
									+ bom.getWeight());
						}
					}
				}
			}
		}

		long time = System.currentTimeMillis();
		for (Long materialId : bomLineMapByMaterialId.keySet()) {
			BOMLine bom = bomLineMapByMaterialId.get(materialId);
			MaterialRecord record = new MaterialRecord();
			record.setMaterialId(materialId);
			record.setMaterialName(bom.getMaterialName());
			record.setStoreId(storeId);
			record.setWeight(bom.getWeight());
			record.setCreateTime(time);
			this._reportDataDao.saveMaterialRecord(record);
		}
	}

	public List<MaterialRecord> getMaterialRecordByStoreIdAndTime(long storeId,
			long startTime, long endTime) {
		return this._reportDataDao.getMaterialRecordByStoreIdAndTime(storeId,
				startTime, endTime);
	}
}

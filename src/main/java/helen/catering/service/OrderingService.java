package helen.catering.service;

import helen.catering.Utils;
import helen.catering.dao.BookRecordDao;
import helen.catering.dao.DeskDao;
import helen.catering.dao.DiscountRuleDao;
import helen.catering.dao.DishDao;
import helen.catering.dao.DishOrderDao;
import helen.catering.dao.DishUnitDao;
import helen.catering.dao.EmployeeDao;
import helen.catering.dao.MealDealItemDao;
import helen.catering.dao.StoreDao;
import helen.catering.dao.UserAccountDao;
import helen.catering.model.DishOrderBrief;
import helen.catering.model.entities.BookRecord;
import helen.catering.model.entities.Desk;
import helen.catering.model.entities.DiscountRule;
import helen.catering.model.entities.Dish;
import helen.catering.model.entities.DishOrder;
import helen.catering.model.entities.DishOrderTag;
import helen.catering.model.entities.DishUnit;
import helen.catering.model.entities.Employee;
import helen.catering.model.entities.MealDealItem;
import helen.catering.model.entities.OrderItem;
import helen.catering.model.entities.PayRecord;
import helen.catering.model.entities.Store;
import helen.catering.model.entities.UserAccount;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class OrderingService {

	@Autowired
	private DeskDao _deskDao;

	@Autowired
	private DishDao _dishDao;

	@Autowired
	private DishUnitDao _dishUnitDao;

	@Autowired
	private DiscountRuleDao _discountRuleDao;

	@Autowired
	private DishOrderDao _dishOrderDao;

	@Autowired
	private MealDealItemDao _mealDealItemDao;

	@Autowired
	private UserAccountDao _userAccountDao;

	@Autowired
	EmployeeDao _employeeDao;

	@Autowired
	DishOrderPrintingService _printingService;

	@Autowired
	BookRecordDao _bookRecordDao;

	@Autowired
	BalanceOperationLogService _balanceOperationLogService;

	@Autowired
	OperationLogService _operationLogService;

	@Autowired
	StoreDao _storeDao;

	public DishOrder getDishOrderById(long id) {
		DishOrder dishOrder = this._dishOrderDao.getDishOrderById(id);
		if (dishOrder.getOrderItems() != null) {
			for (OrderItem oi : dishOrder.getOrderItems()) {
				if (oi.getState() == OrderItem.STATE_WAITING) {
					dishOrder.setIsHasSelfOrder(true);
					break;
				}
			}
		}
		dishOrder.updateJsonHash();

		return dishOrder;
	}

	public List<DishOrderBrief> getActiveDishOrderBriefsByStoreId(long storeId) {

		List<DishOrder> dishOrderList = _dishOrderDao
				.getActiveDishOrdersByStoreId(storeId);

		List<DishOrderBrief> dobList = new ArrayList<DishOrderBrief>();

		for (DishOrder dishOrder : dishOrderList) {
			dishOrder.updateJsonHash();

			DishOrderBrief dob = new DishOrderBrief();

			dob.setDishOrderId(dishOrder.getId());
			dob.setDeskId(dishOrder.getDeskId());
			dob.setCustomerCount(dishOrder.getCustomerCount());
			dob.setState(dishOrder.getState());
			dob.setPrePrintCheckoutNotePrinted(dishOrder
					.getPrePrintCheckoutNotePrinted());
			dob.setJsonHash(dishOrder.getJsonHash());

			if (dishOrder.getOrderItems() != null) {
				for (OrderItem oi : dishOrder.getOrderItems()) {
					if (oi.getState() == OrderItem.STATE_WAITING) {
						dob.setIsHasSelfOrder(true);
						break;
					}
				}
			}

			dobList.add(dob);
		}
		return dobList;
	}

	public DishOrder createDishOrder(long employeeId, long deskId,
			String serialNumber, int customerCount) throws ServiceException {
		if (deskId != 0) {
			List<DishOrder> adoList = _dishOrderDao
					.getActiveDishOrdersByDeskId(deskId);
			if (adoList.size() > 0) {
				throw new ServiceException(ServiceException.DESK_OCCUPIED);
			}
		}

		DishOrder dishOrder = new DishOrder();

		Employee employee = _employeeDao.find(employeeId);
		Desk desk = _deskDao.getDeskById(deskId);

		dishOrder.setDeskName("");

		if (desk != null) {
			dishOrder.setStoreId(desk.getStoreId());
			dishOrder.setDeskName(desk.getName());
		}

		if (employee != null) {
			dishOrder.setStoreId(employee.getStoreId());
		}

		dishOrder.setDeskId(deskId);
		dishOrder.setCreatorEmployeeId(employeeId);
		dishOrder.setEditorEmployeeId(employeeId);
		dishOrder.setCreateTime(System.currentTimeMillis());
		dishOrder.setSerialNumber(serialNumber);
		dishOrder.setCustomerCount(customerCount);
		dishOrder.setDiscountRate(1);
		dishOrder.setState(DishOrder.STATE_CREATING);
		dishOrder.setDishOrderTags(new ArrayList<DishOrderTag>());

		_dishOrderDao.save(dishOrder);

		dishOrder.updateJsonHash();

		return dishOrder;
	}

	public DishOrder cancelDishOrder(long employeeId, long dishOrderId)
			throws ServiceException {
		DishOrder dishOrder = _dishOrderDao.getDishOrderById(dishOrderId);
		if (dishOrder.getState() == DishOrder.STATE_CREATING
				|| dishOrder.getState() == DishOrder.STATE_WAITING) {

			dishOrder.setState(DishOrder.STATE_CANCELLED);
			_dishOrderDao.save(dishOrder);

			dishOrder.updateJsonHash();

			if (dishOrder.getPrePay() != null && dishOrder.getPrePay() > 0
					&& dishOrder.getUserAccountId() != null) {
				UserAccount user = _userAccountDao.find(dishOrder
						.getUserAccountId());
				double prePayAmount = 0;
				if (user != null) {
					prePayAmount = dishOrder.getPrePay();
					user.setBalance(user.getBalance() + dishOrder.getPrePay());
					dishOrder.setPrePay(0d);
				}
				_userAccountDao.save(user);
				_balanceOperationLogService.returnUsedBalance(
						user.getStoreId(), employeeId, dishOrder.getId(),
						prePayAmount, user.getId(), user.getBalance());
			}

			return dishOrder;
		}
		throw new ServiceException(ServiceException.WRONG_DISH_ORDER_STATE);
	}

	public DishOrder submitDishOrder(long employeeId, DishOrder dishOrder)
			throws ServiceException, JsonGenerationException,
			JsonMappingException, IOException {

		DishOrder orgDishOrder = _dishOrderDao.getDishOrderById(dishOrder
				.getId());

		if (orgDishOrder.getState() != DishOrder.STATE_CREATING
				&& orgDishOrder.getState() != DishOrder.STATE_PROCESSING) {
			throw new ServiceException(ServiceException.WRONG_DISH_ORDER_STATE);
		}

		_dishOrderDao.removeDishOrderTags(orgDishOrder);

		DishOrder updatedDishOrder = updateData(orgDishOrder, dishOrder);
		updatedDishOrder.setEditorEmployeeId(employeeId);
		updatedDishOrder.setState(DishOrder.STATE_PROCESSING);
		updatedDishOrder.setPayRecords(new ArrayList<PayRecord>());

		_dishOrderDao.save(updatedDishOrder);

		updatedDishOrder.updateJsonHash();

		return updatedDishOrder;
	}

	public DishOrder submitSelfDishOrder(String openId, DishOrder dishOrder)
			throws ServiceException, JsonGenerationException,
			JsonMappingException, IOException {

		DishOrder orgDishOrder = _dishOrderDao.getDishOrderByOpenId(openId);

		if (orgDishOrder == null) {
			orgDishOrder = createDishOrder(0, 0, openId, 1);
			orgDishOrder.setOpenId(openId);
		}

		_dishOrderDao.removeDishOrderTags(orgDishOrder);

		if (orgDishOrder.getDeskName() == null
				|| orgDishOrder.getDeskName().equals("")) {

			orgDishOrder.setDeskName("");
			if (dishOrder.getDeskName() != null
					&& !dishOrder.getDeskName().equals("")) {
				orgDishOrder.setDeskName(dishOrder.getDeskName());
			}

		}

		orgDishOrder.setStoreId(dishOrder.getStoreId());
		if (orgDishOrder.getState() != DishOrder.STATE_PROCESSING) {
			orgDishOrder.setState(DishOrder.STATE_WAITING);
		}
		if (orgDishOrder.getState() != DishOrder.STATE_WAITING
				&& orgDishOrder.getState() != DishOrder.STATE_PROCESSING) {
			throw new ServiceException(ServiceException.WRONG_DISH_ORDER_STATE);
		}

		DishOrder updatedDishOrder = updateData(orgDishOrder, dishOrder);

		UserAccount ua = _userAccountDao.getUserAccountByOpenId(openId);
		if (ua != null)
			updatedDishOrder.setUserAccountId(ua.getId());
		_dishOrderDao.save(updatedDishOrder);

		return updatedDishOrder;
	}

	private DishOrder updateData(DishOrder orgDishOrder, DishOrder newDishOrder) {

		orgDishOrder.setCustomerCount(newDishOrder.getCustomerCount());
		orgDishOrder.setDiscountRate(newDishOrder.getDiscountRate());
		orgDishOrder.setServiceFeeRate(newDishOrder.getServiceFeeRate());

		if (newDishOrder.getUserAccountId() != null
				&& orgDishOrder.getUserAccountId() == null) {
			orgDishOrder.setUserAccountId(newDishOrder.getUserAccountId());
		}
		if (newDishOrder.getExpectedArriveTime() != null) {
			orgDishOrder.setExpectedArriveTime(newDishOrder
					.getExpectedArriveTime());
		}

		if (newDishOrder.getMemo() != null && !newDishOrder.getMemo().isEmpty()) {
			orgDishOrder.setMemo(newDishOrder.getMemo());
		}

		if (newDishOrder.getDishOrderTags() != null) {
			for (DishOrderTag dot : newDishOrder.getDishOrderTags()) {
				if (dot.getId() == 0) {
					orgDishOrder.getDishOrderTags().add(dot);
				}
			}
		}

		if (newDishOrder.getOrderItems() != null) {
			List<OrderItem> existOrderItems = new ArrayList<OrderItem>();
			if (orgDishOrder.getOrderItems() != null) {
				for (int i = orgDishOrder.getOrderItems().size() - 1; i >= 0; i--) {
					OrderItem oi = orgDishOrder.getOrderItems().get(i);
					if (oi.getState() == OrderItem.STATE_WAITING) {
						orgDishOrder.getOrderItems().remove(oi);
					}
				}
				existOrderItems.addAll(orgDishOrder.getOrderItems());
			}

			for (OrderItem oi : newDishOrder.getOrderItems()) {
				boolean isExisted = false;
				if (existOrderItems.size() == 0) {
					if (oi.getState() == OrderItem.STATE_WAITING) {
						orgDishOrder.getOrderItems().add(oi);
					}
				} else {
					for (OrderItem item : existOrderItems) {
						if (oi.getId() == item.getId()) {
							isExisted = true;
							break;
						}
					}
					if (!isExisted && oi.getState() == OrderItem.STATE_WAITING) {
						orgDishOrder.getOrderItems().add(oi);
					}
				}
				isExisted = false;
			}
		}

		if (newDishOrder.getPayRecords() != null) {
			for (PayRecord pr : newDishOrder.getPayRecords()) {
				if (pr.getId() == 0) {
					orgDishOrder.getPayRecords().add(pr);
				}
			}
		}

		if (newDishOrder.getBookRecordId() != null) {
			orgDishOrder.setBookRecordId(newDishOrder.getBookRecordId());
		}

		if (orgDishOrder.getCustomerCount() == 0
				&& newDishOrder.getCustomerCount() > 0) {
			orgDishOrder.setCustomerCount(newDishOrder.getCustomerCount());
		}

		if ((orgDishOrder.getPrePay() == null || orgDishOrder.getPrePay() == 0)
				&& newDishOrder.getPrePay() != null
				&& newDishOrder.getPrePay() > 0) {
			UserAccount user = _userAccountDao.find(newDishOrder
					.getUserAccountId());
			if (user.getBalance() >= newDishOrder.getPrePay()) {
				user.setBalance(user.getBalance() - newDishOrder.getPrePay());
				orgDishOrder.setPrePay(newDishOrder.getPrePay());

				_balanceOperationLogService.prePayDishOrder(
						newDishOrder.getStoreId(), newDishOrder.getPrePay(),
						user.getId(), orgDishOrder.getId(), user.getBalance());
			}
		}

		updateDishOrderPrice(orgDishOrder);
		return orgDishOrder;
	}

	private void updateDishOrderPrice(DishOrder dishOrder) {

		if (dishOrder.getOrderItems() == null) {
			return;
		}

		if (dishOrder.getState() == DishOrder.STATE_PAID
				|| dishOrder.getState() == DishOrder.STATE_ARCHIVED) {
			return;
		}

		Desk desk = _deskDao.getDeskById(dishOrder.getDeskId());
		boolean chargeVIPFee = desk == null ? false : desk.getChargeVIPFee();

		double totalPrice = 0, discountedPrice = 0;

		double discountRate = dishOrder.getDiscountRate();
		double serviceFeeRate = dishOrder.getServiceFeeRate();

		for (OrderItem oi : dishOrder.getOrderItems()) {

			Dish dish = _dishDao.getDishById(oi.getDishId());
			if (oi.getId() == 0 && dish.getRemain() != null) {
				dish.setRemain(dish.getRemain() - oi.getAmount());
				if (dish.getRemain() < 0) {
					dish.setRemain(0d);
				}
			}
			double dishPrice = dish.getPrice();
			if (oi.getMealDealItemId() != null) {
				MealDealItem md = _mealDealItemDao.find(oi.getMealDealItemId());
				if (md != null) {
					dishPrice = md.getPriceDelta();
				} else
					dishPrice = 0;
			}
			if (chargeVIPFee) {
				dishPrice += dish.getVIPFee();
			}

			double unitRatio = 1;
			boolean unitChanged = false;
			if (oi.getOrgUnit() != null && oi.getOrgUnit().length() > 0
					&& oi.getUnit() != null && oi.getUnit().length() > 0) {
				if (!oi.getOrgUnit().equals(oi.getUnit())) {
					unitChanged = true;
				}
			}
			if (unitChanged) {
				DishUnit orgDishUnit = _dishUnitDao.getDishUnitByName(
						dishOrder.getStoreId(), oi.getOrgUnit());
				DishUnit dishUnit = _dishUnitDao.getDishUnitByName(
						dishOrder.getStoreId(), oi.getUnit());
				if (orgDishUnit != null && dishUnit != null) {
					unitRatio = dishUnit.getExchangeRate()
							/ orgDishUnit.getExchangeRate();
				}
			}
			dishPrice *= unitRatio;
			dishPrice = Math.rint(dishPrice * 10) / 10.0;

			DiscountRule discountRule = null;
			if (oi.getDiscountRuleId() != null) {
				discountRule = _discountRuleDao.find(oi.getDiscountRuleId());
			}

			oi.setDishAlias(dish.getAlias());
			if (!oi.isEditable()) {
				oi.setDishPrice(dishPrice);
			}
			oi.updatePrice(discountRule, discountRate);

			if (oi.getState() != OrderItem.STATE_CANCELLED) {
				totalPrice += oi.getOrgPrice();
				discountedPrice += oi.getPrice();
			}
		}

		totalPrice = Math.rint(totalPrice * 10) / 10.0;
		discountedPrice = Math.rint(discountedPrice * 10) / 10.0;

		dishOrder.setTotalPrice(totalPrice);
		dishOrder.setDiscountedPrice(discountedPrice);

		double serviceFee = discountedPrice * serviceFeeRate;
		serviceFee = Math.rint(serviceFee * 10) / 10.0;
		dishOrder.setServiceFee(serviceFee);

		double finalPrice = discountedPrice + serviceFee;
		if (dishOrder.getPrePay() != null && dishOrder.getPrePay() > 0) {
			finalPrice -= dishOrder.getPrePay();
		}

		finalPrice = Math.round(finalPrice);

		if (finalPrice < 0) {
			finalPrice = 0;
		}
		dishOrder.setFinalPrice(finalPrice);
	}

	public DishOrder payDishOrder(long employeeId, DishOrder dishOrder)
			throws ServiceException {

		DishOrder orgDishOrder = _dishOrderDao.getDishOrderById(dishOrder
				.getId());

		DishOrder updatedDishOrder = updateData(orgDishOrder, dishOrder);
		updatedDishOrder.setState(DishOrder.STATE_PAID);

		Desk desk = _deskDao.getDeskById(dishOrder.getDeskId());
		if (desk != null && desk.getForTesting()) {
			updatedDishOrder.setState(DishOrder.STATE_CANCELLED);
		}

		_dishOrderDao.save(updatedDishOrder);
		updatedDishOrder.updateJsonHash();

		if (updatedDishOrder.getUserAccountId() != null) {
			Store store = _storeDao.find(updatedDishOrder.getStoreId());
			UserAccount user = _userAccountDao.find(updatedDishOrder
					.getUserAccountId());
			double point = 0;
			for (PayRecord pr : updatedDishOrder.getPayRecords()) {
				if (pr.getTypeName().equals("优惠券")) {
					if (!store.getIncludedCouponValueInPoint()) {
						continue;
					}
				}

				point += pr.getAmount() * store.getPointRate();
			}
			user.setPoint(user.getPoint() + point);
			_userAccountDao.save(user);
		}

		return updatedDishOrder;
	}

	public DishOrder applyDiscountRule(long employeeId, long dishOrderId,
			long orderItemId, Long discountRuleId) throws Exception {

		DishOrder dishOrder = _dishOrderDao.getDishOrderById(dishOrderId);
		OrderItem orderItemToApply = null;
		for (OrderItem orderItem : dishOrder.getOrderItems()) {
			if (orderItem.getId() == orderItemId) {
				orderItemToApply = orderItem;
				break;
			}
		}

		if (orderItemToApply == null) {
			throw new Exception("订单项不存在，操作失败.");
		}

		orderItemToApply.setDiscountRuleId(discountRuleId);
		updateDishOrderPrice(dishOrder);

		_dishOrderDao.save(dishOrder);
		dishOrder.updateJsonHash();

		return dishOrder;
	}

	public DishOrder cancelOrderItem(Employee employee, long dishOrderId,
			long orderItemId, double amount, String cancelReason,
			boolean dishSoldOut) throws Exception {

		DishOrder dishOrder = _dishOrderDao.getDishOrderById(dishOrderId);
		OrderItem orderItemToCancel = null;
		for (OrderItem orderItem : dishOrder.getOrderItems()) {
			if (orderItem.getId() == orderItemId) {
				orderItemToCancel = orderItem;
				break;
			}
		}

		if (orderItemToCancel == null) {
			throw new Exception("订单项不存在，操作失败.");
		}

		if (orderItemToCancel.getAmount() <= amount) {

			if (!orderItemToCancel.getNoCookingNote()) {
				_printingService.printCancelOrderItemNote(employee, dishOrder,
						orderItemToCancel);
			}

			orderItemToCancel.setCancelReason(cancelReason);
			orderItemToCancel.setCustomerNotePrinted(false);
			orderItemToCancel.setEmployeeId(employee.getId());
			orderItemToCancel.setEmployeeName(employee.getName());
			orderItemToCancel.setState(OrderItem.STATE_CANCELLED);

			if (orderItemToCancel.getHasMealDealItems()) {
				for (int i = 0; i < dishOrder.getOrderItems().size(); i++) {
					OrderItem orderItem = dishOrder.getOrderItems().get(i);
					if (orderItem.getTriggerId() != null
							&& orderItem.getTriggerId() == orderItemToCancel
									.getId()) {
						orderItem.setCancelReason(cancelReason);
						orderItem.setState(OrderItem.STATE_CANCELLED);
						if (!orderItem.getNoCookingNote()) {
							_printingService.printCancelOrderItemNote(employee,
									dishOrder, orderItem);
						}
					}
				}
			}

		} else if (orderItemToCancel.getAmount() > amount) {
			orderItemToCancel.setAmount(orderItemToCancel.getAmount() - amount);

			OrderItem oi = copyOrderItemFromCancelOrderItem(orderItemToCancel);
			oi.setAmount(amount);
			oi.setCancelReason(cancelReason);
			oi.setEmployeeId(employee.getId());
			oi.setEmployeeName(employee.getName());
			oi.setCustomerNotePrinted(false);
			oi.setDishOrder(dishOrder);
			oi.setState(OrderItem.STATE_CANCELLED);

			dishOrder.getOrderItems().add(oi);

			if (orderItemToCancel.getHasMealDealItems()) {
				for (int i = 0; i < dishOrder.getOrderItems().size(); i++) {
					OrderItem orderItem = dishOrder.getOrderItems().get(i);
					if (orderItem.getTriggerId() != null
							&& orderItem.getTriggerId() == orderItemToCancel
									.getId()) {
						orderItem.setAmount(orderItemToCancel.getAmount());
					}
				}
			}

			if (!oi.getNoCookingNote()) {
				_printingService.printCancelOrderItemNote(employee, dishOrder,
						oi);
			}
		}

		if (dishSoldOut) {
			Dish dish = _dishDao.getDishById(orderItemToCancel.getDishId());
			if (!dish.isEditable()) {
				dish.setSoldOut(true);
			}
		}

		updateDishOrderPrice(dishOrder);
		dishOrder.updateJsonHash();

		_dishOrderDao.save(dishOrder);

		return dishOrder;
	}

	private OrderItem copyOrderItemFromCancelOrderItem(
			OrderItem orderItemToCancel) {
		OrderItem orderItem = new OrderItem();

		orderItem.setId(Utils.generateEntityId());
		orderItem.setAmount(orderItemToCancel.getAmount());
		orderItem.setCreateTime(System.currentTimeMillis());
		orderItem.setCustomerNotePrinted(orderItemToCancel
				.getCustomerNotePrinted());
		orderItem.setDepartmentId(orderItemToCancel.getDepartmentId());
		orderItem.setDeskName(orderItemToCancel.getDeskName());
		if (orderItemToCancel.getDishAlias() != null) {
			orderItem.setDishAlias(orderItemToCancel.getDishAlias());
		}
		orderItem.setDishId(orderItemToCancel.getDishId());
		orderItem.setDishName(orderItemToCancel.getDishName());
		orderItem.setDishPrice(orderItemToCancel.getDishPrice());
		orderItem.setEditable(false);
		if (orderItemToCancel.getEmployeeId() != null) {
			orderItem.setEmployeeId(orderItemToCancel.getEmployeeId());
		}
		orderItem.setNoCooking(orderItemToCancel.getNoCooking());
		orderItem.setNoCookingNote(orderItemToCancel.getNoCookingNote());
		orderItem.setNoCustomerNote(orderItemToCancel.getNoCustomerNote());
		orderItem
				.setNoOverallDiscount(orderItemToCancel.getNoOverallDiscount());
		orderItem.setPrice(orderItemToCancel.getPrice());
		orderItem.setSuspended(orderItemToCancel.isSuspended());
		orderItem.setState(orderItemToCancel.getState());
		orderItem.setUnit(orderItemToCancel.getUnit());
		orderItem.setOrgUnit(orderItemToCancel.getOrgUnit());
		orderItem.setHasMealDealItems(orderItemToCancel.getHasMealDealItems());

		return orderItem;
	}

	@SuppressWarnings("deprecation")
	public DishOrder changeDesk(long employeeId, long dishOrderId,
			long targetDeskId) throws Exception {

		Desk desk = this._deskDao.getDeskById(targetDeskId);
		DishOrder dishOrder = this._dishOrderDao.getDishOrderById(dishOrderId);

		if (dishOrder.getState() == DishOrder.STATE_WAITING) {
			if (dishOrder.getExpectedArriveTime() != null) {
				SimpleDateFormat sdf = new SimpleDateFormat("dd");
				if ((new Date().getDate())
						- Integer.parseInt(sdf.format(dishOrder
								.getExpectedArriveTime())) != 0) {
					throw new Exception("不能恢复不是今天的订单，操作失败.");
				}
			}
			dishOrder.setState(DishOrder.STATE_PROCESSING);
		}

		if (dishOrder.getState() != DishOrder.STATE_PROCESSING) {
			throw new Exception("订单状态已改变，不能转台");
		}

		long orgDeskId = dishOrder.getDeskId();
		dishOrder.setDeskId(targetDeskId);
		dishOrder.setDeskName(desk.getName());
		updateDishOrderPrice(dishOrder);
		_dishOrderDao.save(dishOrder);

		if (orgDeskId == 0) {
			return dishOrder;
		}

		List<OrderItem> oiList = new ArrayList<OrderItem>();

		for (OrderItem orderItem : dishOrder.getOrderItems()) {
			if (orderItem.getState() != OrderItem.STATE_CANCELLED) {
				oiList.add(orderItem);
			}
		}

		_printingService.printChangeDeskNote(employeeId, orgDeskId, dishOrder,
				oiList);

		return dishOrder;
	}

	public DishOrder restoreBookingDishOrder(long employeeId, long dishOrderId)
			throws Exception {

		DishOrder dishOrder = this._dishOrderDao.getDishOrderById(dishOrderId);

		if (dishOrder.getState() != DishOrder.STATE_PROCESSING) {
			throw new Exception("订单状态已改变，不能转台");
		}

		dishOrder.setDeskId(0l);
		dishOrder.setDeskName("");
		dishOrder.setState(DishOrder.STATE_WAITING);
		_dishOrderDao.save(dishOrder);

		return dishOrder;
	}

	public DishOrder mergeDishOrder(long employeeId, long sourceDishOrderId,
			long targetDishOrderId) throws Exception {

		DishOrder sourceDishOrder = this._dishOrderDao
				.getDishOrderById(sourceDishOrderId);
		DishOrder targetDishOrder = this._dishOrderDao
				.getDishOrderById(targetDishOrderId);

		if (sourceDishOrder.getState() != DishOrder.STATE_PROCESSING
				|| targetDishOrder.getState() != DishOrder.STATE_PROCESSING) {
			throw new Exception("订单状态已改变，不能并单");
		}

		_dishOrderDao.updateMergeOrderItemsMemo(sourceDishOrder,
				targetDishOrder);

		_dishOrderDao.updateOrderItemsParent(sourceDishOrderId,
				targetDishOrderId);

		sourceDishOrder = this._dishOrderDao
				.getDishOrderById(sourceDishOrderId);
		targetDishOrder = this._dishOrderDao
				.getDishOrderById(targetDishOrderId);

		sourceDishOrder.setState(DishOrder.STATE_CANCELLED);
		updateDishOrderPrice(sourceDishOrder);
		updateDishOrderPrice(targetDishOrder);

		_dishOrderDao.save(sourceDishOrder);
		_dishOrderDao.save(targetDishOrder);

		return targetDishOrder;
	}

	public DishOrder moveOrderItem(long employeeId, long dishOrderId,
			long orderItemId, long targetDishOrderId) throws Exception {

		DishOrder dishOrder = this._dishOrderDao.getDishOrderById(dishOrderId);
		DishOrder targetDishOrder = _dishOrderDao
				.getDishOrderById(targetDishOrderId);

		OrderItem orderItemToMove = null;
		for (OrderItem orderItem : dishOrder.getOrderItems()) {
			if (orderItem.getId() == orderItemId) {
				orderItemToMove = copyOrderItemFromCancelOrderItem(orderItem);
				dishOrder.getOrderItems().remove(orderItem);
				break;
			}
		}

		if (orderItemToMove == null) {
			throw new Exception("订单项不存在，操作失败.");
		}

		targetDishOrder.getOrderItems().add(orderItemToMove);
		orderItemToMove.setDishOrder(targetDishOrder);

		if (orderItemToMove.getHasMealDealItems()) {
			for (int i = dishOrder.getOrderItems().size() - 1; i >= 0; i--) {
				OrderItem oi = dishOrder.getOrderItems().get(i);
				if (oi.getTriggerId() != null
						&& oi.getTriggerId() == orderItemId) {
					OrderItem item = copyOrderItemFromCancelOrderItem(oi);
					item.setTriggerId(orderItemToMove.getId());
					dishOrder.getOrderItems().remove(oi);
					targetDishOrder.getOrderItems().add(item);
					item.setDishOrder(targetDishOrder);
				}
			}
		}

		updateDishOrderPrice(dishOrder);
		updateDishOrderPrice(targetDishOrder);

		_dishOrderDao.save(dishOrder);
		_dishOrderDao.save(targetDishOrder);

		_operationLogService.moveOrderItem(employeeId, dishOrder,
				orderItemToMove.getId(), targetDishOrderId);

		return dishOrder;
	}

	public List<DishOrder> getDishOrderList(long storeId,
			String dishOrderBriefId, boolean isSearchBookingDishOrder,
			boolean isSearchBookingDishOrderByDate) {

		if (isSearchBookingDishOrder) {
			List<DishOrder> dishOrdersToReturn = new ArrayList<DishOrder>();
			if (!dishOrderBriefId.equals("0")) {
				UserAccount user = _userAccountDao.getMemberByPhoneOrCardNo(
						dishOrderBriefId, storeId);
				if (user == null) {
					if (isSearchBookingDishOrderByDate) {
						return this.getDishOrderListByTimeRange(
								dishOrderBriefId, storeId);
					}
					return new ArrayList<DishOrder>();
				}
				List<DishOrder> dishOrders = this._dishOrderDao
						.getDishOrderListByStoreIdAndUserAccountIdAndDishOrderState(
								storeId, user.getId(), DishOrder.STATE_WAITING);

				dishOrdersToReturn = this
						.filterBookDishOrders(dishOrders, null);
				return dishOrdersToReturn;
			}

			List<DishOrder> dishOrders = this._dishOrderDao
					.getDishOrderListByStoreIdAndDishOrderState(storeId,
							DishOrder.STATE_WAITING);
			dishOrdersToReturn = this.filterBookDishOrders(dishOrders, null);

			return dishOrdersToReturn;
		}
		if (!dishOrderBriefId.equals("0")) {
			return this._dishOrderDao
					.getDishOrderListExceptStateAchivedByDishOrderBriefId(
							storeId, dishOrderBriefId);
		}

		return this._dishOrderDao.getDishOrderListByStoreIdAndDishOrderState(
				storeId, DishOrder.STATE_PAID);
	}

	public List<DishOrder> getDishOrderListByTimeRange(String inputBriefId,
			long storeId) {
		List<DishOrder> dishOrdersToReturn = new ArrayList<DishOrder>();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		try {
			long startTime = sdf.parse(inputBriefId).getTime();
			long endTime = startTime + 24 * 60 * 60 * 1000;
			List<DishOrder> dishOrders = this._dishOrderDao
					.getDishOrderListByStoreIdAndTimeState(storeId,
							DishOrder.STATE_WAITING, startTime, endTime);
			dishOrdersToReturn = this.filterBookDishOrders(dishOrders, null);
		} catch (ParseException e) {
		}
		return dishOrdersToReturn;
	}

	public List<DishOrder> filterBookDishOrders(List<DishOrder> dishOrders,
			List<BookRecord> bookRecords) {
		List<DishOrder> orders = new ArrayList<DishOrder>();
		for (DishOrder order : dishOrders) {
			if (order.getBookRecordId() != null && order.getBookRecordId() != 0) {
				BookRecord bookRecord = null;
				if (bookRecords != null) {
					for (BookRecord br : bookRecords) {
						if (br.getId() == order.getBookRecordId()) {
							bookRecord = br;
							break;
						}
					}
				}

				if (bookRecord == null) {
					bookRecord = _bookRecordDao.getBookRecordById(order
							.getBookRecordId());
				}

				if (bookRecord != null) {
					if (bookRecord.getState() != BookRecord.RESERVATION_CONFIRMED) {
						continue;
					}
					order.setBookRecord(bookRecord);
				}
			}
			orders.add(order);
		}
		return orders;
	}

	public boolean restoreDishOrder(long dishOrderId, long employeeId) {
		try {
			DishOrder dishOrder = this._dishOrderDao
					.getDishOrderById(dishOrderId);
			if (dishOrder.getState() != DishOrder.STATE_PAID) {
				return false;
			}

			List<PayRecord> payRecords = dishOrder.getPayRecords();
			PayRecord balancePayRecord = null;
			if (payRecords != null && payRecords.size() > 0) {
				for (PayRecord payRecord : payRecords) {
					if (payRecord.getPaymentTypeId() == 0) {
						balancePayRecord = payRecord;
						break;
					}
				}
			}

			if (balancePayRecord != null) {
				UserAccount member = _userAccountDao.find(dishOrder
						.getUserAccountId());
				if (member != null) {
					member.setBalance(member.getBalance()
							+ balancePayRecord.getAmount());

					_balanceOperationLogService.returnUsedBalance(
							dishOrder.getStoreId(), employeeId, dishOrderId,
							balancePayRecord.getAmount(), member.getId(),
							member.getBalance());
					_userAccountDao.save(member);
				}
			}

			_dishOrderDao.restoreDishOrder(dishOrder);
		} catch (Exception e) {
			return false;
		}
		return true;
	}

	public boolean shiftClass(long employeeId, long storeId) {
		return _dishOrderDao.shiftClass(employeeId, storeId);
	}

	public DishOrder updateCustomerCount(long employeeId, long dishOrderId,
			int customerCount) {
		DishOrder dishOrder = _dishOrderDao.getDishOrderById(dishOrderId);
		dishOrder.setCustomerCount(customerCount);
		List<OrderItem> orderItems = dishOrder.getOrderItems();

		if (orderItems.size() > 0) {
			for (OrderItem oi : orderItems) {
				Dish dish = _dishDao.getDishById(oi.getDishId());
				if (dish.isAutoOrder() && dish.getAmountPerCustomer() > 0) {
					oi.setAmount(dish.getAmountPerCustomer() * customerCount);
				}
			}
		}

		updateDishOrderPrice(dishOrder);
		return _dishOrderDao.save(dishOrder);
	}

	public DishOrder getDishOrderByOpenId(String openId) {
		return _dishOrderDao.getDishOrderByOpenId(openId);
	}

	public List<DishOrder> getSelfDishOrderByStoreId(long storeId,
			List<BookRecord> bookRecords) {
		List<DishOrder> dishOrdersToReturn = new ArrayList<DishOrder>();
		List<DishOrder> dishOrders = _dishOrderDao
				.getSelfDishOrderByStoreI(storeId);

		for (DishOrder dishOrder : dishOrders) {
			if (dishOrder.getExpectedArriveTime() != null) {
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
				long todayTime = 0;
				try {
					todayTime = sdf.parse(
							sdf.format(System.currentTimeMillis())).getTime();
				} catch (ParseException e) {
					todayTime = System.currentTimeMillis();
				}
				long endTime = todayTime + 24 * 60 * 60 * 1000;

				if (dishOrder.getExpectedArriveTime() < todayTime
						|| dishOrder.getExpectedArriveTime() > endTime) {
					continue;
				}
			}
			dishOrdersToReturn.add(dishOrder);
		}

		dishOrdersToReturn = this.filterBookDishOrders(dishOrdersToReturn,
				bookRecords);

		return dishOrdersToReturn;
	}

	public List<DishOrder> getBookingDishOrderByUserId(long customerUserId) {
		return _dishOrderDao.getBookingDishOrderByUserId(customerUserId);
	}

	public DishOrder changeDiscountRateOrServiceFeeRate(DishOrder newDishOrder) {

		if (newDishOrder == null)
			return null;

		DishOrder orgDishOrder = _dishOrderDao.getDishOrderById(newDishOrder
				.getId());

		DishOrder updatedDishOrder = updateData(orgDishOrder, newDishOrder);

		updateDishOrderPrice(updatedDishOrder);

		return _dishOrderDao.save(updatedDishOrder);
	}

	public List<DishOrder> loadMyDishOrders(long employeeId) {

		List<DishOrder> orders = _dishOrderDao
				.getDishOrderByEmployeeId(employeeId);
		return orders;
	}
}

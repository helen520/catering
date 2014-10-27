package helen.catering.controller;

import helen.catering.model.FinanceStat;
import helen.catering.model.entities.Coupon;
import helen.catering.model.entities.DishOrder;
import helen.catering.model.entities.OrderItem;
import helen.catering.model.entities.PayRecord;
import helen.catering.model.entities.UserAccount;
import helen.catering.service.BalanceOperationLogService;
import helen.catering.service.CouponOperationLogService;
import helen.catering.service.DishOrderPrintingService;
import helen.catering.service.OperationLogService;
import helen.catering.service.OrderingService;
import helen.catering.service.ReportingService;
import helen.catering.service.ServiceException;
import helen.catering.service.UserService;

import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("ordering")
public class OrderingController {

	@Autowired
	OrderingService _orderingService;

	@Autowired
	OperationLogService _operationLogService;

	@Autowired
	BalanceOperationLogService _balanceOperationLogService;

	@Autowired
	DishOrderPrintingService _dishOrderPrintingService;

	@Autowired
	UserService _userService;

	@Autowired
	ReportingService _reportingService;

	@Autowired
	CouponOperationLogService _couponOperationLogService;

	@ResponseBody
	@RequestMapping("getDishOrderById")
	public DishOrder getDishOrderById(@RequestParam long dishOrderId) {
		return _orderingService.getDishOrderById(dishOrderId);
	}

	@ResponseBody
	@RequestMapping("updateCustomerCount")
	public DishOrder updateCustomerCount(@RequestParam long employeeId,
			@RequestParam long dishOrderId, @RequestParam int customerCount)
			throws ServiceException {
		_userService.AssertEmployeeAuth(employeeId);
		DishOrder result = _orderingService.updateCustomerCount(employeeId,
				dishOrderId, customerCount);
		_operationLogService.updateCustomerCount(employeeId, result,
				customerCount);
		return result;
	}

	@ResponseBody
	@RequestMapping("createDishOrder")
	public DishOrder createDishOrder(@RequestParam long employeeId,
			@RequestParam long deskId, @RequestParam String serialNumber,
			@RequestParam int customerCount) throws ServiceException {
		_userService.AssertEmployeeAuth(employeeId);
		DishOrder result = _orderingService.createDishOrder(employeeId, deskId,
				serialNumber, customerCount);
		_operationLogService.createDishOrder(employeeId, result, deskId,
				customerCount);
		return result;
	}

	@ResponseBody
	@RequestMapping("cancelDishOrder")
	public DishOrder cancelDishOrder(@RequestParam long employeeId,
			@RequestParam long dishOrderId) throws ServiceException {
		_userService.AssertEmployeeAuth(employeeId);
		DishOrder result = _orderingService.cancelDishOrder(employeeId,
				dishOrderId);
		_operationLogService.cancelDishOrder(employeeId, result);
		return result;
	}

	// TODO implement exception to ServiceException
	@ResponseBody
	@RequestMapping("submitDishOrder")
	public DishOrder submitDishOrder(@RequestParam long employeeId,
			@RequestParam(required = false) Long printerId,
			@RequestParam String dishOrderJsonText) throws Exception {
		_userService.AssertEmployeeAuth(employeeId);
		DishOrder dishOrder = DishOrder.fromJsonText(dishOrderJsonText);
		DishOrder resultDishOrder = _orderingService.submitDishOrder(
				employeeId, dishOrder);
		_dishOrderPrintingService.printDishOrder(employeeId,
				resultDishOrder.getId(), printerId);
		_operationLogService.submitDishOrder(employeeId, dishOrder);
		return resultDishOrder;
	}

	// TODO implement exception to ServiceException
	@ResponseBody
	@RequestMapping("payDishOrder")
	public DishOrder payDishOrder(@RequestParam long employeeId,
			@RequestParam String dishOrderJsonText) throws Exception {
		_userService.AssertEmployeeAuth(employeeId);
		DishOrder dishOrder = DishOrder.fromJsonText(dishOrderJsonText);

		DishOrder orgDishOrder = _orderingService.getDishOrderById(dishOrder
				.getId());

		if (orgDishOrder == null) {
			orgDishOrder = _orderingService.createDishOrder(employeeId,
					dishOrder.getDeskId(), dishOrder.getSerialNumber(),
					dishOrder.getCustomerCount());
			_operationLogService.createDishOrder(employeeId, orgDishOrder,
					dishOrder.getDeskId(), dishOrder.getCustomerCount());
			dishOrder.setId(orgDishOrder.getId());
		}

		if (orgDishOrder.getState() == DishOrder.STATE_PAID)
			return null;

		DishOrder resultDishOrder = _orderingService.payDishOrder(employeeId,
				dishOrder);
		_dishOrderPrintingService
				.printCheckoutNote(employeeId, resultDishOrder);
		_operationLogService.payDishOrder(employeeId, dishOrder);

		return resultDishOrder;
	}

	@ResponseBody
	@RequestMapping("applyDiscountRule")
	public DishOrder applyDiscountRule(@RequestParam long employeeId,
			@RequestParam long dishOrderId, @RequestParam long orderItemId,
			@RequestParam(required = false) Long discountRuleId)
			throws Exception {
		_userService.AssertEmployeeAuth(employeeId);
		DishOrder result = _orderingService.applyDiscountRule(employeeId,
				dishOrderId, orderItemId, discountRuleId);
		OrderItem orderItem = _orderingService.getOrderItemById(orderItemId);
		_operationLogService.applyDiscountRule(employeeId, result, orderItem,
				discountRuleId);

		return result;
	}

	@ResponseBody
	@RequestMapping("cancelOrderItem")
	@Secured("ROLE_ADMIN")
	public DishOrder cancelOrderItem(@RequestParam long employeeId,
			@RequestParam long dishOrderId, @RequestParam long orderItemId,
			@RequestParam double amount, @RequestParam String cancelReason,
			@RequestParam boolean dishSoldOut) throws Exception {
		_userService.AssertEmployeeAuth(employeeId);

		DishOrder result = _orderingService.cancelOrderItem(employeeId,
				dishOrderId, orderItemId, amount, cancelReason, dishSoldOut);
		_operationLogService.cancelOrderItem(employeeId, result, orderItemId,
				cancelReason, amount);

		return result;
	}

	@ResponseBody
	@RequestMapping("changeDesk")
	public DishOrder changeDesk(@RequestParam long employeeId,
			@RequestParam long dishOrderId, @RequestParam long targetDeskId)
			throws Exception {
		_userService.AssertEmployeeAuth(employeeId);
		DishOrder result = this._orderingService.changeDesk(employeeId,
				dishOrderId, targetDeskId);
		_operationLogService.changeDesk(employeeId, result, targetDeskId);
		return result;
	}

	@ResponseBody
	@RequestMapping("restoreBookingDishOrder")
	public DishOrder restoreBookingDishOrder(@RequestParam long employeeId,
			@RequestParam long dishOrderId, @RequestParam long storeId)
			throws Exception {
		_userService.AssertEmployeeAuth(employeeId);
		DishOrder result = this._orderingService.restoreBookingDishOrder(
				employeeId, dishOrderId);
		_operationLogService.restoreBookingDishOrder(employeeId, result);
		return result;
	}

	@ResponseBody
	@RequestMapping("mergeDishOrder")
	public DishOrder mergeDishOrder(@RequestParam long employeeId,
			@RequestParam long sourceDishOrderId,
			@RequestParam long targetDishOrderId) throws Exception {
		_userService.AssertEmployeeAuth(employeeId);
		DishOrder targetDishOrder = this._orderingService.mergeDishOrder(
				employeeId, sourceDishOrderId, targetDishOrderId);
		_operationLogService.mergeDishOrder(employeeId, sourceDishOrderId,
				targetDishOrder);
		return targetDishOrder;
	}

	@ResponseBody
	@RequestMapping("moveOrderItem")
	public DishOrder moveOrderItem(@RequestParam long employeeId,
			@RequestParam long dishOrderId, @RequestParam long orderItemId,
			@RequestParam long targetDishOrderId) throws Exception {
		_userService.AssertEmployeeAuth(employeeId);
		DishOrder result = this._orderingService.moveOrderItem(employeeId,
				dishOrderId, orderItemId, targetDishOrderId);
		return result;
	}

	@ResponseBody
	@RequestMapping("getDishOrderList")
	public List<DishOrder> getDishOrderList(
			@RequestParam long storeId,
			@RequestParam String dishOrderBriefId,
			@RequestParam(required = false, defaultValue = "false") boolean isSearchBookingDishOrder,
			@RequestParam(required = false, defaultValue = "false") boolean isSearchBookingDishOrderByDate) {
		return this._orderingService.getDishOrderList(storeId,
				dishOrderBriefId, isSearchBookingDishOrder,
				isSearchBookingDishOrderByDate);
	}

	@ResponseBody
	@RequestMapping("restoreDishOrder")
	public boolean restoreDishOrder(@RequestParam long dishOrderId,
			@RequestParam long employeeId) throws Exception {
		_userService.AssertEmployeeAuth(employeeId);

		DishOrder dishOrder = _orderingService.getDishOrderById(dishOrderId);
		StringWriter dishOrderJson = new StringWriter();
		ObjectMapper objectMapper = new ObjectMapper();

		objectMapper.writeValue(dishOrderJson, dishOrder);
		boolean isSuccessed = this._orderingService.restoreDishOrder(
				dishOrderId, employeeId);
		_operationLogService.restoreDishOrder(dishOrder, employeeId,
				isSuccessed, dishOrderJson);
		return isSuccessed;
	}

	@ResponseBody
	@RequestMapping("prePrintCheckoutBill")
	public boolean prePrintCheckoutBill(@RequestParam long employeeId,
			@RequestParam String dishorderJsonStr) throws ServiceException {
		_userService.AssertEmployeeAuth(employeeId);
		try {
			DishOrder dishOrder = DishOrder.fromJsonText(dishorderJsonStr);
			return _dishOrderPrintingService.prePrintCheckoutBill(employeeId,
					dishOrder);
		} catch (Exception e) {
			return false;
		}
	}

	@ResponseBody
	@RequestMapping("reprintCustomerNote")
	public void reprintCustomerNote(@RequestParam long dishOrderId,
			@RequestParam Long printerId) throws Exception {
		_dishOrderPrintingService.reprintCustomerNote(printerId, dishOrderId);
	}

	@ResponseBody
	@RequestMapping("printCustomerNote")
	public DishOrder printCustomerNote(@RequestParam long dishOrderId,
			@RequestParam long employeeId, @RequestParam Long printerId) {
		try {
			_dishOrderPrintingService.printCustomerNoter(employeeId,
					dishOrderId, printerId);
			return _orderingService.getDishOrderById(dishOrderId);
		} catch (Exception e) {
			return null;
		}
	}

	@ResponseBody
	@RequestMapping("shiftClass")
	public boolean shiftClass(@RequestParam long employeeId,
			@RequestParam long storeId) throws Exception {
		_userService.AssertEmployeeAuth(employeeId);
		FinanceStat financeStat = _reportingService
				.getCurrentClassFinanceStat(storeId);
		_reportingService.setMaterialRecordOnShiftClass(storeId);
		boolean isSuccessed = this._orderingService.shiftClass(employeeId,
				storeId);
		if (isSuccessed) {
			_dishOrderPrintingService.printShiftClassNote(employeeId, storeId,
					financeStat);
		}
		return isSuccessed;
	}

	// TODO: need employeeId
	@ResponseBody
	@RequestMapping("updateCouponsState")
	public boolean updateCouponsState(
			@RequestParam String couponRecordsJsonText,
			@RequestParam(required = false, defaultValue = "0") Long memberId,
			@RequestParam(required = false, defaultValue = "0") Long dishOrderId,
			@RequestParam long employeeId, @RequestParam long storeId) {
		List<PayRecord> payRecords = PayRecord
				.fromJsonText(couponRecordsJsonText);
		List<Coupon> couponsToUsing = new ArrayList<Coupon>();
		for (PayRecord payRecord : payRecords) {
			if (payRecord.getCouponId() != null) {
				Coupon coupon = _userService.getCouponsById(payRecord
						.getCouponId());

				if (coupon.getState() == Coupon.STATE_ENABLED) {
					coupon.setState(Coupon.STATE_DISABLED);
					couponsToUsing.add(coupon);
				} else {
					return false;
				}
			} else if (payRecord.getPaymentTypeId() != null
					&& payRecord.getPaymentTypeId() == 0 && memberId != 0) {
				UserAccount member = _userService.find(memberId);
				if (member == null
						|| member.getBalance() - payRecord.getAmount() < 0) {
					return false;
				}
				member.setBalance(member.getBalance() - payRecord.getAmount());
				_userService.saveUser(member);
				_balanceOperationLogService.usingBalanceForDishOrder(storeId,
						employeeId, dishOrderId, payRecord.getAmount(),
						memberId, member.getBalance());
			}
		}

		for (Coupon coupon : couponsToUsing) {
			_userService.saveCoupon(coupon);
			_couponOperationLogService.usingCoupon(storeId, employeeId,
					coupon.getUserAccount(), coupon);
		}
		return true;
	}

	@ResponseBody
	@RequestMapping("changeDiscountRateOrServiceFeeRate")
	public DishOrder changeDiscountRateOrServiceFeeRate(
			@RequestParam long employeeId,
			@RequestParam String dishOrderJsonText) throws Exception {
		_userService.AssertEmployeeAuth(employeeId);

		DishOrder dishOrder = DishOrder.fromJsonText(dishOrderJsonText);
		return _orderingService.changeDiscountRateOrServiceFeeRate(dishOrder);
	}

	@ResponseBody
	@RequestMapping("loadMyDishOrders")
	public List<DishOrder> loadMyDishOrders(@RequestParam long employeeId)
			throws Exception {
		_userService.AssertEmployeeAuth(employeeId);
		return _orderingService.loadMyDishOrders(employeeId);
	}

}

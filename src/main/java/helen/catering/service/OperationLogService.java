package helen.catering.service;

import helen.catering.dao.DiscountRuleDao;
import helen.catering.dao.DishOrderDao;
import helen.catering.dao.EmployeeDao;
import helen.catering.dao.OperationLogDao;
import helen.catering.model.entities.DiscountRule;
import helen.catering.model.entities.DishOrder;
import helen.catering.model.entities.Employee;
import helen.catering.model.entities.OperationLog;
import helen.catering.model.entities.OrderItem;

import java.io.StringWriter;
import java.util.List;

import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class OperationLogService {

	ObjectMapper objectMapper = new ObjectMapper();

	@Autowired
	OperationLogDao _operationLogDao;

	@Autowired
	DishOrderDao _dishOrderDao;

	@Autowired
	DiscountRuleDao _discountRuleDao;

	@Autowired
	EmployeeDao _employeeDao;

	public void cancelDishOrder(long employeeId, DishOrder dishOrder) {
		try {
			OperationLog opl = new OperationLog();
			opl.setOperationType(OperationLog.OP_CANCEL_DISHORDER);
			opl.setCreateTime(System.currentTimeMillis());
			opl.setStoreId(dishOrder.getStoreId());
			opl.setOperatorEmployeeId(employeeId);
			opl.setDishOrderId(dishOrder.getId());
			_operationLogDao.save(opl);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void createDishOrder(long employeeId, DishOrder dishOrder,
			long deskId, int customerCount) {
		try {
			OperationLog opl = new OperationLog();
			opl.setOperationType(OperationLog.OP_CREATE_DISHORDER);
			opl.setCreateTime(System.currentTimeMillis());
			opl.setStoreId(dishOrder.getStoreId());
			opl.setDishOrderId(dishOrder.getId());
			opl.setOperatorEmployeeId(employeeId);
			opl.setDataSnapShot("{diskId:" + deskId + ",customerCount:"
					+ customerCount + "}");
			_operationLogDao.save(opl);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void submitDishOrder(long employeeId, DishOrder dishOrder) {
		try {
			OperationLog opl = new OperationLog();
			opl.setOperationType(OperationLog.OP_SUBMIT_DISHORDER);
			opl.setCreateTime(System.currentTimeMillis());
			opl.setStoreId(dishOrder.getStoreId());
			opl.setOperatorEmployeeId(employeeId);
			opl.setDishOrderId(dishOrder.getId());
			opl.setDataSnapShot(objectMapper.writeValueAsString(dishOrder));
			_operationLogDao.save(opl);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void payDishOrder(long employeeId, DishOrder dishOrder) {
		try {
			OperationLog opl = new OperationLog();
			opl.setOperationType(OperationLog.OP_PAY_DISHORDER);
			opl.setCreateTime(System.currentTimeMillis());
			opl.setStoreId(dishOrder.getStoreId());
			opl.setOperatorEmployeeId(employeeId);
			opl.setDishOrderId(dishOrder.getId());
			opl.setDataSnapShot(objectMapper.writeValueAsString(dishOrder));
			_operationLogDao.save(opl);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void applyDiscountRule(long employeeId, DishOrder dishOrder,
			long orderItemId, Long discountRuleId) {
		try {
			DiscountRule discountRule = null;
			if (discountRuleId != null) {
				discountRule = _discountRuleDao.find(discountRuleId);
			}
			OrderItem oi = _dishOrderDao.getOrderItemById(orderItemId);
			Employee employee = _employeeDao.find(employeeId);

			OperationLog opl = new OperationLog();
			opl.setOperationType(OperationLog.OP_APPLY_DISCOUNT_RULE);
			opl.setCreateTime(System.currentTimeMillis());
			opl.setStoreId(dishOrder.getStoreId());
			opl.setOperatorEmployeeId(employeeId);
			opl.setDishOrderId(dishOrder.getId());
			opl.setOrderItemId(orderItemId);
			opl.setDataSnapShot(discountRuleId + "");
			if (oi != null && employee != null) {
				String text = "菜品优惠 菜名:" + oi.getDishName() + ",优惠名称: ";
				if (discountRule != null) {
					text += discountRule.getName() + ",折扣率:"
							+ discountRule.getDiscountRate() + ",抵扣金额:"
							+ discountRule.getValue();
				} else
					text += "撤销优惠!";
				text += ",单号:" + dishOrder.getId() + ",操作:"
						+ employee.getName();

				opl.setText(text);
			}
			_operationLogDao.save(opl);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void cancelOrderItem(long employeeId, DishOrder dishOrder,
			long orderItemId, String cancelReason, double amount) {
		try {

			OrderItem orderItemToCancel = _dishOrderDao
					.getOrderItemById(orderItemId);
			Employee employee = _employeeDao.find(employeeId);

			OperationLog opl = new OperationLog();
			opl.setOperationType(OperationLog.OP_CANCEL_ORDERITEM);
			opl.setCreateTime(System.currentTimeMillis());
			opl.setStoreId(dishOrder.getStoreId());
			opl.setOperatorEmployeeId(employeeId);
			opl.setDishOrderId(dishOrder.getId());
			opl.setOrderItemId(orderItemId);
			opl.setDataSnapShot(cancelReason);
			if (orderItemToCancel != null && employee != null
					&& dishOrder != null) {
				opl.setText("取消菜品 菜名:" + orderItemToCancel.getDishName()
						+ ",数量" + amount + ",原因:" + cancelReason + ",单号:"
						+ dishOrder.getId() + ",操作:" + employee.getName());
			}
			_operationLogDao.save(opl);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void changeDesk(long employeeId, DishOrder dishOrder,
			long targetDeskId) {
		try {
			OperationLog opl = new OperationLog();
			opl.setOperationType(OperationLog.OP_CHANGE_DESK);
			opl.setCreateTime(System.currentTimeMillis());
			opl.setStoreId(dishOrder.getStoreId());
			opl.setOperatorEmployeeId(employeeId);
			opl.setDishOrderId(dishOrder.getId());
			opl.setDataSnapShot("{targetDeskId:" + targetDeskId + "}");
			_operationLogDao.save(opl);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void mergeDishOrder(long employeeId, long sourceDishOrderId,
			DishOrder targetDishOrder) {
		try {

			DishOrder sourceDishOrder = _dishOrderDao
					.getDishOrderById(sourceDishOrderId);
			Employee employee = _employeeDao.find(employeeId);

			OperationLog opl = new OperationLog();
			opl.setOperationType(OperationLog.OP_MERGE_DESK);
			opl.setCreateTime(System.currentTimeMillis());
			opl.setStoreId(targetDishOrder.getStoreId());
			opl.setOperatorEmployeeId(employeeId);
			opl.setDishOrderId(targetDishOrder.getId());
			opl.setDataSnapShot("{sourceDishOrderId:" + sourceDishOrderId
					+ "targetDishOrderId:" + targetDishOrder.getId() + "}");
			if (sourceDishOrder != null && targetDishOrder != null
					&& employee != null) {
				opl.setText("合并订单 把" + sourceDishOrder.getDeskName() + "合并到"
						+ targetDishOrder.getDeskName() + ",操作:"
						+ employee.getName());

			}
			_operationLogDao.save(opl);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void moveOrderItem(long employeeId, DishOrder dishOrder,
			long orderItemId, long targetDishOrderId) {
		try {
			DishOrder targetDishOrder = _dishOrderDao
					.getDishOrderById(targetDishOrderId);
			OrderItem orderItemToMove = _dishOrderDao
					.getOrderItemById(orderItemId);
			Employee employee = _employeeDao.find(employeeId);

			OperationLog opl = new OperationLog();
			opl.setOperationType(OperationLog.OP_CHANGE_ORDERITEM);
			opl.setCreateTime(System.currentTimeMillis());
			opl.setStoreId(dishOrder.getStoreId());
			opl.setOperatorEmployeeId(employeeId);
			opl.setDishOrderId(dishOrder.getId());
			opl.setOrderItemId(orderItemId);
			opl.setDataSnapShot("{targetDishOrderId:" + targetDishOrderId + "}");
			if (dishOrder != null && targetDishOrder != null
					&& orderItemToMove != null && employee != null) {
				opl.setText("菜品转台 菜名:" + orderItemToMove.getDishName() + ",由"
						+ dishOrder.getDeskName() + "转到"
						+ targetDishOrder.getDeskName() + ",操作:"
						+ employee.getName());
			}
			_operationLogDao.save(opl);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void updateCustomerCount(long employeeId, DishOrder dishOrder,
			int customerCount) {
		try {
			OperationLog opl = new OperationLog();
			opl.setOperationType(OperationLog.OP_UPDATE_CUSTOMER_COUNT);
			opl.setCreateTime(System.currentTimeMillis());
			opl.setStoreId(dishOrder.getStoreId());
			opl.setOperatorEmployeeId(employeeId);
			opl.setDishOrderId(dishOrder.getId());
			opl.setDataSnapShot("{customerCount:" + customerCount + "}");
			_operationLogDao.save(opl);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void restoreBookingDishOrder(long employeeId, DishOrder dishOrder) {
		try {
			Employee employee = _employeeDao.find(employeeId);

			OperationLog opl = new OperationLog();
			opl.setOperationType(OperationLog.OP_RESTORE_BOOKING_DISHORDER);
			opl.setCreateTime(System.currentTimeMillis());
			opl.setStoreId(dishOrder.getStoreId());
			opl.setDishOrderId(dishOrder.getId());
			opl.setOperatorEmployeeId(employeeId);
			opl.setDataSnapShot("{bookingDishOrderId:" + dishOrder.getId()
					+ "}");
			if (employee != null && dishOrder != null) {
				opl.setText("还原预定订单 " + dishOrder.toString() + ",操作:"
						+ employee.getName());
			}
			_operationLogDao.save(opl);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void restoreDishOrder(DishOrder dishOrder, long employeeId,
			boolean isSuccessed, StringWriter dishOrderJson) {
		try {
			Employee employee = _employeeDao.find(employeeId);

			OperationLog opl = new OperationLog();
			opl.setOperationType(OperationLog.OP_RESTORE_DISHORDER);
			opl.setCreateTime(System.currentTimeMillis());
			opl.setStoreId(dishOrder.getStoreId());
			opl.setOperatorEmployeeId(employeeId);
			opl.setDishOrderId(dishOrder.getId());
			opl.setDataSnapShot("{dishOrder:" + dishOrderJson + ",isSuccessed:"
					+ isSuccessed + "}");
			if (employee != null && dishOrder != null) {
				opl.setText("恢复订单 " + dishOrder.toString() + ",原价:"
						+ dishOrder.getTotalPrice() + ",折扣率:"
						+ dishOrder.getDiscountRate() + ",应收:"
						+ dishOrder.getFinalPrice() + ",付款方式:"
						+ dishOrder.payRecordsText() + ",操作:"
						+ employee.getName());
			}
			_operationLogDao.save(opl);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public List<OperationLog> getdishOrderOperationLogsByStoreIdAndTime(
			long storeId, long startTimeLong, long endTimeLong) {
		return _operationLogDao.getdishOrderOperationLogsByStoreIdAndTime(
				storeId, startTimeLong, endTimeLong);
	}
}

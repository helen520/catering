package helen.catering;

import helen.catering.model.DepartmentStat;
import helen.catering.model.FinanceStat;
import helen.catering.model.PaymentStat;
import helen.catering.model.entities.Department;
import helen.catering.model.entities.Dish;
import helen.catering.model.entities.DishOrder;
import helen.catering.model.entities.OrderItem;
import helen.catering.model.entities.PayRecord;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class FinanceStatHelper {
	public static FinanceStat generateFinanceStat(
			List<Department> departmentList, List<Dish> dishList,
			List<DishOrder> dishOrderList) {

		FinanceStat fs = new FinanceStat();

		fs.setDishOrderCount(dishOrderList.size());

		fs.setDishOrders(dishOrderList);

		for (DishOrder dishOrder : dishOrderList) {

			fs.setTotalPrice(fs.getTotalPrice() + dishOrder.getTotalPrice());
			fs.setTotalDiscountedPrice(fs.getTotalDiscountedPrice()
					+ dishOrder.getDiscountedPrice());
			fs.setTotalServiceFee(fs.getTotalServiceFee()
					+ dishOrder.getServiceFee());
			fs.setCustomerCount(fs.getCustomerCount()
					+ dishOrder.getCustomerCount());
		}

		List<DepartmentStat> departmentStatList = generateDepartmentStats(
				departmentList, dishList, dishOrderList);
		fs.setDepartmentStats(departmentStatList);

		List<PaymentStat> paymentStatList = generatePaymentStats(dishOrderList);
		fs.setPaymentStats(paymentStatList);

		for (PaymentStat paymentStat : paymentStatList) {
			fs.setSumOfPayRecordAmount(fs.getSumOfPayRecordAmount()
					+ paymentStat.getTransferedAmount());
			fs.setTotalActualPaid(fs.getTotalActualPaid()
					+ paymentStat.getTotalAmount());
		}

		return fs;
	}

	private static List<DepartmentStat> generateDepartmentStats(
			List<Department> departmentList, List<Dish> dishList,
			List<DishOrder> dishOrderList) {

		HashMap<Long, Dish> dishByIDMap = new HashMap<Long, Dish>();
		for (Dish dish : dishList) {
			dishByIDMap.put(dish.getId(), dish);
		}

		List<DepartmentStat> departmentStatList = new ArrayList<DepartmentStat>();

		int totalOrderItemCount = 0;
		double sumOfTotalOrgPrice = 0;
		double sumOfTotalDiscountedPrice = 0;
		double sumOfTotalServiceFee = 0;
		double sumOfTotalCouponValue = 0;
		double sumOfTotalFinalPrice = 0;

		HashMap<Long, DishOrder> dishOrderByIDMap = new HashMap<Long, DishOrder>();
		for (DishOrder dishOrder : dishOrderList) {
			dishOrderByIDMap.put(dishOrder.getId(), dishOrder);
		}

		for (Department department : departmentList) {
			List<OrderItem> orderItemList = new ArrayList<OrderItem>();

			for (DishOrder dishOrder : dishOrderList) {
				for (OrderItem oi : dishOrder.getOrderItems()) {
					long oiDepartmentID = oi.getDepartmentId();

					Dish dish = dishByIDMap.get(oi.getDishId());
					if (dish != null) {
						oiDepartmentID = dish.getDepartmentId();
					}
					if (oiDepartmentID == department.getId()
							&& oi.getState() != OrderItem.STATE_CANCELLED) {
						orderItemList.add(oi);
					}
				}
			}

			DepartmentStat ds = new DepartmentStat();

			ds.setDepartmentName(department.getName());
			ds.setOrderItemCount(orderItemList.size());

			for (OrderItem oi : orderItemList) {
				DishOrder dishOrder = oi.getDishOrder();
				if (dishOrder == null) {
					continue;
				}

				ds.setTotalOrgPrice(ds.getTotalOrgPrice() + oi.getOrgPrice());
				ds.setTotalFinalPrice(ds.getTotalFinalPrice() + oi.getPrice());
			}

			totalOrderItemCount += ds.getOrderItemCount();
			sumOfTotalOrgPrice += ds.getTotalOrgPrice();
			sumOfTotalDiscountedPrice += ds.getTotalDiscountedPrice();
			sumOfTotalServiceFee += ds.getTotalServiceFee();
			sumOfTotalCouponValue += ds.getTotalCouponValue();
			sumOfTotalFinalPrice += ds.getTotalFinalPrice();

			departmentStatList.add(ds);
		}

		DepartmentStat sumDS = new DepartmentStat();
		sumDS.setDepartmentName("SUM");
		sumDS.setOrderItemCount(totalOrderItemCount);
		sumDS.setTotalOrgPrice(sumOfTotalOrgPrice);
		sumDS.setTotalDiscountedPrice(sumOfTotalDiscountedPrice);
		sumDS.setTotalServiceFee(sumOfTotalServiceFee);
		sumDS.setTotalCouponValue(sumOfTotalCouponValue);
		sumDS.setTotalFinalPrice(sumOfTotalFinalPrice);
		departmentStatList.add(sumDS);

		return departmentStatList;
	}

	private static List<PaymentStat> generatePaymentStats(
			List<DishOrder> dishOrderList) {

		HashMap<Long, PaymentStat> paymentStatByPaymentTypeIDMap = new HashMap<Long, PaymentStat>();

		for (DishOrder dishOrder : dishOrderList) {

			if (dishOrder.getPayRecords() == null) {
				continue;
			}

			String orgMemo = "";
			for (PayRecord payRecord : dishOrder.getPayRecords()) {

				String payRecordTypeName = null;
				if (payRecord.getTypeName() != null) {
					payRecordTypeName = payRecord.getTypeName();
				} else {
					payRecordTypeName = "现金";
				}

				String paymentSummary = payRecordTypeName + ":"
						+ payRecord.getAmount() + "|";

				orgMemo += paymentSummary;

				Long paymentTypeID = payRecord.getPaymentTypeId();
				PaymentStat currentPaymentStat = paymentStatByPaymentTypeIDMap
						.get(paymentTypeID);

				if (currentPaymentStat == null) {
					currentPaymentStat = new PaymentStat();
					currentPaymentStat.setTypeName(payRecordTypeName);
					currentPaymentStat.setExchageRate(payRecord
							.getExchangeRate());
					paymentStatByPaymentTypeIDMap.put(paymentTypeID,
							currentPaymentStat);
				}

				int payRecordCount = currentPaymentStat.getPayRecordCount();
				double totalAmount = currentPaymentStat.getTotalAmount();
				double newTotalAmount = totalAmount + payRecord.getAmount();

				currentPaymentStat.setPayRecordCount(payRecordCount + 1);
				currentPaymentStat.setTotalAmount(newTotalAmount);
				currentPaymentStat.setTransferedAmount(newTotalAmount
						* currentPaymentStat.getExchageRate());
			}
			dishOrder.setMemo(orgMemo);
		}

		List<PaymentStat> paymentStatList = new ArrayList<PaymentStat>();
		paymentStatList.addAll(paymentStatByPaymentTypeIDMap.values());

		return paymentStatList;
	}
}

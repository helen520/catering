package helen.catering.model;

import helen.catering.model.entities.DishOrder;

import java.util.List;

public class FinanceStat {

	private long date;

	private int dishOrderCount;

	private int customerCount;

	private double totalPrice;

	private double totalDiscountedPrice;

	private double totalServiceFee;

	private double totalMoneyExclued;

	private double totalActualPaid;

	private double sumOfPayRecordAmount;

	private List<DepartmentStat> departmentStats;

	private List<DishOrder> dishOrders;

	private List<PaymentStat> paymentStats;

	public long getDate() {
		return date;
	}

	public void setDate(long date) {
		this.date = date;
	}

	public int getDishOrderCount() {
		return dishOrderCount;
	}

	public void setDishOrderCount(int dishOrderCount) {
		this.dishOrderCount = dishOrderCount;
	}

	public int getCustomerCount() {
		return customerCount;
	}

	public void setCustomerCount(int customerCount) {
		this.customerCount = customerCount;
	}

	public double getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(double totalPrice) {
		this.totalPrice = totalPrice;
	}

	public double getTotalDiscountedPrice() {
		return totalDiscountedPrice;
	}

	public void setTotalDiscountedPrice(double totalDiscountedPrice) {
		this.totalDiscountedPrice = totalDiscountedPrice;
	}

	public double getTotalServiceFee() {
		return totalServiceFee;
	}

	public void setTotalServiceFee(double totalServiceFee) {
		this.totalServiceFee = totalServiceFee;
	}

	public double getTotalMoneyExclued() {
		return totalMoneyExclued;
	}

	public void setTotalMoneyExclued(double totalMoneyExclued) {
		this.totalMoneyExclued = totalMoneyExclued;
	}

	public double getTotalActualPaid() {
		return totalActualPaid;
	}

	public void setTotalActualPaid(double totalActualPaid) {
		this.totalActualPaid = totalActualPaid;
	}

	public double getSumOfPayRecordAmount() {
		return sumOfPayRecordAmount;
	}

	public void setSumOfPayRecordAmount(double sumOfPayRecordAmount) {
		this.sumOfPayRecordAmount = sumOfPayRecordAmount;
	}

	public List<DepartmentStat> getDepartmentStats() {
		return departmentStats;
	}

	public void setDepartmentStats(List<DepartmentStat> departmentStats) {
		this.departmentStats = departmentStats;
	}

	public List<DishOrder> getDishOrders() {
		return dishOrders;
	}

	public void setDishOrders(List<DishOrder> dishOrders) {
		this.dishOrders = dishOrders;
	}

	public List<PaymentStat> getPaymentStats() {
		return paymentStats;
	}

	public void setPaymentStats(List<PaymentStat> paymentStats) {
		this.paymentStats = paymentStats;
	}
}

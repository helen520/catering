package helen.catering.model;

import java.util.List;

public class ReportData {

	private int dishOrderCount;
	private double totalPrice;
	private double discountedTotalPrice;
	private double totalServiceFee;
	private double totalIncome;
	private List<PayRecordInfo> payRecordInfos;

	public int getDishOrderCount() {
		return dishOrderCount;
	}

	public void setDishOrderCount(int dishOrderCount) {
		this.dishOrderCount = dishOrderCount;
	}

	public double getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(double totalPrice) {
		this.totalPrice = totalPrice;
	}

	public double getDiscountedTotalPrice() {
		return discountedTotalPrice;
	}

	public void setDiscountedTotalPrice(double discountedTotalPrice) {
		this.discountedTotalPrice = discountedTotalPrice;
	}

	public double getTotalServiceFee() {
		return totalServiceFee;
	}

	public void setTotalServiceFee(double totalServiceFee) {
		this.totalServiceFee = totalServiceFee;
	}

	public double getTotalIncome() {
		return totalIncome;
	}

	public void setTotalIncome(double totalIncome) {
		this.totalIncome = totalIncome;
	}

	public List<PayRecordInfo> getPayRecordInfos() {
		return payRecordInfos;
	}

	public void setPayRecordInfos(List<PayRecordInfo> payRecordInfos) {
		this.payRecordInfos = payRecordInfos;
	}

	
}

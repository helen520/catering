package helen.catering.model;

public class DepartmentStat {
	
	private String departmentName;

	private int orderItemCount;

	private double totalOrgPrice;

	private double totalDiscountedPrice;

	private double totalServiceFee;

	private double totalCouponValue;

	private double totalFinalPrice;

	public String getDepartmentName() {
		return departmentName;
	}

	public void setDepartmentName(String departmentName) {
		this.departmentName = departmentName;
	}

	public int getOrderItemCount() {
		return orderItemCount;
	}

	public void setOrderItemCount(int orderItemCount) {
		this.orderItemCount = orderItemCount;
	}

	public double getTotalOrgPrice() {
		return totalOrgPrice;
	}

	public void setTotalOrgPrice(double totalOrgPrice) {
		this.totalOrgPrice = totalOrgPrice;
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

	public double getTotalCouponValue() {
		return totalCouponValue;
	}

	public void setTotalCouponValue(double totalCouponValue) {
		this.totalCouponValue = totalCouponValue;
	}

	public double getTotalFinalPrice() {
		return totalFinalPrice;
	}

	public void setTotalFinalPrice(double totalFinalPrice) {
		this.totalFinalPrice = totalFinalPrice;
	}
}

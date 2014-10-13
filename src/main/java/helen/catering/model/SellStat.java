package helen.catering.model;

public class SellStat {

	private String itemName;

	private Long itemID;

	private String workNumber;

	private String unit;

	private double unitPrice;

	private double settlePrice;

	private double amount;

	private double totalExtraFee;

	private double totalOrgPrice;

	private double totalDiscountedPrice;

	private double totalServiceFee;

	private double totalPrice;

	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
	}

	public Long getItemID() {
		return itemID;
	}

	public void setItemID(Long itemID) {
		this.itemID = itemID;
	}

	public String getWorkNumber() {
		return workNumber;
	}

	public void setWorkNumber(String workNumber) {
		this.workNumber = workNumber;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public double getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(double unitPrice) {
		this.unitPrice = unitPrice;
	}

	public double getSettlePrice() {
		return settlePrice;
	}

	public void setSettlePrice(double settlePrice) {
		this.settlePrice = settlePrice;
	}

	public double getAmount() {
		return amount;
	}

	public void setAmount(double amount) {
		this.amount = amount;
	}

	public double getTotalExtraFee() {
		return totalExtraFee;
	}

	public void setTotalExtraFee(double totalExtraFee) {
		this.totalExtraFee = totalExtraFee;
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

	public double getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(double totalPrice) {
		this.totalPrice = totalPrice;
	}

}

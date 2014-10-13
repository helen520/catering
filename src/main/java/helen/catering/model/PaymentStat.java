package helen.catering.model;

public class PaymentStat {

	private String typeName;

	private int payRecordCount;

	private double totalAmount;

	private double exchageRate;

	private double transferedAmount;

	public String getTypeName() {
		return typeName;
	}

	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}

	public int getPayRecordCount() {
		return payRecordCount;
	}

	public void setPayRecordCount(int payRecordCount) {
		this.payRecordCount = payRecordCount;
	}

	public double getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(double totalAmount) {
		this.totalAmount = totalAmount;
	}

	public double getExchageRate() {
		return exchageRate;
	}

	public void setExchageRate(double exchageRate) {
		this.exchageRate = exchageRate;
	}

	public double getTransferedAmount() {
		return transferedAmount;
	}

	public void setTransferedAmount(double transferedAmount) {
		this.transferedAmount = transferedAmount;
	}

}

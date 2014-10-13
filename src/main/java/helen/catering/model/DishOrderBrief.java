package helen.catering.model;


public class DishOrderBrief {

	private long dishOrderId;

	private long deskId;

	private int customerCount;

	private int state;

	private double totalPrice;

	private boolean isHasSelfOrder;

	private boolean prePrintCheckoutNotePrinted;

	private String jsonHash;

	public long getDishOrderId() {
		return dishOrderId;
	}

	public void setDishOrderId(long dishOrderId) {
		this.dishOrderId = dishOrderId;
	}

	public int getCustomerCount() {
		return customerCount;
	}

	public void setCustomerCount(int customerCount) {
		this.customerCount = customerCount;
	}

	public int getState() {
		return state;
	}

	public void setState(int state) {
		this.state = state;
	}

	public double getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(double totalPrice) {
		this.totalPrice = totalPrice;
	}

	public boolean getIsHasSelfOrder() {
		return isHasSelfOrder;
	}

	public void setIsHasSelfOrder(boolean isHasSelfOrder) {
		this.isHasSelfOrder = isHasSelfOrder;
	}

	public boolean getPrePrintCheckoutNotePrinted() {
		return prePrintCheckoutNotePrinted;
	}

	public void setPrePrintCheckoutNotePrinted(
			boolean prePrintCheckoutNotePrinted) {
		this.prePrintCheckoutNotePrinted = prePrintCheckoutNotePrinted;
	}

	public String getJsonHash() {
		return jsonHash;
	}

	public void setJsonHash(String jsonHash) {
		this.jsonHash = jsonHash;
	}

	public long getDeskId() {
		return deskId;
	}

	public void setDeskId(long deskId) {
		this.deskId = deskId;
	}
}

package helen.catering.model;

public class CookerDishStat {

	private String cookerName;

	private String dishName;

	private double dishAmount;

	private double grossSales;

	public String getCookerName() {
		return cookerName;
	}

	public void setCookerName(String cookerName) {
		this.cookerName = cookerName;
	}

	public String getDishName() {
		return dishName;
	}

	public void setDishName(String dishName) {
		this.dishName = dishName;
	}

	public double getDishAmount() {
		return dishAmount;
	}

	public void setDishAmount(double dishAmount) {
		this.dishAmount = dishAmount;
	}

	public double getGrossSales() {
		return grossSales;
	}

	public void setGrossSales(double grossSales) {
		this.grossSales = grossSales;
	}
}

package helen.catering.model;

import helen.catering.model.entities.OrderItem;

import java.util.ArrayList;
import java.util.List;

public class SetMeal {

	private String setMealName;

	private long setMealId;

	private List<OrderItem> setMealOrderItems;

	public String getSetMealName() {
		return setMealName;
	}

	public void setSetMealName(String setMealName) {
		this.setMealName = setMealName;
	}

	public long getSetMealId() {
		return setMealId;
	}

	public void setSetMealId(long setMealId) {
		this.setMealId = setMealId;
	}

	public List<OrderItem> getSetMealOrderItems() {
		return setMealOrderItems;
	}

	public void setSetMealOrderItems(List<OrderItem> setMealOrderItems) {
		this.setMealOrderItems = setMealOrderItems;
	}

	public SetMeal() {
		this.setMealOrderItems = new ArrayList<OrderItem>();
	}
}

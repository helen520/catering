package helen.catering.model;

import helen.catering.model.entities.DishTag;

import java.util.List;

public class DishOptionSet {

	private int optionSetNo;

	private String name;

	private List<DishTag> dishTags;

	public int getOptionSetNo() {
		return optionSetNo;
	}

	public void setOptionSetNo(int optionSetNo) {
		this.optionSetNo = optionSetNo;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<DishTag> getDishTags() {
		return dishTags;
	}

	public void setDishTags(List<DishTag> dishTags) {
		this.dishTags = dishTags;
	}
}

package helen.catering.model;

import helen.catering.model.entities.DishTag;

import java.util.List;

public class DishTagGroup {
	
	private String groupName;
	
	private List<DishTag> dishTags;

	public String getGroupName() {
		return groupName;
	}

	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}

	public List<DishTag> getDishTags() {
		return dishTags;
	}

	public void setDishTags(List<DishTag> dishTags) {
		this.dishTags = dishTags;
	}
}

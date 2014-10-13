package helen.catering.model.entities;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.ObjectMapper;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "MealDealItem")
public class MealDealItem implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	private long id;

	@Column
	private long storeId;

	@Column
	private Long targetDishId;

	@Column
	private String groupName;

	@Column
	private double priceDelta;

	@Column
	private int sort;
	
	@Column
	private String dishName;

	@OneToOne
	@JoinColumn(name = "SourceDishId")
	private Dish sourceDish;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getStoreId() {
		return storeId;
	}

	public void setStoreId(long storeId) {
		this.storeId = storeId;
	}

	public Dish getSourceDish() {
		return sourceDish;
	}

	public void setSourceDish(Dish sourceDish) {
		this.sourceDish = sourceDish;
	}

	public Long getTargetDishId() {
		return targetDishId;
	}

	public void setTargetDishId(Long targetDishId) {
		this.targetDishId = targetDishId;
	}

	public String getGroupName() {
		return groupName;
	}

	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}

	public double getPriceDelta() {
		return priceDelta;
	}

	public void setPriceDelta(double priceDelta) {
		this.priceDelta = priceDelta;
	}

	public int getSort() {
		return sort;
	}

	public void setSort(int sort) {
		this.sort = sort;
	}

	public String getDishName() {
		return dishName;
	}

	public void setDishName(String dishName) {
		this.dishName = dishName;
	}

	public static MealDealItem fromJsonText(String jsonText) {
		ObjectMapper om = new ObjectMapper();
		try {
			return om.reader(MealDealItem.class).readValue(jsonText);
		} catch (Exception e) {
			return null;
		}
	}

}

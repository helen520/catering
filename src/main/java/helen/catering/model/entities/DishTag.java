package helen.catering.model.entities;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.map.ObjectMapper;

@Entity
public class DishTag implements Serializable, Comparable<DishTag> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	private long id;

	@Column
	private long storeId;

	@Column
	private Long departmentId;

	@Column
	private String name;

	@Column
	private String alias;

	@Column
	private Integer optionSetNo;

	@Column
	private String groupName;

	@Column
	private String unit;

	@Column
	private double priceDelta;

	@Column
	private double amountPerDish;

	@Column
	private int sort;

	@ManyToOne
	@JoinColumn(name = "DishId")
	private Dish dish;

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

	public Long getDepartmentId() {
		return departmentId;
	}

	public void setDepartmentId(Long departmentId) {
		this.departmentId = departmentId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	public Integer getOptionSetNo() {
		return optionSetNo;
	}

	public void setOptionSetNo(Integer optionSetNo) {
		this.optionSetNo = optionSetNo;
	}

	public String getGroupName() {
		return groupName;
	}

	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public double getPriceDelta() {
		return priceDelta;
	}

	public void setPriceDelta(double priceDelta) {
		this.priceDelta = priceDelta;
	}

	public double getAmountPerDish() {
		return amountPerDish;
	}

	public void setAmountPerDish(double amountPerDish) {
		this.amountPerDish = amountPerDish;
	}

	public Integer getSort() {
		return sort;
	}

	public void setSort(int sort) {
		this.sort = sort;
	}

	@JsonIgnore
	public Dish getDish() {
		return dish;
	}

	@JsonIgnore
	public void setDish(Dish dish) {
		this.dish = dish;
	}

	public static DishTag fromJsonText(String jsonText) {
		ObjectMapper om = new ObjectMapper();
		try {
			return om.reader(DishTag.class).readValue(jsonText);
		} catch (Exception e) {
			return null;
		}
	}

	@Override
	public int compareTo(DishTag arg0) {
		return this.getSort().compareTo(arg0.getSort());
	}
}

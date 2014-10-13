package helen.catering.model.entities;

import helen.catering.model.DishOptionSet;
import helen.catering.model.DishTagGroup;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Transient;

import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.ObjectMapper;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
public class Dish implements Serializable, Comparable<Dish> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	private long id;

	@Column
	private long departmentId;

	@Column
	private Long cookerEmployeeId;

	@Column
	private String name;

	@Column
	private String alias;

	@Column
	private String indexCode;

	@Column
	private String description;

	@Column
	private boolean noCookingNote;

	@Column
	private boolean noCustomerNote;

	@Column
	private String picPath;

	@Column
	private String secondPicPath;

	@Column
	private String unit;

	@Column
	private double price;

	@Column
	private double vipFee;

	@Column
	private boolean noDiscount;

	@Column
	private double amountPerCustomer;

	@Column
	private boolean frequent;

	@Column
	private boolean autoOrder;

	@Column
	private boolean editable;

	@Column
	private boolean newDish;

	@Column
	private boolean recommended;

	@Column
	private Double limitPerDay;

	@Column
	private Double remain;

	@Column
	private boolean soldOut;

	@Column
	private boolean enabled;

	@Column
	private int sort;

	@Column
	private boolean hasMealDealItems;

	@Column
	private boolean needWeigh;

	@ManyToOne
	@JoinColumn(name = "DishCategoryId")
	private DishCategory dishCategory;

	@OneToMany(mappedBy = "dish", cascade = CascadeType.ALL)
	private List<DishTag> dishTags;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getDepartmentId() {
		return departmentId;
	}

	public void setDepartmentId(long departmentId) {
		this.departmentId = departmentId;
	}

	public Long getCookerEmployeeId() {
		return cookerEmployeeId;
	}

	public void setCookerEmployeeId(Long cookerEmployeeId) {
		this.cookerEmployeeId = cookerEmployeeId;
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

	public String getIndexCode() {
		return indexCode;
	}

	public void setIndexCode(String indexCode) {
		this.indexCode = indexCode;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public boolean isNoCookingNote() {
		return noCookingNote;
	}

	public void setNoCookingNote(boolean noCookingNote) {
		this.noCookingNote = noCookingNote;
	}

	public boolean isNoCustomerNote() {
		return noCustomerNote;
	}

	public void setNoCustomerNote(boolean noCustomerNote) {
		this.noCustomerNote = noCustomerNote;
	}

	public String getPicPath() {
		return picPath;
	}

	public void setPicPath(String picPath) {
		this.picPath = picPath;
	}

	public String getSecondPicPath() {
		return secondPicPath;
	}

	public void setSecondPicPath(String secondPicPath) {
		this.secondPicPath = secondPicPath;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public double getVIPFee() {
		return this.vipFee;
	}

	public void setVIPFee(double vipFee) {
		this.vipFee = vipFee;
	}

	public boolean isNoDiscount() {
		return noDiscount;
	}

	public void setNoDiscount(boolean noDiscount) {
		this.noDiscount = noDiscount;
	}

	public double getAmountPerCustomer() {
		return amountPerCustomer;
	}

	public void setAmountPerCustomer(double amountPerCustomer) {
		this.amountPerCustomer = amountPerCustomer;
	}

	public boolean isFrequent() {
		return frequent;
	}

	public void setFrequent(boolean frequent) {
		this.frequent = frequent;
	}

	public boolean isAutoOrder() {
		return autoOrder;
	}

	public void setAutoOrder(boolean autoOrder) {
		this.autoOrder = autoOrder;
	}

	public boolean isEditable() {
		return editable;
	}

	public void setEditable(boolean editable) {
		this.editable = editable;
	}

	public boolean getNewDish() {
		return newDish;
	}

	public void setNewDish(boolean newDish) {
		this.newDish = newDish;
	}

	public boolean getRecommended() {
		return recommended;
	}

	public void setRecommended(boolean recommended) {
		this.recommended = recommended;
	}

	public Double getLimitPerDay() {
		return limitPerDay;
	}

	public void setLimitPerDay(Double limitPerDay) {
		this.limitPerDay = limitPerDay;
	}

	public Double getRemain() {
		return remain;
	}

	public void setRemain(Double remain) {
		this.remain = remain;
	}

	public boolean isSoldOut() {
		return soldOut;
	}

	public void setSoldOut(boolean soldOut) {
		this.soldOut = soldOut;
	}

	public boolean isEnabled() {
		return enabled;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}

	public Integer getSort() {
		return sort;
	}

	public void setSort(int sort) {
		this.sort = sort;
	}

	public boolean getHasMealDealItems() {
		return hasMealDealItems;
	}

	public void setHasMealDealItems(boolean hasMealDealItems) {
		this.hasMealDealItems = hasMealDealItems;
	}

	public boolean getNeedWeigh() {
		return needWeigh;
	}

	public void setNeedWeigh(boolean needWeigh) {
		this.needWeigh = needWeigh;
	}

	@JsonIgnore
	public DishCategory getDishCategory() {
		return dishCategory;
	}

	@JsonIgnore
	public void setDishCategory(DishCategory dishCategory) {
		this.dishCategory = dishCategory;
	}

	@JsonIgnore
	public List<DishTag> getDishTags() {
		return dishTags;
	}

	@JsonIgnore
	public void setDishTags(List<DishTag> dishTags) {
		this.dishTags = dishTags;
	}

	@Transient
	public List<DishOptionSet> getDishOptionSets() {
		List<DishOptionSet> dosList = new ArrayList<DishOptionSet>();
		if (getDishTags() == null) {
			return dosList;
		}

		HashMap<String, List<DishTag>> dtListMap = new HashMap<String, List<DishTag>>();
		for (DishTag dt : getDishTags()) {
			if (dt.getOptionSetNo() == null) {
				continue;
			}

			String groupName = dt.getGroupName();

			if (!dtListMap.containsKey(groupName)) {
				dtListMap.put(groupName, new ArrayList<DishTag>());
			}
			dtListMap.get(groupName).add(dt);
		}

		int i = 0;
		Integer optionSetNo = 0;
		for (String key : dtListMap.keySet()) {
			List<DishTag> dtList = dtListMap.get(key);
			DishOptionSet dos = new DishOptionSet();
			if (dtList.size() > 0)
				optionSetNo = dtList.get(0).getOptionSetNo();
			if (optionSetNo == null)
				optionSetNo = i++;
			dos.setOptionSetNo(optionSetNo);
			dos.setDishTags(dtList);
			dos.setName(dtList.get(0).getGroupName());
			dosList.add(dos);
		}

		return dosList;
	}

	@Transient
	public List<DishTagGroup> getDishTagGroups() {
		List<DishTagGroup> dtgList = new ArrayList<DishTagGroup>();
		if (getDishTags() == null) {
			return dtgList;
		}

		HashMap<String, List<DishTag>> dtListMap = new HashMap<String, List<DishTag>>();
		for (DishTag dt : getDishTags()) {
			Integer optionSetNo = dt.getOptionSetNo();
			if (optionSetNo != null) {
				continue;
			}

			if (!dtListMap.containsKey(dt.getGroupName())) {
				dtListMap.put(dt.getGroupName(), new ArrayList<DishTag>());
			}
			dtListMap.get(dt.getGroupName()).add(dt);
		}

		for (String key : dtListMap.keySet()) {
			List<DishTag> dtList = dtListMap.get(key);
			DishTagGroup dtg = new DishTagGroup();
			dtg.setGroupName(key);
			dtg.setDishTags(dtList);
			dtgList.add(dtg);
		}

		return dtgList;
	}

	public static Dish fromJsonText(String jsonText) {
		ObjectMapper om = new ObjectMapper();
		try {
			return om.reader(Dish.class).readValue(jsonText);
		} catch (Exception e) {
			return null;
		}
	}

	@Override
	public int compareTo(Dish arg0) {
		return this.getSort().compareTo(arg0.getSort());
	}
}

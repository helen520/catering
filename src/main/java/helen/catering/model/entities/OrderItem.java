package helen.catering.model.entities;

import helen.catering.Utils;

import java.io.Serializable;
import java.util.ArrayList;
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

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
public class OrderItem implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public final static int STATE_WAITING = 1;
	public final static int STATE_PRINTING = 2;
	public final static int STATE_DELETED = 3;
	public final static int STATE_COOKING = 4;
	public final static int STATE_DELIVERING = 5;
	public final static int STATE_SERVED = 6;
	public final static int STATE_CANCELLED = 7;

	@Id
	private long id;

	@Column
	private long departmentId;

	@Column
	private long dishId;

	@Column
	private Long cookerEmployeeId;

	@Column
	private Long discountRuleId;

	@Column
	private long createTime;

	@Column
	private String dishName;

	@Column
	private String dishAlias;

	@Column
	private String orgUnit;

	@Column
	private String unit;

	@Column
	private boolean editable;

	@Column
	private Boolean noOverallDiscount;

	@Column
	private String discountRuleName;

	@Column
	private double dishPrice;

	@Column
	private double price;

	@Column
	private double amount;

	@Column
	private boolean suspended;

	@Column
	private boolean noCooking;

	@Column
	private boolean noCookingNote;

	@Column
	private boolean noCustomerNote;

	@Column
	private int state;

	@Column
	private String cancelReason;

	@Column
	private String memo;

	@Column
	private Long triggerId;

	@Column
	private Long mealDealItemId;

	@Column
	private boolean hasMealDealItems;

	@Column
	private boolean customerNotePrinted;

	@Column
	private Long employeeId;

	@Column
	private String employeeName;

	// dishSellDetail要用到
	@Column
	private String deskName;

	@ManyToOne
	@JoinColumn(name = "DishOrderId")
	private DishOrder dishOrder;

	@OneToMany(mappedBy = "orderItem", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<OrderItemTag> orderItemTags;

	@Transient
	private Long clientTriggerId;

	@Transient
	private String createTimeStr;

	public void setDeskName(String deskName) {
		this.deskName = deskName;
	}

	public String getDeskName() {
		return this.deskName;
	}

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

	public long getDishId() {
		return dishId;
	}

	public void setDishId(long dishId) {
		this.dishId = dishId;
	}

	public Long getCookerEmployeeId() {
		return cookerEmployeeId;
	}

	public void setCookerEmployeeId(Long cookerEmployeeId) {
		this.cookerEmployeeId = cookerEmployeeId;
	}

	public Long getDiscountRuleId() {
		return discountRuleId;
	}

	public void setDiscountRuleId(Long discountRuleId) {
		this.discountRuleId = discountRuleId;
	}

	public long getCreateTime() {
		return createTime;
	}

	public void setCreateTime(long createTime) {
		this.createTime = createTime;
	}

	public String getDishName() {
		return dishName;
	}

	public void setDishName(String dishName) {
		this.dishName = dishName;
	}

	public String getDishAlias() {
		return dishAlias;
	}

	public void setDishAlias(String dishAlias) {
		this.dishAlias = dishAlias;
	}

	public String getOrgUnit() {
		return orgUnit;
	}

	public void setOrgUnit(String orgUnit) {
		this.orgUnit = orgUnit;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public boolean isEditable() {
		return editable;
	}

	public void setEditable(boolean editable) {
		this.editable = editable;
	}

	public boolean getNoOverallDiscount() {
		return noOverallDiscount;
	}

	public void setNoOverallDiscount(boolean noOverallDiscount) {
		this.noOverallDiscount = noOverallDiscount;
	}

	public String getDiscountRuleName() {
		return discountRuleName;
	}

	public void setDiscountRuleName(String discountRuleName) {
		this.discountRuleName = discountRuleName;
	}

	public double getDishPrice() {
		return dishPrice;
	}

	public void setDishPrice(double dishPrice) {
		this.dishPrice = dishPrice;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public double getAmount() {
		return amount;
	}

	public void setAmount(double amount) {
		this.amount = amount;
	}

	public boolean isSuspended() {
		return suspended;
	}

	public void setSuspended(boolean suspended) {
		this.suspended = suspended;
	}

	public boolean getNoCooking() {
		return noCooking;
	}

	public void setNoCooking(boolean noCooking) {
		this.noCooking = noCooking;
	}

	public boolean getNoCookingNote() {
		return noCookingNote;
	}

	public void setNoCookingNote(boolean noCookingNote) {
		this.noCookingNote = noCookingNote;
	}

	public boolean getNoCustomerNote() {
		return noCustomerNote;
	}

	public void setNoCustomerNote(boolean noCustomerNote) {
		this.noCustomerNote = noCustomerNote;
	}

	public int getState() {
		return state;
	}

	public void setState(int state) {
		this.state = state;
	}

	public String getCancelReason() {
		return cancelReason;
	}

	public void setCancelReason(String cancelReason) {
		this.cancelReason = cancelReason;
	}

	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public Long getTriggerId() {
		return triggerId;
	}

	public void setTriggerId(Long triggerId) {
		this.triggerId = triggerId;
	}

	public Long getMealDealItemId() {
		return mealDealItemId;
	}

	public void setMealDealItemId(Long mealDealItemId) {
		this.mealDealItemId = mealDealItemId;
	}

	public boolean getHasMealDealItems() {
		return hasMealDealItems;
	}

	public void setHasMealDealItems(boolean hasMealDealItems) {
		this.hasMealDealItems = hasMealDealItems;
	}

	public boolean getCustomerNotePrinted() {
		return customerNotePrinted;
	}

	public void setCustomerNotePrinted(boolean customerNotePrinted) {
		this.customerNotePrinted = customerNotePrinted;
	}

	public Long getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(Long employeeId) {
		this.employeeId = employeeId;
	}

	public String getEmployeeName() {
		return employeeName;
	}

	public void setEmployeeName(String employeeName) {
		this.employeeName = employeeName;
	}

	@JsonIgnore
	public DishOrder getDishOrder() {
		return dishOrder;
	}

	@JsonIgnore
	public void setDishOrder(DishOrder dishOrder) {
		this.dishOrder = dishOrder;
	}

	@JsonIgnore
	public List<OrderItemTag> getOrderItemTags() {
		return orderItemTags;
	}

	@JsonIgnore
	public void setOrderItemTags(List<OrderItemTag> orderItemTags) {
		this.orderItemTags = orderItemTags;
	}

	public Long getClientTriggerId() {
		return clientTriggerId;
	}

	public void setClientTriggerId(Long clientTriggerId) {
		this.clientTriggerId = clientTriggerId;
	}

	public String getCreateTimeStr() {
		return Utils.formatShortDateTimeYMDHM(createTime);
	}

	// 选项tags
	@Transient
	public List<OrderItemTag> getOptions() {

		List<OrderItemTag> options = new ArrayList<OrderItemTag>();
		if (getOrderItemTags() == null) {
			return options;
		}

		for (OrderItemTag orderItemTag : getOrderItemTags()) {
			if (orderItemTag.getDishTagId() != null) {
				if (orderItemTag.getDishId() != null) {
					options.add(orderItemTag);
				}
			}
		}
		return options;
	}

	public void setOptions(List<OrderItemTag> options) {
		if (this.orderItemTags == null) {
			this.orderItemTags = new ArrayList<OrderItemTag>();
		}

		this.orderItemTags.addAll(options);
	}

	// 做法tags
	@Transient
	public List<OrderItemTag> getTags() {

		List<OrderItemTag> tags = new ArrayList<OrderItemTag>();
		if (getOrderItemTags() == null) {
			return tags;
		}

		for (OrderItemTag orderItemTag : getOrderItemTags()) {
			if (orderItemTag.getDishTagId() != null) {
				if (orderItemTag.getDishId() == null) {
					tags.add(orderItemTag);
				}
			}
		}
		return tags;
	}

	public void setTags(List<OrderItemTag> tags) {
		if (this.orderItemTags == null) {
			this.orderItemTags = new ArrayList<OrderItemTag>();
		}

		this.orderItemTags.addAll(tags);
	}

	// 手写做法tags
	@Transient
	public List<OrderItemTag> getFreeTags() {

		List<OrderItemTag> freeTags = new ArrayList<OrderItemTag>();
		if (getOrderItemTags() == null) {
			return freeTags;
		}

		for (OrderItemTag orderItemTag : getOrderItemTags()) {
			if (orderItemTag.getDishTagId() == null) {
				freeTags.add(orderItemTag);
			}
		}
		return freeTags;
	}

	public void setFreeTags(List<OrderItemTag> freeTags) {
		if (this.orderItemTags == null) {
			this.orderItemTags = new ArrayList<OrderItemTag>();
		}

		this.orderItemTags.addAll(freeTags);
	}

	@JsonIgnore
	public double getOrgPrice() {

		if (this.getState() == OrderItem.STATE_CANCELLED
				|| this.getState() == OrderItem.STATE_DELETED) {
			return 0;
		}

		Double orgPrice = this.getDishPrice() * this.getAmount();

		List<OrderItemTag> oitList = this.getOrderItemTags();
		if (oitList != null) {
			for (OrderItemTag oit : oitList) {
				orgPrice += oit.getPriceDelta() * oit.getAmount();
			}
		}

		orgPrice = Math.rint(orgPrice * 10) / 10;
		return orgPrice;
	}

	public void updatePrice(DiscountRule discountRule, double discountRate) {

		if (this.getOrgUnit() == null) {
			this.setOrgUnit("");
		}
		if (this.getUnit() == null) {
			this.setUnit("");
		}

		double price = this.getOrgPrice();
		if (discountRule == null) {
			this.setDiscountRuleName(null);
			if (!getNoOverallDiscount()) {
				price *= discountRate;
			}
		} else {
			this.setDiscountRuleName(discountRule.getName());
			price *= discountRule.getDiscountRate();
			if (!discountRule.isNoOverallDiscount() && !getNoOverallDiscount()) {
				price *= discountRate;
			}

			price -= discountRule.getValue();
		}

		price = Math.rint(price * 10) / 10;
		price = price < 0 ? 0 : price;

		this.setPrice(price);
	}

	@JsonIgnore
	public String getTagText() {
		if (this.getOrderItemTags() == null) {
			return "";
		}

		String tagText = "";
		for (int i = 0; i < this.getOrderItemTags().size(); i++) {
			OrderItemTag tag = orderItemTags.get(i);
			String amountAndUnitStr = "[" + Utils.formatAmount(tag.getAmount())
					+ tag.getUnit() + "]";
			if (!amountAndUnitStr.equals("[1]")) {
				tagText += amountAndUnitStr;
			}

			tagText += tag.getName();
			double priceDelta = tag.getPriceDelta() * tag.getAmount();
			if (priceDelta > 0) {
				tagText += ":+" + Utils.formatPrice(priceDelta, false);
			}

			if (i < orderItemTags.size() - 1) {
				tagText += ";";
			}
		}

		return tagText;
	}

	public String getPrintingDishName() {
		return getDishName().replaceAll("焗", "局");
	}
}

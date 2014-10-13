package helen.catering.model.entities;

import helen.catering.Utils;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Transient;

import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.ObjectMapper;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
public class DishOrder implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public final static int STATE_PROCESSING = 1;
	public final static int STATE_PAID = 2;
	public final static int STATE_ARCHIVED = 3;
	public final static int STATE_CREATING = 4;
	public final static int STATE_CANCELLED = 5;
	public final static int STATE_PAYING = 6;
	public final static int STATE_WAITING = 7;

	@Id
	private long id;

	@Column
	private long storeId;

	@Column
	private Long deskId;

	@Column
	private Long creatorEmployeeId;

	@Column
	private Long editorEmployeeId;

	@Column
	private Long userAccountId;

	@Column
	private long createTime;

	@Column
	private String deskName;

	@Column
	private String serialNumber;

	@Column
	private int customerCount;

	@Column
	private int state;

	@Column
	private double totalPrice;

	@Column
	private double discountRate;

	@Column
	private double discountedPrice;

	@Column
	private double serviceFeeRate;

	@Column
	private double serviceFee;

	@Column
	private double finalPrice;

	@Column
	private Long archivedTime;

	@Column
	private String memo;

	@Column
	private String openId;

	@Column
	private Long bookRecordId;

	@Column
	private Double prePay;

	@Column
	private Long expectedArriveTime;

	@Column
	private boolean prePrintCheckoutNotePrinted;

	@Transient
	private String jsonHash;

	@Transient
	private BookRecord bookRecord;

	@Transient
	private UserAccount member;

	@Transient
	private boolean isHasSelfOrder;

	@Transient
	private String createTimeStr;

	@Transient
	private String createTimeHMStr;

	@OneToMany(mappedBy = "dishOrder", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<OrderItem> orderItems;

	@OneToMany(mappedBy = "dishOrder", cascade = CascadeType.ALL)
	private List<PayRecord> payRecords;

	@OneToMany(mappedBy = "dishOrder", cascade = CascadeType.ALL)
	private List<DishOrderTag> dishOrderTags;

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

	public Long getDeskId() {
		return deskId;
	}

	public void setDeskId(Long deskId) {
		this.deskId = deskId;
	}

	public Long getCreatorEmployeeId() {
		return creatorEmployeeId;
	}

	public void setCreatorEmployeeId(Long creatorEmployeeId) {
		this.creatorEmployeeId = creatorEmployeeId;
	}

	public Long getEditorEmployeeId() {
		return editorEmployeeId;
	}

	public void setEditorEmployeeId(Long editorEmployeeId) {
		this.editorEmployeeId = editorEmployeeId;
	}

	public Long getUserAccountId() {
		return userAccountId;
	}

	public void setUserAccountId(Long userAccountId) {
		this.userAccountId = userAccountId;
	}

	public long getCreateTime() {
		return createTime;
	}

	public void setCreateTime(long createTime) {
		this.createTime = createTime;
	}

	public String getDeskName() {
		return deskName;
	}

	public void setDeskName(String deskName) {
		this.deskName = deskName;
	}

	public String getSerialNumber() {
		return serialNumber;
	}

	public void setSerialNumber(String serialNumber) {
		this.serialNumber = serialNumber;
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

	public double getDiscountRate() {
		return discountRate;
	}

	public void setDiscountRate(double discountRate) {
		this.discountRate = discountRate;
	}

	public double getDiscountedPrice() {
		return discountedPrice;
	}

	public void setDiscountedPrice(double discountedPrice) {
		this.discountedPrice = discountedPrice;
	}

	public double getServiceFeeRate() {
		return serviceFeeRate;
	}

	public void setServiceFeeRate(double serviceFeeRate) {
		this.serviceFeeRate = serviceFeeRate;
	}

	public double getServiceFee() {
		return serviceFee;
	}

	public void setServiceFee(double serviceFee) {
		this.serviceFee = serviceFee;
	}

	public double getFinalPrice() {
		return finalPrice;
	}

	public void setFinalPrice(double finalPrice) {
		this.finalPrice = finalPrice;
	}

	public Long getArchivedTime() {
		return archivedTime;
	}

	public void setArchivedTime(Long archivedTime) {
		this.archivedTime = archivedTime;
	}

	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public List<OrderItem> getOrderItems() {
		return orderItems;
	}

	public void setOrderItems(List<OrderItem> orderItems) {
		this.orderItems = orderItems;
	}

	public List<PayRecord> getPayRecords() {
		return payRecords;
	}

	public void setPayRecords(List<PayRecord> payRecords) {
		this.payRecords = payRecords;
	}

	public String getJsonHash() {
		return jsonHash;
	}

	public void setJsonHash(String jsonHash) {
		this.jsonHash = jsonHash;
	}

	public BookRecord getBookRecord() {
		return bookRecord;
	}

	public void setBookRecord(BookRecord bookRecord) {
		this.bookRecord = bookRecord;
	}

	public UserAccount getMember() {
		return member;
	}

	public void setMember(UserAccount userAccount) {
		this.member = userAccount;
	}

	public boolean getIsHasSelfOrder() {
		return isHasSelfOrder;
	}

	public void setIsHasSelfOrder(boolean isHasSelfOrder) {
		this.isHasSelfOrder = isHasSelfOrder;
	}

	public String getCreateTimeStr() {
		return Utils.formatShortDateTimeYMDHM(createTime);
	}

	public String getCreateTimeHMStr() {
		return Utils.formatShortDateTimeHM(createTime);
	}

	public void updateJsonHash() {
		if (orderItems == null) {
			orderItems = new ArrayList<OrderItem>();
		}
		if (payRecords == null) {
			payRecords = new ArrayList<PayRecord>();
		}

		ObjectMapper om = new ObjectMapper();
		byte[] jsonBytes;
		try {
			jsonBytes = om.writeValueAsBytes(this);
		} catch (Exception e) {
			setJsonHash(String.valueOf(new Random().nextLong()));
			return;
		}
		org.getopt.util.hash.FNV164 fnv1 = new org.getopt.util.hash.FNV164();
		fnv1.init(jsonBytes, 0, jsonBytes.length);

		setJsonHash(String.valueOf(fnv1.getHash()));
	}

	public static DishOrder fromJsonText(String jsonText) {
		ObjectMapper om = new ObjectMapper();
		try {
			return om.reader(DishOrder.class).readValue(jsonText);
		} catch (Exception e) {
			return null;
		}
	}

	@JsonIgnore
	public List<DishOrderTag> getDishOrderTags() {
		return dishOrderTags;
	}

	@JsonIgnore
	public void setDishOrderTags(List<DishOrderTag> dishOrderTags) {
		this.dishOrderTags = dishOrderTags;
	}

	// 做法tags
	@Transient
	public List<DishOrderTag> getTags() {

		List<DishOrderTag> tags = new ArrayList<DishOrderTag>();
		if (getDishOrderTags() == null) {
			return tags;
		}

		for (DishOrderTag dishOrderTag : getDishOrderTags()) {
			if (dishOrderTag.getDishTagId() != null) {
				if (dishOrderTag.getDishId() == null) {
					tags.add(dishOrderTag);
				}
			}
		}
		return tags;
	}

	public void setTags(List<DishOrderTag> tags) {
		if (this.dishOrderTags == null) {
			this.dishOrderTags = new ArrayList<DishOrderTag>();
		}

		if (tags != null) {
			this.dishOrderTags.addAll(tags);
		}
	}

	// 手写做法tags
	@Transient
	public List<DishOrderTag> getFreeTags() {

		List<DishOrderTag> freeTags = new ArrayList<DishOrderTag>();
		if (getDishOrderTags() == null) {
			return freeTags;
		}

		for (DishOrderTag dishOrderTag : getDishOrderTags()) {
			if (dishOrderTag.getDishTagId() == null) {
				freeTags.add(dishOrderTag);
			}
		}
		return freeTags;
	}

	public void setFreeTags(List<DishOrderTag> freeTags) {
		if (this.dishOrderTags == null) {
			this.dishOrderTags = new ArrayList<DishOrderTag>();
		}

		if (freeTags != null) {
			this.dishOrderTags.addAll(freeTags);
		}
	}

	@JsonIgnore
	public String getTagText() {
		if (this.getDishOrderTags() == null) {
			return "";
		}

		String tagText = "";
		for (int i = 0; i < this.getDishOrderTags().size(); i++) {
			DishOrderTag tag = dishOrderTags.get(i);
			String amountAndUnitStr = "[" + Utils.formatAmount(tag.getAmount())
					+ tag.getUnit() + "]";
			if (!amountAndUnitStr.equals("[1]")) {
				tagText += amountAndUnitStr;
			}

			tagText += tag.getName();
			if (i < dishOrderTags.size() - 1) {
				tagText += ";";
			}
		}

		return tagText;
	}

	@Override
	public String toString() {
		String dishOrderString = "单号:"
				+ String.valueOf(this.getId()).substring(8) + "/桌号:"
				+ this.getDeskName();
		dishOrderString += "," + getTagText();
		return dishOrderString;
	}

	public String getOpenId() {
		return openId;
	}

	public void setOpenId(String openId) {
		this.openId = openId;
	}

	public Long getBookRecordId() {
		return bookRecordId;
	}

	public void setBookRecordId(Long bookRecordId) {
		this.bookRecordId = bookRecordId;
	}

	public Double getPrePay() {
		return prePay;
	}

	public void setPrePay(Double prePay) {
		this.prePay = prePay;
	}

	public Long getExpectedArriveTime() {
		return expectedArriveTime;
	}

	public void setExpectedArriveTime(Long expectedArriveTime) {
		this.expectedArriveTime = expectedArriveTime;
	}

	public boolean getPrePrintCheckoutNotePrinted() {
		return prePrintCheckoutNotePrinted;
	}

	public void setPrePrintCheckoutNotePrinted(
			boolean prePrintCheckoutNotePrinted) {
		this.prePrintCheckoutNotePrinted = prePrintCheckoutNotePrinted;
	}

	@JsonIgnore
	public String payRecordsText() {
		String str = "{ ";
		if (payRecords != null && payRecords.size() > 0) {
			for (PayRecord pr : payRecords) {
				str = str + pr.getTypeName() + ":" + pr.getAmount() + " ";
			}
		}
		str += "}";
		return str;
	}
}

package helen.catering.model.entities;

import helen.catering.Utils;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Transient;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
public class BookRecord implements Serializable {

	private static final long serialVersionUID = 1L;

	@Transient
	public final static int RESERVATION_CANCELED = 0;// 预订取消
	@Transient
	public final static int RESERVATION_BOOKING = 1;// 预订中
	@Transient
	public final static int RESERVATION_CONFIRMED = 2;// 店家确认

	@Id
	private long id;
	@Column
	private long timeRangeId;
	@Column
	private long resourceId;
	@Column
	private long customerUserId;
	@Column
	private String resourceName;
	@Column
	private String contactName;
	@Column
	private String contactTel;
	@Column
	private Long expectedArriveTime;
	@Column
	private long createTime;
	@Column
	private int state;
	@Column
	private long storeId;
	@Column
	private int count;
	@Column
	private String memo;
	@Column
	private Boolean isServingArrived;

	@Transient
	private DishOrder dishOrder;

	@Transient
	private boolean hadBookingDishOrder;

	@Transient
	private String expectedArriveTimeToStr;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getTimeRangeId() {
		return timeRangeId;
	}

	public void setTimeRangeId(long timeRangeId) {
		this.timeRangeId = timeRangeId;
	}

	public long getResourceId() {
		return resourceId;
	}

	public void setResourceId(long resourceId) {
		this.resourceId = resourceId;
	}

	public long getCustomerUserId() {
		return customerUserId;
	}

	public void setCustomerUserId(long customerUserId) {
		this.customerUserId = customerUserId;
	}

	public String getContactName() {
		return contactName;
	}

	public void setContactName(String contactName) {
		this.contactName = contactName;
	}

	public String getResourceName() {
		return resourceName;
	}

	public void setResourceName(String resourceName) {
		this.resourceName = resourceName;
	}

	public String getContactTel() {
		return contactTel;
	}

	public void setContactTel(String contactTel) {
		this.contactTel = contactTel;
	}

	public Long getExpectedArriveTime() {
		return expectedArriveTime;
	}

	public void setExpectedArriveTime(Long expectedArriveTime) {
		this.expectedArriveTime = expectedArriveTime;
	}

	public long getCreateTime() {
		return createTime;
	}

	public void setCreateTime(long createTime) {
		this.createTime = createTime;
	}

	public int getState() {
		return state;
	}

	public void setState(int state) {
		this.state = state;
	}

	public long getStoreId() {
		return storeId;
	}

	public void setStoreId(long storeId) {
		this.storeId = storeId;
	}

	public String getExpectedArriveTimeToStr() {
		return Utils.formatShortDateTimeYMDHM(expectedArriveTime);
	}

	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
	}

	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public Boolean getIsServingArrived() {
		return isServingArrived;
	}

	public void setIsServingArrived(Boolean isServingArrived) {
		this.isServingArrived = isServingArrived;
	}

	public DishOrder getDishOrder() {
		return dishOrder;
	}

	public void setDishOrder(DishOrder dishOrder) {
		this.dishOrder = dishOrder;
	}

	public boolean getHadBookingDishOrder() {
		return hadBookingDishOrder;
	}

	public void setHadBookingDishOrder(boolean hadBookingDishOrder) {
		this.hadBookingDishOrder = hadBookingDishOrder;
	}
}

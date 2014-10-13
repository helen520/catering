package helen.catering.model.entities;

import helen.catering.Utils;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

@Entity
@Table(name = "CouponTemplate")
public class CouponTemplate {
	@Transient
	public final static int TRIGGEREVENT_OPEN_CARD = 1;
	@Transient
	public final static int TRIGGEREVENT_MANUAL_OPERATION = 2;

	@Id
	private long id;
	@Column
	private long storeId;
	@Column
	private boolean validFromNow;
	@Column
	private Integer validDays;
	@Column
	private long startDate;
	@Column
	private long endDate;
	@Column
	private Long CreateTime;
	@Column
	private int triggerEvent;
	@Column
	private String title;
	@Column
	private String subTitle;
	@Column
	private String text;
	@Column
	private double value;
	@Transient
	private int amount;
	@Transient
	private int alreadySendAmount;
	@Transient
	private String startDateStr;
	@Transient
	private String endDateStr;

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

	public boolean getValidFromNow() {
		return validFromNow;
	}

	public void setValidFromNow(boolean validFromNow) {
		this.validFromNow = validFromNow;
	}

	public Integer getValidDays() {
		return validDays;
	}

	public void setValidDays(Integer validDays) {
		this.validDays = validDays;
	}

	public long getStartDate() {
		return startDate;
	}

	public void setStartDate(long startDate) {
		this.startDate = startDate;
	}

	public long getEndDate() {
		return endDate;
	}

	public void setEndDate(long endDate) {
		this.endDate = endDate;
	}

	public Long getCreateTime() {
		return CreateTime;
	}

	public void setCreateTime(Long createTime) {
		CreateTime = createTime;
	}

	public int getTriggerEvent() {
		return triggerEvent;
	}

	public void setTriggerEvent(int triggerEvent) {
		this.triggerEvent = triggerEvent;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getSubTitle() {
		return subTitle;
	}

	public void setSubTitle(String subTitle) {
		this.subTitle = subTitle;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public double getValue() {
		return value;
	}

	public void setValue(double value) {
		this.value = value;
	}

	public int getAmount() {
		return amount;
	}

	public void setAmount(int amount) {
		this.amount = amount;
	}

	public int getAlreadySendAmount() {
		return alreadySendAmount;
	}

	public void setAlreadySendAmount(int alreadySendAmount) {
		this.alreadySendAmount = alreadySendAmount;
	}

	public static List<CouponTemplate> fromJsonText(String jsonText) {
		ObjectMapper om = new ObjectMapper();
		try {
			return om.readValue(jsonText,
					new TypeReference<List<CouponTemplate>>() {
					});
		} catch (Exception e) {
			return null;
		}
	}

	public String getStartDateStr() {
		return Utils.formatShortDateTimeYMD(startDate);
	}

	public String getEndDateStr() {
		return Utils.formatShortDateTimeYMD(endDate);
	}

}
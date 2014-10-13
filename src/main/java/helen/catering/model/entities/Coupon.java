package helen.catering.model.entities;

import helen.catering.Utils;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name = "Coupon")
public class Coupon {
	@Transient
	public final static int STATE_ENABLED = 0;// 可使用
	@Transient
	public final static int STATE_DISABLED = 1;// 已过期或删除

	@Id
	private long id;

	@Column
	private long storeId;

	@Column
	private long userAccountId;

	@Column
	private long startDate;

	@Column
	private long endDate;

	@Column
	private String title;

	@Column
	private String subTitle;

	@Column
	private String text;

	@Column
	private double value;

	@Column
	private int state;

	@Column
	private boolean notReaded;

	@Transient
	private String startDateStr;

	@Transient
	private String validDate;

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

	public long getUserAccount() {
		return userAccountId;
	}

	public void setUserAccount(long userAccountId) {
		this.userAccountId = userAccountId;
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

	public int getState() {
		return state;
	}

	public void setState(int status) {
		this.state = status;
	}

	public boolean getNotReaded() {
		return notReaded;
	}

	public void setNotReaded(boolean notReaded) {
		this.notReaded = notReaded;
	}

	public String getStartDateStr() {
		return Utils.formatShortDateTimeYMD(startDate);
	}

	public String getValidDate() {
		return Utils.formatShortDateTimeYMD(endDate);
	}
}
package helen.catering.model.entities;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Transient;

@Entity
public class Employee implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	private long id;

	@Column
	private long storeId;

	@Column
	private long userAccountId;

	@Column
	private String name;

	@Column
	private String job;

	@Column
	private String workNumber;

	@Column
	private double lowestDiscountRate;

	@Column
	private int level;

	@Column
	private String smartCardNo;

	@Column
	private boolean isShowBlockDishView;

	@Column
	private boolean canRestoreDishOrder;

	@Column
	private boolean canPreprintCheckoutNote;

	@Column
	private boolean canCancelOrderItem;

	@Column
	private boolean canViewReport;

	@Transient
	private String loginNo;

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

	public long getUserAccountId() {
		return userAccountId;
	}

	public void setUserAccountId(long userAccountId) {
		this.userAccountId = userAccountId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getJob() {
		return job;
	}

	public void setJob(String job) {
		this.job = job;
	}

	public String getWorkNumber() {
		return workNumber;
	}

	public void setWorkNumber(String workNumber) {
		this.workNumber = workNumber;
	}

	public double getLowestDiscountRate() {
		return lowestDiscountRate;
	}

	public void setLowestDiscountRate(double lowestDiscountRate) {
		this.lowestDiscountRate = lowestDiscountRate;
	}

	public int getLevel() {
		return level;
	}

	public void setLevel(int level) {
		this.level = level;
	}

	public String getSmartCardNo() {
		return smartCardNo;
	}

	public void setSmartCardNo(String smartCardNo) {
		this.smartCardNo = smartCardNo;
	}

	public boolean getIsShowBlockDishView() {
		return isShowBlockDishView;
	}

	public void setIsShowBlockDishView(boolean isShowBlockDishView) {
		this.isShowBlockDishView = isShowBlockDishView;
	}

	public boolean getCanRestoreDishOrder() {
		return canRestoreDishOrder;
	}

	public void setCanRestoreDishOrder(boolean canRestoreDishOrder) {
		this.canRestoreDishOrder = canRestoreDishOrder;
	}

	public boolean getCanPreprintCheckoutNote() {
		return canPreprintCheckoutNote;
	}

	public void setCanPreprintCheckoutNote(boolean canPreprintCheckoutNote) {
		this.canPreprintCheckoutNote = canPreprintCheckoutNote;
	}

	public boolean getCanCancelOrderItem() {
		return canCancelOrderItem;
	}

	public void setCanCancelOrderItem(boolean canCancelOrderItem) {
		this.canCancelOrderItem = canCancelOrderItem;
	}

	public boolean getCanViewReport() {
		return canViewReport;
	}

	public void setCanViewReport(boolean canViewReport) {
		this.canViewReport = canViewReport;
	}

	public String getLoginNo() {
		return loginNo;
	}

	public void setLoginNo(String loginNo) {
		this.loginNo = loginNo;
	}

}

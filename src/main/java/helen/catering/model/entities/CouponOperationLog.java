package helen.catering.model.entities;

import helen.catering.Utils;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Transient;

@Entity
public class CouponOperationLog implements Serializable {
	public final static String COUPONG_OP_SEND_COUPON = "COUPONG_OP_SEND_COUPON";
	public final static String COUPONG_OP_USING_COUPON = "COUPONG_OP_USING_COUPON";

	private static final long serialVersionUID = 1L;

	@Id
	private long id;

	@Column
	private long operatorEmployeeId;

	@Column
	private long userAccountId;

	@Column
	private long couponId;

	@Column
	private long createTime;

	@Column
	private String operationType;

	@Column
	private String dataSnapShot;

	@Column
	private long storeId;

	@Transient
	private String createTimeStr;

	@Transient
	private UserAccount Member;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getOperatorEmployeeId() {
		return operatorEmployeeId;
	}

	public void setOperatorEmployeeId(long operatorEmployeeId) {
		this.operatorEmployeeId = operatorEmployeeId;
	}

	public long getUserAccountId() {
		return userAccountId;
	}

	public void setUserAccountId(long userAccountId) {
		this.userAccountId = userAccountId;
	}

	public long getCouponId() {
		return couponId;
	}

	public void setCouponId(long couponId) {
		this.couponId = couponId;
	}

	public long getCreateTime() {
		return createTime;
	}

	public void setCreateTime(long createTime) {
		this.createTime = createTime;
	}

	public String getOperationType() {
		return operationType;
	}

	public void setOperationType(String operationType) {
		this.operationType = operationType;
	}

	public String getDataSnapShot() {
		return dataSnapShot;
	}

	public void setDataSnapShot(String dataSnapShot) {
		this.dataSnapShot = dataSnapShot;
	}

	public long getStoreId() {
		return storeId;
	}

	public void setStoreId(long storeId) {
		this.storeId = storeId;
	}

	public String getCreateTimeStr() {
		return Utils.formatShortDateTimeYMDHM(createTime);
	}

	public UserAccount getMember() {
		return Member;
	}

	public void setMember(UserAccount member) {
		Member = member;
	}
}

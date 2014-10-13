package helen.catering.model.entities;

import helen.catering.Utils;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Transient;

@Entity
public class BalanceOperationLog implements Serializable {
	public final static String BALANCE_OP_RECHARGE = "BALANCE_OP_RECHARGE";
	public final static String BALANCE_OP_PREPAY_DISHORDER = "BALANCE_OP_PREPAY_DISHORDER";
	public final static String BALANCE_OP_PAY_FOR_DISHORDER = "BALANCE_OP_PAY_FOR_DISHORDER";
	public final static String BALANCE_OP_RETURN_USED_BALANCE = "BALANCE_OP_RETURN_USED_BALANCE";

	private static final long serialVersionUID = 1L;

	@Id
	private long id;

	@Column
	private long operatorEmployeeId;

	@Column
	private Long userAccountId;

	@Column
	private Long dishOrderId;

	@Column
	private long createTime;

	@Column
	private String operationType;

	@Column
	private String dataSnapShot;

	@Column
	private Long storeId;

	@Transient
	private String createTimeStr;

	@Transient
	private Employee operatorEmployee;

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

	public Long getUserAccountId() {
		return userAccountId;
	}

	public void setUserAccountId(Long userAccountId) {
		this.userAccountId = userAccountId;
	}

	public Long getDishOrderId() {
		return dishOrderId;
	}

	public void setDishOrderId(Long dishOrderId) {
		this.dishOrderId = dishOrderId;
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

	public Long getStoreId() {
		return storeId;
	}

	public void setStoreId(Long storeId) {
		this.storeId = storeId;
	}

	public String getCreateTimeStr() {
		return Utils.formatShortDateTimeYMDHM(createTime);
	}

	public Employee getOperatorEmployee() {
		return operatorEmployee;
	}

	public void setOperatorEmployee(Employee operatorEmployee) {
		this.operatorEmployee = operatorEmployee;
	}

	public UserAccount getMember() {
		return Member;
	}

	public void setMember(UserAccount member) {
		Member = member;
	}
}

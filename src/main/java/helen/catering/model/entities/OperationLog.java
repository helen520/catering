package helen.catering.model.entities;

import helen.catering.Utils;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Transient;

@Entity
public class OperationLog implements Serializable {
	public final static String OP_CANCEL_ORDERITEM = "OP_CANCEL_ORDERITEM";
	public final static String OP_CANCEL_DISHORDER = "OP_CANCEL_DISHORDER";
	public final static String OP_CREATE_DISHORDER = "OP_CREATE_DISHORDER";
	public final static String OP_SUBMIT_DISHORDER = "OP_SUBMIT_DISHORDER";
	public final static String OP_APPLY_DISCOUNT_RULE = "OP_APPLY_DISCOUNT_RULE";
	public final static String OP_CHANGE_DESK = "OP_CHANGE_DESK";
	public final static String OP_CHANGE_ORDERITEM = "OP_CHANGE_ORDERITEM";
	public final static String OP_MERGE_DESK = "OP_MERGE_DESK";
	public final static String OP_PAY_DISHORDER = "OP_PAY_DISHORDER";
	public final static String OP_UPDATE_CUSTOMER_COUNT = "OP_UPDATE_CUSTOMER_COUNT";
	public final static String OP_RESTORE_DISHORDER = "OP_RESTORE_DISHORDER";
	public final static String OP_RESTORE_BOOKING_DISHORDER = "OP_RESTORE_BOOKING_DISHORDER";

	private static final long serialVersionUID = 1L;

	@Id
	private long id;

	@Column
	private long storeId;

	@Column
	private long operatorEmployeeId;

	@Column
	private Long userAccountId;

	@Column
	private Long dishOrderId;

	@Column
	private Long orderItemId;

	@Column
	private long createTime;

	@Column
	private String operationType;

	@Column
	private String action;

	@Column
	private String dataSnapShot;

	@Column
	private String text;

	@Transient
	private String createTimeStr;

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

	public Long getOrderItemId() {
		return orderItemId;
	}

	public void setOrderItemId(Long orderItemId) {
		this.orderItemId = orderItemId;
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

	public String getAction() {
		return action;
	}

	public void setAction(String action) {
		this.action = action;
	}

	public String getDataSnapShot() {
		return dataSnapShot;
	}

	public void setDataSnapShot(String dataSnapShot) {
		this.dataSnapShot = dataSnapShot;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getCreateTimeStr() {
		return Utils.formatShortDateTimeYMDHM(createTime);
	}
}

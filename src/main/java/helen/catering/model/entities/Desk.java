package helen.catering.model.entities;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Desk implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	private long id;

	@Column
	private long storeId;

	@Column
	private String name;

	@Column
	private String groupName;

	@Column
	private int number;

	@Column
	private boolean chargeVIPFee;

	@Column
	private double serviceFeeRate;

	@Column
	private boolean forTesting;

	@Column
	private boolean enabled;

	@Column
	private int sort;

	@Column
	private Long posPrinterId;

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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getGroupName() {
		return groupName;
	}

	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}

	public int getNumber() {
		return number;
	}

	public void setNumber(int number) {
		this.number = number;
	}

	public boolean getChargeVIPFee() {
		return chargeVIPFee;
	}

	public void setChargeVIPFee(boolean chargeVIPFee) {
		this.chargeVIPFee = chargeVIPFee;
	}

	public double getServiceFeeRate() {
		return serviceFeeRate;
	}

	public void setServiceFeeRate(double serviceFeeRate) {
		this.serviceFeeRate = serviceFeeRate;
	}

	public boolean getForTesting() {
		return forTesting;
	}

	public void setForTesting(boolean forTesting) {
		this.forTesting = forTesting;
	}

	public boolean getEnabled() {
		return enabled;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}

	public int getSort() {
		return sort;
	}

	public void setSort(int sort) {
		this.sort = sort;
	}

	public Long getPosPrinterId() {
		return posPrinterId;
	}

	public void setPosPrinterId(Long posPrinterId) {
		this.posPrinterId = posPrinterId;
	}

}

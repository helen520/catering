package helen.catering.model.entities;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class NamedValue implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public final static String TYPE_DISCOUNT_RATE = "DISCOUNT_RATE";
	public final static String TYPE_SERVICE_FEE_RATE = "SERVICE_FEE_RATE";
	public final static String TYPE_CANCEL_REASON = "CANCEL_REASON";

	@Id
	private long id;

	@Column
	private long storeId;

	@Column
	String type;

	@Column
	private String name;

	@Column
	private double value;

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

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public double getValue() {
		return value;
	}

	public void setValue(double value) {
		this.value = value;
	}
}

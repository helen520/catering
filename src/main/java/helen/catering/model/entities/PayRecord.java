package helen.catering.model.entities;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
public class PayRecord implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	private long id;

	@Column
	private Long paymentTypeId;

	@Column
	private String typeName;

	@Column
	private double exchangeRate;

	@Column
	private double amount;

	@Column
	private boolean isPrepaid;

	@Column
	private Long couponId;

	@ManyToOne
	@JoinColumn(name = "DishOrderId")
	private DishOrder dishOrder;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public Long getPaymentTypeId() {
		return paymentTypeId;
	}

	public void setPaymentTypeId(Long paymentTypeId) {
		this.paymentTypeId = paymentTypeId;
	}

	public String getTypeName() {
		return typeName;
	}

	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}

	public double getExchangeRate() {
		return exchangeRate;
	}

	public void setExchangeRate(double exchangeRate) {
		this.exchangeRate = exchangeRate;
	}

	public double getAmount() {
		return amount;
	}

	public void setAmount(double amount) {
		this.amount = amount;
	}

	public boolean isPrepaid() {
		return isPrepaid;
	}

	public void setPrepaid(boolean isPrepaid) {
		this.isPrepaid = isPrepaid;
	}

	public Long getCouponId() {
		return couponId;
	}

	public void setCouponId(Long couponId) {
		this.couponId = couponId;
	}

	@JsonIgnore
	public DishOrder getDishOrder() {
		return dishOrder;
	}

	@JsonIgnore
	public void setDishOrder(DishOrder dishOrder) {
		this.dishOrder = dishOrder;
	}

	public static List<PayRecord> fromJsonText(String jsonText) {
		ObjectMapper om = new ObjectMapper();
		try {
			return om.readValue(jsonText, new TypeReference<List<PayRecord>>() {
			});
		} catch (Exception e) {
			return null;
		}
	}
}

package helen.catering.model.entities;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
public class OrderItemTag implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	private long id;

	@Column
	private Long dishId;

	@Column
	private Long dishTagId;

	@Column
	private Long departmentId;

	@Column
	private String name;

	@Column
	private String unit;

	@Column
	private double priceDelta;

	@Column
	private double amount;

	@ManyToOne
	@JoinColumn(name = "OrderItemId")
	private OrderItem orderItem;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public Long getDishId() {
		return dishId;
	}

	public void setDishId(Long dishId) {
		this.dishId = dishId;
	}

	public Long getDishTagId() {
		return dishTagId;
	}

	public void setDishTagId(Long dishTagId) {
		this.dishTagId = dishTagId;
	}

	public Long getDepartmentId() {
		return departmentId;
	}

	public void setDepartmentId(Long departmentId) {
		this.departmentId = departmentId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public double getPriceDelta() {
		return priceDelta;
	}

	public void setPriceDelta(double priceDelta) {
		this.priceDelta = priceDelta;
	}

	public double getAmount() {
		return amount;
	}

	public void setAmount(double amount) {
		this.amount = amount;
	}

	@JsonIgnore
	public OrderItem getOrderItem() {
		return orderItem;
	}

	@JsonIgnore
	public void setOrderItem(OrderItem orderItem) {
		this.orderItem = orderItem;
	}
}

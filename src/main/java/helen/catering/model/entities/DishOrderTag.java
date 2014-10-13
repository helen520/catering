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
public class DishOrderTag implements Serializable {
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
	private double amount;

	@ManyToOne
	@JoinColumn(name = "DishOrderId")
	private DishOrder dishOrder;

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

	public double getAmount() {
		return amount;
	}

	public void setAmount(double amount) {
		this.amount = amount;
	}

	@JsonIgnore
	public DishOrder getDishOrder() {
		return dishOrder;
	}

	@JsonIgnore
	public void setDishOrder(DishOrder dishOrder) {
		this.dishOrder = dishOrder;
	}
}

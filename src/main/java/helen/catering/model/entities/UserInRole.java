package helen.catering.model.entities;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
public class UserInRole implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	public final static String ROLE_ADMIN = "ROLE_ADMIN";
	public final static String ROLE_DISH_ORDER_CREATOR = "ROLE_DISH_ORDER_CREATOR";
	public final static String ROLE_CANCEL_ORDERITEM_AUDITOR = "ROLE_CANCEL_ORDERITEM_AUDITOR";
	public final static String ROLE_RESUME_DISHORDER_AUDITOR = "ROLE_RESUME_DISHORDER_AUDITOR";	
	public final static String ROLE_CASHIER = "ROLE_CASHIER";
	public final static String ROLE_STORE_DATA_EDITOR = "ROLE_STORE_DATA_EDITOR";
	public final static String ROLE_DISH_EDITOR = "ROLE_DISH_EDITOR";
	public final static String ROLE_REPORT_READER = "ROLE_REPORT_READER";	

	@Id
	private long id;

	@Column
	private String role;

	@ManyToOne
	@JoinColumn(name = "UserAccountId")
	private UserAccount userAccount;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}
}

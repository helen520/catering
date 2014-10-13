package helen.catering.model.entities;

import helen.catering.Utils;

import java.io.Serializable;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Transient;

import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.ObjectMapper;

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserAccount implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	private long id;

	@Column
	private Long storeId;

	@Column
	private String loginName;

	@Column
	private String password;

	@Column
	private String name;

	@Column
	private Long lastLogin;

	@Column
	private String mobileNo;

	@Column
	private String weChatOpenId;

	@Column
	private String memberCardNo;

	@Column
	private String captcha;

	@Column
	private double balance;

	@Column
	private double point;

	@Column
	private double discountRate;

	@Column
	private long createTime;

	@Transient
	private String createTimeStr;

	@OneToMany(mappedBy = "userAccount", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	private List<UserInRole> roles;

	@Transient
	private List<Coupon> Coupons;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public Long getStoreId() {
		return storeId;
	}

	public void setStoreId(Long storeId) {
		this.storeId = storeId;
	}

	public String getLoginName() {
		return loginName;
	}

	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}

	@JsonIgnore
	public String getPassword() {
		return password;
	}

	@JsonIgnore
	public void setPassword(String password) {
		this.password = password;
	}

	public String getName() {
		if (name != null) {
			return name;
		} else
			return "";
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getLastLogin() {
		return lastLogin;
	}

	public void setLastLogin(Long lastLogin) {
		this.lastLogin = lastLogin;
	}

	public String getMobileNo() {
		if (mobileNo != null) {
			return mobileNo;
		} else
			return "";
	}

	public void setMobileNo(String mobileNo) {
		this.mobileNo = mobileNo;
	}

	public String getWeChatOpenId() {
		return weChatOpenId;
	}

	public void setWeChatOpenId(String weChatOpenId) {
		this.weChatOpenId = weChatOpenId;
	}

	public String getMemberCardNo() {
		return memberCardNo;
	}

	public void setMemberCardNo(String memberCardNo) {
		this.memberCardNo = memberCardNo;
	}

	public String getCaptcha() {
		return captcha;
	}

	public void setCaptcha(String captcha) {
		this.captcha = captcha;
	}

	public double getBalance() {
		return balance;
	}

	public void setBalance(double balance) {
		this.balance = balance;
	}

	public double getPoint() {
		return point;
	}

	public void setPoint(double point) {
		this.point = point;
	}

	public double getDiscountRate() {
		return discountRate;
	}

	public void setDiscountRate(double discountRate) {
		this.discountRate = discountRate;
	}

	public long getCreateTime() {
		return createTime;
	}

	public void setCreateTime(long createTime) {
		this.createTime = createTime;
	}

	public String getCreateTimeStr() {
		return Utils.formatShortDateTimeYMDHM(createTime);
	}

	@JsonIgnore
	public List<UserInRole> getRoles() {
		return roles;
	}

	@JsonIgnore
	public void setRoles(List<UserInRole> roles) {
		this.roles = roles;
	}

	public List<Coupon> getCoupons() {
		return Coupons;
	}

	public void setCoupons(List<Coupon> coupons) {
		Coupons = coupons;
	}

	public static UserAccount fromJsonText(String jsonText) {
		ObjectMapper om = new ObjectMapper();
		try {
			return om.reader(UserAccount.class).readValue(jsonText);
		} catch (Exception e) {
			return null;
		}
	}
}

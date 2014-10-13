package helen.catering.model.entities;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Store implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	private long id;

	@Column
	private Long headStoreId;

	@Column
	private String name;

	@Column
	private String address;

	@Column
	private String discountRateCSV;

	@Column
	private String serviceFeeRateCSV;

	@Column
	private String defaultDishUnitName;

	@Column
	private String suspendedText;

	@Column
	private String customerCountHintText;

	@Column
	private long checkoutPosPrinterId;

	@Column
	private long backupCheckoutPosPrintId;

	@Column
	private Integer skipPayingState;

	@Column
	private String dishPictureBaseUrl;

	@Column
	private String description;

	@Column
	private String defaultPaymentTypeName;

	@Column
	private String memberCardBgPath;

	@Column
	private String pointingRules;

	@Column
	private String cashAccountRules;

	@Column
	private String memberCardRules;

	@Column
	private String openId;

	@Column
	private String weChatPicMsg;

	@Column
	private String realmName;

	@Column
	private boolean autoPrintCustomerNote;

	@Column
	private boolean noShowPriceInCustomerNote;

	@Column
	private String unibizURL;

	@Column
	private double pointRate;

	@Column
	private boolean includedCouponValueInPoint;

	@Column
	private boolean isDoubleSizeFont;

	@Column
	private boolean isInstantPay;

	@Column
	private boolean isNormal;

	@Column
	private String storeActivity;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public Long getHeadStoreId() {
		return headStoreId;
	}

	public void setHeadStoreId(Long headStoreId) {
		this.headStoreId = headStoreId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getDiscountRateCSV() {
		return discountRateCSV;
	}

	public void setDiscountRateCSV(String discountRateCSV) {
		this.discountRateCSV = discountRateCSV;
	}

	public String getServiceFeeRateCSV() {
		return serviceFeeRateCSV;
	}

	public void setServiceFeeRateCSV(String serviceFeeRateCSV) {
		this.serviceFeeRateCSV = serviceFeeRateCSV;
	}

	public String getDefaultDishUnitName() {
		return defaultDishUnitName;
	}

	public void setDefaultDishUnitName(String defaultDishUnitName) {
		this.defaultDishUnitName = defaultDishUnitName;
	}

	public String getSuspendedText() {
		return suspendedText;
	}

	public void setSuspendedText(String suspendedText) {
		this.suspendedText = suspendedText;
	}

	public String getCustomerCountHintText() {
		return customerCountHintText;
	}

	public void setCustomerCountHintText(String customerCountHintText) {
		this.customerCountHintText = customerCountHintText;
	}

	public long getCheckoutPosPrinterId() {
		return checkoutPosPrinterId;
	}

	public void setCheckoutPosPrinterId(long checkoutPosPrinterId) {
		this.checkoutPosPrinterId = checkoutPosPrinterId;
	}

	public long getBackupCheckoutPosPrintId() {
		return backupCheckoutPosPrintId;
	}

	public void setBackupCheckoutPosPrintId(long backupCheckoutPosPrintId) {
		this.backupCheckoutPosPrintId = backupCheckoutPosPrintId;
	}

	public Integer getSkipPayingState() {
		return skipPayingState;
	}

	public void setSkipPayingState(Integer skipPayingState) {
		this.skipPayingState = skipPayingState;
	}

	public String getDishPictureBaseUrl() {
		return dishPictureBaseUrl;
	}

	public void setDishPictureBaseUrl(String dishPictureBaseUrl) {
		this.dishPictureBaseUrl = dishPictureBaseUrl;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getDefaultPaymentTypeName() {
		return defaultPaymentTypeName;
	}

	public void setDefaultPaymentTypeName(String defaultPaymentTypeName) {
		this.defaultPaymentTypeName = defaultPaymentTypeName;
	}

	public String getMemberCardBgPath() {
		return memberCardBgPath;
	}

	public void setMemberCardBgPath(String memberCardBgPath) {
		this.memberCardBgPath = memberCardBgPath;
	}

	public String getPointingRules() {
		return pointingRules;
	}

	public void setPointingRules(String pointingRules) {
		this.pointingRules = pointingRules;
	}

	public String getCashAccountRules() {
		return cashAccountRules;
	}

	public void setCashAccountRules(String cashAccountRules) {
		this.cashAccountRules = cashAccountRules;
	}

	public String getMemberCardRules() {
		return memberCardRules;
	}

	public void setMemberCardRules(String memberCardRules) {
		this.memberCardRules = memberCardRules;
	}

	public String getOpenId() {
		return openId;
	}

	public void setOpenId(String openId) {
		this.openId = openId;
	}

	public String getWeChatPicMsg() {
		return weChatPicMsg;
	}

	public void setWeChatPicMsg(String weChatPicMsg) {
		this.weChatPicMsg = weChatPicMsg;
	}

	public String getRealmName() {
		return realmName;
	}

	public void setRealmName(String realmName) {
		this.realmName = realmName;
	}

	public boolean getAutoPrintCustomerNote() {
		return autoPrintCustomerNote;
	}

	public void setAutoPrintCustomerNote(boolean autoPrintCustomerNote) {
		this.autoPrintCustomerNote = autoPrintCustomerNote;
	}

	public boolean getNoShowPriceInCustomerNote() {
		return noShowPriceInCustomerNote;
	}

	public void setNoShowPriceInCustomerNote(boolean noShowPriceInCustomerNote) {
		this.noShowPriceInCustomerNote = noShowPriceInCustomerNote;
	}

	public String getUnibizURL() {
		return unibizURL;
	}

	public void setUnibizURL(String unibizURL) {
		this.unibizURL = unibizURL;
	}

	public double getPointRate() {
		return pointRate;
	}

	public void setPointRate(double pointRate) {
		this.pointRate = pointRate;
	}

	public boolean getIncludedCouponValueInPoint() {
		return includedCouponValueInPoint;
	}

	public void setIncludedCouponValueInPoint(boolean includedCouponValueInPoint) {
		this.includedCouponValueInPoint = includedCouponValueInPoint;
	}

	public boolean getIsDoubleSizeFont() {
		return isDoubleSizeFont;
	}

	public void setIsDoubleSizeFont(boolean isDoubleSizeFont) {
		this.isDoubleSizeFont = isDoubleSizeFont;
	}

	public boolean getIsInstantPay() {
		return isInstantPay;
	}

	public void setIsInstantPay(boolean isInstantPay) {
		this.isInstantPay = isInstantPay;
	}

	public boolean getIsNormal() {
		return isNormal;
	}

	public void setIsNormal(boolean isNormal) {
		this.isNormal = isNormal;
	}

	public String getStoreActivity() {
		return storeActivity;
	}

	public void setStoreActivity(String storeActivity) {
		this.storeActivity = storeActivity;
	}
}

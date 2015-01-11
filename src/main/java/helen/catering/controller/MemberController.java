package helen.catering.controller;

import helen.catering.Utils;
import helen.catering.model.entities.BalanceOperationLog;
import helen.catering.model.entities.Coupon;
import helen.catering.model.entities.CouponTemplate;
import helen.catering.model.entities.MemberPolicy;
import helen.catering.model.entities.NamedValue;
import helen.catering.model.entities.Store;
import helen.catering.model.entities.UserAccount;
import helen.catering.service.BalanceOperationLogService;
import helen.catering.service.CouponOperationLogService;
import helen.catering.service.DishOrderPrintingService;
import helen.catering.service.ServiceException;
import helen.catering.service.StoreDataService;
import helen.catering.service.UserService;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("member")
public class MemberController {

	@Autowired
	UserService _userService;

	@Autowired
	StoreDataService _storeDataService;

	@Autowired
	BalanceOperationLogService _balanceOperationLogService;

	@Autowired
	DishOrderPrintingService _dishOrderPrintingService;

	@Autowired
	CouponOperationLogService _couponOperationLogService;

	@RequestMapping(value = "memberPage")
	public ModelAndView memberPage(
			@RequestParam(value = "storeId") long storeId,
			@RequestParam(value = "userId", defaultValue = "0") Long userId,
			@RequestParam(value = "openId", defaultValue = "") String openId,
			@RequestParam(value = "isBooking", defaultValue = "false") boolean isBooking,
			@RequestParam(value = "isOrdering", defaultValue = "false") boolean isOrdering) {
		ModelAndView mav = new ModelAndView();
		mav.setViewName("memberPage");
		UserAccount userAccount = null;

		if (userId != 0) {
			userAccount = _userService.getUserAccountById(userId);
		} else if (openId != "") {
			userAccount = _userService.getUserAccountByOpenId(openId);
		}

		Store store = _storeDataService.getStoreById(storeId);

		mav.addObject("store", store);
		mav.addObject("isBooking", isBooking);
		mav.addObject("isOrdering", isOrdering);
		if (userAccount == null || userAccount.getMemberCardNo() == null
				|| userAccount.getMemberCardNo() == null) {
			if (userAccount != null && userAccount.getMobileNo() != null) {
				mav.addObject("phone", userAccount.getMobileNo());
			} else if (userAccount == null) {
				userAccount = new UserAccount();
				userAccount.setStoreId(storeId);
				userAccount.setCreateTime(System.currentTimeMillis());
				userAccount.setWeChatOpenId(openId);
				userAccount.setDiscountRate(1);
				_userService.saveUser(userAccount);
			}
			mav.addObject("userAccount", userAccount);
			mav.addObject("isNotMember", true);
			return mav;
		} else {
			mav.addObject("isNotMember", false);
		}

		mav.addObject("userAccount", userAccount);
		if (userAccount.getMobileNo() != null) {
			mav.addObject("phone", userAccount.getMobileNo());
		}

		List<Coupon> coupons = _userService.getCouponsByUserIdAndStoreId(
				userAccount.getId(), storeId);

		List<BalanceOperationLog> logs = _balanceOperationLogService
				.getMemberAllOperationLogsByUserAccountId(userAccount.getId());

		mav.addObject("operationLogs", logs);
		mav.addObject("coupons", coupons);

		List<MemberPolicy> memberPolicies = _storeDataService
				.getMemberPolicyByStoreId(storeId);
		List<MemberPolicy> memberPoliciesDOBFalseUrl = new ArrayList<MemberPolicy>();
		List<MemberPolicy> memberPoliciesDOBFalseText = new ArrayList<MemberPolicy>();
		List<MemberPolicy> memberPoliciesDOBTrueUrl = new ArrayList<MemberPolicy>();

		for (MemberPolicy memberPolicy : memberPolicies) {
			if (!memberPolicy.getDisplayOnBottom()) {
				if (memberPolicy.getText() != null
						&& !memberPolicy.getText().isEmpty()
						&& (memberPolicy.getUrl() == null || memberPolicy
								.getUrl().isEmpty())) {
					memberPoliciesDOBFalseText.add(memberPolicy);
				} else if (memberPolicy.getUrl() != null
						&& !memberPolicy.getUrl().isEmpty()
						&& (memberPolicy.getText() == null || memberPolicy
								.getText().isEmpty())) {
					memberPoliciesDOBFalseUrl.add(memberPolicy);
				}
			} else {
				if (memberPolicy.getUrl() != null
						&& !memberPolicy.getUrl().isEmpty()) {
					memberPoliciesDOBTrueUrl.add(memberPolicy);
				}
			}
		}
		mav.addObject("memberPoliciesDOBFalseUrl", memberPoliciesDOBFalseUrl);
		mav.addObject("memberPoliciesDOBFalseText", memberPoliciesDOBFalseText);
		mav.addObject("memberPoliciesDOBTrueUrl", memberPoliciesDOBTrueUrl);

		return mav;
	}

	@RequestMapping(value = "memberOperatePage")
	public ModelAndView memberOperatePage(@RequestParam long storeId,
			@RequestParam(defaultValue = "0") long employeeId) throws Exception {
		_userService.AssertEmployeeAuth(employeeId);
		ModelAndView mav = new ModelAndView();
		List<NamedValue> discountRates = _storeDataService
				.getDiscountRateByStoreId(storeId);
		mav.addObject("discountRates", discountRates);
		mav.addObject("storeId", storeId);
		mav.addObject("employeeId", employeeId);
		mav.setViewName("memberOperatePage");

		// UserAccount user = _userService.getUserAccountById(employeeId);
		// boolean result = _userService.checkUserInRole(employeeId,
		// UserInRole.ROLE_ADMIN);

		// if (user == null || !result) {
		// mav.addObject("isHasRole", false);
		// } else {
		// mav.addObject("isHasRole", true);
		// }

		return mav;
	}

	@ResponseBody
	@RequestMapping(value = "rechargeMember")
	public UserAccount rechargeMember(
			@RequestParam(value = "storeId") long storeId,
			@RequestParam(value = "employeeId", defaultValue = "0") long employeeId,
			@RequestParam(value = "userAccountId", defaultValue = "0") long userAccountId,
			@RequestParam(value = "amount", defaultValue = "0") double amount,
			@RequestParam(defaultValue = "现金") String type) throws Exception {
		_userService.AssertEmployeeAuth(employeeId);
		UserAccount member = _userService.getMemberById(userAccountId);
		member.setBalance(member.getBalance() + amount);
		try {
			UserAccount user = _userService.saveUser(member);
			_balanceOperationLogService.rechargeBalance(storeId, employeeId,
					amount, type, userAccountId, member.getBalance());
			for (int i = 0; i < 2; i++) {
				_dishOrderPrintingService.printRechargeBalanceNote(employeeId,
						userAccountId, storeId, amount);
			}
			return user;
		} catch (Exception e) {
			return null;
		}
	}

	@RequestMapping(value = "couponTemplateOperatePage")
	public ModelAndView couponTemplateOperatePage(
			@RequestParam(value = "storeId") long storeId,
			@RequestParam(value = "employeeId", defaultValue = "0") long employeeId)
			throws Exception {
		_userService.AssertEmployeeAuth(employeeId);
		ModelAndView mav = new ModelAndView();
		mav.addObject("storeId", storeId);
		mav.addObject("employeeId", employeeId);
		mav.setViewName("couponTemplateOperatePage");
		List<CouponTemplate> couponTemplates = _userService
				.getCouponTemplateByStoreId(storeId);
		mav.addObject("couponTemplates", couponTemplates);
		return mav;
	}

	@RequestMapping(value = "submitCreateCouponTemplate")
	public @ResponseBody
	boolean submitCreateCouponTemplate(
			@RequestParam(value = "storeId") long storeId,
			@RequestParam(value = "employeeId") long employeeId,
			@RequestParam(value = "title", defaultValue = "") String title,
			@RequestParam(value = "subTitle", defaultValue = "") String subTitle,
			@RequestParam(value = "text", defaultValue = "") String text,
			@RequestParam(value = "triggerEvent", defaultValue = "1") int triggerEvent,
			@RequestParam(value = "validFromNow", defaultValue = "true") boolean validFromNow,
			@RequestParam(value = "validDays", defaultValue = "0") int validDays,
			@RequestParam(value = "value", defaultValue = "0") double value,
			@RequestParam(value = "startDate", defaultValue = "") String startDate,
			@RequestParam(value = "endDate", defaultValue = "") String endDate)
			throws Exception {
		_userService.AssertEmployeeAuth(employeeId);

		CouponTemplate couponTemplate = new CouponTemplate();
		couponTemplate.setId(Utils.generateEntityId());
		couponTemplate.setStoreId(storeId);
		couponTemplate.setTitle(title);
		couponTemplate.setSubTitle(subTitle);
		couponTemplate.setText(text);
		couponTemplate.setTriggerEvent(triggerEvent);
		couponTemplate.setCreateTime(System.currentTimeMillis());
		couponTemplate.setValue(value);
		couponTemplate.setValidFromNow(validFromNow);
		if (validFromNow) {
			couponTemplate.setValidDays(validDays);
		} else {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			long startDateLong = 0l;
			long endDateLong = 0l;
			try {
				startDateLong = sdf.parse(startDate).getTime();
				endDateLong = sdf.parse(endDate).getTime();
			} catch (Exception e) {
			}
			couponTemplate.setStartDate(startDateLong);
			couponTemplate.setEndDate(endDateLong);
		}
		try {
			_userService.saveCouponTemplate(couponTemplate);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	@RequestMapping(value = "deleteCouponTemplate")
	public @ResponseBody
	boolean deleteCouponTemplate(@RequestParam(value = "storeId") long storeId,
			@RequestParam(value = "employeeId") long employeeId,
			@RequestParam(value = "couponTemplateId") long couponTemplateId)
			throws Exception {
		_userService.AssertEmployeeAuth(employeeId);
		CouponTemplate couponTemplate = _userService
				.getCouponTemplateById(couponTemplateId);
		try {
			_userService.deleteCouponTemplate(couponTemplate);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	@RequestMapping(value = "sendCouponToAllMember")
	public @ResponseBody
	boolean sendCouponToAllMember(
			@RequestParam(value = "storeId") long storeId,
			@RequestParam(value = "employeeId") long employeeId,
			@RequestParam(value = "couponTemplateId") long couponTemplateId)
			throws Exception {
		_userService.AssertEmployeeAuth(employeeId);
		CouponTemplate couponTemplate = _userService
				.getCouponTemplateById(couponTemplateId);
		List<UserAccount> members = _userService
				.getAllMemberListByStoreId(storeId);
		try {
			for (UserAccount userAccount : members) {

				Coupon coupon = new Coupon();
				coupon.setUserAccount(userAccount.getId());
				coupon.setStoreId(userAccount.getStoreId());
				coupon.setTitle(couponTemplate.getTitle());
				coupon.setText(couponTemplate.getText());
				coupon.setValue(couponTemplate.getValue());
				if (couponTemplate.getSubTitle() != null) {
					coupon.setSubTitle(couponTemplate.getSubTitle());
				}
				if (couponTemplate.getValidFromNow()) {
					coupon.setStartDate(System.currentTimeMillis());
					long validDaysLong = couponTemplate.getValidDays();
					validDaysLong *= 24;
					validDaysLong *= 60;
					validDaysLong *= 60;
					validDaysLong *= 1000;
					coupon.setEndDate(coupon.getStartDate() + validDaysLong);
				} else {
					coupon.setStartDate(couponTemplate.getStartDate());
					coupon.setEndDate(couponTemplate.getEndDate());
				}

				coupon.setState(Coupon.STATE_ENABLED);

				_userService.saveCoupon(coupon);
				_couponOperationLogService.sendCoupon(storeId, employeeId,
						userAccount.getId(), coupon);
			}
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	@RequestMapping(value = "submitRegisterMember")
	public @ResponseBody
	String submitRegisterMember(
			@RequestParam(value = "userId", defaultValue = "0") Long userId,
			@RequestParam(value = "storeId") long storeId,
			@RequestParam(value = "phone", defaultValue = "0") String phone,
			@RequestParam(value = "captcha", defaultValue = "0") String captcha,
			@RequestParam(value = "isBooking", defaultValue = "false") boolean isBooking,
			@RequestParam(value = "isOrdering", defaultValue = "false") boolean isOrdering) {
		UserAccount userAccount = _userService.getUserAccountById(userId);

		if (userAccount == null)
			return "";

		if (userAccount.getCaptcha().equals(captcha)) {
			Random random = new Random();
			long memberCardNo = random.nextInt(10000000);
			if (memberCardNo < 100000 || memberCardNo > 10000000) {
				while (memberCardNo < 100000 || memberCardNo > 10000000) {
					memberCardNo = random.nextInt(10000000);
				}
			}
			UserAccount userAccountExistByPhone = _userService
					.getUserAccountExistByPhone(storeId, phone, captcha);

			if (userAccountExistByPhone != null
					&& userAccountExistByPhone.getId() != userAccount.getId()) {
				userAccountExistByPhone.setWeChatOpenId(userAccount
						.getWeChatOpenId());
				if (userAccountExistByPhone.getMemberCardNo() == null) {
					userAccountExistByPhone.setMemberCardNo(Long
							.toString(memberCardNo));
				}
				userId = userAccountExistByPhone.getId();

				_userService.saveUser(userAccountExistByPhone);

				userAccount.setMobileNo("");
				userAccount.setWeChatOpenId("");
				_userService.saveUser(userAccount);
			} else {
				userAccount.setMemberCardNo(Long.toString(memberCardNo));
				userAccount.setMobileNo(phone);
				userAccount.setPassword(captcha);
				userAccount.setStoreId(storeId);
				_userService.saveUser(userAccount);

				setAutoSendCoupon(userAccount);
			}
			if (isBooking) {
				return "book/bookIndex.html?userId=" + userId + "&&storeId="
						+ storeId;
			} else if (isOrdering) {
				return "wechat_self/" + storeId + "?openId="
						+ userAccount.getWeChatOpenId() + "&userId=" + userId;
			}

			return "member/memberPage.html?userId=" + userId + "&&storeId="
					+ storeId;
		} else {
			return "";
		}
	}

	@RequestMapping(value = "getEditMemberDialog")
	public ModelAndView getEditMemberDialog(@RequestParam long memberId,
			@RequestParam long storeId) {
		ModelAndView mav = new ModelAndView();
		mav.setViewName("editMemberDialog");

		UserAccount member = _userService.getUserAccountById(memberId);
		List<NamedValue> discountRates = _storeDataService
				.getDiscountRateByStoreId(storeId);
		if (member != null) {
			mav.addObject("member", member);
			mav.addObject("discountRates", discountRates);
		}
		return mav;
	}

	@RequestMapping(value = "registerOrUpdateMember")
	public @ResponseBody
	int registerOrUpdateMember(
			@RequestParam(value = "storeId") long storeId,
			@RequestParam(value = "cardNo", defaultValue = "") String cardNo,
			@RequestParam(value = "name", defaultValue = "") String name,
			@RequestParam(value = "phone", defaultValue = "0") String phone,
			@RequestParam(required = false, defaultValue = "1") double discountRate,
			@RequestParam(required = false, defaultValue = "0") double point,
			@RequestParam(value = "isUpdate", defaultValue = "false") boolean isUpdate) {

		if (!phone.equals("0") && cardNo != null && storeId != 0) {
			UserAccount userAccount = _userService.getMemberByCardNoAndStoreId(
					cardNo, phone, storeId);
			UserAccount userAccountByPhone = _userService
					.getMemberByPhoneAndStoreId(phone, storeId);
			if (userAccount != null && !isUpdate) {
				if (userAccountByPhone != null) {
					return 3;
				}
				return 2;
			}

			if (userAccount == null) {
				userAccount = userAccountByPhone;
			}

			if (userAccount == null) {
				userAccount = new UserAccount();
				userAccount.setStoreId(storeId);
				userAccount.setCreateTime(System.currentTimeMillis());
			}

			userAccount.setMobileNo(phone);
			userAccount.setMemberCardNo(cardNo);
			userAccount.setDiscountRate(discountRate);
			userAccount.setPoint(point);
			userAccount.setName(name);
			_userService.saveUser(userAccount);

			setAutoSendCoupon(userAccount);

			return 0;
		} else {
			return 1;
		}
	}

	@RequestMapping(value = "checkPhoneOrCardNoIsExisted")
	public @ResponseBody
	int checkPhoneOrCardNoIsExisted(
			@RequestParam(value = "storeId") long storeId,
			@RequestParam(value = "cardNo", defaultValue = "") String cardNo,
			@RequestParam(value = "phone", defaultValue = "") String phone) {

		List<UserAccount> userAccounts = _userService
				.checkPhoneOrCardNoIsExisted(cardNo, phone, storeId);

		if (userAccounts.size() == 1) {
			return 1;
		} else if (userAccounts.size() > 1) {
			return 2;
		}

		return 0;
	}

	@RequestMapping(value = "updateMemberInfo")
	public @ResponseBody
	boolean updateMemberInfo(@RequestParam(value = "storeId") long storeId,
			@RequestParam(value = "name", defaultValue = "0") String name,
			@RequestParam(value = "cardNo", defaultValue = "") String cardNo,
			@RequestParam(value = "phone", defaultValue = "0") String phone,
			@RequestParam(defaultValue = "1") double discountRate,
			@RequestParam(defaultValue = "0") double point) {

		List<UserAccount> userAccounts = _userService
				.checkPhoneOrCardNoIsExisted(cardNo, phone, storeId);
		if (userAccounts.size() != 1) {
			return false;
		}

		UserAccount userAccount = userAccounts.get(0);
		try {
			userAccount.setName(name);
			userAccount.setMobileNo(phone);
			userAccount.setMemberCardNo(cardNo);
			userAccount.setDiscountRate(discountRate);
			userAccount.setPoint(point);
			_userService.saveUser(userAccount);
		} catch (Exception e) {
			return false;
		}

		return true;
	}

	private void setAutoSendCoupon(UserAccount userAccount) {
		List<CouponTemplate> couponTemplate = _userService
				.getCouponTemplateByStoreIdAndTriggerEvent(
						userAccount.getStoreId(),
						CouponTemplate.TRIGGEREVENT_OPEN_CARD);

		for (CouponTemplate item : couponTemplate) {
			Coupon coupon = new Coupon();
			coupon.setUserAccount(userAccount.getId());
			coupon.setStoreId(userAccount.getStoreId());
			coupon.setTitle(item.getTitle());
			coupon.setText(item.getText());
			coupon.setValue(item.getValue());
			if (item.getSubTitle() != null) {
				coupon.setSubTitle(item.getSubTitle());
			}
			if (item.getValidFromNow()) {
				coupon.setStartDate(System.currentTimeMillis());
				long validDaysLong = item.getValidDays();
				validDaysLong *= 24;
				validDaysLong *= 60;
				validDaysLong *= 60;
				validDaysLong *= 1000;
				coupon.setEndDate(coupon.getStartDate() + validDaysLong);
			} else {
				coupon.setStartDate(item.getStartDate());
				coupon.setEndDate(item.getEndDate());
			}

			coupon.setState(Coupon.STATE_ENABLED);
			_userService.saveCoupon(coupon);
			_couponOperationLogService.sendCoupon(userAccount.getStoreId(), 0,
					userAccount.getId(), coupon);
		}
	}

	@RequestMapping(value = "sendMsg", method = RequestMethod.POST)
	public @ResponseBody
	String sendMsg(
			@RequestParam(value = "telephone") String telephone,
			@RequestParam(value = "storeId") long storeId,
			@RequestParam(value = "userId", required = false, defaultValue = "0") Long userId) {

		UserAccount userAccountByPhone = _userService
				.getUserAccountByStoreIdAndPhone(storeId, telephone);
		if (userAccountByPhone != null
				&& userAccountByPhone.getMemberCardNo() != null
				&& userAccountByPhone.getWeChatOpenId() != null) {
			return "exist";
		}
		String captcha = Utils.sendMsgReturnCode(telephone);
		_userService.setCaptchaForUser(captcha, userId, storeId, telephone,
				userAccountByPhone);
		return "";
	}

	@RequestMapping(value = "useCoupon")
	public @ResponseBody
	String useCoupon(@RequestParam(value = "couponId") long couponId,
			@RequestParam(value = "userId") long userId) {
		Coupon coupon = _userService.getCouponsById(couponId);

		if (coupon == null || coupon.getUserAccount() != userId
				|| coupon.getState() != Coupon.STATE_ENABLED) {
			return "";
		}

		coupon.setState(Coupon.STATE_DISABLED);
		_userService.saveCoupon(coupon);
		_couponOperationLogService.usingCoupon(coupon.getStoreId(), 0, userId,
				coupon);
		return "USED";
	}

	@ResponseBody
	@RequestMapping(value = "getMemberListByPhoneOrCardNo")
	public List<UserAccount> getMemberListByPhoneOrCardNo(
			@RequestParam String keyword, @RequestParam long storeId) {

		List<UserAccount> userAccounts = new ArrayList<UserAccount>();

		if (keyword == "") {
			return userAccounts;
		}
		if (keyword.endsWith("all")) {
			return _userService.getAllMemberListByPhoneOrCardNo(storeId);
		}

		userAccounts = _userService.getMemberListByPhoneOrCardNo(keyword,
				storeId);

		return userAccounts;
	}

	@ResponseBody
	@RequestMapping("getMemberById")
	public UserAccount getMemberById(@RequestParam long userAccountId) {
		UserAccount customer = _userService.getMemberById(userAccountId);
		return customer;
	}

	@ResponseBody
	@RequestMapping("getMemberByOpenId")
	public UserAccount getMemberByOpenId(@RequestParam String openId) {
		UserAccount customer = _userService.getUserAccountByOpenId(openId);
		return customer;
	}

	@ResponseBody
	@RequestMapping("getCouponTemplateByStoreId/{storeId}")
	public List<CouponTemplate> getCouponTemplateByStoreId(
			@PathVariable long storeId) {
		List<CouponTemplate> couponTemplates = _userService
				.getCouponTemplateByStoreIdAndTriggerEvent(storeId,
						CouponTemplate.TRIGGEREVENT_MANUAL_OPERATION);
		return couponTemplates;
	}

	@ResponseBody
	@RequestMapping("getBalanceRecord/{memberId}")
	public List<BalanceOperationLog> getBalanceRecord(
			@PathVariable long memberId) {
		return _balanceOperationLogService
				.getMemberAllOperationLogsByUserAccountId(memberId);
	}

	@ResponseBody
	@RequestMapping("sendCoupons")
	public List<CouponTemplate> sendCoupons(@RequestParam long userAccountId,
			@RequestParam long storeId, @RequestParam long employeeId,
			@RequestParam String couponTemplatesJsonText) throws Exception {
		_userService.AssertEmployeeAuth(employeeId);

		List<CouponTemplate> couponTemplates = CouponTemplate
				.fromJsonText(couponTemplatesJsonText);

		if (couponTemplates != null) {
			for (CouponTemplate item : couponTemplates) {
				if (item.getAmount() > 0) {
					for (int i = 0; i < item.getAmount(); i++) {
						Coupon coupon = new Coupon();
						coupon.setTitle(item.getTitle());
						coupon.setValue(item.getValue());
						coupon.setText(item.getText());
						coupon.setUserAccount(userAccountId);
						coupon.setStoreId(storeId);
						coupon.setState(Coupon.STATE_ENABLED);
						if (item.getSubTitle() != null) {
							coupon.setSubTitle(item.getSubTitle());
						}
						if (item.getValidFromNow()) {
							coupon.setStartDate(System.currentTimeMillis());
							long dayTime = 24 * 60 * 60 * 1000;
							long validDayTime = item.getValidDays() * dayTime;
							coupon.setEndDate(System.currentTimeMillis()
									+ validDayTime);
						} else {
							coupon.setStartDate(item.getStartDate());
							coupon.setEndDate(item.getEndDate());
						}

						_userService.saveCoupon(coupon);
						_couponOperationLogService.sendCoupon(storeId,
								employeeId, userAccountId, coupon);
					}
				}
				item.setAlreadySendAmount(item.getAlreadySendAmount()
						+ item.getAmount());
				item.setAmount(0);
			}
		}
		return couponTemplates;
	}

	@ResponseBody
	@RequestMapping("sendCouponsByCouponTemplateId")
	public List<Coupon> sendCouponsByCouponTemplateId(
			@RequestParam long userAccountId,
			@RequestParam long couponTemplateId, @RequestParam long employeeId,
			@RequestParam long storeId) throws Exception {
		_userService.AssertEmployeeAuth(employeeId);

		CouponTemplate couponTemplate = _userService
				.getCouponTemplateById(couponTemplateId);

		if (couponTemplate != null) {
			Coupon coupon = new Coupon();
			coupon.setTitle(couponTemplate.getTitle());
			coupon.setValue(couponTemplate.getValue());
			coupon.setText(couponTemplate.getText());
			coupon.setUserAccount(userAccountId);
			coupon.setStoreId(storeId);
			coupon.setState(Coupon.STATE_ENABLED);
			if (couponTemplate.getSubTitle() != null) {
				coupon.setSubTitle(couponTemplate.getSubTitle());
			}
			if (couponTemplate.getValidFromNow()) {
				coupon.setStartDate(System.currentTimeMillis());
				long dayTime = 24 * 60 * 60 * 1000;
				long validDayTime = couponTemplate.getValidDays() * dayTime;
				coupon.setEndDate(System.currentTimeMillis() + validDayTime);
			} else {
				coupon.setStartDate(couponTemplate.getStartDate());
				coupon.setEndDate(couponTemplate.getEndDate());
			}

			_userService.saveCoupon(coupon);
			_couponOperationLogService.sendCoupon(storeId, employeeId,
					userAccountId, coupon);
		}

		List<Coupon> coupons = _userService.getCouponsByUserIdAndStoreId(
				userAccountId, storeId);
		return coupons;
	}
}

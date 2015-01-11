package helen.catering.service;

import helen.catering.dao.EmployeeDao;
import helen.catering.dao.UserAccountDao;
import helen.catering.dao.UserInRoleDao;
import helen.catering.model.entities.Coupon;
import helen.catering.model.entities.CouponTemplate;
import helen.catering.model.entities.Employee;
import helen.catering.model.entities.UserAccount;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Repository;

@Repository
public class UserService {

	@Autowired
	UserAccountDao _userDao;

	@Autowired
	EmployeeDao _employeeDao;

	@Autowired
	UserInRoleDao _userInRoleDao;

	public UserAccount AssertStoreAuth(long storeId) throws ServiceException {
		User user = null;
		try {
			user = (User) SecurityContextHolder.getContext()
					.getAuthentication().getPrincipal();
		} catch (Exception ex) {
		}

		if (user == null)
			throw new ServiceException(ServiceException.NOT_LOGINED);
		UserAccount userAccount = _userDao.getUserByName(user.getUsername());
		if (userAccount == null | userAccount.getStoreId() != storeId)
			throw new ServiceException(ServiceException.NOT_LOGINED);
		return userAccount;
	}

	public UserAccount AssertEmployeeAuth(long employeeId)
			throws ServiceException {
		User user = null;
		try {
			user = (User) SecurityContextHolder.getContext()
					.getAuthentication().getPrincipal();
		} catch (Exception ex) {
		}

		if (user == null)
			throw new ServiceException(ServiceException.NOT_LOGINED);
		UserAccount userAccount = _userDao.getUserByName(user.getUsername());
		Employee employee = _employeeDao.find(employeeId);
		if (userAccount == null
				|| userAccount.getStoreId() != employee.getStoreId())
			throw new ServiceException(ServiceException.NOT_LOGINED);
		return userAccount;
	}

	public UserAccount find(Long id) {
		return _userDao.find(id);
	}

	public CouponTemplate saveCouponTemplate(CouponTemplate couponTemplate) {
		return _userDao.saveCouponTemplate(couponTemplate);
	}

	public Employee getEmployeeById(Long id) {
		return _employeeDao.find(id);
	}

	public Employee getEmployeeByUserAccountId(Long id) {
		return _employeeDao.getEmployeeByUserAccountId(id);
	}

	public Employee getEmployeeByStoreIdAndWorkNumber(long storeId,
			String workNumber) {
		return _employeeDao.getEmployeeByStoreIdAndWorkNumber(storeId,
				workNumber);
	}

	public Employee getEmployeeByStoreIdAndSmartCardNo(long storeId,
			String smartCardNo) {
		return _employeeDao.getEmployeeByStoreIdAndSmartCardNo(storeId,
				smartCardNo);
	}

	public UserAccount getUserByName(String userName) {
		return _userDao.getUserByName(userName);
	}

	public UserAccount getUserAccountById(long userId) {
		return _userDao.getUserAccountById(userId);
	}

	public List<Coupon> getCouponsByUserIdAndStoreId(long userId, long storeId) {
		return _userDao.getCouponsByUserIdAndStoreId(userId, storeId);
	}

	public UserAccount saveUser(UserAccount userAccount) {
		return _userDao.save(userAccount);
	}

	public List<CouponTemplate> getCouponTemplateByStoreIdAndTriggerEvent(
			long storeId, int triggerEvent) {
		return _userDao.getCouponTemplateByStoreIdAndTriggerEvent(storeId,
				triggerEvent);
	}

	public Coupon saveCoupon(Coupon coupon) {
		return _userDao.saveCoupon(coupon);
	}

	public Coupon getCouponsById(long couponId) {
		return _userDao.getCouponsById(couponId);
	}

	public UserAccount setCaptchaForUser(String captcha, Long userId,
			long storeId, String telephone, UserAccount userAccountByPhone) {
		UserAccount userAccount = _userDao.find(userId);
		userAccount.setCaptcha(captcha);
		if (userAccountByPhone != null) {
			userAccountByPhone.setCaptcha(captcha);
			_userDao.save(userAccount);
		} else {
			userAccount.setMobileNo(telephone);
		}
		userAccount.setCreateTime(System.currentTimeMillis());
		_userDao.save(userAccount);
		return userAccount;
	}

	public List<UserAccount> getMemberListByPhoneOrCardNo(String submitStr,
			long storeId) {
		return _userDao.getMemberListByPhoneOrCardNo(submitStr, storeId);
	}

	public List<UserAccount> getAllMemberListByPhoneOrCardNo(long storeId) {
		return _userDao.getAllMemberListByPhoneOrCardNo(storeId);
	}

	public UserAccount getMemberById(long userAccountId) {
		return _userDao.getMemberById(userAccountId);
	}

	public boolean modifyUserPassword(String userName, String oldPassword,
			String newPassword) {
		return _userDao.modifyUserPassword(userName, oldPassword, newPassword);
	}

	public UserAccount getUserAccountByOpenId(String openId) {
		return _userDao.getUserAccountByOpenId(openId);
	}

	public UserAccount getMemberByCardNoAndStoreId(String cardNo, String phone,
			long storeId) {
		return _userDao.getMemberByCardNoAndStoreId(cardNo, phone, storeId);
	}

	public UserAccount getMemberByPhoneAndStoreId(String phone, long storeId) {
		return _userDao.getMemberByPhoneAndStoreId(phone, storeId);
	}

	public List<UserAccount> getAllMemberListByStoreId(long storeId) {
		return _userDao.getAllMemberListByStoreId(storeId);
	}

	public List<UserAccount> checkPhoneOrCardNoIsExisted(String cardNo,
			String phone, long storeId) {
		return _userDao.checkPhoneOrCardNoIsExisted(cardNo, phone, storeId);
	}

	public boolean checkUserInRole(long employeeId, String roleAdmin) {
		return _userInRoleDao.employeeHasRole(employeeId, roleAdmin);
	}

	public Employee getEmployeeById(long employeeId) {
		return _employeeDao.getEmployeeById(employeeId);
	}

	public UserAccount getUserAccountExistByPhone(long storeId, String phone,
			String captcha) {
		return _userDao.getUserAccountExistByPhone(storeId, phone, captcha);
	}

	public UserAccount getUserAccountByStoreIdAndPhone(long storeId,
			String telephone) {
		return _userDao.getUserAccountByStoreIdAndPhone(storeId, telephone);
	}

	public List<CouponTemplate> getCouponTemplateByStoreId(long storeId) {
		return _userDao.getCouponTemplateByStoreId(storeId);
	}

	public CouponTemplate getCouponTemplateById(long couponTemplateId) {
		return _userDao.getCouponTemplateById(couponTemplateId);
	}

	public void deleteCouponTemplate(CouponTemplate couponTemplate) {
		_userDao.deleteCouponTemplate(couponTemplate);
	}

	public Employee updateEmployeeIsBlock(long employeeId, boolean isBlock) {
		try {

			Employee employee = _employeeDao.find(employeeId);
			employee.setIsShowBlockDishView(isBlock);
			_employeeDao.save(employee);
			return employee;
		} catch (Exception e) {
			return null;
		}
	}
}

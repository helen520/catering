package helen.catering.dao;

import helen.catering.Utils;
import helen.catering.model.entities.Coupon;
import helen.catering.model.entities.CouponTemplate;
import helen.catering.model.entities.UserAccount;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class UserAccountDao {

	@PersistenceContext
	private EntityManager entityManager;

	public UserAccount find(Long id) {
		try {
			return entityManager.find(UserAccount.class, id);
		} catch (Exception e) {
			return null;
		}
	}

	@SuppressWarnings("unchecked")
	public List<UserAccount> getUsers() {
		return entityManager.createQuery("select u from UserAccount u")
				.getResultList();
	}

	@SuppressWarnings("unchecked")
	public UserAccount getUserByName(String userName) {
		try {
			List<UserAccount> user = entityManager
					.createQuery(
							"select u from UserAccount u where u.loginName=?")
					.setParameter(1, userName).getResultList();

			if (user.size() != 1) {
				return null;
			}
			return user.get(0);
		} catch (Exception e) {
			return null;
		}
	}

	@Transactional
	public UserAccount save(UserAccount userAccount) {
		if (userAccount.getId() == 0) {
			userAccount.setId(Utils.generateEntityId());
			entityManager.persist(userAccount);
			return userAccount;
		} else {
			return entityManager.merge(userAccount);
		}
	}

	@Transactional
	public Coupon saveCoupon(Coupon coupon) {
		if (coupon.getId() == 0) {
			coupon.setId(Utils.generateEntityId());
			entityManager.persist(coupon);
			return coupon;
		} else {
			return entityManager.merge(coupon);
		}
	}

	@Transactional
	public CouponTemplate saveCouponTemplate(CouponTemplate couponTemplate) {
		if (couponTemplate.getId() == 0) {
			couponTemplate.setId(Utils.generateEntityId());
			entityManager.persist(couponTemplate);
			return couponTemplate;
		} else {
			return entityManager.merge(couponTemplate);
		}
	}

	@Transactional
	public void deleteCouponTemplate(CouponTemplate couponTemplate) {
		entityManager.remove(couponTemplate);
	}

	public UserAccount getUserAccountById(long userId) {
		try {
			return (UserAccount) entityManager
					.createQuery("select u from UserAccount u where u.id=?")
					.setParameter(1, userId).getSingleResult();
		} catch (Exception e) {
			return null;
		}
	}

	@SuppressWarnings("unchecked")
	public List<Coupon> getCouponsByUserIdAndStoreId(long userId, long storeId) {
		return entityManager
				.createQuery(
						"select cp from Coupon cp where userAccountId=? and storeId=? and state!=? and startDate < ?  and endDate>?")
				.setParameter(1, userId).setParameter(2, storeId)
				.setParameter(3, Coupon.STATE_DISABLED)
				.setParameter(4, System.currentTimeMillis())
				.setParameter(5, System.currentTimeMillis()).getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<CouponTemplate> getCouponTemplateByStoreIdAndTriggerEvent(
			long storeId, int triggerEvent) {
		return entityManager
				.createQuery(
						"select ct from CouponTemplate ct where storeId=? and triggerEvent=? and (validFromNow =? or (startDate < ?  and endDate>?))")
				.setParameter(1, storeId).setParameter(2, triggerEvent)
				.setParameter(3, true)
				.setParameter(4, System.currentTimeMillis())
				.setParameter(5, System.currentTimeMillis()).getResultList();
	}

	public Coupon getCouponsById(long couponId) {
		return (Coupon) entityManager
				.createQuery("select cp from Coupon cp where cp.id=?")
				.setParameter(1, couponId).getSingleResult();
	}

	@SuppressWarnings("unchecked")
	public List<UserAccount> getMemberListByPhoneOrCardNo(String submitStr,
			long storeId) {

		StringBuffer strBuf = new StringBuffer();
		strBuf.append("select * from UserAccount ua where (ua.memberCardNo like '%");
		strBuf.append(submitStr);
		strBuf.append("%' ");
		strBuf.append("or (ua.mobileNo like '%");
		strBuf.append(submitStr);
		strBuf.append("%' and ua.memberCardNo is not null)) and ua.storeId= ");
		strBuf.append(storeId);
		List<UserAccount> userAccounts = this.entityManager.createNativeQuery(
				strBuf.toString(), UserAccount.class).getResultList();

		for (UserAccount user : userAccounts) {
			List<Coupon> coupons = this.getCouponsByUserIdAndStoreId(
					user.getId(), storeId);
			user.setCoupons(coupons);
		}
		return userAccounts;
	}

	public UserAccount getMemberById(long userAccountId) {
		try {
			UserAccount customer = entityManager.find(UserAccount.class,
					userAccountId);
			List<Coupon> coupons = this.getCouponsByUserIdAndStoreId(
					customer.getId(), customer.getStoreId());
			customer.setCoupons(coupons);
			return customer;
		} catch (Exception e) {
			return null;
		}
	}

	@SuppressWarnings("unchecked")
	public List<UserAccount> getAllMemberListByPhoneOrCardNo(long storeId) {

		List<UserAccount> userAccounts = this.entityManager
				.createQuery(
						"select u from UserAccount u where u.memberCardNo is not null and u.mobileNo is not null and u.storeId = ?")
				.setParameter(1, storeId).getResultList();

		for (UserAccount user : userAccounts) {
			List<Coupon> coupons = this.getCouponsByUserIdAndStoreId(
					user.getId(), storeId);
			user.setCoupons(coupons);
		}
		return userAccounts;
	}

	@Transactional
	public boolean modifyUserPassword(String userName, String oldPassword,
			String newPassword) {
		try {
			int i = entityManager
					.createQuery(
							"update  UserAccount set Password = ? where LoginName = ? and Password = ? ")
					.setParameter(1, newPassword).setParameter(2, userName)
					.setParameter(3, oldPassword).executeUpdate();
			if (i > 0) {
				return true;
			}
			return false;
		} catch (Exception e) {
			return false;
		}
	}

	public UserAccount getUserAccountByStoreIdAndPhone(long storeId,
			String telephone) {
		try {
			return (UserAccount) entityManager
					.createQuery(
							"select u from UserAccount u where u.storeId=? and u.mobileNo=?")
					.setParameter(1, storeId).setParameter(2, telephone)
					.getSingleResult();
		} catch (Exception e) {
			return null;
		}
	}

	@SuppressWarnings("unchecked")
	public UserAccount getUserAccountByOpenId(String openId) {
		try {
			List<UserAccount> userAccounts = entityManager
					.createQuery(
							"select u from UserAccount u where u.weChatOpenId=? ")
					.setParameter(1, openId).getResultList();
			if (userAccounts.size() > 0) {
				return userAccounts.get(0);
			} else
				return null;
		} catch (Exception e) {
			return null;
		}
	}

	public UserAccount getMemberByCardNoAndStoreId(String cardNo, String phone,
			long storeId) {
		try {
			return (UserAccount) entityManager
					.createQuery(
							"select u from UserAccount u where u.memberCardNo=? and u.mobileNo !=?  and u.storeId=?")
					.setParameter(1, cardNo).setParameter(2, phone)
					.setParameter(3, storeId).getSingleResult();
		} catch (Exception e) {
			return null;
		}
	}

	public UserAccount getMemberByPhoneAndStoreId(String phone, long storeId) {
		try {
			return (UserAccount) entityManager
					.createQuery(
							"select u from UserAccount u where u.mobileNo=? and u.storeId=?")
					.setParameter(1, phone).setParameter(2, storeId)
					.getSingleResult();
		} catch (Exception e) {
			return null;
		}
	}

	@SuppressWarnings("unchecked")
	public List<UserAccount> getAllMemberListByStoreId(long storeId) {
		List<UserAccount> userAccounts = entityManager
				.createQuery(
						"select u from UserAccount u where u.storeId=? and memberCardNo is not null")
				.setParameter(1, storeId).getResultList();
		for (UserAccount user : userAccounts) {
			List<Coupon> coupons = this.getCouponsByUserIdAndStoreId(
					user.getId(), storeId);
			user.setCoupons(coupons);
		}
		return userAccounts;
	}

	@SuppressWarnings("unchecked")
	public List<UserAccount> checkPhoneOrCardNoIsExisted(String cardNo,
			String phone, long storeId) {
		return entityManager
				.createQuery(
						"select u from UserAccount u where u.storeId=? and  (u.memberCardNo=? or u.mobileNo=?) ")
				.setParameter(1, storeId).setParameter(2, cardNo)
				.setParameter(3, phone).getResultList();
	}

	public UserAccount getUserAccountExistByPhone(long storeId, String phone,
			String captcha) {
		try {
			return (UserAccount) entityManager
					.createQuery(
							"select u from UserAccount u where u.storeId =? and u.mobileNo=? and u.captcha=?")
					.setParameter(1, storeId).setParameter(2, phone)
					.setParameter(3, captcha).getSingleResult();
		} catch (Exception e) {
			return null;
		}
	}

	public UserAccount getMemberByPhoneOrCardNo(String dishOrderBriefId,
			long storeId) {
		try {
			return (UserAccount) entityManager
					.createQuery(
							"select u from UserAccount u where u.storeId =? and (u.mobileNo=? or u.memberCardNo=?)")
					.setParameter(1, storeId).setParameter(2, dishOrderBriefId)
					.setParameter(3, dishOrderBriefId).getSingleResult();
		} catch (Exception e) {
			return null;
		}
	}

	@SuppressWarnings("unchecked")
	public List<CouponTemplate> getCouponTemplateByStoreId(long storeId) {
		return entityManager
				.createQuery(
						"select ct from CouponTemplate ct where ct.storeId=? order by createTime desc")
				.setParameter(1, storeId).getResultList();
	}

	public CouponTemplate getCouponTemplateById(long couponTemplateId) {
		try {
			return entityManager.find(CouponTemplate.class, couponTemplateId);
		} catch (Exception e) {
			return null;
		}
	}
}

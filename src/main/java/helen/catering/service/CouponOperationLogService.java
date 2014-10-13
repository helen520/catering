package helen.catering.service;

import helen.catering.dao.CouponOperationLogDao;
import helen.catering.dao.EmployeeDao;
import helen.catering.model.entities.Coupon;
import helen.catering.model.entities.CouponOperationLog;
import helen.catering.model.entities.Employee;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class CouponOperationLogService {

	@Autowired
	CouponOperationLogDao _couponOperationLogDao;
	@Autowired
	EmployeeDao _employeeDao;

	public List<CouponOperationLog> getMemberAllOperationLogsByUserAccountId(
			long id) {
		return _couponOperationLogDao.getCouponOperationLogsByUserAccountId(id);
	}

	public void sendCoupon(long storeId, long employeeId, long userAccountId,
			Coupon coupon) {
		try {
			Employee employee = _employeeDao.find(employeeId);
			CouponOperationLog copl = new CouponOperationLog();
			copl.setOperationType(CouponOperationLog.COUPONG_OP_SEND_COUPON);
			copl.setCreateTime(System.currentTimeMillis());
			copl.setOperatorEmployeeId(employeeId);
			copl.setUserAccountId(userAccountId);
			copl.setStoreId(storeId);
			copl.setCouponId(coupon.getId());
			String operatorName = ",自动发券";
			if (employee != null) {
				operatorName = ",操作:" + employee.getName();
			}
			copl.setDataSnapShot("发送优惠券 : 标题:" + coupon.getTitle() + ",抵扣金额:"
					+ coupon.getValue() + operatorName);
			_couponOperationLogDao.save(copl);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void usingCoupon(long storeId, long employeeId, long userAccountId,
			Coupon coupon) {
		try {
			Employee employee = _employeeDao.find(employeeId);
			CouponOperationLog copl = new CouponOperationLog();
			copl.setOperationType(CouponOperationLog.COUPONG_OP_USING_COUPON);
			copl.setCreateTime(System.currentTimeMillis());
			copl.setOperatorEmployeeId(employeeId);
			copl.setUserAccountId(userAccountId);
			copl.setStoreId(storeId);
			copl.setCouponId(coupon.getId());
			String operatorName = ",用户自己使用";
			if (employee != null) {
				operatorName = ",操作:" + employee.getName();
			}
			copl.setDataSnapShot("使用优惠券 : 标题:" + coupon.getTitle() + ",抵扣金额:"
					+ coupon.getValue() + operatorName);
			_couponOperationLogDao.save(copl);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public List<CouponOperationLog> getDailyBalanceRecordListByStoreId(
			long storeId, long startTimeLong, long endTimeLong) {
		return _couponOperationLogDao.getDailyCouponRecordListByStoreId(
				storeId, startTimeLong, endTimeLong);
	}

}

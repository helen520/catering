package helen.catering.service;

import helen.catering.dao.BalanceOperationLogDao;
import helen.catering.model.entities.BalanceOperationLog;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class BalanceOperationLogService {

	@Autowired
	BalanceOperationLogDao _balanceOperationLogDao;

	public List<BalanceOperationLog> getMemberAllOperationLogsByUserAccountId(
			long id) {
		return _balanceOperationLogDao
				.getMemberOperationLogsByUserAccountId(id);
	}

	public void rechargeBalance(long storeId, long employeeId, double amount,
			String type, long userAccountId, double balance) {
		try {
			BalanceOperationLog bopl = new BalanceOperationLog();
			bopl.setOperationType(BalanceOperationLog.BALANCE_OP_RECHARGE);
			bopl.setCreateTime(System.currentTimeMillis());
			bopl.setOperatorEmployeeId(employeeId);
			bopl.setUserAccountId(userAccountId);
			bopl.setStoreId(storeId);
			bopl.setDataSnapShot("充值 : " + amount + " 充值方式 : " + type + " 余额 : "
					+ balance);
			_balanceOperationLogDao.save(bopl);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void prePayDishOrder(long storeId, Double amount,
			long userAccountId, long dishOrderId, double balance) {
		try {
			BalanceOperationLog bopl = new BalanceOperationLog();
			bopl.setOperationType(BalanceOperationLog.BALANCE_OP_PREPAY_DISHORDER);
			bopl.setCreateTime(System.currentTimeMillis());
			bopl.setDishOrderId(dishOrderId);
			bopl.setOperatorEmployeeId(0);
			bopl.setUserAccountId(userAccountId);
			bopl.setStoreId(storeId);
			bopl.setDataSnapShot("预付 : " + amount + " 余额 : " + balance);
			_balanceOperationLogDao.save(bopl);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void returnUsedBalance(long storeId, long employeeId,
			long dishOrderId, Double amount, long userAccountId, double balance) {
		try {
			BalanceOperationLog bopl = new BalanceOperationLog();
			bopl.setOperationType(BalanceOperationLog.BALANCE_OP_RETURN_USED_BALANCE);
			bopl.setCreateTime(System.currentTimeMillis());
			bopl.setDishOrderId(dishOrderId);
			bopl.setOperatorEmployeeId(employeeId);
			bopl.setUserAccountId(userAccountId);
			bopl.setStoreId(storeId);
			bopl.setDataSnapShot("退还 : " + amount + " 余额 : " + balance);
			_balanceOperationLogDao.save(bopl);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void usingBalanceForDishOrder(long storeId, long employeeId,
			long dishOrderId, Double amount, long userAccountId, double balance) {
		try {
			BalanceOperationLog bopl = new BalanceOperationLog();
			bopl.setOperationType(BalanceOperationLog.BALANCE_OP_PAY_FOR_DISHORDER);
			bopl.setCreateTime(System.currentTimeMillis());
			bopl.setDishOrderId(dishOrderId);
			bopl.setOperatorEmployeeId(employeeId);
			bopl.setUserAccountId(userAccountId);
			bopl.setStoreId(storeId);
			bopl.setDataSnapShot("使用 : " + amount + " 余额 : " + balance);
			_balanceOperationLogDao.save(bopl);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public List<BalanceOperationLog> getDailyBalanceRecordListByStoreId(
			long storeId, long startTimeLong, long endTimeLong) {
		return _balanceOperationLogDao.getDailyBalanceRecordListByStoreId(
				storeId, startTimeLong, endTimeLong);
	}

	public List<BalanceOperationLog> getMemberRechargeOperationLogsByUserAccountId(
			long userAccountId) {
		return _balanceOperationLogDao
				.getMemberRechargeOperationLogsByUserAccountId(userAccountId);
	}

	public List<BalanceOperationLog> getMemberExpenditureOperationLogsByUserAccountId(
			long userAccountId) {
		return _balanceOperationLogDao
				.getMemberExpenditureOperationLogsByUserAccountId(userAccountId);
	}
}

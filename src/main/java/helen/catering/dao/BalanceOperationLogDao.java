package helen.catering.dao;

import helen.catering.Utils;
import helen.catering.model.entities.BalanceOperationLog;
import helen.catering.model.entities.Employee;
import helen.catering.model.entities.UserAccount;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class BalanceOperationLogDao {
	@PersistenceContext
	private EntityManager entityManager;

	@Transactional
	public BalanceOperationLog save(BalanceOperationLog balanceOperationLog) {
		if (balanceOperationLog.getId() == 0) {
			balanceOperationLog.setId(Utils.generateEntityId());
		}
		return entityManager.merge(balanceOperationLog);
	}

	@SuppressWarnings("unchecked")
	public List<BalanceOperationLog> getMemberOperationLogsByUserAccountId(
			long userAccountId) {
		return entityManager
				.createQuery(
						"select ol from BalanceOperationLog ol where ol.userAccountId = ? order by createTime desc")
				.setParameter(1, userAccountId).getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<BalanceOperationLog> getDailyBalanceRecordListByStoreId(
			long storeId, long startTime, long endTime) {
		List<BalanceOperationLog> balanceOperationLogs = entityManager
				.createQuery(
						"select ol from BalanceOperationLog ol where ol.storeId = ? and ol.createTime between ? and ? order by createTime desc")
				.setParameter(1, storeId).setParameter(2, startTime)
				.setParameter(3, endTime).getResultList();

		for (BalanceOperationLog bopl : balanceOperationLogs) {
			if (bopl.getOperatorEmployeeId() != 0) {
				try {
					Employee employee = entityManager.find(Employee.class,
							bopl.getOperatorEmployeeId());
					bopl.setOperatorEmployee(employee);
				} catch (Exception e) {
				}
			}

			if (bopl.getUserAccountId() != null) {
				try {
					UserAccount member = entityManager.find(UserAccount.class,
							bopl.getUserAccountId());
					bopl.setMember(member);
				} catch (Exception e) {
				}
			}
		}

		return balanceOperationLogs;
	}

	@SuppressWarnings("unchecked")
	public List<BalanceOperationLog> getMemberRechargeOperationLogsByUserAccountId(
			long userAccountId) {
		return entityManager
				.createQuery(
						"select ol from BalanceOperationLog ol where ol.userAccountId = ? and ol.operationType=? order by createTime desc")
				.setParameter(1, userAccountId)
				.setParameter(2, BalanceOperationLog.BALANCE_OP_RECHARGE)
				.getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<BalanceOperationLog> getMemberExpenditureOperationLogsByUserAccountId(
			long userAccountId) {
		return entityManager
				.createQuery(
						"select ol from BalanceOperationLog ol where ol.userAccountId = ? and ol.operationType !=? order by createTime desc")
				.setParameter(1, userAccountId)
				.setParameter(2, BalanceOperationLog.BALANCE_OP_RECHARGE)
				.getResultList();
	}
}

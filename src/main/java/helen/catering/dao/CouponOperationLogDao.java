package helen.catering.dao;

import helen.catering.Utils;
import helen.catering.model.entities.CouponOperationLog;
import helen.catering.model.entities.UserAccount;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class CouponOperationLogDao {
	@PersistenceContext
	private EntityManager entityManager;

	@Transactional
	public CouponOperationLog save(CouponOperationLog COLog) {
		if (COLog.getId() == 0) {
			COLog.setId(Utils.generateEntityId());
		}
		return entityManager.merge(COLog);
	}

	@SuppressWarnings("unchecked")
	public List<CouponOperationLog> getCouponOperationLogsByUserAccountId(
			long userAccountId) {
		return entityManager
				.createQuery(
						"select ol from CouponOperationLog ol where ol.userAccountId = ? order by createTime desc")
				.setParameter(1, userAccountId).getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<CouponOperationLog> getDailyCouponRecordListByStoreId(
			long storeId, long startTime, long endTime) {
		List<CouponOperationLog> CouponOperationLogs = entityManager
				.createQuery(
						"select ol from CouponOperationLog ol where ol.storeId = ? and ol.createTime between ? and ? order by createTime desc")
				.setParameter(1, storeId).setParameter(2, startTime)
				.setParameter(3, endTime).getResultList();

		for (CouponOperationLog bopl : CouponOperationLogs) {
			if (bopl.getUserAccountId() != 0) {
				try {
					UserAccount member = entityManager.find(UserAccount.class,
							bopl.getUserAccountId());
					bopl.setMember(member);
				} catch (Exception e) {
				}
			}
		}

		return CouponOperationLogs;
	}
}

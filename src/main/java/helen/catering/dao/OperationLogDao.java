package helen.catering.dao;

import helen.catering.Utils;
import helen.catering.model.entities.OperationLog;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class OperationLogDao {
	@PersistenceContext
	private EntityManager entityManager;

	@Transactional
	public OperationLog save(OperationLog operationLog) {
		if (operationLog.getId() == 0) {
			operationLog.setId(Utils.generateEntityId());
		}
		return entityManager.merge(operationLog);
	}

	@SuppressWarnings("unchecked")
	public List<OperationLog> getdishOrderOperationLogsByStoreIdAndTime(
			long storeId, long startTimeLong, long endTimeLong) {
		return entityManager
				.createQuery(
						"select ol from OperationLog ol where ol.storeId = ? and ol.createTime between ? and ? and (ol.operationType=? or ol.operationType=? or ol.operationType=? or ol.operationType=? or ol.operationType=? or ol.operationType=?  ) order by createTime desc")
				.setParameter(1, storeId).setParameter(2, startTimeLong)
				.setParameter(3, endTimeLong)
				.setParameter(4, OperationLog.OP_CANCEL_ORDERITEM)
				.setParameter(5, OperationLog.OP_MERGE_DESK)
				.setParameter(6, OperationLog.OP_CHANGE_ORDERITEM)
				.setParameter(7, OperationLog.OP_APPLY_DISCOUNT_RULE)
				.setParameter(8, OperationLog.OP_RESTORE_BOOKING_DISHORDER)
				.setParameter(9, OperationLog.OP_RESTORE_DISHORDER)
				.getResultList();
	}
}

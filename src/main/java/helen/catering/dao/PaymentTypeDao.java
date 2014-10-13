package helen.catering.dao;

import helen.catering.Utils;
import helen.catering.model.entities.PaymentType;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class PaymentTypeDao {
	@PersistenceContext
	private EntityManager entityManager;

	@SuppressWarnings("unchecked")
	public List<PaymentType> getPaymentTypes(long storeId) {
		return entityManager
				.createQuery(
						"select pt from PaymentType pt where pt.storeId = ? order by sort")
				.setParameter(1, storeId).getResultList();
	}

	@Transactional
	public PaymentType save(PaymentType paymentType) {
		if (paymentType.getId() == 0) {
			paymentType.setId(Utils.generateEntityId());
		}
		return entityManager.merge(paymentType);
	}

	@Transactional
	public int deletePaymentType(long id) {
		return this.entityManager
				.createQuery("delete from PaymentType where id = ?")
				.setParameter(1, id).executeUpdate();
	}
}

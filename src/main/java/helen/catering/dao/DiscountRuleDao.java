package helen.catering.dao;

import helen.catering.Utils;
import helen.catering.model.entities.DiscountRule;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class DiscountRuleDao {
	@PersistenceContext
	private EntityManager entityManager;

	@SuppressWarnings("unchecked")
	public List<DiscountRule> getDiscountRules(long storeId) {
		return entityManager
				.createQuery(
						"select dr from DiscountRule dr where dr.storeId = ?")
				.setParameter(1, storeId).getResultList();
	}

	public DiscountRule find(long id) {
		try {

			return entityManager.find(DiscountRule.class, id);
		} catch (Exception e) {
			return null;
		}
	}

	@Transactional
	public DiscountRule save(DiscountRule discountRule) {
		if (discountRule.getId() == 0) {
			discountRule.setId(Utils.generateEntityId());
		}
		return entityManager.merge(discountRule);
	}

	@Transactional
	public int deleteDiscountRule(long id) {
		return this.entityManager
				.createQuery("delete from DiscountRule where id = ?")
				.setParameter(1, id).executeUpdate();
	}
}

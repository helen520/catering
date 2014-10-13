package helen.catering.dao;

import helen.catering.Utils;
import helen.catering.model.entities.NamedValue;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class NamedValueDao {

	@PersistenceContext
	private EntityManager entityManager;

	@Transactional
	public NamedValue save(NamedValue namedValue) {
		if (namedValue.getId() == 0) {
			namedValue.setId(Utils.generateEntityId());
		}
		return entityManager.merge(namedValue);
	}

	@Transactional
	public int deleteNamedValue(long id) {
		return this.entityManager
				.createQuery("delete from NamedValue where id = ?")
				.setParameter(1, id).executeUpdate();
	}

	@SuppressWarnings("unchecked")
	public List<NamedValue> getNamedValues(long storeId) {
		return entityManager
				.createQuery(
						"select nv from NamedValue nv where nv.storeId = ? order by value desc")
				.setParameter(1, storeId).getResultList();
	}

	public String getBeforDeleteNameValueTypeById(long id) {
		try {
			return (String) entityManager
					.createQuery(
							"select nv.type from NamedValue nv where nv.id = ? ")
					.setParameter(1, id).getSingleResult();
		} catch (Exception e) {
			return null;
		}
	}

	@SuppressWarnings("unchecked")
	public List<NamedValue> getDiscountRateByStoreId(long storeId) {
		return entityManager
				.createQuery(
						"select nv from NamedValue nv where nv.storeId = ? and nv.type=? order by value desc")
				.setParameter(1, storeId)
				.setParameter(2, NamedValue.TYPE_DISCOUNT_RATE).getResultList();
	}

}

package helen.catering.dao;

import helen.catering.Utils;
import helen.catering.model.entities.DishTag;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class DishTagDao {

	@PersistenceContext
	private EntityManager entityManager;

	@SuppressWarnings("unchecked")
	public List<DishTag> getCommonDishTags(long storeId) {
		return entityManager
				.createQuery(
						"select dt from DishTag dt "
								+ "where dt.storeId = ? and dt.dish = null order by sort")
				.setParameter(1, storeId).getResultList();
	}

	@Transactional
	public DishTag save(DishTag dishTag) {
		if (dishTag.getId() == 0) {
			dishTag.setId(Utils.generateEntityId());
		}
		return entityManager.merge(dishTag);
	}

	@Transactional
	public void deleteDishTagById(long dishTagId){
		DishTag dishTag = entityManager.find(DishTag.class, dishTagId);
		entityManager.remove(dishTag);
	}

	@Transactional
	public void deleteGroupDishTagList(long storeId, long dishId,
			int optionSetNo) throws Exception {
		String queryStr = "delete from DishTag where storeId = ? and dishId = ? and optionSetNo = ?";
		entityManager.createQuery(queryStr).setParameter(1, storeId)
				.setParameter(2, dishId).setParameter(3, optionSetNo)
				.executeUpdate();
	}
}
package helen.catering.dao;

import helen.catering.Utils;
import helen.catering.model.entities.DishCategory;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class DishCategoryDao {

	@PersistenceContext
	private EntityManager entityManager;

	public DishCategory getDishCategoryById(long id) {
		return entityManager.find(DishCategory.class, id);
	}

	@Transactional
	public DishCategory save(DishCategory dishCategory) {
		if (dishCategory.getId() == 0) {
			dishCategory.setId(Utils.generateEntityId());
		}
		return entityManager.merge(dishCategory);
	}
}

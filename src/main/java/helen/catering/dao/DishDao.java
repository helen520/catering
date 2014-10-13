package helen.catering.dao;

import helen.catering.Utils;
import helen.catering.model.entities.Dish;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class DishDao {
	@PersistenceContext
	private EntityManager entityManager;

	public Dish getDishById(long id) {
		try {
			return entityManager.find(Dish.class, id);
		} catch (Exception e) {
			return null;
		}
	}

	@Transactional
	public Dish save(Dish dish) {
		if (dish.getId() == 0) {
			dish.setId(Utils.generateEntityId());
		}
		return entityManager.merge(dish);
	}

	@Transactional
	public List<Dish> updateDishList(List<Dish> dishList) throws Exception {

		List<Dish> resultDishList = new ArrayList<Dish>();
		for (Dish dish : dishList) {
			resultDishList.add(entityManager.merge(dish));
		}

		return resultDishList;
	}

	@Transactional
	public boolean deleteDish(long dishId) {
		String queryStr = "delete from Dish where id = ?";
		int isSuccessed = this.entityManager.createQuery(queryStr)
				.setParameter(1, dishId).executeUpdate();
		if (isSuccessed != 1) {
			return false;
		}
		return true;
	}
}

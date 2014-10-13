package helen.catering.dao;

import helen.catering.Utils;
import helen.catering.model.entities.DishUnit;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class DishUnitDao {
	@PersistenceContext
	private EntityManager entityManager;

	@Transactional
	public DishUnit save(DishUnit dishUnit) {
		try {
			if (dishUnit.getId() == 0) {
				dishUnit.setId(Utils.generateEntityId());
			}
			return entityManager.merge(dishUnit);
		} catch (Exception e) {
			return null;
		}
	}

	@SuppressWarnings("unchecked")
	public List<DishUnit> getDishUnits(long storeId) {
		return entityManager
				.createQuery(
						"select du from DishUnit du where du.storeId = ? order by sort")
				.setParameter(1, storeId).getResultList();
	}

	@SuppressWarnings("unchecked")
	public DishUnit getDishUnitByName(long storeId, String name) {

		List<DishUnit> dishUnitList = entityManager
				.createQuery(
						"select du from DishUnit du where du.storeId = ? and du.name = ?")
				.setParameter(1, storeId).setParameter(2, name).getResultList();
		if (dishUnitList.size() > 0) {
			return dishUnitList.get(0);
		}

		return null;
	}

	@Transactional
	public int deleteDishUnit(long id) {
		return this.entityManager
				.createQuery("delete from DishUnit where id = ?")
				.setParameter(1, id).executeUpdate();
	}
}

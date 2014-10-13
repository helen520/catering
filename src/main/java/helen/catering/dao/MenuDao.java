package helen.catering.dao;

import helen.catering.Utils;
import helen.catering.model.entities.DishCategory;
import helen.catering.model.entities.Menu;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class MenuDao {

	@PersistenceContext
	private EntityManager entityManager;

	public Menu getMenuById(long id) {
		return entityManager.find(Menu.class, id);
	}

	@SuppressWarnings("unchecked")
	public List<Menu> getMenusByStoreId(long storeId) {

		String query = "select m from Menu m where m.storeId = ? order by sort";
		return entityManager.createQuery(query).setParameter(1, storeId)
				.getResultList();
	}

	@Transactional
	public Menu save(Menu menu) {
		if (menu.getId() == 0) {
			menu.setId(Utils.generateEntityId());
		}
		return entityManager.merge(menu);
	}

	@Transactional
	public boolean deleteMenu(long id) {
		String queryStr = "delete from Menu where id = ?";
		this.entityManager.createQuery(queryStr)
				.setParameter(1, id).executeUpdate();
		return true;
	}

	@Transactional
	public DishCategory saveDishCategory(DishCategory cat) {
		if (cat.getId() == 0) {
			cat.setId(Utils.generateEntityId());
		}
		return entityManager.merge(cat);
	}

	@Transactional
	public boolean deleteDishCategory(long id) {
		String queryStr = "delete from DishCategory where id = ?";
		this.entityManager.createQuery(queryStr)
				.setParameter(1, id).executeUpdate();
		return true;
	}
}

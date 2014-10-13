package helen.catering.dao;

import helen.catering.Utils;
import helen.catering.model.entities.Desk;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class DeskDao {

	@PersistenceContext
	private EntityManager entityManager;

	@SuppressWarnings("unchecked")
	public List<Desk> getDesks(long storeId) {
		return entityManager
				.createQuery(
						"select d from Desk d where d.storeId = ? order by sort,id")
				.setParameter(1, storeId).getResultList();
	}

	public Desk getDeskById(long id) {
		return entityManager.find(Desk.class, id);
	}

	@Transactional
	public Desk save(Desk desk) {
		if (desk.getId() == 0) {
			desk.setId(Utils.generateEntityId());
		}
		return entityManager.merge(desk);
	}

	@Transactional
	public boolean deleteDesk(long id) {
		String queryStr = "delete from Desk where id = ?";
		this.entityManager.createQuery(queryStr).setParameter(1, id)
				.executeUpdate();
		return true;
	}
}

package helen.catering.dao;

import helen.catering.Utils;
import helen.catering.model.entities.BOMLine;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class BOMLineDao {

	@PersistenceContext
	private EntityManager entityManager;

	@SuppressWarnings("unchecked")
	public List<BOMLine> getBOMLines(long storeId) {
		return entityManager
				.createQuery(
						"select d from BOMLine d where d.storeId = ? order by sort")
				.setParameter(1, storeId).getResultList();
	}

	public BOMLine getBOMLineById(long id) {
		try {
			return entityManager.find(BOMLine.class, id);
		} catch (Exception e) {
			return null;
		}
	}

	@Transactional
	public BOMLine save(BOMLine bomLine) {
		if (bomLine.getId() == 0) {
			bomLine.setId(Utils.generateEntityId());
		}
		return entityManager.merge(bomLine);
	}

	@Transactional
	public boolean deleteBOMLine(long id) {
		try {
			String queryStr = "delete from BOMLine where id = ?";
			int isSuccessed = this.entityManager.createQuery(queryStr)
					.setParameter(1, id).executeUpdate();
			if (isSuccessed == 1) {
				return true;
			} else
				return false;
		} catch (Exception e) {
			return false;
		}
	}

	@SuppressWarnings("unchecked")
	public List<BOMLine> getBOMLineByDishId(long dishId) {
		return entityManager
				.createQuery(
						"select d from BOMLine d where d.dishId = ? order by sort")
				.setParameter(1, dishId).getResultList();
	}
}

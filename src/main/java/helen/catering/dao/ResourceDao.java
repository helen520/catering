package helen.catering.dao;

import helen.catering.Utils;
import helen.catering.model.entities.Resource;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class ResourceDao {
	@PersistenceContext
	private EntityManager entityManager;

	@Transactional
	public Resource save(Resource resource) {
		if (resource.getId() == 0) {
			resource.setId(Utils.generateEntityId());
		}
		return entityManager.merge(resource);
	}

	@SuppressWarnings("unchecked")
	public List<Resource> getResourcesByTimeRangeId(long timeRangeId) {
		String hqlStr = "select res from Resource res where res.timeRangeId=? order by id";
		return entityManager.createQuery(hqlStr).setParameter(1, timeRangeId)
				.getResultList();
	}

	@Transactional
	public int deleteResource(long id) {
		return this.entityManager
				.createQuery("delete from Resource where id = ?")
				.setParameter(1, id).executeUpdate();
	}
}

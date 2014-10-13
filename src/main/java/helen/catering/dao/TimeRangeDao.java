package helen.catering.dao;

import helen.catering.Utils;
import helen.catering.model.entities.TimeRange;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class TimeRangeDao {
	@PersistenceContext
	private EntityManager entityManager;

	@Transactional
	public TimeRange save(TimeRange timeRange) {
		if (timeRange.getId() == 0) {
			timeRange.setId(Utils.generateEntityId());
		}
		return entityManager.merge(timeRange);
	}

	@SuppressWarnings("unchecked")
	public List<TimeRange> getTimeRagesByStoreId(long storeId) {
		String hqlStr = "select tr from TimeRange tr where tr.storeId=? order by name";
		return entityManager.createQuery(hqlStr).setParameter(1, storeId)
				.getResultList();
	}

	@Transactional
	public int deleteTimeRange(long id) {
		return this.entityManager
				.createQuery("delete from TimeRange where id = ?")
				.setParameter(1, id).executeUpdate();
	}
}

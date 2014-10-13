package helen.catering.dao;

import helen.catering.Utils;
import helen.catering.model.entities.Department;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class DepartmentDao {
	@PersistenceContext
	private EntityManager entityManager;
	
	@SuppressWarnings("unchecked")
	public List<Department> getDepartments(long storeId){
		return entityManager
				.createQuery("select d from Department d where d.storeId = ?")
				.setParameter(1, storeId).getResultList();
	}
	
	public Department find(long id) {
		return entityManager.find(Department.class, id);
	}

	@Transactional
	public boolean deleteDepartment(long id) {
		String queryStr = "delete from Department where id = ?";
		this.entityManager.createQuery(queryStr)
				.setParameter(1, id).executeUpdate();
		return true;
	}

	@Transactional
	public Department save(Department department) {
		if (department.getId() == 0) {
			department.setId(Utils.generateEntityId());
		}
		return entityManager.merge(department);	
	}
}

package helen.catering.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;

@Repository
public class UserInRoleDao {
	@PersistenceContext
	private EntityManager entityManager;

	@SuppressWarnings("unchecked")
	public Boolean employeeHasRole(long employeeId, String role) {
		String sqlStr = "SELECT * FROM UserInRole ui,Employee e,UserAccount ua WHERE ui.UserAccountId=ua.Id and ua.Id=e.UserAccountId and e.Id=? and ui.Role=?";
		List<Object> objList = entityManager.createNativeQuery(sqlStr)
				.setParameter(1, employeeId).setParameter(2, role)
				.getResultList();
		return objList.size() > 0 ? true : false;
	}
}

package helen.catering.dao;

import helen.catering.Utils;
import helen.catering.model.entities.Employee;
import helen.catering.model.entities.UserAccount;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class EmployeeDao {

	@PersistenceContext
	private EntityManager entityManager;

	public Employee find(long id) {
		try {
			return entityManager.find(Employee.class, id);
		} catch (Exception e) {
			return null;
		}
	}

	@Transactional
	public Employee save(Employee employee) {
		if (employee.getId() == 0) {
			employee.setId(Utils.generateEntityId());
		}
		return entityManager.merge(employee);
	}

	@SuppressWarnings("unchecked")
	public Employee getEmployeeByUserAccountId(long id) {
		List<Employee> employees = entityManager
				.createQuery(
						"select e from Employee e where e.userAccountId = ?")
				.setParameter(1, id).getResultList();
		if (employees == null || employees.size() == 0)
			return null;
		return employees.get(0);
	}

	@SuppressWarnings("unchecked")
	public Employee getEmployeeByStoreIdAndWorkNumber(long storeId,
			String workNumber) {
		List<Employee> employees = entityManager
				.createNativeQuery(
						"select e.* from Employee e left join UserAccount u on e.userAccountId=u.id where u.storeId = ? and e.workNumber = ?",
						Employee.class).setParameter(1, storeId)
				.setParameter(2, workNumber).getResultList();
		if (employees == null || employees.size() == 0)
			return null;
		return employees.get(0);
	}

	@SuppressWarnings("unchecked")
	public Employee getEmployeeByStoreIdAndSmartCardNo(long storeId,
			String smartCardNo) {
		List<Employee> employees = entityManager
				.createNativeQuery(
						"select e.* from Employee e left join UserAccount u on e.userAccountId=u.id where u.storeId = ? and e.smartCardNo = ?",
						Employee.class).setParameter(1, storeId)
				.setParameter(2, smartCardNo).getResultList();
		if (employees == null || employees.size() == 0)
			return null;
		return employees.get(0);
	}

	@SuppressWarnings("unchecked")
	public List<Employee> getEmployeeListByStoreId(long storeId) {
		List<Employee> employees = entityManager
				.createQuery(
						"select e from Employee e where e.storeId = ? order by workNumber")
				.setParameter(1, storeId).getResultList();
		for (Employee employee : employees) {
			UserAccount user = entityManager.find(UserAccount.class,
					employee.getUserAccountId());
			if (user != null) {
				employee.setLoginNo(user.getLoginName());
			}
		}
		return employees;
	}

	@SuppressWarnings("unchecked")
	public Employee getEmployeeById(long employeeId) {
		List<Employee> employees = entityManager
				.createQuery("select e from Employee e where e.id = ?")
				.setParameter(1, employeeId).getResultList();
		if (employees == null || employees.size() == 0)
			return null;
		return employees.get(0);
	}
}

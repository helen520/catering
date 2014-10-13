package helen.catering.dao;

import helen.catering.Utils;
import helen.catering.model.entities.MemberPolicy;
import helen.catering.model.entities.PosPrinter;
import helen.catering.model.entities.Store;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class StoreDao {

	@PersistenceContext
	private EntityManager entityManager;

	public Store find(long id) {
		return entityManager.find(Store.class, id);
	}

	@Transactional
	public Store save(Store store) {
		if (store.getId() == 0) {
			store.setId(Utils.generateEntityId());
		}
		return entityManager.merge(store);
	}

	@SuppressWarnings("unchecked")
	public List<MemberPolicy> getMemberPolicyByStoreId(long storeId) {
		return entityManager
				.createQuery(
						"select mp from MemberPolicy mp where mp.storeId=? and mp.startDate <=? and mp.endDate >= ?")
				.setParameter(1, storeId)
				.setParameter(2, System.currentTimeMillis())
				.setParameter(3, System.currentTimeMillis()).getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<PosPrinter> getCNPrintersByStoreId(long storeId) {
		return entityManager
				.createQuery(
						"select p from PosPrinter p where storeId=? and canPrintCustomerNote=?")
				.setParameter(1, storeId).setParameter(2, true).getResultList();
	}

	public Store selectstoreIdForWechat(String toStorename) {
		try {
			return (Store) entityManager
					.createQuery("select s from Store s where openId=? ")
					.setParameter(1, toStorename).getSingleResult();
		} catch (Exception e) {
			return null;
		}
	}

	@Transactional
	public boolean salesDataReset(long storeId) {
		entityManager
				.createNativeQuery(
						"DELETE oit from OrderItemTag oit inner join OrderItem oi on oit.OrderItemId=oi.id INNER join DishOrder dod on oi.DishOrderId=dod.id where dod.StoreId=?")
				.setParameter(1, storeId).executeUpdate();
		entityManager
				.createNativeQuery(
						"DELETE oi from OrderItem oi INNER join DishOrder dod on oi.DishOrderId=dod.id where dod.StoreId=?")
				.setParameter(1, storeId).executeUpdate();
		entityManager
				.createNativeQuery(
						"DELETE dot from DishOrderTag dot INNER join DishOrder dod on dot.DishOrderId=dod.id where dod.StoreId=?")
				.setParameter(1, storeId).executeUpdate();
		entityManager
				.createNativeQuery(
						"DELETE pr from PayRecord pr INNER join DishOrder dod on pr.DishOrderId=dod.id where dod.StoreId=?")
				.setParameter(1, storeId).executeUpdate();
		entityManager.createNativeQuery("delete from Coupon where storeId=?")
				.setParameter(1, storeId).executeUpdate();
		entityManager
				.createNativeQuery("delete from BookRecord where storeId=?")
				.setParameter(1, storeId).executeUpdate();
		entityManager
				.createNativeQuery(
						"delete ua from UserAccount ua left join UserInRole uir on ua.Id=uir.UserAccountId where uir.Id is null and ua.storeId=?")
				.setParameter(1, storeId).executeUpdate();
		entityManager
				.createNativeQuery("delete from DishOrder where storeId=?")
				.setParameter(1, storeId).executeUpdate();
		return true;
	}
}

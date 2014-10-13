package helen.catering.dao;

import helen.catering.Utils;
import helen.catering.model.entities.BookRecord;
import helen.catering.model.entities.DishOrder;
import helen.catering.model.entities.UserAccount;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class BookRecordDao {
	@PersistenceContext
	private EntityManager entityManager;

	@Transactional
	public BookRecord save(BookRecord bookRecord) {
		if (bookRecord.getId() == 0) {
			bookRecord.setId(Utils.generateEntityId());
		}
		return entityManager.merge(bookRecord);
	}

	public BookRecord find(Long bookRecordId) {
		return entityManager.find(BookRecord.class, bookRecordId);
	}

	public BookRecord getBookRecordById(Long bookRecordId) {
		try {
			return (BookRecord) this.entityManager
					.createQuery("select br from BookRecord br where br.id=?")
					.setParameter(1, bookRecordId).getSingleResult();
		} catch (Exception e) {
			return null;
		}
	}

	@Transactional
	public BookRecord saveBookRecor(BookRecord bookRecord) {
		if (bookRecord.getId() == 0) {
			bookRecord.setId(Utils.generateEntityId());
		}
		return entityManager.merge(bookRecord);
	}

	public int getBookRecordCount(long customerUserId) {
		String sqlStr = "select COUNT(*) from BookRecord where customerUserId="
				+ customerUserId;
		return entityManager.createNativeQuery(sqlStr).getFirstResult();
	}

	@SuppressWarnings("unchecked")
	public List<BookRecord> getBookRecordList(long customerUserId,
			long startTime) {
		List<BookRecord> bookRecords = entityManager
				.createQuery(
						"select br from BookRecord br where br.customerUserId=? and ?<br.expectedArriveTime order by createTime desc")
				.setParameter(1, customerUserId).setParameter(2, startTime)
				.getResultList();
		List<BookRecord> bookRecordList = this
				.setBookRecordsDishOrder(bookRecords);
		return bookRecordList;
	}

	@SuppressWarnings("unchecked")
	public List<BookRecord> getBookRecordList(long storeId, long startTime,
			long endTime) {
		String hqlStr = "select br from BookRecord br where br.expectedArriveTime between ? and ? and br.storeId=? and br.state !=? order by createTime desc";
		return entityManager.createQuery(hqlStr).setParameter(1, startTime)
				.setParameter(2, endTime).setParameter(3, storeId)
				.setParameter(4, BookRecord.RESERVATION_CANCELED)
				.getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<BookRecord> getBookRecordListInBookingStateByStoreId(
			long storeId) {
		List<BookRecord> bookRecords = entityManager
				.createQuery(
						"select br from BookRecord br where br.storeId=? and br.state=? order by createTime")
				.setParameter(1, storeId)
				.setParameter(2, BookRecord.RESERVATION_BOOKING)
				.getResultList();
		List<BookRecord> bookRecordList = this
				.setBookRecordsDishOrder(bookRecords);

		return bookRecordList;
	}

	@Transactional
	public int operatedBookrecord(long bookRecordId, int state) {
		return entityManager
				.createQuery(
						"update BookRecord set state=? where id=? and state=1")
				.setParameter(1, state).setParameter(2, bookRecordId)
				.executeUpdate();
	}

	@SuppressWarnings("unchecked")
	public List<BookRecord> getBookRecordsByPhoneOrMemberCartNo(long storeId,
			String searchStr) {
		UserAccount user = null;
		try {
			user = (UserAccount) this.entityManager
					.createQuery(
							"select ua from UserAccount ua where ua.memberCardNo=?")
					.setParameter(1, searchStr).getSingleResult();
		} catch (Exception e) {
		}
		List<BookRecord> resultBookRecords = this.entityManager
				.createQuery(
						"select br from BookRecord br where br.contactTel=? order by CreateTime desc")
				.setParameter(1, searchStr).getResultList();
		if (user != null) {
			List<BookRecord> bookRecords = this.entityManager
					.createQuery(
							"select br from BookRecord br where br.customerUserId=? order by CreateTime desc")
					.setParameter(1, user.getId()).getResultList();
			resultBookRecords.addAll(bookRecords);
		}

		List<BookRecord> bookRecordList = this
				.setBookRecordsDishOrder(resultBookRecords);

		return bookRecordList;
	}

	public List<BookRecord> setBookRecordsDishOrder(List<BookRecord> bookRecords) {

		List<BookRecord> bookRecordList = new ArrayList<BookRecord>();
		for (BookRecord bookRecord : bookRecords) {
			DishOrder dishOrder = null;
			try {
				dishOrder = (DishOrder) this.entityManager
						.createQuery(
								"select do from DishOrder do where do.bookRecordId=?")
						.setParameter(1, bookRecord.getId()).getSingleResult();
			} catch (Exception e) {
				dishOrder = null;
			}
			if (bookRecord.getIsServingArrived()) {
				if (dishOrder == null) {
					continue;
				} else {
					bookRecord.setDishOrder(dishOrder);
					if (dishOrder.getPrePay() == null
							|| dishOrder.getPrePay() <= 0) {
						continue;
					}
				}
			}

			if (dishOrder != null) {
				bookRecord.setDishOrder(dishOrder);
			}
			bookRecordList.add(bookRecord);
		}

		return bookRecordList;
	}

	@SuppressWarnings("unchecked")
	public List<BookRecord> getAllBookRecordsByStoreId(long storeId) {
		List<BookRecord> bookRecords = this.entityManager
				.createQuery(
						"select br from BookRecord br where br.storeId=? order by CreateTime desc")
				.setParameter(1, storeId).getResultList();
		List<BookRecord> bookRecordList = this
				.setBookRecordsDishOrder(bookRecords);

		return bookRecordList;
	}

	@SuppressWarnings("unchecked")
	public List<BookRecord> getAllBookRecordsByStarTime(long storeId,
			long starTime) {
		List<BookRecord> bookRecords = this.entityManager
				.createQuery(
						"select br from BookRecord br where br.storeId=? and br.expectedArriveTime>? order by CreateTime desc")
				.setParameter(1, storeId).setParameter(2, starTime)
				.getResultList();
		List<BookRecord> bookRecordList = this
				.setBookRecordsDishOrder(bookRecords);

		return bookRecordList;
	}

	@SuppressWarnings("unchecked")
	public List<BookRecord> getAllBookRecordsByDate(long storeId,
			long starTime, long endTime) {
		List<BookRecord> bookRecords = this.entityManager
				.createQuery(
						"select br from BookRecord br where br.storeId=? and br.expectedArriveTime between ? and ? order by CreateTime desc")
				.setParameter(1, storeId).setParameter(2, starTime)
				.setParameter(3, endTime).getResultList();
		List<BookRecord> bookRecordList = this
				.setBookRecordsDishOrder(bookRecords);

		return bookRecordList;
	}

}

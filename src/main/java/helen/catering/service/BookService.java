package helen.catering.service;

import helen.catering.Utils;
import helen.catering.dao.BookRecordDao;
import helen.catering.dao.DishOrderDao;
import helen.catering.dao.ResourceDao;
import helen.catering.dao.TimeRangeDao;
import helen.catering.dao.UserAccountDao;
import helen.catering.model.entities.BookRecord;
import helen.catering.model.entities.DishOrder;
import helen.catering.model.entities.OrderItem;
import helen.catering.model.entities.Resource;
import helen.catering.model.entities.TimeRange;
import helen.catering.model.entities.UserAccount;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class BookService {
	@Autowired
	private TimeRangeDao _timeRangeDao;
	@Autowired
	private ResourceDao _resourceDao;
	@Autowired
	private BookRecordDao _bookRecordDao;
	@Autowired
	private DishOrderDao _dishOrderDao;
	@Autowired
	private UserAccountDao _userAccountDao;
	@Autowired
	BalanceOperationLogService _balanceOperationLogService;;

	public List<TimeRange> getTimeRagesByStoreId(long storeId) {
		List<TimeRange> timeRangeList = this._timeRangeDao
				.getTimeRagesByStoreId(storeId);
		for (TimeRange timeRange : timeRangeList) {
			timeRange.setResourceList(this._resourceDao
					.getResourcesByTimeRangeId(timeRange.getId()));
		}
		return timeRangeList;
	}

	public List<Resource> getResourcesByTimeRangeId(long storeId,
			long timeRangeId, long expectedArriveDate) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		String expectedArriveDateStr = Utils
				.formatShortDateTimeYMD(expectedArriveDate);

		long startTime = 0;
		long endTime = 0;

		try {
			startTime = sdf.parse(expectedArriveDateStr + " 00:00").getTime();
			endTime = sdf.parse(expectedArriveDateStr + " 23:59").getTime();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		List<BookRecord> bookRecordList = this._bookRecordDao
				.getBookRecordList(storeId, startTime, endTime);
		Map<Long, Integer> map = new HashMap<Long, Integer>();
		for (BookRecord bookRecord : bookRecordList) {
			if (map.containsKey(bookRecord.getResourceId())) {
				map.put(bookRecord.getResourceId(),
						map.get(bookRecord.getResourceId()) + 1);
			} else {
				map.put(bookRecord.getResourceId(), 1);
			}
		}
		List<Resource> resourceList = this._resourceDao
				.getResourcesByTimeRangeId(timeRangeId);
		for (Resource resource : resourceList) {
			if (map.containsKey(resource.getId())) {
				resource.setAmount(resource.getAmount()
						- map.get(resource.getId()));
			}
		}
		return resourceList;
	}

	public BookRecord saveBook(BookRecord bookRecord) {
		return this._bookRecordDao.saveBookRecor(bookRecord);
	}

	public List<BookRecord> getBookRecordList(long customerUserId) {
		return this._bookRecordDao.getBookRecordList(customerUserId,
				new Date().getTime() - 60 * 60 * 1000);

	}

	public void operatedBookrecord(long bookRecordId, long employeeId, int state) {
		int successed = _bookRecordDao.operatedBookrecord(bookRecordId, state);
		if (successed == 1 && state == BookRecord.RESERVATION_CANCELED) {
			BookRecord bookRecord = _bookRecordDao.find(bookRecordId);
			DishOrder dishOrder = _dishOrderDao
					.getDishOrderByBookRecordId(bookRecordId);

			if (bookRecord != null && dishOrder != null
					&& dishOrder.getState() != DishOrder.STATE_CANCELLED) {
				dishOrder.setState(DishOrder.STATE_CANCELLED);
				if (dishOrder.getPrePay() != null && dishOrder.getPrePay() > 0) {
					UserAccount user = _userAccountDao.find(bookRecord
							.getCustomerUserId());
					if (user != null) {
						user.setBalance(user.getBalance()
								+ dishOrder.getPrePay());
					}
					_userAccountDao.save(user);
					_balanceOperationLogService.returnUsedBalance(
							user.getStoreId(), employeeId, dishOrder.getId(),
							dishOrder.getPrePay(), user.getId(),
							user.getBalance());
				}
				if (dishOrder.getOrderItems() != null) {
					for (OrderItem oi : dishOrder.getOrderItems()) {
						oi.setState(OrderItem.STATE_CANCELLED);
					}
				}
				_dishOrderDao.save(dishOrder);
			}
		}
	}

	public List<BookRecord> getBookRecordsByPhoneOrMemberCartNo(long storeId,
			String searchStr) {
		return _bookRecordDao.getBookRecordsByPhoneOrMemberCartNo(storeId,
				searchStr);
	}

	public List<BookRecord> getAllBookRecordsByStoreId(long storeId) {
		return _bookRecordDao.getAllBookRecordsByStoreId(storeId);
	}

	public BookRecord getBookRecordById(long bookRecordId) {
		return this._bookRecordDao.find(bookRecordId);
	}

	public List<BookRecord> getAllBookRecordsByStarTime(long storeId,
			long starTime) {
		return _bookRecordDao.getAllBookRecordsByStarTime(storeId, starTime);
	}

	public List<BookRecord> getAllBookRecordsByDate(long storeId,
			long starTime, long endTime) {
		return _bookRecordDao.getAllBookRecordsByDate(storeId, starTime,
				endTime);
	}
}

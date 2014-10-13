package helen.catering.controller;

import helen.catering.Utils;
import helen.catering.model.entities.BookRecord;
import helen.catering.model.entities.DishOrder;
import helen.catering.model.entities.Resource;
import helen.catering.model.entities.TimeRange;
import helen.catering.model.entities.UserAccount;
import helen.catering.service.BookService;
import helen.catering.service.OrderingService;
import helen.catering.service.StoreDataService;
import helen.catering.service.UserService;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/book/")
public class BookController {
	@Autowired
	private BookService _bookService;
	@Autowired
	private UserService _userService;
	@Autowired
	private StoreDataService _StoreDataService;
	@Autowired
	private OrderingService _orderingService;

	@RequestMapping("bookIndex")
	public ModelAndView bookIndex(
			@RequestParam(value = "storeId") long storeId,
			@RequestParam(value = "userId", defaultValue = "0") Long userId,
			@RequestParam(value = "openId", defaultValue = "") String openId) {

		UserAccount userAccount = null;
		if (userId != 0) {
			userAccount = _userService.getUserAccountById(userId);
		} else if (!openId.equals("")) {
			userAccount = _userService.getUserAccountByOpenId(openId);
		}

		if (userAccount == null) {
			return new ModelAndView("error").addObject("message", "用户不存在!!!");
		}

		if (openId.equals("") && userAccount.getWeChatOpenId() != null
				&& !userAccount.getWeChatOpenId().equals("")) {
			openId = userAccount.getWeChatOpenId();
		}

		if (userAccount.getMemberCardNo() == null) {
			return new ModelAndView("redirect:/member/memberPage?storeId="
					+ storeId + "&&userId=" + userAccount.getId() + "&&openId="
					+ openId + "&&isBooking=true");
		}

		List<TimeRange> timeRangeList = this._bookService
				.getTimeRagesByStoreId(storeId);
		int bookRecordsNum = this._bookService.getBookRecordList(
				userAccount.getId()).size();
		Date nowDate = new Date();

		ModelAndView mav = new ModelAndView();
		mav.setViewName("bookIndex");
		mav.addObject("contactName",
				userAccount != null ? userAccount.getName() : "");
		mav.addObject("contactTel",
				userAccount != null ? userAccount.getMobileNo() : "");
		mav.addObject("timeRangeList", timeRangeList);
		mav.addObject("storeId", storeId);
		mav.addObject("customerUserId", userAccount.getId());
		mav.addObject("nowDate", Utils.formatShortDateTimeYMD(nowDate));
		mav.addObject("bookRecordsNum", bookRecordsNum);
		mav.addObject("openId", openId);

		return mav;
	}

	@RequestMapping(value = "getResources", method = RequestMethod.POST)
	public @ResponseBody
	List<Resource> getResourcesByTimeRangeId(
			@RequestParam(value = "storeId") long storeId,
			@RequestParam(value = "timeRangeId") long timeRangeId,
			@RequestParam(value = "expectedArriveDate", required = false) String expectedArriveDate) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		long expectedArriveDateMillisecond = 0;
		try {
			expectedArriveDateMillisecond = sdf.parse(expectedArriveDate)
					.getTime();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return this._bookService.getResourcesByTimeRangeId(storeId,
				timeRangeId, expectedArriveDateMillisecond);
	}

	@RequestMapping(value = "submitBook", method = RequestMethod.POST)
	public @ResponseBody
	BookRecord submitBook(
			@RequestParam(value = "timeRangeId", required = false) long timeRangeId,
			@RequestParam(value = "resourceStr", required = false) String resourceStr,
			@RequestParam(value = "storeId", required = false) long storeId,
			@RequestParam(value = "count", required = false, defaultValue = "0") int count,
			@RequestParam(value = "customerUserId", required = false) long customerUserId,
			@RequestParam(value = "contactName", required = false, defaultValue = "") String contactName,
			@RequestParam(value = "contactTel", required = false, defaultValue = "") String contactTel,
			@RequestParam(value = "memo", required = false, defaultValue = "") String memo,
			@RequestParam(value = "expectedArriveTime", required = false) String expectedArriveTime,
			@RequestParam(value = "expectedArriveDate", required = false) String expectedArriveDate,
			@RequestParam(value = "isServingArrived", required = false, defaultValue = "false") boolean isServingArrived) {

		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");

		if (resourceStr != null) {
			long resourceId = Long.parseLong(resourceStr.split(",")[0]);
			String resourceName = resourceStr.split(",")[1];
			Long expectedArriveTimeMillionSeconds = 0l;
			try {
				expectedArriveTimeMillionSeconds = sdf.parse(
						expectedArriveDate + " " + expectedArriveTime)
						.getTime();
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			BookRecord bookRecord = new BookRecord();
			bookRecord.setId(Utils.generateEntityId());
			bookRecord.setCreateTime(new java.util.Date().getTime());
			bookRecord.setCount(count);
			bookRecord.setTimeRangeId(timeRangeId);
			bookRecord.setResourceId(resourceId);
			bookRecord.setStoreId(storeId);
			bookRecord.setCustomerUserId(customerUserId);
			bookRecord.setContactName(contactName);
			bookRecord.setResourceName(resourceName);
			bookRecord.setContactTel(contactTel);
			bookRecord.setExpectedArriveTime(expectedArriveTimeMillionSeconds);
			bookRecord.setState(BookRecord.RESERVATION_BOOKING);
			bookRecord.setMemo(memo);
			bookRecord.setIsServingArrived(isServingArrived);

			try {

				List<DishOrder> bookingDishOrders = _orderingService
						.getBookingDishOrderByUserId(customerUserId);
				if (bookingDishOrders != null && bookingDishOrders.size() > 0) {
					bookRecord.setHadBookingDishOrder(true);
					bookRecord.setIsServingArrived(false);
				}

				this._bookService.saveBook(bookRecord);

				return bookRecord;
			} catch (Exception e) {
				return null;
			}
		}
		return null;
	}

	@RequestMapping("getBookRecordList")
	public ModelAndView bookRecordList(
			@RequestParam(value = "customerUserId", required = false) long customerUserId,
			@RequestParam(value = "storeId") long storeId,
			@RequestParam(value = "openId", defaultValue = "") String openId) {
		List<BookRecord> bookRecordList = this._bookService
				.getBookRecordList(customerUserId);

		ModelAndView mav = new ModelAndView();
		mav.setViewName("bookRecordList");
		mav.addObject("bookRecordList", bookRecordList);
		mav.addObject("openId", openId);
		mav.addObject("storeId", storeId);
		mav.addObject("userId", customerUserId);

		return mav;
	}

	@RequestMapping("cancelBook")
	public String cancelBook(
			@RequestParam(value = "bookRecordId", required = false) long bookRecordId,
			@RequestParam(value = "customerUserId", required = false) long customerUserId,
			@RequestParam(value = "storeId", required = false) long storeId,
			@RequestParam(value = "openId", required = false, defaultValue = "") String openId) {
		try {
			this._bookService.operatedBookrecord(bookRecordId, 0,
					BookRecord.RESERVATION_CANCELED);
		} catch (Exception e) {
			// TODO: handle exception
		}

		return "redirect:getBookRecordList?customerUserId=" + customerUserId
				+ "&storeId=" + storeId + "&openId=" + openId;
	}

	@ResponseBody
	@RequestMapping("operatedBookrecord")
	public boolean operatedBookrecord(
			@RequestParam(value = "bookRecordId") long bookRecordId,
			@RequestParam(value = "employeeId") long employeeId,
			@RequestParam(value = "isSure") boolean isSure) {
		try {
			int state = BookRecord.RESERVATION_CANCELED;
			if (isSure) {
				state = BookRecord.RESERVATION_CONFIRMED;
			}
			this._bookService.operatedBookrecord(bookRecordId, employeeId,
					state);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	@ResponseBody
	@RequestMapping("getBookRecordsByPhoneOrMemberCartNo")
	public List<BookRecord> getBookRecordsByPhoneOrMemberCartNo(
			@RequestParam long storeId, @RequestParam String searchStr) {
		List<BookRecord> bookRecords = new ArrayList<BookRecord>();
		if (!searchStr.equals("0")) {
			bookRecords = this._bookService
					.getBookRecordsByPhoneOrMemberCartNo(storeId, searchStr);
		} else {
			bookRecords = this._bookService.getAllBookRecordsByStoreId(storeId);
		}
		return bookRecords;
	}

	@ResponseBody
	@RequestMapping("getBookRecordsByDate")
	public List<BookRecord> getBookRecordsByDate(@RequestParam long storeId,
			@RequestParam String starTime,
			@RequestParam(required = false, defaultValue = "") String endTime) {
		List<BookRecord> bookRecords = new ArrayList<BookRecord>();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		long starTimeLong = 0;
		long endTimeLong = 0;
		try {
			starTimeLong = sdf.parse(starTime).getTime();
			if (!endTime.equals("")) {
				endTimeLong = sdf.parse(endTime).getTime();
			}
		} catch (ParseException e) {
			e.printStackTrace();
		}

		if (endTime.equals("")) {
			bookRecords = this._bookService.getAllBookRecordsByStarTime(
					storeId, starTimeLong);
		} else {
			bookRecords = this._bookService.getAllBookRecordsByDate(storeId,
					starTimeLong, endTimeLong);
		}

		return bookRecords;
	}

	@ResponseBody
	@RequestMapping("getBookRecordsById")
	public BookRecord getBookRecordsById(@RequestParam long bookRecordId) {
		return this._bookService.getBookRecordById(bookRecordId);
	}
}

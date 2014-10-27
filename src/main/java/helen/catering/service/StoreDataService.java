package helen.catering.service;

import helen.catering.dao.BookRecordDao;
import helen.catering.dao.DepartmentDao;
import helen.catering.dao.DeskDao;
import helen.catering.dao.DiscountRuleDao;
import helen.catering.dao.DishCategoryDao;
import helen.catering.dao.DishTagDao;
import helen.catering.dao.DishUnitDao;
import helen.catering.dao.MealDealItemDao;
import helen.catering.dao.MenuDao;
import helen.catering.dao.NamedValueDao;
import helen.catering.dao.PaymentTypeDao;
import helen.catering.dao.PosPrinterDao;
import helen.catering.dao.ResourceDao;
import helen.catering.dao.StoreDao;
import helen.catering.dao.TimeRangeDao;
import helen.catering.dao.UserAccountDao;
import helen.catering.model.DishCategoryBrief;
import helen.catering.model.DishOrderBrief;
import helen.catering.model.DynamicDataBrief;
import helen.catering.model.StoreData;
import helen.catering.model.entities.BookRecord;
import helen.catering.model.entities.CouponTemplate;
import helen.catering.model.entities.Dish;
import helen.catering.model.entities.DishCategory;
import helen.catering.model.entities.DishOrder;
import helen.catering.model.entities.MemberPolicy;
import helen.catering.model.entities.Menu;
import helen.catering.model.entities.NamedValue;
import helen.catering.model.entities.PosPrinter;
import helen.catering.model.entities.Resource;
import helen.catering.model.entities.Store;
import helen.catering.model.entities.TimeRange;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Random;

import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class StoreDataService {

	@Autowired
	private DeskDao _deskDao;

	@Autowired
	private DiscountRuleDao _discountRuleDao;

	@Autowired
	private DepartmentDao _departmentDao;

	@Autowired
	private DishUnitDao _dishUnitDao;

	@Autowired
	private DishTagDao _dishTagDao;

	@Autowired
	private DishCategoryDao _dishCategoryDao;

	@Autowired
	private MenuDao _menuDao;

	@Autowired
	private NamedValueDao _namedValueDao;

	@Autowired
	private OrderingService _orderingService;

	@Autowired
	private PaymentTypeDao _paymentTypeDao;

	@Autowired
	private StoreDao _storeDao;
	@Autowired
	private BookRecordDao _bookRecordDao;

	@Autowired
	private MealDealItemDao _mealDealItemDao;

	@Autowired
	private UserAccountDao _userAccountDao;

	@Autowired
	private PosPrinterDao _posPrinterDao;

	@Autowired
	private TimeRangeDao _timeRangeDao;

	@Autowired
	private ResourceDao _resourceDao;

	public StoreData getStoreDataById(long storeId) {

		StoreData storeData = new StoreData();

		storeData.setStore(_storeDao.find(storeId));
		storeData.setDesks(_deskDao.getDesks(storeId));
		storeData.setPaymentTypes(_paymentTypeDao.getPaymentTypes(storeId));
		storeData.setDiscountRules(_discountRuleDao.getDiscountRules(storeId));
		storeData.setDepartments(_departmentDao.getDepartments(storeId));
		storeData.setDishUnits(_dishUnitDao.getDishUnits(storeId));
		storeData.setCommonDishTags(_dishTagDao.getCommonDishTags(storeId));
		storeData.setCouponTemplates(_userAccountDao
				.getCouponTemplateByStoreIdAndTriggerEvent(storeId,
						CouponTemplate.TRIGGEREVENT_MANUAL_OPERATION));
		storeData.setMealDealItems(_mealDealItemDao
				.getMealDealItemsByStoreId(storeId));
		storeData.setPosPrinters(_posPrinterDao.getPrintersByStoreId(storeId));

		List<Menu> menuList = _menuDao.getMenusByStoreId(storeId);
		for (Menu menu : menuList) {
			Collections.sort(menu.getDishCategories());
			for (DishCategory dc : menu.getDishCategories()) {
				dc.updateJsonHash();

				Collections.sort(dc.getDishes());
				dc.setMenuId(dc.getMenu().getId());
				for (Dish dish : dc.getDishes()) {
					if (dish.getDishTags().size() > 0) {
						Collections.sort(dish.getDishTags());
					}
				}
			}
		}
		storeData.setMenus(menuList);

		List<NamedValue> namedValues = _namedValueDao.getNamedValues(storeId);
		List<NamedValue> discountRates = new ArrayList<NamedValue>();
		List<NamedValue> serviceFeeRates = new ArrayList<NamedValue>();
		List<NamedValue> cancelReasons = new ArrayList<NamedValue>();
		for (NamedValue namedValue : namedValues) {
			if (NamedValue.TYPE_DISCOUNT_RATE.equals(namedValue.getType())) {
				discountRates.add(namedValue);
			}
			if (NamedValue.TYPE_SERVICE_FEE_RATE.equals(namedValue.getType())) {
				serviceFeeRates.add(namedValue);
			}
			if (NamedValue.TYPE_CANCEL_REASON.equals(namedValue.getType())) {
				cancelReasons.add(namedValue);
			}
		}
		storeData.setDiscountRates(discountRates);
		storeData.setServiceFeeRates(serviceFeeRates);
		storeData.setCancelReasons(cancelReasons);

		List<TimeRange> timeRanges = _timeRangeDao
				.getTimeRagesByStoreId(storeId);
		storeData.setTimeRanges(timeRanges);

		List<Resource> resources = new ArrayList<Resource>();
		for (TimeRange timeRange : timeRanges) {
			resources.addAll(_resourceDao.getResourcesByTimeRangeId(timeRange
					.getId()));
		}
		storeData.setResources(resources);

		return storeData;
	}

	public DynamicDataBrief getDynamicDataBriefById(long storeId,
			String lastMenuHash, String lastActiveDishOrderSetHash,
			String lastBookingRecordsHash, String lastSelfDishOrdersHash) {

		DynamicDataBrief ddb = new DynamicDataBrief();

		List<DishCategoryBrief> dcbList = new ArrayList<DishCategoryBrief>();
		List<Menu> menuList = _menuDao.getMenusByStoreId(storeId);
		for (Menu menu : menuList) {

			Collections.sort(menu.getDishCategories());
			for (DishCategory dc : menu.getDishCategories()) {
				dc.updateJsonHash();

				DishCategoryBrief dcb = new DishCategoryBrief();
				dcb.setDishCategoryId(dc.getId());
				dcb.setJsonHash(dc.getJsonHash());

				dcbList.add(dcb);
			}
		}

		List<DishOrderBrief> dobList = _orderingService
				.getActiveDishOrderBriefsByStoreId(storeId);

		List<BookRecord> brList = _bookRecordDao
				.getBookRecordListInBookingStateByStoreId(storeId);

		List<DishOrder> sdoList = _orderingService.getSelfDishOrderByStoreId(
				storeId, brList);

		ObjectMapper om = new ObjectMapper();
		org.getopt.util.hash.FNV164 fnv1 = new org.getopt.util.hash.FNV164();

		byte[] jsonBytes;
		try {
			jsonBytes = om.writeValueAsBytes(dcbList);
			fnv1.init(jsonBytes, 0, jsonBytes.length);
			ddb.setMenuHash(String.valueOf(fnv1.getHash()));
		} catch (Exception e) {
			ddb.setMenuHash(String.valueOf(new Random().nextLong()));
		}

		try {
			jsonBytes = om.writeValueAsBytes(dobList);
			fnv1.init(jsonBytes, 0, jsonBytes.length);
			ddb.setActiveDishOrderSetHash(String.valueOf(fnv1.getHash()));
		} catch (Exception e) {
			ddb.setActiveDishOrderSetHash(String.valueOf(new Random()
					.nextLong()));
		}
		try {
			jsonBytes = om.writeValueAsBytes(brList);
			fnv1.init(jsonBytes, 0, jsonBytes.length);
			ddb.setBookingRecordsHash(String.valueOf(fnv1.getHash()));
		} catch (Exception e) {
			ddb.setBookingRecordsHash(String.valueOf(new Random().nextLong()));
		}
		try {
			jsonBytes = om.writeValueAsBytes(sdoList);
			fnv1.init(jsonBytes, 0, jsonBytes.length);
			ddb.setSelfDishOrdersHash(String.valueOf(fnv1.getHash()));
		} catch (Exception e) {
			ddb.setSelfDishOrdersHash(String.valueOf(new Random().nextLong()));
		}
		if (!ddb.getMenuHash().equals(lastMenuHash)) {
			ddb.setDishCategoryBriefs(dcbList);
		}
		if (!ddb.getActiveDishOrderSetHash().equals(lastActiveDishOrderSetHash)) {
			ddb.setDishOrderBriefs(dobList);
		}
		if (!ddb.getBookingRecordsHash().equals(lastBookingRecordsHash)) {
			ddb.setBookRecords(brList);
		}
		if (!ddb.getSelfDishOrdersHash().equals(lastSelfDishOrdersHash)) {
			ddb.setSelfDishOrders(sdoList);
		}

		return ddb;
	}

	public HashMap<Long, DishCategoryBrief> getdDishCategoryHashDictDynamicData(
			long storeId) {

		HashMap<Long, DishCategoryBrief> dcbListHashMap = new HashMap<Long, DishCategoryBrief>();
		List<Menu> menuList = _menuDao.getMenusByStoreId(storeId);
		for (Menu menu : menuList) {

			Collections.sort(menu.getDishCategories());
			for (DishCategory dc : menu.getDishCategories()) {
				dc.updateJsonHash();

				DishCategoryBrief dcb = new DishCategoryBrief();
				dcb.setDishCategoryId(dc.getId());
				dcb.setJsonHash(dc.getJsonHash());

				dcbListHashMap.put(dc.getId(), dcb);
			}
		}
		return dcbListHashMap;
	}

	public List<Object> getActiveDishOrderDynamicData(long storeId,
			String lastActiveDishOrderSetHash) {

		List<Object> dobMapList = new ArrayList<Object>();

		List<DishOrderBrief> dobList = _orderingService
				.getActiveDishOrderBriefsByStoreId(storeId);

		ObjectMapper om = new ObjectMapper();
		org.getopt.util.hash.FNV164 fnv1 = new org.getopt.util.hash.FNV164();

		byte[] jsonBytes;
		try {
			jsonBytes = om.writeValueAsBytes(dobList);
			fnv1.init(jsonBytes, 0, jsonBytes.length);
			dobMapList.add(String.valueOf(fnv1.getHash()));
		} catch (Exception e) {
			dobMapList.add(String.valueOf(new Random().nextLong()));
		}

		if (!dobMapList.get(0).equals(lastActiveDishOrderSetHash)) {
			dobMapList.addAll(dobList);
		}
		return dobMapList;
	}

	public Store getStoreById(long storeId) {
		return _storeDao.find(storeId);
	}

	public List<MemberPolicy> getMemberPolicyByStoreId(long storeId) {
		return _storeDao.getMemberPolicyByStoreId(storeId);
	}

	public DishCategory getDishCategoryById(long dishCategoryId) {
		DishCategory dc = _dishCategoryDao.getDishCategoryById(dishCategoryId);
		dc.updateJsonHash();

		Collections.sort(dc.getDishes());
		dc.setMenuId(dc.getMenu().getId());

		return dc;
	}

	public List<PosPrinter> getCNPrintersByStoreId(long storeId) {
		return _storeDao.getCNPrintersByStoreId(storeId);
	}

	public boolean salesDataReset(long storeId) {
		return _storeDao.salesDataReset(storeId);
	}

	public List<NamedValue> getDiscountRateByStoreId(long storeId) {
		List<NamedValue> discountRates = _namedValueDao
				.getDiscountRateByStoreId(storeId);
		return discountRates;
	}
}

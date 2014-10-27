package helen.catering.service;

import helen.catering.Utils;
import helen.catering.dao.BOMLineDao;
import helen.catering.dao.DepartmentDao;
import helen.catering.dao.DeskDao;
import helen.catering.dao.DiscountRuleDao;
import helen.catering.dao.DishCategoryDao;
import helen.catering.dao.DishDao;
import helen.catering.dao.DishOrderDao;
import helen.catering.dao.DishTagDao;
import helen.catering.dao.DishUnitDao;
import helen.catering.dao.EmployeeDao;
import helen.catering.dao.MaterialDao;
import helen.catering.dao.MealDealItemDao;
import helen.catering.dao.MenuDao;
import helen.catering.dao.NamedValueDao;
import helen.catering.dao.PaymentTypeDao;
import helen.catering.dao.PosPrinterDao;
import helen.catering.dao.ResourceDao;
import helen.catering.dao.StoreDao;
import helen.catering.dao.TimeRangeDao;
import helen.catering.dao.UserInRoleDao;
import helen.catering.model.MealDealItemManagenent;
import helen.catering.model.StoreData;
import helen.catering.model.entities.BOMLine;
import helen.catering.model.entities.Department;
import helen.catering.model.entities.Desk;
import helen.catering.model.entities.DiscountRule;
import helen.catering.model.entities.Dish;
import helen.catering.model.entities.DishCategory;
import helen.catering.model.entities.DishTag;
import helen.catering.model.entities.DishUnit;
import helen.catering.model.entities.Employee;
import helen.catering.model.entities.Material;
import helen.catering.model.entities.MealDealItem;
import helen.catering.model.entities.Menu;
import helen.catering.model.entities.NamedValue;
import helen.catering.model.entities.PaymentType;
import helen.catering.model.entities.PosPrinter;
import helen.catering.model.entities.Resource;
import helen.catering.model.entities.Store;
import helen.catering.model.entities.TimeRange;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class MenuManagingService {

	@Autowired
	private DishOrderDao _dishOrderDao;
	@Autowired
	private MenuDao _menuDao;
	@Autowired
	private DishDao _dishDao;
	@Autowired
	private DeskDao _deskDao;
	@Autowired
	private DishCategoryDao _dishCategoryDao;
	@Autowired
	private DepartmentDao _departmentDao;
	@Autowired
	private DishTagDao _dishTagDao;
	@Autowired
	private MealDealItemDao _mealDealItemDao;
	@Autowired
	private UserInRoleDao _userInRoleDao;
	@Autowired
	private PosPrinterDao _posPrinterDao;
	@Autowired
	private StoreDao _storeDao;
	@Autowired
	StoreDataService _storeDataService;
	@Autowired
	TimeRangeDao _timeRangeDao;
	@Autowired
	ResourceDao _resourceDao;
	@Autowired
	PaymentTypeDao _paymentTypeDao;
	@Autowired
	DishUnitDao _dishUnitDao;
	@Autowired
	NamedValueDao _namedValueDao;
	@Autowired
	EmployeeDao _employeeDao;
	@Autowired
	DiscountRuleDao _discoountRuleDao;
	@Autowired
	MaterialDao _materialDao;
	@Autowired
	BOMLineDao _bomLineDao;

	public Menu getMenuById(long id) {
		return this._menuDao.getMenuById(id);
	}

	public Dish saveDish(long dishCategoryId, Dish dish) {

		DishCategory dishCategory = this._dishCategoryDao
				.getDishCategoryById(dishCategoryId);

		if (dish.getId() > 0) {
			Dish newDish = this._dishDao.getDishById(dish.getId());
			newDish = getNewDish(dish, newDish, dishCategory);
			return this._dishDao.save(newDish);
		} else {
			dish.setDishCategory(dishCategory);
			return this._dishDao.save(dish);
		}

	}

	public Dish getNewDish(Dish dish, Dish newDish, DishCategory dishCategory) {
		newDish.setName(dish.getName());
		newDish.setAlias(dish.getAlias());
		newDish.setPrice(dish.getPrice());
		newDish.setUnit(dish.getUnit());
		newDish.setPicPath(dish.getPicPath());
		newDish.setIndexCode(dish.getIndexCode());
		newDish.setSecondPicPath(dish.getSecondPicPath());
		newDish.setAmountPerCustomer(dish.getAmountPerCustomer());
		newDish.setVIPFee(dish.getVIPFee());
		newDish.setSort(dish.getSort());
		newDish.setDepartmentId(dish.getDepartmentId());
		newDish.setDescription(dish.getDescription());
		newDish.setNoCookingNote(dish.isNoCookingNote());
		newDish.setNoDiscount(dish.isNoDiscount());
		newDish.setFrequent(dish.isFrequent());
		newDish.setAutoOrder(dish.isAutoOrder());
		newDish.setEditable(dish.isEditable());
		newDish.setNewDish(dish.getNewDish());
		newDish.setRecommended(dish.getRecommended());
		newDish.setSoldOut(dish.isSoldOut());
		newDish.setEnabled(dish.isEnabled());
		newDish.setDishCategory(dishCategory);
		newDish.setHasMealDealItems(dish.getHasMealDealItems());
		newDish.setNeedWeigh(dish.getNeedWeigh());
		newDish.setNoCustomerNote(dish.isNoCustomerNote());
		return newDish;
	}

	public Dish saveDishAndMealItemList(long dishCategoryId, Dish dish,
			MealDealItem[] mealDealItems) {
		DishCategory dishCategory = this._dishCategoryDao
				.getDishCategoryById(dishCategoryId);
		Dish newDish = this._dishDao.getDishById(dish.getId());
		newDish = getNewDish(dish, newDish, dishCategory);
		return this._mealDealItemDao.saveDishAndMealItemList(newDish,
				mealDealItems);
	}

	public MealDealItemManagenent saveMealDealItem(MealDealItem[] mealDealItems) {

		List<MealDealItem> lists = this._mealDealItemDao
				.saveList(mealDealItems);
		MealDealItemManagenent mealDealItemManagenent = new MealDealItemManagenent();
		mealDealItemManagenent.setMealDealItemList(lists);
		return mealDealItemManagenent;
	}

	public boolean deleteMealDealItemsById(String mdiIds) {
		try {
			this._mealDealItemDao.deleteMealDealItemsById(mdiIds);
		} catch (Exception e) {
			return false;
		}
		return true;
	}

	public MealDealItemManagenent getMealDealItemsByTargetDishId(
			long targetDishId) {
		List<MealDealItem> lists = this._mealDealItemDao
				.getMealDealItemsByTargetDishId(targetDishId);
		MealDealItemManagenent mealDealItemManagenent = new MealDealItemManagenent();
		mealDealItemManagenent.setMealDealItemList(lists);
		return mealDealItemManagenent;
	}

	public boolean deleteDishTag(long dishTagId) {
		this._dishTagDao.deleteDishTagById(dishTagId);
		return true;
	}

	public List<Dish> updateDishListByBrifDishs(Dish[] brifDishs)
			throws Exception {

		List<Dish> updateDishList = new ArrayList<Dish>();
		for (Dish brifDish : brifDishs) {
			Dish dish = this._dishDao.getDishById(brifDish.getId());
			dish.setSoldOut(brifDish.isSoldOut());
			dish.setRemain(brifDish.getRemain());
			dish.setLimitPerDay(brifDish.getLimitPerDay());
			dish.setNoDiscount(brifDish.isNoDiscount());
			updateDishList.add(dish);
		}
		return this._dishDao.updateDishList(updateDishList);
	}

	public Dish editDishSoldOut(long dishId) {
		try {
			Dish dish = this._dishDao.getDishById(dishId);
			dish.setSoldOut(!dish.isSoldOut());
			return this._dishDao.save(dish);
		} catch (Exception e) {
			return null;
		}
	}

	public boolean restoreSoldOutDishes(long storeId) {
		try {
			List<Menu> menus = _menuDao.getMenusByStoreId(storeId);

			for (Menu menu : menus) {
				for (DishCategory dc : menu.getDishCategories()) {
					for (Dish dish : dc.getDishes()) {
						if (dish.isSoldOut()) {
							dish.setSoldOut(false);
							_dishDao.save(dish);
						}
					}
				}
			}

			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public boolean deleteDish(long dishId) {
		int count = _dishOrderDao.findDishOrderItemByDish(dishId);
		if (count > 0)
			return false;
		return _dishDao.deleteDish(dishId);
	}

	public Menu saveMenu(long id, long storeId, String name, int sort) {
		Menu menu = new Menu();
		menu.setId(id);
		menu.setStoreId(storeId);
		menu.setName(name);
		menu.setSort(sort);
		return _menuDao.save(menu);
	}

	public boolean deleteMenu(long id) {
		return _menuDao.deleteMenu(id);
	}

	public DishCategory saveDishCategory(long id, long menuId, String name,
			String alias, int sort) {
		Menu menu = _menuDao.getMenuById(menuId);
		DishCategory cat = new DishCategory();
		cat.setId(id);
		cat.setMenu(menu);
		cat.setAlias(alias);
		cat.setName(name);
		cat.setSort(sort);
		return _menuDao.saveDishCategory(cat);
	}

	public boolean deleteDishCategory(long id) {
		return _menuDao.deleteDishCategory(id);
	}

	public DishTag saveDishTag(long id, long storeId, Long dishId,
			String groupName, Integer optionSetNo, String name, String alias,
			double priceDelta, int sort) {
		Dish dish = null;
		if (dishId != null)
			dish = this._dishDao.getDishById(dishId);
		DishTag dishTag = new DishTag();
		dishTag.setId(id);
		dishTag.setDish(dish);
		dishTag.setStoreId(storeId);
		dishTag.setGroupName(groupName);
		dishTag.setName(name);
		dishTag.setAlias(alias);
		dishTag.setPriceDelta(priceDelta);
		dishTag.setSort(sort);
		if (optionSetNo != null) {
			dishTag.setOptionSetNo(optionSetNo);
		}
		return this._dishTagDao.save(dishTag);
	}

	public Desk saveDesk(long id, long storeId, String name, String groupName,
			boolean chargeVIPFee, double serviceFeeRate, boolean enabled,
			int number, int sort, boolean forTesting, Long posPrinterId) {
		Desk desk = new Desk();
		desk.setId(id);
		desk.setStoreId(storeId);
		desk.setChargeVIPFee(chargeVIPFee);
		desk.setEnabled(enabled);
		desk.setForTesting(forTesting);
		desk.setGroupName(groupName);
		desk.setName(name);
		desk.setNumber(number);
		desk.setSort(sort);
		desk.setServiceFeeRate(serviceFeeRate);
		if (posPrinterId != null && posPrinterId > 0) {
			desk.setPosPrinterId(posPrinterId);
		}
		return _deskDao.save(desk);
	}

	public boolean deleteDesk(long id) {
		int count = _dishOrderDao.findDishOrderByDesk(id);
		if (count > 0)
			return false;
		return _deskDao.deleteDesk(id);
	}

	public StoreData getDishManagementDataByStoreId(long storeId,
			long userAccountId) {
		Employee employee = _employeeDao
				.getEmployeeByUserAccountId(userAccountId);
		StoreData sd = new StoreData();
		sd = _storeDataService.getStoreDataById(storeId);
		if (employee.getJob().equals("店长")) {
			sd.setEmployees(_employeeDao.getEmployeeListByStoreId(storeId));
		}
		sd.setMaterials(_materialDao.getMaterialsByStoreId(storeId));
		sd.setBomLines(_bomLineDao.getBOMLines(storeId));
		return sd;
	}

	public PosPrinter savePosPrinter(long id, long storeId, String name,
			boolean canPrintCheckoutBill, boolean canPrintCustomerNote,
			String deviceName, Integer baudBase, int number, boolean beep,
			int frameWidth, int charactersPerLine) {
		PosPrinter posPrinter = new PosPrinter();
		posPrinter.setId(id);
		posPrinter.setName(name);
		posPrinter.setStoreId(storeId);
		posPrinter.setCanPrintCheckoutBill(canPrintCheckoutBill);
		posPrinter.setCanPrintCustomerNote(canPrintCustomerNote);
		posPrinter.setDeviceName(deviceName);
		posPrinter.setBaudBase(baudBase);
		posPrinter.setNumber(number);
		posPrinter.setBeep(beep);
		posPrinter.setFrameWidth(frameWidth);
		posPrinter.setCharactersPerLine(charactersPerLine);
		posPrinter.setTailEmptyLines(5);
		posPrinter.setCommandSet(PosPrinter.COMMANDSET_ESCPOS);
		posPrinter.setInterfaceType(PosPrinter.INTERFACE_DTU);
		return _posPrinterDao.save(posPrinter);
	}

	public boolean deletePosPrinter(long id) {
		return _posPrinterDao.deletePosPrinter(id);
	}

	public boolean deleteDepartment(long id) {
		return _departmentDao.deleteDepartment(id);
	}

	public Department saveDepartment(long id, long storeId, String name,
			Long cookingNotePrinterId, Long delivererNotePrinterId,
			boolean sliceCookingNotes) {
		Department department = new Department();
		department.setId(id);
		department.setStoreId(storeId);
		department.setName(name);
		department.setCookingNotePrinterId(cookingNotePrinterId);
		department.setDelivererNotePrinterId(delivererNotePrinterId);
		department.setSliceCookingNotes(sliceCookingNotes);
		return _departmentDao.save(department);
	}

	public TimeRange saveTimeRange(long id, long storeId, String name,
			String arriveTimeOptions) {
		arriveTimeOptions = arriveTimeOptions.replace("，", ",");
		arriveTimeOptions = arriveTimeOptions.replace("：", ":");
		TimeRange timeRange = new TimeRange();
		timeRange.setId(id);
		timeRange.setstoreId(storeId);
		timeRange.setName(name);
		timeRange.setArriveTimeOptions(arriveTimeOptions);
		return _timeRangeDao.save(timeRange);
	}

	public boolean deleteTimeRange(long id) {
		int isSuccessed = _timeRangeDao.deleteTimeRange(id);
		if (isSuccessed == 1) {
			return true;
		}
		return false;
	}

	public Resource saveResource(long id, String name, long timeRangeId,
			int amount) {
		Resource resource = new Resource();
		resource.setId(id);
		resource.setAmount(amount);
		resource.setName(name);
		resource.setTimeRangeId(timeRangeId);
		return _resourceDao.save(resource);
	}

	public boolean deleteResource(long id) {
		int isSuccessed = _resourceDao.deleteResource(id);
		if (isSuccessed == 1) {
			return true;
		}
		return false;
	}

	public PaymentType savePaymentType(long id, String name, long storeId,
			double exchangeRate, int sort) {
		PaymentType paymentType = new PaymentType();
		paymentType.setId(id);
		paymentType.setExchangeRate(exchangeRate);
		paymentType.setInitValueRatio(exchangeRate);
		paymentType.setName(name);
		paymentType.setSort(sort);
		paymentType.setStoreId(storeId);
		paymentType.setPrepaid(false);
		return _paymentTypeDao.save(paymentType);
	}

	public boolean deletePaymentType(long id) {
		int isSuccessed = _paymentTypeDao.deletePaymentType(id);
		if (isSuccessed == 1) {
			return true;
		}
		return false;
	}

	public NamedValue saveNamedValue(long id, String name, long storeId,
			String type, double value) {
		NamedValue namedValue = new NamedValue();
		namedValue.setId(id);
		namedValue.setName(name);
		namedValue.setStoreId(storeId);
		namedValue.setType(type);
		namedValue.setValue(value);
		return _namedValueDao.save(namedValue);
	}

	public String getBeforDeleteNameValueTypeById(long id) {
		return _namedValueDao.getBeforDeleteNameValueTypeById(id);
	}

	public boolean deleteNamedValue(long id) {
		int isSuccessed = _namedValueDao.deleteNamedValue(id);
		if (isSuccessed == 1) {
			return true;
		}
		return false;
	}

	public DishUnit saveDishUnit(long id, String name, long storeId,
			double exchangeRate, int groupNumber, int sort) {
		DishUnit dishUnit = new DishUnit();
		dishUnit.setId(id);
		dishUnit.setName(name);
		dishUnit.setStoreId(storeId);
		dishUnit.setSort(sort);
		dishUnit.setExchangeRate(exchangeRate);
		dishUnit.setGroupNumber(groupNumber);
		return _dishUnitDao.save(dishUnit);
	}

	public boolean deleteDishUnit(long id) {
		int isSuccessed = _dishUnitDao.deleteDishUnit(id);
		if (isSuccessed == 1) {
			return true;
		}
		return false;
	}

	public Dish copyDish(long dishCategoryId, long dishId) {

		Dish dish = _dishDao.getDishById(dishId);
		DishCategory dishCategory = this._dishCategoryDao
				.getDishCategoryById(dishCategoryId);

		if (dish == null) {
			return null;
		}

		Dish newDish = new Dish();
		newDish = getNewDish(dish, newDish, dishCategory);
		newDish.setId(Utils.generateEntityId());
		newDish.setName(dish.getName() + "(复制)");

		List<DishTag> newDishTags = new ArrayList<DishTag>();
		if (dish.getDishTags() != null && dish.getDishTags().size() > 0) {
			for (DishTag dt : dish.getDishTags()) {
				DishTag newDT = new DishTag();
				newDT = copyDishTag(dt);
				newDT.setDish(newDish);
				newDishTags.add(newDT);
			}
		}

		newDish.setDishTags(newDishTags);

		return _dishDao.save(newDish);
	}

	private DishTag copyDishTag(DishTag dt) {
		DishTag dishTag = new DishTag();
		dishTag.setId(Utils.generateEntityId());
		dishTag.setStoreId(dt.getStoreId());
		dishTag.setGroupName(dt.getGroupName());
		dishTag.setName(dt.getName());
		dishTag.setAlias(dt.getAlias());
		dishTag.setPriceDelta(dt.getPriceDelta());
		dishTag.setSort(dt.getSort());
		if (dt.getOptionSetNo() != null) {
			dishTag.setOptionSetNo(dt.getOptionSetNo());
		}
		return dishTag;
	}

	public Employee updateEmployee(long id, String name, String workNumber,
			String smartCardNo, boolean canRestoreDishOrder,
			boolean canPreprintCheckoutNote, boolean canCancelOrderItem,
			boolean canViewReport, boolean canCancelDishSoldOut) {
		try {
			Employee employee = _employeeDao.find(id);
			employee.setName(name);
			employee.setWorkNumber(workNumber);
			employee.setSmartCardNo(smartCardNo);
			employee.setCanRestoreDishOrder(canRestoreDishOrder);
			employee.setCanPreprintCheckoutNote(canPreprintCheckoutNote);
			employee.setCanCancelOrderItem(canCancelOrderItem);
			employee.setCanViewReport(canViewReport);
			employee.setCanCancelDishSoldOut(canCancelDishSoldOut);
			_employeeDao.save(employee);
			return employee;
		} catch (Exception e) {
			return null;
		}
	}

	public Store updateStore(long id, long checkoutPosPrinterId,
			boolean autoPrintCustomerNote, boolean noShowPriceInCustomerNote,
			double pointRate, boolean includedCouponValueInPoint,
			boolean isDoubleSizeFont, boolean printsSerialNumber,
			String storeActivity) {
		try {
			Store store = _storeDao.find(id);
			store.setCheckoutPosPrinterId(checkoutPosPrinterId);
			store.setAutoPrintCustomerNote(autoPrintCustomerNote);
			store.setNoShowPriceInCustomerNote(noShowPriceInCustomerNote);
			store.setPointRate(pointRate);
			store.setIncludedCouponValueInPoint(includedCouponValueInPoint);
			store.setIsDoubleSizeFont(isDoubleSizeFont);
			store.setPrintsSerialNumber(printsSerialNumber);
			store.setStoreActivity(storeActivity);
			_storeDao.save(store);
			return store;
		} catch (Exception e) {
			return null;
		}
	}

	public DiscountRule addOrUpdateDiscountRule(long id, String name,
			long storeId, double value, double discountRate,
			boolean noOverallDiscount) {
		DiscountRule discountRule = new DiscountRule();
		discountRule.setId(id);
		discountRule.setStoreId(storeId);
		discountRule.setDiscountRate(discountRate);
		discountRule.setLevel(1);
		discountRule.setName(name);
		discountRule.setNoOverallDiscount(noOverallDiscount);
		discountRule.setValue(value);
		return _discoountRuleDao.save(discountRule);
	}

	public boolean deleteDiscountRule(long id) {
		int isSuccessed = _discoountRuleDao.deleteDiscountRule(id);
		if (isSuccessed == 1) {
			return true;
		}
		return false;
	}

	public Material addOrUpdateMaterial(long id, String name, long storeId,
			int sort) {
		Material material = new Material();
		material.setId(id);
		material.setName(name);
		material.setSort(sort);
		material.setStoreId(storeId);
		return _materialDao.save(material);
	}

	public boolean deleteMaterial(long id) {
		return _materialDao.deleteMaterial(id);
	}

	public BOMLine submitBOMLine(long id, long storeId, String dishName,
			long dishId, String materialName, long materialId, double weight,
			int sort) {
		BOMLine bomLine = new BOMLine();
		bomLine.setId(id);
		bomLine.setStoreId(storeId);
		bomLine.setDishName(dishName);
		bomLine.setDishId(dishId);
		bomLine.setMaterialName(materialName);
		bomLine.setMaterialId(materialId);
		bomLine.setWeight(weight);
		bomLine.setSort(sort);
		return _bomLineDao.save(bomLine);
	}

	public boolean deleteBOMLine(long id) {
		return _bomLineDao.deleteBOMLine(id);
	}
}

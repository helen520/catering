package helen.catering.model;

import helen.catering.model.entities.BOMLine;
import helen.catering.model.entities.CouponTemplate;
import helen.catering.model.entities.Department;
import helen.catering.model.entities.Desk;
import helen.catering.model.entities.DiscountRule;
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
import helen.catering.model.entities.UserAccount;

import java.util.List;

public class StoreData {

	private Store store;

	private List<NamedValue> discountRates;

	private List<NamedValue> serviceFeeRates;

	private List<NamedValue> cancelReasons;

	private List<Desk> desks;

	private List<PaymentType> paymentTypes;

	private List<DiscountRule> discountRules;

	private List<Department> departments;

	private List<DishUnit> dishUnits;

	private List<DishTag> commonDishTags;

	private List<Menu> menus;

	private List<CouponTemplate> couponTemplates;

	private List<MealDealItem> mealDealItems;

	private List<PosPrinter> posPrinters;

	private List<TimeRange> timeRanges;

	private List<Resource> resources;

	private List<Employee> employees;

	private List<Material> materials;

	private List<BOMLine> bomLines;

	private Employee employee;

	private UserAccount userAccount;

	public Store getStore() {
		return store;
	}

	public void setStore(Store store) {
		this.store = store;
	}

	public List<NamedValue> getDiscountRates() {
		return discountRates;
	}

	public void setDiscountRates(List<NamedValue> discountRates) {
		this.discountRates = discountRates;
	}

	public List<NamedValue> getServiceFeeRates() {
		return serviceFeeRates;
	}

	public void setServiceFeeRates(List<NamedValue> serviceFeeRates) {
		this.serviceFeeRates = serviceFeeRates;
	}

	public List<NamedValue> getCancelReasons() {
		return cancelReasons;
	}

	public void setCancelReasons(List<NamedValue> cancelReson) {
		this.cancelReasons = cancelReson;
	}

	public List<Desk> getDesks() {
		return desks;
	}

	public void setDesks(List<Desk> desks) {
		this.desks = desks;
	}

	public List<PaymentType> getPaymentTypes() {
		return paymentTypes;
	}

	public void setPaymentTypes(List<PaymentType> paymentTypes) {
		this.paymentTypes = paymentTypes;
	}

	public List<DiscountRule> getDiscountRules() {
		return discountRules;
	}

	public void setDiscountRules(List<DiscountRule> discountRules) {
		this.discountRules = discountRules;
	}

	public List<Department> getDepartments() {
		return departments;
	}

	public void setDepartments(List<Department> departments) {
		this.departments = departments;
	}

	public List<DishUnit> getDishUnits() {
		return dishUnits;
	}

	public void setDishUnits(List<DishUnit> dishUnits) {
		this.dishUnits = dishUnits;
	}

	public List<DishTag> getCommonDishTags() {
		return commonDishTags;
	}

	public void setCommonDishTags(List<DishTag> commonDishTags) {
		this.commonDishTags = commonDishTags;
	}

	public List<Menu> getMenus() {
		return menus;
	}

	public void setMenus(List<Menu> menus) {
		this.menus = menus;
	}

	public List<CouponTemplate> getCouponTemplates() {
		return couponTemplates;
	}

	public void setCouponTemplates(List<CouponTemplate> couponTemplates) {
		this.couponTemplates = couponTemplates;
	}

	public List<MealDealItem> getMealDealItems() {
		return mealDealItems;
	}

	public void setMealDealItems(List<MealDealItem> mealDealItems) {
		this.mealDealItems = mealDealItems;
	}

	public List<PosPrinter> getPosPrinters() {
		return posPrinters;
	}

	public void setPosPrinters(List<PosPrinter> posPrinters) {
		this.posPrinters = posPrinters;
	}

	public List<TimeRange> getTimeRanges() {
		return timeRanges;
	}

	public void setTimeRanges(List<TimeRange> timeRanges) {
		this.timeRanges = timeRanges;
	}

	public List<Resource> getResources() {
		return resources;
	}

	public void setResources(List<Resource> resources) {
		this.resources = resources;
	}

	public List<Employee> getEmployees() {
		return employees;
	}

	public void setEmployees(List<Employee> employees) {
		this.employees = employees;
	}

	public List<Material> getMaterials() {
		return materials;
	}

	public void setMaterials(List<Material> materials) {
		this.materials = materials;
	}

	public List<BOMLine> getBomLines() {
		return bomLines;
	}

	public void setBomLines(List<BOMLine> bomLines) {
		this.bomLines = bomLines;
	}

	public Employee getEmployee() {
		return employee;
	}

	public void setEmployee(Employee employee) {
		this.employee = employee;
	}

	public UserAccount getUserAccount() {
		return userAccount;
	}

	public void setUserAccount(UserAccount userAccount) {
		this.userAccount = userAccount;
	}

}

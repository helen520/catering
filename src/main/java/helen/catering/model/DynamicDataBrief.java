package helen.catering.model;

import helen.catering.model.entities.BookRecord;
import helen.catering.model.entities.DishOrder;

import java.util.List;

public class DynamicDataBrief {

	private String menuHash;

	private String activeDishOrderSetHash;

	private String bookingRecordsHash;

	private String selfDishOrdersHash;

	private List<DishCategoryBrief> dishCategoryBriefs;

	private List<DishOrderBrief> dishOrderBriefs;

	private List<BookRecord> bookRecords;

	private List<DishOrder> selfDishOrders;

	public String getMenuHash() {
		return menuHash;
	}

	public void setMenuHash(String menuHash) {
		this.menuHash = menuHash;
	}

	public String getActiveDishOrderSetHash() {
		return activeDishOrderSetHash;
	}

	public void setActiveDishOrderSetHash(String activeDishOrderSetHash) {
		this.activeDishOrderSetHash = activeDishOrderSetHash;
	}

	public String getSelfDishOrdersHash() {
		return selfDishOrdersHash;
	}

	public void setSelfDishOrdersHash(String selfDishOrdersHash) {
		this.selfDishOrdersHash = selfDishOrdersHash;
	}

	public String getBookingRecordsHash() {
		return bookingRecordsHash;
	}

	public void setBookingRecordsHash(String bookingRecordsHash) {
		this.bookingRecordsHash = bookingRecordsHash;
	}

	public List<DishCategoryBrief> getDishCategoryBriefs() {
		return dishCategoryBriefs;
	}

	public void setDishCategoryBriefs(List<DishCategoryBrief> dishCategoryBriefs) {
		this.dishCategoryBriefs = dishCategoryBriefs;
	}

	public List<DishOrderBrief> getDishOrderBriefs() {
		return dishOrderBriefs;
	}

	public void setDishOrderBriefs(List<DishOrderBrief> dishOrderBriefs) {
		this.dishOrderBriefs = dishOrderBriefs;
	}

	public List<BookRecord> getBookRecords() {
		return bookRecords;
	}

	public void setBookRecords(List<BookRecord> bookRecords) {
		this.bookRecords = bookRecords;
	}

	public List<DishOrder> getSelfDishOrders() {
		return selfDishOrders;
	}

	public void setSelfDishOrders(List<DishOrder> selfDishOrders) {
		this.selfDishOrders = selfDishOrders;
	}
}

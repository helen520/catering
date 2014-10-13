package helen.catering;

import helen.catering.model.SellStat;
import helen.catering.model.entities.Desk;
import helen.catering.model.entities.Dish;
import helen.catering.model.entities.DishCategory;
import helen.catering.model.entities.DishOrder;
import helen.catering.model.entities.Employee;
import helen.catering.model.entities.OrderItem;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;

public class SellStatHelper {
	private static Comparator<SellStat> mDefaultComparator = new Comparator<SellStat>() {
		@Override
		public int compare(SellStat lhs, SellStat rhs) {
			Double totalPrice1 = lhs.getTotalPrice();
			Double totalPrice2 = rhs.getTotalPrice();
			return totalPrice2.compareTo(totalPrice1);
		}
	};

	public static Comparator<SellStat> getDefaultComparator() {
		return mDefaultComparator;
	}

	public static List<SellStat> generateDishCategorySellStats(
			List<DishCategory> dishCategoryList, List<Dish> dishList,
			List<OrderItem> orderItemList, boolean isContainDetail) {

		List<SellStat> ssList = new ArrayList<SellStat>();
		HashMap<Long, SellStat> ssByDishCategoryIDMap = new HashMap<Long, SellStat>();

		HashMap<Long, Long> dishCategoryIDByDishIDMap = new HashMap<Long, Long>();
		for (Dish dish : dishList) {
			DishCategory dishCategory = dish.getDishCategory();
			dishCategoryIDByDishIDMap.put(dish.getId(), dishCategory.getId());
		}

		for (DishCategory dc : dishCategoryList) {
			if (dc.getDishes().size() == 0) {
				continue;
			}
			SellStat ss = new SellStat();

			String dcFullName = dc.getName();

			ss.setItemName(dcFullName);
			ss.setItemID(dc.getId());
			ssByDishCategoryIDMap.put(dc.getId(), ss);

			ssList.add(ss);

			if (isContainDetail) {
				addDishSellStat(ssList, ssByDishCategoryIDMap, dc.getDishes());

			}
		}

		for (OrderItem oi : orderItemList) {
			if (oi.getState() == OrderItem.STATE_CANCELLED) {
				continue;
			}
			if (!dishCategoryIDByDishIDMap.containsKey(oi.getDishId())) {
				continue;
			}

			Long dishCategoryID = dishCategoryIDByDishIDMap.get(oi.getDishId());
			if (!ssByDishCategoryIDMap.containsKey(dishCategoryID)) {
				continue;
			}

			SellStat ss = ssByDishCategoryIDMap.get(dishCategoryID);
			ss.setAmount(ss.getAmount() + oi.getAmount());
			ss.setTotalOrgPrice(ss.getTotalOrgPrice() + oi.getOrgPrice());
			ss.setTotalPrice(ss.getTotalPrice() + oi.getPrice());
		}

		if (isContainDetail) {
			addOrderItemSellStat(ssList, ssByDishCategoryIDMap, orderItemList);
		}

		return ssList;
	}

	public static List<SellStat> generateDishSellStats(List<Dish> dishList,
			List<OrderItem> orderItemList) {

		List<SellStat> ssList = new ArrayList<SellStat>();
		HashMap<Long, SellStat> ssByDishIDMap = new HashMap<Long, SellStat>();

		addDishSellStat(ssList, ssByDishIDMap, dishList);
		addOrderItemSellStat(ssList, ssByDishIDMap, orderItemList);

		Collections.sort(ssList, getDefaultComparator());
		return ssList;
	}

	public static void addDishSellStat(List<SellStat> ssList,
			HashMap<Long, SellStat> ssByDishIDMap, List<Dish> dishList) {
		for (Dish dish : dishList) {
			SellStat ss = new SellStat();
			ss.setItemName(dish.getName());
			ss.setItemID(dish.getId());
			ss.setUnit(dish.getUnit());
			ssByDishIDMap.put(dish.getId(), ss);

			ssList.add(ss);
		}
	}

	public static void addOrderItemSellStat(List<SellStat> ssList,
			HashMap<Long, SellStat> ssByDishIDMap, List<OrderItem> orderItemList) {
		for (OrderItem oi : orderItemList) {
			if (oi.getState() == OrderItem.STATE_CANCELLED) {
				continue;
			}
			if (!ssByDishIDMap.containsKey(oi.getDishId())) {
				continue;
			}

			SellStat ss = ssByDishIDMap.get(oi.getDishId());
			ss.setAmount(ss.getAmount() + oi.getAmount());
			ss.setTotalOrgPrice(ss.getTotalOrgPrice() + oi.getOrgPrice());
			ss.setTotalPrice(ss.getTotalPrice() + oi.getPrice());
		}
	}

	public static List<SellStat> generateDeskSellStats(
			List<DishOrder> dishOrderList, List<Desk> deskList) {

		List<SellStat> ssList = new ArrayList<SellStat>();
		HashMap<Long, SellStat> ssByDeskIDMap = new HashMap<Long, SellStat>();

		for (Desk desk : deskList) {
			if (!desk.getForTesting()) {
				SellStat ss = new SellStat();
				ss.setItemName(desk.getName());
				ss.setItemID(desk.getId());
				ssByDeskIDMap.put(desk.getId(), ss);

				ssList.add(ss);
			}
		}

		for (DishOrder dishOrder : dishOrderList) {
			if (!ssByDeskIDMap.containsKey(dishOrder.getDeskId())) {
				continue;
			}

			SellStat ss = ssByDeskIDMap.get(dishOrder.getDeskId());
			ss.setAmount(ss.getAmount() + 1);
			ss.setTotalOrgPrice(ss.getTotalOrgPrice()
					+ dishOrder.getTotalPrice());
			ss.setTotalPrice(ss.getTotalPrice()
					+ dishOrder.getDiscountedPrice());
		}

		Collections.sort(ssList, getDefaultComparator());
		return ssList;
	}

	private static SellStat createDepartmentSellStat(Dish dish, OrderItem oi) {
		SellStat ss = new SellStat();
		ss.setItemName(oi.getDishName());
		ss.setUnit(oi.getUnit());
		ss.setUnitPrice(oi.getDishPrice());
		return ss;
	}

	public static List<SellStat> generateDepartmentSellStats(long storeId,
			long departmentID, List<Desk> deskList, List<Dish> dishList,
			List<DishOrder> dishOrderList) {

		HashMap<Long, Desk> deskByIDMap = new HashMap<Long, Desk>();
		for (Desk desk : deskList) {
			deskByIDMap.put(desk.getId(), desk);
		}
		HashMap<Long, Dish> dishByIDMap = new HashMap<Long, Dish>();
		for (Dish dish : dishList) {
			dishByIDMap.put(dish.getId(), dish);
		}

		double sumOfAmount = 0;
		double sumOfTotalExtraFee = 0;
		double sumOfTotalOrgPrice = 0;
		double sumOfTotalDiscountedPrice = 0;
		double sumOfTotalServiceFee = 0;
		double sumOfTotalPrice = 0;

		List<SellStat> ssList = new ArrayList<SellStat>();

		HashMap<String, SellStat> ssMap = new HashMap<String, SellStat>();
		for (DishOrder dishOrder : dishOrderList) {
			Desk desk = deskByIDMap.get(dishOrder.getDeskId());
			if (desk == null) {
				continue;
			}

			for (OrderItem oi : dishOrder.getOrderItems()) {

				long oiDepartmentID = oi.getDepartmentId();

				Dish dish = dishByIDMap.get(oi.getDishId());
				if (dish != null) {
					oiDepartmentID = dish.getDepartmentId();
				}
				if (oi.getState() == OrderItem.STATE_CANCELLED
						|| oiDepartmentID != departmentID) {
					continue;
				}

				String key = oi.getDishName() + "|"
						+ Double.toString(oi.getDishPrice());

				if (!ssMap.containsKey(key)) {
					SellStat ss = createDepartmentSellStat(dish, oi);
					ssMap.put(key, ss);
				}

				SellStat ss = ssMap.get(key);
				ss.setAmount(ss.getAmount() + oi.getAmount());
				sumOfAmount += oi.getAmount();

				double orgPrice = oi.getOrgPrice();
				ss.setTotalOrgPrice(ss.getTotalOrgPrice() + orgPrice);
				sumOfTotalOrgPrice += orgPrice;

				double extraFee = oi.getOrgPrice() - oi.getDishPrice()
						* oi.getAmount();
				ss.setTotalExtraFee(ss.getTotalExtraFee() + extraFee);
				sumOfTotalExtraFee += extraFee;

				double discountedPrice = oi.getPrice();
				ss.setTotalDiscountedPrice(ss.getTotalDiscountedPrice()
						+ discountedPrice);
				sumOfTotalDiscountedPrice += discountedPrice;

				double serviceFee = oi.getPrice()
						* dishOrder.getServiceFeeRate();
				ss.setTotalServiceFee(ss.getTotalServiceFee() + serviceFee);
				sumOfTotalServiceFee += serviceFee;

				double totalPrice = oi.getPrice() + serviceFee;
				ss.setTotalPrice(ss.getTotalPrice() + totalPrice);
				sumOfTotalPrice += totalPrice;
			}
		}

		ssList.addAll(ssMap.values());

		SellStat ss = new SellStat();
		ss.setItemName("SUM");
		ss.setAmount(sumOfAmount);
		ss.setTotalExtraFee(sumOfTotalExtraFee);
		ss.setTotalOrgPrice(sumOfTotalOrgPrice);
		ss.setTotalDiscountedPrice(sumOfTotalDiscountedPrice);
		ss.setTotalServiceFee(sumOfTotalServiceFee);
		ss.setTotalPrice(sumOfTotalPrice);
		ssList.add(ss);

		return ssList;
	}

	public static List<SellStat> generateEmployeeSellStats(long storeId,
			List<Employee> employees,
			HashMap<Long, List<OrderItem>> orderItemsByEmployeeIdMap) {
		List<SellStat> sellStats = new ArrayList<SellStat>();

		if (employees != null) {
			for (Employee employee : employees) {
				SellStat sellStat = new SellStat();
				sellStat.setItemName(employee.getName());
				sellStat.setItemID(employee.getId());
				sellStat.setWorkNumber(employee.getWorkNumber());
				List<OrderItem> orderItems = orderItemsByEmployeeIdMap
						.get(employee.getId());

				int amount = 0;
				double totalPrice = 0;
				for (OrderItem orderItem : orderItems) {
					amount += orderItem.getAmount();
					totalPrice += orderItem.getPrice();
				}
				sellStat.setAmount(amount);
				sellStat.setTotalPrice(totalPrice);

				sellStats.add(sellStat);
			}
		}

		return sellStats;
	}
}

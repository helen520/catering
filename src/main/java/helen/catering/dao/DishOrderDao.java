package helen.catering.dao;

import helen.catering.Utils;
import helen.catering.model.entities.DishOrder;
import helen.catering.model.entities.DishOrderTag;
import helen.catering.model.entities.OrderItem;
import helen.catering.model.entities.OrderItemTag;
import helen.catering.model.entities.PayRecord;
import helen.catering.model.entities.UserAccount;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class DishOrderDao {

	@PersistenceContext
	private EntityManager entityManager;

	public DishOrder getDishOrderById(long id) {
		try {
			return entityManager.find(DishOrder.class, id);
		} catch (Exception e) {
			return null;
		}
	}

	@Transactional
	public OrderItem saveOrderItem(OrderItem orderItem) {
		if (orderItem.getId() == 0) {
			orderItem.setId(Utils.generateEntityId());
		}
		return entityManager.merge(orderItem);
	}

	@SuppressWarnings("unchecked")
	public List<DishOrder> getActiveDishOrdersByStoreId(long storeId) {
		// public final static int STATUS_PROCESSING = 1;
		// public final static int STATUS_CREATING = 4;
		// public final static int STATUS_PAYING = 6;

		return entityManager
				.createQuery(
						"select do from DishOrder do where do.storeId = ? "
								+ "and (do.state = 1 or do.state = 4 or do.state = 6)")
				.setParameter(1, storeId).getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<DishOrder> getActiveDishOrdersByDeskId(long deskId) {
		return entityManager
				.createQuery(
						"select do from DishOrder do where do.deskId = ? "
								+ "and (do.state = 1 or do.state = 4 or do.state = 6)")
				.setParameter(1, deskId).getResultList();
	}

	@Transactional
	public DishOrder save(DishOrder dishOrder) {

		try {
			if (dishOrder.getId() == 0) {
				dishOrder.setId(Utils.generateEntityId());
			}

			List<OrderItem> oiList = dishOrder.getOrderItems();
			if (oiList != null) {
				int i = 0;
				for (OrderItem oi : oiList) {
					if (oi.getId() == 0) {
						oi.setId(Utils.generateEntityId(i++));
						oi.setCreateTime(System.currentTimeMillis() + i);
					}
					oi.setDishOrder(dishOrder);
					oi.setDeskName(dishOrder.getDeskName());
					if (oi.getHasMealDealItems()) {
						for (OrderItem item : oiList) {
							if (!item.getHasMealDealItems()
									&& item.getMealDealItemId() != null
									&& item.getTriggerId().equals(
											oi.getClientTriggerId())) {
								item.setTriggerId(oi.getId());
							}
						}
					}
					List<OrderItemTag> oitList = oi.getOrderItemTags();
					if (oitList != null) {
						int j = 0;
						for (OrderItemTag oit : oitList) {
							if (oit.getId() == 0) {
								oit.setId(Utils.generateEntityId(j++));
							}
							oit.setOrderItem(oi);
						}
					}
				}
			}

			List<PayRecord> prList = dishOrder.getPayRecords();
			if (prList != null) {
				int i = 0;
				for (PayRecord pr : dishOrder.getPayRecords()) {
					if (pr.getId() == 0) {
						pr.setId(Utils.generateEntityId(i++));
					}
					pr.setDishOrder(dishOrder);
				}
			}

			List<DishOrderTag> dotList = dishOrder.getDishOrderTags();
			if (dotList != null) {
				int i = 0;
				for (DishOrderTag dot : dotList) {
					if (dot.getId() == 0) {
						dot.setId(Utils.generateEntityId(i++));
					}
					dot.setDishOrder(dishOrder);
				}
			}

			entityManager.merge(dishOrder);
			entityManager.flush();
			return dishOrder;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	@Transactional
	public void removeDishOrderTags(DishOrder dishOrder) {
		for (DishOrderTag dot : dishOrder.getDishOrderTags()) {
			entityManager.remove(dot);
		}

		dishOrder.setDishOrderTags(new ArrayList<DishOrderTag>());
	}

	@Transactional
	public void removePayRecords(DishOrder dishOrder) {
		for (PayRecord pr : dishOrder.getPayRecords()) {
			entityManager.remove(pr);
		}
	}

	@SuppressWarnings("unchecked")
	public List<DishOrder> getShiftClassDishOrdersByStoreId(long storeId) {
		return entityManager
				.createQuery(
						"select do from DishOrder do where do.storeId = ? and do.state = ?")
				.setParameter(1, storeId).setParameter(2, DishOrder.STATE_PAID)
				.getResultList();
	}

	@Transactional
	public void mergeDishOrder(DishOrder sourceDishOrder,
			DishOrder combinedDishOrder, DishOrder targetDishOrderCopy)
			throws Exception {

		sourceDishOrder.setState(DishOrder.STATE_CANCELLED);
		targetDishOrderCopy.setState(DishOrder.STATE_CANCELLED);
		entityManager.merge(sourceDishOrder);
		entityManager.merge(combinedDishOrder);
		entityManager.merge(targetDishOrderCopy);
		entityManager.flush();
	}

	@Transactional
	public void mergeOrderItem(long employeeId, long orderItemId,
			long targetDishOrderId) {
		String queryStr = "update OrderItem set dishOrderId = ? where id = ? ";
		entityManager.createQuery(queryStr).setParameter(1, targetDishOrderId)
				.setParameter(2, orderItemId).executeUpdate();
	}

	@Transactional
	public OrderItem getOrderItemById(long orderItemId) {
		try {
			return entityManager.find(OrderItem.class, orderItemId);
		} catch (Exception e) {
			return null;
		}
	}

	@SuppressWarnings("unchecked")
	public List<DishOrder> getDishOrderListExceptStateAchivedByDishOrderBriefId(
			long storeId, String dishOrderBriefId) {

		StringBuffer strBuf = new StringBuffer();
		strBuf.append("select * from DishOrder do where do.storeId = ");
		strBuf.append(storeId);
		strBuf.append(" and do.state != ");
		strBuf.append(DishOrder.STATE_CANCELLED);
		strBuf.append(" and do.state != ");
		strBuf.append(DishOrder.STATE_ARCHIVED);
		strBuf.append(" and ( do.id like '%");
		strBuf.append(dishOrderBriefId);
		strBuf.append("%' ");
		strBuf.append(" or do.deskName like '%");
		strBuf.append(dishOrderBriefId);
		strBuf.append("%' )");
		return this.entityManager.createNativeQuery(strBuf.toString(),
				DishOrder.class).getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<DishOrder> getDishOrderListByStoreIdAndDishOrderState(
			long storeId, int dishOrderState) {

		String queryStr = "select do from DishOrder do where do.storeId = ? and do.state = ? order by createTime desc";
		return this.entityManager.createQuery(queryStr)
				.setParameter(1, storeId).setParameter(2, dishOrderState)
				.getResultList();
	}

	@Transactional
	public void restoreDishOrder(DishOrder dishOrder) throws Exception {

		String queryStr = "delete from PayRecord where dishOrderId = ?";
		this.entityManager.createQuery(queryStr)
				.setParameter(1, dishOrder.getId()).executeUpdate();

		dishOrder.setState(DishOrder.STATE_PROCESSING);
		this.save(dishOrder);
	}

	@Transactional
	public boolean shiftClass(long employeeId, long storeId) {
		try {
			entityManager
					.createQuery(
							"update DishOrder set archivedTime=? , state=? where storeId=? and state=?")
					.setParameter(1, System.currentTimeMillis())
					.setParameter(2, DishOrder.STATE_ARCHIVED)
					.setParameter(3, storeId)
					.setParameter(4, DishOrder.STATE_PAID).executeUpdate();
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	@SuppressWarnings("unchecked")
	public List<OrderItem> getOrderItemsByEmployeeIdAndTime(long employeeId,
			long startTime, long endTime) {
		return entityManager
				.createQuery(
						"select oi from OrderItem oi where oi.employeeId=? and oi.createTime between ? and ? and oi.state!=? order by createTime")
				.setParameter(1, employeeId).setParameter(2, startTime)
				.setParameter(3, endTime)
				.setParameter(4, OrderItem.STATE_CANCELLED).getResultList();
	}

	@SuppressWarnings("unchecked")
	public DishOrder getDishOrderByOpenId(String openId) {
		List<DishOrder> dishOrderList = entityManager
				.createQuery(
						"select do from DishOrder do where do.openId = ? and (do.state="
								+ DishOrder.STATE_WAITING + " or do.state="
								+ DishOrder.STATE_PROCESSING + ")")
				.setParameter(1, openId).getResultList();
		if (dishOrderList != null && dishOrderList.size() > 0)
			return dishOrderList.get(0);
		return null;
	}

	@Transactional
	public void removeOrderItems(DishOrder dishOrder) {
		for (int i = dishOrder.getOrderItems().size() - 1; i >= 0; i--) {
			OrderItem oi = dishOrder.getOrderItems().get(i);
			if (oi.getState() == OrderItem.STATE_WAITING)
				dishOrder.getOrderItems().remove(i);
		}
	}

	@Transactional
	public void updateOrderItemsParent(long sourceDishOrderId,
			long targetDishOrderId) {
		String queryStr = "update OrderItem set dishOrderId = ? where dishOrderId = ? ";
		entityManager.createQuery(queryStr).setParameter(1, targetDishOrderId)
				.setParameter(2, sourceDishOrderId).executeUpdate();

	}

	@Transactional
	public void updateMergeOrderItemsMemo(DishOrder sourceDishOrder,
			DishOrder targetDishOrder) {
		String queryStr = "update OrderItem set memo = ? where dishOrderId = ? ";
		entityManager
				.createQuery(queryStr)
				.setParameter(
						1,
						sourceDishOrder.getDeskName() + " 转到 "
								+ targetDishOrder.getDeskName())
				.setParameter(2, sourceDishOrder.getId()).executeUpdate();
	}

	@SuppressWarnings("unchecked")
	public List<DishOrder> getDishOrderListByStoreIdAndUserAccountIdAndDishOrderState(
			long storeId, long userAccountId, int state) {
		return entityManager
				.createQuery(
						"select do from DishOrder do where do.storeId = ? and do.userAccountId = ? and do.state = ? order by createTime desc")
				.setParameter(1, storeId).setParameter(2, userAccountId)
				.setParameter(3, state).getResultList();
	}

	public int findDishOrderItemByDish(long dishId) {
		return entityManager
				.createQuery("select oi from OrderItem oi where oi.dishId = ?")
				.setParameter(1, dishId).getResultList().size();
	}

	public int findDishOrderByDesk(long id) {
		return entityManager
				.createQuery("select o from DishOrder o where o.deskId = ?")
				.setParameter(1, id).getResultList().size();
	}

	public DishOrder getDishOrderByBookRecordId(long bookRecordId) {
		try {
			return (DishOrder) entityManager
					.createQuery(
							"select do from DishOrder do where do.bookRecordId = ?")
					.setParameter(1, bookRecordId).getSingleResult();
		} catch (Exception e) {
			return null;
		}

	}

	@SuppressWarnings("unchecked")
	public List<DishOrder> getDishOrderListByStoreIdAndTimeState(long storeId,
			int state, long startTime, long endTime) {
		return entityManager
				.createQuery(
						"select do from DishOrder do where do.storeId = ? and do.state = ? and do.expectedArriveTime > ? and do.expectedArriveTime < ? order by expectedArriveTime")
				.setParameter(1, storeId).setParameter(2, state)
				.setParameter(3, startTime).setParameter(4, endTime)
				.getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<DishOrder> getSelfDishOrderByStoreI(long storeId) {
		List<DishOrder> dishOrders = entityManager
				.createQuery(
						"select do from DishOrder do where do.storeId = ? and do.state = ? order by createTime")
				.setParameter(1, storeId)
				.setParameter(2, DishOrder.STATE_WAITING).getResultList();
		setMemberInDishOrder(dishOrders);
		return dishOrders;
	}

	public List<DishOrder> setMemberInDishOrder(List<DishOrder> dishOrders) {

		for (DishOrder dishOrder : dishOrders) {
			if (dishOrder.getUserAccountId() != null) {
				UserAccount user = null;
				try {
					user = entityManager.find(UserAccount.class,
							dishOrder.getUserAccountId());
				} catch (Exception e) {
				}
				dishOrder.setMember(user);
			}
		}

		return dishOrders;
	}

	@SuppressWarnings("unchecked")
	public List<DishOrder> getBookingDishOrderByUserId(long customerUserId) {
		return entityManager
				.createQuery(
						"select do from DishOrder do where do.userAccountId = ? and (do.state = ? or do.state = ?) order by createTime")
				.setParameter(1, customerUserId)
				.setParameter(2, DishOrder.STATE_WAITING)
				.setParameter(3, DishOrder.STATE_PROCESSING).getResultList();
	}

	@Transactional
	public boolean updateDishOrderPrePrintCheckoutNotePrinted(
			boolean isPrinted, long id) {

		int index = 0;
		try {
			index = entityManager
					.createQuery(
							"update DishOrder set prePrintCheckoutNotePrinted=? where id=? ")
					.setParameter(1, isPrinted).setParameter(2, id)
					.executeUpdate();
		} catch (Exception e) {
			System.out.println(e);
		}

		if (index == 1)
			return true;
		return false;
	}

	@SuppressWarnings("unchecked")
	public List<DishOrder> getDishOrderByEmployeeId(long employeeId) {
		return entityManager
				.createQuery(
						"select do from DishOrder do where do.creatorEmployeeId = ? and do.state = ? order by createTime")
				.setParameter(1, employeeId)
				.setParameter(2, DishOrder.STATE_PAID).getResultList();
	}

}

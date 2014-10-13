package helen.catering.dao;

import helen.catering.Utils;
import helen.catering.model.CookerDishStat;
import helen.catering.model.entities.DishOrder;
import helen.catering.model.entities.MaterialRecord;
import helen.catering.model.entities.OrderItem;
import helen.catering.model.entities.PayRecord;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class ReportDataDao {

	@PersistenceContext
	private EntityManager entityManager;

	@Transactional
	public MaterialRecord saveMaterialRecord(MaterialRecord record) {
		if (record.getId() == 0) {
			record.setId(Utils.generateEntityId());
		}
		return entityManager.merge(record);
	}

	@SuppressWarnings("unchecked")
	public List<PayRecord> getPayRecordsByDishOrderId(long dishOrderId) {
		return entityManager
				.createQuery(
						"select pr from PayRecord pr where pr.dishOrder.id=?")
				.setParameter(1, dishOrderId).getResultList();
	}

	public HashMap<Long, String> getArchivingTimeMapByStoreId(long storeId,
			int offset, int limit) {
		String query = "select do  from DishOrder do where do.storeId = ? GROUP BY do.archivedTime order by do.archivedTime DESC";
		List<DishOrder> archivingTimeGroupDishOrderList = entityManager
				.createQuery(query, DishOrder.class).setParameter(1, storeId)
				.setFirstResult(offset).setMaxResults(limit).getResultList();

		HashMap<Long, String> archivingTimeMap = new HashMap<Long, String>();
		for (DishOrder archivingTimeGroupDishOrder : archivingTimeGroupDishOrderList) {
			Long archivingTime = archivingTimeGroupDishOrder.getArchivedTime();
			if (archivingTime != null) {
				archivingTimeMap
						.put(archivingTime, Utils
								.formatShortDateTimeYMDHM(new Date(
										archivingTime)));
			}
		}
		return archivingTimeMap;
	}

	@SuppressWarnings("unchecked")
	public List<DishOrder> getDishOrderListInADTRange(long storeId,
			long startTime, long endTime) {

		String query = "select do from DishOrder do where do.createTime between ? and ? and do.storeId = ?";
		return entityManager.createQuery(query).setParameter(1, startTime)
				.setParameter(2, endTime).setParameter(3, storeId)
				.getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<DishOrder> getDishOrderListByArchivedTime(long storeId,
			int state, long archivedTime, int offset, int limit) {

		String query = "select do from DishOrder do where do.storeId = ? and do.state = ? and do.archivedTime = ? order by archivedTime,createTime desc";
		return entityManager.createQuery(query).setParameter(1, storeId)
				.setParameter(2, state).setParameter(3, archivedTime)
				.setFirstResult(offset).setMaxResults(limit).getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<DishOrder> getDishOrderListInArchivedTimeRange(long storeId,
			int state, long startTime, long endTime, int offset, int limit) {

		String query = "select do from DishOrder do where do.archivedTime between ? and ? and do.storeId = ? and do.state = ? order by createTime desc";
		return entityManager.createQuery(query).setParameter(1, startTime)
				.setParameter(2, endTime).setParameter(3, storeId)
				.setParameter(4, state).setFirstResult(offset)
				.setMaxResults(limit).getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<DishOrder> getDishOrderListInTimeRange(long storeId,
			long startTime, long endTime, int offset, int limit) {

		String query = "select do from DishOrder do where do.createTime between ? and ? and do.storeId = ? and do.state != ? and do.state != ?";
		return entityManager.createQuery(query).setParameter(1, startTime)
				.setParameter(2, endTime).setParameter(3, storeId)
				.setParameter(4, DishOrder.STATE_CREATING)
				.setParameter(5, DishOrder.STATE_CANCELLED).getResultList();
	}

	@SuppressWarnings("unchecked")
	public Map<String, List<CookerDishStat>> getCookerDishStatMapByCookerNameInTimeRangeByStoreId(
			long storeId, long startTime, long endTime) {

		StringBuffer queryStrBuf = new StringBuffer();
		queryStrBuf
				.append("SELECT e.name,oi.dishName,SUM(oi.amount),SUM(oi.price)");
		queryStrBuf
				.append(" FROM Employee e left join Orderitem oi on e.id=oi.cookerEmployeeId WHERE");
		queryStrBuf
				.append(" e.storeId=? and oi.createTime BETWEEN ? and ? and oi.state!= ? GROUP BY e.name,oi.dishName");

		Object objResult = entityManager
				.createNativeQuery(queryStrBuf.toString())
				.setParameter(1, storeId).setParameter(2, startTime)
				.setParameter(3, endTime)
				.setParameter(4, OrderItem.STATE_CANCELLED).getResultList();

		Map<String, List<CookerDishStat>> cookerDishStatMapByCookerName = new HashMap<String, List<CookerDishStat>>();

		if (objResult.getClass() == ArrayList.class) {

			List<Object> objectArray = (List<Object>) objResult;

			for (int i = 0; i < objectArray.size(); i++) {
				Object obj = objectArray.get(i);
				if (obj.getClass().isArray()) {
					Object[] newObjectArray = (Object[]) obj;
					if (newObjectArray.length == CookerDishStat.class
							.getDeclaredFields().length) {

						CookerDishStat cookerDishStat = new CookerDishStat();
						String cookerName = (String) newObjectArray[0];
						String dishName = (String) newObjectArray[1];
						double dishAmount = Double.valueOf(newObjectArray[2]
								.toString());
						double grossSales = Double.valueOf(newObjectArray[3]
								.toString());

						cookerDishStat.setCookerName(cookerName.trim());
						cookerDishStat.setDishName(dishName.trim());
						cookerDishStat.setDishAmount(dishAmount);
						cookerDishStat.setGrossSales(grossSales);

						String mapKey = cookerDishStat.getCookerName();

						if (!cookerDishStatMapByCookerName.containsKey(mapKey)) {
							cookerDishStatMapByCookerName.put(mapKey,
									new ArrayList<CookerDishStat>());
						}
						cookerDishStatMapByCookerName.get(mapKey).add(
								cookerDishStat);
					}
				}
			}
		}

		return cookerDishStatMapByCookerName;
	}

	//
	// public List<DishOrder> getDishOrderListInTimeRange(long storeId, long
	// startTime, long endTime) {
	//
	// return entityManager.createQuery(
	// "select do from DishOrder do where do.storeId= ? and do.createTime > ? and do.createTime< ? order by do.createTime ")
	// .setParameter(1,
	// storeId).setParameter(2,startTime).setParameter(3,endTime).getResultList();
	// }
	//

	@SuppressWarnings("unchecked")
	public List<MaterialRecord> getMaterialRecordByStoreIdAndTime(long storeId,
			long startTime, long endTime) {
		return entityManager
				.createQuery(
						"select mr from MaterialRecord mr where mr.storeId=? and mr.createTime between ? and ? ")
				.setParameter(1, storeId).setParameter(2, startTime)
				.setParameter(3, endTime).getResultList();
	}

}

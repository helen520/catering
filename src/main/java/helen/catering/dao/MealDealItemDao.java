package helen.catering.dao;

import helen.catering.Utils;
import helen.catering.model.entities.Dish;
import helen.catering.model.entities.MealDealItem;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class MealDealItemDao {

	@PersistenceContext
	private EntityManager entityManager;

	public MealDealItem find(Long id) {
		return entityManager.find(MealDealItem.class, id);
	}

	@SuppressWarnings("unchecked")
	public List<MealDealItem> getMealDealItemsByStoreId(long storeId) {
		return entityManager
				.createQuery(
						"select md from MealDealItem md where md.storeId=? order by sort")
				.setParameter(1, storeId).getResultList();
	}
	
	@SuppressWarnings("unchecked")
	public List<MealDealItem> getMealDealItemsByTargetDishId(long targetDishId){
		List<MealDealItem> lists= entityManager.createQuery(
				"select md from MealDealItem md where md.targetDishId=? order by sort"
				).setParameter(1,targetDishId).getResultList();
		
		return lists;
	}
	
	@Transactional
	public MealDealItem save(MealDealItem mealDealItem){
		if (mealDealItem.getId() == 0) {
			mealDealItem.setId(Utils.generateEntityId());
		}
		return entityManager.merge(mealDealItem);
	}

	@Transactional
	public Dish saveDishAndMealItemList(Dish dish,MealDealItem[] mealDealItems){
		Dish newDish=null;
		if(dish != null){
			newDish=entityManager.merge(dish);
		}
		String dishName=dish.getName();
		for(MealDealItem mealDealItem : mealDealItems){
			if (mealDealItem.getId() == 0) {
				mealDealItem.setId(Utils.generateEntityId());
			}
			if(dishName!=mealDealItem.getDishName()){
				mealDealItem.setDishName(dishName);
			}
			entityManager.merge(mealDealItem);
		}
		return newDish;
	}
	@Transactional
	public List<MealDealItem> saveList(MealDealItem[] mealDealItems){
		List<MealDealItem> lists =new ArrayList<MealDealItem>();
		for(MealDealItem mealDealItem : mealDealItems){
			if (mealDealItem.getId() == 0) {
				mealDealItem.setId(Utils.generateEntityId());
			}
			MealDealItem mdi=(entityManager.merge(mealDealItem));
			lists.add(mdi);
		}
		return lists;
	}
	@Transactional
	public void deleteMealDealItemsById(String mdiIds){
		String[] mdiIdList=mdiIds.split(",");		
		for(String mdiId : mdiIdList){
			if(mdiId.length()>5){	
				long mdiIdLong=Long.parseLong(mdiId);
				MealDealItem mealDealItem=entityManager.find(MealDealItem.class,mdiIdLong);
				entityManager.remove(mealDealItem);
			}
		}
	}
}

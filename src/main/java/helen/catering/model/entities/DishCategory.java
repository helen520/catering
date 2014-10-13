package helen.catering.model.entities;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Transient;

import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.map.ObjectMapper;

@Entity
public class DishCategory implements Serializable, Comparable<DishCategory> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	private long id;

	@Transient
	private long menuId;

	@Column
	private String name;

	@Column
	private String alias;

	@Column
	private int sort;

	@Transient
	private String jsonHash;

	@ManyToOne
	@JoinColumn(name = "MenuId")
	private Menu menu;

	@OneToMany(mappedBy = "dishCategory", cascade = CascadeType.ALL)
	private List<Dish> dishes;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getMenuId() {
		return menuId;
	}

	public void setMenuId(long menuId) {
		this.menuId = menuId;
	}

	@JsonIgnore
	public Menu getMenu() {
		return menu;
	}

	@JsonIgnore
	public void setMenu(Menu menu) {
		this.menu = menu;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	public Integer  getSort() {
		return sort;
	}

	public void setSort(int sort) {
		this.sort = sort;
	}

	public List<Dish> getDishes() {
		return dishes;
	}

	public void setDishes(List<Dish> dishes) {
		this.dishes = dishes;
	}

	public String getJsonHash() {
		return jsonHash;
	}

	public void setJsonHash(String jsonHash) {
		this.jsonHash = jsonHash;
	}

	public void updateJsonHash() {
		ObjectMapper om = new ObjectMapper();
		byte[] jsonBytes;
		try {
			jsonBytes = om.writeValueAsBytes(this);
		} catch (Exception e) {
			setJsonHash(String.valueOf(new Random().nextLong()));
			return;
		}
		org.getopt.util.hash.FNV164 fnv1 = new org.getopt.util.hash.FNV164();
		fnv1.init(jsonBytes, 0, jsonBytes.length);

		setJsonHash(String.valueOf(fnv1.getHash()));
	}

	public static void linkDishes(List<DishCategory> listOfDishCategory,
			List<Dish> listOfDish) {
		java.util.HashMap<java.lang.Long, List<Dish>> map = new java.util.HashMap<java.lang.Long, List<Dish>>();

		for (Dish objDish : listOfDish) {
			if (!map.containsKey(objDish.getDishCategory().id)) {
				map.put(objDish.getDishCategory().id, new ArrayList<Dish>());
			}
			map.get(objDish.getDishCategory().id).add(objDish);
		}

		for (DishCategory objDishCategory : listOfDishCategory) {
			if (map.containsKey(objDishCategory.getId())) {
				objDishCategory.setDishes(map.get(objDishCategory.getId()));
			} else {
				objDishCategory.setDishes(new ArrayList<Dish>());
			}
		}
	}

	@Override
	public int compareTo(DishCategory arg0) {
		return this.getSort().compareTo(arg0.getSort());
	}

}

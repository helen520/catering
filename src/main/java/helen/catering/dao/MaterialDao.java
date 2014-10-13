package helen.catering.dao;

import helen.catering.Utils;
import helen.catering.model.entities.Material;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class MaterialDao {

	@PersistenceContext
	private EntityManager entityManager;

	@SuppressWarnings("unchecked")
	public List<Material> getMaterialsByStoreId(long storeId) {
		return entityManager
				.createQuery(
						"select d from Material d where d.storeId = ? order by sort")
				.setParameter(1, storeId).getResultList();
	}

	public Material getMaterialById(long id) {
		try {
			return entityManager.find(Material.class, id);
		} catch (Exception e) {
			return null;
		}
	}

	@Transactional
	public Material save(Material material) {
		if (material.getId() == 0) {
			material.setId(Utils.generateEntityId());
		}
		return entityManager.merge(material);
	}

	@Transactional
	public boolean deleteMaterial(long id) {
		try {
			String queryStr = "delete from Material where id = ?";
			int isSuccessed = this.entityManager.createQuery(queryStr)
					.setParameter(1, id).executeUpdate();
			if (isSuccessed == 1) {
				return true;
			} else
				return false;
		} catch (Exception e) {
			return false;
		}
	}
}

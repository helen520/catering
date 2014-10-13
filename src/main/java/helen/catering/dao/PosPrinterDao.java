package helen.catering.dao;

import helen.catering.Utils;
import helen.catering.model.entities.PosPrinter;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class PosPrinterDao {
	@PersistenceContext
	private EntityManager entityManager;

	@SuppressWarnings("unchecked")
	public PosPrinter getPrinterByNumber(Integer number) {

		List<PosPrinter> printers = entityManager
				.createQuery("select pp from PosPrinter pp where pp.number=?")
				.setParameter(1, number).getResultList();
		if (printers == null)
			return null;
		if (printers.size() > 0) {
			return printers.get(0);
		} else
			return null;

	}

	@SuppressWarnings("unchecked")
	public PosPrinter getDelieverNotePrinterByStoreId(long storeId) {
		List<PosPrinter> printers = entityManager
				.createQuery(
						"select pp from PosPrinter pp where pp.canPrintCheckoutBill=1 and pp.storeId=?")
				.setParameter(1, storeId).getResultList();
		if (printers == null)
			return null;
		if (printers.size() > 0) {
			return printers.get(0);
		} else
			return null;
	}

	public PosPrinter find(long id) {
		try {
			return entityManager.find(PosPrinter.class, id);
		} catch (Exception e) {
			return null;
		}
	}

	@SuppressWarnings("unchecked")
	public List<PosPrinter> getPrintersByStoreId(long storeId) {
		List<PosPrinter> printers = entityManager
				.createQuery("select pp from PosPrinter pp where  pp.storeId=?")
				.setParameter(1, storeId).getResultList();
		return printers;
	}

	@Transactional
	public PosPrinter save(PosPrinter posPrinter) {
		if (posPrinter.getId() == 0) {
			posPrinter.setId(Utils.generateEntityId());
		}
		return entityManager.merge(posPrinter);
	}

	@Transactional
	public boolean deletePosPrinter(long id) {
		String queryStr = "delete from PosPrinter where id = ?";
		this.entityManager.createQuery(queryStr).setParameter(1, id)
				.executeUpdate();
		return true;
	}
}

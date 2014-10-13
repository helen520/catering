package helen.catering.dao;

import helen.catering.Utils;
import helen.catering.model.entities.PrintPacket;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class PrintPacketDao {
	@PersistenceContext
	private EntityManager entityManager;

	@Transactional(propagation = Propagation.REQUIRED, isolation = Isolation.DEFAULT, readOnly = false)
	public void save(PrintPacket packet) {
		if (packet.getId() == 0) {
			packet.setId(Utils.generateEntityId());
			entityManager.persist(packet);
		} else {
			entityManager.merge(packet);
		}
	}

	@SuppressWarnings("unchecked")
	@Transactional(propagation = Propagation.REQUIRED, isolation = Isolation.DEFAULT, readOnly = false)
	public List<PrintPacket> popPrintPacketsByPrinterId(long printerId) {
		List<PrintPacket> printPacketList = entityManager
				.createQuery("select p from PrintPacket P where posPrinterId=?")
				.setParameter(1, printerId).getResultList();

		if(printPacketList!=null && printPacketList.size()>0){
			entityManager
					.createQuery("delete from PrintPacket p where posPrinterId=?")
					.setParameter(1, printerId).executeUpdate();
			entityManager.flush();
		}

		return printPacketList;

	}

}

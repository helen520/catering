package helen.catering.model.entities;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Department implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	private long id;

	@Column
	private long storeId;

	@Column
	private Long cookingNotePrinterId;

	@Column
	private Long delivererNotePrinterId;

	@Column
	private Long secondaryDelivererNotePrinterId;
	
	@Column
	private String name;
	
	@Column
	private boolean sliceCookingNotes;
		
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getStoreId() {
		return storeId;
	}

	public void setStoreId(long storeId) {
		this.storeId = storeId;
	}

	public Long getCookingNotePrinterId() {
		return cookingNotePrinterId;
	}

	public void setCookingNotePrinterId(Long cookingNotePrinterId) {
		this.cookingNotePrinterId = cookingNotePrinterId;
	}

	public Long getDelivererNotePrinterId() {
		return delivererNotePrinterId;
	}

	public void setDelivererNotePrinterId(Long delivererNotePrinterId) {
		this.delivererNotePrinterId = delivererNotePrinterId;
	}

	public Long getSecondaryDelivererNotePrinterId() {
		return secondaryDelivererNotePrinterId;
	}

	public void setSecondaryDelivererNotePrinterId(
			Long secondaryDelivererNotePrinterId) {
		this.secondaryDelivererNotePrinterId = secondaryDelivererNotePrinterId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public boolean getSliceCookingNotes() {
		return sliceCookingNotes;
	}

	public void setSliceCookingNotes(boolean sliceCookingNotes) {
		this.sliceCookingNotes = sliceCookingNotes;
	}
}

package helen.catering.model.entities;

import helen.catering.Utils;

import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name = "MemberPolicy")
public class MemberPolicy {
	@Id
	private long id;
	@Column
	private long storeId;
	@Column
	private long startDate;
	@Column
	private long endDate;
	@Column
	private String title;
	@Column
	private String subTitle;
	@Column
	private String text;
	@Column
	private String url;
	@Column
	private boolean displayOnBottom;
	@Transient
	private String startDateStr;
	@Transient
	private String validDate;

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

	public long getStartDate() {
		return startDate;
	}

	public void setStartDate(long startDate) {
		this.startDate = startDate;
	}

	public long getEndDate() {
		return endDate;
	}

	public void setEndDate(long endDate) {
		this.endDate = endDate;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getSubTitle() {
		return subTitle;
	}

	public void setSubTitle(String subTitle) {
		this.subTitle = subTitle;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public boolean getDisplayOnBottom() {
		return displayOnBottom;
	}

	public void setDisplayOnBottom(boolean displayOnBottom) {
		this.displayOnBottom = displayOnBottom;
	}

	public String getStartDateStr() {
		return Utils.formatShortDateTimeYMD(startDate);
	}

	public String getValidDate() {
		return Utils.formatShortDateTimeYMD(endDate);
	}

	@Transient
	public static MemberPolicy create() {
		MemberPolicy memberPolicy = new MemberPolicy();

		long id = UUID.randomUUID().getLeastSignificantBits();
		id = id / 0x1000;
		id = Long.signum(id) * id;
		memberPolicy.setId(id);
		return memberPolicy;
	}
}
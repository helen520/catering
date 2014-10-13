package helen.catering.model.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@Entity
@Table(name = "Resource")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Resource
{
	@Id
	private long id;
	@Column
	private long timeRangeId;
	@Column
	private String name;
	@Column
	private int amount;

	public long getId()
	{
		return id;
	}

	public void setId(long id)
	{
		this.id = id;
	}

	public long getTimeRangeId()
	{
		return timeRangeId;
	}

	public void setTimeRangeId(long timeRangeId)
	{
		this.timeRangeId = timeRangeId;
	}

	public String getName()
	{
		return name;
	}

	public void setName(String name)
	{
		this.name = name;
	}

	public int getAmount()
	{
		return amount;
	}

	public void setAmount(int amount)
	{
		this.amount = amount;
	}
}

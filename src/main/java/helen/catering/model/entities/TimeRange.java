package helen.catering.model.entities;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@Entity
@Table(name = "TimeRange")
@JsonIgnoreProperties(ignoreUnknown = true)
public class TimeRange
{
	@Id
	private long id;
	@Column
	private String name;
	@Column
	private long storeId;
	@Column
	private long startTime;
	@Column
	private long endTime;
	@Column
	private String arriveTimeOptions;
	
	@Transient
	private List<Resource> resourceList;
	
	public long getId()
	{
		return id;
	}
	public void setId(long id)
	{
		this.id = id;
	}
	public String getName()
	{
		return name;
	}
	public void setName(String name)
	{
		this.name = name;
	}
	public long getstoreId()
	{
		return storeId;
	}
	public void setstoreId(long storeId)
	{
		this.storeId = storeId;
	}
	public long getStartTime()
	{
		return startTime;
	}
	public void setStartTime(long startTime)
	{
		this.startTime = startTime;
	}
	public long getEndTime()
	{
		return endTime;
	}
	public void setEndTime(long endTime)
	{
		this.endTime = endTime;
	}
	public String getArriveTimeOptions()
	{
		return arriveTimeOptions;
	}
	public void setArriveTimeOptions(String arriveTimeOptions)
	{
		this.arriveTimeOptions = arriveTimeOptions;
	}
	public List<Resource> getResourceList()
	{
		return resourceList;
	}
	public void setResourceList(List<Resource> resourceList)
	{
		this.resourceList = resourceList;
	}
}

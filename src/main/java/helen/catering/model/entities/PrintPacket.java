package helen.catering.model.entities;

import java.util.Random;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name = "PrintPacket")
public class PrintPacket {
	@Id
	long id;
	
	@Column
	long posPrinterId;
	
	@Column
	long printTime;
	
	@Column
	private byte[] printData;
	
	@Column
	boolean isPrintSucceed;

	@Column
	private
	boolean postCheck;

	@Column
	private String errorLog;
	
	@Column
	private int sleepTime;
	
	@Transient
	private int retryTimes = 2;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getPosPrinterId() {
		return posPrinterId;
	}

	public void setPosPrinterId(long posPrinterId) {
		this.posPrinterId = posPrinterId;
	}

	public long getPrintTime() {
		return printTime;
	}

	public void setPrintTime(long printTime) {
		this.printTime = printTime;
	}

	public byte[] getPrintData() {
		return printData;
	}

	public void setPrintData(byte[] printData) {
		this.printData = printData;
	}

	public boolean setIsPrintSucceed() {
		return isPrintSucceed;
	}

	public void setIsPrintSucceed(boolean isPrintSucceed) {
		this.isPrintSucceed = isPrintSucceed;
	}

	@Transient
	public static PrintPacket create() {
		PrintPacket printPacket = new PrintPacket();
		Random ran = new Random();
		printPacket.setId(System.currentTimeMillis()*100+ran.nextInt(10000));

		return printPacket;
	}

	public String getErrorLog() {
		return errorLog;
	}

	public void setErrorLog(String errorLog) {
		this.errorLog = errorLog;
	}

	public int getSleepTime() {
		return sleepTime;
	}

	public void setSleepTime(int sleepTime) {
		this.sleepTime = sleepTime;
	}

	public int getRetryTimes() {
		return retryTimes;
	}

	public void setRetryTimes(int retryTimes) {
		this.retryTimes = retryTimes;
	}

	public boolean isPostCheck() {
		return postCheck;
	}

	public void setPostCheck(boolean postCheck) {
		this.postCheck = postCheck;
	}
}
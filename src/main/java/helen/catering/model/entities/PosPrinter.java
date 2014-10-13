package helen.catering.model.entities;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class PosPrinter implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public final static String INTERFACE_TCPIP = "INTERFACE_TCPIP";
	public final static String INTERFACE_SERIAL = "INTERFACE_SERIAL";
	public final static String INTERFACE_DTU = "INTERFACE_DTU";

	public final static String COMMANDSET_ESCPOS = "COMMANDSET_ESCPOS";
	public final static String COMMANDSET_BASIC = "COMMANDSET_BASIC";

	@Id
	private long id;

	@Column
	private long storeId;

	@Column
	private Long backupPosPrinterID;

	@Column
	private String name;

	@Column
	private int number;

	@Column
	private boolean canPrintCheckoutBill;

	@Column
	private boolean canPrintCustomerNote;

	@Column
	private String interfaceType;

	@Column
	private String commandSet;

	@Column
	private String deviceName;

	@Column
	private Integer baudBase;

	@Column
	private String ipAddress;

	@Column
	private boolean beep;

	@Column
	private int speed;

	@Column
	private int frameWidth;

	@Column
	private int charactersPerLine;

	@Column
	private int headerEmptyLines;

	@Column
	private int tailEmptyLines;

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

	public Long getBackupPosPrinterID() {
		return backupPosPrinterID;
	}

	public void setBackupPosPrinterID(Long backupPosPrinterID) {
		this.backupPosPrinterID = backupPosPrinterID;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getNumber() {
		return number;
	}

	public void setNumber(int number) {
		this.number = number;
	}

	public boolean isCanPrintCheckoutBill() {
		return canPrintCheckoutBill;
	}

	public void setCanPrintCheckoutBill(boolean canPrintCheckoutBill) {
		this.canPrintCheckoutBill = canPrintCheckoutBill;
	}

	public boolean isCanPrintCustomerNote() {
		return canPrintCustomerNote;
	}

	public void setCanPrintCustomerNote(boolean canPrintCustomerNote) {
		this.canPrintCustomerNote = canPrintCustomerNote;
	}

	public String getInterfaceType() {
		return interfaceType;
	}

	public void setInterfaceType(String interfaceType) {
		this.interfaceType = interfaceType;
	}

	public String getCommandSet() {
		return commandSet;
	}

	public void setCommandSet(String commandSet) {
		this.commandSet = commandSet;
	}

	public String getDeviceName() {
		return deviceName;
	}

	public void setDeviceName(String deviceName) {
		this.deviceName = deviceName;
	}

	public Integer getBaudBase() {
		return baudBase;
	}

	public void setBaudBase(Integer baudBase) {
		this.baudBase = baudBase;
	}

	public String getIpAddress() {
		return ipAddress;
	}

	public void setIpAddress(String ipAddress) {
		this.ipAddress = ipAddress;
	}

	public boolean isBeep() {
		return beep;
	}

	public void setBeep(boolean beep) {
		this.beep = beep;
	}

	public int getSpeed() {
		return speed;
	}

	public void setSpeed(int speed) {
		this.speed = speed;
	}

	public int getFrameWidth() {
		return frameWidth;
	}

	public void setFrameWidth(int frameWidth) {
		this.frameWidth = frameWidth;
	}

	public int getCharactersPerLine() {
		return charactersPerLine;
	}

	public void setCharactersPerLine(int charactersPerLine) {
		this.charactersPerLine = charactersPerLine;
	}

	public int getHeaderEmptyLines() {
		return headerEmptyLines;
	}

	public void setHeaderEmptyLines(int headerEmptyLines) {
		this.headerEmptyLines = headerEmptyLines;
	}

	public int getTailEmptyLines() {
		return tailEmptyLines;
	}

	public void setTailEmptyLines(int tailEmptyLines) {
		this.tailEmptyLines = tailEmptyLines;
	}
}

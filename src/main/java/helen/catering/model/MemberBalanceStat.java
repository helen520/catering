package helen.catering.model;

public class MemberBalanceStat {

	private long memberId;
	private String memberCardNo;
	private String createTimeStr;
	private String name;
	private String mobilePhone;
	private double balance;
	private double totalRechargedAmount;
	private double totalExpenditure;

	public long getMemberId() {
		return memberId;
	}

	public void setMemberId(long memberId) {
		this.memberId = memberId;
	}

	public String getMemberCardNo() {
		return memberCardNo;
	}

	public void setMemberCardNo(String memberCardNo) {
		this.memberCardNo = memberCardNo;
	}

	public String getCreateTimeStr() {
		return createTimeStr;
	}

	public void setCreateTimeStr(String createTimeStr) {
		this.createTimeStr = createTimeStr;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getMobilePhone() {
		return mobilePhone;
	}

	public void setMobilePhone(String mobilePhone) {
		this.mobilePhone = mobilePhone;
	}

	public double getBalance() {
		return balance;
	}

	public void setBalance(double balance) {
		this.balance = balance;
	}

	public double getTotalRechargedAmount() {
		return totalRechargedAmount;
	}

	public void setTotalRechargedAmount(double totalRechargedAmount) {
		this.totalRechargedAmount = totalRechargedAmount;
	}

	public double getTotalExpenditure() {
		return totalExpenditure;
	}

	public void setTotalExpenditure(double totalExpenditure) {
		this.totalExpenditure = totalExpenditure;
	}
}

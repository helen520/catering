package helen.catering.controller;

import helen.catering.model.CookerDishStat;
import helen.catering.model.DepartmentStat;
import helen.catering.model.FinanceStat;
import helen.catering.model.MemberBalanceStat;
import helen.catering.model.PaymentStat;
import helen.catering.model.SellStat;
import helen.catering.model.entities.BalanceOperationLog;
import helen.catering.model.entities.CouponOperationLog;
import helen.catering.model.entities.DishOrder;
import helen.catering.model.entities.Employee;
import helen.catering.model.entities.MaterialRecord;
import helen.catering.model.entities.OperationLog;
import helen.catering.model.entities.OrderItem;
import helen.catering.model.entities.UserAccount;
import helen.catering.service.BalanceOperationLogService;
import helen.catering.service.CouponOperationLogService;
import helen.catering.service.OperationLogService;
import helen.catering.service.ReportingService;
import helen.catering.service.ServiceException;
import helen.catering.service.UserService;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("reporting")
public class ReportingController {

	@Autowired
	ReportingService _reportingService;
	@Autowired
	UserService _userService;
	@Autowired
	BalanceOperationLogService _balanceOperationLogService;
	@Autowired
	OperationLogService _operationLogService;
	@Autowired
	CouponOperationLogService _couponOperationLogService;

	@ResponseBody
	@RequestMapping(value = "getReportingCSVFile")
	public void getReportingCSVFile(
			HttpServletRequest request,
			HttpServletResponse response,
			@RequestParam(value = "storeId") long storeId,
			@RequestParam(value = "reportType") String reportType,
			@RequestParam(value = "archivedTime", required = false, defaultValue = "0") String archivedTimeStr,
			@RequestParam(value = "startDate", required = false, defaultValue = "") String startDate,
			@RequestParam(value = "endDate", required = false, defaultValue = "") String endDate)
			throws Exception {

		boolean isAuthority = verifyAuthority(storeId);

		if (!isAuthority)
			return;

		response.setContentType("application/vnd.ms-excel");

		ServletOutputStream os = response.getOutputStream();
		File tempFile = File.createTempFile("reporting", ".csv");
		BufferedWriter bw = new BufferedWriter(new FileWriter(tempFile));
		FinanceStat stat = null;

		response.setHeader(
				"Content-Disposition",
				"attachment; filename="
						+ new String((reportType + "-"
								+ System.currentTimeMillis() + ".csv")
								.getBytes("utf-8"), "ISO-8859-1") + "");

		long startTimeLong = 0;
		long endTimeLong = 0;
		if ((!"".equals(startDate)) && (!"".equals(endDate))) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			try {
				startTimeLong = sdf.parse(startDate + " 00:00:00").getTime();
				endTimeLong = sdf.parse(endDate + " 23:59:59").getTime();
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}

		if (reportType.equals("currentClass")) {
			stat = this._reportingService.getCurrentClassFinanceStat(storeId);
		} else if (reportType.equals("classReporting")) {
			stat = this._reportingService.getClassFinanceStatByADT(storeId,
					Long.parseLong(archivedTimeStr));
		} else if (reportType.equals("classesInTimeRange")) {
			stat = this._reportingService
					.getAggregatedClassFinanceStatInTimeRange(storeId, false,
							startTimeLong, endTimeLong);
		} else if (reportType.equals("dailyReporting")) {
			stat = this._reportingService.getDailyFinancialStat(storeId,
					startTimeLong, endTimeLong);
		} else if (reportType.equals("timeRangeReporting")) {
			stat = this._reportingService.getFinancialStatInTimeRange(storeId,
					startTimeLong, endTimeLong);
		} else if (reportType.equals("cookerDishReporting")) {
			Map<String, List<CookerDishStat>> statMap = this._reportingService
					.getCookerDishStatCookerNameMapInTimeRangeByStoreId(
							storeId, startTimeLong, endTimeLong);
			writeCookerDishStatReportingData(os, bw, tempFile, statMap);
			return;
		} else if (reportType.equals("balanceRecordsReporting")) {
			List<BalanceOperationLog> operationLogs = this._balanceOperationLogService
					.getDailyBalanceRecordListByStoreId(storeId, startTimeLong,
							endTimeLong);
			writeBalanceRecordData(os, bw, tempFile, operationLogs);
			return;
		} else if (reportType.equals("memberBalanceReporting")) {
			List<MemberBalanceStat> memberBalanceStats = _reportingService
					.getMemberBalanceStatsByStoreId(storeId);
			writeMemberBalanceReportData(os, bw, tempFile, memberBalanceStats);
			return;
		}

		writeReportingData(os, bw, tempFile, stat);
	}

	private boolean verifyAuthority(long storeId) throws Exception {
		UserAccount user = null;
		try {
			user = _userService.AssertStoreAuth(storeId);
		} catch (Exception ex) {
			throw new ServiceException(ServiceException.NOT_AUTHORUTY);
		}

		Employee employee = _userService.getEmployeeByUserAccountId(user
				.getId());

		if (employee.getCanViewReport())
			return true;
		return false;
	}

	public void writeReportingData(ServletOutputStream os, BufferedWriter bw,
			File tempFile, FinanceStat stat) throws Exception {
		try {

			bw.write("ID" + "," + "时间" + "," + "台名" + "," + "人数" + "," + "消费金额"
					+ "," + "折扣率" + "," + "折后金额" + "," + "服务费" + "," + "应收"
					+ "," + "备注");
			for (DishOrder order : stat.getDishOrders()) {
				bw.newLine();
				bw.write(order.getId() + "," + order.getCreateTimeStr() + ","
						+ order.getDeskName() + "," + order.getCustomerCount()
						+ "," + order.getTotalPrice() + ","
						+ order.getDiscountRate() + ","
						+ order.getDiscountedPrice() + ","
						+ order.getServiceFee() + ","
						+ (order.getDiscountedPrice() + order.getServiceFee())
						+ "," + order.getMemo());
			}

			bw.newLine();
			bw.newLine();
			bw.write("部门" + "," + "出品数" + "," + "总原价" + "," + "折后总价" + ","
					+ "总折扣" + "," + "总服务费" + "," + "优惠券" + "," + "总价");
			for (DepartmentStat dep : stat.getDepartmentStats()) {
				bw.newLine();
				bw.write(dep.getDepartmentName()
						+ ","
						+ dep.getOrderItemCount()
						+ ","
						+ dep.getTotalOrgPrice()
						+ ","
						+ dep.getTotalDiscountedPrice()
						+ ","
						+ (dep.getTotalOrgPrice() - dep
								.getTotalDiscountedPrice()) + ","
						+ dep.getTotalServiceFee() + ","
						+ dep.getTotalCouponValue() + ","
						+ dep.getTotalFinalPrice());
			}

			bw.newLine();
			bw.newLine();
			bw.write("订单数" + "," + "总人数" + "," + "折前总价" + "," + "折后总价" + ","
					+ "总服务费" + "," + "人均消费" + "," + "应收款");
			bw.newLine();
			bw.write(stat.getDishOrderCount()
					+ ","
					+ stat.getCustomerCount()
					+ ","
					+ stat.getTotalPrice()
					+ ","
					+ stat.getTotalDiscountedPrice()
					+ ","
					+ stat.getTotalServiceFee()
					+ ","
					+ (stat.getTotalDiscountedPrice() + stat
							.getTotalServiceFee())
					/ stat.getCustomerCount()
					+ ","
					+ (stat.getTotalDiscountedPrice() + stat
							.getTotalServiceFee()));

			bw.newLine();
			bw.newLine();
			bw.write("收入项目" + "," + "记录数" + "," + "原币" + "," + "汇率" + ","
					+ "金额");
			for (PaymentStat pay : stat.getPaymentStats()) {
				bw.newLine();
				bw.write(pay.getTypeName() + "," + pay.getPayRecordCount()
						+ "," + pay.getTotalAmount() + ","
						+ pay.getExchageRate() + ","
						+ pay.getTransferedAmount());
			}
			bw.newLine();
			bw.write("实收款总额" + "," + stat.getSumOfPayRecordAmount());
			bw.close();

			writeDataInOutputStream(tempFile, os);

		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
	}

	private void writeCookerDishStatReportingData(ServletOutputStream os,
			BufferedWriter bw, File tempFile,
			Map<String, List<CookerDishStat>> statMap) throws Exception {
		bw.write("厨师" + "," + "菜品名称" + "," + "总出品数" + "," + "菜品销售总额" + ","
				+ "小计");
		for (String cookerName : statMap.keySet()) {
			List<CookerDishStat> stats = statMap.get(cookerName);
			double totalAmount = 0;
			for (CookerDishStat stat : stats) {
				totalAmount += stat.getGrossSales();
				bw.newLine();
				bw.write(stat.getCookerName() + "," + stat.getDishName() + ","
						+ stat.getDishAmount() + "," + stat.getGrossSales());
			}
			bw.newLine();
			bw.write("" + "," + "" + "," + "" + "," + "" + "," + totalAmount);
		}
		bw.close();

		writeDataInOutputStream(tempFile, os);
	}

	private void writeBalanceRecordData(ServletOutputStream os,
			BufferedWriter bw, File tempFile,
			List<BalanceOperationLog> operationLogs) throws Exception {
		bw.write("ID" + "," + "操作员" + "," + "会员卡号" + "," + "领卡时间" + ","
				+ "会员姓名" + "," + "会员电话" + "," + "操作时间" + "," + "操作详情");
		for (BalanceOperationLog ol : operationLogs) {
			bw.newLine();
			bw.write(ol.getId() + "," + ol.getOperatorEmployee().getName()
					+ "," + ol.getMember().getMemberCardNo() + ","
					+ ol.getMember().getCreateTimeStr() + ","
					+ ol.getMember().getName() + ","
					+ ol.getMember().getMobileNo() + ","
					+ ol.getCreateTimeStr() + "," + ol.getDataSnapShot() + ",");
		}
		bw.close();

		writeDataInOutputStream(tempFile, os);
	}

	private void writeMemberBalanceReportData(ServletOutputStream os,
			BufferedWriter bw, File tempFile,
			List<MemberBalanceStat> memberBalanceStats) throws Exception {
		bw.write("序号" + "," + "会员卡号" + "," + "领卡时间" + "," + "会员姓名" + ","
				+ "会员电话" + "," + "当前金额" + "," + "总充值金额" + "," + "总消费金额");
		double totalBalance = 0;
		double totalRechargedAmount = 0;
		double totalExpenditure = 0;
		for (int i = 0; i < memberBalanceStats.size(); i++) {
			MemberBalanceStat stat = memberBalanceStats.get(i);
			totalBalance += stat.getBalance();
			totalRechargedAmount += stat.getTotalRechargedAmount();
			totalExpenditure += stat.getTotalExpenditure();
			bw.newLine();
			bw.write(i + 1 + "," + stat.getMemberCardNo() + ","
					+ stat.getCreateTimeStr() + "," + stat.getName() + ","
					+ stat.getMobilePhone() + "," + stat.getBalance() + ","
					+ stat.getTotalRechargedAmount() + ","
					+ stat.getTotalExpenditure() + ",");
		}
		bw.newLine();
		bw.write("全部," + "," + "," + "," + "," + totalBalance + ","
				+ totalRechargedAmount + "," + totalExpenditure);
		bw.close();

		writeDataInOutputStream(tempFile, os);
	}

	@ResponseBody
	@RequestMapping(value = "getSellStatCSVFile")
	public void getSellStatCSVFile(
			HttpServletRequest request,
			HttpServletResponse response,
			@RequestParam(value = "storeId") long storeId,
			@RequestParam(value = "sellStatType") String sellStatType,
			@RequestParam(value = "departmentValue", required = false, defaultValue = "0") String departmentValue,
			@RequestParam(value = "startDate", required = false, defaultValue = "") String startDate,
			@RequestParam(value = "endDate", required = false, defaultValue = "") String endDate)
			throws Exception {

		boolean isAuthority = verifyAuthority(storeId);

		if (!isAuthority)
			return;

		response.setContentType("application/vnd.ms-excel");

		ServletOutputStream os = response.getOutputStream();
		File tempFile = File.createTempFile("sellStat", ".csv");
		BufferedWriter bw = new BufferedWriter(new FileWriter(tempFile));

		List<SellStat> stats = null;

		response.setHeader(
				"Content-Disposition",
				"attachment; filename="
						+ new String((sellStatType + "-"
								+ System.currentTimeMillis() + ".csv")
								.getBytes("utf-8"), "ISO-8859-1") + "");

		long startTimeLong = 0;
		long endTimeLong = 0;
		if ((!"".equals(startDate)) && (!"".equals(endDate))) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			try {
				startTimeLong = sdf.parse(startDate + " 00:00:00").getTime();
				endTimeLong = sdf.parse(endDate + " 23:59:59").getTime();
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}

		if (sellStatType.equals("dishCategorySellStats")) {
			stats = this._reportingService.getDishCategorySellStats(storeId,
					startTimeLong, endTimeLong, true);
			writeDishCategorySellStatsData(os, bw, tempFile, stats);
		} else if (sellStatType.equals("deskNoSellStats")) {
			stats = this._reportingService.getDeskSellStats(storeId,
					startTimeLong, endTimeLong);
			writeDeskNoSellStatsData(os, bw, tempFile, stats);
		} else if (sellStatType.equals("employeeSellStats")) {
			stats = this._reportingService.getEmployeeSellStats(storeId,
					startTimeLong, endTimeLong);
			writeEmployeeSellStatsData(os, bw, tempFile, stats);
		} else if (sellStatType.equals("departmentSellStat")) {
			stats = this._reportingService
					.getDepartmentSellStats(storeId, startTimeLong,
							endTimeLong, Long.parseLong(departmentValue));
			writeDepartmentSellStatData(os, bw, tempFile, stats);
		} else if (sellStatType.equals("materialRecordSellStat")) {
			List<MaterialRecord> records = this._reportingService
					.getMaterialRecordByStoreIdAndTime(storeId, startTimeLong,
							endTimeLong);
			writeMaterialRecordData(os, bw, tempFile, records);
		}

	}

	public void writeDishCategorySellStatsData(ServletOutputStream os,
			BufferedWriter bw, File tempFile, List<SellStat> stats)
			throws Exception {
		try {

			bw.write("类名/菜名" + "," + "出品数" + "," + "折前总价" + "," + "折后总价");
			for (SellStat stat : stats) {
				if (stat.getAmount() == 0) {
					continue;
				}
				if (stat.getUnit() == null) {
					bw.newLine();
				}
				bw.newLine();
				bw.write(stat.getItemName() + "," + stat.getAmount() + ","
						+ stat.getTotalOrgPrice() + "," + stat.getTotalPrice());
			}
			bw.newLine();
			bw.close();

			writeDataInOutputStream(tempFile, os);

		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
	}

	public void writeDeskNoSellStatsData(ServletOutputStream os,
			BufferedWriter bw, File tempFile, List<SellStat> stats)
			throws Exception {
		try {

			bw.write("台号" + "," + "订单数" + "," + "折前总价" + "," + "折后总价");
			for (SellStat stat : stats) {
				if (stat.getAmount() == 0) {
					continue;
				}
				bw.newLine();
				bw.write(stat.getItemName() + "," + stat.getAmount() + ","
						+ stat.getTotalOrgPrice() + "," + stat.getTotalPrice());
			}
			bw.newLine();
			bw.close();

			writeDataInOutputStream(tempFile, os);

		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
	}

	public void writeEmployeeSellStatsData(ServletOutputStream os,
			BufferedWriter bw, File tempFile, List<SellStat> stats)
			throws Exception {
		try {

			bw.write("工号" + "," + "姓名" + "," + "总数量" + "," + "总结算价");
			for (SellStat stat : stats) {
				bw.newLine();
				bw.write(stat.getWorkNumber() + "," + stat.getItemName() + ","
						+ stat.getAmount() + "," + stat.getTotalPrice());
			}
			bw.newLine();
			bw.close();

			writeDataInOutputStream(tempFile, os);

		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
	}

	public void writeDepartmentSellStatData(ServletOutputStream os,
			BufferedWriter bw, File tempFile, List<SellStat> stats)
			throws Exception {
		try {

			bw.write("菜名" + "," + "单位" + "," + "数量" + "," + "单价" + "," + "标价金额"
					+ "," + "加收" + "," + "原价" + "," + "折后价" + "," + "服务费" + ","
					+ "实收金额");
			for (SellStat stat : stats) {
				bw.newLine();
				bw.write(stat.getItemName() + "," + stat.getUnit() + ","
						+ stat.getAmount() + "," + stat.getUnitPrice() + ","
						+ (stat.getTotalOrgPrice() - stat.getTotalExtraFee())
						+ "," + stat.getTotalExtraFee() + ","
						+ stat.getTotalOrgPrice() + ","
						+ stat.getTotalDiscountedPrice() + ","
						+ stat.getSettlePrice() + "," + stat.getTotalPrice());
			}
			bw.newLine();
			bw.close();

			writeDataInOutputStream(tempFile, os);

		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
	}

	public void writeMaterialRecordData(ServletOutputStream os,
			BufferedWriter bw, File tempFile, List<MaterialRecord> records)
			throws Exception {
		try {

			bw.write("ID" + "," + "交班时间" + "," + "原料名称" + "," + "总消耗重量(克)");
			for (MaterialRecord record : records) {
				bw.newLine();
				bw.write(record.getId() + "," + record.getCreateTimeStr() + ","
						+ record.getMaterialName() + "," + record.getWeight());
			}
			bw.newLine();
			bw.close();

			writeDataInOutputStream(tempFile, os);

		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
	}

	private void writeDataInOutputStream(File file, ServletOutputStream os)
			throws Exception {

		FileInputStream fileInputStream = new FileInputStream(file);
		if (fileInputStream != null) {
			int filelen = fileInputStream.available();
			byte[] a = new byte[filelen];
			fileInputStream.read(a);
			os.write(a);
		}
		fileInputStream.close();
		os.close();
		file.delete();
	}

	// 1当班报表
	@RequestMapping("currentClass")
	public ModelAndView currentClass(
			@RequestParam(value = "storeId") long storeId) throws Exception {

		boolean isAuthority = verifyAuthority(storeId);

		if (!isAuthority)
			throw new ServiceException(ServiceException.NOT_AUTHORUTY);

		ModelAndView mav = new ModelAndView();
		mav.setViewName("currentClass");

		FinanceStat currentClassObj = this._reportingService
				.getCurrentClassFinanceStat(storeId);
		mav.addObject("financeObject", currentClassObj);
		mav.addObject("storeId", storeId);

		return mav;
	}

	// 2交班报表
	@RequestMapping("classReporting")
	public ModelAndView classReporting(
			@RequestParam(value = "storeId") long storeId,
			@RequestParam(value = "archivedTime", required = false) String archivedTimeStr)
			throws Exception {

		boolean isAuthority = verifyAuthority(storeId);

		if (!isAuthority)
			throw new ServiceException(ServiceException.NOT_AUTHORUTY);

		ModelAndView mav = new ModelAndView();
		mav.setViewName("classReporting");
		FinanceStat currentClassObj = null;

		HashMap<Long, String> archivingTimeMap = new HashMap<Long, String>();
		archivingTimeMap = this._reportingService
				.getArchivingTimeMapByStoreId(storeId);
		List<Map.Entry<Long, String>> archivingTimeMapList = new ArrayList<Map.Entry<Long, String>>(
				archivingTimeMap.entrySet());
		Collections.sort(archivingTimeMapList,
				new Comparator<Map.Entry<Long, String>>() {
					public int compare(Map.Entry<Long, String> o1,
							Map.Entry<Long, String> o2) {
						return -o1.getKey().compareTo(o2.getKey());
					};
				});
		if (archivedTimeStr != null && !"".equals(archivedTimeStr)) {
			long archivedTime = Long.parseLong(archivedTimeStr);
			currentClassObj = this._reportingService.getClassFinanceStatByADT(
					storeId, archivedTime);

		} else {
			currentClassObj = new FinanceStat();
		}

		mav.addObject("storeId", storeId);
		mav.addObject("archivedTime", archivedTimeStr);
		mav.addObject("archivingTimeMapList", archivingTimeMapList);
		mav.addObject("financeObject", currentClassObj);
		return mav;
	}

	// 3 汇总交班报表
	@RequestMapping("classesInTimeRange")
	public ModelAndView classesInTimeRange(
			@RequestParam(value = "storeId") long storeId,
			@RequestParam(value = "startDate") String startDate,
			@RequestParam(value = "endDate") String endDate) throws Exception {

		boolean isAuthority = verifyAuthority(storeId);

		if (!isAuthority)
			throw new ServiceException(ServiceException.NOT_AUTHORUTY);

		ModelAndView mav = new ModelAndView();
		mav.setViewName("classesInTimeRange");
		FinanceStat currentClassObj = null;
		if ((!"".equals(startDate)) && (!"".equals(endDate))) {
			long startTimeLong = 0;
			long endTimeLong = 0;
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			try {
				startTimeLong = sdf.parse(startDate + " 00:00:00").getTime();
				endTimeLong = sdf.parse(endDate + " 23:59:59").getTime();
			} catch (ParseException e) {
				e.printStackTrace();
			}

			currentClassObj = this._reportingService
					.getAggregatedClassFinanceStatInTimeRange(storeId, false,
							startTimeLong, endTimeLong);
		} else {
			currentClassObj = new FinanceStat();
		}

		mav.addObject("storeId", storeId);
		mav.addObject("startDate", startDate.trim());
		mav.addObject("endDate", endDate);
		mav.addObject("financeObject", currentClassObj);
		return mav;
	}

	// 4每日报表
	@RequestMapping("dailyReporting")
	public ModelAndView dailyReporting(
			@RequestParam(value = "storeId") long storeId,
			@RequestParam(value = "dateToReport") String dateToReport)
			throws Exception {

		boolean isAuthority = verifyAuthority(storeId);

		if (!isAuthority)
			throw new ServiceException(ServiceException.NOT_AUTHORUTY);

		ModelAndView mav = new ModelAndView();
		mav.setViewName("dailyReporting");
		FinanceStat currentClassObj = null;

		if ((!"".equals(dateToReport))) {

			long startTimeLong = 0;
			long endTimeLong = 0;

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			try {
				startTimeLong = sdf.parse(dateToReport + " 00:00:00").getTime();
				endTimeLong = sdf.parse(dateToReport + " 23:59:59").getTime();
			} catch (ParseException e) {
				e.printStackTrace();
			}
			currentClassObj = this._reportingService.getDailyFinancialStat(
					storeId, startTimeLong, endTimeLong);
		} else {
			currentClassObj = new FinanceStat();
		}

		mav.addObject("storeId", storeId);
		mav.addObject("dateToReport", dateToReport);
		mav.addObject("financeObject", currentClassObj);
		return mav;
	}

	// 5时段报表
	@RequestMapping("timeRangeReporting")
	public ModelAndView TimeRangeReporting(
			@RequestParam(value = "storeId") long storeId,
			@RequestParam(value = "startDate") String startDate,
			@RequestParam(value = "endDate") String endDate) throws Exception {

		boolean isAuthority = verifyAuthority(storeId);

		if (!isAuthority)
			throw new ServiceException(ServiceException.NOT_AUTHORUTY);

		ModelAndView mav = new ModelAndView();
		mav.setViewName("timeRangeReporting");

		FinanceStat currentClassObj = null;
		if ((!"".equals(startDate)) && (!"".equals(endDate))) {

			long startTimeLong = 0;
			long endTimeLong = 0;

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			try {
				startTimeLong = sdf.parse(startDate + " 00:00:00").getTime();
				endTimeLong = sdf.parse(endDate + " 23:59:59").getTime();
			} catch (ParseException e) {
				e.printStackTrace();
			}

			currentClassObj = this._reportingService
					.getFinancialStatInTimeRange(storeId, startTimeLong,
							endTimeLong);
		} else {
			currentClassObj = new FinanceStat();
		}

		mav.addObject("storeId", storeId);
		mav.addObject("startDate", startDate);
		mav.addObject("endDate", endDate);
		mav.addObject("financeObject", currentClassObj);
		return mav;
	}

	// 6厨师菜品报表
	@RequestMapping("cookerDishReporting")
	public ModelAndView cookerDishReporting(
			@RequestParam(value = "storeId") long storeId,
			@RequestParam(value = "startDate", required = false) String startDate,
			@RequestParam(value = "endDate", required = false) String endDate)
			throws Exception {

		boolean isAuthority = verifyAuthority(storeId);

		if (!isAuthority)
			throw new ServiceException(ServiceException.NOT_AUTHORUTY);

		ModelAndView mav = new ModelAndView();
		mav.setViewName("cookerDishReporting");

		Map<String, List<CookerDishStat>> cookerDishStatMapByCookerName = null;

		if (startDate != null && (!"".equals(startDate))
				&& (endDate != null && !"".equals(endDate))) {

			long startTimeLong = 1;
			long endTimeLong = 100;

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			try {
				startTimeLong = sdf.parse(startDate + " 00:00:00").getTime();
				endTimeLong = sdf.parse(endDate + " 23:59:59").getTime();
			} catch (ParseException e) {
				e.printStackTrace();
			}

			cookerDishStatMapByCookerName = this._reportingService
					.getCookerDishStatCookerNameMapInTimeRangeByStoreId(
							storeId, startTimeLong, endTimeLong);
		} else {
			cookerDishStatMapByCookerName = new HashMap<String, List<CookerDishStat>>();
		}

		mav.addObject("storeId", storeId);
		mav.addObject("startDate", startDate);
		mav.addObject("endDate", endDate);
		mav.addObject("cookerDishStatMapByCookerName",
				cookerDishStatMapByCookerName);
		return mav;
	}

	// 充值/消费记录
	@RequestMapping("balanceRecordsReporting")
	public ModelAndView balanceRecordsReporting(
			@RequestParam(value = "storeId") long storeId,
			@RequestParam(value = "startDate", required = false) String startDate,
			@RequestParam(value = "endDate", required = false) String endDate)
			throws Exception {

		boolean isAuthority = verifyAuthority(storeId);

		if (!isAuthority)
			throw new ServiceException(ServiceException.NOT_AUTHORUTY);

		ModelAndView mav = new ModelAndView();
		mav.setViewName("balanceRecordsReporting");
		List<BalanceOperationLog> operationLogs = null;

		if (startDate != null && (!"".equals(startDate))
				&& (endDate != null && !"".equals(endDate))) {

			long startTimeLong = 1;
			long endTimeLong = 100;

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			try {
				startTimeLong = sdf.parse(startDate + " 00:00:00").getTime();
				endTimeLong = sdf.parse(endDate + " 23:59:59").getTime();
			} catch (ParseException e) {
				e.printStackTrace();
			}
			operationLogs = this._balanceOperationLogService
					.getDailyBalanceRecordListByStoreId(storeId, startTimeLong,
							endTimeLong);
		} else {
			operationLogs = new ArrayList<BalanceOperationLog>();
		}

		mav.addObject("storeId", storeId);
		mav.addObject("startDate", startDate);
		mav.addObject("endDate", endDate);
		mav.addObject("operationLogs", operationLogs);
		return mav;
	}

	@RequestMapping("memberBalanceReporting")
	public ModelAndView memberBalanceReporting(
			@RequestParam(value = "storeId") long storeId) throws Exception {

		boolean isAuthority = verifyAuthority(storeId);

		if (!isAuthority)
			throw new ServiceException(ServiceException.NOT_AUTHORUTY);

		ModelAndView mav = new ModelAndView();
		mav.setViewName("memberBalanceReporting");
		List<MemberBalanceStat> memberBalanceStats = _reportingService
				.getMemberBalanceStatsByStoreId(storeId);

		mav.addObject("storeId", storeId);
		mav.addObject("memberBalanceStats", memberBalanceStats);
		return mav;
	}

	// 会员消费充值明细
	@RequestMapping("memberOperationLogs")
	public ModelAndView memberOperationLogs(
			@RequestParam(value = "storeId") long storeId,
			@RequestParam(value = "memberId") long memberId,
			@RequestParam(value = "operationType", defaultValue = "0", required = false) int operationType,
			@RequestParam(value = "startDate", required = false) String startDate,
			@RequestParam(value = "endDate", required = false) String endDate)
			throws Exception {

		boolean isAuthority = verifyAuthority(storeId);

		if (!isAuthority)
			throw new ServiceException(ServiceException.NOT_AUTHORUTY);

		ModelAndView mav = new ModelAndView();
		mav.setViewName("memberOperationLogs");

		List<BalanceOperationLog> operationLogs = new ArrayList<BalanceOperationLog>();
		if (operationType == 0) {
			operationLogs = this._balanceOperationLogService
					.getMemberAllOperationLogsByUserAccountId(memberId);
		} else if (operationType == 1) {
			operationLogs = this._balanceOperationLogService
					.getMemberRechargeOperationLogsByUserAccountId(memberId);
		} else if (operationType == 2) {
			operationLogs = this._balanceOperationLogService
					.getMemberExpenditureOperationLogsByUserAccountId(memberId);
		}

		mav.addObject("storeId", storeId);
		mav.addObject("startDate", startDate);
		mav.addObject("endDate", endDate);
		mav.addObject("operationLogs", operationLogs);
		return mav;
	}

	// 7,DishOrder明细
	@RequestMapping("dishOrderWithItems")
	public ModelAndView dishOrderWithItems(
			@RequestParam(value = "dishOrderId") long dishOrderId) {

		ModelAndView mav = new ModelAndView();
		mav.setViewName("dishOrderWithItems");

		DishOrder dishOrder = this._reportingService
				.getDishOrderByID(dishOrderId);
		mav.addObject("dishOrder", dishOrder);
		mav.addObject("dishOrderId", dishOrderId);

		return mav;
	}

	@RequestMapping("cancelOrderItemsReporting")
	public ModelAndView cancelOrderItemsReporting(@RequestParam long storeId,
			@RequestParam(value = "startDate") String startDate,
			@RequestParam(value = "endDate") String endDate) throws Exception {

		boolean isAuthority = verifyAuthority(storeId);

		if (!isAuthority)
			throw new ServiceException(ServiceException.NOT_AUTHORUTY);

		ModelAndView mav = new ModelAndView();
		mav.setViewName("cancelOrderItemsReporting");

		return mav;
	}

	// 销售统计

	@RequestMapping("dishCategorySellStats")
	public ModelAndView dishCategorySellStats(
			@RequestParam(value = "storeId") long storeId,
			@RequestParam(value = "startDate") String startDate,
			@RequestParam(value = "endDate") String endDate) throws Exception {

		boolean isAuthority = verifyAuthority(storeId);

		if (!isAuthority)
			throw new ServiceException(ServiceException.NOT_AUTHORUTY);

		ModelAndView mav = new ModelAndView();
		mav.setViewName("dishCategorySellStats");
		List<SellStat> sellStatObject = null;

		if ((!"".equals(startDate)) && (!"".equals(endDate))) {

			long startTimeLong = 0;
			long endTimeLong = 0;
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			try {
				startTimeLong = sdf.parse(startDate + " 00:00:00").getTime();
				endTimeLong = sdf.parse(endDate + " 23:59:59").getTime();
			} catch (java.text.ParseException e) {
				e.printStackTrace();
			}

			sellStatObject = this._reportingService.getDishCategorySellStats(
					storeId, startTimeLong, endTimeLong, false);
			if (!(sellStatObject.size() > 0)) {
				sellStatObject = new ArrayList<SellStat>();
			}
		} else {
			sellStatObject = new ArrayList<SellStat>();
		}

		mav.addObject("sellStatObject", sellStatObject);
		mav.addObject("storeId", storeId);
		mav.addObject("startDate", startDate);
		mav.addObject("endDate", endDate);

		return mav;
	}

	@RequestMapping("deskNoSellStats")
	public ModelAndView deskNoSellStats(
			@RequestParam(value = "storeId") long storeId,
			@RequestParam(value = "startDate") String startDate,
			@RequestParam(value = "endDate") String endDate) throws Exception {

		boolean isAuthority = verifyAuthority(storeId);

		if (!isAuthority)
			throw new ServiceException(ServiceException.NOT_AUTHORUTY);

		ModelAndView mav = new ModelAndView();
		mav.setViewName("deskNoSellStats");

		List<SellStat> sellStatObject = null;
		if ((!"".equals(startDate)) && (!"".equals(endDate))) {
			long startTime = 0;
			long endTime = 0;

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

			try {
				startTime = sdf.parse(startDate + " 00:00:00").getTime();
				endTime = sdf.parse(endDate + " 23:59:59").getTime();
			} catch (java.text.ParseException e) {
				e.printStackTrace();
			}

			sellStatObject = this._reportingService.getDeskSellStats(storeId,
					startTime, endTime);
		} else {
			sellStatObject = new ArrayList<SellStat>();
		}

		mav.addObject("storeId", storeId);
		mav.addObject("startDate", startDate);
		mav.addObject("endDate", endDate);
		mav.addObject("deskNoSellStatObject", sellStatObject);

		return mav;
	}

	@RequestMapping("dishSellStats")
	public ModelAndView dishSellStats(
			@RequestParam(value = "storeId") long storeId,
			@RequestParam(value = "dishCategoryId") long dishCategoryId,
			@RequestParam(value = "startDate") String startDate,
			@RequestParam(value = "endDate") String endDate) throws Exception {

		boolean isAuthority = verifyAuthority(storeId);

		if (!isAuthority)
			throw new ServiceException(ServiceException.NOT_AUTHORUTY);

		ModelAndView mav = new ModelAndView();
		mav.setViewName("dishSellStats");
		long startTime = 0;
		long endTime = 0;
		List<SellStat> sellStatObject = null;

		SimpleDateFormat simpleDateFormat = new SimpleDateFormat(
				"yyyy-MM-dd HH:mm:ss");

		try {
			startTime = simpleDateFormat.parse(startDate + " 00:00:00")
					.getTime();
			endTime = simpleDateFormat.parse(endDate + " 23:59:59").getTime();
		} catch (java.text.ParseException e) {
			e.printStackTrace();
		}

		sellStatObject = this._reportingService.getDishSellStats(storeId,
				dishCategoryId, startTime, endTime);
		if (!(sellStatObject.size() > 0)) {
			sellStatObject = new ArrayList<SellStat>();
		}

		mav.addObject("sellStatObject", sellStatObject);
		mav.addObject("storeId", storeId);
		mav.addObject("startDate", startDate);
		mav.addObject("endDate", endDate);
		mav.addObject("dishCategoryId", dishCategoryId);
		return mav;
	}

	@RequestMapping("dishSellDetail")
	public ModelAndView dishSellDetail(
			@RequestParam(value = "storeId") long storeId,
			@RequestParam(value = "dishId") long dishId,
			@RequestParam(value = "dishCategoryId") long dishCategoryId,
			@RequestParam(value = "startDate") String startDate,
			@RequestParam(value = "endDate") String endDate) throws Exception {

		boolean isAuthority = verifyAuthority(storeId);

		if (!isAuthority)
			throw new ServiceException(ServiceException.NOT_AUTHORUTY);

		ModelAndView mav = new ModelAndView();
		mav.setViewName("dishSellDetail");
		long startTime = 0;
		long endTime = 0;

		SimpleDateFormat simpleDateFormat = new SimpleDateFormat(
				"yyyy-MM-dd HH:mm:ss");

		try {
			startTime = simpleDateFormat.parse(startDate + " 00:00:00")
					.getTime();
			endTime = simpleDateFormat.parse(endDate + " 23:59:59").getTime();
		} catch (java.text.ParseException e) {
			e.printStackTrace();
		}

		List<OrderItem> sellStatObject = this._reportingService
				.getOrderItemListByDishID(storeId, dishId, startTime, endTime);

		mav.addObject("sellStatObject", sellStatObject);
		mav.addObject("storeId", storeId);
		mav.addObject("dishCategoryId", dishCategoryId);
		mav.addObject("startDate", startDate);
		mav.addObject("endDate", endDate);
		return mav;
	}

	@RequestMapping("employeeSellStats")
	public ModelAndView employeeSellStats(
			@RequestParam(value = "storeId") long storeId,
			@RequestParam(value = "startDate") String startDate,
			@RequestParam(value = "endDate") String endDate) throws Exception {

		boolean isAuthority = verifyAuthority(storeId);

		if (!isAuthority)
			throw new ServiceException(ServiceException.NOT_AUTHORUTY);

		ModelAndView mav = new ModelAndView();
		mav.setViewName("employeeSellStats");

		List<SellStat> sellStatObject = null;
		if ((!"".equals(startDate)) && (!"".equals(endDate))) {
			long startTime = 0;
			long endTime = 0;

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

			try {
				startTime = sdf.parse(startDate + " 00:00:00").getTime();
				endTime = sdf.parse(endDate + " 23:59:59").getTime();
			} catch (java.text.ParseException e) {
				e.printStackTrace();
			}

			sellStatObject = this._reportingService.getEmployeeSellStats(
					storeId, startTime, endTime);
		} else {
			sellStatObject = new ArrayList<SellStat>();
		}

		mav.addObject("storeId", storeId);
		mav.addObject("startDate", startDate);
		mav.addObject("endDate", endDate);
		mav.addObject("employeeSellStatObject", sellStatObject);

		return mav;
	}

	@RequestMapping("employeeSellDetail")
	public ModelAndView employeeSellDetail(
			@RequestParam(value = "storeId") long storeId,
			@RequestParam(value = "employeeId") long employeeId,
			@RequestParam(value = "startDate") String startDate,
			@RequestParam(value = "endDate") String endDate) throws Exception {

		boolean isAuthority = verifyAuthority(storeId);

		if (!isAuthority)
			throw new ServiceException(ServiceException.NOT_AUTHORUTY);

		ModelAndView mav = new ModelAndView();
		mav.setViewName("employeeSellDetail");
		long startTime = 0;
		long endTime = 0;

		SimpleDateFormat simpleDateFormat = new SimpleDateFormat(
				"yyyy-MM-dd HH:mm");

		try {
			startTime = simpleDateFormat.parse(startDate + " 00:00:00")
					.getTime();
			endTime = simpleDateFormat.parse(endDate + " 23:59:59").getTime();
		} catch (java.text.ParseException e) {
			e.printStackTrace();
		}

		Employee employee = this._userService.getEmployeeById(employeeId);

		List<OrderItem> sellStatObject = this._reportingService
				.getOrderItemListByEmployeeID(employeeId, startTime, endTime);

		mav.addObject("employee", employee);
		mav.addObject("sellStatObject", sellStatObject);
		mav.addObject("storeId", storeId);
		mav.addObject("startDate", startDate);
		mav.addObject("endDate", endDate);
		return mav;
	}

	@RequestMapping("departmentSellStat")
	public ModelAndView departmentSellStat(
			@RequestParam(value = "storeId") long storeId,
			@RequestParam(value = "departmentValue") String departmentValue,
			@RequestParam(value = "startDate") String startDate,
			@RequestParam(value = "endDate") String endDate) throws Exception {

		boolean isAuthority = verifyAuthority(storeId);

		if (!isAuthority)
			throw new ServiceException(ServiceException.NOT_AUTHORUTY);

		ModelAndView mav = new ModelAndView();
		mav.setViewName("departmentSellStat");

		HashMap<Long, String> departmentMap = new HashMap<Long, String>();
		departmentMap = this._reportingService.getDepartmentByStoreId(storeId);

		List<SellStat> departmentSellStatsObject = null;
		if ((!"".equals(startDate)) && (!"".equals(endDate))) {
			long departmentLong = 0;
			long startTime = 0;
			long endTime = 0;
			SimpleDateFormat sfy = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			try {
				departmentLong = Long.parseLong(departmentValue);
				startTime = sfy.parse(startDate + " 00:00:00").getTime();
				endTime = sfy.parse(endDate + " 23:59:59").getTime();
			} catch (Exception e) {
				e.printStackTrace();
			}

			if (!"".equals(departmentValue)) {
				departmentSellStatsObject = this._reportingService
						.getDepartmentSellStats(storeId, startTime, endTime,
								departmentLong);

			} else {
				departmentSellStatsObject = new ArrayList<SellStat>();
			}
		} else {
			departmentSellStatsObject = new ArrayList<SellStat>();
		}

		mav.addObject("departmentObjects", departmentMap);
		mav.addObject("departmentSellStatsObject", departmentSellStatsObject);
		mav.addObject("storeId", storeId);
		mav.addObject("departmentValue", departmentValue);
		mav.addObject("startDate", startDate);
		mav.addObject("endDate", endDate);

		return mav;
	}

	@RequestMapping("dishOrderOperationLogs")
	public ModelAndView dishOrderOperationLogs(
			@RequestParam(value = "storeId") long storeId,
			@RequestParam(value = "startDate", required = false) String startDate,
			@RequestParam(value = "endDate", required = false) String endDate)
			throws Exception {

		boolean isAuthority = verifyAuthority(storeId);

		if (!isAuthority)
			throw new ServiceException(ServiceException.NOT_AUTHORUTY);

		ModelAndView mav = new ModelAndView();
		mav.setViewName("dishOrderOperationLogs");
		List<OperationLog> operationLogs = null;

		if (startDate != null && (!"".equals(startDate))
				&& (endDate != null && !"".equals(endDate))) {

			long startTimeLong = 1;
			long endTimeLong = 100;

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			try {
				startTimeLong = sdf.parse(startDate + " 00:00:00").getTime();
				endTimeLong = sdf.parse(endDate + " 23:59:59").getTime();
			} catch (ParseException e) {
				e.printStackTrace();
			}
			operationLogs = this._operationLogService
					.getdishOrderOperationLogsByStoreIdAndTime(storeId,
							startTimeLong, endTimeLong);
		} else {
			operationLogs = new ArrayList<OperationLog>();
		}

		mav.addObject("storeId", storeId);
		mav.addObject("startDate", startDate);
		mav.addObject("endDate", endDate);
		mav.addObject("operationLogs", operationLogs);
		return mav;
	}

	@RequestMapping("couponOperationLogs")
	public ModelAndView couponOperationLogs(
			@RequestParam(value = "storeId") long storeId,
			@RequestParam(value = "startDate", required = false) String startDate,
			@RequestParam(value = "endDate", required = false) String endDate)
			throws Exception {

		boolean isAuthority = verifyAuthority(storeId);

		if (!isAuthority)
			throw new ServiceException(ServiceException.NOT_AUTHORUTY);

		ModelAndView mav = new ModelAndView();
		mav.setViewName("couponOperationLogs");
		List<CouponOperationLog> operationLogs = null;

		if (startDate != null && (!"".equals(startDate))
				&& (endDate != null && !"".equals(endDate))) {

			long startTimeLong = 1;
			long endTimeLong = 100;

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			try {
				startTimeLong = sdf.parse(startDate + " 00:00:00").getTime();
				endTimeLong = sdf.parse(endDate + " 23:59:59").getTime();
			} catch (ParseException e) {
				e.printStackTrace();
			}
			operationLogs = this._couponOperationLogService
					.getDailyBalanceRecordListByStoreId(storeId, startTimeLong,
							endTimeLong);
		} else {
			operationLogs = new ArrayList<CouponOperationLog>();
		}

		mav.addObject("storeId", storeId);
		mav.addObject("startDate", startDate);
		mav.addObject("endDate", endDate);
		mav.addObject("operationLogs", operationLogs);
		return mav;
	}

	@RequestMapping("materialRecordStat")
	public ModelAndView materialRecordStat(
			@RequestParam(value = "storeId") long storeId,
			@RequestParam(value = "startDate") String startDate,
			@RequestParam(value = "endDate") String endDate) throws Exception {

		boolean isAuthority = verifyAuthority(storeId);

		if (!isAuthority)
			throw new ServiceException(ServiceException.NOT_AUTHORUTY);

		ModelAndView mav = new ModelAndView();
		mav.setViewName("materialRecordStat");

		List<MaterialRecord> sellStats = null;
		if ((!"".equals(startDate)) && (!"".equals(endDate))) {
			long startTime = 0;
			long endTime = 0;

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

			try {
				startTime = sdf.parse(startDate + " 00:00:00").getTime();
				endTime = sdf.parse(endDate + " 23:59:59").getTime();
			} catch (java.text.ParseException e) {
				e.printStackTrace();
			}

			sellStats = this._reportingService
					.getMaterialRecordByStoreIdAndTime(storeId, startTime,
							endTime);
		} else {
			sellStats = new ArrayList<MaterialRecord>();
		}

		mav.addObject("storeId", storeId);
		mav.addObject("startDate", startDate);
		mav.addObject("endDate", endDate);
		mav.addObject("materialRecordSellStats", sellStats);

		return mav;
	}
}

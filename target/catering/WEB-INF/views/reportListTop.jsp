<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>

<div id="reportLists">
	<br /> <a href="../reporting/currentClass?storeId=${storeId}"><span
		id="stringCurrentClass">当班报表</span></a> <a
		href="../reporting/classReporting?storeId=${storeId}"><span
		id="stringClassReporting">交班报表</span></a> <a
		href="../reporting/classesInTimeRange?startDate=&endDate=&storeId=${storeId}"><span
		id="stringClassesInTimeRange">汇总交班报表</span></a> <a
		href="../reporting/dailyReporting?dateToReport=&storeId=${storeId}"><span
		id="stringDailyReporting">每日报表</span></a> <a
		href="../reporting/timeRangeReporting?startDate=&endDate=&storeId=${storeId}"><span
		id="TimeRangeReporting">时段报表</span></a> <a
		href="../reporting/cookerDishReporting?storeId=${storeId}"><span
		id="stringCookerDishReporting">厨师菜品报表</span></a> <a
		href="../reporting/balanceRecordsReporting?&storeId=${storeId}"><span
		id="stringBalanceRecordsReporting">会员充值/消费记录</span></a> <a
		href="../reporting/memberBalanceReporting?&storeId=${storeId}"><span
		id="stringMemberBalanceReporting">会员余额</span></a> <a
		href="../reporting/dishOrderOperationLogs?&storeId=${storeId}"><span
		id="stringDishOrderOperationLogs">订单操作记录</span></a> <a
		href="../reporting/couponOperationLogs?&storeId=${storeId}"><span
		id="stringDishOrderOperationLogs">优惠券操作记录</span></a>
	<button onclick="window.print()">打印页面信息</button>
</div>
<script type="text/javascript">
	function checkInput(thisObject) {
		var startDate = thisObject.form.startDate.value;
		var endDate = thisObject.form.endDate.value;
		if (startDate == "") {
			alert($.i18n.prop('string_qingXuanZeKaiShiRiQi'));
			return;
		}
		if (endDate == "") {
			alert($.i18n.prop('string_qingXuanZeJieShuRiQi'));
			return;
		}
		var startDateArr = startDate.split('-');
		var endDateArr = endDate.split('-');
		var startDateLong = parseFloat(startDateArr[0] + startDateArr[1]
				+ startDateArr[2]);
		var endDateLong = parseFloat(endDateArr[0] + endDateArr[1]
				+ endDateArr[2]);
		if (startDateLong > endDateLong) {
			alert($.i18n.prop('string_kaiShiRiQiDaYuJieShuRiQi'));
			return;
		}
		thisObject.form.submit();
	}

	function checkInputOneDay(thisObject) {
		if (thisObject.form.dateToReport.value == "") {
			alert("请选择日期");
			return;
		}
		thisObject.form.submit();

	}
</script>

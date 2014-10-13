<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>员工销售报表</title>
<link rel="stylesheet" href="../css/reports/sell_stats.css">
<script type="text/javascript" src="../js/vendor/jquery-1.10.1.min.js"></script>
<script type="text/javascript"
	src="../js/vendor/jquery.i18n.properties-1.0.9.js"></script>
<script type="text/javascript" src="../js/vendor/Calendar3.js"></script>
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
</script>
</head>
<body>
	<div>
		<%@ include file="sellStatListTop.jsp"%>
		<h3>员工销售统计</h3>
		<div>
			<form action="employeeSellStats" method="GET">
				<input type="hidden" value="${storeId}" name="storeId" id="storeId" />
				<input name="startDate" value="${startDate}" type="text"
					id="startDate" size="10" maxlength="10"
					onclick="new Calendar().show(this);" readonly="readonly" /> <span
					id="until">至</span> <input name="endDate" type="text" id="endDate"
					size="10" maxlength="10" onclick="new Calendar().show(this);"
					readonly="readonly" value="${endDate}" /> <input type="button"
					onclick="checkInput(this)" value="查看员工销售统计" />
			</form>
		</div>
		<br /> <input type="button" value="导出当前报表"
			onclick="window.location.href='getSellStatCSVFile?storeId=${storeId}&sellStatType=employeeSellStats&startDate=${startDate}&endDate=${endDate}'"></input>
		<table id="employeeStatsTable" summary="">
			<thead>
				<tr id="employeesStatsTr">
					<th>工号</th>
					<th>姓名</th>
					<th>总数量</th>
					<th>总结算价</th>
				</tr>
			</thead>
			<tbody id="employeeStatsTBody">
				<c:forEach items="${employeeSellStatObject}" var="employeeSellStat">
					<tr id="DishOrderTr">
						<td>${employeeSellStat.workNumber}</td>
						<td><c:choose>
								<c:when test="${employeeSellStat.amount > 0 }">
									<a
										href="employeeSellDetail?storeId=${storeId}&employeeId=${employeeSellStat.itemID}&startDate=${startDate}&endDate=${endDate}">${employeeSellStat.itemName}</a>
								</c:when>
								<c:otherwise>${employeeSellStat.itemName}</c:otherwise>
							</c:choose></td>
						<td><fmt:formatNumber value="${employeeSellStat.amount}"
								pattern="#.##" maxFractionDigits="2"></fmt:formatNumber></td>
						<td><fmt:formatNumber value="${employeeSellStat.totalPrice}"
								pattern="#.##" maxFractionDigits="2"></fmt:formatNumber></td>
					</tr>
				</c:forEach>
			</tbody>
		</table>
	</div>
	<script type="text/javascript" src="../js/tableSort.js"></script>
	<script type="text/javascript">
		new tableSort('employeeStatsTable', 1, 2, 999, 'up', 'down', 'hov');
	</script>
</body>
</html>
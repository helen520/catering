<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>原料消耗统计表</title>
<link rel="stylesheet" href="../css/reports/sell_stats.css">
<script type="text/javascript" src="../js/vendor/jquery-1.10.1.min.js"></script>
<script type="text/javascript"
	src="../js/vendor/jquery.i18n.properties-1.0.9.js"></script>
<script type="text/javascript" src="../js/vendor/Calendar3.js"></script>
</head>
<body>
	<div>
		<%@ include file="sellStatListTop.jsp"%>
		<h3>原料消耗统计</h3>
		<div>
			<form action="materialRecordStat" method="GET">
				<input type="hidden" value="${storeId}" name="storeId" id="storeId" />
				<input name="startDate" value="${startDate}" type="text"
					id="startDate" size="10" maxlength="10"
					onclick="new Calendar().show(this);" readonly="readonly" /> <span
					id="until">至</span> <input name="endDate" type="text" id="endDate"
					size="10" maxlength="10" onclick="new Calendar().show(this);"
					readonly="readonly" value="${endDate}" /> <input type="button"
					onclick="checkInput(this)" value="原料消耗统计" />
			</form>
		</div>
		<br /> <input type="button" value="导出当前报表"
			onclick="window.location.href='getSellStatCSVFile?storeId=${storeId}&sellStatType=materialRecordSellStat&startDate=${startDate}&endDate=${endDate}'"></input>
		<table id="materialRecordStatsTable" summary="">
			<thead>
				<tr id="materialRecordStatsTr">
					<th>ID</th>
					<th>交班时间</th>
					<th>原料名称</th>
					<th>总消耗重量(克)</th>
				</tr>
			</thead>
			<tbody id="materialRecordStatsTBody">
				<c:forEach items="${materialRecordSellStats}" var="stat">
					<tr id="DishOrderTr">
						<td>${stat.id}</td>
						<td>${stat.createTimeStr}</td>
						<td>${stat.materialName}</td>
						<td>${stat.weight}</td>
					</tr>
				</c:forEach>
			</tbody>
		</table>
	</div>
</body>
</html>
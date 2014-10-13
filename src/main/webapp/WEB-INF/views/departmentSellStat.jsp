<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>部门销售统计</title>
<script type="text/javascript" src="../js/vendor/jquery-1.10.1.min.js"></script>
<script type="text/javascript"
	src="../js/vendor/jquery.i18n.properties-1.0.9.js"></script>
<script type="text/javascript" src="../js/vendor/Calendar3.js"></script>
<style>
body {
	width: 800px;
	margin: 0px auto;
	padding-bottom: 200px;
}

.title {
	padding: 20px;
}

table {
	border: 1px solid #999;
	border-spacing: 0px;
	text-align: center;
}

th {
	border: 1px solid #999;
	padding: 2px;
	background-color: #DDD;
}

td {
	border: 1px solid #999;
	padding: 2px;
}

input[type=text] {
	width: 100px;
}
</style>
</head>
<body>
	<%@ include file="sellStatListTop.jsp"%>
	<h3>部门销售统计</h3>
	<form action="departmentSellStat" method="GET">
		<input type="hidden" value="${storeId}" name="storeId" id="storeId" />
		<select id="departmentValue" name="departmentValue">
			<c:forEach items="${departmentObjects}" var="departments">
				<c:set var="selectedOption"
					value="${departmentValue==departments.key?\"selected='selected'\":\"\"}"></c:set>
				<option value="${departments.key}" ${selectedOption}>${departments.value}</option>
			</c:forEach>
		</select> <span> <input name="startDate" value="${startDate}"
			type="text" id="startDate" size="10" maxlength="10"
			onclick="new Calendar().show(this);" readonly="readonly">
		</span> <span>至 <input name="endDate" value="${endDate}" type="text"
			id="endDate" size="10" maxlength="10"
			onclick="new Calendar().show(this);" readonly="readonly" />
		</span><input type="button" onclick="checkInput(this)" value="查看部门销售统计" />
	</form>
	<br>
	<input type="button" value="导出当前报表"
		onclick="window.location.href='getSellStatCSVFile?storeId=${storeId}&sellStatType=departmentSellStat&startDate=${startDate}&endDate=${endDate}&departmentValue=${departmentValue}'"></input>
	<table id="DepartmentSellStatsTable" summary="" style="width: 800px;">
		<thead>
			<tr id="DepartmentSellStatsTr">
				<th>名称</th>
				<th>单位</th>
				<th>数量</th>
				<th>单价</th>
				<th>标价金额</th>
				<th>加收</th>
				<th>原价</th>
				<th>折后价</th>
				<th>服务费</th>
				<th>实收金额</th>
			</tr>
		</thead>
		<tbody id="DepartmentSellStatsTBody">
			<c:forEach items="${departmentSellStatsObject}"
				var="departmentSellStat">
				<tr id="DishOrderTr">
					<td>${departmentSellStat.itemName}</td>
					<td>${departmentSellStat.unit}</td>
					<td><fmt:formatNumber value="${departmentSellStat.amount}"
							pattern="#.##" maxFractionDigits="2"></fmt:formatNumber></td>
					<td><fmt:formatNumber value="${departmentSellStat.unitPrice}"
							pattern="#.##" maxFractionDigits="2"></fmt:formatNumber></td>
					<td><fmt:formatNumber
							value="${departmentSellStat.totalOrgPrice-departmentSellStat.totalExtraFee}"
							pattern="#.##" maxFractionDigits="2"></fmt:formatNumber></td>
					<td><fmt:formatNumber
							value="${departmentSellStat.totalExtraFee}" pattern="#.##"
							maxFractionDigits="2"></fmt:formatNumber></td>
					<td><fmt:formatNumber
							value="${departmentSellStat.totalOrgPrice}" pattern="#.##"
							maxFractionDigits="2"></fmt:formatNumber></td>
					<td><fmt:formatNumber
							value="${departmentSellStat.totalDiscountedPrice}" pattern="#.##"
							maxFractionDigits="2"></fmt:formatNumber></td>
					<td><fmt:formatNumber
							value="${departmentSellStat.totalServiceFee}" pattern="#.##"
							maxFractionDigits="2"></fmt:formatNumber></td>
					<td><fmt:formatNumber value="${departmentSellStat.totalPrice}"
							pattern="#.##" maxFractionDigits="2"></fmt:formatNumber></td>
				</tr>
			</c:forEach>
		</tbody>
	</table>
</body>
</html>
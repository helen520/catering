<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>类别销售统计</title>
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

table {
	border: 1px solid #999;
	border-spacing: 0px;
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
	<div id="ReportTablesDiv" style="width: 800px">
		<%@ include file="sellStatListTop.jsp"%>
		<h3>类别销售统计</h3>
		<div>
			<form action="dishCategorySellStats" method="GET">
				<input type="hidden" value="${storeId}" name="storeId" id="storeId" />
				<input name="startDate" value="${startDate}" type="text"
					id="startDate" size="10" maxlength="10"
					onclick="new Calendar().show(this);" readonly="readonly" /> <span
					id="until">至</span> <input name="endDate" type="text" id="endDate"
					size="10" maxlength="10" onclick="new Calendar().show(this);"
					readonly="readonly" value="${endDate}" /> <input type="button"
					onclick="checkInput(this)" value="查看类别销售统计" />
			</form>
		</div>
		<br /> <input type="button" value="导出当前报表"
			onclick="window.location.href='getSellStatCSVFile?storeId=${storeId}&sellStatType=dishCategorySellStats&startDate=${startDate}&endDate=${endDate}'"></input>
		<table id="DishCategorySellStatsTable" summary="">
			<thead>
				<tr id="DishCategorySellStatsTr">
					<th>类名</th>
					<th>出品数</th>
					<th>折前总价</th>
					<th>折后总价</th>
				</tr>
			</thead>
			<tbody id="DishCategorySellStatsTBody">
				<c:forEach items="${sellStatObject}" var="sellStats"
					varStatus="sellStatsStatus">
					<c:if test="${sellStats.itemName!=''}">
						<tr>
							<td><c:choose>
									<c:when test="${sellStats.amount>0}">

										<a
											href='dishSellStats?storeId=${storeId}&dishCategoryId=${sellStats.itemID}&startDate=${startDate}&endDate=${endDate}'>
											${sellStats.itemName}</a>
									</c:when>
									<c:otherwise>
									${sellStats.itemName}
									</c:otherwise>
								</c:choose></td>
							<td><fmt:formatNumber value="${sellStats.amount}"
									pattern="#.##" maxFractionDigits="2"></fmt:formatNumber></td>
							<td><fmt:formatNumber value="${sellStats.totalOrgPrice}"
									pattern="#.##" maxFractionDigits="2"></fmt:formatNumber></td>
							<td><fmt:formatNumber value="${sellStats.totalPrice}"
									pattern="#.##" maxFractionDigits="2"></fmt:formatNumber></td>
						</tr>
					</c:if>
				</c:forEach>
			</tbody>
		</table>
	</div>
</body>
</html>
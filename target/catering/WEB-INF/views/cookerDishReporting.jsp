<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>厨师菜品报表</title>
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
	border: 1px solid #000000;
	border-spacing: 0px;
}

th {
	border: 1px solid #000000;
	padding: 2px;
}

td {
	border: 1px solid #000000;
	padding: 2px;
}

input[type=text] {
	width: 100px;
}
</style>
</head>
<body>
	<div id="cookerDishDiv" style="width: 800px;">
		<%@ include file="reportListTop.jsp"%>
		<div>
			<form action="cookerDishReporting" method="GET">
				<h3>厨师菜品报表</h3>
				<input type="hidden" value="${storeId }" name="storeId" id="storeId" />
				<span> <input type="text" name="startDate"
					value="${ startDate }" id="startDate" size="10" maxlength="10"
					onclick="new Calendar().show(this);" readonly="readonly" />
				</span> <span id="until">至</span> <span> <input type="text"
					name="endDate" value="${ endDate }" id="endDate" size="10"
					maxlength="10" onclick="new Calendar().show(this);"
					readonly="readonly" />
				</span> <input type="button" value="提交" onclick="checkInput(this)" />
			</form>
		</div>
		<br> <input type="button" value="导出当前报表"
			onclick="window.location.href='getReportingCSVFile?storeId=${storeId}&reportType=cookerDishReporting&startDate=${startDate}&endDate=${endDate}'"></input>
		<table id="cookerDishTable" summary="" style="width: 800px;">
			<thead>
				<tr id="cookerDishTr">
					<th>厨师</th>
					<th>菜品名称</th>
					<th>总出品数</th>
					<th>菜品销售总额</th>
					<th>小计</th>
				</tr>
			</thead>
			<tbody>

				<c:forEach items="${cookerDishStatMapByCookerName}" var="cookerDish"
					varStatus="cookerDishStatMapByCookerNameStat">

					<c:forEach items="${cookerDish.value}" var="cookerDishVal"
						varStatus="cookerDishStat">
						<c:choose>
							<c:when test="${((cookerDishStat.index))<1}">
								<tr>
									<td rowspan="${fn:length(cookerDish.value)}">${cookerDish.key}</td>
									<td>${cookerDishVal.dishName}</td>
									<td><fmt:formatNumber value="${cookerDishVal.dishAmount}"
											pattern="#.##" maxFractionDigits="2"></fmt:formatNumber></td>
									<td><fmt:formatNumber value="${cookerDishVal.grossSales}"
											pattern="#.##" maxFractionDigits="2"></fmt:formatNumber></td>
									<td rowspan="${fn:length(cookerDish.value)}"><c:set
											var="totalPrice" value="0"></c:set> <c:forEach
											items="${cookerDish.value}" var="cookerDishValPrice">
											<c:set var="totalPrice"
												value="${totalPrice+cookerDishValPrice.grossSales}"></c:set>

										</c:forEach> <fmt:formatNumber value="${totalPrice}" pattern="#.##"
											maxFractionDigits="2"></fmt:formatNumber></td>
								</tr>
							</c:when>
							<c:otherwise>
								<tr>
									<td>${cookerDishVal.dishName}</td>
									<td>${cookerDishVal.dishAmount}</td>
									<td>${cookerDishVal.grossSales}</td>
								</tr>

							</c:otherwise>
						</c:choose>
					</c:forEach>





				</c:forEach>
			</tbody>
		</table>

	</div>

</body>
</html>
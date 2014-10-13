<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>会员充值记录</title>
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
	<div id="ReportTablesDiv" style="width: 800px;">
		<%@ include file="reportListTop.jsp"%>
		<div>
			<h3>会员充值记录</h3>
		</div>
		<br /> <input type="button" value="导出当前报表"
			onclick="window.location.href='getReportingCSVFile?storeId=${storeId}&reportType=memberBalanceReporting'"></input>
		<table id="memberBalabceTable" summary=""
			style="width: 800px; text-align: center;">
			<thead>
				<tr id="memberBalabceTr">
					<th>序号</th>
					<th>会员卡号</th>
					<th>领卡时间</th>
					<th>会员姓名</th>
					<th>会员电话</th>
					<th>当前余额</th>
					<th>总充值金额</th>
					<th>总消费金额</th>
				</tr>
			</thead>
			<tbody>
				<c:set var="allBalance" value="0"></c:set>
				<c:set var="allTotalRechargedAmount" value="0"></c:set>
				<c:set var="allTotalExpenditure" value="0"></c:set>
				<c:forEach items="${memberBalanceStats}" var="stat" varStatus="sort">
					<c:set var="allBalance" value="${allBalance+stat.balance }"></c:set>
					<c:set var="allTotalRechargedAmount"
						value="${allTotalRechargedAmount+stat.totalRechargedAmount }"></c:set>
					<c:set var="allTotalExpenditure"
						value="${allTotalExpenditure+stat.totalExpenditure }"></c:set>
					<tr>
						<td>${sort.index + 1}</td>
						<td>${stat.memberCardNo}</td>
						<td>${stat.createTimeStr}</td>
						<td>${stat.name}</td>
						<td>${stat.mobilePhone}</td>
						<td>${stat.balance}</td>
						<td><c:choose>
								<c:when test="${stat.totalRechargedAmount>0}">
									<a style="cursor: pointer; text-decoration: none;"
										href="memberOperationLogs?storeId=${storeId}&memberId=${stat.memberId}&operationType=1">${stat.totalRechargedAmount}</a>
								</c:when>
								<c:otherwise>${stat.totalRechargedAmount}</c:otherwise>
							</c:choose></td>
						<td><c:choose>
								<c:when test="${stat.totalRechargedAmount>0}">
									<a style="cursor: pointer; text-decoration: none;"
										href="memberOperationLogs?storeId=${storeId}&memberId=${stat.memberId}&operationType=2">${stat.totalExpenditure}</a>
								</c:when>
								<c:otherwise>${stat.totalExpenditure}</c:otherwise>
							</c:choose></td>
					</tr>
				</c:forEach>
				<tr style="font-weight: bold;">
					<td>全部</td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td>${allBalance }</td>
					<td>${allTotalRechargedAmount }</td>
					<td>${allTotalExpenditure }</td>
				</tr>
			</tbody>
		</table>
	</div>
</body>
</html>
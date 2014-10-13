<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>会员充值/消费记录</title>
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
			<form action="balanceRecordsReporting" method="GET">
				<h3>会员充值/消费记录</h3>

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
			onclick="window.location.href='getReportingCSVFile?storeId=${storeId}&reportType=balanceRecordsReporting&startDate=${startDate}&endDate=${endDate}'"></input>
		<table id="rechargeBalabceTable" summary=""
			style="width: 800px; text-align: center;">
			<thead>
				<tr id="rechargeBalabceTr">
					<th>ID</th>
					<th>操作员</th>
					<th>会员卡号</th>
					<th>领卡时间</th>
					<th>会员姓名</th>
					<th>会员电话</th>
					<th>操作时间</th>
					<th>操作详情</th>
				</tr>
			</thead>
			<tbody>
				<c:forEach items="${operationLogs}" var="operationLog">
					<c:choose>
						<c:when
							test="${operationLog.operationType eq 'BALANCE_OP_RECHARGE' }">
							<tr style="color: red;">
						</c:when>
						<c:otherwise>
							<tr>
						</c:otherwise>
					</c:choose>
					<td>${operationLog.id}</td>
					<td>${operationLog.operatorEmployee.name}</td>
					<td><a style="cursor: pointer; text-decoration: none;"
						href="memberOperationLogs?storeId=${storeId}&memberId=${operationLog.member.id}&startDate=${startDate}&endDate=${endDate}">${operationLog.member.memberCardNo}</a></td>
					<td>${operationLog.member.createTimeStr}</td>
					<td>${operationLog.member.name}</td>
					<td>${operationLog.member.mobileNo}</td>
					<td>${operationLog.createTimeStr}</td>
					<td>${operationLog.dataSnapShot}</td>
					</tr>
				</c:forEach>
			</tbody>
		</table>
	</div>
</body>
</html>
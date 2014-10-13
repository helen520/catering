<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>优惠券操作记录</title>
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
			<form action="couponOperationLogs" method="GET">
				<h3>优惠券操作记录</h3>
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
		<table style="width: 800px; text-align: center; margin-top: .5em;">
			<thead>
				<tr>
					<th>ID</th>
					<th>会员卡号</th>
					<th>时间</th>
					<th>操作详情</th>
				</tr>
			</thead>
			<tbody>
				<c:forEach items="${operationLogs }" var="operationLog">
					<tr>
						<td>${operationLog.id }</td>
						<td>${operationLog.member.memberCardNo }</td>
						<td>${operationLog.createTimeStr }</td>
						<td style="text-align: left;">${operationLog.dataSnapShot}</td>
					</tr>
				</c:forEach>
			</tbody>
		</table>
	</div>
</body>
</html>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ page language="java" contentType="text/html;charset-utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<title>会员充值消费明细</title>
<style>
body {
	width: 800px;
	margin: 0px auto;
	padding-bottom: 200px;
}

table {
	border: 1px solid #000;
	border-spacing: 0px;
}

th {
	border: 1px solid #000;
	padding: 2px;
	background-color: #DDD;
}

td {
	border: 1px solid #000;
	padding: 2px;
}

input[type=text] {
	width: 100px;
}
</style>
</head>
<body>
	<h3>会员充值消费明细</h3>
	<input type="button" style="float: right;"
		onclick="javascript :history.back(-1);" value="返回" />
	<br>
	<table style="width: 800px; text-align: center; margin-top: 2em;">
		<thead>
			<tr>
				<th>时间</th>
				<th>操作详情</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach items="${operationLogs }" var="operationLog">
				<c:choose>
					<c:when
						test="${operationLog.operationType eq 'BALANCE_OP_RECHARGE' }">
						<tr style="color: red;">
					</c:when>
					<c:otherwise>
						<tr>
					</c:otherwise>
				</c:choose>
				<td>${operationLog.createTimeStr }</td>
				<td>${operationLog.dataSnapShot}</td>
				</tr>
			</c:forEach>
		</tbody>
	</table>
</body>
</html>








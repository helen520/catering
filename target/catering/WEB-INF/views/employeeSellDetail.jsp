<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page language="java" contentType="text/html;charset-utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<title>员工销售明细</title>
<link rel="stylesheet" href="../css/reports/sell_stats.css">
<script type="text/javascript" src="../js/vendor/jquery-1.10.1.min.js"></script>
<script type="text/javascript"
	src="../js/vendor/jquery.i18n.properties-1.0.9.js"></script>
<script type="text/javascript">
	$(document).ready(function() {
		$(function() {
			jQuery.i18n.properties({
				name : 'strings', //资源文件名称
				path : '../resources/i18n/', //资源文件路径
				mode : 'map', //用Map的方式使用资源文件中的值
				callback : function() {
				}
			});

		});
	});
</script>
</head>
<body>

	<h2 id="GoBackDish2DishCategory">
		<a id="GoBackLink"
			href="employeeSellStats?storeId=${storeId}&startDate=${startDate}&endDate=${endDate}">返回</a>
	</h2>
	<h3>${employee.name}员工销售明细</h3>
	<table id="employeeStatsTable" summary="">
		<thead>
			<tr id="OrderItemsTr" class="top">
				<th>序号</th>
				<th>ID</th>
				<th>台号</th>
				<th>时间</th>
				<th>菜名</th>
				<th>数量</th>
				<th>单位</th>
				<th>单价</th>
				<th>结算价</th>
			</tr>
		</thead>
		<tbody id="OrderItemsTBody">
			<c:forEach items="${sellStatObject}" var="sellStat"
				varStatus="sellStatIndex">

				<tr>
					<td align="center">${(sellStatIndex.index)+1}</td>
					<td>${sellStat.id}</td>
					<td>${sellStat.deskName}</td>
					<td>${sellStat.createTimeStr}</td>
					<td>${sellStat.dishName}</td>
					<td>${sellStat.amount}</td>
					<td>${sellStat.unit}</td>
					<td>${sellStat.dishPrice}</td>
					<td>${sellStat.price}</td>
				</tr>
			</c:forEach>
		</tbody>
	</table>
</body>

<script type="text/javascript" src="../js/tableSort.js"></script>
<script type="text/javascript">
	new tableSort('employeeStatsTable', 1, 2, 999, 'up', 'down', 'hov');
</script>
</html>
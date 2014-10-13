<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title></title>
<meta name="description" content="">
<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no,maximum-scale=1">
<link rel="stylesheet" href="../css/reports/cancelOrderItemsReporting.css" />
</head>
<body>
	<div>
		<select id="startDate" name="startDate">
			<option value="">2012-2013</option>
		</select> 到 <select id="endDate" name="endDate">
			<option value="">2012-2013</option>
		</select> <input id="showSelectedReporting" type="button" value="查看" />
	</div>

	<span id="selectedReportingTitle"></span>
	<input type="button" value="打印">

	<div class="cancelOrderItemsReportingInfo">
		<div class="clear">
			<div class="left cancelTime">时间</div>
			<div class="left deskName">桌号</div>
			<div class="left dishOrderState">下单</div>
			<div class="left dishName">桌名</div>
			<div class="left dishPrice">单价</div>
			<div class="left amount">数量</div>
			<div class="left cancelEmployeeAndCancelReason">取消消人及原因</div>
		</div>
		<div class="clear">
			<div class="left cancelTime">时间</div>
			<div class="left deskName">桌号</div>
			<div class="left dishOrderState">下单</div>
			<div class="left dishName">桌名</div>
			<div class="left dishPrice">单价</div>
			<div class="left amount">数量</div>
			<div class="left cancelEmployeeAndCancelReason">取消消人及原因</div>
		</div>
		<div class="clear">
			<div class="left cancelTime">时间</div>
			<div class="left deskName">桌号</div>
			<div class="left dishOrderState">下单</div>
			<div class="left dishName">桌名</div>
			<div class="left dishPrice">单价</div>
			<div class="left amount">数量</div>
			<div class="left cancelEmployeeAndCancelReason">取消消人及原因</div>
		</div>
		<div class="clear">
			<div class="left cancelTime">时间</div>
			<div class="left deskName">桌号</div>
			<div class="left dishOrderState">下单</div>
			<div class="left dishName">桌名</div>
			<div class="left dishPrice">单价</div>
			<div class="left amount">数量</div>
			<div class="left cancelEmployeeAndCancelReason">取消消人及原因</div>
		</div>
	</div>
	<script type="text/javascript" src="../js/vendor/jquery-1.10.1.min.js"></script>
	<script type="text/javascript" src="../js/reports/cancelOrderItemsReporting.js"></script>
</body>
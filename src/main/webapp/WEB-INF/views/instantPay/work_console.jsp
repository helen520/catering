<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title>CATERING</title>
<meta name="description" content="" />
<meta name="viewport"
	content="width=device-width,initial-scale=1,user-scalable=no,maximum-scale=1" />
<link rel="shortcut icon" href="../favicon.ico" />
<link rel="stylesheet" href="../css/normalize.css" />
<link rel="stylesheet" href="../css/instantPay/work_console.css" />
<link rel="stylesheet" href="../css/instantPay/dish_view.css" />
<link rel="stylesheet" href="../css/instantPay/checkout_view.css">
<link rel="stylesheet" href="../css/instantPay/dish_order_list_view.css" />
<link rel="stylesheet" href="../css/instantPay/dish_picker.css" />
<link rel="stylesheet" href="../css/order_item_list.css" />
<link rel="stylesheet" href="../css/dialogs.css" />

<script type="text/javascript" src="../js/vendor/jquery-1.10.1.min.js"></script>
<script type="text/javascript">
	var $storeId = 0;
	var ls = '';
	$(function() {
		var index = window.location.pathname.lastIndexOf("/");
		$storeId = window.location.pathname.substring(index + 1);
		new WorkConsole();
	});
</script>
</head>
<body style="font-weight: bold;">
	<div id="dishView" style="display: none">
		<div id="dishViewLeft" class="dishPicker"></div>
		<div id="dishViewBottomLeft">
			<div style="font-size: 14px; text-align: center;">
				<span id="dv_string_total_price"> 总价</span> : <span
					id="totalPriceLabel">0</span>
			</div>
			<hr />
			<div>
				<div id="leftCmdButtonContainer">
					<div id="cancelDishOrderButton" class="dishOrderCmdButton">取消点菜</div>
					<div id="switchToDishOrderListViewButton"
						class="dishOrderCmdButton">订单列表</div>
					<div id="newDishOrderButton" class="dishOrderCmdButton">新订单</div>
				</div>
				<div id="centerCmdButtonContainer">
					<div id="dishOrderTagsButton" class="dishOrderCmdButton">整单做法</div>
					<label id="dishOrderTagTextLabel"></label>
				</div>
				<div id="rightCmdButtonContainer">
					<div id="switchToCheckoutViewButton" class="dishOrderCmdButton">结账</div>
				</div>
			</div>
		</div>
		<div id="dishViewRight">
			<div id="dishOrderItemCmdPanel"></div>
			<div id="dishOrderItemList" class="overthrow"></div>
			<div id="loginInfoDiv" class="overthrow">
				操作员:<label id="employeeNameLabel"></label>
				<div id="logoutEmployeeButton" class="dishOrderCmdButton">登出</div>
			</div>
		</div>
	</div>
	<div id="checkoutView" style="display: none;">
		<div id="checkoutViewLeft" class="overthrow">
			<div id="deskInfo" class="caption" align="center"></div>
			<div
				style="position: absolute; left: 1em; bottom: 5em; top: 2em; width: 16em">
				<fieldset>
					<legend style="text-align: left;">会员</legend>
					<div id="bindMemberButton" class="button">关联会员</div>
					<div id="userAccountInfo"></div>
				</fieldset>
			</div>
			<div
				style="position: absolute; left: 18em; right: 2em; bottom: 5em; top: 2em;">
				<fieldset id="dishOrderPricePanel">
					<legend style="text-align: left;">价格</legend>
				</fieldset>
				<fieldset>
					<legend style="text-align: left;">付款方式</legend>
					<div id="paymentTypeList">
						<div id="depositCardButton" class="button" style="margin: 1em">储值卡付费</div>
					</div>
				</fieldset>
				<fieldset>
					<legend style="text-align: left;">付款记录</legend>
					<div id="payRecordList"></div>
				</fieldset>
			</div>
		</div>
		<div id="checkoutViewBottomLeft">
			<div class="dishOrderCmdButton floatRight" id="confirmCheckOutButton">确认付款</div>
			<div class="dishOrderCmdButton floatLeft" id="switchToDishViewButton">继续点菜</div>
		</div>
		<div id="checkoutViewRight" class="overthrow">
			<div id="orderItemListCaption">
				<div style="padding: 0.5em; display: inline-block">已点菜品列表</div>
			</div>
			<div id="dishOrderItemList" class="centerDiv"></div>
		</div>
	</div>
	<div id="dishOrderListView" style="display: none">
		<div id="titlePanel" class="topPanel">
			<input type="text" class="searchDishOrdreIdInput"
				id="searchDishOrdreIdText" placeholder="输入订单号(至少3位)" />
			<button class="dishOrderCmdButton" id="searchDishOrdersByIdButton">搜索</button>
			<button class="dishOrderCmdButton" id="myDishOrdersButton">我的订单</button>
		</div>
		<div id="dishOrderListPanel" class="overthrow dishOrderListPanel"></div>
		<div id="dishOrderListViewBottom">
			<div id="switchToDishViewButton" class="dishOrderCmdButton">返回点菜</div>
		</div>
	</div>
	<div id="dialog-shiftClass" class="shiftClassDialog">
		<div class="overthrow"
			style="position: fixed; top: 5.5em; left: 2.5em; right: 2.5em; bottom: 7.5em;">
			<span id="shiftClassTotalIncome">总收入</span>
			<table style="text-align: center; margin-bottom: 5px; width: 100%">
				<tr id="shiftClassTotalIncomeTr">
					<td style="min-width: 50px">订单数</td>
					<td style="min-width: 40px">总价</td>
					<td>折后总价</td>
					<td>总服务费</td>
					<td style="min-width: 50px">实收款</td>
				</tr>
				<tr>
					<td id="shiftClass_dishOrderCount"></td>
					<td id="shiftClass_totalPrice"></td>
					<td id="shiftClass_discountedTotalPrice"></td>
					<td id="shiftClass_totalServiceFee"></td>
					<td id="shiftClass_totalIncome"></td>
				</tr>
			</table>
			<span id="shiftClassPayDetail">支付明细</span>
			<table style="text-align: center; width: 100%">
				<tbody id="shiftClass_payRecordInfos"></tbody>
			</table>
		</div>
		<div style="position: absolute; bottom: 5px; left: 0px; width: 100%">
			<div style="text-align: center; margin-top: 15px">
				<a class="button" onclick="dismissShiftClassDialog()"><span
					id="shiftClass">交班</span></a> <a class="button"
					onclick="dismissDialog()"><span id="shiftClassCancle">取消</span></a>
			</div>
		</div>
	</div>
	<div id="debugOutput"></div>

	<script type="text/javascript" src="../js/vendor/overthrow.min.js"></script>

	<script type="text/javascript" src="../js/jquery.modal.js"></script>
	<script type="text/javascript" src="../js/jquery.digitKb.js"></script>
	<script type="text/javascript" src="../js/xback.js"></script>


	<script type="text/javascript"
		src="../js/instantPay/authority_manager.js"></script>
	<script type="text/javascript" src="../js/instantPay/checkout_view.js"
		charset="utf-8"></script>
	<script type="text/javascript" src="../js/instantPay/common_dialogs.js"
		charset="utf-8"></script>
	<script type="text/javascript"
		src="../js/instantPay/customer_info_picker.js" charset="utf-8"></script>
	<script type="text/javascript" src="../js/instantPay/dialogs.js"></script>
	<script type="text/javascript"
		src="../js/instantPay/ui_data_manager.js" charset="utf-8"></script>
	<script type="text/javascript"
		src="../js/instantPay/dish_order_cache.js"></script>
	<script type="text/javascript"
		src="../js/instantPay/dish_order_list_view.js"></script>
	<script type="text/javascript"
		src="../js/instantPay/dish_order_manager.js"></script>
	<script type="text/javascript"
		src="../js/instantPay/dish_order_price_panel.js"></script>
	<script type="text/javascript" src="../js/instantPay/dish_picker.js"
		charset="utf-8"></script>
	<script type="text/javascript" src="../js/instantPay/dish_view.js"
		charset="utf-8"></script>
	<script type="text/javascript" src="../js/instantPay/entity_methods.js"
		charset="utf-8"></script>
	<script type="text/javascript"
		src="../js/instantPay/jquery.i18n.properties.js"></script>
	<script type="text/javascript"
		src="../js/instantPay/order_item_list.js" charset="utf-8"></script>
	<script type="text/javascript" src="../js/instantPay/work_console.js"
		charset="utf-8"></script>
	<script type="text/javascript"
		src="../js/instantPay/customer_manager.js" charset="utf-8"></script>
</body>
</html>

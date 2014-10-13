<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title>RICE3</title>
<meta name="description" content="">
<meta name="viewport"
	content="width=device-width,initial-scale=1,user-scalable=no,maximum-scale=1">
<link rel="shortcut icon" href="../favicon.ico" />
<link rel="stylesheet" href="../css/normalize.css">
<link rel="stylesheet" href="../css/instantPay/work_console.css">
<link rel="stylesheet" href="../css/instantPay/dish_view.css" />
<link rel="stylesheet" href="../css/instantPay/checkout_view.css">
<link rel="stylesheet" href="../css/instantPay/dish_order_list.css" />
<link rel="stylesheet" href="../css/instantPay/dish_picker.css" />
<link rel="stylesheet" href="../css/order_item_list.css">
<link rel="stylesheet" href="../css/dialogs.css">

<!--[if lt IE 9]>
            <script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
            <script>window.html5 || document.write('<script src="js/vendor/html5shiv.js"><\/script>')</script>
        <![endif]-->
</head>
<body style="font-weight: bold;">
	<%@ include file="dish_view.jsp"%>
	<%@ include file="checkout_view.jsp"%>
	<%@ include file="../shiftClassDialog.jsp"%>

	<div id="debugOutput"></div>

	<script type="text/javascript" src="../js/vendor/jquery-1.10.1.min.js"></script>
	<script type="text/javascript" src="../js/vendor/overthrow.min.js"></script>

	<script type="text/javascript"
		src="../js/instantPay/jquery.cookie-1.4.1.min.js"></script>
	<script type="text/javascript"
		src="../js/instantPay/jquery.i18n.properties.js"></script>
	<script type="text/javascript" src="../js/jquery.modal.js"></script>
	<script type="text/javascript" src="../js/jquery.digitKb.js"></script>
	<script type="text/javascript" src="../js/xback.js"></script>

	<script type="text/javascript" src="../js/instantPay/unibiz_proxy.js"></script>
	<script type="text/javascript" src="../js/instantPay/order_item.js"></script>
	<script type="text/javascript" src="../js/instantPay/dialogs.js"></script>
	<script type="text/javascript" src="../js/instantPay/ui_data.js"
		charset="utf-8"></script>
	<script type="text/javascript"
		src="../js/instantPay/dish_order_manager.js" charset="utf-8"></script>
	<script type="text/javascript"
		src="../js/instantPay/order_item_list.js" charset="utf-8"></script>
	<script type="text/javascript" src="../js/shiftClass.js"
		charset="utf-8"></script>
	<script type="text/javascript"
		src="../js/instantPay/customer_info_picker.js" charset="utf-8"></script>
	<script type="text/javascript" src="../js/instantPay/checkout_view.js"
		charset="utf-8"></script>
	<script type="text/javascript" src="../js/instantPay/dish_picker.js"
		charset="utf-8"></script>
	<script type="text/javascript" src="../js/instantPay/work_console.js"
		charset="utf-8"></script>
	<script type="text/javascript"
		src="../js/instantPay/dish_order_list.js" charset="utf-8"></script>
	<script type="text/javascript" src="../js/instantPay/dish_view.js"
		charset="utf-8"></script>
	<script type="text/javascript">
		$(function() {
			var index = window.location.pathname.lastIndexOf("/");
			storeId = window.location.pathname.substring(index + 1);

			new WorkConsole(storeId);
		});
	</script>
</body>
</html>

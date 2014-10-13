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
	content="width=device-width,initial-scale=1,user-scalable=no,maximum-scale=1,minimum-scale=1">
<link rel="shortcut icon" href="../favicon.ico" />
<link rel="stylesheet" href="../css/normalize.css">
<link rel="stylesheet" href="../css/mobile/work_console.css">
<link rel="stylesheet" href="../css/mobile/dish_order_list.css" />
<link rel="stylesheet" href="../css/mobile/dish_view.css" />
<link rel="stylesheet" href="../css/mobile/dish_order_view.css">
<link rel="stylesheet" href="../css/mobile/checkout_view.css">
<link rel="stylesheet" href="../css/order_item_list.css">
<link rel="stylesheet" href="../css/dialogs.css">

</head>
<body>
	<%@ include file="dish_view.jsp"%>
	<%@ include file="dish_order_view.jsp"%>
	<%@ include file="checkout_view.jsp"%>

	<script type="text/javascript" src="../js/vendor/jquery-1.10.1.min.js"></script>
	<script type="text/javascript"
		src="../js/vendor/jquery.i18n.properties-1.0.9.js"></script>

	<script type="text/javascript" src="../js/jquery.modal.js"></script>
	<script type="text/javascript" src="../js/jquery.digitKb.js"></script>
	<script type="text/javascript" src="../js/dialogs.js"></script>
	<script type="text/javascript" src="../js/xback.js"></script>

	<script type="text/javascript" src="../js/wechat/ui_data.js"
		charset="utf-8"></script>
	<script type="text/javascript" src="../js/wechat/dish_order_manager.js"
		charset="utf-8"></script>
	<script type="text/javascript" src="../js/order_item_list.js"
		charset="utf-8"></script>
	<script type="text/javascript" src="../js/wechat/self.js"
		charset="utf-8"></script>
	<script type="text/javascript" src="../js/wechat/dish_view.js"
		charset="utf-8"></script>
	<script type="text/javascript" src="../js/wechat/dish_order_view.js"
		charset="utf-8"></script>
	<script type="text/javascript" src="../js/wechat/checkout_view.js"
		charset="utf-8"></script>
</body>
</html>

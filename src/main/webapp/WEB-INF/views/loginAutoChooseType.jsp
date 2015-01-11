<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<html>
<head>
<title>CATERING</title>
<link rel="shortcut icon" href="../favicon.ico" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport"
	content="width=device-width,initial-scale=1,user-scalable=no,maximum-scale=1">
<style>
input {
	display: inline-block;
	background-color: #FF9640;
	outline: none;
	cursor: pointer;
	text-align: center;
	text-decoration: none;
	font: 14px/100% Arial, Helvetica, sans-serif;
	padding: .5em 1em .55em;
	-webkit-border-radius: .5em;
	-moz-border-radius: .5em;
	border-radius: .5em;
	-webkit-box-shadow: 0 1px 2px rgba(0, 0, 0, .2);
	-moz-box-shadow: 0 1px 2px rgba(0, 0, 0, .2);
	box-shadow: 0 1px 2px rgba(0, 0, 0, .2);
}
</style>
<script type="text/javascript" src="js/vendor/jquery-1.10.1.min.js"></script>
<script type="text/javascript"
	src="js/vendor/jquery.i18n.properties-1.0.9.js"></script>
<script type="text/javascript">
	$(function() {
		if ($(window).width() < 780)
			window.location.href = "store";
		else
			window.location.href = "desktop";
	});
</script>
</head>
<body>
	<div></div>
</body>
</html>

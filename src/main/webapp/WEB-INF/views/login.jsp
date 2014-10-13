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
.errorblock {
	color: #ff0000;
	background-color: #ffEEEE;
	border: 3px solid #ff0000;
	padding: 8px;
	margin: 10px;
	text-align: center;
}

.successblock {
	color: green;
	background-color: #ccc;
	border: 3px solid green;
	padding: 8px;
	margin: 10px;
	text-align: center;
}

input[type=text],input[type=password] {
	border: 1px solid #CCC;
	-webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, .15);
	-moz-box-shadow: 0 1px 3px rgba(0, 0, 0, .15);
	box-shadow: 0 1px 3px rgba(0, 0, 0, .15);
	border-radius: 0.75em;
	padding: .4em 5px;
	margin: 0;
	display: inline-block;
	background: transparent none;
	outline: 0 !important;
	-webkit-appearance: none;
	min-height: 1.4em;
	line-height: 1.4em;
	font-family: Helvetica, Arial, sans-serif;
	color: #333;
	text-shadow: 0 1px 0 #fff;
	-webkit-rtl-ordering: logical;
	-webkit-user-select: text;
	cursor: auto;
	letter-spacing: normal;
	font: -webkit-small-control;
	word-spacing: normal;
	text-transform: none;
	text-indent: 0px;
	text-align: start;
}

input[type=submit],input[type=reset] {
	height: 35px;
	width: 65px;
}

table {
	border: 1px solid #ccc;
	padding: 15px;
	/*width: 100%;//*/
	margin-top: 5em;
	font-size: 15px;
}

table td {
	height: 35px;
	text-align: center;
}
</style>
</head>
<body onload='document.f.j_username.focus();'>

	<c:if test="${not empty error}">
		<div class="errorblock">
			<div id="loginState">登录失败</div>
			<div id="loginFailureReason">原因:用户名或密码错误</div>
		</div>
	</c:if>

	<c:if test="${not empty success}">
		<div id="successblock_text" class="successblock">密码修改成功!请重新登录!</div>
	</c:if>

	<form name='f' action="<c:url value='j_spring_security_check' />"
		method='POST'>

		<table cellspacing="0" cellpadding="0" align="center">
			<tr>
				<td><span id="user_text">用户</span>：&nbsp;&nbsp;<input
					type='text' name='j_username'></td>
			</tr>
			<tr>
				<td><span id="password_text">密码</span>：&nbsp;&nbsp;<input
					type='password' name='j_password' /></td>
			</tr>
			<tr>
				<td><span id="selectedLanguage_text">选择语言</span>：&nbsp;&nbsp; <select
					id="selectedLanguage" name="j_selectedLanguage"></select></td>
			</tr>
			<tr>
				<td align="center"><input id="submit_button" name="submit"
					type="submit" value="登录" /> &nbsp;&nbsp;&nbsp; <input
					id="reset_button" name="reset" type="reset" value="重置" /> <a
					id="modifyPassword" href="modifyPassword">修改密码</a></td>
			</tr>
		</table>
	</form>
	<br>
	<div id='demo_hint' style="text-align: center; display: none;">用户名:1001,密码:1001
		联系电话:</div>
	<script type="text/javascript" src="js/vendor/jquery-1.10.1.min.js"></script>
	<script type="text/javascript"
		src="js/vendor/jquery.i18n.properties-1.0.9.js"></script>
	<script type="text/javascript" src="js/login.js"></script>

</body>
</html>

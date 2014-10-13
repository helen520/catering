<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<html>
<head>
<title>CATERING</title>
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

input[type=text],input[type=password] {
	width: 120px;
	height: 25px;
}

input[type=button],input[type=reset] {
	height: 35px;
	width: 65px;
}

table {
	border: 1px solid #ccc;
	padding: 15px;
	/*width: 100%;//*/
	margin-top: 10px;
	font-size: 15px;
}

table td {
	height: 35px;
	text-align: center;
}
</style>
</head>
<body>
	<c:if test="${not empty error}">
		<div class="errorblock">
			<div id="modifiedState">修改失败</div>
			<div id="modifiedFailureReason">原因:用户名或密码错误</div>
		</div>
	</c:if>

	<c:if test="${not empty notice}">
		<div class="errorblock">
			<div id="modifiedState">修改失败</div>
			<div id="modifiedFailureReason">原因:密码不能为空!</div>
		</div>
	</c:if>

	<form name='f' action="submitNewPassword" method='POST'>
		<table cellspacing="0" cellpadding="0" align="center">
			<tr>
				<td><span id="user_text">用户名</span> :</td>
				<td colspan="2"><input type='text' name='userName'></td>
			</tr>
			<tr>
				<td><span id="oldPassword_text">旧密码</span> :</td>
				<td colspan="2"><input type='password' name='oldPassword' /></td>
			</tr>
			<tr>
				<td><span id="newPassword_text">新密码</span> :</td>
				<td colspan="2"><input type='password' name='newPassword' /></td>
			</tr>
			<tr>
				<td><span id="reNewPassword_text">重复新密码</span> :</td>
				<td colspan="2"><input type='password' name='reNewPassword' /></td>
			</tr>
			<tr>
				<td align="center"><input onclick="checkInput(this)"
					type="button" value="确认" /></td>
				<td align="center"><input id="reset_button" name="reset"
					type="reset" value="重置" /></td>
				<td align="center"><a id="returnLogin" href='login'>返回</a></td>
			</tr>
		</table>
	</form>
	<script type="text/javascript" src="js/vendor/jquery-1.10.1.min.js"></script>
	<script type="text/javascript"
		src="js/vendor/jquery.i18n.properties-1.0.9.js"></script>
	<script type="text/javascript">
		$(function() {
			jQuery.i18n.properties({
				name : 'strings',
				path : 'resources/i18n/',
				mode : 'map',
				callback : function() {
					$("#modifiedState")
							.text($.i18n.prop('string_xiuGaiShiBai'));
					$("#user_text").text($.i18n.prop('string_yongHu'));
					$("#oldPassword_text").text($.i18n.prop('string_jiuMiMa'));
					$("#newPassword_text").text($.i18n.prop('string_xinMiMa'));
					$("#submit_button").val($.i18n.prop('string_queRen'));
					$("#reset_button").val($.i18n.prop('string_chongZhi'));
					$("#return").text($.i18n.prop('string_fanHui'));
				}
			});
		});
		function checkInput(thisObject) {
			var userName = $.trim(thisObject.form.userName.value);
			var oldPassword = $.trim(thisObject.form.oldPassword.value);
			var newPassword = $.trim(thisObject.form.newPassword.value);
			var reNewPassword = $.trim(thisObject.form.reNewPassword.value);

			if (userName == "" || oldPassword == "" || newPassword == ""
					|| reNewPassword == "") {
				alert("请输入完整信息!");
				return;
			}

			if (newPassword !== reNewPassword) {
				alert("重复输入的密码不一致!请重新输入!");
				return;
			}
			thisObject.form.submit();
		}
	</script>
</body>
</html>
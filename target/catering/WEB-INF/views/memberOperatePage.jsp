<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title>会员管理</title>
<meta name="description" content="">
<meta name="viewport"
	content="width=device-width,initial-scale=1,user-scalable=no,maximum-scale=1">
<script type="text/javascript" src="../js/vendor/jquery-1.10.1.min.js"></script>
<script type="text/javascript"
	src="../js/vendor/jquery.i18n.properties-1.0.9.js"></script>
<script type="text/javascript" src="../js/dialogs.js"></script>
<script type="text/javascript" src="../js/jquery.modal.js"></script>
<script type="text/javascript" src="../js/memberOperationPage.js"></script>
<link rel="stylesheet" href="../css/dialogs.css">
<style>
.overthrow {
	overflow: auto;
	-webkit-overflow-scrolling: touch;
}

.singleChoicePanel {
	position: fixed;
	left: 2em !important;
	right: 2em;
	top: 2em !important;
	background-color: #FFFFFF;
	border-radius: 0.75em;
	right: 2em;
	bottom: 2em;
}

.orderItemCmdPanelContent {
	position: absolute;
	top: 2em;
	right: 0em;
	left: 0em;
	bottom: 2.5em;
	padding: 0.2em;
}

.dishOrderDetailLabel {
	text-align: center;
	height: 20px;
	background-color: #cbcbcb;
	display: inline-block;
	margin-left: 0.5em;
	-webkit-border-radius: .5em;
	-moz-border-radius: .5em;
	border-radius: .5em;
	width: 4em;
}

.couponTemplateItemOperation {
	float: right;
}

.couponTemplateItem {
	padding: 0.5em;
	margin: 0.5em;
	background-color: #eee;
}

.confirmDialog {
	width: 90%;
	max-width: 20em;
	background-color: #FFF;
	border-radius: 0.75em;
	top: 15em !important;
}

.orderItemCmdPanelBottomDiv {
	text-align: center;
	position: absolute;
	padding: 0.3em 0em 0.3em 0em;
	left: 0px;
	bottom: 0em;
	width: 100%;
	background-color: #D9D9B3;
	border-radius: 0em 0em 0.75em 0.75em;
}

.titleOperatePanel {
	position: absolute;
	top: 0.3em;
	right: .5em;
}

.button,.recharge,.sendCoupon,.balanceRecord {
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

.topPanel {
	position: relative;
	padding: 0.3em 0em 0.3em 0em;
	left: 0px;
	/* top: 0.3em; */
	height: 2em;
	border-radius: 0.75em 0.75em 0em 0em;
	border-bottom: #CCC solid 1px;
	background-color: #D9D9B3;
	width: 100%;
}

.searchInput {
	width: 100%;
	margin: 0;
	display: inline-block;
	background: white;
	-webkit-appearance: none;
	min-height: 1.4em;
	line-height: 1.4em;
	font-family: Helvetica, Arial, sans-serif;
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
	-webkit-writing-mode: horizontal-tb;
	border: 1px solid #CCC;
	-webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, .15);
	-moz-box-shadow: 0 1px 3px rgba(0, 0, 0, .15);
	box-shadow: 0 1px 3px rgba(0, 0, 0, .15);
	border-radius: 0.75em;
	outline: 0 !important;
	padding: .4em 5px;
}

.memberItem {
	position: relative;
	background-color: #D9D9B3;
	border-top: 1px solid #ebebeb;
	max-height: 10em;
	border-top: 1px solid #ebebeb;
	width: 100%;
	min-height: 3em;
}

.memberItemOperationPanel {
	float: right;
	padding: 0.2em;
	display: block;
	border-left: 1px solid #ebebeb;
	min-width: 4em;
}

.captionPanel {
	float: left;
	padding: .8em;
}

.memberListPanel {
	padding: 3em .3em .5em .3em;
	-webkit-overflow-scrolling: touch;
	overflow: auto;
}

.searchInputPanel {
	padding: .1em 16em .1em .1em
}

.coupon {
	margin: 0.1em;
	display: inline-block;
	text-align: left;
	background-color: #CCC;
}

.couponListPanel {
	padding: 0.2em;
	min-height: 1em;
	background-color: #EEE;
}

.functionMenuDialog {
	position: fixed;
	top: 20px !important;
	left: 8px;
	right: 8px;
	bottom: 12px;
	display: none;
	border-radius: 0.75em;
	background-color: #FFF;
}

.functionMenuButtonSelector {
	position: absolute;
	top: 2.5em !important;
	right: 0em;
	left: 0em;
	bottom: 2.5em;
	padding: 1em;
}

.confirmDialogTitle {
	text-align: center;
}

.cancelDiv {
	position: absolute;
	right: 3px;
	top: 3px;
	border-radius: 8em;
	width: 1em;
	text-align: center;
	background-color: #B4B4B4;
	padding: 3px;
	display: block;
	border: #CCC solid 1px;
}

.controlPanel {
	position: absolute;
	left: 0px;
	bottom: 0px;
	padding: 0.3em 0em 0.3em 0em;
	text-align: center;
	border-radius: 0em 0em 0.75em 0.75em;
	width: 100%;
	background-color: #D9D9B3;
}
</style>
</head>
<body>
	<input id="storeId" value="${storeId}" type="hidden">
	<input id="employeeId" value="${employeeId}" type="hidden">
	<div class="topPanel">
		<div class="searchInputPanel">
			<input id="searchInput" class="searchInput" placeholder="输入会员卡号或电话号码">
		</div>
		<div class="titleOperatePanel" style="display: inline-block;">
			<button class="button newMemberButton" style="margin-right: .5em">新建会员</button>
			<button class="button searchMemberButton" style="margin-right: .5em">搜索</button>
			<button class="button searchAllMemberButton">全部</button>
		</div>
	</div>
	<div id="memberListPanel" class="memberListPanel"></div>
	<div id="registerMemberView" style="display: none;" align="center">
		<div class="confirmDialogTitle">注册更新会员窗口</div>
		<div>
			<table cellspacing="0" cellpadding="0" align="center">
				<tr>
					<td><span>用户姓名</span>：&nbsp;&nbsp;<input id="member_name"
						type='text'></td>
				</tr>
				<tr>
					<td><span>手机号码</span>：&nbsp;&nbsp;<input id="member_phone"
						type="tel" /></td>
				</tr>
				<tr>
					<td><span>会员卡号</span>：&nbsp;&nbsp;<input id="member_cardNo"
						type='text' /></td>
				</tr>
				<tr>
					<td><span>&nbsp;&nbsp;折扣率</span>：&nbsp;&nbsp;<select
						id="member_discountRate">
							<option value="1">无</option>
							<c:forEach items="${discountRates}" var="discountRate">
								<option value="${discountRate.value}">${discountRate.name}</option>
							</c:forEach>
					</select></td>
				</tr>
				<tr>
					<td><span>积&nbsp;&nbsp;&nbsp;&nbsp;分</span>：&nbsp;&nbsp;<input
						id="member_point" type="number" value="0"></td>
				</tr>
			</table>
		</div>
		<div align="center">
			<div class="dialogButton" onclick="submitRegisterMember(${storeId})">确定</div>
			<div class="dialogButton" onclick="dismissRegisterMemberDialog()">取消</div>
		</div>
	</div>
</body>
</html>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title>RICE3</title>
<meta name="description" content="">
<meta name="viewport"
	content="width=device-width,initial-scale=1,user-scalable=no,maximum-scale=1,minimum-scale=1">
<script type="text/javascript" src="../js/vendor/jquery-1.10.1.min.js"></script>
<script type="text/javascript"
	src="../js/vendor/jquery.i18n.properties-1.0.9.js"></script>
<script type="text/javascript" src="../js/dialogs.js"></script>
<script type="text/javascript" src="../js/vendor/Calendar3.js"></script>
<script type="text/javascript" src="../js/jquery.modal.js"></script>
<link rel="stylesheet" href="../css/dialogs.css">
<style>
.ui-radius {
	border-radius: 0.75em;
}

.ui-shadow {
	-webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, .15);
	-moz-box-shadow: 0 1px 3px rgba(0, 0, 0, .15);
	box-shadow: 0 1px 3px rgba(0, 0, 0, .15);
}

.ui-input {
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
	-webkit-writing-mode: horizontal-tb;
}

.ui-border-solid {
	border: 1px solid #CCC;
	position: absolute;
	left: 70px;
	right: 10px;
}

.createCouponTemplate {
	line-height: 2em;
	padding: 10px 0px;
	position: relative;
}

.button {
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

.couponTemplateItem {
	padding: 0.5em;
	margin: 0.5em;
	background-color: #eee;
}
</style>

<script type="text/javascript">
	$(function() {
		loadProperties();
		$("[name='sendCouponToAllMember']").click(
				sendCouponToAllMemberBtnOnClick);
		$("[name='deleteCouponTemplateBtn']").click(
				deleteCouponTemplateBtnOnClick);
	});
	function StringBuilder() {
		var _string = new Array();
		this.append = function(args) {
			if (typeof (args) != "object") {
				_string.push(args);
			} else {
				_string = _string.concat(args);
			}
		};
		this.toString = function() {
			return _string.join("");
		};
	}

	function loadProperties() {
		jQuery.i18n.properties({
			name : 'strings', // 资源文件名称
			path : '../resources/i18n/', // 资源文件路径
			mode : 'map', // 用Map的方式使用资源文件中的值
			callback : function() {
			}
		});
	}
	function validFromNowOnClick() {
		var validFromNow = $("#validFromNow")[0].checked;
		$("#validFromNowDate").hide();
		$("#validFromDate").hide();

		if (validFromNow) {
			$("#validFromNowDate").show();
		} else {
			$("#validFromDate").show();
		}
	}

	function submitCreateCouponTemplate() {
		var storeId = $("#storeId").val();
		var employeeId = $("#employeeId").val();
		var title = $("#title").val();
		var subTitle = $("#subTitle").val();
		var text = $("#text").val();
		var value = $("#value").val();
		var triggerEvent = 1;
		var validFromNow = $("#validFromNow")[0].checked;
		var validDays = Number($("#validDays").val());
		var startDate = $("#startDate").val();
		var endDate = $("#endDate").val();

		for ( var i in $("[name='triggerEvent']")) {
			radioButton = $("[name='triggerEvent']")[i];
			if (radioButton.checked) {
				triggerEvent = radioButton.value;
				break;
			}
		}

		if (title == "" || text == "") {
			alert("标题和内容不能为空!!");
			return;
		}

		if (validFromNow) {
			if (validDays == "" || validDays <= 0) {
				alert("有效天数不能为空且必须大于零!!");
				return;
			}
			startDate = 0;
			endDate = 0;
		} else {
			if (startDate == "" || endDate == "") {
				alert("开始有效期和结束日期不能为空!!");
				return;
			}
			validDays = 0;
		}

		$.ajax({
			url : 'submitCreateCouponTemplate',
			type : 'POST',
			data : {
				storeId : storeId,
				employeeId : employeeId,
				title : title,
				subTitle : subTitle,
				text : text,
				value : value,
				triggerEvent : triggerEvent,
				validFromNow : validFromNow,
				validDays : validDays,
				startDate : startDate,
				endDate : endDate,
			},
			error : function() {
				alert("创建优惠券模版出错!请稍后再试!");
				return;
			},
			success : function(result) {
				if (!result) {
					alert("创建优惠券模版出错!请稍后再试!!!!");
					return;
				}
				window.location.href = "";
			}
		});
	}

	function deleteCouponTemplateBtnOnClick() {
		var storeId = $("#storeId").val();
		var employeeId = $("#employeeId").val();
		var couponTemplateId = this.value;
		if (confirm("确认要删除该优惠券模版?")) {
			$.ajax({
				url : 'deleteCouponTemplate',
				type : 'POST',
				data : {
					storeId : storeId,
					employeeId : employeeId,
					couponTemplateId : couponTemplateId
				},
				error : function() {
					alert("删除优惠券模版出错!请稍后再试!");
					return;
				},
				success : function(result) {
					if (!result) {
						alert("删除优惠券模版出错!请稍后再试!!!!");
						return;
					}
					window.location.href = "";
				}
			});
		}
	}

	function sendCouponToAllMemberBtnOnClick() {
		var storeId = $("#storeId").val();
		var employeeId = $("#employeeId").val();
		var couponTemplateId = this.value;

		if (confirm("确认要群发优惠券给所有会员?")) {
			$.ajax({
				url : 'sendCouponToAllMember',
				type : 'POST',
				data : {
					storeId : storeId,
					employeeId : employeeId,
					couponTemplateId : couponTemplateId
				},
				error : function() {
					alert("群发优惠券出错!请稍后再试!");
					return;
				},
				success : function(result) {
					if (!result) {
						alert("群发优惠券出错!请稍后再试!!!!");
						return;
					}
					alert("已群发优惠券给所有会员!");
				}
			});
		}
	}
</script>
</head>
<body>
	<input id="storeId" value="${storeId}" type="hidden">
	<input id="employeeId" value="${employeeId}" type="hidden">
	<div id="createNewCouponTemplate" class="createCouponTemplate">
		<div>
			标题 <input id="title"
				class="ui-input ui-radius ui-shadow ui-border-solid" type="text">
		</div>
		<div>
			附标题 <input id="subTitle"
				class="ui-input ui-radius ui-shadow ui-border-solid" type="text">
		</div>
		<div>
			内容 <input id="text"
				class="ui-input ui-radius ui-shadow ui-border-solid" type="text">
		</div>
		<div>
			可抵扣 <input id="value"
				class="ui-input ui-radius ui-shadow ui-border-solid" type="text"
				value="0">
		</div>
		<div>
			触发方式 <input name="triggerEvent" type="radio" value="1"
				checked="checked"> 开卡自动发&nbsp;<input name="triggerEvent"
				type="radio" value="2"> 手动发
		</div>
		<div>
			有效方式 <input id="validFromNow" type="checkbox" checked="checked"
				onclick="validFromNowOnClick()"> <span>从发卡起有效</span>
		</div>
		<div id="validFromNowDate">
			有效天数 <input id="validDays"
				class="ui-input ui-radius ui-shadow ui-border-solid" type="text">
		</div>
		<div id="validFromDate" style="display: none;">
			开始有效期 <input id="startDate" onclick="new Calendar().show(this);">
			结束日期 <input id="endDate" onclick="new Calendar().show(this);">
		</div>
		<div style="text-align: center;">
			<div id="123" class="button" onclick="submitCreateCouponTemplate()">新建</div>
		</div>
	</div>
	<div id="couponTemplateList">
		<c:forEach items="${ couponTemplates}" var="couponTemplate">
			<div class="couponTemplateItem">
				<span>${couponTemplate.title}</span>
				<div style="float: right;">
					<button name="sendCouponToAllMember" class="button"
						value="${couponTemplate.id}">群发</button>
					<button name="deleteCouponTemplateBtn" class="button"
						value="${couponTemplate.id}">删除</button>
				</div>

				<p>${couponTemplate.subTitle}</p>
				<p>
					可抵扣:${couponTemplate.value}&nbsp;&nbsp; 触发方式:
					<c:if test="${couponTemplate.triggerEvent==1}"> 开卡自动发</c:if>
					<c:if test="${couponTemplate.triggerEvent==2}"> 手动发</c:if>
				</p>
				<p>
					<c:choose>
						<c:when test="${couponTemplate.validFromNow}">
							有效天数 : ${couponTemplate.validDays}
						</c:when>
						<c:otherwise>
							有效期 ${couponTemplate.startDateStr} 至 ${couponTemplate.endDateStr}
						</c:otherwise>
					</c:choose>
				</p>
				<p>&nbsp;&nbsp;&nbsp;&nbsp;${couponTemplate.text}</p>
			</div>
		</c:forEach>
	</div>
</body>
</html>

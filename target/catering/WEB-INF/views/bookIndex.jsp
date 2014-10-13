<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>


<!DOCTYPE html>
<html lang="zh" class="ui-mobile" data-enhanced="true">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport"
	content="width=device-width, initial-scale=1,user-scalable=no,maximum-scale=1">
<title>预订</title>
<!-- <script language="javascript" type="text/javascript" src="/resources/My97DatePicker/WdatePicker.js"></script> -->
<link href="../css/jquery-ui-1.10.3.custom.min.css" rel="stylesheet" />
<script type="text/javascript" src="../js/vendor/jquery-1.10.1.min.js"></script>
<script type="text/javascript"
	src="../js/vendor/jquery-ui-1.10.3.custom.min.js"></script>
<script type="text/javascript" src="../js/vendor/fastclick.js"></script>
<script type="text/javascript" src="../js/bookIndex.js" charset="utf-8"></script>
<style type="text/css">
body {
	font-family: "宋体";
	font-size: 12px;
}

.content {
	font-size: 1.3em;
}

a {
	list-style: none;
	text-decoration: none;
}

.left {
	float: left;
}

.right {
	float: right;
}

.clear {
	clear: both;
}

.ui-btn {
	font-size: 16px;
	margin: .5em 0;
	padding: .7em 1em;
	position: relative;
	text-align: center;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	cursor: pointer;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	background-position: center center;
	background-repeat: no-repeat;
	-webkit-border-radius: .3125em;
	border-radius: .3125em;
	border-style: solid;
	border-color: #CCC;
	border-width: 1px;
}

.ui-btn:hover {
	background: #ededed;
	border-color: #CCC;
	color: #111;
	text-shadow: 0 1px 0 #eee;
}

.ui-btn:link {
	text-decoration: none !important;
}

.ui-btn a {
	color: #000;
	text-decoration: none;
	font-weight: bold;
	line-height: 22px;
}

.ui-radius {
	border-radius: 0.75em;
}

.ui-shadow {
	-webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, .15);
	-moz-box-shadow: 0 1px 3px rgba(0, 0, 0, .15);
	box-shadow: 0 1px 3px rgba(0, 0, 0, .15);
}

.ui-gray-circle {
	display: inline-block;
	height: 20px;
	width: 20px;
	background-color: #999;
	-webkit-border-radius: 2.5em;
	border-radius: 1em;
	display: inline-block;
	color: #FFF;
	font-size: 1.25em;
	line-height: 18px;
	text-shadow: 0 1px 0 #eee;
	text-align: center;
	overflow: hidden;
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

.border-solid {
	border: 1px solid #CCC;
}

.menu {
	margin: 10px;
}

.menu .book-records-num {
	border-radius: 0.75em;
	position: absolute;
	padding: 3px;
	top: -3px;
	right: 0px;
	font-size: 0.75em;
	border: #CCC solid 1px;
	background-color: #F93;
	top: -3px;
	border: #CCC solid 1px;
	background-color: #F93;
}

.calendar {
	text-align: center;
	padding: 0em 1em 1.5em .5em;
	height: 250px;
}

.ui-datepicker {
	width: 100%;
}

.time-range-items {
	padding: 10px;
}

.time-range-item {
	padding: 8px 0px;
	margin: 3px;
	min-width: 6em;
	text-align: center;
	background-color: #F2F2F2;
	border-radius: 0.25em;
	border: #CCC solid 1px;
}

.bookInfo {
	display: none;
}

.time-range-resources {
	padding: 3px;
}

.time-range-resource-item {
	padding: 5px;
	margin: 5px 0px;
}

.user-info {
	line-height: 3.5em;
	padding: 10px 0px;
	position: relative;
}

.type-ahead {
	top: -10px;
	position: relative;
	display: inline-block;
	position: relative;
}

.contact-name-input,.contact-tel-input,.contact-count-input {
	position: absolute;
	left: 70px;
	right: 10px;
}

.arrive-time-options {
	padding: 20px 0px;
}

.arrive-time-option {
	padding: 5px;
	margin: 3px;
	background-color: #F2F2F2;
	border-radius: 0.25em;
	border: #CCC solid 1px;
}

.operates {
	height: 60px;
	text-align: center;
}

.selected {
	background: #FC9;
}
</style>
</head>

<body id="fastclick" onload="initFastButtons();">
	<div class="content">
		<ul style="display: none;">
			<li><input id="storeId" type="hidden" value="${storeId }" /></li>
			<li><input id="customerUserId" type="hidden"
				value="${customerUserId }" /></li>
			<li><input id="expectedArriveDate" type="hidden"
				value="${nowDate }" /></li>
			<li><input id="openId" type="hidden" value="${openId }" /></li>
		</ul>
		<div class="menu">
			<div style="color: red;">目前只支持下一次订单,即可多次预定,但是只能预先点一次菜!</div>
			<a class="right ui-btn ui-shadow"
				href="getBookRecordList?customerUserId=${customerUserId }&&openId=${openId}&&storeId=${storeId}">我的预订
				<div class="book-records-num ">${bookRecordsNum }</div>
			</a>
		</div>
		<div id="calendar" class="clear calendar">
			<div id="datepicker"></div>
		</div>
		<div>
			<small>请选择预订时间段</small>
		</div>
		<div id="timeRangeItems" class="time-range-items">
			<c:forEach items="${timeRangeList}" var="timeRange"
				varStatus="timeRageCount">
				<div class="left time-range-item" timeRageId="${timeRange.id }"
					startTime="${timeRange.startTime }" endTime="${timeRange.endTime }"
					arriveTimeOptions="${timeRange.arriveTimeOptions }">${timeRange.name }</div>
				<div style="display: none">
					<div id="timeRangeItemId_${timeRange.id }">
						<c:forEach items="${ timeRange.resourceList}" var="resoruceItem">
							<div class="time-range-resource-item">
								<label><input resourceId="${resoruceItem.id }"
									resourceName="${resoruceItem.name }" name="resource"
									type='checkbox'>${resoruceItem.name }(可预订数:${resoruceItem.amount})</label>
							</div>
						</c:forEach>
					</div>
				</div>
			</c:forEach>
			<div class="clear"></div>
		</div>
		<div id="bookInfo" class="bookInfo">
			<div id="timeRangeResources" class="time-range-resources"></div>
			<div class="user-info">
				<div>
					<span class="type-ahead">联系人</span> <input id="contactName"
						name="contactName" type="text" value="${contactName }"
						class="ui-input ui-radius ui-shadow border-solid contact-name-input" />
				</div>
				<div>
					<span class="type-ahead">联系电话 </span><input id="contactTel"
						name="contactTel" type="tel" value="${contactTel }"
						class="ui-input ui-radius ui-shadow border-solid contact-tel-input" />
				</div>
				<div>
					<span class="type-ahead">人&nbsp;&nbsp;&nbsp;&nbsp;数 </span><input
						id="count" name="count" type="number"
						class="ui-input ui-radius ui-shadow border-solid contact-count-input" />
				</div>
				<div>
					<span class="type-ahead">到店自动上菜<input id="isServingArrived"
						name="count" type="checkbox" />(需要预先提交订单总价30%的订金)
					</span>
				</div>
				<div>
					<span class="type-ahead">备&nbsp;&nbsp;&nbsp;&nbsp;注 </span>
					<textarea id="memo" name="memo" style="height: 55px; width: 250px"
						class="ui-input ui-radius ui-shadow border-solid contact-count-input"></textarea>
				</div>
			</div>
			<div id="arriveTimeOptionAlert">到店时间：</div>
			<div id="arriveTimeOptions" class="arrive-time-options"></div>
			<div class="operates">
				<a id="submitBooking" class="ui-btn ui-shadow"><span
					class="ui-gray-circle"><img src="../images/check-white.png"
						align="提交" /></span>&nbsp;确认预订</a>
			</div>
		</div>
	</div>
</body>
</html>

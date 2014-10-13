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
<title>预订记录</title>
<style type="text/css">
body {
	font-family: "宋体";
	font-size: 12px;
}

.content {
	font-size: 1.2em;
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

.odd-background {
	background-color: #DFDFFF;
}

.even-background {
	background-color: #CCC;
}

.book-record-item {
	padding: 10px 5px;
}

.book-record-info {
	display: inline-block;
}

.book-record-operates {
	display: inline-block;
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

.dishOrderItemListPanel {
	padding: 0.2em;
	min-height: 1em;
	background-color: #EEE;
}

.orderItem {
	outline: none;
	cursor: pointer;
	text-decoration: none;
	font: 14px/100% Arial, Helvetica, sans-serif;
	padding: .5em 1em .55em;
	-webkit-border-radius: .5em;
	-moz-border-radius: .5em;
	border-radius: .5em;
	-webkit-box-shadow: 0 1px 2px rgba(0, 0, 0, .2);
	-moz-box-shadow: 0 1px 2px rgba(0, 0, 0, .2);
	box-shadow: 0 1px 2px rgba(0, 0, 0, .2);
	margin: 0.1em;
	display: inline-block;
	text-align: left;
	background-color: #CCC;
}
</style>
</head>

<body>
	<div style="padding: 0em .5em .5em 0em; min-height: 4.5em">
		<a class="left ui-btn ui-shadow"
			href="bookIndex?storeId=${storeId }&&openId=${openId}&&userId=${userId}"><span
			class="ui-gray-circle"><img src="../images/carat-l-white.png" /></span>&nbsp;返回</a>
	</div>
	<div class="content">
		<c:forEach items="${bookRecordList}" var="bookRecord"
			varStatus="bookRecordCount">
			<div
				class="book-record-item ${bookRecordCount.index%2!=0?'':'odd-background' }">
				<div class="book-record-info">
					<c:choose>
						<c:when test="${bookRecord.state==0 }">
							<del style="color: red;">预订${bookRecord.expectedArriveTimeToStr }${bookRecord.resourceName }</del>
						</c:when>
						<c:otherwise>
							<span>预订${bookRecord.expectedArriveTimeToStr }${bookRecord.resourceName }</span>
						</c:otherwise>
					</c:choose>
				</div>
				<div class="book-record-operates right">
					<c:choose>
						<c:when test="${bookRecord.state==0 }">
							<span>已取消</span>
						</c:when>
						<c:when test="${bookRecord.state==2 }">
							<span>店家已确认</span>
						</c:when>
						<c:otherwise>
							<a
								href="cancelBook?bookRecordId=${bookRecord.id }&customerUserId=${bookRecord.customerUserId}&storeId=${storeId}&openId=${openId}">取消预订</a>
						</c:otherwise>
					</c:choose>
				</div>
			</div>
			<div class="dishOrderItemListPanel">
				<c:if test="${! empty bookRecord.dishOrder.orderItems }">
					<c:forEach items="${bookRecord.dishOrder.orderItems }"
						var="orderItem">
						<div class="orderItem">${orderItem.dishName }</div>
					</c:forEach>
				</c:if>
			</div>
		</c:forEach>
	</div>
</body>
</html>

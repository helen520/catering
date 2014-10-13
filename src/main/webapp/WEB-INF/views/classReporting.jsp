<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>交班报表</title>
<script type="text/javascript" src="../js/vendor/jquery-1.10.1.min.js"></script>
<script type="text/javascript"
	src="../js/vendor/jquery.i18n.properties-1.0.9.js"></script>

<script type="text/javascript" src="../js/vendor/Calendar3.js"></script>

<script type="text/javascript" src="../js/reporting.js"></script>
<script type="text/javascript">
function selectedChange() {
	if ($("#ADTSelect").val() != "") {
		var adt = parseInt($("#ADTSelect").val());
		$("#archivedTimeHide").val(adt);
	} else {
		$("#ADTLabel").text("");
		$("#archivedTimeHide").val("");
	}
}

function search(thisBtn) {
	if (thisBtn.form.archivedTime.value == "") {
		alert("请选择交班日期！");
		return;
	}

	thisBtn.form.submit();
}
</script>

<style>
body {
	width: 800px;
	margin: 0px auto;
	padding-bottom: 200px;
}

table {
	border: 1px solid #999;
	border-spacing: 0px;
}

th {
	border: 1px solid #999;
	padding: 2px;
	background-color: #DDD;
}

td {
	border: 1px solid #999;
	padding: 2px;
}

input[type=text] {
	width: 100px;
}
</style>
</head>
<body>
	<div id="ReportTablesDiv" style="width: 800px">
		<%@ include file="reportListTop.jsp"%>
		<h3>交班报表:</h3>
		<div>
			<form action="classReporting" method="GET">
				<input type="hidden" value="${storeId}" name="storeId" id="storeId">

				<select id="ADTSelect" onchange="selectedChange();">
					<option value="">请选择</option>

					<c:forEach items="${ archivingTimeMapList}" var="archivingTime">
						<option value="${archivingTime.key}"
							${archivedTime==archivingTime.key?"selected='selected'":""}>${archivingTime.value}</option>
					</c:forEach>

				</select> <input type="hidden" id="archivedTimeHide" name="archivedTime"
					value="${archivedTime}" /> <label id="ADTLabel">ADT:${archivedTime}</label>
				<input onclick="search(this)" type="button" value="查看报表" />
			</form>
		</div>
		<br /> <input type="button" value="导出当前报表"
			onclick="window.location.href='getReportingCSVFile?storeId=${storeId}&reportType=classReporting&archivedTime=${archivedTime}'"></input>
		<table id="DishOrderTable" summary="" style="width: 800px;">
			<thead>
				<tr id="DishOrderTr">
					<th id="IDTh">ID</th>
					<th>时间</th>
					<th>台名</th>
					<th>人数</th>
					<th>消费金额</th>
					<th>折扣率</th>
					<th>折后金额</th>
					<th>服务费</th>
					<th>应收</th>

					<th>备注</th>
				</tr>
			</thead>
			<tbody id="DishOrderTBody">
				<c:forEach items="${ financeObject.dishOrders}" var="finance"
					varStatus="financeStatus">
					<tr>
						<td><a style="cursor: pointer; text-decoration: none;"
							href="dishOrderWithItems?dishOrderId=${finance.id}">${finance.id}</a>
						</td>
						<td><script type="text/javascript">
							var millisecondStr = (${finance.createTime});
							var millisecond = Number(millisecondStr);
							var date = new Date(millisecond);
							var year = date.getFullYear();
							var month = date.getMonth() + 1;
							var show_date = year + "年" + month + "月"
									+ date.getDate() + "日";

							document.write(show_date);
						</script></td>
						<td>${finance.deskName}</td>
						<td>${finance.customerCount}</td>
						<td><fmt:formatNumber value="${finance.totalPrice}"
								pattern="#.##" maxFractionDigits="2"></fmt:formatNumber></td>
						<td><fmt:formatNumber value="${finance.discountRate}"
								pattern="#.##" maxFractionDigits="2"></fmt:formatNumber></td>
						<td><fmt:formatNumber value="${finance.discountedPrice}"
								pattern="#.##" maxFractionDigits="2"></fmt:formatNumber></td>
						<td><fmt:formatNumber value="${finance.serviceFee}"
								pattern="#.##" maxFractionDigits="2"></fmt:formatNumber></td>
						<td><fmt:formatNumber
								value="${finance.discountedPrice+finance.serviceFee}"
								pattern="#.##" maxFractionDigits="2"></fmt:formatNumber></td>

						<td>${finance.memo}</td>
					</tr>
				</c:forEach>
			</tbody>
		</table>
		<br />
		<table id="DepartmentStatTable" summary="" style="width: 800px;">
			<thead>
				<tr id="DepartmentStatTr">
					<th>部门</th>
					<th>出品数</th>
					<th>总原价</th>
					<th>折后总价</th>
					<th>总折扣</th>
					<th>总服务费</th>
					<th>优惠券</th>
					<th>总价</th>
				</tr>
			</thead>
			<tbody id="DepartmentStatTBody">
				<c:forEach items="${ financeObject.departmentStats}" var="finance"
					varStatus="financeStatus">
					<tr>
						<td>${finance.departmentName}</td>
						<td ${finance.orderItemCount==0?"style='color:gray'":""}>${finance.orderItemCount}</td>

						<td ${finance.totalOrgPrice==0?"style='color:gray'":""}><fmt:formatNumber
								value="${finance.totalOrgPrice}" pattern="#.##"
								maxFractionDigits="2"></fmt:formatNumber></td>
						<td ${finance.totalDiscountedPrice==0?"style='color:gray'":""}>

							<fmt:formatNumber value="${finance.totalDiscountedPrice}"
								pattern="#.##" maxFractionDigits="2"></fmt:formatNumber>
						</td>
						<td
							${(finance.totalOrgPrice - finance.totalDiscountedPrice)==0?"style='color:gray'":""}>

							<fmt:formatNumber
								value="${finance.totalOrgPrice	- finance.totalDiscountedPrice}"
								pattern="#.##" maxFractionDigits="2"></fmt:formatNumber>
						</td>
						<td ${finance.totalServiceFee==0?"style='color:gray'":""}><fmt:formatNumber
								value="${finance.totalServiceFee}" pattern="#.##"
								maxFractionDigits="2"></fmt:formatNumber></td>
						<td ${finance.totalCouponValue==0?"style='color:gray'":""}><fmt:formatNumber
								value="${finance.totalCouponValue}" pattern="#.##"
								maxFractionDigits="2"></fmt:formatNumber></td>
						<td ${finance.totalFinalPrice==0?"style='color:gray'":""}><fmt:formatNumber
								value="${finance.totalFinalPrice}" pattern="#.##"
								maxFractionDigits="2"></fmt:formatNumber></td>
					</tr>
				</c:forEach>
			</tbody>
		</table>
		<br />
		<table id="FinanceStatTable" summary="" style="width: 800px">
			<thead>

				<tr id="FinanceStatTr">
					<th>订单数</th>
					<th>总人数</th>
					<th>折前总价</th>
					<th>折后总价</th>
					<th>总服务费</th>
					<th>人均消费</th>
					<th>应收款</th>

				</tr>
			</thead>
			<tbody id="FinanceStatTBody">
				<tr>
					<td>${financeObject.dishOrderCount}</td>
					<td>${financeObject.customerCount}</td>
					<td><fmt:formatNumber value="${financeObject.totalPrice}"
							pattern="#.##" maxFractionDigits="2"></fmt:formatNumber></td>
					<td><fmt:formatNumber
							value="${financeObject.totalDiscountedPrice}" pattern="#.##"
							maxFractionDigits="2"></fmt:formatNumber></td>
					<td><fmt:formatNumber value="${financeObject.totalServiceFee}"
							pattern="#.##" maxFractionDigits="2"></fmt:formatNumber></td>
					<td><fmt:formatNumber
							value="${(financeObject.totalDiscountedPrice+financeObject.totalServiceFee)/financeObject.customerCount}"
							pattern="#.##" maxFractionDigits="2"></fmt:formatNumber></td>
					<td><fmt:formatNumber
							value="${financeObject.totalDiscountedPrice+financeObject.totalServiceFee}"
							pattern="#.##" maxFractionDigits="2"></fmt:formatNumber></td>

				</tr>
			</tbody>
		</table>
		<br />
		<table id="PaymentStatTable" summary="" style="width: 800px;">
			<thead>
				<tr id="PaymentStatTr">
					<th>收入项目</th>
					<th>记录数</th>
					<th>原币</th>
					<th>汇率</th>
					<th>金额</th>
				</tr>
			</thead>
			<tbody id="PaymentStatTBody">
				<c:forEach items="${ financeObject.paymentStats}" var="finance"
					varStatus="financeStatus">
					<tr>
						<td>${finance.typeName}</td>
						<td>${finance.payRecordCount}</td>
						<td><fmt:formatNumber value="${finance.totalAmount}"
								pattern="#.##" maxFractionDigits="2"></fmt:formatNumber></td>
						<td><fmt:formatNumber value="${finance.exchageRate}"
								pattern="#.##" maxFractionDigits="2"></fmt:formatNumber></td>
						<td><fmt:formatNumber value="${finance.transferedAmount}"
								pattern="#.##" maxFractionDigits="2"></fmt:formatNumber></td>
					</tr>
				</c:forEach>
			</tbody>
		</table>
		<div style="text-align: right; line-height: 2em; font-weight: 600;">
			<span id="totalPaying">实收款总额:</span>

			<fmt:formatNumber value="${financeObject.sumOfPayRecordAmount}"
				pattern="#.##" maxFractionDigits="2"></fmt:formatNumber>
		</div>
	</div>

</body>
</html>


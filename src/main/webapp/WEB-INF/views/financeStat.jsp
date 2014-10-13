<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>报表</title>

<script type="text/javascript" src="../js/vendor/Calendar3.js"></script>

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
		<h3>时间戳报表</h3>
		<div>
			<form action="financeStat" method="GET">
				<input type="hidden" value="1" name="storeId" id="storeId">
				<input name="startDate" value="${startDate}" type="text" id="startDate" size="10" maxlength="10" onclick="new Calendar().show(this);" readonly="readonly" />
				<span id="until">至</span> 
				<input name="endDate" type="text" id="endDate" size="10" maxlength="10" onclick="new Calendar().show(this);" readonly="readonly" value="${endDate }" />
			
				<input type="submit" value="查看报表" />
			</form>
		</div>
		<br />
		<table id="DishOrderTable" summary="" style="width: 800px;">
			<thead>
				<tr>
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
				<c:forEach items="${ financeObject.dishOrders}" var="finance" varStatus="financeStatus">
					<tr>
						<td style="cursor: pointer;">${finance.id}</td>
						<td style="cursor: pointer;"><script type="text/javascript">
							var millisecondStr = $
							{
								finance.createTime
							};
							var millisecond = Number(millisecondStr);
							var date = new Date(millisecond);
							var show_date = date.getFullYear() + "年" + date.getMonth() + "月" + date.getDate() + "日"

							document.write(show_date);
						</script></td>
						<td>${finance.deskName}</td>
						<td>${finance.customerCount}</td>
						<td>${finance.totalPrice}</td>
						<td>${finance.discountRate}</td>
						<td>${finance.discountedPrice}</td>
						<td>${finance.serviceFee}</td>
						<td>${finance.discountedPrice+finance.serviceFee}</td>

						<td>${finance.memo}</td>
					</tr>
				</c:forEach>
			</tbody>
		</table>
		<br />
		<table summary="" style="width: 800px;">
			<thead>
				<tr>
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
				<c:forEach items="${ financeObject.departmentStats}" var="finance" varStatus="financeStatus">
					<tr>
						<td>${finance.departmentName}</td>
						<td ${finance.orderItemCount==0?"style='color:gray'":""}>${finance.orderItemCount}</td>
						<td ${finance.totalOrgPrice==0?"style='color:gray'":""}>${finance.totalOrgPrice}</td>
						<td ${finance.totalDiscountedPrice==0?"style='color:gray'":""}>${finance.totalDiscountedPrice}</td>
						<td ${(finance.totalOrgPrice - finance.totalDiscountedPrice)==0?"style='color:gray'":""}>${finance.totalOrgPrice
							- finance.totalDiscountedPrice}</td>
						<td ${finance.totalServiceFee==0?"style='color:gray'":""}>${finance.totalServiceFee}</td>
						<td ${finance.totalCouponValue==0?"style='color:gray'":""}>${finance.totalCouponValue}</td>
						<td ${finance.totalFinalPrice==0?"style='color:gray'":""}>${finance.totalFinalPrice}</td>
					</tr>
				</c:forEach>
			</tbody>
		</table>
		<br />
		<table summary="" style="width: 800px">
			<thead>

				<tr>
					<th>订单数</th>
					<th>折前总价</th>
					<th>折后总价</th>
					<th>总服务费</th>
					<th>应收款</th>

				</tr>
			</thead>
			<tbody id="FinanceStatTBody">
				<tr>
					<td>${financeObject.dishOrderCount}</td>
					<td>${financeObject.totalPrice}</td>
					<td>${financeObject.totalDiscountedPrice}</td>
					<td>${financeObject.totalServiceFee}</td>
					<td>${financeObject.totalDiscountedPrice+financeObject.totalServiceFee}</td>

				</tr>
			</tbody>
		</table>
		<br />
		<table summary="" style="width: 800px;">
			<thead>
				<tr>
					<th>收入项目</th>
					<th>记录数</th>
					<th>原币</th>
					<th>汇率</th>
					<th>金额</th>
				</tr>
			</thead>
			<tbody id="PaymentStatTBody">
				<c:forEach items="${ financeObject.paymentStats}" var="finance" varStatus="financeStatus">
					<tr>
						<td>${finance.typeName}</td>
						<td>${finance.payRecordCount}</td>
						<td>${finance.totalAmount}</td>
						<td>${finance.exchageRate}</td>
						<td>${finance.transferedAmount}</td>
					</tr>
				</c:forEach>
			</tbody>
		</table>
		<div style="text-align: right; line-height: 2em; font-weight: 600;">实收款总额: ${financeObject.sumOfPayRecordAmount }</div>
	</div>

</body>
</html>


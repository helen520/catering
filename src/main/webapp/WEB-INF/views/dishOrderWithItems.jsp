<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ page language="java" contentType="text/html;charset-utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<title>订单项明细</title>
<style>
body {
	width: 800px;
	margin: 0px auto;
	padding-bottom: 200px;
}

table {
	border: 1px solid #000;
	border-spacing: 0px;
}

th {
	border: 1px solid #000;
	padding: 2px;
	background-color: #DDD;
}

td {
	border: 1px solid #000;
	padding: 2px;
}

input[type=text] {
	width: 100px;
}
</style>
</head>
<body>

	<h3 id="GoBackDish2DishCategory">
		<%-- 		<a id="GoBackLink" href="dishSellStats?storeId=${storeId}&dishCategoryId=${dishCategoryId}&startDate=${startDate}&endDate=${endDate}">返回</a> --%>
	</h3>
	<h3>订单项明细</h3>

	<table id="DishOrderDetailsTable" summary="">
		<tbody id="DishOrderDetailsTBody">

			<tr>
				<td colspan="3">${dishOrder.id}@${dishOrder.createTimeStr}</td>
			</tr>
			<tr style="font-weight: bold;">
				<td>桌号:${dishOrder.deskName}</td>
				<td>人数:${dishOrder.customerCount}</td>
				<td>实收: <c:set var="payAmount" value="0"></c:set> <c:forEach
						items="${dishOrder.payRecords}" var="payRecord">
						<c:set var="payAmount"
							value="${payAmount+payRecord.amount*payRecord.exchangeRate }"></c:set>
					</c:forEach> <fmt:formatNumber value="${payAmount}" pattern="#.##"
						maxFractionDigits="2"></fmt:formatNumber>
				</td>
			</tr>
			<tr>
				<td colspan="3">原价:<fmt:formatNumber
						value="${dishOrder.totalPrice}" pattern="#.##"
						maxFractionDigits="2"></fmt:formatNumber> * 折扣率:<fmt:formatNumber
						value="${dishOrder.discountRate}" pattern="#.##"
						maxFractionDigits="2"></fmt:formatNumber> = 折后价:<fmt:formatNumber
						value="${dishOrder.discountedPrice}" pattern="#.##"
						maxFractionDigits="2"></fmt:formatNumber> +<br />服务费:<fmt:formatNumber
						value="${dishOrder.serviceFee}" pattern="#.##"
						maxFractionDigits="2"></fmt:formatNumber> * 服务费率:<fmt:formatNumber
						value="${dishOrder.serviceFeeRate}" pattern="#.##"
						maxFractionDigits="2"></fmt:formatNumber> = 应收:<fmt:formatNumber
						value="${dishOrder.discountedPrice+dishOrder.serviceFee}"
						pattern="#.##" maxFractionDigits="2"></fmt:formatNumber>

				</td>
			</tr>
			<tr>
				<td colspan="10">

					<table>
						<c:forEach items="${dishOrder.orderItems}" var="orderItem">
							<tr id="OrderItemTr">
								<td style="width: 200px;"><c:choose>
										<c:when test="${orderItem.state==7}">
											<span
												style="text-decoration: underline line-through; color: red;">
												${orderItem.amount} * ${orderItem.dishName} </span>
											<br />&nbsp;&nbsp;操作:${orderItem.employeeName}
											<br />&nbsp;&nbsp;原因:${orderItem.cancelReason}<br />
										</c:when>
										<c:otherwise>
											<span>${orderItem.amount} * ${orderItem.dishName}</span>
										</c:otherwise>
									</c:choose><br /> <span style="color: gray; font-size: small;">&nbsp;&nbsp;备注:${orderItem.memo}<br />&nbsp;&nbsp;<label
										id="OrderItemDepartmentLabel">做法:${orderItem.tagText}</label>
										<br />&nbsp;&nbsp;<label id="OrderItemCreateTimeLabel">下单时间:${orderItem.createTimeStr}</label>
										<br />&nbsp;&nbsp; <%-- 									<label
									id="OrderItemCookingNotePrintedTimeLabel">${orderItem.cookingNotePrintedTime}</label> --%>
										<br />&nbsp;&nbsp;Id:${orderItem.id}
								</span></td>
								<td><fmt:formatNumber value="${orderItem.price}"
										pattern="#.##" maxFractionDigits="2"></fmt:formatNumber> <input
									id="DishIDTextInput" type="text" value="${orderItem.dishId}"
									style="display: none" /></td>
							</tr>

						</c:forEach>
					</table>

				</td>
			</tr>

		</tbody>
	</table>

</body>
</html>








<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<div id="checkoutView" style="display: none;">
	<div id="dishOrderViewTop" style="text-align: center;">预付款</div>
	<div style="padding-top: 3em; text-align: center;">
		<div>
			当前可用余额为 : <span id="balance" class="dishOrderDetailLabel"></span>
		</div>
		<br>
		<div id="prePay_infos">
			<span>订单价格 : <span id="prePay_dishOrder_price"
				class="dishOrderDetailLabel"></span></span>
			<p>
				预付 : <input id="prePay_price" class="paymentType">(至少为订单总价的30%)
			</p>
			<p id="areadyPrePay_note" style="display: none;">
				您已成功预付<span id="areadyPrePay"></span>，请按左上角 "<" 符号退出页面!
			</p>
		</div>
	</div>
	<div class="viewBottom">
		<div style="width: 100%; float: left; text-align: center;">
			<div id="prePayDishOrderButton" class="dishOrderCmdButton">提交</div>
		</div>
	</div>
</div>
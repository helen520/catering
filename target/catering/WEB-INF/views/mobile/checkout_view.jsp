<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<div id="checkoutView" style="display: none;">
	<div id="checkoutViewContent" class="overthrow">
		<div id="deskInfo" class="caption" align="center"></div>
		<fieldset>
			<legend style="text-align: left;">价格</legend>
			<div id="discountRate"></div>
			<div id="serviceFeeRate"></div>
			<div id="priceInfo" style="padding: .2em"></div>
			<div id="actualPayDiv"></div>
			<div>
				备注:<input type="text" id="dishOrderMemoInput">
			</div>
		</fieldset>
		<fieldset>
			<legend style="text-align: left;">付款</legend>
			<div id="paymentTypes"></div>
		</fieldset>
		<fieldset>
			<legend style="text-align: left;">会员</legend>
			<div id="bindMemberButton" class="button">关联会员</div>
			<div id="userAccountInfo"></div>
		</fieldset>
		<div id="orderItemListCaption">
			<div id="yiDianCaiPinLieBiao"
				style="padding: 0.5em; display: inline-block">已点菜品列表</div>
		</div>
		<div id="dishOrderItemList" class="centerDiv"></div>
	</div>
	<div class="viewBottom">
		<div class="dishOrderCmdButton floatRight" id="confirmCheckoutButton">确认付款</div>
		<div class="dishOrderCmdButton" id="prePrintCheckoutBillButton">预打结账单</div>
		<button class="dishOrderCmdButton floatLeft" id="cancelCheckoutButton">取消付款</button>
	</div>
</div>
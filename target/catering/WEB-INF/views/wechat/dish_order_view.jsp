<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<div id="dishOrderView" style="display: none;">
	<div id="dishOrderViewTop"></div>
	<div id="dishOrderItemList" class="overthrow"></div>
	<div class="viewBottom">
		<div style="font-size: 14px;">
			<span id="dov_string_renShu"> 人数</span>: <label
				id="customerCountLabel" class="numberButton">0</label>&nbsp;&nbsp; <span>
				桌号</span>: <input id="deskNoLabel" class="numberButton"
				style="width: 5em;"></input>&nbsp;&nbsp;
			<span id="dov_string_total_price">总价</span>: <span
				id="totalPriceLabel">0</span>&nbsp;&nbsp; <span
				id="dov_string_prePay_price">预付: <span id="prePayPriceLabel">0</span>
			</span>
		</div>
		<hr />
		<div>
			<div style="width: 30%; float: left; text-align: left;">
				<div id="returnToDishViewButton" class="dishOrderCmdButton">返回</div>
			</div>
			<div style="width: 40%; float: left; text-align: center;">
				<div id="dishOrderTagsButton" class="dishOrderCmdButton">整单做法</div>
			</div>
			<div style="width: 30%; float: left; text-align: right;">
				<div id="submitDishOrderButton" class="dishOrderCmdButton">下单</div>
			</div>
		</div>
	</div>
</div>

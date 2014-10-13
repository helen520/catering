<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<div id="dishOrderView" style="display: none;">
	<div id="dishOrderViewTop"></div>
	<div id="dishOrderItemList" class="overthrow"></div>
	<div class="viewBottom">
		<div style="font-size: 14px;">
			<span id="dov_string_deskNum">桌号</span>:
			 <span id="deskNameLabel">0</span>&nbsp;&nbsp;
			 <span id="dov_string_renShu"> 人数</span>:
			  <span
				id="customerCountLabel">0</span>&nbsp;&nbsp; 
				<span id="dov_string_total_price">总价</span>: <span
				id="totalPriceLabel">0</span>
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

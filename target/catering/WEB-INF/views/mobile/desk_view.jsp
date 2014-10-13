<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<div id="deskView" style="display: block;">
	<div class="topControlPanel">
		<div class="functionButtons">
			<button id="bookingRecordsButton"
				class="functionButton bookingRecordsButton"></button>
			<button id="selfDishOrdersButton"
				class="functionButton selfDishOrdersButton"></button>
			<button id="functionMenuButton" class="functionButton">更多</button>
		</div>
		<div id="deskGroupSelector">
			<!-- 	drawDeskGroups   -->
		</div>
	</div>
	<div id="deskSelector" class="overthrow">
		<!--      drawDesks      -->
	</div>
	<div id="statInfoPanel">
		<div class="caption">请选择台号以进行操作</div>
	</div>
	<div id="deskPanel">
		<div id="deskBriefDiv" class="caption">
			<label id="deskNameLabel"></label> <label id="customerCountLabel"
				class="numberButton">8人</label> <label id="totalPriceLabel">¥100.0</label>
			<label id="dishOrderBriefId"></label> <label id="dishOrderCreateTime"></label>
		</div>
		<div id="orderItemListDiv" class="overthrow">
			<!-- drawDishOrderInfo -->
		</div>
		<div id="deskOperationPanel" class="overthrow">
			<div class="dishOrderCmdButton" id="createDishOrderButton">开台</div>
			<div class="dishOrderCmdButton" id="orderDishesButton">点菜</div>
			<div class="dishOrderCmdButton" id="payDishOrderButton">结帐</div>
			<div class="dishOrderCmdButton" id="changeDeskButton">转台</div>
			<div class="dishOrderCmdButton" id="mergeDishOrderButton">并单</div>
			<div class="dishOrderCmdButton printButton"
				id="printCustomerNoteButton">打楼面单</div>
			<div class="dishOrderCmdButton printButton"
				id="reprintCustomerNoteButton">重打楼面单</div>
		</div>
	</div>
</div>

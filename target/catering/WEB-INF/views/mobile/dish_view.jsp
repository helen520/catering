<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<div id="dishView" style="display: none;">
	<div id="dishViewTop">
		<span id="dv_string_search_str">查找</span>: <input type="text"
			name="dishFilterTextInput" style="width: 5em">
		<button id="searchDishButton" class="button">搜索</button>
		<button id="clearDishFilterButton" class="button">清空</button>
		<span id="showPictureSpan" style="display: none;"><label
			for="showPictureCheckBox"> 显示图片</label><input
			id="showPictureCheckBox" type="checkbox"></span>

	</div>
	<div id="dishCategorySelector" class="overthrow">
		<button id="menuButton" class="button"></button>
		<ul id="dishCategoryList"></ul>
	</div>
	<div id="dishList" class="overthrow"></div>
	<div id="dishPickerContainer"></div>
	<div class="viewBottom">
		<button id="cancelDishOrderButton"
			class="dishOrderCmdButton floatLeft">取消</button>
		<button id="showSearchKeyboardButton"
			class="dishOrderCmdButton floatLeft">键盘</button>
		<button id="freeHandwriteButton" class="dishOrderCmdButton floatLeft">自由写</button>
		<button id="confirmDishOrderButton"
			class="dishOrderCmdButton floatRight">已点</button>
	</div>
</div>
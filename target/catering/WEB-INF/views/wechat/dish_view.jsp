<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<div id="dishView" style="display: none;">
	<div id="dishViewTop">
		<span id="dv_string_search_str">查找</span>: <input type="text"
			name="dishFilterTextInput" style="width: 5em">
		<button id="searchDishButton" class="button">搜索</button>
		<button id="clearDishFilterButton" class="button">清空</button>
		<label for="showPictureCheckBox"> 显示图片</label><input
			id="showPictureCheckBox" type="checkbox">
	</div>
	<div id="dishCategorySelector" class="overthrow">
		<button id="menuButton" class="button"></button>
		<ul id="dishCategoryList"></ul>
	</div>
	<div id="dishList" class="overthrow"></div>
	<div class="viewBottom">
		<button id="showSearchKeyboardButton"
			class="dishOrderCmdButton floatLeft">键盘</button>
		<button id="confirmDishOrderButton"
			class="dishOrderCmdButton floatRight">已点菜品</button>
	</div>
</div>
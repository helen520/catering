var currentMenuIndex;
var currentDishCategoryId;
var inFreeHandwriteMode = false;
var filteredDishes = [];
var dishPicker;

function initDishView() {

	$("#cancelDishOrderButton", "#dishView").click(cancelDishOrderButtonClick);

	$("#showSearchKeyboardButton", "#dishView").click(
			function() {
				if (searchInputDailog) {
					searchInputDailog.toggle();
				} else {
					$("[name='dishFilterTextInput']", "#dishView").val("");
					showSearchInputDailog(searchDishButtonOnClick, false)
							.addClass("searchInputDailog");
				}
			});

	$("#freeHandwriteButton", "#dishView").click(toggleFreeHandwriteMode);

	$("#confirmDishOrderButton", "#dishView").click(function() {
		hideSearchInputDailog();
		switchToView("DISH_ORDER_VIEW");
	});

	$("#showPictureCheckBox", "#dishView").click(function() {
		renderDishes();
	});

	$("#showPictureCheckBox", "#dishView").click(function() {
		renderDishes();
	});

	$("#menuButton", "#dishView").click(function() {
		currentMenuIndex++;
		renderMenu();
	});

	$("#searchDishButton", "#dishView").click(searchDishButtonOnClick);

	$("#clearDishFilterButton", "#dishView").click(function() {
		$("[name='dishFilterTextInput']", "#dishView").val("");
	});

}

function searchDishButtonOnClick() {
	var filterText = $("[name='dishFilterTextInput']", "#dishView").val();
	filteredDishes = [];
	if (filterText != "") {
		filteredDishes = filterDishes(filterText);
		currentDishCategoryId = -1;
	} else {
		return;
	}

	renderDishes();
}

function filterDishes(filterText) {
	var result = [];
	for ( var i in $dishMap) {
		var dish = $dishMap[i];
		if (containText(filterText, dish.name)
				|| containText(filterText, dish.alias)
				|| containText(filterText, dish.indexCode)
				|| containText(filterText, dish.quickIndexCode))
			result.push($dishMap[i]);
		if (result.length > 19)
			break;
	}

	return result;

	function containText(pattern, text) {
		if (!text) {
			return false;
		}

		var index = 0;
		for (var i = 0; i < pattern.length; i++) {
			index = text.indexOf(pattern[i], index);
			if (index < 0)
				return false;
			index++;
		}
		return true;
	}
}

function showDishView() {

	currentMenuIndex = 0;
	currentDishCategoryId = 0;
	if ($storeData.menus.length < 2) {
		$('#menuButton').hide();
	}

	if (isSearchBookingDishOrder || isShowSelfDishOrder) {
		$("#cancelDishOrderButton", "#dishView").text("还原订单");
	}

	if ($isBlock) {
		$("#showPictureSpan", "#dishView").hide();
	} else
		$("#showPictureSpan", "#dishView").show();

	inFreeHandwriteMode = true;
	toggleFreeHandwriteMode();

	$("#dishView").show();
}

function toggleFreeHandwriteMode() {
	inFreeHandwriteMode = !inFreeHandwriteMode;

	$("#dishViewTop", "#dishView").hide();
	$("#dishCategorySelector", "#dishView").hide();
	$("#dishList", "#dishView").hide();
	$("#dishPickerContainer", "#dishView").hide();
	$("[name='dishFilterTextInput']", "#dishView").val("");

	hideSearchInputDailog();

	if (inFreeHandwriteMode) {

		if (dishPicker == null) {
			dishPicker = new DishPicker($('#dishPickerContainer', "#dishView"),
					dishSelectedCallback, true);
		} else {
			dishPicker.refreshUI();
		}

		$("#dishPickerContainer", "#dishView").show();
	} else {
		renderMenu();
		changeSearchInputCallBack(searchDishButtonOnClick);
		$("#dishViewTop", "#dishView").show();
		$("#dishCategorySelector", "#dishView").show();
		$("#dishList", "#dishView").show();
	}
}

function cancelDishOrderButtonClick() {

	hideSearchInputDailog();
	showConfirmDialog("警告", "确定取消点菜？", function() {
		showLoadingDialog($.i18n.prop('string_dingDanQuXiaoZhong'));
		if (!$curDishOrder || $curDishOrder == null) {
			switchToView("DESK_VIEW");
			hideLoadingDialog();
			return;
		}

		if (isSearchBookingDishOrder || isShowSelfDishOrder) {
			restoreBookingDishOrder();
			return;
		}

		if ($curDishOrder.state == DISH_ORDER_STATE.CREATING) {
			$.ajax({
				type : 'POST',
				url : "../ordering/cancelDishOrder",
				data : {
					employeeId : $storeData.employee.id,
					dishOrderId : $curDishOrder.id
				},
				dataType : 'json',
				error : function(error) {
					hideLoadingDialog();
					showAlertDialog($.i18n.prop('string_cuoWu'),
							error.responseText);
				},
				success : function(dishOrder) {
					updateDishOrderCache(dishOrder);
					switchToView("DESK_VIEW");
					hideLoadingDialog();
				}
			});
		} else {
			if ($curDishOrder.orderItems) {
				var oiList = [];
				for ( var i in $curDishOrder.orderItems) {
					if ($curDishOrder.orderItems[i].id != 0) {
						oiList.push($curDishOrder.orderItems[i]);
					}
				}
				$curDishOrder.orderItems = oiList;
			}
			updateDishOrderPrice($curDishOrder);
			switchToView("DESK_VIEW");
			hideLoadingDialog();
		}
	});
}

function renderMenu() {
	if ($storeData.menus.length == 0) {
		return;
	}

	$('#dishCategoryList').empty();
	$('#dishList').empty();

	currentMenuIndex %= $storeData.menus.length;
	var menu = $storeData.menus[currentMenuIndex];
	$('#menuButton').text(menu.name);

	for ( var i in menu.dishCategories) {
		var dishCategory = menu.dishCategories[i];
		currentDishCategoryId = !currentDishCategoryId ? dishCategory.id
				: currentDishCategoryId;

		var listItem = $("<li>").attr("name", "dishCategoryLi").text(
				dishCategory.name).click(dishCategoryClick).data(
				"dishCategoryId", dishCategory.id);

		if (currentDishCategoryId == dishCategory.id) {
			listItem.css("font-weight", " bold");
		}

		var count = 0;
		var orderItems = $curDishOrder.orderItems;
		for ( var i in orderItems) {
			var orderItem = orderItems[i];
			if (orderItem.id == 0) {
				for ( var j in dishCategory.dishes) {
					var dish = dishCategory.dishes[j];
					if (orderItem.dishId == dish.id
							&& orderItem.mealDealItemId == null) {
						count += orderItem.amount;
					}
				}
			}
		}
		if (count != 0) {
			$('<span>').text(count).appendTo(listItem);
		}
		listItem.appendTo('#dishCategoryList');
	}

	renderDishes();
	if (dishPicker) {
		dishPicker.refreshUI();
	}
}

function dishCategoryClick() {
	currentDishCategoryId = $(this).data("dishCategoryId");
	$("li[name='dishCategoryLi']").removeAttr("style");
	$(this).css("font-weight", " bold");

	renderDishes();
}

function renderDishes() {

	$('#dishList').empty();

	var dishCategory = $dishCategoryMap[currentDishCategoryId];
	if (currentDishCategoryId != -1 && !dishCategory) {
		return;
	}

	var dishIndex = 0;
	var selectedDesk = $deskMap[$curDishOrder.deskId];

	var dishes = currentDishCategoryId == -1 ? filteredDishes
			: dishCategory.dishes;
	for ( var i in dishes) {
		var dish = dishes[i];
		if (!dish.enabled) {
			continue;
		}
		var dishDiv = null;
		dishIndex += 1;
		if ($isBlock) {
			dishDiv = getBlockDishDiv(dishIndex, dish, selectedDesk);
		} else
			dishDiv = getDishDiv(dishIndex, dish, selectedDesk);

		$('#dishList').append(dishDiv);
	}
}

function containText(pattern, text) {
	var index = 0;
	for (var i = 0; i < pattern.length; i++) {
		index = text.indexOf(pattern[i], index);
		if (index < 0)
			return false;
		index++;
	}
	return true;
}

function getDishDiv(index, dish, selectedDesk) {

	var dishDiv = $('<div>').addClass('dishDiv')
			.attr("id", "dishDiv" + dish.id);
	if (!$curDishOrder) {
		return dishDiv;
	}

	if ($("#showPictureCheckBox")[0].checked && dish.picPath != null
			&& dish.picPath != "") {
		$('<img>').attr("src", dish.picPath).data("dish", dish).addClass(
				"dishImageClass").click(showDishImageDialog).appendTo(dishDiv);
	}

	var dishInfoDiv = $('<div>').addClass("dishInfoDiv").appendTo(dishDiv);
	var dishNameDiv = $('<div>').text(index + "." + dish.name).addClass(
			'dishNameDiv').appendTo(dishInfoDiv);
	var dishPriceAndUnit = $('<div>').addClass("dishPriceDiv").appendTo(
			dishInfoDiv);
	var dishPriceAndUnitText = "￥" + dish.price;
	dishPriceAndUnitText += dish.vipfee > 0 && selectedDesk.chargeVIPFee > 0 ? "+"
			+ dish.vipfee
			: '';
	dishPriceAndUnitText += "/" + dish.unit;
	dishPriceAndUnitText += dish.noDiscount ? "*" : "";
	dishPriceAndUnitText += dish.remain != null ? "("
			+ $.i18n.prop('string_shengYu') + dish.remain + ")" : "";

	dishPriceAndUnit.text(dishPriceAndUnitText);

	if (dish.soldOut || dish.remain == 0) {
		var css = {
			"text-decoration" : "line-through",
			"color" : "red"
		};
		dishNameDiv.css(css);
		dishPriceAndUnit.css(css);
	}

	var orderItemsByDish = getClientOrderItemsByDish(dish);

	if (orderItemsByDish.length == 0) {
		$("<div>").text($.i18n.prop('string_dianCai')).addClass("button")
				.addClass("orderButton").css("background-color", "#BEF56E")
				.data("dish", dish).click(dishButtonClick).appendTo(dishDiv);
	}
	if (orderItemsByDish.length > 0) {

		var totalAmount = 0;
		for ( var i in orderItemsByDish) {
			var orderItem = orderItemsByDish[i];
			totalAmount += orderItem.amount;
		}

		$("<div>").text(totalAmount).addClass("button").addClass("orderButton")
				.css("background-color", "#FFB273").data("dish", dish).click(
						dishButtonClick).appendTo(dishDiv);
	}

	$("<div>").addClass("clear").appendTo(dishDiv);
	return dishDiv;
}

function getBlockDishDiv(index, dish, selectedDesk) {

	var dishButtonDiv = $('<div>').addClass("button dishButton").attr("id",
			"dishDiv" + dish.id).data("dish", dish).click(dishButtonClick);
	if (!$curDishOrder) {
		return dishButtonDiv;
	}

	var orderItemsByDish = getClientOrderItemsByDish(dish);

	if (orderItemsByDish.length > 0) {
		var totalAmount = 0;
		for ( var i in orderItemsByDish) {
			var orderItem = orderItemsByDish[i];
			totalAmount += orderItem.amount;
		}

		$("<div>").text(totalAmount).addClass("dishAmount").appendTo(
				dishButtonDiv);
	}

	var dishPriceAndUnitDiv = $("<div>").addClass("dishPrice").appendTo(
			dishButtonDiv);
	var dishNameDiv = $("<div>").addClass("dishName").text(
			index + "." + dish.name).appendTo(dishButtonDiv);
	var dishPriceAndUnitHtml = "&yen;" + dish.price;

	dishPriceAndUnitHtml += dish.vipfee > 0 && selectedDesk.chargeVIPFee > 0 ? "+"
			+ dish.vipfee
			: '';
	dishPriceAndUnitHtml += (dish.unit != null ? "[" + dish.unit + "]" : "");
	dishPriceAndUnitHtml += dish.noDiscount ? "&nbsp;*" : '';
	dishPriceAndUnitDiv.html(dishPriceAndUnitHtml);

	if (dish.soldOut) {
		var css = {
			"text-decoration" : "line-through",
			"color" : "red"
		};

		dishPriceAndUnitDiv.css(css);
		dishNameDiv.css(css);
	}

	return dishButtonDiv;
}

function getClientOrderItemsByDish(dish) {
	var clientOrderItems = [];
	for ( var i in $curDishOrder.orderItems) {
		var orderItem = $curDishOrder.orderItems[i];
		if (orderItem.id == 0 && orderItem.dishId == dish.id
				&& orderItem.mealDealItemId == null) {
			clientOrderItems.push(orderItem);
		}
	}

	return clientOrderItems;
}

function showDishImageDialog() {
	var dish = $(this).data("dish");

	var picPath = dish.picPath;

	if (dish.secondPicPath != null && dish.secondPicPath != "") {
		picPath = dish.secondPicPath;
	}

	var dialogDiv = $("<img>").addClass("showDishPictureDialog").attr("src",
			picPath).click(function() {
		modal.close();
	}).appendTo('body');

	var modal = $(dialogDiv).modal({
		level : 10
	});
}

function dishButtonClick() {

	var dish = $(this).data("dish");
	dishSelectedCallback(dish);
}

function dishSelectedCallback(dish, dishName) {
	var orderItemsByDish = getClientOrderItemsByDish(dish);

	if (orderItemsByDish.length == 0 || dishName != null) {
		createOrderItem(dish, dishName);
	}
	if (orderItemsByDish.length > 0) {
		var orgDishOrder = jQuery.extend(true, {}, $curDishOrder);
		showDishOrderingDialog(dish, orgDishOrder);
	}
}

function createOrderItem(dish, dishName) {
	$("[name='dishFilterTextInput']").val("");

	if (dish.soldOut || dish.remain == 0) {

		showDishSoldOutDialog($.i18n.prop('string_xiTongTiShi'), $.i18n
				.prop('string_caiPinYiGuQing'), dish.id,
				cancelDishSoldOutCallback);
		return;
	}

	if (!$curDishOrder.orderItems) {
		$curDishOrder.orderItems = [];
	}

	var orderItem = newOrderItemFromDish(dish);
	if (dishName) {
		orderItem.dishName = dishName;
	}
	$curDishOrder.orderItems.push(orderItem);

	if (dish.hasMealDealItems) {
		autoOrderingMealDealItems(dish, orderItem);
		showDishOrderingDialog(dish, $curDishOrder);
	}

	if (orderItem.editable) {
		showEditableDishDialog(orderItem, function() {
			renderMenu();
		});
	}

	if (dish.needWeigh) {
		showDishAmountDialog($.i18n.prop('string_shuLiang'), orderItem,
				function(result) {
					orderItem.amount = result;
					if (orderItem.hasMealDealItems) {
						for ( var i in $curDishOrder.orderItems) {
							var oi = $curDishOrder.orderItems[i];
							if (oi.triggerId == orderItem.clientTriggerId) {
								oi.amount = result;
							}
						}
					}
					renderMenu();
				}, function() {
					oiIndex = $curDishOrder.orderItems.indexOf(orderItem);
					if (oiIndex > -1) {
						$curDishOrder.orderItems.splice(oiIndex, 1);
					}
					renderMenu();
				});
	}

	showProprietaryDishTag(dish, orderItem, renderMenu);

	renderMenu();
}

function showDishSoldOutDialog(title, message, dishId,
		cancelDishSoldOutCallback) {
	var dialogDiv = $("<div>").addClass("confirmDialog").appendTo('body');
	$("<div>").text(title).addClass("confirmDialogTitle").appendTo(dialogDiv);
	$("<div>").html("<div style='text-align:center;'>" + message + "</div>")
			.addClass("confirmDialogMessage").appendTo(dialogDiv);

	var operationDiv = $("<div>").addClass("operationDiv");
	$("<div>").addClass("dialogButton")
			.text($.i18n.prop('string_baoChiGuQing')).appendTo(operationDiv)
			.click(function() {
				modal.close();
			});
	$("<div>").addClass("dialogButton").text(
			$.i18n.prop('string_huiFuXiaoShou')).appendTo(operationDiv).click(
			function() {
				if (cancelDishSoldOutCallback)
					cancelDishSoldOutCallback(dishId);
				modal.close();
			});
	operationDiv.appendTo(dialogDiv);
	var modal = $(dialogDiv).modal();
}

function cancelDishSoldOutCallback(dishId) {
	$.ajax({
		type : 'POST',
		url : "../admin/cancelDishSoldOut",
		data : {
			dishId : dishId,
			employeeId : $storeData.employee.id
		},
		dataType : 'text',
		error : function(error) {

			if (error.status == 403) {
				showAlertDialog($.i18n.prop('string_cuoWu'), "权限不足,无法进行操作!");
				return;
			}
		},
		success : function(cancelDishSoldOutMsg) {
			if (cancelDishSoldOutMsg == "quXiaoChengGong") {
				showAlertDialog($.i18n.prop('string_xiTongTiShi'), $.i18n
						.prop('string_caoZuoChengGong'));
				$dishMap[dishId].soldOut = false;
				renderDishes();
				if (dishPicker) {
					dishPicker.refreshUI();
				}
			} else if (cancelDishSoldOutMsg == "quanXianBuZu") {
				showAlertDialog($.i18n.prop('string_xiTongTiShi'), $.i18n
						.prop('string_quanXianBuZu'));
			} else {
				showAlertDialog($.i18n.prop('string_xiTongTiShi'), $.i18n
						.prop('string_caoZuoShiBai'));
			}
		}
	});
}

function showDishOrderingDialog(dish, orgDishOrder) {

	var dialogDiv = $("<div>").addClass("dishOrderingDialog").appendTo("body");
	var dialog = $(dialogDiv).modal({
		autoPosition : false
	});

	var topDiv = $("<div>").addClass("dishOrderingDialogTop").appendTo(
			dialogDiv);

	var orderItemListDiv = $("<div>").addClass("orderItemListDiv").addClass(
			"overthrow");
	orderItemListDiv.appendTo(dialogDiv);

	var orderItemList = new OrderItemList(dish.id, topDiv, orderItemListDiv);

	var bottomDiv = $("<div>").addClass("dishOrderingDialogBottom");
	$("<a>").addClass("dishOrderCmdButton").text($.i18n.prop('string_zengJia'))
			.click(function() {

				var orderItem = newOrderItemFromDish(dish);
				$curDishOrder.orderItems.push(orderItem);

				if (orderItem.hasMealDealItems) {
					autoOrderingMealDealItems(dish, orderItem);
				}

				if (orderItem.editable) {
					showEditableDishDialog(orderItem, function() {
						orderItemList.render();
						orderItemList.select(1000);
						return;
					});
				}

				showProprietaryDishTag(dish, orderItem, function() {
					orderItemList.render();
					orderItemList.select($curDishOrder.orderItems.length - 1);
				});

				orderItemList.render();
				orderItemList.select(1000);
			}).appendTo(bottomDiv);
	$("<a>").addClass("dishOrderCmdButton").css("margin-left", "3em").text(
			$.i18n.prop('string_queDing')).click(function() {
		dialog.close();
		renderMenu();
	}).appendTo(bottomDiv);
	$("<a>").addClass("dishOrderCmdButton").css("margin-left", "1em").text(
			$.i18n.prop('string_quXiao')).click(function() {
		dialog.close();
		$curDishOrder.orderItems = orgDishOrder.orderItems;
		updateDishOrderPrice($curDishOrder);
		renderDishes();
		if (dishPicker) {
			dishPicker.refreshUI();
		}
	}).appendTo(bottomDiv);
	bottomDiv.appendTo(dialogDiv);
}

function showEditableDishDialog(orderItem, callback) {
	var dialogContent = getEditOrderItemPanel(orderItem, okCallback);
	var dialog = $(dialogContent).modal({
		level : 3
	});

	function okCallback() {
		if (callback)
			callback();
		dialog.close();
	}
}

function showProprietaryDishTag(selectedDish, orderItem, callback) {
	var dishOptionSets = selectedDish.dishOptionSets;
	var dishTagGroups = selectedDish.dishTagGroups;
	if ((dishOptionSets != null && dishOptionSets.length > 0)
			|| (dishTagGroups != null && dishTagGroups.length > 0)) {
		var dialogContent = getOptionsPanel(orderItem, okCallback,
				cancelCallback);
		var dialog = $(dialogContent).modal({
			level : 2
		});

		function okCallback() {
			if (callback)
				callback();
			dialog.close();
		}

		function cancelCallback() {
			oiIndex = $curDishOrder.orderItems.indexOf(orderItem);
			if (oiIndex > -1) {
				$curDishOrder.orderItems.splice(oiIndex, 1);
			}
			if (callback)
				callback();
			dialog.close();
		}
	}
}
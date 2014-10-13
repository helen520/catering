var currentMenuIndex;
var currentDishCategoryId;
var filteredDishes = [];

function initDishView() {
	$('#customerCountLabel').click(customerCountLabelClick);

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

	$("#confirmDishOrderButton", "#dishView").click(function() {
		hideSearchInputDailog();
		switchToView("DISH_ORDER_VIEW");
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
		$("#dishFilterTextInput", "#dishView").val("");
	});

	function customerCountLabelClick() {
		showAmountDialog($.i18n.prop('string_renShu') + "：",
				upateCustomerCount, $curDishOrder.customerCount);
	}

	function upateCustomerCount(customerCount) {
		$("#customerCountLabel").text(customerCount);
		$curDishOrder.customerCount = customerCount;

		updateChangeCustomerCountAutoDish(customerCount);
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
}

function updateChangeCustomerCountAutoDish(customerCount) {

	if (!$curDishOrder.orderItems) {
		$curDishOrder.orderItems = [];
	}

	var orderItems = $curDishOrder.orderItems;

	if ($autoOrderDishs.length > 0) {
		for ( var i in $autoOrderDishs) {
			var dish = $autoOrderDishs[i];
			var existed = false;
			for ( var j in orderItems) {
				var orderItem = orderItems[j];
				if (orderItem.dishId == dish.id) {
					existed = true;
					if (orderItem.state == ORDER_ITEM_STATE.WAITING) {
						orderItem.amount = dish.amountPerCustomer > 0 ? customerCount
								* dish.amountPerCustomer
								: 1;
					}
				}
			}
			if (!existed) {
				var oi = newOrderItemFromDish(dish);
				oi.amount = dish.amountPerCustomer > 0 ? customerCount
						* dish.amountPerCustomer : 1;
				$curDishOrder.orderItems.push(oi);
			}
		}
	}
	updateDishOrderPrice($curDishOrder);
	showDishOrderView();
}

function showDishView() {

	currentMenuIndex = 0;
	currentDishCategoryId = 0;
	if ($storeData.menus.length < 2) {
		$('#menuButton').hide();
	}

	renderMenu();
	$("#dishView").show();
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
			if (orderItem.state == 1) {
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

	var dishes = currentDishCategoryId == -1 ? filteredDishes
			: dishCategory.dishes;
	for ( var i in dishes) {
		var dish = dishes[i];
		if (!dish.enabled) {
			continue;
		}
		var dishDiv = getDishDiv(dish, ++dishIndex + ".");

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

function getDishDiv(dish, dishIndex) {

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
	var dishNameDiv = $('<div>').text(dishIndex + dish.name).addClass(
			'dishNameDiv').appendTo(dishInfoDiv);
	var dishPriceAndUnit = $('<div>').addClass("dishPriceDiv").appendTo(
			dishInfoDiv);
	var dishPriceAndUnitText = "￥" + dish.price;
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

	var clientOrderItems = [];
	for ( var i in $curDishOrder.orderItems) {
		var orderItem = $curDishOrder.orderItems[i];
		if (orderItem.state == 1 && orderItem.dishId == dish.id
				&& orderItem.mealDealItemId == null) {
			clientOrderItems.push(orderItem);
		}
	}

	if (clientOrderItems.length == 0) {
		var orderingButton = $("<div>").text($.i18n.prop('string_dianCai'))
				.addClass("button").addClass("orderButton").css(
						"background-color", "#BEF56E").data("dish", dish)
				.appendTo(dishDiv);
		if (dish.hasMealDealItems) {
			orderingButton.click(orderDishButtonClick);
		} else {
			orderingButton.click(newOrderItemButtonClick);
		}
	}
	if (clientOrderItems.length > 0) {

		var totalAmount = 0;
		for ( var i in clientOrderItems) {
			var orderItem = clientOrderItems[i];
			totalAmount += orderItem.amount;
		}

		$("<div>").text(totalAmount).addClass("button").addClass("orderButton")
				.css("background-color", "#FFB273").data("dish", dish).data(
						"isOrdered", true).click(orderDishButtonClick)
				.appendTo(dishDiv);
	}

	$("<div>").addClass("clear").appendTo(dishDiv);
	return dishDiv;
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

function newOrderItemButtonClick() {
	$('#dishFilterTextInput').val("");
	var dish = $(this).data("dish");

	if (dish.soldOut || dish.remain == 0) {

		showDishSoldOutDialog($.i18n.prop('string_xiTongTiShi'), $.i18n
				.prop('string_caiPinYiGuQing'), dish.id);
		return;
	}

	if (!$curDishOrder.orderItems) {
		$curDishOrder.orderItems = [];
	}

	var orderItem = newOrderItemFromDish(dish);
	$curDishOrder.orderItems.push(orderItem);

	showProprietaryDishTag(dish, orderItem, renderMenu);

	renderMenu();
}

function showDishSoldOutDialog(title, message, dishId) {
	var dialogDiv = $("<div>").addClass("confirmDialog").appendTo('body');
	$("<div>").text(title).addClass("confirmDialogTitle").appendTo(dialogDiv);
	$("<div>").html("<div style='text-align:center;'>" + message + "</div>")
			.addClass("confirmDialogMessage").appendTo(dialogDiv);

	var operationDiv = $("<div>").addClass("operationDiv");
	$("<div>").addClass("alertButton").text('OK').appendTo(operationDiv).click(
			function() {
				modal.close();
			});

	operationDiv.appendTo(dialogDiv);
	var modal = $(dialogDiv).modal();
}

function orderDishButtonClick() {
	var dish = $(this).data("dish");
	var isOrdered = $(this).data("isOrdered");

	var orgDishOrder = jQuery.extend(true, {}, $curDishOrder);

	if (dish.hasMealDealItems && !isOrdered) {
		var orderItem = newOrderItemFromDish(dish);
		$curDishOrder.orderItems.push(orderItem);
		autoOrderingMealDealItems(dish, orderItem);
	}

	showDishOrderingDialog(dish, orgDishOrder);
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
	}).appendTo(bottomDiv);
	bottomDiv.appendTo(dialogDiv);
}

function showEditableDishDialog(orderItem, callback) {
	var dialogContent = getEditOrderItemPanel(orderItem, okCallback);
	var dialog = $(dialogContent).modal({
		level : 3,
		autoPosition : false
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
			var oiIndex = $curDishOrder.orderItems.indexOf(orderItem);
			if (oiIndex > -1) {
				$curDishOrder.orderItems.splice(oiIndex, 1);
			}
			if (callback)
				callback();
			dialog.close();
		}
	}
}
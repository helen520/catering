function DishPicker(dishPickerContainer) {

	var uiDataManager = UIDataManager.getInstance();
	var dishOrderManager = DishOrderManager.getInstance();
	var storeData = uiDataManager.getStoreData();

	var groupContainer = $("<div>");
	var listContainer = $("<div>");

	var currentMenuIndex = 0;
	var currentDishCategoryId = 0;
	var currentMenuDishMap = {};

	var init = function() {

		dishOrderManager.attachEvent('onCurrentDishOrderChanged', renderDishes);

		groupContainer.addClass("dishCategorySelector").appendTo(
				dishPickerContainer);
		listContainer.addClass("dishSelector").addClass("overthrow").appendTo(
				dishPickerContainer);

		groupContainer.delegate(".dishCategoryButton", "click",
				dishCategoryButtonClick);
		listContainer.delegate(".dishButton", "click", dishButtonClick);

		renderDishGroups();
		renderDishes();

		$(window).resize(function() {
			renderDishes();
		});
	};

	this.refreshUI = renderDishes;

	function dishCategoryButtonClick() {
		currentDishCategoryId = $(this).data("dishCategoryId");
		renderDishGroups();
		renderDishes();
	}

	function dishButtonClick() {
		var dishId = $(this).data("dishId");
		var selectedDish = currentMenuDishMap[dishId];

		if (selectedDish.soldOut) {
			showDishSoldOutDialog($.i18n.prop('string_xiTongTiShi'), $.i18n
					.prop('string_caiPinYiGuQing'), selectedDish.id,
					cancelDishSoldOutCallback);
			return;
		}

		var employeeId = uiDataManager.getStoreData().employee.id;
		dishOrderManager.orderDish(employeeId, selectedDish);
	}

	function menuButtonClick() {
		currentMenuIndex++;
		currentDishCategoryId = 0;
		renderDishGroups();
		renderDishes();
	}

	function renderDishGroups() {
		groupContainer.empty();

		var menus = storeData.menus;
		if (menus.length == 0) {
			return;
		}

		currentMenuIndex %= menus.length;
		var menu = menus[currentMenuIndex];
		var menuButton = $("<button>").addClass("menuButton").click(
				menuButtonClick);
		menuButton.text(menu.name + "▼").appendTo(groupContainer);

		for ( var i in menu.dishCategories) {
			var dishCategory = menu.dishCategories[i];
			var dishCategoryButton = $("<button>").text(dishCategory.name)
					.addClass("dishCategoryButton").data("dishCategoryId",
							dishCategory.id);
			dishCategoryButton.appendTo(groupContainer);
			currentDishCategoryId = !currentDishCategoryId ? dishCategory.id
					: currentDishCategoryId;
			if (dishCategory.id == currentDishCategoryId) {
				dishCategoryButton.addClass("dishCategoryButtonSelected");
			}
		}
		renderDishes();
	}

	function renderDishes() {

		var currentDishOrder = dishOrderManager.getCurrentDishOrder();

		var groupContainerHeight = groupContainer.offset().top
				+ groupContainer.height() + 10;
		var listContainerHeight = dishPickerContainer.height()
				- groupContainerHeight;
		listContainer.height(listContainerHeight);

		currentMenuDishMap = {};
		var dishCategory = uiDataManager
				.getDishCategoryById(currentDishCategoryId);
		if (currentDishCategoryId != -1 && !dishCategory) {
			var orgDishButtons = listContainer.children();
			for (var j = 0; j < orgDishButtons.length; j++) {
				$(orgDishButtons[j]).hide();
			}
			return;
		}

		var selectedDesk = {
			chargeVIPFee : false
		};
		if (currentDishOrder && currentDishOrder.deskId) {
			selectedDesk = uiDataManager.getDeskById(currentDishOrder.deskId);
		}

		var orgDishButtons = listContainer.children();
		var orgDishButtonCount = orgDishButtons.length;
		var showDishCount = 0;

		var dishes = currentDishCategoryId == -1 ? filteredDishes
				: dishCategory.dishes;

		for ( var i in dishes) {
			var dishButton = null;
			var dish = dishes[i];

			if (showDishCount < orgDishButtonCount) {
				dishButton = $(orgDishButtons[showDishCount]);
				dishButton.empty().removeClass().addClass("button dishButton");
			} else {
				dishButton = $("<div>").addClass("button dishButton");
				dishButton.appendTo(listContainer);
			}

			var dishPriceAndUnitDiv = $("<div>").addClass("dishPrice")
					.appendTo(dishButton);
			var dishNameDiv = $("<div>").addClass("dishName").text(
					Number(i) + 1 + "." + dish.name).appendTo(dishButton);
			var dishPriceAndUnitHtml = "&yen;" + dish.price;

			dishPriceAndUnitHtml += dish.vipfee > 0
					&& selectedDesk.chargeVIPFee > 0 ? "+" + dish.vipfee : '';
			dishPriceAndUnitHtml += (dish.unit != null ? "[" + dish.unit + "]"
					: "");
			dishPriceAndUnitHtml += dish.noDiscount ? "&nbsp;*" : '';
			dishPriceAndUnitDiv.html(dishPriceAndUnitHtml);

			var clientOrderItems = null;
			if (currentDishOrder) {
				for ( var i in currentDishOrder.orderItems) {
					var orderItem = currentDishOrder.orderItems[i];
					if (orderItem.id == 0 && orderItem.dishId == dish.id
							&& orderItem.mealDealItemId == null) {
						clientOrderItems = orderItem;
					}
				}
			}
			$('span', dishButton).remove();
			if (clientOrderItems != null) {
				$('<span>').text(clientOrderItems.amount).appendTo(dishButton);
			}

			if (dish.soldOut) {
				var css = {
					"text-decoration" : "line-through",
					"color" : "red"
				};

				dishPriceAndUnitDiv.css(css);
				dishNameDiv.css(css);
			}

			dishButton.data("dish", dish).data("dishId", dish.id).show();
			currentMenuDishMap[dish.id] = dish;

			showDishCount++;
		}

		for (var j = showDishCount; j < orgDishButtonCount; j++) {
			$(orgDishButtons[j]).hide();
		}
	}

	init();
}

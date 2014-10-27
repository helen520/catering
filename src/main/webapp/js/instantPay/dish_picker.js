function DishPicker(dishPickerContainer) {

	var uiDataManager = UIDataManager.getInstance();
	var dishOrderManager = DishOrderManager.getInstance();
	var authorityManager = AuthorityManager.getInstance();
	var storeData = uiDataManager.getStoreData();

	var groupContainer = $("<div>");
	var listContainer = $("<div>");
	var filterContainer = $("<div>");
	var keyboardContainer = $("<div>");

	var currentMenuIndex = 0;
	var currentDishCategory = null;

	var init = function() {

		dishOrderManager.attachEvent('onCurrentDishOrderChanged', renderDishes);

		filterContainer.addClass('filterContainer').appendTo(
				dishPickerContainer);
		$("<span>").text($.i18n.prop('string_Search'))
				.appendTo(filterContainer)
		$("<input>").attr("id", "dishFilterTextInput").focus(function() {
			if (keyboardContainer.css('display') == 'none') {
				keyboardContainer.show();
				$('#showCategoriesButton', dishPickerContainer).show();
				groupContainer.hide();
				currentDishCategory = null;
				renderDishes();
			}
		}).bind('input propertychange', function() {
			currentDishCategory = null;
			renderDishes();
		}).appendTo(filterContainer);

		$("<button>").addClass("button").text($.i18n.prop('string_Clear'))
				.click(clearButtonClick).appendTo(filterContainer);
		function clearButtonClick() {
			$('#dishFilterTextInput', dishPickerContainer).val('').blur();
		}

		$('<button id="showCategoriesButton">').addClass("button").text('分类点菜')
				.click(showCategoriesButtonClick).appendTo(filterContainer)
				.hide();
		function showCategoriesButtonClick() {
			$('#dishFilterTextInput', dishPickerContainer).val('').blur();
			$('#showCategoriesButton', dishPickerContainer).hide();
			keyboardContainer.hide();
			groupContainer.show();
			renderDishGroups();
		}

		keyboardContainer.addClass("dishCategorySelector").appendTo(
				dishPickerContainer).hide();
		groupContainer.addClass("dishCategorySelector").appendTo(
				dishPickerContainer);
		listContainer.addClass("dishSelector").addClass("overthrow").appendTo(
				dishPickerContainer);

		renderVirtualKeyboard();
		renderDishGroups();
		renderDishes();

		$(window).resize(function() {
			renderDishes();
		});
	};

	var renderVirtualKeyboard = function() {
		var arr = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
				"M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X",
				"Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" ];
		for (var i = 0; i < arr.length; i++) {
			$("<button>").addClass('dishCategoryButton').css('width', '3.2em')
					.css('height', '2.2em').text(arr[i]).appendTo(
							keyboardContainer).click(keyButtonClick);
			function keyButtonClick() {
				var text = $("#dishFilterTextInput", dishPickerContainer).val();
				text += $(this).text().toLowerCase();
				$("#dishFilterTextInput", dishPickerContainer).val(text)
						.focus();
				renderDishes();
			}
		}
	}

	var renderDish = function(container, dish, dishOrder, dishIndex) {
		container.removeClass().addClass("button dishButton")

		var chargeVIPFee = dishOrder ? dishOrder.chargeVIPFee : false;
		var dishPriceAndUnitHtml = dishIndex + "." + "&yen;" + dish.price;
		dishPriceAndUnitHtml += dish.vipFee > 0 && chargeVIPFee ? "+"
				+ dish.vipFee : '';
		dishPriceAndUnitHtml += (dish.unit != null ? "[" + dish.unit + "]" : "");
		dishPriceAndUnitHtml += dish.noDiscount ? "&nbsp;*" : '';
		var dishPriceAndUnitDiv = $("<div>").addClass("dishPrice").html(
				dishPriceAndUnitHtml).appendTo(container);

		var dishNameDiv = $("<div>").addClass("dishName").text(dish.name)
				.appendTo(container);

		var orderedAmount = DishOrder.getDishOrderedAmount(dishOrder, dish);
		$('span', container).remove();
		if (orderedAmount > 0) {
			$('<span>').text(orderedAmount).appendTo(container);
		}

		if (dish.soldOut || dish.remain == 0) {
			var css = {
				"text-decoration" : "line-through",
				"color" : "red"
			};
			dishPriceAndUnitDiv.css(css);
			dishNameDiv.css(css);
		}
	};

	var createDishDiv = function() {
		return $("<div>")
				.click(
						function() {
							var dish = $(this).data("dish");
							if (dish.soldOut) {
								new ConfirmDialog($.i18n.prop('string_Notice'),
										$.i18n.prop('string_RestoreDish'),
										okCallback).show();
								function okCallback() {
									authorityManager.getAuthority(
											'canCancelDishSoldOut', okCallback,
											true);
									function okCallback() {
										uiDataManager.updateDish(dish.id);
									}
								}
								return;
							}

							if (keyboardContainer.css('display') != 'none') {
								$('#dishFilterTextInput', dishPickerContainer)
										.val('').focus();
							}
							dishOrderManager.orderDish(dish);
						});
	};

	var renderDishes = function() {

		var dishOrder = dishOrderManager.getCurrentDishOrder();

		var listContainerHeight = dishPickerContainer.height();
		if (groupContainer.css('display') != 'none') {
			var groupContainerHeight = groupContainer.offset().top
					+ groupContainer.height() + 10;
			listContainerHeight -= groupContainerHeight;
		}

		if (keyboardContainer.css('display') != 'none') {
			keyboardContainerHeight = keyboardContainer.offset().top
					+ keyboardContainer.height() + 10;
			listContainerHeight -= keyboardContainerHeight;
		}
		listContainer.height(listContainerHeight);

		var dishes = [];

		if (currentDishCategory) {
			currentDishCategory = uiDataManager
					.getDishCategoryById(currentDishCategory.id);
			dishes = currentDishCategory.dishes;
		}

		var filterText = $('#dishFilterTextInput', dishPickerContainer).val();

		if (keyboardContainer.css('display') != 'none') {
			if (filterText.length == 0) {
				return;
			} else {
				dishes = uiDataManager.filterDishes(filterText);
			}
		}

		var orgDishDivs = listContainer.children();
		var orgDishDivCount = orgDishDivs.length;
		var showDishCount = 0;

		for (var i = 0; i < dishes.length; i++) {
			var dish = dishes[i];
			if (!dish.enabled) {
				continue;
			}

			var dishDiv = null;
			if (showDishCount < orgDishDivCount) {
				dishDiv = $(orgDishDivs[showDishCount]);
				dishDiv.empty();
			} else {
				dishDiv = createDishDiv().appendTo(listContainer);
			}

			renderDish(dishDiv, dish, dishOrder, i + 1);
			dishDiv.data("dish", dish).show();

			showDishCount++;
		}

		for (var j = showDishCount; j < orgDishDivCount; j++) {
			$(orgDishDivs[j]).hide();
		}
	};

	var renderDishGroups = function() {
		groupContainer.empty();

		var menus = storeData.menus;
		if (menus.length == 0) {
			return;
		}

		currentMenuIndex %= menus.length;
		var menu = menus[currentMenuIndex];
		var menuButton = $("<button>").addClass("menuButton").text(
				menu.name + "▼").appendTo(groupContainer)
				.click(menuButtonClick);
		function menuButtonClick() {
			currentMenuIndex++;
			currentDishCategory = null;
			renderDishGroups();
			renderDishes();
		}

		for ( var i in menu.dishCategories) {
			var dishCategory = menu.dishCategories[i];
			var dishCategoryButton = $("<button>").text(dishCategory.name)
					.addClass("dishCategoryButton").data("dishCategory",
							dishCategory).appendTo(groupContainer).click(
							dishCategoryButtonClick);
			function dishCategoryButtonClick() {
				currentDishCategory = $(this).data("dishCategory");
				renderDishGroups();
				renderDishes();
			}

			currentDishCategory = !currentDishCategory ? dishCategory
					: currentDishCategory;
			if (dishCategory.id == currentDishCategory.id) {
				dishCategoryButton.addClass("dishCategoryButtonSelected");
			}
		}
		renderDishes();
	};

	this.refreshUI = renderDishes;

	init();
}

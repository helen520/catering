function DishPicker(dishPickerContainer, dishSelectedCallback, hideCategories) {

	var self = this;
	var currentMenuIndex = 0;
	var currentDishCategoryId = 0;
	var filteredDishes = [];
	var currentMenuDishMap = {};
	var dishPickerBox = $("<div>").attr("id", "dishPickerBox").appendTo(
			dishPickerContainer);// 增加dishPicker样式作用区域Id
	var dishPickerBoxTopLeft = $("<div>").attr("id", "dishPickerBoxTopLeft")
			.appendTo(dishPickerBox);
	var filterContainer = $("<div>").attr("id", "filterDiv").appendTo(
			dishPickerBoxTopLeft);
	if (!hideCategories) {
		filterContainer.text($.i18n.prop('string_chaZhaoCaiPin'));
	}

	var groupContainer = $("<div>").addClass("dishCategorySelector").appendTo(
			dishPickerBoxTopLeft);
	if (hideCategories) {
		groupContainer.hide();
	}
	var listContainer = $("<div>").addClass("dishSelector").addClass(
			"overthrow").appendTo(dishPickerBox);

	$("<input>").attr("name", "dishFilterTextInput").attr("type", "text")
			.appendTo(filterContainer).bind('input propertychange', searchDish);

	$("<button>").text("手写菜").attr("id", "addHandwriteOrderItemButton")
			.addClass("button").click(addHandwriteOrderItemButtonClick)
			.appendTo(filterContainer);
	$("<button>").text($.i18n.prop('string_qingKong')).attr("id",
			"clearDishFilterButton").addClass("button").click(function() {
		self.clearSearchTextAndSetDefaultDishes();
	}).appendTo(filterContainer);

	groupContainer.delegate(".dishCategoryButton", "click",
			dishCategoryButtonClick);
	listContainer.delegate(".dishButton", "click", dishButtonClick);

	renderDishGroups();

	this.refreshUI = renderDishes;

	this.filteredDishes = function() {
		return filteredDishes;
	};

	this.clearSearchTextAndSetDefaultDishes = function() {
		$("[name='dishFilterTextInput']", "#dishView").val("");
		currentDishCategoryId = 0;
		filteredDishes = [];
		renderDishGroups();
	};

	function addHandwriteOrderItemButtonClick() {

		if ($defaultEditableDish == null) {
			alert("系统未设定默认手写菜");
			return;
		}

		if (dishSelectedCallback) {
			var dishName = $("[name='dishFilterTextInput']", filterContainer)
					.val();
			dishSelectedCallback($defaultEditableDish, dishName);
		}
	}

	function searchDish(event, filterText) {
		if (!filterText) {
			filterText = $("[name='dishFilterTextInput']", filterContainer)
					.val();
		}

		filteredDishes = [];
		if (filterText != "") {
			filteredDishes = filterDishes(filterText);
			currentDishCategoryId = -1;
		} else {
			return;
		}

		renderDishes();

		function filterDishes(filterText) {
			var result = [];
			for ( var i in $dishMap) {
				var dish = $dishMap[i];
				if (containText(filterText, dish.name)
						|| containText(filterText, dish.alias)
						|| containText(filterText, dish.indexCode)
						|| containText(filterText, dish.quickIndexCode))
					result.push($dishMap[i]);
			}

			return result;
		}

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

		if (dishSelectedCallback) {
			dishSelectedCallback(selectedDish);
		}

		renderDishes();
	}

	function showDishSoldOutDialog(title, message, dishId,
			cancelDishSoldOutCallback) {
		var dialogDiv = $("<div>").addClass("confirmDialog").appendTo('body');
		$("<div>").text(title).addClass("confirmDialogTitle").appendTo(
				dialogDiv);
		$("<div>")
				.html("<div style='text-align:center;'>" + message + "</div>")
				.addClass("confirmDialogMessage").appendTo(dialogDiv);

		var operationDiv = $("<div>").addClass("operationDiv");
		$("<div>").addClass("dialogButton").text(
				$.i18n.prop('string_baoChiGuQing')).appendTo(operationDiv)
				.click(function() {
					modal.close();
				});
		$("<div>").addClass("dialogButton").text(
				$.i18n.prop('string_huiFuXiaoShou')).appendTo(operationDiv)
				.click(function() {
					if (cancelDishSoldOutCallback)
						cancelDishSoldOutCallback(dishId);
					modal.close();
				});
		operationDiv.appendTo(dialogDiv);
		var modal = $(dialogDiv).modal();
	}

	function cancelDishSoldOutCallback(dishId) {
		showEmployeeLoginDialog(function() {
			$.ajax({
				type : 'POST',
				url : "../admin/cancelDishSoldOut",
				data : {
					dishId : dishId,
					employeeId : $storeData.employee.id
				},
				dataType : 'text',
				error : function(error) {
				},
				success : function(cancelDishSoldOutMsg) {
					if (cancelDishSoldOutMsg == "quXiaoChengGong") {
						showAlertDialog($.i18n.prop('string_xiTongTiShi'),
								$.i18n.prop('string_caoZuoChengGong'));
						$dishMap[dishId].soldOut = false;
						renderDishes();
					} else if (cancelDishSoldOutMsg == "quanXianBuZu") {
						showAlertDialog($.i18n.prop('string_xiTongTiShi'),
								$.i18n.prop('string_quanXianBuZu'));
					} else {
						showAlertDialog($.i18n.prop('string_xiTongTiShi'),
								$.i18n.prop('string_caoZuoShiBai'));
					}
					initkeyDown();
				}
			});
		});
	}

	function menuButtonClick() {
		currentMenuIndex++;
		currentDishCategoryId = 0;
		renderDishGroups();
		renderDishes();
	}

	function renderDishGroups() {
		groupContainer.empty();

		var menus = $storeData.menus;
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

		$("[name='dishFilterTextInput']", filterContainer).focus();
		changeSearchInputCallBack(searchDish);

		var groupContainerHeight = groupContainer.offset().top
				+ groupContainer.height() + 10;
		if (hideCategories) {
			groupContainerHeight = 0;
		}
		var listContainerHeight = dishPickerContainer.height()
				- groupContainerHeight;
		listContainer.height(listContainerHeight);

		currentMenuDishMap = {};
		var dishCategory = $dishCategoryMap[currentDishCategoryId];
		if (currentDishCategoryId != -1 && !dishCategory) {
			var orgDishButtons = listContainer.children();
			for (var j = 0; j < orgDishButtons.length; j++) {
				$(orgDishButtons[j]).hide();
			}
			return;
		}

		var selectedDesk = $deskMap[$curDishOrder.deskId];
		var orgDishButtons = listContainer.children();
		var orgDishButtonCount = orgDishButtons.length;
		var showDishCount = 0;

		var dishes = currentDishCategoryId == -1 ? filteredDishes
				: dishCategory.dishes;

		for ( var i in dishes) {
			var dishButton = null;
			var dish = dishes[i];

			if (!dish.enabled) {
				continue;
			}

			if (showDishCount < orgDishButtonCount) {
				dishButton = $(orgDishButtons[showDishCount]);
				dishButton.empty().removeClass().addClass("button dishButton");
				if (hideCategories) {
					dishButton.css('width', '5em').css('height', '4em');
				}
			} else {
				dishButton = $("<div>").addClass("button dishButton");
				if (hideCategories) {
					dishButton.css('width', '5em').css('height', '4em');
				}
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
			for ( var i in $curDishOrder.orderItems) {
				var orderItem = $curDishOrder.orderItems[i];
				if (orderItem.id == 0 && orderItem.dishId == dish.id
						&& orderItem.mealDealItemId == null) {
					clientOrderItems = orderItem;
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

	$(window).resize(function() {
		renderDishes();
	});
}

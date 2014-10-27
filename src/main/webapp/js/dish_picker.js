function DishPicker(dishPickerContainer, dishSelectedCallback, hideCategories,
		isEditDish) {

	var self = this;
	var currentMenuIndex = 0;
	var currentDishCategoryId = 0;
	var filteredDishes = [];
	var currentMenuDishMap = {};
	var soldOutOnly = false;

	var groupContainer = null;
	var filterContainer = null;
	var listContainer = null;

	var inti = function() {

		var dishPickerBox = $("<div>").attr("id", "dishPickerBox").appendTo(
				dishPickerContainer);// 增加dishPicker样式作用区域Id
		var dishPickerBoxTopLeft = $("<div>")
				.attr("id", "dishPickerBoxTopLeft").appendTo(dishPickerBox);
		filterContainer = $("<div>").attr("id", "filterDiv").appendTo(
				dishPickerBoxTopLeft);
		if (!hideCategories) {
			filterContainer.text($.i18n.prop('string_chaZhaoCaiPin'));
		}

		groupContainer = $("<div>").addClass("dishCategorySelector").appendTo(
				dishPickerBoxTopLeft);
		if (hideCategories) {
			groupContainer.hide();
		}
		listContainer = $("<div>").addClass("dishSelector").addClass(
				"overthrow").appendTo(dishPickerBox);

		$("<input>").attr("name", "dishFilterTextInput").attr("type", "text")
				.appendTo(filterContainer).bind('input propertychange',
						searchDish);

		$("<button>").text($.i18n.prop('string_qingKong')).attr("id",
				"clearDishFilterButton").addClass("button").click(function() {
			self.clearSearchTextAndSetDefaultDishes();
		}).appendTo(filterContainer);

		if (isEditDish) {
			var idStr = 'cb' + Math.ceil(Math.random() * 10e10).toString();
			var soldOutOnlyDiv = $('<div id="soldOutOnlyDiv">').appendTo(
					filterContainer);
			$('<input type="checkbox">').attr('id', idStr).click(function() {
				soldOutOnly = $(this)[0].checked;
				renderDishes();
			}).appendTo(soldOutOnlyDiv);

			$('<label>').attr('for', idStr).text("只显示沽清菜品").appendTo(
					soldOutOnlyDiv);
			listContainer
					.delegate(".dishButton", "click", editDishSoldOutClick);
			function editDishSoldOutClick() {
				var dishId = $(this).data("dishId");
				editDishSoldOut(dishId);
			}
		} else {
			$("<button>").text("手写菜").attr("id", "addHandwriteOrderItemButton")
					.addClass("button").click(addHandwriteOrderItemButtonClick)
					.appendTo(filterContainer);
			function addHandwriteOrderItemButtonClick() {

				if ($defaultEditableDish == null) {
					alert("系统未设定默认手写菜");
					return;
				}

				if (dishSelectedCallback) {
					var dishName = $("[name='dishFilterTextInput']",
							filterContainer).val();
					dishSelectedCallback($defaultEditableDish, dishName);
				}
			}

			listContainer.delegate(".dishButton", "click", dishButtonClick);
			function dishButtonClick() {
				var dishId = $(this).data("dishId");
				var selectedDish = currentMenuDishMap[dishId];

				if (selectedDish.soldOut) {
					showDishSoldOutDialog($.i18n.prop('string_xiTongTiShi'),
							$.i18n.prop('string_caiPinYiGuQing'),
							selectedDish.id, cancelDishSoldOutCallback);
					return;
				}

				if (dishSelectedCallback) {
					dishSelectedCallback(selectedDish);
				}

				renderDishes();
			}
		}

		groupContainer.delegate(".dishCategoryButton", "click",
				dishCategoryButtonClick);
		function dishCategoryButtonClick() {
			currentDishCategoryId = $(this).data("dishCategoryId");
			renderDishGroups();
			renderDishes();
		}

		renderDishGroups();
	};

	this.refreshUI = function() {
		renderDishes();
	};

	this.filteredDishes = function() {
		return filteredDishes;
	};

	this.clearSearchTextAndSetDefaultDishes = function() {
		$("[name='dishFilterTextInput']").val("");
		currentDishCategoryId = 0;
		filteredDishes = [];
		renderDishGroups();
	};

	var searchDish = function(event, filterText) {
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
	};

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

	var editDishSoldOut = function(dishId) {
		if (!$storeData.employee.canCancelDishSoldOut && $templeEmployee
				&& !$templeEmployee.canCancelDishSoldOut) {
			showAlertDialog($.i18n.prop('string_cuoWu'), "权限不足!无法进行操作!");
			return;
		}

		$.ajax({
			type : 'POST',
			url : "../admin/editDishSoldOut",
			data : {
				dishId : dishId,
				employeeId : $storeData.employee.id
			},
			dataType : 'text',
			error : function(error) {
			},
			success : function(dish) {
				$dishMap[dishId].soldOut = !$dishMap[dishId].soldOut;
				renderDishes();
				initkeyDown();
			}
		});
	};

	function cancelDishSoldOutCallback(dishId) {
		showEmployeeLoginDialog(editDishSoldOut, dishId, null, true);

	}

	var renderDishGroups = function() {
		groupContainer.empty();

		var menus = $storeData.menus;
		if (menus.length == 0) {
			return;
		}

		currentMenuIndex %= menus.length;
		var menu = menus[currentMenuIndex];
		var menuButton = $("<button>").addClass("menuButton").click(
				menuButtonClick);
		function menuButtonClick() {
			currentMenuIndex++;
			currentDishCategoryId = 0;
			renderDishGroups();
			renderDishes();
		}
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
	};

	var renderDishes = function() {

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

		var selectedDesk = null;

		if ($curDishOrder) {
			selectedDesk = $deskMap[$curDishOrder.deskId];
		}

		var orgDishButtons = listContainer.children();
		var orgDishButtonCount = orgDishButtons.length;
		var showDishCount = 0;

		var dishes = currentDishCategoryId == -1 ? filteredDishes
				: dishCategory.dishes;

		if (soldOutOnly) {
			dishes = [];
			for ( var i in $dishMap) {
				var dish = $dishMap[i];
				if (dish.soldOut)
					dishes.push(dish);
			}
		}

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

			if (selectedDesk)
				dishPriceAndUnitHtml += dish.vipfee > 0
						&& selectedDesk.chargeVIPFee > 0 ? "+" + dish.vipfee
						: '';
			dishPriceAndUnitHtml += (dish.unit != null ? "[" + dish.unit + "]"
					: "");
			dishPriceAndUnitHtml += dish.noDiscount ? "&nbsp;*" : '';
			dishPriceAndUnitDiv.html(dishPriceAndUnitHtml);

			$('span', dishButton).remove();
			var clientOrderItem = null;
			if ($curDishOrder) {
				for ( var i in $curDishOrder.orderItems) {
					var orderItem = $curDishOrder.orderItems[i];
					if (orderItem.id == 0 && orderItem.dishId == dish.id
							&& orderItem.mealDealItemId == null) {
						clientOrderItem = orderItem;
						break;
					}
				}
			}

			if (clientOrderItem != null) {
				$('<span>').text(clientOrderItem.amount).appendTo(dishButton);
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
	};

	$(window).resize(function() {
		renderDishes();
	});

	inti();
}

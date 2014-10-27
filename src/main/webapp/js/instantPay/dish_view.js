function DishView(container) {
	var self = this;
	var eventHandlers = {
		'onSwitchViewCommand' : []
	};

	this.attachEvent = function(eventName, handler) {
		if (eventName in eventHandlers) {
			eventHandlers[eventName].push(handler);
		}
	};

	var fireEvent = function(eventName) {
		var args = [];
		for (var i = 1; i < arguments.length; i++) {
			args.push(arguments[i]);
		}
		if (eventName in eventHandlers) {
			for ( var i in eventHandlers[eventName]) {
				eventHandlers[eventName][i].apply(self, args);
			}
		}
	};

	var uiDataManager = UIDataManager.getInstance();
	var dishOrderManager = DishOrderManager.getInstance();
	var authorityManager = AuthorityManager.getInstance();
	var dishOrderCache = DishOrderCache.getInstance();

	var dishPicker = null;

	var updateDishOrderInfo = function() {
		$("#deskNameLabel", container).text("");
		$("#customerCountLabel", container).text("");
		$("#totalPriceLabel", container).text("");

		var currentDishOrder = dishOrderManager.getCurrentDishOrder();

		if (currentDishOrder != null
				&& currentDishOrder.state != DishOrder.STATE.CANCELLED) {
			$("#deskNameLabel", container).text(currentDishOrder.deskName);
			$("#customerCountLabel", container).text(
					currentDishOrder.customerCount);
			$("#totalPriceLabel", container).text(
					currentDishOrder.finalPrice.toFixed(1));
			$("#dishOrderTagTextLabel", container).text(
					DishOrderTag.tagsToText(currentDishOrder.tags));
		}
	};

	var updateLoginInfo = function() {
		$("#employeeNameLabel", container).text(
				'(' + $.i18n.prop('string_NotLoggedIn') + ')');

		var employee = authorityManager.getCurrentEmployee();
		if (employee) {
			$("#employeeNameLabel", container).text(employee.name);
			$("#logoutEmployeeButton", container).show();
		} else {
			$("#logoutEmployeeButton", container).hide();
		}
	};

	var init = function() {
		dishOrderManager.attachEvent('onCurrentDishOrderChanged',
				updateDishOrderInfo);
		authorityManager.attachEvent('onCurrentEmployeeChanged',
				updateLoginInfo);
		uiDataManager.attachEvent('onMenuChanged', function() {
			dishPicker.refreshUI();
		});

		$("#cancelDishOrderButton", container).click(function() {
			new ConfirmDialog("警告", "确定取消点菜？", okCallback).show();
			function okCallback() {
				dishOrderManager.setCurrentDishOrder(null);
			}
		});
		$("#switchToDishOrderListViewButton", container).click(function() {
			fireEvent('onSwitchViewCommand', 'DISH_ORDER_LIST_VIEW');
		});
		$("#newDishOrderButton", container).click(function() {
			dishOrder = dishOrderManager.getCurrentDishOrder();
			if (dishOrder) {
				dishOrderCache.saveClientDishOrder(dishOrder);
				dishOrderManager.setCurrentDishOrder(null);
			}
		});
		$("#dishOrderTagsButton").click(
				function() {
					dishOrder = dishOrderManager.getCurrentDishOrder();
					if (!dishOrder) {
						return;
					}

					new EditTagsDialog('DishOrder', dishOrderManager
							.getCurrentDishOrder(), function(tags, freeTag) {
						dishOrderManager.setDishOrderTags(tags);
					}).show();
				});
		$("#switchToCheckoutViewButton", container).click(function() {
			fireEvent('onSwitchViewCommand', 'CHECKOUT_VIEW');
		});
		$("#logoutEmployeeButton", container).click(function() {
			window.location.href = '../j_spring_security_logout';
		});

		var cmdButtonContainer = $("#dishOrderItemCmdPanel", container);
		var listContainer = $("#dishOrderItemList", container);
		new OrderItemList(null, cmdButtonContainer, listContainer,
				updateDishOrderInfo);
		dishPicker = new DishPicker($('#dishViewLeft', container));
	};

	this.show = function() {
		$(container).show();
		dishPicker.refreshUI();
		updateDishOrderInfo();
		updateLoginInfo();
	};

	this.hide = function() {
		$(container).hide();
	};

	init();
}
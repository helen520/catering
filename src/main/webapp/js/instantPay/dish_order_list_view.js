function DishOrderListView(container) {
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

	var init = function() {
		dishOrderCache.attachEvent('onMyDishOrderSetChanged', renderDishOrders);

		$("#switchToDishViewButton", container).click(function() {
			fireEvent('onSwitchViewCommand', 'DISH_VIEW');
		});

		$("#searchDishOrdersByIdButton", container).click(function() {
			authorityManager.getAuthority('canEditDishOrder', function() {
				var idPart = $("#searchDishOrdreIdText", container).val();
				if (idPart.length < 3) {
					new AlertDialog('提示', '请至少输入三位数.').show();
					return;
				}

				dishOrderCache.searchDishOrdersById(idPart, renderDishOrders);
			});
		});

		$("#myDishOrdersButton", container).click(function() {
			authorityManager.getAuthority('canEditDishOrder', function() {
				dishOrderCache.loadMyDishOrders();
			});
		});
	};

	this.show = function() {
		$(container).show();
	};

	this.hide = function() {
		$(container).hide();
	};

	var renderDishOrders = function(dishOrders) {

		var dishOrderListPanel = $('#dishOrderListPanel', container);

		dishOrderListPanel.empty();
		for ( var i in dishOrders) {
			var dishOrder = dishOrders[i];
			if (dishOrder) {
				var dishOrderDiv = $('<div>').addClass("dishOrder").appendTo(
						dishOrderListPanel);
				var dishOrderCaptionDiv = $('<div>').addClass("captionPanel")
						.appendTo(dishOrderDiv);
				var dishOrderItemListDiv = $('<div>').addClass(
						"dishOrderItemListPanel").appendTo(dishOrderDiv);

				var dishOrderId = $.trim(dishOrder.id);
				var dishOrderBriefId = dishOrderId.substring(
						dishOrderId.length - 4, dishOrderId.length);
				var dishOrderCaptionHtml = "&yen;" + dishOrder.totalPrice;
				dishOrderCaptionHtml += " " + $.i18n.prop('string_NO') + ":"
						+ dishOrderBriefId;
				dishOrderCaptionDiv.html(dishOrderCaptionHtml);
				if (dishOrder.id == 0) {
					dishOrderCaptionDiv.css('background-color', '#B5D9B3');
				}

				var restoreOrderButton = $("<button>").addClass("button").text(
						$.i18n.prop('string_Restore')).data("dishOrder",
						dishOrder).click(restoreOrderButtonClick).appendTo(
						dishOrderCaptionDiv);
				function restoreOrderButtonClick() {
					var dishOrder = $(this).data("dishOrder");

					authorityManager.getAuthority('canPayDishOrder',
							restoreDishOrder);
					function restoreDishOrder() {
						dishOrderCache.removeClientDishOrder(dishOrder);
						dishOrderManager.setCurrentDishOrder(dishOrder);
						fireEvent('onSwitchViewCommand', 'CHECKOUT_VIEW');
					}
				}

				var orderItems = dishOrder.orderItems;
				for ( var i in orderItems) {
					var orderItem = orderItems[i];
					var orderItemsHtml = "<div class=\"button orderItem\">";
					orderItemsHtml += orderItem.dishName;
					orderItemsHtml += "</div>";
					$(orderItemsHtml).appendTo(dishOrderItemListDiv);
				}
			}
		}
	};

	init();
}
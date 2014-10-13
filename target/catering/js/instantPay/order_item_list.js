function OrderItemList(bindingDishId, cmdButtonContainer, listContainer,
		orderItemChangedCallback) {
	var self = this;

	var dishOrderManager = DishOrderManager.getInstance();

	var init = function() {
		dishOrderManager.attachEvent('onCurrentDishOrderChanged', self.render);
		self.render();
	};

	this.render = function() {
		var currentDishOrder = dishOrderManager.getCurrentDishOrder();

		if (!currentDishOrder
				|| currentDishOrder.state == DISH_ORDER_STATE.CANCELLED) {
			listContainer.empty();
			return;
		}

		var listCount = listContainer.children().length;
		var index = 0;
		var number = 0;

		var mealDealOrderItemByTriggerIdMap = {};
		for ( var i in currentDishOrder.orderItems) {
			var orderItem = currentDishOrder.orderItems[i];
			if (orderItem.triggerId) {
				if (!mealDealOrderItemByTriggerIdMap[orderItem.triggerId]) {
					mealDealOrderItemByTriggerIdMap[orderItem.triggerId] = [];
				}
				mealDealOrderItemByTriggerIdMap[orderItem.triggerId]
						.push(orderItem);
			}
		}

		for ( var i in currentDishOrder.orderItems) {

			var orderItem = currentDishOrder.orderItems[i];
			if (bindingDishId && orderItem.dishId != bindingDishId) {
				continue;
			}
			if (bindingDishId && orderItem.state != ORDER_ITEM_STATE.WAITING) {
				continue;
			}

			if (orderItem.mealDealItemId || orderItem.triggerId) {
				continue;
			}

			var orderItemDiv = getOrderItemViewer(index++, number++, orderItem);
			if (index <= listCount) {
				listContainer.children().eq(index - 1)
						.replaceWith(orderItemDiv);
			} else {
				listContainer.append(orderItemDiv);
			}

			if (orderItem.hasMealDealItems) {
				var mealDealOrderItems = [];
				if (orderItem.id != 0) {
					mealDealOrderItems = mealDealOrderItemByTriggerIdMap[orderItem.id];
				} else {
					mealDealOrderItems = mealDealOrderItemByTriggerIdMap[orderItem.clientTriggerId];
				}

				if (mealDealOrderItems) {
					for (var j = 0; j < mealDealOrderItems.length; j++) {
						var item = mealDealOrderItems[j];
						var mealDealOrderItemDiv = getMealDealItemViewer(
								index++, number, j, item);
						if (index <= listCount) {
							listContainer.children().eq(index - 1).replaceWith(
									mealDealOrderItemDiv);
						} else {
							listContainer.append(mealDealOrderItemDiv);
						}
					}
				}
			}
		}

		var itemsToRemove = [];
		for (var i = index; i < listCount; i++) {
			itemsToRemove.push(listContainer.children().eq(i));
		}
		for ( var i in itemsToRemove) {
			itemsToRemove[i].remove();
		}
	};

	var appendSuspendAndNoCookingCheckBoxes = function(container, index,
			orderItem) {
		var suspendCheckboxLabel = $("<label>").text(
				$.i18n.prop('string_Suspend')).appendTo(container);
		var suspendCheckbox = $("<input>")
				.attr("id", "suspendCheckbox" + index).attr("type", "checkbox")
				.attr("checked", orderItem.suspended);
		suspendCheckboxLabel.prepend(suspendCheckbox);

		suspendCheckbox.click(function() {
			orderItem.suspended = orderItem.suspended == true ? false : true;
			this.checked = orderItem.suspended;

			if (orderItem.hasMealDealItems) {
				for ( var i in $curDishOrder.orderItems) {
					var oi = $curDishOrder.orderItems[i];
					if (oi.triggerId == orderItem.clientTriggerId) {
						oi.suspended = orderItem.suspended;
					}
				}
			}

			render();
			select(index);
		});

		var noCookingCheckboxLabel = $("<label>").text(
				$.i18n.prop('string_NoCooking')).appendTo(container);
		var noCookingCheckbox = $("<input>").attr("id",
				"noCookingCheckbox" + index).attr("type", "checkbox").attr(
				"checked", orderItem.noCooking);

		noCookingCheckboxLabel.prepend(noCookingCheckbox);

		noCookingCheckbox.click(function() {
			orderItem.noCooking = orderItem.noCooking == true ? false : true;
			this.checked = orderItem.noCooking;

			if (orderItem.hasMealDealItems) {
				for ( var i in $curDishOrder.orderItems) {
					var oi = $curDishOrder.orderItems[i];
					if (oi.triggerId == orderItem.clientTriggerId) {
						oi.noCooking = orderItem.noCooking;
					}
				}
			}

			render();
			select(index);
		});
	};

	var appendDishNameAndPriceElements = function(container, orderItem) {
		var dishNameDiv = $("<div>").text(orderItem.dishName).addClass(
				"orderItemDishNameDiv").appendTo(container);
		if (orderItem.state == ORDER_ITEM_STATE.CANCELLED) {
			dishNameDiv.css("text-decoration", "line-through");
		}

		if (orderItem.state == ORDER_ITEM_STATE.WAITING && orderItem.editable
				&& !orderItem.hasMealDealItems) {
			dishNameDiv.click(editOrderItemClick);
			var editOrderItemIcon = $("<img>").attr("src",
					"../images/icon_edit_order_item.png").addClass(
					"editOrderItemIcon").click(editOrderItemClick).appendTo(
					orderItemPanel);
			function editOrderItemClick() {
				var dialogContent = getEditOrderItemPanel(orderItem, okCallback);
				var dialog = $(dialogContent).modal({
					level : 3
				});

				function okCallback() {
					render();
					select(index);
					dialog.close();
					listContainer.hide();
					setTimeout(function() {
						listContainer.show();
					}, 200);
					updateDishOrderInfo();
				}
			}
		}

		var orderItemPriceDiv = $("<div>").addClass("orderItemPriceDiv");

		var orgPrice = dishOrderManager.getOrderItemOrgPrice(orderItem);
		var noOverallDiscount = orderItem.noOverallDiscount != null
				&& orderItem.noOverallDiscount == true ? "*" : "";

		if (orgPrice != orderItem.price) {
			var orgPriceLabel = $("<del>").text("￥" + orgPrice).css("color",
					"gray");
			var priceLabel = $("<span>").text(
					" ￥" + orderItem.price + noOverallDiscount);
			orgPriceLabel.appendTo(orderItemPriceDiv);
			priceLabel.appendTo(orderItemPriceDiv);
		} else {
			orderItemPriceDiv.text("￥" + orderItem.price + noOverallDiscount);
		}

		orderItemPriceDiv.appendTo(container);

		if (orderItem.id != 0) {
			if (orderItem.state == ORDER_ITEM_STATE.CANCELLED) {
				container.css("color", "#666666").css("background-color",
						"#EEEEEE");
				$("<div>").text("[" + $.i18n.prop('string_Cancelled') + "]")
						.addClass("stateLabel").appendTo(dishNameDiv);
			} else {
				container.css("color", "#666666");
				var stateText = "[" + $.i18n.prop('string_Submitted');

				if (orderItem.suspended) {
					stateText += "," + $.i18n.prop('string_Suspended');
				}

				if (orderItem.noCooking) {
					stateText += "," + $.i18n.prop('string_NoCooking');
				}

				stateText += "]";
				$("<div>").text(stateText).addClass("stateLabel").appendTo(
						dishNameDiv);
			}
		}
	};

	var appendAmountAndCancelButtons = function(container, orderItem) {
		var amountButton = $("<a>").text("+").addClass("amountButton")
				.addClass("button").appendTo(container);
		if (orderItem.state == ORDER_ITEM_STATE.WAITING) {
			amountButton
					.click(function() {
						orderItem.amount += 1;
						if (orderItem.hasMealDealItems) {
							for ( var i in $curDishOrder.orderItems) {
								var oi = $curDishOrder.orderItems[i];
								if (oi.triggerId != null
										&& (oi.triggerId == orderItem.clientTriggerId || oi.triggerId == orderItem.id)) {
									oi.amount += 1;
								}
							}
						}
						render();
						select(index);
						if (orderItemChangedCallback) {
							orderItemChangedCallback();
						}
					});
		} else {
			amountButton.css("background-color", "#CCCCCC");
		}

		$("<span>").text(orderItem.amount + orderItem.unit).appendTo(container);

		amountButton = $("<a>").text("-").addClass("amountButton").addClass(
				"button").appendTo(container);

		if (orderItem.state == ORDER_ITEM_STATE.WAITING) {
			amountButton
					.click(function() {
						if (orderItem.amount >= 1) {
							orderItem.amount -= 1;
							if (orderItem.hasMealDealItems) {
								for ( var i in $curDishOrder.orderItems) {
									var oi = $curDishOrder.orderItems[i];
									if (oi.triggerId != null
											&& (oi.triggerId == orderItem.clientTriggerId || oi.triggerId == orderItem.id)) {
										oi.amount -= 1;
									}
								}
							}
						}
						render();
						select(index);
						if (orderItemChangedCallback) {
							orderItemChangedCallback();
						}
					});
		} else {
			amountButton.css("background-color", "#CCCCCC");
		}

		var cancelButton = $("<a>").text("X").addClass("amountButton")
				.addClass("button").appendTo(container);
		if (orderItem.state == ORDER_ITEM_STATE.CANCELLED
				|| (typeof $isWechatSelf != 'undefined' && orderItem.state != ORDER_ITEM_STATE.WAITING)) {
			cancelButton.css("background-color", "#CCCCCC");
		} else {
			cancelButton.click(cancelButtonClick);
		}
		function cancelButtonClick() {
			if (orderItem.state != ORDER_ITEM_STATE.WAITING) {
				cancelSubmittedOrderItem();
			} else {
				var oiIndex = $curDishOrder.orderItems.indexOf(orderItem);
				if (oiIndex > -1) {
					$curDishOrder.orderItems.splice(oiIndex, 1);
				}
				if (orderItem.hasMealDealItems) {
					for (var i = $curDishOrder.orderItems.length - 1; i >= 0; i--) {
						var oi = $curDishOrder.orderItems[i];
						if (oi.triggerId != null
								&& (oi.triggerId == orderItem.clientTriggerId || oi.triggerId == orderItem.id)) {
							oiIndex = $curDishOrder.orderItems.indexOf(oi);
							if (oiIndex > -1) {
								$curDishOrder.orderItems.splice(oiIndex, 1);
							}
						}
					}
				}
				render();
				select(index);

				if (orderItemChangedCallback) {
					orderItemChangedCallback();
				}
			}
		}
		function cancelSubmittedOrderItem() {
			if (orderItem.amount > 1) {
				showAmountDialog("选择删除数量", cancelResionDailog, orderItem.amount);
			} else {
				cancelResionDailog(1);
			}
		}

		function cancelResionDailog(amount) {

			var dialogContent = getCancelReasonPanel(index, orderItem, amount,
					okCallback, cancelCallback);
			var dialog = $(dialogContent).modal({
				level : 2
			});

			function okCallback() {
				dialog.close();
			}
			function cancelCallback() {
				dialog.close();
			}
		}
	};

	var appendExtraInfoElements = function(container, orderItem) {
		var clearDiv = $("<div>").addClass("orderItemExtraInfoClear");
		var optionsText = OrderItem.getOptionsText(orderItem);
		if (optionsText && optionsText != "") {
			clearDiv.appendTo(container);
			var dishTagsLabel = $("<label>").text(
					$.i18n.prop('string_xuanXiang')// "选项:"
							+ "：" + optionsText).addClass("infoLabel");
			dishTagsLabel.appendTo(container);
		}

		clearDiv = $("<div>").addClass("orderItemExtraInfoClear");
		var tagsText = OrderItem.getTagsText(orderItem);
		if (tagsText && tagsText != "") {
			clearDiv.appendTo(container);
			$("<label>").text($.i18n.prop('string_zuoFa')// "做法:"
					+ "：" + tagsText).addClass("infoLabel").appendTo(container);
		}

		clearDiv = $("<div>").addClass("orderItemExtraInfoClear");
		if (orderItem.discountRuleId) {
			var discountRule = $discountRuleMap[orderItem.discountRuleId];
			if (discountRule) {
				clearDiv.appendTo(container);
				var discountRuleLabel = $("<label>").addClass("infoLabel");
				discountRuleLabel.text($.i18n.prop('string_youHui')// "优惠:"
						+ "：" + discountRule.name);
				discountRuleLabel.appendTo(container);
			}
		}

		$("<div>").css("clear", "both").appendTo(container);
	};

	var getOrderItemViewer = function(index, number, orderItem) {

		var orderItemDiv = $("<div>").data("orderItem", orderItem).addClass(
				"orderItemDiv");
		$("<div>").text(number + 1).addClass("orderItemNumberDiv").appendTo(
				orderItemDiv);

		var orderItemPanel = $("<div>").addClass("orderItemPanel");
		appendDishNameAndPriceElements(orderItemPanel, orderItem);
		$("<div>").css("clear", "both").appendTo(orderItemPanel);

		var orderItemAmountDiv = $("<div>").addClass("orderItemAmountDiv");
		if (orderItem.state == ORDER_ITEM_STATE.WAITING) {
			appendSuspendAndNoCookingCheckBoxes(orderItemAmountDiv, index,
					orderItem);
		}

		appendAmountAndCancelButtons(orderItemAmountDiv, orderItem);
		orderItemAmountDiv.appendTo(orderItemPanel);

		appendExtraInfoElements(orderItemPanel, orderItem);

		orderItemPanel.appendTo(orderItemDiv);
		$("<div>").css("clear", "both").appendTo(orderItemDiv);

		orderItemDiv.click(function() {
			select(index);
		});

		return orderItemDiv;
	};

	function getMealDealItemViewer(index, parentIndex, clientIndex, orderItem) {
		var orderItemDiv = $("<div>").data("orderItem", orderItem).addClass(
				"orderItemDiv");

		$("<div>").text(parentIndex + "." + (clientIndex + 1)).addClass(
				"mealDealItemNumberDiv").appendTo(orderItemDiv);

		var orderItemPanel = $("<div>").addClass("orderItemPanel");
		appendDishNameAndPriceElements(orderItemPanel, orderItem);
		$("<div>").css("clear", "both").appendTo(orderItemPanel);

		var orderItemAmountDiv = $("<div>").addClass("orderItemAmountDiv");
		$("<span>").text(orderItem.amount + orderItem.unit).appendTo(
				orderItemAmountDiv);
		orderItemAmountDiv.appendTo(orderItemPanel);

		appendExtraInfoElements(orderItemPanel, orderItem);

		orderItemPanel.appendTo(orderItemDiv);
		$("<div>").css("clear", "both").appendTo(orderItemDiv);

		orderItemDiv.click(function() {
			select(index);
		});

		return orderItemDiv;
	}

	function select(index) {
		var selectIndex = index < 0 ? 0 : index;
		var orderItemDivs = listContainer.children();
		if (orderItemDivs.length == 0) {
			return;
		}

		selectIndex = index >= orderItemDivs.length ? orderItemDivs.length - 1
				: index;
		orderItemDivs.removeClass("orderItemDivSelected");
		$(orderItemDivs[selectIndex]).addClass("orderItemDivSelected");

		orderItem = $(orderItemDivs[selectIndex]).data("orderItem");

		if (cmdButtonContainer) {
			cmdButtonContainer.empty();
			appendCmdButtons(selectIndex, orderItem);
		}
	}

	function appendCmdButtons(index, orderItem) {

		var amountButton = $("<a>").addClass("button").css("margin-left",
				"0.6em").text($.i18n.prop('string_shuLiang'))// ("数量")
		.appendTo(cmdButtonContainer);
		function amountButtonClick() {
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
						render();
						select(index);
						if (orderItemChangedCallback) {
							orderItemChangedCallback();
						}
					});
		}
		if (orderItem.state == ORDER_ITEM_STATE.WAITING && !orderItem.triggerId) {
			amountButton.click(amountButtonClick);
		} else {
			amountButton.hide();
		}

		var changeDishButton = $("<a>").addClass("button").css("margin-left",
				"0.6em").text('换菜')// ("换菜")
		.appendTo(cmdButtonContainer);
		function changeDishButtonClick() {
			var dialogContent = getMealDealItemGoup(orderItem, okCallback);
			var dialog = $(dialogContent).modal({
				level : 2
			});

			function okCallback(result) {
				if (result) {
					orderItem.dishName = result.sourceDish.name;
					orderItem.dishId = result.sourceDish.id;
					orderItem.unit = result.sourceDish.unit;
					orderItem.dishPrice = result.priceDelta;
					orderItem.mealDealItemId = result.id;
				}
				render();
				select(index);
				dialog.close();
				if (orderItemChangedCallback) {
					orderItemChangedCallback();
				}
			}
		}
		if (orderItem.state == ORDER_ITEM_STATE.WAITING && orderItem.triggerId) {
			changeDishButton.click(changeDishButtonClick);
		} else {
			changeDishButton.hide();
		}

		var optionsButton = $("<a>").addClass("button").css("margin-left",
				"0.6em").text($.i18n.prop('string_xuanXiang'))// ("选项")
		.appendTo(cmdButtonContainer);
		function optionsButtonClick() {
			var dialogContent = getOptionsPanel(orderItem, okCallback,
					cancelCallback);
			var dialog = $(dialogContent).modal({
				level : 2
			});

			function okCallback() {
				render();
				select(index);
				dialog.close();
				if (orderItemChangedCallback) {
					orderItemChangedCallback();
				}
			}

			function cancelCallback() {
				dialog.close();
			}
		}
		if (orderItem.state == ORDER_ITEM_STATE.WAITING) {
			optionsButton.click(optionsButtonClick);
		} else {
			optionsButton.hide();
		}

		var tagsButton = $("<a>").addClass("button")
				.css("margin-left", "0.6em").text($.i18n.prop('string_zuoFa'))// ("做法")
				.appendTo(cmdButtonContainer);
		function tagsButtonClick() {
			var dialogContent = getCommonTagsPanel(index, orderItem, okCallback);
			var dialog = $(dialogContent).modal({
				level : 2
			});

			function okCallback() {
				dialog.close();
				if (orderItemChangedCallback) {
					orderItemChangedCallback();
				}
			}
		}
		if (orderItem.state == ORDER_ITEM_STATE.WAITING) {
			tagsButton.click(tagsButtonClick);
		} else {
			tagsButton.hide();
		}

		if (typeof $isWechatSelf == 'undefined') {
			var discountRuleButton = $("<a>").addClass("button").css(
					"margin-left", "0.6em").text($.i18n.prop('string_youHui'))// ("优惠")
			.appendTo(cmdButtonContainer);
			function discountRuleButtonClick() {
				var dialogContent = getDiscountRulePanel(index, orderItem,
						okCallback);
				var dialog = $(dialogContent).modal({
					level : 2
				});

				function okCallback() {
					select(index);
					dialog.close();
				}
			}
			if (orderItem.state != ORDER_ITEM_STATE.CANCELLED
					&& !orderItem.triggerId) {
				discountRuleButton.click(discountRuleButtonClick);
			} else {
				discountRuleButton.hide();
			}
			var moveOrderItemButton = $("<a>").addClass("button").css(
					"margin-left", "0.6em")
					.text($.i18n.prop('string_zhuanDan'))// ("转单")
					.appendTo(cmdButtonContainer);
			if (orderItem.state != ORDER_ITEM_STATE.WAITING
					&& orderItem.state != ORDER_ITEM_STATE.CANCELLED
					&& !orderItem.triggerId) {
				moveOrderItemButton.click(function() {
					var dialogContent = getMoveOrderItemPanel(index, orderItem,
							okCallback, cancelCallback);
					var dialog = $(dialogContent).modal({
						level : 2
					});
					dialogContent.deskPicker.refreshUI();

					function okCallback() {
						dialog.close();
					}
					function cancelCallback() {
						dialog.close();
					}
				});
			} else {
				moveOrderItemButton.hide();
			}
		}
	}

	init();
}

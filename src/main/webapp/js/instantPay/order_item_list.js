function OrderItemList(bindingDishId, cmdButtonContainer, listContainer) {
	var self = this;

	var uiDataManager = UIDataManager.getInstance();
	var dishOrderManager = DishOrderManager.getInstance();
	var dishOrderCache = DishOrderCache.getInstance();
	
	var init = function() {
		dishOrderManager.attachEvent('onCurrentDishOrderChanged', self.render);
		dishOrderManager.attachEvent('onDishOrdered', onDishOrderedHandler);

		function onDishOrderedHandler(orderItem) {
			var orderItemDivs = listContainer.children();
			for (var i = 0; i < orderItemDivs.length; i++) {
				var orderItemDiv = $(orderItemDivs[i]);
				if (orderItemDiv.data('orderItem') == orderItem) {
					select(orderItemDiv.data('index'));
					listContainer.scrollTop(5000);
				}
			}
		}

		self.render();
	};

	var select = function(index) {
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
	};

	var appendSuspendAndNoCookingCheckBoxes = function(container, index,
			orderItem) {
		if (orderItem.id != 0 || !cmdButtonContainer) {
			return;
		}
		var propertyDict = {
			'suspended' : 'Suspended',
			'noCooking' : 'NoCooking'
		}
		for ( var key in propertyDict) {
			var checkboxLabel = $("<label>").text(
					$.i18n.prop('string_' + propertyDict[key])).appendTo(
					container);
			var checkbox = $("<input>").attr("id", key + "Checkbox" + index)
					.attr("type", "checkbox").attr("checked", orderItem[key])
					.data("property", propertyDict[key]);
			checkboxLabel.prepend(checkbox);
			checkbox.click(checkboxClick);
			function checkboxClick(event) {
				event.preventDefault();
				var property = $(this).data('property');
				dishOrderManager['setOrderItem' + property](orderItem,
						this.checked);
				select(index);
			}
		}
	};

	var appendDishNameAndPriceElements = function(container, index, orderItem) {
		var dishNameDiv = $("<div>").text(orderItem.dishName).addClass(
				"orderItemDishNameDiv").appendTo(container);
		if (orderItem.state == OrderItem.STATE.CANCELLED) {
			dishNameDiv.css("text-decoration", "line-through");
		}

		if (orderItem.id == 0 && orderItem.editable) {
			dishNameDiv.click(editOrderItemButtonClick);
			var editOrderItemIcon = $("<img>").attr("src",
					"/rice4/static/images/icon_edit_order_item.png").addClass(
					"editOrderItemIcon").click(editOrderItemButtonClick)
					.appendTo(container);
			function editOrderItemButtonClick() {
				new EditOrderItemDialog(orderItem, okCallback).show();
				function okCallback(dishName, departmentId, dishPrice, unit) {
					dishOrderManager.setEditableOrderItemProperties(orderItem,
							dishName, departmentId, dishPrice, unit);
					select(index);
				}
			}
		}

		var orderItemPriceDiv = $("<div>").addClass("orderItemPriceDiv");

		var orgPrice = orderItem.orgPrice;
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
			if (orderItem.state == OrderItem.STATE.CANCELLED) {
				container.css("color", "#666666").css("background-color",
						"#EEEEEE");
				$("<div>").text(
						"[" + orderItem.creatorName + ','
								+ $.i18n.prop('string_Cancelled') + "]")
						.addClass("stateLabel").appendTo(dishNameDiv);
			} else {
				container.css("color", "#666666");
				var stateText = "[" + orderItem.creatorName;

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

	var appendAmountAndCancelButtons = function(container, index, orderItem) {

		var increaseAmountButton = $("<a>").text("+").data('amount', 1)
				.addClass("amountButton").addClass("button")
				.appendTo(container);
		var decreaseAmountButton = $("<a>").text("-").data('amount', -1)
				.addClass("amountButton").addClass("button");

		if (orderItem.id == 0) {
			increaseAmountButton.click(changeAmountButtonClick);
			decreaseAmountButton.click(changeAmountButtonClick);
			function changeAmountButtonClick() {
				var amount = $(this).data('amount');
				dishOrderManager.setOrderItemAmount(orderItem, orderItem.amount
						+ amount);
				select(index);
			}
		} else {
			increaseAmountButton.css("background-color", "#CCCCCC");
			decreaseAmountButton.css("background-color", "#CCCCCC");
		}
		$("<span>").text(orderItem.amount + orderItem.unit).appendTo(container);
		decreaseAmountButton.appendTo(container);

		var cancelButton = $("<a>").text("X").addClass("amountButton")
				.addClass("button").appendTo(container);
		if (orderItem.state == OrderItem.STATE.CANCELLED) {
			cancelButton.css("background-color", "#CCCCCC");
		} else {
			cancelButton.click(cancelButtonClick);
			function cancelButtonClick() {
				if (orderItem.id == 0) {
					dishOrderManager.cancelOrderItem(orderItem);
					return;
				}

				AuthorityManager.getInstance().getAuthority(
						'canCancelOrderItem',
						function() {
							new CancelReasonDialog(function(cancelReason) {
								if (orderItem.amount == 1) {
									dishOrderManager.cancelOrderItem(orderItem,
											1, cancelReason);
									return;
								}
								new AmountDialog($.i18n.prop('string_Amount'),
										orderItem.amount, function(amount) {
											dishOrderManager.cancelOrderItem(
													orderItem, amount,
													cancelReason);
										}).show();
							}).show();

							select(index);
						});
			}
		}
	};

	var appendExtraInfoElements = function(container, orderItem) {
		var clearDiv = $("<div>").addClass("orderItemExtraInfoClear");
		var optionsText = OrderItemTag.tagsToText(orderItem.options);
		if (optionsText && optionsText != "") {
			clearDiv.appendTo(container);
			var dishTagsLabel = $("<label>").text($.i18n.prop('string_Options')// "选项:"
					+ "：" + optionsText).addClass("infoLabel");
			dishTagsLabel.appendTo(container);
		}

		clearDiv = $("<div>").addClass("orderItemExtraInfoClear");
		var tagsText = OrderItem.getTagsText(orderItem);
		if (tagsText && tagsText != "") {
			clearDiv.appendTo(container);
			$("<label>").text($.i18n.prop('string_Tags')// "做法:"
					+ "：" + tagsText).addClass("infoLabel").appendTo(container);
		}

		clearDiv = $("<div>").addClass("orderItemExtraInfoClear");
		if (orderItem.discountRuleId) {
			var discountRule = uiDataManager
					.getDiscountRuleById(orderItem.discountRuleId);
			if (discountRule) {
				clearDiv.appendTo(container);
				var discountRuleLabel = $("<label>").addClass("infoLabel");
				discountRuleLabel.text($.i18n.prop('string_Discount')// "优惠:"
						+ "：" + discountRule.name);
				discountRuleLabel.appendTo(container);
			}
		}

		$("<div>").css("clear", "both").appendTo(container);
	};

	var appendCmdButtons = function(index, orderItem) {

		var amountButton = $("<a>").addClass("button").css("margin-left",
				"0.6em").text($.i18n.prop('string_Amount'));
		if (orderItem.id == 0 && !orderItem.clientTriggerId) {
			amountButton.click(amountButtonClick).appendTo(cmdButtonContainer);
			function amountButtonClick() {
				new DishAmountDialog($.i18n.prop('string_Amount'), orderItem,
						okCallback).show();
				function okCallback(amount, unit) {
					orderItem.unit = unit;
					var dishUnit = uiDataManager.getDishUnitByName(unit);
					orderItem.unitExchangeRate = dishUnit ? dishUnit.exchangeRate
							: 1;
					dishOrderManager.setOrderItemAmount(orderItem, amount);
				}
			}
		}

		var optionsButton = $("<a>").addClass("button").css("margin-left",
				"0.6em").text($.i18n.prop('string_Options'));
		if (orderItem.id == 0) {
			optionsButton.click(
					function() {
						new EditOrderItemOptionsDialog(orderItem, function(
								options, freeTag) {
							dishOrderManager.setOrderItemOptions(orderItem,
									options);
							dishOrderManager.setOrderItemFreeTag(orderItem,
									freeTag);
							select(index);
						}).show();
					}).appendTo(cmdButtonContainer);
		}

		var tagsButton = $("<a>").addClass("button")
				.css("margin-left", "0.6em").text($.i18n.prop('string_Tags'));
		if (orderItem.id == 0) {
			tagsButton.click(tagsButtonClick).appendTo(cmdButtonContainer);
			function tagsButtonClick() {
				new EditTagsDialog('OrderItem', orderItem, function(tags,
						freeTag) {
					dishOrderManager.setOrderItemTags(orderItem, tags);
					dishOrderManager.setOrderItemFreeTag(orderItem, freeTag);
					select(index);
				}).show();
			}
		}

		var discountRuleButton = $("<a>").addClass("button").css("margin-left",
				"0.6em").text($.i18n.prop('string_Discount'));
		if (!orderItem.clientTriggerId) {
			discountRuleButton.click(discountRuleButtonClick).appendTo(
					cmdButtonContainer);
			function discountRuleButtonClick() {
				new DiscountRuleDialog(orderItem, function(discountRule) {
					dishOrderManager.setOrderItemDiscountRule(orderItem,
							discountRule);
					select(index);
				}).show();
			}
		}

		var moveOrderItemButton = $("<a>").addClass("button").css(
				"margin-left", "0.6em").text($.i18n.prop('string_ChangeOrder'))
				.appendTo(cmdButtonContainer);
		if (orderItem.id != 0 && orderItem.state != OrderItem.STATE.CANCELLED
				&& !orderItem.clientTriggerId) {
			moveOrderItemButton.click(function() {
				var dishOrder = dishOrderManager.getCurrentDishOrder();
				var desk = uiDataManager.getDeskById(dishOrder.deskId);
				new SelectDeskDialog(desk, $.i18n.prop('string_ChangeOrder'),
						DeskPicker.filter.occupiedDeskOnly, okCallback).show();
				function okCallback(targetDesk) {
					var dob = dishOrderCache
							.getDishOrderBriefByDeskId(targetDesk.id);
					if (dob && dob.state == DishOrder.STATE.PROCESSING) {
						var targetDishOrderId = dob.id;
						dishOrderManager.moveOrderItem(targetDishOrderId,
								orderItem);
						select(index);
					}
				}
			});
		} else {
			moveOrderItemButton.hide();
		}

		var changeDishButton = $("<a>").addClass("button").css("margin-left",
				"0.6em").text($.i18n.prop('string_ChangeDish')).appendTo(
				cmdButtonContainer);
		function changeDishButtonClick() {

			new SelectMealDealDishDialog(orderItem, okCallback).show();
			function okCallback(mealDealItem) {
				if (mealDealItem) {
					dishOrderManager
							.changeMealDealItem(orderItem, mealDealItem);
				}
				select(index);
			}
		}

		if (orderItem.id == 0 && orderItem.clientTriggerId) {
			changeDishButton.click(changeDishButtonClick);
		} else {
			changeDishButton.hide();
		}
	};

	var getOrderItemViewer = function(index, number, orderItem) {

		var orderItemDiv = $("<div>").data("orderItem", orderItem).data(
				'index', index).addClass("orderItemDiv");
		$("<div>").text(number + 1).addClass("orderItemNumberDiv").appendTo(
				orderItemDiv);

		var orderItemPanel = $("<div>").addClass("orderItemPanel");
		appendDishNameAndPriceElements(orderItemPanel, index, orderItem);
		$("<div>").css("clear", "both").appendTo(orderItemPanel);

		var orderItemAmountDiv = $("<div>").addClass("orderItemAmountDiv");
		if (orderItem.state == OrderItem.STATE.WAITING) {
			appendSuspendAndNoCookingCheckBoxes(orderItemAmountDiv, index,
					orderItem);
		}

		appendAmountAndCancelButtons(orderItemAmountDiv, index, orderItem);
		orderItemAmountDiv.appendTo(orderItemPanel);

		appendExtraInfoElements(orderItemPanel, orderItem);

		orderItemPanel.appendTo(orderItemDiv);
		$("<div>").css("clear", "both").appendTo(orderItemDiv);

		orderItemDiv.click(function() {
			select(index);
		});

		return orderItemDiv;
	};

	var getSubOrderItemViewer = function(index, parentIndex, subIndex,
			subOrderItem) {
		var orderItemDiv = $("<div>").data("orderItem", subOrderItem).data(
				'index', index).addClass("orderItemDiv");

		$("<div>").text(parentIndex + "." + subIndex).addClass(
				"mealDealItemNumberDiv").appendTo(orderItemDiv);

		var orderItemPanel = $("<div>").addClass("orderItemPanel");
		appendDishNameAndPriceElements(orderItemPanel, index, subOrderItem);
		$("<div>").css("clear", "both").appendTo(orderItemPanel);

		var orderItemAmountDiv = $("<div>").addClass("orderItemAmountDiv");
		$("<span>").text(subOrderItem.amount + subOrderItem.unit).appendTo(
				orderItemAmountDiv);
		orderItemAmountDiv.appendTo(orderItemPanel);

		appendExtraInfoElements(orderItemPanel, subOrderItem);

		orderItemPanel.appendTo(orderItemDiv);
		$("<div>").css("clear", "both").appendTo(orderItemDiv);

		orderItemDiv.click(function() {
			select(index);
		});

		return orderItemDiv;
	};

	this.render = function() {
		var dishOrder = dishOrderManager.getCurrentDishOrder();

		if (!dishOrder || dishOrder.state == DishOrder.STATE.CANCELLED) {
			listContainer.empty();
			return;
		}

		var listCount = listContainer.children().length;
		var index = 0;
		var number = 0;

		for ( var i in dishOrder.orderItems) {

			var orderItem = dishOrder.orderItems[i];
			if (bindingDishId && orderItem.dishId != bindingDishId) {
				continue;
			}
			if (bindingDishId && orderItem.state != OrderItem.STATE.WAITING) {
				continue;
			}

			if (orderItem.clientTriggerId) {
				continue;
			}

			var orderItemDiv = getOrderItemViewer(index++, number++, orderItem);
			if (index <= listCount) {
				listContainer.children().eq(index - 1)
						.replaceWith(orderItemDiv);
			} else {
				listContainer.append(orderItemDiv);
			}

			var subOrderItems = DishOrder
					.getSubOrderItems(dishOrder, orderItem);
			for (var j = 1; j <= subOrderItems.length; j++) {
				var subOrderItemDiv = getSubOrderItemViewer(index++, number, j,
						subOrderItems[j - 1]);
				if (index <= listCount) {
					listContainer.children().eq(index - 1).replaceWith(
							subOrderItemDiv);
				} else {
					listContainer.append(subOrderItemDiv);
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

	init();
}

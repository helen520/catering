function OrderItemList(bindingDishId, cmdButtonContainer, listContainer,
		orderItemChangedCallback) {

	if ($curDishOrder == null) {
		return;
	}

	render();
	select(0);

	this.render = render;
	this.select = select;

	function render() {
		updateDishOrderPrice($curDishOrder);
		var listCount = listContainer.children().length;
		var index = 0;
		var number = 0;

		var mealDealItemByTriggerIdMap = {};
		for ( var i in $curDishOrder.orderItems) {
			var orderItem = $curDishOrder.orderItems[i];
			if (orderItem.triggerId) {
				if (!mealDealItemByTriggerIdMap[orderItem.triggerId]) {
					mealDealItemByTriggerIdMap[orderItem.triggerId] = [];
				}
				mealDealItemByTriggerIdMap[orderItem.triggerId].push(orderItem);
			}
		}

		for ( var i in $curDishOrder.orderItems) {

			var orderItem = $curDishOrder.orderItems[i];
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
				var mealDealItems = [];
				if (orderItem.id != 0) {
					mealDealItems = mealDealItemByTriggerIdMap[orderItem.id];
				} else
					mealDealItems = mealDealItemByTriggerIdMap[orderItem.clientTriggerId];

				if (mealDealItems) {
					for (var j = 0; j < mealDealItems.length; j++) {
						var item = mealDealItems[j];
						var mealDealItemDiv = getMealDealItemViewer(index++,
								number, j, item);
						if (index <= listCount) {
							listContainer.children().eq(index - 1).replaceWith(
									mealDealItemDiv);
						} else {
							listContainer.append(mealDealItemDiv);
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
	}

	function getOrderItemViewer(index, number, orderItem) {

		var orderItemDiv = $("<div>").data("orderItem", orderItem).addClass(
				"orderItemDiv");

		$("<div>").text(number + 1).addClass("orderItemNumberDiv").appendTo(
				orderItemDiv);

		var orderItemPanel = $("<div>").addClass("orderItemPanel");
		var dishNameDiv = $("<div>").text(orderItem.dishName).addClass(
				"orderItemDishNameDiv").appendTo(orderItemPanel);
		if (orderItem.state != ORDER_ITEM_STATE.WAITING
				&& orderItem.state == ORDER_ITEM_STATE.CANCELLED) {
			dishNameDiv.css("text-decoration", "line-through");
		}

		if (orderItem.state == ORDER_ITEM_STATE.WAITING && orderItem.editable) {
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

		orderItemPriceDiv.text("￥" + orderItem.price);

		orderItemPriceDiv.appendTo(orderItemPanel);
		$("<div>").css("clear", "both").appendTo(orderItemPanel);

		var orderItemAmountDiv = $("<div>").addClass("orderItemAmountDiv");

		if (orderItem.state == ORDER_ITEM_STATE.WAITING) {
			if (typeof $isWechatSelf == 'undefined') {
				var suspendCheckboxLabel = $("<label>").text(
						$.i18n.prop('string_jiaoQi')).appendTo(
						orderItemAmountDiv);
				var suspendCheckbox = $("<input>").attr("id",
						"suspendCheckbox" + index).attr("type", "checkbox")
						.attr("checked", orderItem.suspended);
				suspendCheckboxLabel.prepend(suspendCheckbox);

				suspendCheckbox.click(function() {
					orderItem.suspended = orderItem.suspended == true ? false
							: true;
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
					if (orderItemChangedCallback) {
						orderItemChangedCallback();
					}
				});

				var noCookingCheckboxLabel = $("<label>").text(
						$.i18n.prop('string_mianZuo')).appendTo(
						orderItemAmountDiv);
				var noCookingCheckbox = $("<input>").attr("id",
						"noCookingCheckbox" + index).attr("type", "checkbox")
						.attr("checked", orderItem.noCooking);

				noCookingCheckboxLabel.prepend(noCookingCheckbox);

				noCookingCheckbox.click(function() {
					orderItem.noCooking = orderItem.noCooking == true ? false
							: true;
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
					if (orderItemChangedCallback) {
						orderItemChangedCallback();
					}
				});
			}
		}

		var amountButton = $("<a>").text("+").addClass("amountButton")
				.addClass("button").appendTo(orderItemAmountDiv);
		if (orderItem.state == ORDER_ITEM_STATE.WAITING) {
			amountButton.click(function() {
				orderItem.amount += 1;
				render();
				select(index);
				if (orderItemChangedCallback) {
					orderItemChangedCallback();
				}
			});
		} else {
			amountButton.css("background-color", "#CCCCCC");
		}

		$("<span>").text(orderItem.amount + orderItem.unit).appendTo(
				orderItemAmountDiv);

		amountButton = $("<a>").text("-").addClass("amountButton").addClass(
				"button").appendTo(orderItemAmountDiv);

		if (orderItem.state == ORDER_ITEM_STATE.WAITING) {
			amountButton.click(function() {
				if (orderItem.amount >= 1) {
					orderItem.amount -= 1;
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
				.addClass("button").appendTo(orderItemAmountDiv);
		if (orderItem.state == ORDER_ITEM_STATE.CANCELLED
				|| (typeof $isWechatSelf != 'undefined' && orderItem.state != ORDER_ITEM_STATE.WAITING)
				|| !$storeData.employee
				|| (!$storeData.employee.canCancelOrderItem && orderItem.id != 0)) {
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

		orderItemAmountDiv.appendTo(orderItemPanel);

		var clearDiv = $("<div>").addClass("orderItemExtraInfoClear");
		var optionsText = getOrderItemOptionsText(orderItem);
		if (optionsText && optionsText != "") {
			clearDiv.appendTo(orderItemPanel);
			var dishTagsLabel = $("<label>").text(
					$.i18n.prop('string_xuanXiang')// "选项:"
							+ "：" + optionsText).addClass("infoLabel");
			dishTagsLabel.appendTo(orderItemPanel);
		}

		clearDiv = $("<div>").addClass("orderItemExtraInfoClear");
		var tagsText = getOrderItemTagsText(orderItem);
		if (tagsText && tagsText != "") {
			clearDiv.appendTo(orderItemPanel);
			$("<label>").text($.i18n.prop('string_zuoFa')// "做法:"
					+ "：" + tagsText).addClass("infoLabel").appendTo(
					orderItemPanel);
		}

		clearDiv = $("<div>").addClass("orderItemExtraInfoClear");
		if (orderItem.discountRuleId && (typeof $isWechatSelf == 'undefined')) {
			var discountRule = $discountRuleMap[orderItem.discountRuleId];
			if (discountRule) {
				clearDiv.appendTo(orderItemPanel);
				var discountRuleLabel = $("<label>").addClass("infoLabel");
				discountRuleLabel.text($.i18n.prop('string_youHui')// "优惠:"
						+ "：" + discountRule.name);
				discountRuleLabel.appendTo(orderItemPanel);
			}
		}

		$("<div>").css("clear", "both").appendTo(orderItemPanel);
		orderItemPanel.appendTo(orderItemDiv);
		$("<div>").css("clear", "both").appendTo(orderItemDiv);

		orderItemDiv.click(function() {
			select(index);
		});

		if (orderItem.id != 0) {
			if (orderItem.state == ORDER_ITEM_STATE.CANCELLED) {
				orderItemDiv.css("color", "#666666").css("background-color",
						"#EEEEEE");
				$("<div>").text("[" + $.i18n.prop('string_yiQuXiao') + "]")// ("[已取消]")
				.addClass("stateLabel").appendTo(dishNameDiv);
			} else if (orderItem.state == ORDER_ITEM_STATE.WAITING) {
				orderItemDiv.css("color", "#666666");
				$("<div>").text("[待确认]")// ("[待确认]")
				.addClass("stateLabel").appendTo(dishNameDiv);
			} else {
				orderItemDiv.css("color", "#666666");
				var stateText = "[" + $.i18n.prop('string_yiXiaDan');

				if (orderItem.suspended) {
					stateText += "," + $.i18n.prop('string_jiaoQi');
				}

				if (orderItem.noCooking) {
					stateText += "," + $.i18n.prop('string_mianZuo');
				}

				stateText += "]";
				$("<div>").text(stateText).addClass("stateLabel").appendTo(
						dishNameDiv);
			}
		}
		return orderItemDiv;
	}

	function getMealDealItemViewer(index, parentIndex, clientIndex, orderItem) {
		var orderItemDiv = $("<div>").data("orderItem", orderItem).addClass(
				"orderItemDiv");

		$("<div>").text(parentIndex + "." + (clientIndex + 1)).addClass(
				"mealDealItemNumberDiv").appendTo(orderItemDiv);

		var orderItemPanel = $("<div>").addClass("orderItemPanel");
		var dishNameDiv = $("<div>").text(orderItem.dishName).addClass(
				"orderItemDishNameDiv").appendTo(orderItemPanel);
		if (orderItem.state == ORDER_ITEM_STATE.CANCELLED) {
			dishNameDiv.css("text-decoration", "line-through");
		}

		var orderItemPriceDiv = $("<div>").addClass("orderItemPriceDiv");

		var orgPrice = getOrderItemOrgPrice($curDishOrder, orderItem);
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

		orderItemPriceDiv.appendTo(orderItemPanel);
		$("<div>").css("clear", "both").appendTo(orderItemPanel);

		var orderItemAmountDiv = $("<div>").addClass("orderItemAmountDiv");

		$("<span>").text(orderItem.amount + orderItem.unit).appendTo(
				orderItemAmountDiv);

		orderItemAmountDiv.appendTo(orderItemPanel);

		var clearDiv = $("<div>").addClass("orderItemExtraInfoClear");
		var optionsText = getOrderItemOptionsText(orderItem);
		if (optionsText && optionsText != "") {
			clearDiv.appendTo(orderItemPanel);
			var dishTagsLabel = $("<label>").text(
					$.i18n.prop('string_xuanXiang')// "选项:"
							+ optionsText).addClass("infoLabel");
			dishTagsLabel.appendTo(orderItemPanel);
		}

		clearDiv = $("<div>").addClass("orderItemExtraInfoClear");
		var tagsText = getOrderItemTagsText(orderItem);
		if (tagsText && tagsText != "") {
			clearDiv.appendTo(orderItemPanel);
			$("<label>").text($.i18n.prop('string_zuoFa')// "做法:"
					+ tagsText).addClass("infoLabel").appendTo(orderItemPanel);
		}

		clearDiv = $("<div>").addClass("orderItemExtraInfoClear");
		if (orderItem.discountRuleId && (typeof $isWechatSelf == 'undefined')) {
			var discountRule = $discountRuleMap[orderItem.discountRuleId];
			if (discountRule) {
				clearDiv.appendTo(orderItemPanel);
				var discountRuleLabel = $("<label>").addClass("infoLabel");
				discountRuleLabel.text($.i18n.prop('string_youHui')// "优惠:"
						+ discountRule.name);
				discountRuleLabel.appendTo(orderItemPanel);
			}
		}

		$("<div>").css("clear", "both").appendTo(orderItemPanel);
		orderItemPanel.appendTo(orderItemDiv);
		$("<div>").css("clear", "both").appendTo(orderItemDiv);

		orderItemDiv.click(function() {
			select(index);
		});

		if (orderItem.id != 0) {
			orderItemDiv.css("color", "#666666");
			if (orderItem.state == ORDER_ITEM_STATE.CANCELLED) {
				orderItemDiv.css("background-color", "#EEEEEE");
				$("<div>").text("[" + $.i18n.prop('string_yiQuXiao') + "]")// ("[已取消]")
				.addClass("stateLabel").appendTo(dishNameDiv);
			} else if (orderItem.state == ORDER_ITEM_STATE.WAITING) {
				$("<div>").text("[待确认]").addClass("stateLabel").appendTo(
						dishNameDiv);
			} else {
				var stateText = "[" + $.i18n.prop('string_yiXiaDan');
				if (orderItem.suspended) {
					stateText += "," + $.i18n.prop('string_jiaoQi');
				}
				if (orderItem.noCooking) {
					stateText += "," + $.i18n.prop('string_mianZuo');
				}
				stateText += "]";
				$("<div>").text(stateText).addClass("stateLabel").appendTo(
						dishNameDiv);
			}
		}
		return orderItemDiv;
	}

	function orderItemCmdSuccess(index, dishOrder) {
		hideLoadingDialog();

		mergeClientOrderItems(dishOrder);
		updateDishOrderCache(dishOrder);

		$curDishOrder = dishOrder;
		if ($curCustomer) {
			$curDishOrder.userAccountId = $curCustomer.id;
		}
		render();
		select(index);

		if (orderItemChangedCallback) {
			orderItemChangedCallback();
		}
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

	function getCommonTagsPanel(index, orderItem, okCallback) {

		var commonTagsPanel = $("<div>").attr("id", "commonTagsPanel")
				.addClass("overthrow").addClass("dishTagPanel")
				.appendTo("body");
		$("<div>").text(orderItem.dishName + $.i18n.prop('string_caiPinZuoFa'))// "菜品做法")
		.addClass("caption").appendTo(commonTagsPanel);
		var contentDiv = $("<div>").addClass("orderItemCmdPanelContent")
				.appendTo(commonTagsPanel);

		var tagCmdDiv = $("<div>").attr("id", "commonTagsPanel_topPanel")
				.appendTo(contentDiv);

		$("<div>").addClass("button").text($.i18n.prop('string_shanChu'))// ("删除")
		.click(deleteButtonClick).appendTo(tagCmdDiv);
		function deleteButtonClick() {
			var dishTagDivs = $("div[name='dishTagDiv']");
			var hasSelectedDiv = false;

			for (var i = 0; i < dishTagDivs.length; i++) {
				var dishTagDiv = $(dishTagDivs[i]);
				var selected = dishTagDiv.data("selected");
				var dishTag = dishTagDiv.data("dishTag");
				if (selected) {
					dishTagDiv.removeAttr("style").data("selected", false)
							.data("checked", false);
					for ( var j in orderItem.tags) {
						var orderItemTag = orderItem.tags[j];
						if (orderItemTag.dishTagId == dishTag.id) {
							orderItem.tags.splice(j, 1);
							updateTagText();
							break;
						}
					}
					hasSelectedDiv = true;
					break;
				}
			}
			if (!hasSelectedDiv) {
				alert($.i81n.prop('string_qingXuanZeYiXiangZaiJinXingCaoZuo'));
				// ("请先选择一项再进行操作！");
			}
		}

		$("<div>").addClass("button").text($.i18n.prop('string_quanShan'))// ("全删")
		.css("margin-left", "0.6em").click(deleteAllButtonClick).appendTo(
				tagCmdDiv);
		function deleteAllButtonClick() {
			$("div[name='dishTagDiv']").removeAttr("style").data("selected",
					false).data("checked", false);
			orderItem.tags = [];
			orderItem.freeTags = [];
			updateTagText();
		}

		$("<div>").addClass("button").text($.i18n.prop('string_shouXie'))// ("手写")
		.css("margin-left", "0.6em").click(editFreeTagButtonClick).appendTo(
				tagCmdDiv);
		function editFreeTagButtonClick() {
			var dialogContent = getEditFreeTagPanel(orderItem, okCallback);
			var dialog = $(dialogContent).modal({
				level : 3
			});

			function okCallback() {
				updateTagText();
				dialog.close();
				contentDiv.hide();
				setTimeout(function() {
					contentDiv.show();
				}, 200);
			}
		}

		$("<div>").addClass("button").text($.i18n.prop('string_shuLiang'))// ("数量")
		.css("margin-left", "0.6em").click(amountButtonClick).appendTo(
				tagCmdDiv);
		function amountButtonClick() {
			var dishTagDivs = $("div[name='dishTagDiv']");
			var hasSelectedDiv = false;

			for (var i = 0; i < dishTagDivs.length; i++) {
				var selected = $(dishTagDivs[i]).data("selected");
				var dishTag = $(dishTagDivs[i]).data("dishTag");
				var curOrderItemTag;
				var curOrderItemTagAmount;
				for ( var j in orderItem.tags) {
					var orderItemTag = orderItem.tags[j];
					if (orderItemTag.dishTagId == dishTag.id) {
						curOrderItemTag = orderItemTag;
						curOrderItemTagAmount = orderItemTag.amount;
						break;
					}
				}

				if (selected) {
					showAmountDialog($.i18n.prop('string_shuLiang'),
							function okCallback(result) {
								curOrderItemTag.amount = result;
								updateTagText();
							}, curOrderItemTagAmount);

					hasSelectedDiv = true;
					break;
				}
			}
			if (!hasSelectedDiv) {
				alert($.i18n.prop('string_qingXuanZeYiXiangZaiJinXingCaoZuo'));
				// ("请先选择一项再进行操作！");
			}
		}

		var midDiv = $("<div>").attr("id", "commonTagsPanel_middlePanel")
				.appendTo(contentDiv);
		var midLeftDiv = $("<div>").attr("id",
				"commonTagsPanel_middlePanel_leftList").addClass("overthrow")
				.appendTo(midDiv);
		var midRightDiv = $("<div>").attr("id",
				"commonTagsPanel_middlePanel_rightList").addClass("overthrow")
				.appendTo(midDiv);

		var ul = $("<ul>");
		ul.appendTo(midLeftDiv);
		for ( var groupName in $commonDishTagsByGroupNameMap) {
			$("<li>").text(groupName).data("groupName", groupName).click(
					groupItemClick).appendTo(ul);
		}

		ul.children(":first").trigger("click");

		function groupItemClick() {
			midRightDiv.html("");

			$("li", ul).removeAttr("style");
			$(this).css("background-color", "#DDDDDD");
			var groupName = $(this).data("groupName");
			var dishTags = $commonDishTagsByGroupNameMap[groupName];

			for ( var i in dishTags) {
				var dishTag = dishTags[i];

				var backgroundColor = "";
				var checked = false;
				for ( var j in orderItem.tags) {
					var orderItemTag = orderItem.tags[j];
					if (orderItemTag.dishTagId == dishTag.id) {
						backgroundColor = "#DDDDDD";
						checked = true;
						break;
					}
				}
				var dishTagDiv = $("<div>").attr("name", "dishTagDiv")
						.addClass("dishTagItem").css("background-color",
								backgroundColor).data("orderItem", orderItem)
						.data("dishTag", dishTag).data("selected", false).data(
								"checked", checked).click(dishTagClick);
				dishTagDiv.appendTo(midRightDiv);

				$("<div>").text($.trim(dishTag.name)).css("height", "70%")
						.appendTo(dishTagDiv);
				$("<div>").text("￥" + dishTag.priceDelta).css("text-align",
						"right").css("height", "30%").appendTo(dishTagDiv);
			}
		}

		function dishTagClick() {

			var checked = $(this).data("checked");
			$("div[name='dishTagDiv']").css("border", "").data("selected",
					false);
			$(this).css("background-color", "#DDDDDD").css("border",
					"1px solid orange").data("selected", true).data("checked",
					true);

			var orderItem = $(this).data("orderItem");
			var dishTag = $(this).data("dishTag");

			if (!checked) {

				if (orderItem.tags == null) {
					orderItem.tags = [];
				}
				var orderItemTag = {};
				orderItemTag.orderItemId = orderItem.id;
				orderItemTag.dishTagId = dishTag.id;
				orderItemTag.departmentId = orderItem.departmentId;
				orderItemTag.name = $.trim(dishTag.name);
				orderItemTag.unit = $.trim(dishTag.unit);
				orderItemTag.priceDelta = dishTag.priceDelta;
				orderItemTag.amount = 1;
				orderItem.tags.push(orderItemTag);

				updateTagText();
			}

		}

		var tagTextDiv = $("<div>").attr("id", "commonTagsPanel_bottomPanel")
				.addClass("overthrow").appendTo(contentDiv);

		var bottomDiv = $("<div>").addClass("orderItemCmdPanelBottomDiv");
		bottomDiv.appendTo(commonTagsPanel);

		$("<a>").text($.i18n.prop('string_queDing'))// ("确定")
		.addClass("dishOrderCmdButton").click(function() {
			render();
			select(index);
			okCallback();
		}).appendTo(bottomDiv);

		updateTagText();
		return commonTagsPanel;

		function updateTagText() {
			var orderItemTagString = $.i18n.prop('string_zuoFa') + "："
					+ getOrderItemTagsText(orderItem);
			tagTextDiv.text(orderItemTagString);
		}
	}

	function getDiscountRulePanel(index, orderItem, okCallback) {

		var discountRulePanel = $("<div>").addClass("overthrow").addClass(
				"singleChoicePanel").appendTo("body");
		$("<div>").text(
				"[" + orderItem.dishName + "]"
						+ $.i18n.prop('string_caiPinYouHui')).addClass(
				"caption").appendTo(discountRulePanel);
		var contentDiv = $("<div>").addClass("orderItemCmdPanelContent")
				.addClass("overthrow").appendTo(discountRulePanel);

		var discountRules = $storeData.discountRules;
		for ( var i in discountRules) {
			var discountRule = discountRules[i];

			var backgroundColor = "";
			if (orderItem.discountRuleId == discountRule.id) {
				backgroundColor = "#6AA1D8";
			}

			var discountRuleItemDiv = $("<div>").attr("name",
					"discountRuleItemDiv").css("background-color",
					backgroundColor).data("discountRuleId", discountRule.id)
					.addClass("singleChoiceItem").text(discountRule.name)
					.click(discountRuleItemDivClick);
			discountRuleItemDiv.appendTo(contentDiv);
		}

		var discountRuleItemDiv = $("<div>")
				.attr("name", "discountRuleItemDiv").css("background-color",
						orderItem.discountRuleId ? "" : "#6AA1D8").data(
						"discountRuleId", null).addClass("singleChoiceItem")
				.text("(" + $.i18n.prop('string_wuYouHui') + ")").click(
						discountRuleItemDivClick);
		discountRuleItemDiv.appendTo(contentDiv);

		function discountRuleItemDivClick() {
			$("div[name='discountRuleItemDiv']").removeAttr("style");
			$(this).css("background-color", "#6AA1D8");
			orderItem.discountRuleId = $(this).data("discountRuleId");
		}

		var bottomDiv = $("<div>").addClass("orderItemCmdPanelBottomDiv");
		bottomDiv.appendTo(discountRulePanel);

		$("<a>").text($.i18n.prop('string_queDing')).addClass(
				"dishOrderCmdButton").click(
				function() {
					if (orderItem.state != ORDER_ITEM_STATE.WAITING) {
						var postData = {
							employeeId : $storeData.employee.id,
							dishOrderId : $curDishOrder.id,
							orderItemId : orderItem.id,
							discountRuleId : orderItem.discountRuleId
						};

						showLoadingDialog($.i18n
								.prop('string_zhengZaiYingYongYouHui'));
						$.ajax({
							type : 'POST',
							url : "../ordering/applyDiscountRule",
							data : postData,
							dataType : 'json',
							error : function(error) {
								hideLoadingDialog();
								showAlertDialog($.i18n.prop('string_cuoWu'),
										error.responseText);
							},
							success : function(dishOrder) {
								orderItemCmdSuccess(index, dishOrder);
							}
						});
					} else {
						render();
					}
					okCallback();
				}).appendTo(bottomDiv);
		return discountRulePanel;
	}

	function getCancelReasonPanel(index, orderItem, amount, okCallback,
			cancelCallback) {

		var cancelReasonPanel = $("<div>").addClass("overthrow").addClass(
				"singleChoicePanel").appendTo("body");
		$("<div>").text(
				"[" + orderItem.dishName + "]"
						+ $.i18n.prop('string_xiaoDanLiYou')).addClass(
				"caption").appendTo(cancelReasonPanel);
		var contentDiv = $("<div>").addClass("orderItemCmdPanelContent")
				.addClass("overthrow").appendTo(cancelReasonPanel);

		$("<div>").attr("name", "reasonItemDiv").addClass("singleChoiceItem")
				.text($.i18n.prop('string_caiPinGuQing')).data("id", 0).data(
						"selected", false).click(reasonItemDivClick).appendTo(
						contentDiv);
		var cancelReasons = $storeData.cancelReasons;
		for ( var i in cancelReasons) {
			var reason = cancelReasons[i];
			var reasonItemDiv = $("<div>").attr("name", "reasonItemDiv")
					.addClass("singleChoiceItem").text(reason.name).data("id",
							reason.id).data("selected", false).click(
							reasonItemDivClick);
			reasonItemDiv.appendTo(contentDiv);
		}

		function reasonItemDivClick() {
			var selected = !$(this).data("selected");
			$("div[name='reasonItemDiv']").removeAttr("style").data("selected",
					false);
			$(this).css("background-color", "#6AA1D8").data("selected",
					selected);
		}

		var bottomDiv = $("<div>").addClass("orderItemCmdPanelBottomDiv");
		bottomDiv.appendTo(cancelReasonPanel);

		$("<a>").text($.i18n.prop('string_queDing')).addClass("button").click(
				function() {
					var reasonItemDivs = $("div[name='reasonItemDiv']");
					var cancelReason = "";
					var dishSoldOut = false;
					for (var i = 0; i < reasonItemDivs.length; i++) {
						if (reasonItemDivs.eq(i).data("selected")) {
							cancelReason = reasonItemDivs.eq(i).text();
							dishSoldOut = reasonItemDivs.eq(i).data("id") == 0;
							break;
						}
					}

					showLoadingDialog($.i18n
							.prop('string_zhengZaiChuLiNinDeQingQiu'));
					var postData = {
						employeeId : $storeData.employee.id,
						dishOrderId : $curDishOrder.id,
						orderItemId : orderItem.id,
						amount : amount,
						cancelReason : cancelReason,
						dishSoldOut : dishSoldOut
					};
					$.ajax({
						type : 'POST',
						url : "../ordering/cancelOrderItem",
						data : postData,
						dataType : 'json',
						error : function(error) {
							hideLoadingDialog();
							if (error.status == 403) {
								showAlertDialog($.i18n.prop('string_cuoWu'),
										"权限不足,无法进行操作!");
								return;
							}
							showAlertDialog($.i18n.prop('string_cuoWu'),
									error.responseText);
						},
						success : function(dishOrder) {
							orderItemCmdSuccess(index, dishOrder);
						}
					});
					okCallback();
				}).appendTo(bottomDiv);
		$("<a>").text($.i18n.prop('string_quXiao')).css("margin-left", "1em")
				.addClass("button").click(function() {
					cancelCallback();
				}).appendTo(bottomDiv);
		return cancelReasonPanel;
	}

	function getMoveOrderItemPanel(index, orderItem, okCallback, cancelCallback) {
		var moveOrderItemPanel = $('<div>').addClass("pickDeskDialog")
				.appendTo('body');
		$("<div>").text($.i18n.prop('string_qingXuanZeYaoZhuanDeZhuoHao'))
				.addClass("caption").appendTo(moveOrderItemPanel);
		var deskGroupSelector = $("<div>").addClass("deskGroupSelector")
				.appendTo(moveOrderItemPanel);
		var deskSelector = $("<div>").addClass("overthrow deskSelector")
				.appendTo(moveOrderItemPanel);
		var bottomDiv = $("<div>").addClass("pickDeskDialogBottom").appendTo(
				moveOrderItemPanel);
		var actionInfoDiv = $('<div>').text(deskView_SelectedDesk.name)
				.appendTo(bottomDiv);

		var targetDesk;
		var moveDishOrderOKButton = $('<div>').addClass("dishOrderCmdButton")
				.text($.i18n.prop('string_zhuanCai')).click(
						moveOrderItemOKButtonClick).appendTo(bottomDiv);
		function moveOrderItemOKButtonClick() {
			if (targetDesk == null) {
				showAlertDialog($.i18n.prop('string_tiShi'), $.i18n
						.prop('string_qingXuanZeYaoZhuanDanDeZhuoZi'));
				return;
			}

			var targetDishOrderId = $dishOrderBriefByDeskIdMap[targetDesk.id].dishOrderId;

			showLoadingDialog($.i18n.prop('string_zhengZaiZhuanDan'));
			$.ajax({
				type : 'POST',
				url : '../ordering/moveOrderItem',
				data : {
					employeeId : $storeData.employee.id,
					dishOrderId : $curDishOrder.id,
					orderItemId : orderItem.id,
					targetDishOrderId : targetDishOrderId
				},
				dataType : 'json',
				async : false,
				error : function(error) {
					hideLoadingDialog();
					showAlertDialog($.i18n.prop('cuoWu'), error.responseText);
				},
				success : function(dishOrder) {
					cronJob();
					orderItemCmdSuccess(index, dishOrder);
				}
			});

			okCallback();
		}

		$('<div>').addClass("dishOrderCmdButton").click(cancelCallback).text(
				$.i18n.prop('string_quXiao')).appendTo(bottomDiv);

		var desk = $deskMap[$curDishOrder.deskId];
		moveOrderItemPanel.deskPicker = new DeskPicker(deskGroupSelector,
				deskSelector, deskViewDialog_DeskSelectedCallback,
				DeskPicker.filter.occupiedDeskOnly, [ desk ]);

		function deskViewDialog_DeskSelectedCallback(selectedDesk) {
			targetDesk = selectedDesk;
			if (targetDesk != null) {
				actionInfoDiv.text(desk.name + $.i18n.prop('string_zhuanDao')
						+ targetDesk.name);
			} else {
				actionInfoDiv.text(desk.name);
			}
		}

		return moveOrderItemPanel;
	}
}

function getEditOrderItemPanel(orderItem, okCallback) {

	var editOrderItemPanel = $("<div>").addClass("editItemPanel").appendTo(
			"body");
	$("<div>").text($.i18n.prop('string_shouXieCai')).addClass("caption")
			.appendTo(editOrderItemPanel);

	var contentTable = $("<table>").appendTo(editOrderItemPanel);
	var tr = $('<tr>').appendTo(contentTable);
	var td = $('<td>').text($.i18n.prop('string_caiMing')).appendTo(tr);
	td = $('<td>').appendTo(tr);
	var dishNameInput = $("<input>").attr("type", "text").addClass(
			"dishNameInput").val(orderItem.dishName).appendTo(td);
	$("<div>").text("×").addClass("clearTextButton").click(function() {
		$(dishNameInput).val("");
	}).appendTo(td);

	tr = $('<tr>').appendTo(contentTable);
	td = $('<td>').text('部门').appendTo(tr);
	td = $('<td>').appendTo(tr);
	var departmentSelect = $("<select>").appendTo(td);
	for ( var i in $storeData.departments) {
		department = $storeData.departments[i];
		$("<option>").val(department.id).text(department.name).appendTo(
				departmentSelect);
	}
	departmentSelect.val(orderItem.departmentId);

	tr = $('<tr>').appendTo(contentTable);
	td = $('<td>').text($.i18n.prop('string_jiaGe')).appendTo(tr);
	td = $('<td>').appendTo(tr);
	priceStr = "时价";
	var dish = $dishMap[orderItem.dishId];
	if (dish) {
		if (dish.price != orderItem.price) {
			priceStr = orderItem.price;
		}
	}
	var priceInput = $("<div>").addClass("amountInput").text(priceStr)
			.appendTo(td);
	priceInput.click(function() {
		showAmountDialog($.i18n.prop('string_jiaGe'), function okCallback(
				result) {
			priceInput.text(result);
		}, priceInput.text());
	});

	tr = $('<tr>').appendTo(contentTable);
	td = $('<td>').text($.i18n.prop('string_shuliang')).appendTo(tr);
	td = $('<td>').appendTo(tr);
	var amountInput = $("<div>").addClass("amountInput").text(orderItem.amount)
			.appendTo(td);
	amountInput.click(function() {
		showAmountDialog($.i18n.prop('string_shuliang'), function okCallback(
				result) {
			amountInput.text(result);
		}, amountInput.text());
	});

	tr = $('<tr>').appendTo(contentTable);
	td = $('<td>').text("单位").appendTo(tr);
	td = $('<td>').appendTo(tr);
	var dishUnitInput = $("<input>").attr("type", "text").addClass(
			"dishNameInput").val(orderItem.unit).appendTo(td);

	var bottomDiv = $("<div>").addClass("orderItemCmdPanelBottomDiv");
	bottomDiv.appendTo(editOrderItemPanel);

	$("<div>").text($.i18n.prop('string_queDing')).addClass(
			"dishOrderCmdButton").click(function() {
		var name = $(dishNameInput).val();
		var price = parseFloat($(priceInput).text());
		var amount = parseFloat($(amountInput).text());
		var unit = $(dishUnitInput).val();
		var departmentId = Number(departmentSelect.val());
		if (name != "" && !isNaN(amount) && unit != "") {
			if (!isNaN(price)) {
				orderItem.dishPrice = price;
			}
			orderItem.dishName = name;
			orderItem.departmentId = departmentId;
			orderItem.amount = amount;
			orderItem.unit = unit;
			orderItem.orgUnit = unit;
			okCallback();
		} else {
			alert($.i18n.prop('string_qingZhengQueTianXieCaiMingHeJiaGe'));
		}
	}).appendTo(bottomDiv);
	$("<a>").addClass("dishOrderCmdButton").css("margin-left", "1em").text(
			$.i18n.prop('string_quXiao')).click(function() {
		okCallback();
	}).appendTo(bottomDiv);
	return editOrderItemPanel;
}

function getOptionsPanel(orderItem, okCallback, cancelCallback) {

	var optionsPanel = $("<div>").addClass("overthrow")
			.addClass("dishTagPanel").appendTo("body");
	$("<div>").text(orderItem.dishName + $.i18n.prop('string_caiPinXuanXiang'))
			.addClass("caption").appendTo(optionsPanel);
	var contentDiv = $("<div>").addClass("orderItemCmdPanelContent").addClass(
			"overthrow").appendTo(optionsPanel);

	var dish = $dishMap[orderItem.dishId];
	var dishOptionSets = dish.dishOptionSets;
	var dishTagGroups = dish.dishTagGroups;
	var orderItemTags = orderItem.options;

	for ( var i in dishOptionSets) {
		var dishTags = dishOptionSets[i].dishTags;

		var groupName = dishOptionSets[i].name;
		groupName = groupName ? groupName : "";
		if (i != 0) {
			$("<div>").css("border-top", "1px dashed #6AA1D8").text(
					groupName + "(" + dishTags.length
							+ $.i18n.prop('string_xuan') + "1)").appendTo(
					contentDiv);
		} else {
			$("<div>").text(
					groupName + "(" + dishTags.length
							+ $.i18n.prop('string_xuan') + "1)").appendTo(
					contentDiv);
		}

		var dishOptionSetDiv = $("<div>").attr("name", "dishOptionSetDiv")
				.appendTo(contentDiv);
		for ( var j in dishTags) {
			var dishTag = dishTags[j];

			var selected = false;
			var backgroundColor = "";
			for ( var k in orderItemTags) {
				if (orderItemTags[k].dishTagId == dishTag.id) {
					selected = true;
					backgroundColor = "#6AA1D8";
					break;
				}
			}

			$("<div>").attr("name", "dishTagDiv").text(
					$.trim(dishTag.name) + " ￥" + dishTag.priceDelta).data(
					"selected", selected).data("dishTag", dishTag).addClass(
					"dishTagDiv").css("background-color", backgroundColor)
					.click(dishOptionSetItemDivClick)
					.appendTo(dishOptionSetDiv);

			function dishOptionSetItemDivClick() {
				var selected = !$(this).data("selected");
				$(this).parent().children().data("selected", false).css(
						"background-color", "");
				$(this).data("selected", selected).css("background-color",
						selected ? "#6AA1D8" : "");
			}
		}
	}

	for ( var i in dishTagGroups) {
		var dishTags = dishTagGroups[i].dishTags;

		var groupName = dishTagGroups[i].groupName;
		groupName = groupName ? groupName : "";
		if (i != 0 || dishOptionSets.length > 0) {
			$("<div>").css("border-top", "1px dashed #6AA1D8").text(
					groupName + "(" + $.i18n.prop('string_renXuan') + ")")
					.appendTo(contentDiv);
		} else {
			$("<div>").text(
					groupName + "(" + $.i18n.prop('string_renXuan') + ")")
					.appendTo(contentDiv);
		}

		var dishTagGroupDiv = $("<div>").appendTo(contentDiv);

		for ( var j in dishTags) {
			var dishTag = dishTags[j];

			var selected = false;
			var backgroundColor = "";
			for ( var k in orderItemTags) {
				if (orderItemTags[k].dishTagId == dishTag.id) {
					selected = true;
					backgroundColor = "#6AA1D8";
					break;
				}
			}

			$("<div>").attr("name", "dishTagDiv").text(
					$.trim(dishTag.name) + " ￥" + dishTag.priceDelta).data(
					"selected", selected).data("dishTag", dishTag).addClass(
					"dishTagDiv").css("background-color", backgroundColor)
					.click(dishTagGroupItemDivClick).appendTo(dishTagGroupDiv);

			function dishTagGroupItemDivClick() {
				var selected = !$(this).data("selected");
				$(this).css("background-color", selected ? "#6AA1D8" : "")
						.data("selected", selected);
			}
		}
	}

	var tagTextDiv = $("<div>").attr("id", "commonTagsPanel_bottomPanel")
			.addClass("overthrow").appendTo(contentDiv);

	updateOptionsDiv();

	var bottomDiv = $("<div>").addClass("orderItemCmdPanelBottomDiv");
	bottomDiv.appendTo(optionsPanel);

	$("<a>").text($.i18n.prop('string_queDing')).addClass("dishOrderCmdButton")
			.click(function() {
				if (!checkIsSelected()) {
					showAlertDialog("错误", "必须选择必选做法!");
					return;
				}
				updateOptions(orderItem, contentDiv);
				if (okCallback)
					okCallback();
			}).appendTo(bottomDiv);

	$("<a>").text($.i18n.prop('string_shouXie')).addClass("dishOrderCmdButton")
			.click(function() {
				var dialogContent = getEditFreeTagPanel(orderItem, okCallback);
				var dialog = $(dialogContent).modal({
					level : 3,
				});
				function okCallback() {
					updateOptionsDiv();
					dialog.close();
				}
			}).appendTo(bottomDiv);

	$("<a>").text("取消").addClass("dishOrderCmdButton").click(function() {
		if (cancelCallback)
			cancelCallback();
	}).appendTo(bottomDiv);

	return optionsPanel;

	function updateOptions(orderItem, contentDiv) {

		var dishTagDivs = $("[name='dishTagDiv']", contentDiv);

		orderItem.options = [];

		for (var i = 0; i < dishTagDivs.length; i++) {
			var dishTag = $(dishTagDivs[i]).data("dishTag");
			var selected = $(dishTagDivs[i]).data("selected");

			if (!selected) {
				continue;
			}

			var orderItemTag = {};
			orderItemTag.orderItemId = orderItem.id;
			orderItemTag.dishId = orderItem.dishId;
			orderItemTag.dishTagId = dishTag.id;
			orderItemTag.departmentId = orderItem.departmentId;
			orderItemTag.name = $.trim(dishTag.name);
			orderItemTag.unit = $.trim(dishTag.unit);
			orderItemTag.priceDelta = dishTag.priceDelta;
			orderItemTag.amount = 1;
			orderItem.options.push(orderItemTag);
		}
	}

	function checkIsSelected() {

		var dishOptionSetDiv = $("[name='dishOptionSetDiv']", contentDiv);

		for (var i = 0; i < dishOptionSetDiv.length; i++) {
			var isSelected = false;
			var dishTagDivs = $("[name='dishTagDiv']", dishOptionSetDiv[i]);
			for (var j = 0; j < dishTagDivs.length; j++) {
				var selected = $(dishTagDivs[j]).data("selected");
				if (selected) {
					isSelected = true;
				}
			}
			if (!isSelected) {
				return false;
			}
		}

		return true;
	}

	function updateOptionsDiv() {
		var orderItemTagString = $.i18n.prop('string_xuanXiang') + "："
				+ getOrderItemTagsText(orderItem);
		if (getOrderItemTagsText(orderItem) != '')
			tagTextDiv.text(orderItemTagString);
	}
}

function getMealDealItemGoup(orderItem, okCallBack) {

	var mealDealItemsPanel = $("<div>").addClass("overthrow").addClass(
			"dishTagPanel").appendTo("body");
	$("<div>").text(orderItem.dishName + $.i18n.prop('string_caiPinXuanXiang'))
			.addClass("caption").appendTo(mealDealItemsPanel);

	var contentDiv = $("<div>").addClass("orderItemCmdPanelContent").addClass(
			"overthrow").appendTo(mealDealItemsPanel);

	var mealDealItem = null;
	var mealDealItemsByGroupName = [];
	var targertDishId = 0;

	for ( var i in $curDishOrder.orderItems) {
		var oi = $curDishOrder.orderItems[i];
		if (oi.clientTriggerId == orderItem.triggerId
				|| oi.id == orderItem.triggerId) {
			targertDishId = oi.dishId;
			break;
		}
	}
	var mealDealItems = $mealDealItemsByTargetDishIdMap[targertDishId];
	var groupName = $mealDealItemMap[orderItem.mealDealItemId].groupName;
	for ( var i in mealDealItems) {
		var item = mealDealItems[i];
		if (groupName == item.groupName) {
			mealDealItemsByGroupName.push(item);
		}
	}

	if (i != 0) {
		$("<div>").css("border-top", "1px dashed #6AA1D8").text(
				name + "(" + $.i18n.prop('string_xuan') + "1)").appendTo(
				contentDiv);
	} else {
		$("<div>").text(name + "(" + $.i18n.prop('string_xuan') + "1)")
				.appendTo(contentDiv);
	}

	var mealDealItemDiv = $("<div>").appendTo(contentDiv);
	for ( var j in mealDealItemsByGroupName) {
		var mdi = mealDealItemsByGroupName[j];
		var selected = false;
		var backgroundColor = "";
		if (orderItem.mealDealItemId != null && orderItem.triggerId != null
				&& orderItem.mealDealItemId == mdi.id) {
			selected = true;
			backgroundColor = "#6AA1D8";

		}

		$("<div>").attr("name", "mealDealItemDiv").text(
				$.trim(mdi.sourceDish.name) + " ￥" + mdi.priceDelta).data(
				"selected", selected).data("mealDealItem", mdi).addClass(
				"dishTagDiv").css("background-color", backgroundColor).click(
				setMealDealItemDivClick).appendTo(mealDealItemDiv);

		function setMealDealItemDivClick() {
			var selected = !$(this).data("selected");
			mealDealItem = $(this).data("mealDealItem");
			$(this).parent().children().data("selected", false).css(
					"background-color", "");
			$(this).data("selected", selected).css("background-color",
					selected ? "#6AA1D8" : "");
		}
	}

	var bottomDiv = $("<div>").addClass("orderItemCmdPanelBottomDiv");
	bottomDiv.appendTo(mealDealItemsPanel);

	$("<a>").text($.i18n.prop('string_queDing')).addClass("dishOrderCmdButton")
			.click(function() {
				if (okCallBack) {
					okCallBack(mealDealItem);
				}
			}).appendTo(bottomDiv);

	return mealDealItemsPanel;
}

function getEditFreeTagPanel(orderItem, okCallback) {

	var editFreeTagPanel = $("<div>").addClass("editItemPanel")
			.appendTo("body");

	$("<div>").text($.i18n.prop('string_shouXieZuoFa')).addClass("caption")
			.appendTo(editFreeTagPanel);

	var contentTable = $("<table>").appendTo(editFreeTagPanel);
	var tr = $('<tr>').appendTo(contentTable);
	var td = $('<td>').text($.i18n.prop('string_zuoFa')).appendTo(tr);
	td = $('<td>').appendTo(tr);
	var tagNameInput = $("<input>").attr("type", "text").addClass(
			"dishNameInput").appendTo(td);
	$("<div>").text("×").addClass("clearTextButton").click(function() {
		$(tagNameInput).val("");
	}).appendTo(td);

	tr = $('<tr>').appendTo(contentTable);
	td = $('<td>').text($.i18n.prop('string_jiaGe')).appendTo(tr);
	td = $('<td>').appendTo(tr);
	var priceInput = $("<div>").addClass("amountInput").text("0").appendTo(td);
	priceInput.click(function() {
		showAmountDialog($.i18n.prop('string_jiaGe'), function okCallback(
				result) {
			priceInput.text(result);
		}, priceInput.text());
	});

	if (orderItem.freeTags != null && orderItem.freeTags.length > 0) {
		var orderItemTag = orderItem.freeTags[0];
		tagNameInput.val(orderItemTag.name);
		priceInput.text(orderItemTag.priceDelta);
	}

	var bottomDiv = $("<div>").addClass("orderItemCmdPanelBottomDiv");
	bottomDiv.appendTo(editFreeTagPanel);

	$("<div>").text($.i18n.prop('string_queDing')).addClass(
			"dishOrderCmdButton").click(function() {
		var name = $(tagNameInput).val();
		var priceDelta = parseFloat($(priceInput).text());
		if (name != "" && !isNaN(priceDelta)) {
			if (orderItem.freeTags == null || orderItem.freeTags.length == 0) {
				orderItem.freeTags = [];
				var orderItemTag = {};
				orderItemTag.orderItemId = orderItem.id;
				orderItemTag.dishTagId = null;
				orderItemTag.departmentId = orderItem.departmentId;
				orderItemTag.name = name;
				orderItemTag.unit = $.i18n.prop('string_fen');// "份"
				orderItemTag.priceDelta = priceDelta;
				orderItemTag.amount = 1;
				orderItem.freeTags.push(orderItemTag);
			} else {
				var orderItemTag = orderItem.freeTags[0];
				orderItemTag.name = name;
				orderItemTag.priceDelta = priceDelta;
			}
			okCallback();
		} else {
			alert($.i18n.prop('string_qingZhengQueTianXieZuoFaheJiaGe'));
		}
	}).appendTo(bottomDiv);

	if (orderItem.freeTags != null) {
		$("<a>").addClass("dishOrderCmdButton").css("margin-left", "1em").text(
				$.i18n.prop('string_shanChu')).click(function() {
			orderItem.freeTags = [];
			okCallback();
		}).appendTo(bottomDiv);
	} else
		$("<a>").addClass("dishOrderCmdButton").css("margin-left", "1em").text(
				$.i18n.prop('string_quXiao')).click(function() {
			okCallback();
		}).appendTo(bottomDiv);

	return editFreeTagPanel;
}

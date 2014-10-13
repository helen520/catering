var dishView_OrderItemList;
var dishPicker;

function initDishView() {

	$("#cancelDishOrderButton", "#dishView").click(cancelDishOrderButtonClick);
	$("#submitDishOrderButton", "#dishView").click(submitDishOrderButtonClick);

	$("#dishOrderTagsButton").click(function() {
		var dialogContent = getCommonTagsPanel($curDishOrder, okCallback);
		var dialog = $(dialogContent).modal({
			level : 2
		});

		function okCallback() {
			dialog.close();
		}
	});
	$("#showSearchKeyboardButton").click(function() {
		if (searchInputDailog) {
			searchInputDailog.toggle();
		} else {
			$("[name='dishFilterTextInput']", "#dishView").val("");
			showSearchInputDailog(searchDish, true);
		}
	});
}

function showDishView() {
	var cmdButtonContainer = $("#dishOrderItemCmdPanel", "#dishView");
	var listContainer = $("#dishOrderItemList", "#dishView");

	dishView_OrderItemList = new OrderItemList(null, cmdButtonContainer,
			listContainer, updateDishOrderInfo);

	$("#dishView").show();

	if (dishPicker == null) {
		dishPicker = new DishPicker($('#dishViewLeft'),
				dishView_DishSelectedCallback);
	} else {
		// if (searchInputDailog) {
		// searchInputDailog.toggle();
		// } //else
		// showSearchInputDailog($("#dishFilterTextInput"), searchDish, true)
		// .addClass("dishPickerBoxTopRight");
		dishPicker.refreshUI();
	}
	updateDishOrderInfo();

	function keyDown(e) {
		var keycode = event.keyCode;

		if (keycode == 13 && dishPicker) {
			var dishes = dishPicker.filteredDishes();
			if (dishes.length != 1) {
				alert("当前搜索菜品数量不为1,无法下单,请精确到1个菜!");
				return;
			}
			dishView_DishSelectedCallback(dishes[0]);
			dishPicker.clearSearchTextAndSetDefaultDishes();
		}
	}
	document.onkeydown = keyDown;
}

function cancelDishOrderButtonClick() {

	hideSearchInputDailog();
	if (dishPicker) {
		dishPicker.clearSearchTextAndSetDefaultDishes();
	}
	document.onkeydown = null;
	showConfirmDialog("警告", "确定取消点菜？", function() {
		showLoadingDialog($.i18n.prop('string_dingDanQuXiaoZhong'));
		if (!$curDishOrder || $curDishOrder == null) {
			switchToView("DESK_VIEW");
			hideLoadingDialog();
			return;
		}

		if (isSearchBookingDishOrder || isShowSelfDishOrder) {
			restoreBookingDishOrder();
			return;
		}

		if ($curDishOrder.state == DISH_ORDER_STATE.CREATING) {
			$.ajax({
				type : 'POST',
				url : "../ordering/cancelDishOrder",
				data : {
					employeeId : $storeData.employee.id,
					dishOrderId : $curDishOrder.id
				},
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
					updateDishOrderCache(dishOrder);
					switchToView("DESK_VIEW");
					hideLoadingDialog();
				}
			});
		} else {
			if ($curDishOrder.orderItems) {
				var oiList = [];
				for ( var i in $curDishOrder.orderItems) {
					if ($curDishOrder.orderItems[i].id != 0) {
						oiList.push($curDishOrder.orderItems[i]);
					}
				}
				$curDishOrder.orderItems = oiList;
			}
			updateDishOrderPrice($curDishOrder);
			switchToView("DESK_VIEW");
			hideLoadingDialog();
		}
	});
}

function submitDishOrderButtonClick() {

	hideSearchInputDailog();

	if (dishPicker) {
		dishPicker.clearSearchTextAndSetDefaultDishes();
	}
	document.onkeydown = null;

	if (isSearchBookingDishOrder || isShowSelfDishOrder) {
		$("#cancelDishOrderButton", "#dishView").text(
				$.i18n.prop('string_quXiao'));
		if (isShowSelfDishOrder) {
			updateDynamicData();
		}
		isSearchBookingDishOrder = false;
		isShowSelfDishOrder = false;
	}

	var dishOrderToSubmit = $.extend(true, {}, $curDishOrder);

	dishOrderToSubmit.orderItems = [];
	for ( var i in $curDishOrder.orderItems) {
		var orderItem = $.extend(true, {}, $curDishOrder.orderItems[i]);
		if (orderItem.state != ORDER_ITEM_STATE.WAITING) {
			continue;
		}

		dishOrderToSubmit.orderItems.push(orderItem);
		orderItem.orderItemTags = [];
		for ( var j in orderItem.options) {
			var orderItemTag = orderItem.options[j];
			orderItem.orderItemTags.push(orderItemTag);
		}
		for ( var j in orderItem.tags) {
			var orderItemTag = orderItem.tags[j];
			orderItem.orderItemTags.push(orderItemTag);
		}
		for ( var j in orderItem.freeTags) {
			var orderItemTag = orderItem.freeTags[j];
			orderItem.orderItemTags.push(orderItemTag);
		}
	}

	if ($curDishOrder.orderItems.length == 0) {
		showAlertDialog("错误", "空订单无法下单!");
		return;
	}

	// if (dishOrderToSubmit.orderItems.length > 0) {
	if ($storeData.store.autoPrintCustomerNote) {
		checkingCustomerNotePrinters(submitDishOrder, dishOrderToSubmit);
	} else
		submitDishOrder(null, dishOrderToSubmit);
	// } else {
	// switchToView("DESK_VIEW");
	// }
}

function submitDishOrder(printerId, dishOrderToSubmit) {
	showLoadingDialog($.i18n.prop('string_tiJiaoZhong'));

	var postData = {
		employeeId : $storeData.employee.id,
		printerId : printerId,
		dishOrderJsonText : JSON.stringify(dishOrderToSubmit)
	};
	$.ajax({
		type : 'POST',
		// 'contentType' : 'application/json',
		url : "../ordering/submitDishOrder",
		data : postData,
		dataType : 'json',
		error : function(error) {
			hideLoadingDialog();
			showAlertDialog($.i18n.prop('string_cuoWu'), error.responseText);
		},
		success : function(dishOrder) {
			updateDishOrderCache(dishOrder);
			switchToView("DESK_VIEW");
			hideLoadingDialog();
		}
	});
}

function dishView_DishSelectedCallback(selectedDish, dishName) {

	if (!$curDishOrder.orderItems) {
		$curDishOrder.orderItems = [];
	}

	var orderItem = newOrderItemFromDish(selectedDish);
	if (dishName) {
		orderItem.dishName = dishName;
	}
	$curDishOrder.orderItems.push(orderItem);

	if (selectedDish.hasMealDealItems) {
		autoOrderingMealDealItems(selectedDish, orderItem);
	}

	if (orderItem.editable) {
		var editOrderItemContent = getEditOrderItemPanel(orderItem,
				editOrderItemOkCallback);
		var editOrderItemdialog = $(editOrderItemContent).modal({
			level : 3
		});

		function editOrderItemOkCallback() {
			dishView_OrderItemList.render();
			dishView_OrderItemList.select($curDishOrder.orderItems.length - 1);
			editOrderItemdialog.close();
			updateDishOrderInfo();
		}
	}

	if (selectedDish.needWeigh) {
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
					dishView_OrderItemList.render();
					dishView_OrderItemList
							.select($curDishOrder.orderItems.length - 1);
					updateDishOrderInfo();
				}, function() {
					oiIndex = $curDishOrder.orderItems.indexOf(orderItem);
					if (oiIndex > -1) {
						$curDishOrder.orderItems.splice(oiIndex, 1);
					}
					dishView_OrderItemList.render();
					updateDishOrderInfo();
				});
	}

	dishView_OrderItemList.render();
	dishView_OrderItemList.select($curDishOrder.orderItems.length);

	$("#dishOrderItemList", "#dishView").scrollTop(10000);

	var dishOptionSets = selectedDish.dishOptionSets;
	var dishTagGroups = selectedDish.dishTagGroups;
	if ((dishOptionSets != null && dishOptionSets.length > 0)
			|| (dishTagGroups != null && dishTagGroups.length > 0)) {
		var dishOptionSetContent = getOptionsPanel(orderItem,
				dishOptionSetOkCallback, dishOptionSetCancelCallback);
		var dishOptionSetModel = $(dishOptionSetContent).modal({
			level : 2
		});

		function dishOptionSetOkCallback() {
			dishView_OrderItemList.render();
			dishView_OrderItemList.select($curDishOrder.orderItems.length - 1);
			dishOptionSetModel.close();
			updateDishOrderInfo();
		}

		function dishOptionSetCancelCallback() {
			oiIndex = $curDishOrder.orderItems.indexOf(orderItem);
			if (oiIndex > -1) {
				$curDishOrder.orderItems.splice(oiIndex, 1);
			}
			dishView_OrderItemList.render();
			dishView_OrderItemList.select($curDishOrder.orderItems.length - 1);
			dishOptionSetModel.close();
			updateDishOrderInfo();
		}
	}
	updateDishOrderInfo();
}

function updateDishOrderInfo() {
	if ($curDishOrder != null) {
		$("#deskNameLabel", "#dishView").text($curDishOrder.deskName);
		$("#customerCountLabel", "#dishView").text($curDishOrder.customerCount);
		$("#totalPriceLabel", "#dishView").text(
				$curDishOrder.finalPrice.toFixed(1));
		// dishView_OrderItemList.render();
	}

	dishPicker.refreshUI();
}

function getCommonTagsPanel(dishOrder, okCallback) {

	var commonTagsPanel = $("<div>").attr("id", "commonTagsPanel").addClass(
			"overthrow").addClass("dishTagPanel").appendTo("body");
	var dishOrderId = $.trim(dishOrder.id);
	$("<div>").text(
			"["
					+ $.i18n.prop('string_danHao')
					+ "："
					+ dishOrderId.substring(dishOrderId.length - 4,
							dishOrderId.length) + "]"
					+ $.i18n.prop('string_zuoFa') + "").addClass("caption")
			.appendTo(commonTagsPanel);
	var contentDiv = $("<div>").addClass("orderItemCmdPanelContent").appendTo(
			commonTagsPanel);

	var tagCmdDiv = $("<div>").attr("id", "commonTagsPanel_topPanel").appendTo(
			contentDiv);

	$("<div>").addClass("button").text($.i18n.prop('string_shanChu')).click(
			deleteButtonClick).appendTo(tagCmdDiv);
	function deleteButtonClick() {
		var dishTagDivs = $("div[name='dishTagDiv']");
		var hasSelectedDiv = false;

		for (var i = 0; i < dishTagDivs.length; i++) {
			var dishTagDiv = $(dishTagDivs[i]);
			var selected = dishTagDiv.data("selected");
			var dishTag = dishTagDiv.data("dishTag");
			if (selected) {
				dishTagDiv.removeAttr("style").data("selected", false).data(
						"checked", false);
				for ( var j in dishOrder.tags) {
					var dishOrderTag = dishOrder.tags[j];
					if (dishOrderTag.dishTagId == dishTag.id) {
						dishOrder.tags.splice(j, 1);
						updateTagText();
						break;
					}
				}
				hasSelectedDiv = true;
				break;
			}
		}
		if (!hasSelectedDiv) {
			alert($.i18n.prop('string_qingXuanZeYiXiangZaiJinXingCaoZuo'));
		}
	}

	$("<div>").addClass("button").text($.i18n.prop('string_quanShan')).css(
			"margin-left", "0.6em").click(deleteAllButtonClick).appendTo(
			tagCmdDiv);
	function deleteAllButtonClick() {
		$("div[name='dishTagDiv']").removeAttr("style").data("selected", false)
				.data("checked", false);
		dishOrder.tags = null;
		dishOrder.freeTags = null;
		updateTagText();
	}

	$("<div>").addClass("button").text($.i18n.prop('string_shouXie')).css(
			"margin-left", "0.6em").click(editFreeTagButtonClick).appendTo(
			tagCmdDiv);
	function editFreeTagButtonClick() {
		var dialogContent = getEditDishOrderFreeTagPanel(dishOrder, okCallback);
		var dialog = $(dialogContent).modal({
			level : 3,
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

	$("<div>").addClass("button").text($.i18n.prop('string_shuLiang')).css(
			"margin-left", "0.6em").click(amountButtonClick)
			.appendTo(tagCmdDiv);
	function amountButtonClick() {
		var dishTagDivs = $("div[name='dishTagDiv']");
		var hasSelectedDiv = false;

		for (var i = 0; i < dishTagDivs.length; i++) {
			var selected = $(dishTagDivs[i]).data("selected");
			var dishTag = $(dishTagDivs[i]).data("dishTag");
			if (selected) {

				showAmountDialog($.i18n.prop('string_shuLiang'),
						function okCallback(result) {
							for ( var j in dishOrder.tags) {
								var dishOrderTag = dishOrder.tags[j];
								if (dishOrderTag.dishTagId == dishTag.id) {
									dishOrder.tags[j].amount = result;
									updateTagText();
									break;
								}
							}
						});

				hasSelectedDiv = true;
				break;
			}
		}
		if (!hasSelectedDiv) {
			alert($.i18n.prop('string_qingXuanZeYiXiangZaiJinXingCaoZuo'));
		}
	}

	var midDiv = $("<div>").attr("id", "commonTagsPanel_middlePanel").appendTo(
			contentDiv);
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
			for ( var j in dishOrder.tags) {
				var dishOrderTag = dishOrder.tags[j];
				if (dishOrderTag.dishTagId == dishTag.id) {
					backgroundColor = "#DDDDDD";
					checked = true;
					break;
				}
			}
			var dishTagDiv = $("<div>").attr("name", "dishTagDiv").addClass(
					"dishTagItem").css("background-color", backgroundColor)
					.data("dishOrder", dishOrder).data("dishTag", dishTag)
					.data("selected", false).data("checked", checked).click(
							dishTagClick);
			dishTagDiv.appendTo(midRightDiv);

			$("<div>").text($.trim(dishTag.name)).css("height", "70%")
					.appendTo(dishTagDiv);
			$("<div>").text("￥" + dishTag.priceDelta)
					.css("text-align", "right").css("height", "30%").appendTo(
							dishTagDiv);
		}
	}

	function dishTagClick() {

		var checked = $(this).data("checked");
		$("div[name='dishTagDiv']").css("border", "").data("selected", false);
		$(this).css("background-color", "#DDDDDD").css("border",
				"1px solid orange").data("selected", true)
				.data("checked", true);

		var dishOrder = $(this).data("dishOrder");
		var dishTag = $(this).data("dishTag");

		if (!checked) {

			if (dishOrder.tags == null) {
				dishOrder.tags = [];
			}
			var dishOrderTag = {};
			dishOrderTag.dishOrderId = dishOrder.id;
			dishOrderTag.dishTagId = dishTag.id;
			dishOrderTag.departmentId = dishOrder.departmentId;
			dishOrderTag.name = $.trim(dishTag.name);
			dishOrderTag.unit = $.trim(dishTag.unit);
			dishOrderTag.priceDelta = dishTag.priceDelta;
			dishOrderTag.amount = 1;
			dishOrder.tags.push(dishOrderTag);

			updateTagText();
		}

	}

	var tagTextDiv = $("<div>").attr("id", "commonTagsPanel_bottomPanel")
			.addClass("overthrow").appendTo(contentDiv);

	var bottomDiv = $("<div>").addClass("orderItemCmdPanelBottomDiv");
	bottomDiv.appendTo(commonTagsPanel);

	$("<a>").text($.i18n.prop('string_queDing')).addClass("dishOrderCmdButton")
			.click(function() {
				okCallback();
			}).appendTo(bottomDiv);

	updateTagText();
	return commonTagsPanel;

	function updateTagText() {
		var dishOrderTagString = $.i18n.prop('string_zuoFa') + "："
				+ getDishOrderTagsText(dishOrder);
		tagTextDiv.text(dishOrderTagString);
	}
}

function getEditDishOrderFreeTagPanel(dishOrder, okCallback) {

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

	if (dishOrder.freeTags.length > 0) {
		var dishOrderTag = dishOrder.freeTags[0];
		tagNameInput.val(dishOrderTag.name);
		priceInput.text(dishOrderTag.priceDelta);
	}

	var bottomDiv = $("<div>").addClass("orderItemCmdPanelBottomDiv");
	bottomDiv.appendTo(editFreeTagPanel);

	$("<div>").text($.i18n.prop('string_queDing')).addClass(
			"dishOrderCmdButton").click(function() {
		var name = $(tagNameInput).val();
		var priceDelta = parseFloat($(priceInput).text());
		if (name != "" && !isNaN(priceDelta)) {

			if (dishOrder.freeTags.length == 0) {
				dishOrder.freeTags = [];
				var dishOrderTag = {};
				dishOrderTag.dishOrderId = dishOrder.id;
				dishOrderTag.dishTagId = null;
				dishOrderTag.departmentId = dishOrder.departmentId;
				dishOrderTag.name = name;
				dishOrderTag.unit = $.i18n.prop('string_fen');
				dishOrderTag.priceDelta = priceDelta;
				dishOrderTag.amount = 1;
				dishOrder.freeTags.push(dishOrderTag);
			} else {
				var dishOrderTag = dishOrder.freeTags[0];
				dishOrderTag.name = name;
				dishOrderTag.priceDelta = priceDelta;
			}
			okCallback();
		} else {
			alert($.i18n.prop('string_qingZhengQueTianXieZuoFaHeJiaGe'));
		}
	}).appendTo(bottomDiv);
	if (dishOrder.freeTags.length > 0) {
		$("<a>").addClass("dishOrderCmdButton").css("margin-left", "1em").text(
				$.i18n.prop('string_shanChu')).click(function() {
			dishOrder.freeTags.splice(0, 1);
			// dishOrder.freeTags = null;
			okCallback();
		}).appendTo(bottomDiv);
	} else
		$("<a>").addClass("dishOrderCmdButton").css("margin-left", "1em").text(
				$.i18n.prop('string_quXiao')).click(function() {
			okCallback();
		}).appendTo(bottomDiv);
	return editFreeTagPanel;
}

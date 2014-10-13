function DishView(container, uiDataManager) {
	var self = this;
	var eventHandlers = {
		'onOrderSubmitted' : []
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

	var updateDishOrderInfo = function() {
		$("#deskNameLabel", container).text("");
		$("#customerCountLabel", container).text("");
		$("#totalPriceLabel", container).text("");

		var currentDishOrder = dishOrderManager.getCurrentDishOrder();

		if (currentDishOrder != null
				&& currentDishOrder.state != DISH_ORDER_STATE.CANCELLED) {
			$("#deskNameLabel", container).text(currentDishOrder.deskName);
			$("#customerCountLabel", container).text(
					currentDishOrder.customerCount);
			$("#totalPriceLabel", container).text(
					currentDishOrder.finalPrice.toFixed(1));
		}
	};

	var init = function() {
		dishOrderManager.attachEvent('onCurrentDishOrderChanged',
				updateDishOrderInfo);

		$("#cancelDishOrderButton", container)
				.click(cancelDishOrderButtonClick);
		$("#submitDishOrderButton", container)
				.click(submitDishOrderButtonClick);
		$("#dishOrderTagsButton", container).click(dishOrderTagsButtonClick);

		var cmdButtonContainer = $("#dishOrderItemCmdPanel", container);
		var listContainer = $("#dishOrderItemList", container);
		new OrderItemList(null, cmdButtonContainer, listContainer,
				updateDishOrderInfo);
		new DishPicker($('#dishViewLeft', container));

		function cancelDishOrderButtonClick() {
			showConfirmDialog("警告", "确定取消点菜？", confirmDialogOkCallback);

			function confirmDialogOkCallback() {
				showLoadingDialog($.i18n.prop('string_dingDanQuXiaoZhong'));
				if (!$curDishOrder || $curDishOrder == null) {
					switchToView("DISH_VIEW");
					hideLoadingDialog();
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
							$curDishOrder = null;
							switchToView("DISH_VIEW");
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
					switchToView("DISH_VIEW");
					hideLoadingDialog();
				}
			}
		}

		function submitDishOrderButtonClick() {
			dishOrderManager.submitOrder();
		}

		function dishOrderTagsButtonClick() {
			var dialogContent = getCommonTagsPanel($curDishOrder, okCallback);
			var dialog = $(dialogContent).modal({
				level : 2
			});

			function okCallback() {
				dialog.close();
			}
		}
	};

	this.show = function() {

		$(container).show();
		updateDishOrderInfo();
	};

	this.hide = function() {
		$(container).hide();
	};

	init();
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

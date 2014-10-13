function initDishOrderView() {

	$("#submitDishOrderButton", "#dishOrderView").click(
			submitDishOrderButtonClick);

	$("#returnToDishViewButton", "#dishOrderView").click(function() {
		switchToView("DISH_VIEW");
	});

	$("#dishOrderTagsButton").click(function() {
		var dialogContent = getCommonTagsPanel($curDishOrder, okCallback);
		var dialog = $(dialogContent).modal({
			level : 2
		});

		function okCallback() {
			dialog.close();
		}
	});
}

function showDishOrderView() {

	var cmdButtonContainer = $('#dishOrderViewTop');
	var listContainer = $("#dishOrderItemList", "#dishOrderView");

	new OrderItemList(null, cmdButtonContainer, listContainer,
			updateDishOrderInfo);

	$("#dishOrderView").show();
	updateDishOrderInfo();
}

function updateDishOrderInfo() {
	$("#dov_string_prePay_price").hide();
	if ($curDishOrder != null) {
		$("#deskNameLabel", "#dishOrderView").text($curDishOrder.deskName);
		$("#customerCountLabel", "#dishOrderView").text(
				$curDishOrder.customerCount);
		$("#totalPriceLabel", "#dishOrderView").text(
				$curDishOrder.finalPrice.toFixed(1));

		if ($curDishOrder.deskName) {
			$("#deskNoLabel").val($curDishOrder.deskName);
		}

		if ($curDishOrder.prePay != null && $curDishOrder.prePay > 0) {
			$("#dov_string_prePay_price").show();
			$("#prePayPriceLabel").text($curDishOrder.prePay);
		}
	}
}

function submitDishOrderButtonClick() {

	if ($bookRecord != null && $bookRecord.isServingArrived
			&& ($curDishOrder.prePay == null || $curDishOrder.prePay == 0)) {
		switchToView("CHECKOUT_VIEW");
		return;
	}

	submitDishOrder(false);
}

function submitDishOrder(isPrePay) {
	showLoadingDialog($.i18n.prop('string_tiJiaoZhong'));

	if ($("#deskNoLabel").val() != "") {
		$curDishOrder.deskName = $("#deskNoLabel").val();
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

	var postData = {
		openId : $openId,
		dishOrderJsonText : JSON.stringify(dishOrderToSubmit)
	};

	$.ajax({
		type : 'POST',
		// 'contentType' : 'application/json',
		url : "../demoWechat/submitDishOrder",
		data : postData,
		dataType : 'json',
		error : function(error) {
			hideLoadingDialog();
			showAlertDialog($.i18n.prop('string_cuoWu'), error.responseText);
		},
		success : function(dishOrder) {
			$curDishOrder = dishOrder;
			window.onbeforeunload = undefined;
			hideLoadingDialog();

			if (isPrePay) {
				var prePay = 0;
				if (dishOrder.prePay != null && dishOrder.prePay != "") {
					prePay = dishOrder.prePay;
				}
				$("#balance").text($member.balance - prePay);
				$("#areadyPrePay_note").show();
				$("#areadyPrePay").text(prePay);
				showAlertDialog("提交成功",
						"您的点餐需要服务员进一步确认，请到店后与服务员联系！返回请点击微信左上角\"< \"",
						function() {
							window.location.href = "";
						});
				return;
			}

			showAlertDialog("提交成功",
					"您的点餐需要服务员进一步确认，请与店内服务员联系！返回请点击微信左上角\"< \"", function() {
						window.location.href = "";
					});
			return;

			// showConfirmDialog("提交成功",
			// "您的点餐需要服务员进一步确认，请与店内服务员联系！返回请点击微信左上角\"< \"", function() {
			// switchToView("CHECKOUT_VIEW");
			// }, $storeId, function() {
			// window.location.href = "";
			// });
		}
	});
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
					+ $.i18n.prop('string_zuoFa')).addClass("caption")
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

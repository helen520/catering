function DishAmountDialog(title, orderItem, okCallback) {
	var dialogDiv = $('<div>');
	var modal = null;
	var uiDataManager = UIDataManager.getInstance();
	var unit = "";

	var closeModal = function() {
		if (modal) {
			modal.close();
		}
	};

	var init = function() {
		dialogDiv.addClass("amountDialog");
		var digitKb = $("<div>").appendTo(dialogDiv).digitKeyboard(title,
				false, orderItem.amount, orderItem.unit);
		var dishUnitDiv = $("<div>").addClass("dishUnitPanel").appendTo(
				dialogDiv);

		var dishUnit = uiDataManager.getDishUnitByName(orderItem.orgUnit);
		if (dishUnit && !orderItem.editable) {
			var duList = uiDataManager
					.getDishUnitsByGroupId(dishUnit.groupNumber);
			if (duList.length > 1)
				for ( var i in duList) {
					var du = duList[i];
					var duDiv = $("<div>").addClass("dishUnitSingleChoiceItem")
							.text(du.name).appendTo(dishUnitDiv).click(
									dishUnitSingleChoiceItemClick);
					if (du.name == orderItem.unit)
						duDiv.css("background-color", "#6AA1D8");
				}
		}
		function dishUnitSingleChoiceItemClick() {
			$(".dishUnitSingleChoiceItem").removeAttr("style");
			$(this).css("background-color", "#6AA1D8");
			unit = $(this).text();
			digitKb.setUnit(unit);
		}

		$("<div>").addClass("dialogButton").text($.i18n.prop('string_Confirm'))
				.appendTo(dialogDiv).click(function() {
					if (okCallback) {
						var amount = parseFloat(digitKb.getText());
						okCallback(amount, unit);
					}

					closeModal();
				});
		$("<div>").addClass("dialogButton").text($.i18n.prop('string_Cancel'))
				.appendTo(dialogDiv).click(closeModal);
	};

	this.show = function() {
		dialogDiv.appendTo('body');
		modal = $(dialogDiv).modal();
	};

	init();
}

function PickCustomerDialog(onCustomerSelectedCallBack) {

	var dialogDiv = $('<div>');
	var modal = null;

	var customerManager = CustomerManager.getInstance();

	var closeModal = function() {
		if (modal) {
			modal.close();
		}
	};

	var init = function() {
		dialogDiv.addClass("dishOrderListDialog");
		$('<div>').addClass("cancelDiv").text("×").appendTo(dialogDiv).click(
				closeModal);

		var titlePanel = $("<div>").addClass("topPanel ui-shadow").appendTo(
				dialogDiv);

		var customerListPanel = $("<div>").attr('id', 'customerListPanel')
				.addClass("overthrow dishOrderListPanel").appendTo(dialogDiv);
		var controlPanelDiv = $("<div>").addClass("controlPanel").appendTo(
				dialogDiv);
		$('<button>').addClass("operationButton").text(
				$.i18n.prop('string_Cancel')).click(closeModal).appendTo(
				controlPanelDiv);

		$('<label>').text(
				$.i18n.prop('string_InputCustomerMobileOrMembershipCardNo')
						+ ":").appendTo(titlePanel);
		var searchInputPanel = $('<div>').addClass("searchInputPanel").css(
				"display", "inline-block").appendTo(titlePanel);
		var searchInput = $('<input>').addClass(
				"ui-input ui-border-solid ui-shadow ui-radius searchInput")
				.appendTo(searchInputPanel);
		$('<button>').addClass("showDishOrderAllButton button right").text(
				$.i18n.prop('string_Search')).click(searchButtonClick)
				.appendTo(searchInputPanel);

		function searchButtonClick() {
			var keyword = searchInput.val();
			if (!isNaN(keyword) && Number(keyword) != 0) {
				customerListPanel.empty();
				customerManager.searchCustomer(keyword, function(customers) {
					renderCustomers(customers);
				});
			} else {
				alert($.i18n.prop('string_InputError'));
			}
		}

	};

	var renderCustomers = function(customers) {
		var customerListPanel = $('#customerListPanel', dialogDiv);
		for ( var i in customers) {
			var customer = customers[i];
			var customerDiv = $('<div>').addClass("dishOrder").appendTo(
					customerListPanel);
			var customerCaptionDiv = $('<div>').addClass("captionPanel")
					.appendTo(customerDiv);
			var customerOperationPanel = $('<div>').addClass(
					"dishOrderOperationPanel").appendTo(customerDiv);

			var customerCaptionHtml = $.i18n.prop('string_MembershipCardNo')
					+ ":" + $.trim(customer.membershipCardNo);
			customerCaptionHtml += $.i18n.prop('string_Name') + ":"
					+ customer.name;
			customerCaptionHtml += $.i18n.prop('string_Mobile') + ":"
					+ customer.mobile;
			customerCaptionDiv.html(customerCaptionHtml);

			$("<button>").data("customer", customer).addClass(
					"button chooseMember").text($.i18n.prop('string_Pick'))
					.appendTo(customerOperationPanel).click(
							pickCustomerButtonClick);

			function pickCustomerButtonClick() {
				customer = $(this).data("customer");
				if (customer != null && onCustomerSelectedCallBack) {
					onCustomerSelectedCallBack(customer);
				}
				modal.close();
			}
		}
	};

	this.show = function() {
		dialogDiv.appendTo('body');
		modal = $(dialogDiv).modal();
	};

	init();
}

function IssueCouponDialog(customerId) {
	var dialogDiv = $('<div>');
	var modal = null;

	var closeModal = function() {
		if (modal) {
			modal.close();
		}
	};

	var showCouponTemplates = function(container) {
		container.empty();
		var couponTemplates = UIDataManager.getInstance()
				.getCouponTemplateList();

		for ( var i in couponTemplates) {
			var couponTemplate = couponTemplates[i];
			var couponTemplateItemDiv = $('<div>').addClass(
					"couponTemplateItem");

			var couponTemplateItemTopDiv = $('<div>');
			$('<span>').text(
					couponTemplate.title + " 可抵扣:" + couponTemplate.value)
					.appendTo(couponTemplateItemTopDiv);

			var couponTemplateItemOperationDiv = $('<div>').addClass(
					"couponTemplateItemOperation");
			$('<div>').addClass("button")
					.data("couponTemplate", couponTemplate).text(
							$.i18n.prop('string_IssueCoupon')).click(
							issueCouponButtonClick).appendTo(
							couponTemplateItemOperationDiv);
			function issueCouponButtonClick() {
				var couponTemplate = $(this).data("couponTemplate");
				UnibizProxy.getInstance().issueCoupon(couponTemplate.id,
						customerId, function() {
							closeModal();
						});
			}

			couponTemplateItemOperationDiv.appendTo(couponTemplateItemTopDiv);

			$('<div>').css("clear", "both").appendTo(couponTemplateItemTopDiv);
			couponTemplateItemTopDiv.appendTo(couponTemplateItemDiv);
			$('<div>')
					.html($.i18n.prop('string_Details') + couponTemplate.text)
					.appendTo(couponTemplateItemDiv);

			couponTemplateItemDiv.appendTo(container);
		}
	};

	var init = function() {

		dialogDiv.addClass("singleChoicePanel");

		var contentDiv = $('<div>').addClass("orderItemCmdPanelContent")
				.addClass("overthrow").appendTo(dialogDiv);
		showCouponTemplates(contentDiv);

		var bottomDiv = $('<div>').addClass("orderItemCmdPanelBottomDiv");
		bottomDiv.appendTo(dialogDiv);
		$('<div>').text($.i18n.prop('string_Close')).addClass("button").click(
				closeModal).appendTo(bottomDiv);
	};

	this.show = function() {
		dialogDiv.appendTo('body');
		modal = $(dialogDiv).modal();
	};

	init();
}

function DepositCardDialog(payCallback, cardNo) {

	var dialogDiv = $('<div>');
	var modal = null;
	var depositCard = null;
	var dishOrder = DishOrderManager.getInstance().getCurrentDishOrder();

	var closeModal = function() {
		$(document).off('keypress.DepositCard');

		if (modal) {
			modal.close();
		}
	};

	var init = function() {
		dialogDiv.addClass("amountDialog");

		$('<div>').addClass("digitKeyboardCaption").text("储值卡").appendTo(
				dialogDiv);
		var containDiv = $('<div id="containDiv">').css("padding", "2em")
				.appendTo(dialogDiv);
		containDiv.text('请刷储值卡');

		$("<div>").addClass("dialogButton").text($.i18n.prop('string_Confirm'))
				.appendTo(dialogDiv).click(confirmButtonClick);
		function confirmButtonClick() {

			if (depositCard) {
				var totalBalance = depositCard.balance
						+ depositCard.bonus_balance;
				if (totalBalance >= dishOrder.remainToPay) {
					if (payCallback) {
						payCallback(depositCard);
					}
				}
			}

			closeModal();
		}

		$("<div>").addClass("dialogButton").text($.i18n.prop('string_Cancel'))
				.appendTo(dialogDiv).click(function() {
					closeModal();
				});

		var payload = getJsonRPCPayload();
		payload.params.number = cardNo;
		var ajaxReq = getDefaultAjax(payload,
				rpc_urls.search_deposit_card_by_number);

		$.ajax(ajaxReq).done(
				function(response) {
					depositCards = response.result;
					if (depositCards.length == 0) {
						$('#containDiv', dialogDiv).text('未找到该储值卡');
					}
					depositCard = depositCards[0];

					var html = '储值卡余额:' + depositCard.balance + '<br/>赠送余额：'
							+ depositCard.bonus_balance + '<br/>应支付：'
							+ dishOrder.remainToPay;
					var totalBalance = depositCard.balance
							+ depositCard.bonus_balance;
					if (totalBalance < dishOrder.remainToPay) {
						html += '<br/>余额不足。';
					}
					$('#containDiv', dialogDiv).html(html);
				}).fail(function() {
			$('#containDiv', dialogDiv).text('系统错误，请重试');
		});
	};

	this.show = function() {
		dialogDiv.appendTo('body');
		modal = $(dialogDiv).modal({
			level : 5
		});
	};

	init();
}

function EditOrderItemOptionsDialog(orderItem, okCallback) {
	var dialogDiv = $('<div>');
	var modal = null;
	var uiDataManager = UIDataManager.getInstance();
	var freeTag = null;

	var closeModal = function() {
		if (modal) {
			modal.close();
		}
	};

	var renderDishTagGroup = function(container, dishTagGroup, singleSelection) {
		var dishTags = dishTagGroup.dishTags;
		var groupName = dishTagGroup.name;
		groupName = groupName ? groupName : "";
		var orderItemTags = orderItem.options;

		$("<div>").css("border-top", "1px dashed #6AA1D8").appendTo(container);
		var headerText = groupName;
		if (singleSelection) {
			headerText += "(" + dishTags.length + $.i18n.prop('string_Choose')
					+ "1)";
		}
		$("<div>").text(headerText).appendTo(container);

		var dishTagGroupDiv = $("<div>").attr("name", "dishOptionSetDiv")
				.appendTo(container);
		for ( var i in dishTags) {
			var dishTag = dishTags[i];

			var selected = false;
			var backgroundColor = "";
			for ( var j in orderItemTags) {
				if (orderItemTags[j].dishTagId == dishTag.id) {
					selected = true;
					backgroundColor = "#6AA1D8";
					break;
				}
			}

			$("<div>").attr("name", "dishTagDiv").text(
					$.trim(dishTag.name) + " ￥" + dishTag.priceDelta).data(
					"selected", selected).data("dishTag", dishTag).addClass(
					"dishTagDiv").css("background-color", backgroundColor)
					.click(dishTagDivClick).appendTo(dishTagGroupDiv);
			function dishTagDivClick() {
				var selected = !$(this).data("selected");

				if (singleSelection) {
					$(this).parent().children().data("selected", false).css(
							"background-color", "");
				}
				$(this).data("selected", selected).css("background-color",
						selected ? "#6AA1D8" : "");
			}
		}
	};

	var updateOptionsDiv = function() {
		var tagsText = OrderItem.getTagsText(orderItem);
		if (tagsText != '') {
			$('#commonTagsPanel_bottomPanel', dialogDiv).text(
					$.i18n.prop('string_Options') + ":" + tagsText);
		}
	};

	var init = function() {
		freeTag = orderItem.freeTag;

		dialogDiv.addClass("overthrow").addClass("dishTagPanel");
		$("<div>").text(orderItem.dishName + $.i18n.prop('string_Options'))
				.addClass("caption").appendTo(dialogDiv);
		var contentDiv = $("<div>").addClass("orderItemCmdPanelContent")
				.addClass("overthrow").appendTo(dialogDiv);

		var dish = uiDataManager.getDishById(orderItem.dishId);
		var dishTagGroups = uiDataManager.getDishTagGroupsByDishId(dish.id);

		for ( var i in dishTagGroups) {
			var dishTagGroup = dishTagGroups[i];
			if (!dishTagGroup.singleSelection) {
				continue;
			}
			renderDishTagGroup(contentDiv, dishTagGroup, true);
		}

		for ( var i in dishTagGroups) {
			var dishTagGroup = dishTagGroups[i];
			if (dishTagGroup.singleSelection) {
				continue;
			}
			renderDishTagGroup(contentDiv, dishTagGroup, false);
		}

		$("<div>").attr("id", "commonTagsPanel_bottomPanel").addClass(
				"overthrow").appendTo(contentDiv);

		updateOptionsDiv();

		var bottomDiv = $("<div>").addClass("orderItemCmdPanelBottomDiv");
		bottomDiv.appendTo(dialogDiv);

		$("<a>").text($.i18n.prop('string_Confirm')).addClass(
				"dishOrderCmdButton").click(confirmButtonClick).appendTo(
				bottomDiv);
		function confirmButtonClick() {
			var dishTagDivs = $("[name='dishTagDiv']", contentDiv);

			var options = [];
			for (var i = 0; i < dishTagDivs.length; i++) {
				if (!$(dishTagDivs[i]).data("selected")) {
					continue;
				}
				var dishTag = $(dishTagDivs[i]).data("dishTag");
				var orderItemTag = OrderItemTag.newFromDishTag(orderItem,
						dishTag);
				options.push(orderItemTag);
			}

			if (okCallback) {
				okCallback(options, freeTag);
			}

			closeModal();
		}

		$("<a>").text($.i18n.prop('string_HandWrite')).addClass(
				"dishOrderCmdButton").click(handWriteButtonClick).appendTo(
				bottomDiv);
		function handWriteButtonClick() {
			new EditFreeTagDialog(orderItem.freeTag,
					function(name, priceDelta) {
						freeTag = OrderItemTag.newFreeTag(orderItem, name,
								priceDelta);
						updateOptionsDiv();
					}, function() {
						freeTag = null;
						updateOptionsDiv();
					}).show();
		}

		$("<a>").text($.i18n.prop('string_Cancel')).addClass(
				"dishOrderCmdButton").click(closeModal).appendTo(bottomDiv);
	};

	this.show = function() {
		dialogDiv.appendTo('body');
		modal = $(dialogDiv).modal({
			level : 5
		});
	};

	init();
}

function EditTagsDialog(type, entity, okCallback) {

	var dialogDiv = $('<div>');
	var modal = null;
	var uiDataManager = UIDataManager.getInstance();
	var tags = [];
	var freeTag = null;

	var closeModal = function() {
		if (modal) {
			modal.close();
		}
	};

	var appendCmdButtons = function(container) {

		$("<div>").addClass("button").text($.i18n.prop('string_Delete')).click(
				deleteButtonClick).appendTo(container);
		function deleteButtonClick() {
			var dishTagDivs = $("div[name='dishTagDiv']", dialogDiv);
			for (var i = 0; i < dishTagDivs.length; i++) {
				var dishTagDiv = $(dishTagDivs[i]);
				var dishTag = dishTagDiv.data("dishTag");
				if (dishTagDiv.data("selected")) {
					var allDeleted = true;
					for ( var j in tags) {
						if (tags[j].dishTagId == dishTag.id) {
							if (tags[j].id == 0) {
								tags.splice(j, 1);
							} else {
								allDeleted = false;
							}
						}
					}
					if (allDeleted) {
						dishTagDiv.removeAttr("style").data("selected", false)
								.data("checked", false);
					}
				}
			}
			updateTagText();
		}

		$("<div>").addClass("button").text($.i18n.prop('string_DeleteAll'))
				.css("margin-left", "0.6em").click(deleteAllButtonClick)
				.appendTo(container);
		function deleteAllButtonClick() {
			var dishTagDivs = $("div[name='dishTagDiv']", dialogDiv);
			for (var i = 0; i < dishTagDivs.length; i++) {
				var dishTagDiv = $(dishTagDivs[i]);
				var dishTag = dishTagDiv.data("dishTag");

				var hasTag = false;
				for ( var j in tags) {
					if (tags[j].dishTagId == dishTag.id) {
						if (tags[j].id == 0) {
							tags.splice(j, 1);
						} else {
							hasTag = true;
						}
					}
				}
				if (!hasTag) {
					dishTagDiv.removeAttr("style").data("selected", false)
							.data("checked", false);
				}
			}
			freeTag = null;
			updateTagText();
		}

		if (type == "OrderItem") {
			$("<div>").addClass("button").text($.i18n.prop('string_HandWrite'))
					.css("margin-left", "0.6em").click(handWriteButtonClick)
					.appendTo(container);
			function handWriteButtonClick() {
				new EditFreeTagDialog(entity.freeTag,
						function(name, priceDelta) {
							freeTag = OrderItemTag.newFreeTag(entity, name,
									priceDelta);
							updateTagText();
						}, function() {
							freeTag = null;
							updateTagText();
						}).show();
			}
		}

		$("<div>").addClass("button").text($.i18n.prop('string_Amount')).css(
				"margin-left", "0.6em").click(amountButtonClick).appendTo(
				container);
		function amountButtonClick() {
			var dishTagDivs = $("div[name='dishTagDiv']");

			for (var i = 0; i < dishTagDivs.length; i++) {
				if (!$(dishTagDivs[i]).data("selected")) {
					continue;
				}

				var dishTag = $(dishTagDivs[i]).data("dishTag");
				for ( var j in tags) {
					if (tags[j].dishTagId == dishTag.id) {
						var tag = tags[j];
						new AmountDialog($.i18n.prop('string_Amount'),
								tag.amount, function(result) {
									tag.amount = result;
									updateTagText();
								}).show();
					}
				}
			}
		}
	};

	var updateTagText = function() {
		var mergedTags = $.merge([ freeTag ], tags);
		var text = $.i18n.prop('string_Tags') + ":";
		if (type == "OrderItem") {
			text += OrderItemTag.tagsToText(mergedTags);
		} else {
			text += DishOrderTag.tagsToText(mergedTags);
		}

		$('#commonTagsPanel_bottomPanel', dialogDiv).text(text);
	};

	var renderDishTagGroup = function(container, dishTagGroup) {
		var dishTags = dishTagGroup.dishTags;

		for ( var i in dishTags) {
			var dishTag = dishTags[i];

			var backgroundColor = "";
			var checked = false;
			for ( var j in tags) {
				if (tags[j].dishTagId == dishTag.id) {
					backgroundColor = "#DDDDDD";
					checked = true;
					break;
				}
			}
			var dishTagDiv = $("<div>").attr("name", "dishTagDiv").addClass(
					"dishTagItem").css("background-color", backgroundColor)
					.data("dishTag", dishTag).data("selected", false).data(
							"checked", checked).click(dishTagClick).appendTo(
							container);
			function dishTagClick() {

				var newCheck = !$(this).data("checked");
				$("div[name='dishTagDiv']").css("border", "").data("selected",
						false);
				$(this).css("background-color", "#DDDDDD").css("border",
						"1px solid orange").data("selected", true).data(
						"checked", true);
				var dishTag = $(this).data("dishTag");

				if (newCheck) {
					var tag = null;

					if (type == "OrderItem") {
						tag = OrderItemTag.newFromDishTag(entity, dishTag);
					} else {
						tag = DishOrderTag.newFromDishTag(entity, dishTag);
					}

					tags.push(tag);
					updateTagText();
				}
			}

			$("<div>").text($.trim(dishTag.name)).css("height", "70%")
					.appendTo(dishTagDiv);
			if (type == "OrderItem") {
				$("<div>").text("￥" + dishTag.priceDelta).css("text-align",
						"right").css("height", "30%").appendTo(dishTagDiv);
			}
		}
	};

	var init = function() {

		tags = $.extend(true, [], entity.tags);
		freeTag = entity.freeTag;

		dialogDiv.attr("id", "commonTagsPanel").addClass("overthrow").addClass(
				"dishTagPanel");

		var title = $("<div>").addClass("caption").appendTo(dialogDiv);
		if (type == "OrderItem") {
			title.text(orderItem.dishName + $.i18n.prop('string_Tags'));
		} else {
			title.text($.i18n.prop('string_Tags'));
		}

		var contentDiv = $("<div>").addClass("orderItemCmdPanelContent")
				.appendTo(dialogDiv);

		var tagCmdDiv = $("<div>").attr("id", "commonTagsPanel_topPanel")
				.appendTo(contentDiv);
		appendCmdButtons(tagCmdDiv);

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

		var dishTagGroups = uiDataManager.getCommonDishTagGroups();
		for ( var i in dishTagGroups) {
			var dishTagGroup = dishTagGroups[i];
			$("<li>").text(dishTagGroup.name)
					.data("dishTagGroup", dishTagGroup).click(groupItemClick)
					.appendTo(ul);
			function groupItemClick() {
				midRightDiv.html("");

				$("li", ul).removeAttr("style");
				$(this).css("background-color", "#DDDDDD");
				var dishTagGroup = $(this).data("dishTagGroup");
				renderDishTagGroup(midRightDiv, dishTagGroup);
			}
		}

		ul.children(":first").trigger("click");

		$("<div>").attr("id", "commonTagsPanel_bottomPanel").addClass(
				"overthrow").appendTo(contentDiv);

		var bottomDiv = $("<div>").addClass("orderItemCmdPanelBottomDiv");
		bottomDiv.appendTo(dialogDiv);

		$("<a>").text($.i18n.prop('string_Confirm')).addClass(
				"dishOrderCmdButton").click(confirmButtonClick).appendTo(
				bottomDiv);
		function confirmButtonClick() {
			if (okCallback) {
				okCallback(tags, freeTag);
			}
			closeModal();
		}

		$("<a>").text($.i18n.prop('string_Cancel')).addClass(
				"dishOrderCmdButton").click(closeModal).appendTo(bottomDiv);

		updateTagText();
	};

	this.show = function() {
		dialogDiv.appendTo('body');
		modal = $(dialogDiv).modal({
			level : 5
		});
	};

	init();
}

function DiscountRuleDialog(orderItem, okCallback) {

	var dialogDiv = $('<div>');
	var modal = null;
	var uiDataManager = UIDataManager.getInstance();

	var closeModal = function() {
		if (modal) {
			modal.close();
		}
	};

	var init = function() {
		dialogDiv.addClass("overthrow").addClass("singleChoicePanel");
		var headerText = "[" + orderItem.dishName + "]"
				+ $.i18n.prop('string_Discount');
		$("<div>").text(headerText).addClass("caption").appendTo(dialogDiv);
		var contentDiv = $("<div>").addClass("orderItemCmdPanelContent")
				.addClass("overthrow").appendTo(dialogDiv);

		var discountRules = uiDataManager.getStoreData().discountRules;
		for ( var i in discountRules) {
			var discountRule = discountRules[i];

			var backgroundColor = "";
			if (orderItem.discountRuleId == discountRule.id) {
				backgroundColor = "#6AA1D8";
			}

			$("<div>").attr("name", "discountRuleItemDiv").css(
					"background-color", backgroundColor).data("discountRule",
					discountRule).addClass("singleChoiceItem").text(
					discountRule.name).appendTo(contentDiv).click(function() {
				var discountRule = $(this).data("discountRule");
				if (okCallback) {
					okCallback(discountRule);
				}
				closeModal();
			});
		}

		var bottomDiv = $("<div>").addClass("orderItemCmdPanelBottomDiv");
		bottomDiv.appendTo(dialogDiv);

		$("<a>").text($.i18n.prop('string_Cancel')).addClass(
				"dishOrderCmdButton").click(closeModal).appendTo(bottomDiv);
	};

	this.show = function() {
		dialogDiv.appendTo('body');
		modal = $(dialogDiv).modal({
			level : 5
		});
	};

	init();
}

function EditFreeTagDialog(tag, okCallback, deleteCallback) {

	var dialogDiv = $('<div>');
	var modal = null;

	var closeModal = function() {
		if (modal) {
			modal.close();
		}
	};

	var init = function() {

		dialogDiv.addClass("editItemPanel");

		$("<div>").text(
				$.i18n.prop('string_HandWrite') + $.i18n.prop('string_Tags'))
				.addClass("caption").appendTo(dialogDiv);

		var contentTable = $("<table>").appendTo(dialogDiv);
		var tr = $('<tr>').appendTo(contentTable);
		var td = $('<td>').text($.i18n.prop('string_Tags')).appendTo(tr);
		td = $('<td>').appendTo(tr);
		var tagNameInput = $("<input>").attr("type", "text").addClass(
				"dishNameInput").appendTo(td);
		$("<div>").text("×").addClass("clearTextButton").click(function() {
			$(tagNameInput).val("");
		}).appendTo(td);

		tr = $('<tr>').appendTo(contentTable);
		td = $('<td>').text($.i18n.prop('string_Price')).appendTo(tr);
		td = $('<td>').appendTo(tr);
		var priceInput = $("<div>").addClass("amountInput").text("0").appendTo(
				td);
		priceInput.click(function() {
			new AmountDialog($.i18n.prop('string_Price'), priceInput.text(),
					function(result) {
						priceInput.text(result);
					}).show();
		});

		if (tag) {
			tagNameInput.val(tag.name);
			priceInput.text(tag.priceDelta);
		}

		var bottomDiv = $("<div>").addClass("orderItemCmdPanelBottomDiv");
		bottomDiv.appendTo(dialogDiv);

		$("<div>").text($.i18n.prop('string_Confirm')).addClass(
				"dishOrderCmdButton").appendTo(bottomDiv).click(
				confirmButtonClick);
		function confirmButtonClick() {
			var name = $(tagNameInput).val();
			var priceDelta = parseFloat($(priceInput).text());

			if (name && name.length > 0 && !isNaN(priceDelta)) {
				if (okCallback) {
					okCallback(name, priceDelta);
				}

				closeModal();
			} else {
				new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
						.prop('string_InputError')).show();
			}
		}

		if (tag) {
			$("<a>").addClass("dishOrderCmdButton").css("margin-left", "1em")
					.text($.i18n.prop('string_Delete')).click(function() {
						if (deleteCallback) {
							deleteCallback();
						}
						closeModal();
					}).appendTo(bottomDiv);
		} else {
			$("<a>").addClass("dishOrderCmdButton").css("margin-left", "1em")
					.text($.i18n.prop('string_Cancel')).click(closeModal)
					.appendTo(bottomDiv);
		}
	};

	this.show = function() {
		dialogDiv.appendTo('body');
		modal = $(dialogDiv).modal({
			level : 8
		});
	};

	init();
}

function CancelReasonDialog(okCallback) {
	var dialogDiv = $('<div>');
	var modal = null;
	var uiDataManager = UIDataManager.getInstance();

	var closeModal = function() {
		if (modal) {
			modal.close();
		}
	};

	var init = function() {
		dialogDiv.addClass("overthrow").addClass("singleChoicePanel");
		$("<div>").text($.i18n.prop('string_CancelReason')).addClass("caption")
				.appendTo(dialogDiv);
		var contentDiv = $("<div>").addClass("orderItemCmdPanelContent")
				.addClass("overthrow").appendTo(dialogDiv);

		var cancelReasons = [ {
			id : null,
			name : $.i18n.prop('string_DishSoldOut')
		} ];
		for (i in uiDataManager.getStoreData().cancelReasons) {
			cancelReasons.push(uiDataManager.getStoreData().cancelReasons[i]);
		}
		for ( var i in cancelReasons) {
			var cancelReason = cancelReasons[i];
			var itemDiv = $("<div>").attr("name", "reasonItemDiv").addClass(
					"singleChoiceItem").text(cancelReason.name).data(
					"cancelReason", cancelReason).click(function() {
				var cancelReason = $(this).data("cancelReason");
				if (okCallback) {
					okCallback(cancelReason);
				}
				closeModal();
			});
			itemDiv.appendTo(contentDiv);
		}

		var bottomDiv = $("<div>").addClass("orderItemCmdPanelBottomDiv");
		bottomDiv.appendTo(dialogDiv);

		$("<a>").text($.i18n.prop('string_Cancel')).addClass(
				"dishOrderCmdButton").click(closeModal).appendTo(bottomDiv);
	};

	this.show = function() {
		dialogDiv.appendTo('body');
		modal = $(dialogDiv).modal({
			level : 5
		});
	};

	init();
}

function NamedValueDialog(type, initValue, okCallback) {

	var dialogDiv = $('<div>');
	var modal = null;
	var uiDataManager = UIDataManager.getInstance();

	var closeModal = function() {
		if (modal) {
			modal.close();
		}
	};

	var init = function() {
		dialogDiv.addClass("overthrow").addClass("singleChoicePanel");

		var contentDiv = $("<div>").addClass("orderItemCmdPanelContent")
				.addClass("overthrow").appendTo(dialogDiv);

		var rates = [];
		var defaultRate = {};
		if (type == 'Discount Rate') {
			rates = jQuery.extend([],
					uiDataManager.getStoreData().discountRates);
			defaultRate = {
				name : "无",
				value : 1
			};
		}
		if (type == 'Service Fee Rate') {
			rates = jQuery.extend([],
					uiDataManager.getStoreData().serviceFeeRates);
			defaultRate = {
				name : "无",
				value : 0
			};
		}
		rates.push(defaultRate);

		for ( var i in rates) {
			var rate = rates[i];

			var backgroundColor = "";
			if (initValue == rate.value) {
				backgroundColor = "#6AA1D8";
			}

			var rateItemDiv = $("<div>").attr("name", "rateItemDiv").css(
					"background-color", backgroundColor).data("rateValue",
					rate.value).addClass("singleChoiceItem").text(rate.name)
					.click(rateItemDivClick);
			function rateItemDivClick() {
				var rateValue = $(this).data('rateValue');
				if (okCallback) {
					okCallback(rateValue);
				}
				closeModal();
			}

			rateItemDiv.appendTo(contentDiv);
		}

		var bottomDiv = $("<div>").addClass("orderItemCmdPanelBottomDiv");
		bottomDiv.appendTo(dialogDiv);

		$("<a>").text($.i18n.prop('string_Cancel')).addClass(
				"dishOrderCmdButton").click(closeModal).appendTo(bottomDiv);
	};

	this.show = function() {
		dialogDiv.appendTo('body');
		modal = $(dialogDiv).modal({
			level : 8
		});
	};

	init();
}

function FunctionMenuDialog() {

	var dialogDiv = $('<div>');
	var model = null;

	function closeModel() {
		if (model)
			model.close();
	}

	function init() {

		dialogDiv.addClass("functionMenuDialog").attr("id",
				"functionMenuDialog");

		$("<div>").addClass("topPanel").appendTo(dialogDiv);

		var functionMenuButtonSelector = $("<div>").addClass(
				"overthrow functionMenuButtonSelector").appendTo(dialogDiv);
		var controlPanelDiv = $("<div>").addClass("controlPanel").appendTo(
				dialogDiv);

		var dishOrderFieldset = $("<fieldset>").attr("id", "reportPanel").css(
				"margin-bottom", "1em").appendTo(functionMenuButtonSelector);
		$("<legend>").text("订单").appendTo(dishOrderFieldset);

		$("<div>").addClass("ui-radius ui-shadow functionMenuButton").text(
				"店内订单").click(function() {
			new DishOrderListDialog().show();
			closeModel();
		}).appendTo(dishOrderFieldset);
		$("<div>").addClass("ui-radius ui-shadow functionMenuButton").text(
				$.i18n.prop('string_ArchiveDishOrders')).click(function() {
			new ArchiveDishOrdersDialog().show();
			closeModel();
		}).appendTo(dishOrderFieldset);

		$("<div>").addClass("ui-radius ui-shadow functionMenuButton").text(
				$.i18n.prop('string_CloseCashierSession')).click(function() {
			new CashierSessionDialog().show();
			closeModel();
		}).appendTo(dishOrderFieldset);

		var reportFieldset = $("<fieldset>").attr("id", "reportPanel").css(
				"margin-bottom", "1em").appendTo(functionMenuButtonSelector);
		$("<legend>").text("报表").appendTo(reportFieldset);

		var statisticFieldset = $("<fieldset>").attr("id", "reportPanel").css(
				"margin-bottom", "1em").appendTo(functionMenuButtonSelector);
		$("<legend>").text("报表").appendTo(statisticFieldset);

		var systemFieldset = $("<fieldset>").attr("id", "reportPanel").css(
				"margin-bottom", "1em").appendTo(functionMenuButtonSelector);
		$("<legend>").text("系统").appendTo(systemFieldset);

		$("<a>").css("text-decoration", "none").addClass(
				"ui-radius ui-shadow functionMenuButton").attr("href",
				"financial_statement?db=" + db).attr("target", "_blank").text(
				$.i18n.prop('string_FinancialStatement')).appendTo(
				reportFieldset);

		$("<a>").css("text-decoration", "none").addClass(
				"ui-radius ui-shadow functionMenuButton").attr("href",
				"volume_financial_statement?db=" + db).attr("target", "_blank")
				.text($.i18n.prop('string_VolumeFinancialStatement')).appendTo(
						reportFieldset);

		$("<a>").css("text-decoration", "none").addClass(
				"ui-radius ui-shadow functionMenuButton").attr("href",
				"cashier_session_report?db=" + db).attr("target", "_blank")
				.text($.i18n.prop('string_CashierSessionReport')).appendTo(
						reportFieldset);

		$("<a>").css("text-decoration", "none").addClass(
				"ui-radius ui-shadow functionMenuButton").attr("href",
				"sell_statistics?db=" + db).attr("target", "_blank").text(
				$.i18n.prop('string_SellStatistics')).appendTo(
				statisticFieldset);

		$("<a>").css("text-decoration", "none").addClass(
				"ui-radius ui-shadow functionMenuButton").attr("href",
				"dish_category_sell_statistics?db=" + db).attr("target",
				"_blank").text($.i18n.prop('string_CategorySellStatistics'))
				.appendTo(statisticFieldset);

		$("<div>").addClass("ui-radius ui-shadow functionMenuButton").text(
				$.i18n.prop('string_Logout')).click(function() {
			window.location.href = 'login?db=' + db;
		}).appendTo(systemFieldset);

		$('<button>').addClass("operationButton").text(
				$.i18n.prop('string_Close')).click(function() {
			closeModel();
		}).appendTo(controlPanelDiv);
	}

	this.show = function() {
		dialogDiv.appendTo('body');
		model = $(dialogDiv).modal({
			level : 3
		});
	};

	init();
}

function ArchiveDishOrdersDialog() {

	var dialogDiv = $('<div>');
	var model = null;

	var dishOrderManager = DishOrderManager.getInstance();

	var closeModel = function() {
		if (model)
			model.close();
	};

	var showFinanceStat = function(container, financeStat) {
		var financeStatTable = $(
				'<table border="1" cellspacing="0" cellpadding="3" width="90%">')
				.appendTo(container);
		var recordTh = $('<tr style="background-color:#DDD">').appendTo(
				financeStatTable);
		$('<td>').text("订单数").appendTo(recordTh);
		$('<td>').text("人数").appendTo(recordTh);
		$('<td>').text("折前总价").appendTo(recordTh);
		$('<td>').text("折后总价").appendTo(recordTh);
		$('<td>').text("总服务费").appendTo(recordTh);
		$('<td>').text("人均消费").appendTo(recordTh);
		$('<td>').text("应收款").appendTo(recordTh);

		var recordTr = $('<tr>').appendTo(financeStatTable);
		$('<td>').text(financeStat.order_count).appendTo(recordTr);
		$('<td>').text(financeStat.customer_count).appendTo(recordTr);
		$('<td>').text(financeStat.total_price.toFixed(1)).appendTo(recordTr);
		$('<td>').text(financeStat.total_discounted_price.toFixed(1)).appendTo(
				recordTr);
		$('<td>').text(financeStat.total_service_fee.toFixed(1)).appendTo(
				recordTr);
		$('<td>').text(financeStat.avg_price.toFixed(1)).appendTo(recordTr);
		$('<td>').text(financeStat.total_discounted_price.toFixed(1)).appendTo(
				recordTr);
	};

	var showPaymentStats = function(container, paymentStats) {
		var paymentStatsTable = $(
				'<table border="1" cellspacing="0" cellpadding="3" width="90%">')
				.appendTo(container);
		var recordTh = $('<tr style="background-color:#DDD">').appendTo(
				paymentStatsTable);
		$('<td>').text("收入项目").appendTo(recordTh);
		$('<td>').text("记录数").appendTo(recordTh);
		$('<td>').text("原币").appendTo(recordTh);
		$('<td>').text("汇率").appendTo(recordTh);
		$('<td>').text("金额").appendTo(recordTh);
		for ( var i in paymentStats) {
			var paymentStat = paymentStats[i];

			var recordTr = $('<tr>').appendTo(paymentStatsTable);
			$('<td>').text(paymentStat.type_name).appendTo(recordTr);
			$('<td>').text(paymentStat.pay_record_count).appendTo(recordTr);
			$('<td>').text(paymentStat.total_amount.toFixed(1)).appendTo(
					recordTr);
			$('<td>').text(paymentStat.exchage_rate).appendTo(recordTr);
			$('<td>').text(paymentStat.transfered_amount.toFixed(1)).appendTo(
					recordTr);
		}
	};

	function init() {

		dialogDiv.addClass("functionMenuDialog");

		$("<div>").addClass("topPanel").appendTo(dialogDiv);

		var reportPanel = $("<div>").addClass(
				"overthrow functionMenuButtonSelector").appendTo(dialogDiv);

		var loadingDialog = new LoadingDialog($.i18n.prop("string_Loading"));
		loadingDialog.show();

		var payload = getJsonRPCPayload();
		var ajaxReq = getDefaultAjax(payload,
				rpc_urls.get_dish_order_archiving_report);

		$.ajax(ajaxReq).done(function(response) {
			loadingDialog.hide();
			if (!response.result) {
				reportPanel.text('系统错误，请重试');
				return;
			}

			reportPanel.empty();

			var financialStatement = response.result;
			showFinanceStat(reportPanel, financialStatement['finance_stat']);
			showPaymentStats(reportPanel, financialStatement['payment_stats']);
		}).fail(function() {
			loadingDialog.hide();
			reportPanel.text('系统错误，请重试');
		});

		var controlPanelDiv = $("<div>").addClass("controlPanel").appendTo(
				dialogDiv);

		$('<button>').addClass("operationButton").text(
				$.i18n.prop('string_ArchiveDishOrders')).click(function() {
			dishOrderManager.archiveDishOrders();
			closeModel();
		}).appendTo(controlPanelDiv);

		$('<button>').addClass("operationButton").text(
				$.i18n.prop('string_Close')).click(function() {
			closeModel();
		}).appendTo(controlPanelDiv);
	}

	this.show = function() {
		dialogDiv.appendTo('body');
		model = $(dialogDiv).modal({
			level : 3
		});
	};

	init();
}

function CashierSessionDialog() {

	var dialogDiv = $('<div>');
	var model = null;

	var closeModel = function() {
		if (model) {
			model.close();
		}
	};

	var showPaymentStats = function(container, paymentStats) {
		var paymentStatsTable = $(
				'<table border="1" cellspacing="0" cellpadding="3" width="90%">')
				.appendTo(container);
		var recordTh = $('<tr style="background-color:#DDD">').appendTo(
				paymentStatsTable);
		$('<td>').text("收入项目").appendTo(recordTh);
		$('<td>').text("记录数").appendTo(recordTh);
		$('<td>').text("原币").appendTo(recordTh);
		$('<td>').text("汇率").appendTo(recordTh);
		$('<td>').text("金额").appendTo(recordTh);
		for ( var i in paymentStats) {
			var paymentStat = paymentStats[i];

			var recordTr = $('<tr>').appendTo(paymentStatsTable);
			$('<td>').text(paymentStat.type_name).appendTo(recordTr);
			$('<td>').text(paymentStat.pay_record_count).appendTo(recordTr);
			$('<td>').text(paymentStat.total_amount.toFixed(1)).appendTo(
					recordTr);
			$('<td>').text(paymentStat.exchage_rate).appendTo(recordTr);
			$('<td>').text(paymentStat.transfered_amount.toFixed(1)).appendTo(
					recordTr);
		}
	};

	function init() {

		dialogDiv.addClass("functionMenuDialog");

		$("<div>").addClass("topPanel").appendTo(dialogDiv);

		var reportPanel = $("<div>").addClass(
				"overthrow functionMenuButtonSelector").appendTo(dialogDiv);

		var loadingDialog = new LoadingDialog($.i18n.prop("string_Loading"));
		loadingDialog.show();

		var payload = getJsonRPCPayload();
		var ajaxReq = getDefaultAjax(payload,
				rpc_urls.get_current_cashier_session_report);

		$.ajax(ajaxReq).done(function(response) {
			loadingDialog.hide();
			if (!response.result) {
				reportPanel.text('系统错误，请重试');
				return;
			}

			reportPanel.empty();

			var financialStatement = response.result;
			showPaymentStats(reportPanel, financialStatement['payment_stats']);
		}).fail(function() {
			loadingDialog.hide();
			reportPanel.text('系统错误，请重试');
		});

		var controlPanelDiv = $("<div>").addClass("controlPanel").appendTo(
				dialogDiv);

		$('<button>').addClass("operationButton").text(
				$.i18n.prop('string_CloseCashierSession')).click(
				function() {
					AuthorityManager.getInstance().forceTemporaryAuthority(
							'canPayDishOrder', closeCashierSession);
				}).appendTo(controlPanelDiv);
		function closeCashierSession() {
			var loadingDialog = new LoadingDialog($.i18n.prop("string_Loading"));
			loadingDialog.show();

			var payload = getJsonRPCPayload();

			if (typeof (RICE4Native) != 'undefined') {
				if (RICE4Native.getCheckoutBillPrinterId
						&& RICE4Native.getCheckoutBillPrinterId()) {
					payload.params.printer_id = RICE4Native
							.getCheckoutBillPrinterId();
				}
			}

			var ajaxReq = getDefaultAjax(payload,
					rpc_urls.close_current_cashier_session);

			$.ajax(ajaxReq).done(function(response) {
				loadingDialog.hide();
				if (!response.result) {
					reportPanel.text('系统错误，请重试');
					return;
				}

				reportPanel.empty();
				closeModel();
			}).fail(function() {
				loadingDialog.hide();
				reportPanel.text('系统错误，请重试');
			});
		}

		$('<button>').addClass("operationButton").text(
				$.i18n.prop('string_Close')).click(function() {
			closeModel();
		}).appendTo(controlPanelDiv);
	}

	this.show = function() {
		dialogDiv.appendTo('body');
		model = $(dialogDiv).modal({
			level : 3
		});
	};

	init();
}

function DishOrderListDialog() {

	var dialogDiv = $('<div>');
	var dishOrderManager = DishOrderManager.getInstance();
	var dishOrderCache = DishOrderCache.getInstance();
	var model = null;

	var closeModel = function() {
		if (model) {
			model.close();
		}
	};

	var renderDishOrders = function(dishOrderList) {
		var dishOrderListPanel = $('#dishOrderListPanel', dialogDiv);
		dishOrderListPanel.empty();

		for ( var i in dishOrderList) {
			var dishOrder = dishOrderList[i];
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

			$("<button>").addClass("button restoreOrderButton").text(
					$.i18n.prop('string_Restore')).data("dishOrder", dishOrder)
					.click(restoreDishOrderButtonClick).appendTo(
							dishOrderCaptionDiv);
			function restoreDishOrderButtonClick() {
				var dishOrder = $(this).data("dishOrder");

				var orderBrief = dishOrderCache
						.getDishOrderBriefByDeskId(dishOrder.deskId);
				if (orderBrief
						&& (orderBrief.state == DishOrder.STATE.CREATING || orderBrief.state == DishOrder.STATE.PROCESSING)) {
					new AlertDialog($.i18n.prop('string_Error'), $.i18n
							.prop('string_NotEmptyDesk')).show();
				} else {
					AuthorityManager
							.getInstance()
							.getAuthority(
									'canPayDishOrder',
									function() {
										dishOrderManager
												.restoreDishOrder(dishOrder.id);
										closeModel();
									});
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
	};

	var init = function() {
		dialogDiv.addClass("dishOrderListDialog").attr("id",
				"dishOrderListDialog");
		var titlePanel = $("<div>").addClass("topPanel ui-shadow").appendTo(
				dialogDiv);
		var searchInputPanel = $('<div>').addClass("searchInputPanel")
				.appendTo(titlePanel);
		var searchInput = $('<input>').addClass(
				"ui-input ui-border-solid ui-shadow ui-radius searchInput")
				.attr("placeholder", "输入订单号(至少三位)").appendTo(searchInputPanel);

		var titleOperatePanel = $('<div>').addClass("titleOperatePanel")
				.appendTo(titlePanel);

		$('<button>').addClass("button right").text(
				$.i18n.prop('string_Search')).click(searchButtonClick)
				.appendTo(titleOperatePanel);

		function searchButtonClick() {
			var idPart = searchInput.val();
			if (idPart.length < 3) {
				new AlertDialog('提示', '请至少输入三位数.').show();
				return;
			}

			dishOrderCache.searchDishOrdersById(idPart, renderDishOrders);
		}

		$('<button>').addClass("button right").text(
				$.i18n.prop('string_AllDishOrders')).click(function() {
			dishOrderCache.getPaidDishOrders(renderDishOrders);
		}).appendTo(titleOperatePanel);

		$('<div id="dishOrderListPanel">').addClass(
				"overthrow dishOrderListPanel").appendTo(dialogDiv);

		var controlPanelDiv = $("<div>").addClass("controlPanel").appendTo(
				dialogDiv);
		$('<button>').addClass("operationButton").text(
				$.i18n.prop('string_Close')).click(function() {
			closeModel();
		}).appendTo(controlPanelDiv);
	};

	this.show = function() {
		dialogDiv.appendTo('body');
		model = $(dialogDiv).modal({
			level : 3
		});
	};

	init();
}

function SelectDeskDialog(sourceDesk, actionText, filter, okCallback) {

	var dialogDiv = $('<div>');
	var model = null;

	var closeModel = function() {
		if (model)
			model.close();
	};

	var init = function() {
		dialogDiv.addClass("pickDeskDialog");
		$("<div>").text(actionText).addClass("caption").appendTo(dialogDiv);
		var deskGroupSelector = $("<div>").addClass("deskGroupSelector")
				.appendTo(dialogDiv);
		var deskSelector = $("<div>").addClass("overthrow deskSelector")
				.appendTo(dialogDiv);

		var bottomDiv = $("<div>").addClass("pickDeskDialogBottom").appendTo(
				dialogDiv);
		var actionInfoDiv = $('<div>').appendTo(bottomDiv);

		var targetDesk = null;

		new DeskPicker(deskGroupSelector, deskSelector, deskSelectedCallback,
				filter, [ sourceDesk ]).refreshUI();
		function deskSelectedCallback(selectedDesk) {
			targetDesk = selectedDesk;
			if (targetDesk != null) {
				actionInfoDiv.text($.i18n.prop('string_TargetDesk')
						+ targetDesk.name);
			} else {
				actionInfoDiv.text('');
			}
		}

		$('<div>').addClass("dishOrderCmdButton").text(actionText).click(
				selectDeskButtonClick).appendTo(bottomDiv);
		function selectDeskButtonClick() {
			if (targetDesk == null) {
				new AlertDialog($.i18n.prop('string_Message'), $.i18n
						.prop('string_NeedToSelectDesk')).show();
				return;
			}

			if (okCallback) {
				okCallback(targetDesk);
			}
			closeModel();
		}

		$('<button>').addClass("dishOrderCmdButton").text(
				$.i18n.prop('string_Cancel')).click(function() {
			closeModel();
		}).appendTo(bottomDiv);
	};

	this.show = function() {
		dialogDiv.appendTo('body');
		model = $(dialogDiv).modal();
	};

	init();
}

function chooseCustomerNotePrinter(cnprinters, isPrePrint, okCallback) {

	var printerId = null;
	var model = null;
	var dialogDiv = $("<div>");

	var closeModel = function() {
		if (model)
			model.close();
	};

	var init = function() {

		dialogDiv.addClass("singleChoicePanel");
		$("<div>").text($.i18n.prop('string_louMianDaYingJiXuanZe')).addClass(
				"caption").appendTo(dialogDiv);
		var contentDiv = $("<div>").addClass("orderItemCmdPanelContent")
				.addClass("overthrow").appendTo(dialogDiv);
		for ( var i in cnprinters) {
			var printer = cnprinters[i];
			var printerItemDiv = $("<div>").attr("name", "printerItemDiv")
					.data("printerId", printer.id).addClass("singleChoiceItem")
					.text(printer.name).click(printerItemDivClick);

			if (!printerId) {
				printerId = printer.id;
				printerItemDiv.css("background-color", "#6AA1D8");
			}
			printerItemDiv.appendTo(contentDiv);
		}

		function printerItemDivClick() {
			$("div[name='printerItemDiv']").removeAttr("style");
			$(this).css("background-color", "#6AA1D8");
			printerId = Number($(this).data("printerId"));
		}
		var bottomDiv = $("<div>").addClass("orderItemCmdPanelBottomDiv");
		bottomDiv.appendTo(dialogDiv);

		$("<a>").text($.i18n.prop('string_Confirm')).addClass("button").click(
				function() {
					closeModel();
					okCallback(printerId, isPrePrint);
				}).appendTo(bottomDiv);
	};

	this.show = function() {
		dialogDiv.appendTo("body");
		model = $(dialogDiv).modal();
	};

	init();
}

function SelectMealDealDishDialog(orderItem, okCallBack) {

	var model = null;
	var dialogDiv = $("<div>");
	var uiDataManager = UIDataManager.getInstance();

	var closeModel = function() {
		if (model)
			model.close();
	};

	var init = function() {

		dialogDiv.addClass("overthrow").addClass("dishTagPanel");
		$("<div>").text(orderItem.dishName + $.i18n.prop('string_ChangeDish'))
				.addClass("caption").appendTo(dialogDiv);

		var contentDiv = $("<div>").addClass("orderItemCmdPanelContent")
				.addClass("overthrow").appendTo(dialogDiv);

		var mealDealItems = uiDataManager
				.getChangableMealDealItems(orderItem.mealDealItemId);

		var mealDealItemDiv = $("<div>").appendTo(contentDiv);
		for ( var j in mealDealItems) {
			var mdi = mealDealItems[j];
			var selected = false;
			var backgroundColor = "";
			if (orderItem.mealDealItemId == mdi.id) {
				selected = true;
				backgroundColor = "#6AA1D8";
			}

			var targetDish = uiDataManager.getDishById(mdi.targetDishId);
			$("<div>").attr("name", "mealDealItemDiv").text(
					$.trim(targetDish.name) + " ￥" + mdi.priceDelta).data(
					"selected", selected).data("mealDealItem", mdi).addClass(
					"dishTagDiv").css("background-color", backgroundColor)
					.click(setMealDealItemDivClick).appendTo(mealDealItemDiv);
			function setMealDealItemDivClick() {
				var mealDealItem = $(this).data("mealDealItem");
				if (okCallBack) {
					okCallBack(mealDealItem);
				}
				closeModel();
			}
		}

		var bottomDiv = $("<div>").addClass("orderItemCmdPanelBottomDiv");
		bottomDiv.appendTo(dialogDiv);

		$('<button>').addClass("dishOrderCmdButton").text(
				$.i18n.prop('string_Cancel')).click(function() {
			closeModel();
		}).appendTo(bottomDiv);
	};

	this.show = function() {
		dialogDiv.appendTo("body");
		model = $(dialogDiv).modal();
	};

	init();
}

function EmployeeLoginDialog(okCallback, isAuthority) {

	var model = null;
	var dialogDiv = $("<div>");

	var closeModel = function() {
		if (model) {
			model.close();
		}
		if (document.onkeydown) {
			document.onkeydown = null;
		}
	};

	var smartCardNo = '';
	var passwordKb = null;

	var authenticateAjax = function(workNumber, password) {

		var postData = {
			workNumber : workNumber,
			password : password,
		};

		$.ajax({
			type : 'POST',
			url : "../employeeLogin/" + $storeId,
			data : postData,
			dataType : "json",
			error : function(error) {
				new AlertDialog($.i18n.prop('string_Notice'), $.i18n
						.prop('string_LoginError')).show();
			},
			success : function(employee) {
				if (okCallback) {
					okCallback(employee, isAuthority);
				}
				closeModel();
			}
		});
	};

	var keyDown = function(e) {
		// e.preventDefault();
		var keycode = event.keyCode;
		var realkey = String.fromCharCode(event.keyCode);

		if (keycode != 13) {
			smartCardNo += realkey;
			passwordKb.setText(passwordKb.getText() + "*");
		} else {
			if (smartCardNo == '') {
				return;
			}
			authenticateAjax("", smartCardNo);

			smartCardNo = '';
			passwordKb.setText("");
		}
	};

	var init = function() {

		dialogDiv.addClass("amountDialog");

		var workNumberKb = $("<div>").addClass("floatLeft").appendTo(dialogDiv)
				.digitKeyboard($.i18n.prop('string_WorkNumber') + ": ");
		$("<div>").addClass("floatLeft").css("width", "1em")
				.appendTo(dialogDiv);
		passwordKb = $("<div>").addClass("floatRight").appendTo(dialogDiv)
				.digitKeyboard($.i18n.prop('string_Password') + ": ", true);
		workNumberKb.setText("");
		passwordKb.setText("");

		$("<div>").addClass("clearBoth").appendTo(dialogDiv);
		var bottomDiv = $("<div>").css("text-align", "center").appendTo(
				dialogDiv);

		$("<div>").addClass("dialogButton").text($.i18n.prop('string_Login'))
				.css("margin-right", "3em").click(loginButtonClick).appendTo(
						bottomDiv);
		function loginButtonClick() {
			authenticateAjax(workNumberKb.getText(), passwordKb.getText());
		}

		$('<div>').addClass("dialogButton").text($.i18n.prop('string_Cancel'))
				.click(function() {
					closeModel();
				}).appendTo(bottomDiv);
	};

	this.show = function() {
		dialogDiv.appendTo("body");
		model = $(dialogDiv).modal({
			level : 8
		});

		document.onkeydown = keyDown;
	};

	init();
}

function EditOrderItemDialog(orderItem, okCallback) {

	var dialogDiv = $("<div>");
	var model = null;
	var uiDataManager = UIDataManager.getInstance();

	var closeModel = function() {
		if (model) {
			model.close();
		}
	};

	var init = function() {

		dialogDiv.addClass("editItemPanel");

		$("<div>").text($.i18n.prop('string_HandWrite')).addClass("caption")
				.appendTo(dialogDiv);

		var contentTable = $("<table>").appendTo(dialogDiv);
		var tr = $('<tr>').appendTo(contentTable);
		var td = $('<td>').text($.i18n.prop('string_DishName')).appendTo(tr);
		td = $('<td>').appendTo(tr);
		var dishNameInput = $("<input>").attr("type", "text").addClass(
				"dishNameInput").val(orderItem.dishName).appendTo(td);
		$("<div>").text("×").addClass("clearTextButton").click(function() {
			dishNameInput.val("");
		}).appendTo(td);

		tr = $('<tr>').appendTo(contentTable);
		td = $('<td>').text($.i18n.prop('string_Department')).appendTo(tr);
		td = $('<td>').appendTo(tr);
		var departmentSelect = $("<select>").appendTo(td);
		for ( var i in uiDataManager.getStoreData().departments) {
			var department = uiDataManager.getStoreData().departments[i];
			$("<option>").val(department.id).text(department.name).appendTo(
					departmentSelect);
		}
		departmentSelect.val(orderItem.departmentId);

		tr = $('<tr>').appendTo(contentTable);
		td = $('<td>').text($.i18n.prop('string_Price')).appendTo(tr);
		td = $('<td>').appendTo(tr);
		dishPriceStr = orderItem.dishPrice.toFixed(1);
		var dishPriceInput = $("<div>").addClass("amountInput").text(
				dishPriceStr).appendTo(td);
		dishPriceInput.click(function() {
			new AmountDialog($.i18n.prop('string_Price'),
					dishPriceInput.text(), function okCallback(result) {
						dishPriceInput.text(result);
					}).show();
		});

		tr = $('<tr>').appendTo(contentTable);
		td = $('<td>').text($.i18n.prop('string_Unit')).appendTo(tr);
		td = $('<td>').appendTo(tr);
		var dishUnitInput = $("<input>").attr("type", "text").addClass(
				"dishNameInput").val(orderItem.unit).appendTo(td);

		var bottomDiv = $("<div>").addClass("orderItemCmdPanelBottomDiv");
		bottomDiv.appendTo(dialogDiv);

		$("<div>").text($.i18n.prop('string_Confirm')).addClass(
				"dishOrderCmdButton").click(confirmButtonClick).appendTo(
				bottomDiv);
		function confirmButtonClick() {
			var dishName = dishNameInput.val();
			var dishPrice = parseFloat($(dishPriceInput).text());
			var unit = $(dishUnitInput).val();
			var departmentId = Number(departmentSelect.val());
			if (dishName != "" && unit != "" && !isNaN(dishPrice)) {
				if (okCallback) {
					okCallback(dishName, departmentId, dishPrice, unit);
				}
				closeModel();
			} else {
				new AlertDialog($.i18n.prop('string_Error'), $.i18n
						.prop('string_InvalidateInput')).show();
			}
		}

		$("<a>").addClass("dishOrderCmdButton").css("margin-left", "1em").text(
				$.i18n.prop('string_Cancel')).click(function() {
			closeModel();
		}).appendTo(bottomDiv);
	};

	this.show = function() {
		dialogDiv.appendTo("body");
		model = $(dialogDiv).modal();
	};

	init();
}
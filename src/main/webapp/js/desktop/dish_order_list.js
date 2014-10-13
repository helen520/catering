function dishOrderListButtonClick() {
	var dialogDiv = $('<div>').addClass("dishOrderListDialog").attr("id",
			"dishOrderListDialog").appendTo('body');
	var titlePanel = $("<div>").addClass("topPanel ui-shadow").appendTo(
			dialogDiv);
	var cancelDiv = $('<div>').addClass("cancelDiv").text("×").appendTo(
			dialogDiv);
	var dishOrderListPanel = $("<div>")
			.addClass("overthrow dishOrderListPanel").appendTo(dialogDiv);
	var controlPanelDiv = $("<div>").addClass("controlPanel").appendTo(
			dialogDiv);

	var searchInputPanel = $('<div>').addClass("searchInputPanel").appendTo(
			titlePanel);
	var searchInput = $('<input>').addClass(
			"ui-input ui-border-solid ui-shadow ui-radius searchInput")
			.appendTo(searchInputPanel);

	var titleOperatePanel = $('<div>').addClass("titleOperatePanel").appendTo(
			titlePanel);
	var searchButton = $('<button>').addClass("searchButton button").text(
			$.i18n.prop('string_souSuo')).appendTo(titleOperatePanel);
	var showDishOrderAllButton = $('<button>').addClass(
			"showDishOrderAllButton button right").text(
			$.i18n.prop('string_suoYou')).appendTo(titleOperatePanel);

	var dishOrderListDialogCancelBtn = $('<button>')
			.addClass("operationButton").text(
					$.i18n.prop('string_guanBiChuangKou')).appendTo(
					controlPanelDiv);

	var dishOrderListDialog = $(dialogDiv).modal();

	var selectorTop = titlePanel.height() + 10;
	dishOrderListPanel.offset({
		top : selectorTop,
		left : 5
	});

	cancelDiv.click(function() {
		dishOrderListDialog.close();
	});

	dishOrderListDialogCancelBtn.click(function() {
		dishOrderListDialog.close();
	});

	searchButton.click(function() {
		var searchStr = searchInput.val();
		if (!isNaN(searchStr) && Number(searchStr) != 0) {
			searchDishOrder(searchStr.trim());
		} else {
			alert($.i18n.prop('string_qingShuRuZhengQueDeDanHao'));
		}
	});

	showDishOrderAllButton.click(function() {
		var searchDishOrderBriefId = 0;
		searchDishOrder(searchDishOrderBriefId);
	});

	dishOrderListPanel
			.delegate(
					".restoreOrderButton",
					"click",
					function() {
						var dishOrderId = $(this).attr("dishOrderId");
						var dishOrderDivIndex = $(this).attr(
								"dishOrderDivIndex");
						var deskId = Number($(this).attr("deskId"));

						var orderBrief = $dishOrderBriefByDeskIdMap[deskId];
						if (orderBrief
								&& (orderBrief.state == DISH_ORDER_STATE.CREATING || orderBrief.state == DISH_ORDER_STATE.PROCESSING)) {
							alert($.i18n
									.prop('string_dingDanSuoZaiDeZhuoZiWeiMaiDanBuNengHuiFuDingDan'));
						} else {
							if ($isDesktop && $needEmployeeCheck)
								showEmployeeLoginDialog(restoreDishOrder,
										dishOrder.id, dishOrderDivIndex);
							else
								restoreDishOrder(dishOrder.id,
										dishOrderDivIndex);
						}
					});

	function searchDishOrder(searchDishOrderBriefId) {
		dishOrderListPanel.html("");
		$.ajax({
			type : 'POST',
			url : '../ordering/getDishOrderList',
			data : {
				storeId : $storeData.store.id,
				dishOrderBriefId : searchDishOrderBriefId
			},
			dataType : 'json',
			async : false,
			error : function() {
			},
			success : function(dishOrderList) {
				if (dishOrderList != null) {
					renderDishOrders(dishOrderListPanel, dishOrderList);
				}
			}
		});
	}

	function renderDishOrders(dishOrderListPanel, dishOrderList) {

		for ( var i in dishOrderList) {
			var dishOrder = dishOrderList[i];
			if (dishOrder) {
				var dishOrderDiv = $('<div>').addClass("dishOrder").attr("id",
						"dishOrderDiv_" + i).appendTo(dishOrderListPanel);
				var dishOrderCaptionDiv = $('<div>').addClass("captionPanel")
						.appendTo(dishOrderDiv);
				var dishOrderItemListDiv = $('<div>').addClass(
						"dishOrderItemListPanel").appendTo(dishOrderDiv);
				var dishOrderOperationPanel = $('<div>').addClass(
						"dishOrderOperationPanel").appendTo(dishOrderDiv);

				var dishOrderId = $.trim(dishOrder.id);
				var dishOrderBriefId = dishOrderId.substring(
						dishOrderId.length - 4, dishOrderId.length);
				var dishOrderCaptionHtml = new StringBuilder();
				dishOrderCaptionHtml.append(dishOrder.deskName);
				dishOrderCaptionHtml.append([ dishOrder.customerCount,
						$.i18n.prop('string_ren') ]);
				dishOrderCaptionHtml.append([ "&yen;", dishOrder.totalPrice ]);
				dishOrderCaptionHtml.append([
						" " + $.i18n.prop('string_danHao') + ":",
						dishOrderBriefId ]);
				+dishOrder.customerCount + +dishOrder.totalPrice;
				dishOrderCaptionDiv.html(dishOrderCaptionHtml.toString());

				var restoreOrderButton = $("<button>").addClass(
						"button restoreOrderButton").text(
						$.i18n.prop('string_huiFu')).appendTo(
						dishOrderOperationPanel);
				restoreOrderButton.attr("dishOrderId", dishOrder.id);
				restoreOrderButton.attr("dishOrderDivIndex", i);
				restoreOrderButton.attr("deskId", dishOrder.deskId);

				var orderItems = dishOrder.orderItems;
				for ( var i in orderItems) {
					var orderItem = orderItems[i];
					var orderItemsHtml = new StringBuilder();
					orderItemsHtml.append("<div class=\"button orderItem\">");
					orderItemsHtml.append(orderItem.dishName);
					orderItemsHtml.append("</div>");
					$(orderItemsHtml.toString()).appendTo(dishOrderItemListDiv);
				}
			}
		}
	}

	function restoreDishOrder(dishOrderId, dishOrderDivIndex) {
		if (!$storeData.employee.canRestoreDishOrder) {
			showAlertDialog("错误", "权限不足，不能执行当前操作");
			return;
		}
		$.ajax({
			type : 'POST',
			url : '../ordering/restoreDishOrder',
			data : {
				dishOrderId : dishOrderId,
				employeeId : $storeData.employee.id
			},
			dataType : 'json',
			async : false,
			error : function() {
				showAlertDialog("错误", "权限不足，不能执行当前操作");
			},
			success : function(restoreDishOrderState) {
				if (Boolean(restoreDishOrderState)) {
					$("#dishOrderDiv_" + dishOrderDivIndex).fadeOut(1000,
							function() {
								$(this).remove();
								cronJob();
							});
				}
			}
		});
	}
}
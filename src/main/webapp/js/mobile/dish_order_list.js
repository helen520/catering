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

	var searchInputPanel = $('<div>').addClass("searchInputPanel");

	var searchInput = $('<input>').addClass(
			"ui-input ui-border-solid ui-shadow ui-radius searchInput").attr(
			"placeholder", "输入订单号或桌名").appendTo(searchInputPanel);
	if (isSearchBookingDishOrder) {
		searchInput.attr("placeholder", "输入完整的会员卡号或电话号码");

		$('<input>').attr("id", "searchBookingDishOrderByDate").attr("onclick",
				"new Calendar().show(this);").appendTo(searchInputPanel);
	}

	var titleOperatePanel = $('<div>').addClass("titleOperatePanel");

	var searchButton = $('<button>').addClass("button right").text(
			$.i18n.prop('string_souSuo')).appendTo(titleOperatePanel);
	var showDishOrderAllButton = $('<button>').addClass("button right").text(
			$.i18n.prop('string_suoYou')).appendTo(titleOperatePanel);

	var dishOrderListDialogCancelBtn = $('<button>')
			.addClass("operationButton").text(
					$.i18n.prop('string_guanBiChuangKou')).appendTo(
					controlPanelDiv);

	if (!isShowSelfDishOrder) {
		searchInputPanel.appendTo(titlePanel);
		titleOperatePanel.appendTo(titlePanel);
	} else {
		titlePanel.css("text-align", "center").text("自助订单列表");
		if ($selfDishOrders.length > 0) {
			renderDishOrders(dishOrderListPanel, $selfDishOrders);
		}
	}

	var dishOrderListDialog = $(dialogDiv).modal();

	var selectorTop = titlePanel.height() + 10;
	dishOrderListPanel.offset({
		top : selectorTop,
		left : 5
	});

	cancelDiv.click(function() {
		isSearchBookingDishOrder = false;
		isShowSelfDishOrder = false;
		dishOrderListDialog.close();
	});

	dishOrderListDialogCancelBtn.click(function() {
		isSearchBookingDishOrder = false;
		isShowSelfDishOrder = false;
		dishOrderListDialog.close();
	});

	searchButton.click(function() {
		var searchStr = searchInput.val();
		var searchBookingDishOrderByDate = $("#searchBookingDishOrderByDate")
				.val();
		if (isSearchBookingDishOrder && searchBookingDishOrderByDate != "") {
			searchDishOrder(searchBookingDishOrderByDate.trim(), true);
			searchInput.val("");
			return;
		}
		if (searchStr != "" && Number(searchStr) != 0) {
			searchDishOrder(searchStr.trim());
			return;
		}
		alert("请输入正确的信息!");
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
						var dishOrder = $(this).data("dishOrder");
						if (isSearchBookingDishOrder || isShowSelfDishOrder) {
							$curDishOrder = dishOrder;
							dishOrderListDialog.close();
							_changeDeskButtonClick();
							return;
						}

						var dishOrderDivIndex = $(this).attr(
								"dishOrderDivIndex");

						var orderBrief = $dishOrderBriefByDeskIdMap[dishOrder.deskId];
						if (orderBrief
								&& (orderBrief.state == DISH_ORDER_STATE.CREATING || orderBrief.state == DISH_ORDER_STATE.PROCESSING)) {
							alert($.i18n
									.prop('string_dingDanSuoZaiDeZhuoZiWeiMaiDanBuNengHuiFuDingDan'));
						} else {
							if (!isShowedEmployeeLoginDialog) {
								if ($isDesktop)
									if ($storeData.employee.canRestoreDishOrder)
										restoreDishOrder(dishOrder.id,
												dishOrderDivIndex);
									else
										showEmployeeLoginDialog(
												restoreDishOrder, dishOrder.id,
												dishOrderDivIndex, true);
								else
									restoreDishOrder(dishOrder.id,
											dishOrderDivIndex);
							}
						}
					});

	dishOrderListPanel.delegate(".cancelOrderButton", "click", function() {
		var dishOrder = $(this).data("dishOrder");
		if (isSearchBookingDishOrder || isShowSelfDishOrder) {
			showConfirmDialog("提示", "如果该订单已付预付款,取消的话则会将预付款返还到该预订会员帐号上!",
					cancelDishOrder, dishOrder.id);
		}
	});

	var lastSearchDishOrderBriefId = 0;
	var lastIsSearchBookingDishOrderByDate = false;
	function searchDishOrder(searchDishOrderBriefId,
			isSearchBookingDishOrderByDate) {
		lastSearchDishOrderBriefId = searchDishOrderBriefId;
		lastIsSearchBookingDishOrderByDate = isSearchBookingDishOrderByDate;
		dishOrderListPanel.html("");
		$.ajax({
			type : 'POST',
			url : '../ordering/getDishOrderList',
			data : {
				storeId : $storeData.store.id,
				dishOrderBriefId : searchDishOrderBriefId,
				isSearchBookingDishOrder : isSearchBookingDishOrder,
				isSearchBookingDishOrderByDate : isSearchBookingDishOrderByDate
			},
			dataType : 'json',
			async : false,
			error : function() {
			},
			success : function(dishOrderList) {
				$("#searchBookingDishOrderByDate").val("");
				if (dishOrderList != null) {
					if (isSearchBookingDishOrder && dishOrderList.length <= 0) {
						alert("查询不到订单信息!!!");
						return;
					}
					renderDishOrders(dishOrderListPanel, dishOrderList);
				}
			}
		});
	}

	function renderDishOrders(dishOrderListPanel, dishOrderList) {

		dishOrderListPanel.empty();

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

				var restoreOrderButton = $("<button>").addClass(
						"button restoreOrderButton").text(
						$.i18n.prop('string_huiFu')).appendTo(
						dishOrderOperationPanel);

				var cancelOrderButton = $("<button>").addClass(
						"button cancelOrderButton").text("取消").data(
						"dishOrder", dishOrder);

				restoreOrderButton.data("dishOrder", dishOrder);
				restoreOrderButton.attr("dishOrderDivIndex", i);

				var dishOrderId = $.trim(dishOrder.id);
				var dishOrderBriefId = dishOrderId.substring(
						dishOrderId.length - 4, dishOrderId.length);
				var dishOrderCaptionHtml = new StringBuilder();
				if (dishOrder.deskName != null && dishOrder.deskName != "") {
					dishOrderCaptionHtml.append(" 桌号:" + dishOrder.deskName);
				}
				dishOrderCaptionHtml.append(" 人数:" + dishOrder.customerCount
						+ $.i18n.prop('string_ren'));
				dishOrderCaptionHtml.append([ " &yen;", dishOrder.totalPrice ]);
				dishOrderCaptionHtml.append([
						" " + $.i18n.prop('string_danHao') + ":",
						dishOrderBriefId ]);

				if (dishOrder.member) {
					dishOrderCaptionHtml.append(" 会员卡号:"
							+ dishOrder.member.memberCardNo);
					dishOrderCaptionHtml.append(" 姓名:" + dishOrder.member.name);
					if (dishOrder.bookRecord == null)
						dishOrderCaptionHtml.append(" 电话:"
								+ dishOrder.member.mobileNo);
				}

				if (isShowSelfDishOrder) {
					cancelOrderButton.appendTo(dishOrderOperationPanel);
				}

				if (dishOrder.bookRecord) {

					cancelOrderButton.appendTo(dishOrderOperationPanel);

					dishOrderCaptionDiv.css("background-color", "#D9B9B3");
					dishOrderCaptionHtml.append([ " 电话:"
							+ dishOrder.bookRecord.contactTel ]);
					dishOrderCaptionHtml.append([ " 到店时间:"
							+ dishOrder.bookRecord.expectedArriveTimeToStr ]);
					if (dishOrder.bookRecord.isServingArrived) {
						dishOrderCaptionHtml.append([ " 已预付:"
								+ dishOrder.prePay ]);
						dishOrderCaptionHtml.append([ " 到店上菜!!" ]);
					}

					var bookRecordDate = dishOrder.bookRecord.expectedArriveTimeToStr
							.split(" ")[0].split("-")[2];

					var bookRecordMonth = dishOrder.bookRecord.expectedArriveTimeToStr
							.split(" ")[0].split("-")[1];

					if (((new Date().getMonth()) + 1) - bookRecordMonth == 0) {
						if (Number(new Date().getDate())
								- Number(bookRecordDate) > 0) {
							restoreOrderButton.hide();
						}
					} else {
						restoreOrderButton.hide();
					}
				}
				dishOrderCaptionDiv.html(dishOrderCaptionHtml.toString());

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
		if (!$storeData.employee.canRestoreDishOrder && $templeEmployee
				&& !$templeEmployee.canRestoreDishOrder) {
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
			error : function(error) {
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

	function cancelDishOrder(dishOrderId) {
		$.ajax({
			type : 'POST',
			url : '../ordering/cancelDishOrder',
			data : {
				employeeId : $storeData.employee.id,
				dishOrderId : dishOrderId
			},
			dataType : 'json',
			async : false,
			error : function() {
			},
			success : function(DishOrder) {
				if (isShowSelfDishOrder) {
					$lastSelfDishOrdersHash = 0;
					updateDynamicData(null, null, null, function() {
						renderDishOrders(dishOrderListPanel, $selfDishOrders);
					});
					return;
				}
				searchDishOrder(lastSearchDishOrderBriefId,
						lastIsSearchBookingDishOrderByDate);
			}
		});
	}
}
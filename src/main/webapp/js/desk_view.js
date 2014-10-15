var deskView_DeskPicker;
var deskView_SelectedDesk;
var isSearchBookingDishOrder = false;
var isSearchBookRecord = false;
var isShowSelfDishOrder = false;
var $isBlock = false;

function initDeskView() {

	deskView_DeskPicker = new DeskPicker($("#deskGroupSelector"),
			$('#deskSelector'), deskView_DeskSelectedCallback,
			DeskPicker.filter.all);
	$('#customerCountLabel').click(customerCountLabelClick);
	$('#createDishOrderButton').click(createDishOrderButtonClick);
	$('#orderDishesButton').click(orderDishesButtonClick);
	$('#payDishOrderButton').click(payDishOrderButtonClick);
	$('#changeDeskButton').click(changeDeskButtonClick);
	$('#mergeDishOrderButton').click(mergeDishOrderButtonClick);
	$('#functionMenuButton').click(function() {
		if ($isDesktop && $needEmployeeCheck)
			showEmployeeLoginDialog(functionMenuButtonClick);
		else
			functionMenuButtonClick();
	});
	$('#bookingRecordsButton').click(bookingRecordsButtonClick);
	$('#selfDishOrdersButton').click(selfDishOrdersButtonClick);
	$('#reprintCustomerNoteButton').click(reprintCustomerNoteButtonClick);
	$('#printCustomerNoteButton').click(printCustomerNoteButtonClick);

	$isBlock = $storeData.employee.isShowBlockDishView;

	$("#prePrintCheckoutBillButton").click(
			function() {

				if (!$curDishOrder) {
					showAlertDialog($.i18n.prop('string_cuoWu'), $.i18n
							.prop('string_dangQianDingDanWeiKongWuFaDaYin'));
					return;
				}

				if ($isDesktop && $needEmployeeCheck)
					showEmployeeLoginDialog(postToPrePrintCheckoutBill);
				else
					postToPrePrintCheckoutBill();
			});

	function postToPrePrintCheckoutBill() {
		if (!$storeData.employee
				|| !$storeData.employee.canPreprintCheckoutNote) {
			showAlertDialog($.i18n.prop('string_cuoWu'), "权限不足!无法进行操作!");
			return;
		}

		showLoadingDialog($.i18n.prop('string_zhengZaiTiJiaoDaYin'));
		var ajaxReq = {
			type : 'POST',
			url : '../ordering/prePrintCheckoutBill',
			data : {
				employeeId : $storeData.employee.id,
				dishorderJsonStr : JSON.stringify($curDishOrder)
			},
			dataType : 'json',
			error : function() {
				hideLoadingDialog();
				showAlertDialog(
						$.i18n.prop('string_yuDaYinJieZhangDan'),
						$.i18n
								.prop('string_yuDaYinJieZhangDanShiBaiQingShaoHouZaiShi'));
			},
			success : function(result) {
				hideLoadingDialog();
				showAlertDialog($.i18n.prop('string_yuDaYinJieZhangDan'),
						$.i18n.prop('string_yiTiJiaoDaYinJiDaYin'));

				if (result) {
					$curDishOrder.prePrintCheckoutNotePrinted = true;
					updateDishOrderCache($curDishOrder);
				}
			}
		};

		$.ajax(ajaxReq);
	}

}

function showDeskView() {
	$("#deskView").show();
	refreshDeskViewUI();
}

function refreshDeskViewUI() {
	deskView_DeskPicker.refreshUI();
	updateDeskPanel();
}

function deskView_DeskSelectedCallback(selectedDesk) {
	deskView_SelectedDesk = selectedDesk;
	updateDeskPanel();
}

function updateDeskPanel() {

	$("#deskNameLabel").text("");

	if (!deskView_SelectedDesk) {
		$('#statInfoPanel').show();
		$('#deskPanel').hide();
		return;
	}

	$('#statInfoPanel').hide();
	$('#deskPanel').show();
	$("#deskNameLabel").text(deskView_SelectedDesk.name);

	var loadingHtml = new StringBuilder();
	loadingHtml.append("<div style=\"text-align:center;\">");
	loadingHtml.append("<img src=\"../images/loading.gif\" alt=\"loading\"/>");
	loadingHtml.append("</div>");

	$("#customerCountLabel").text("");
	$("#totalPriceLabel").text("");
	$("#dishOrderCreateTimeLabel").hide();
	$("#dishOrderCreateTime").text("");
	$("#orderItemListDiv").empty().append($(loadingHtml.toString()));

	var orderBrief = $dishOrderBriefByDeskIdMap[deskView_SelectedDesk.id];
	if (isDeskEmpty(deskView_SelectedDesk)) {
		$("#customerCountLabel").text($.i18n.prop('string_kongZhuo'));
		$curDishOrder = null;
		showCurDishOrder();
		return;
	}

	var dishOrderId = orderBrief.dishOrderId;
	var needGetFromServer = false;
	if ($dishOrderMap[dishOrderId] == null
			|| $dishOrderBriefMap[dishOrderId] == null) {
		needGetFromServer = true;
	} else {
		if ($dishOrderMap[dishOrderId].jsonHash != $dishOrderBriefMap[dishOrderId].jsonHash)
			needGetFromServer = true;
	}

	if (needGetFromServer) {
		$
				.ajax({
					type : 'POST',
					url : "../ordering/getDishOrderById",
					data : {
						dishOrderId : dishOrderId
					},
					dataType : "json",
					async : true,
					error : function() {
						$("#orderItemListDiv")
								.text(
										$.i18n
												.prop('string_wuFaCongFuWuQiHuoQuDingDanQingJianChaWangLuoLianJie'));
					},
					success : function(dishOrder) {
						mergeClientOrderItems(dishOrder);
						updateDishOrderCache(dishOrder);
						$dishOrderMap[dishOrderId] = dishOrder;
						$curDishOrder = dishOrder;
						showCurDishOrder();
					}
				});
	} else {
		$curDishOrder = $dishOrderMap[dishOrderId];
		showCurDishOrder();
	}
}

function isDeskEmpty(desk) {
	var orderBrief = $dishOrderBriefByDeskIdMap[desk.id];
	if (orderBrief) {
		if (orderBrief.state == DISH_ORDER_STATE.CREATING
				|| orderBrief.state == DISH_ORDER_STATE.PROCESSING) {
			return false;
		}
	}

	return true;
}

function showCurDishOrder() {

	var dishOrder = $curDishOrder;
	var customerCountStr = "";
	var totalPriceStr = "";
	var dishOrderBriefId = "";
	var isAllPrintedCustomerNote = true;
	$("#orderItemListDiv").empty();
	$('#printCustomerNoteButton').hide();
	$('#reprintCustomerNoteButton').hide();

	if (dishOrder) {
		var orderItems = dishOrder.orderItems;
		for ( var i in orderItems) {
			var orderItem = orderItems[i];

			var orderItemText = orderItem.dishName;
			if (orderItem.amount != 1)
				orderItemText += '[' + orderItem.amount + orderItem.unit + ']';

			var orderItemDiv = $('<div>').addClass("button orderItem").text(
					orderItemText).click(function() {
				if ($isDesktop) {
					if ($needEmployeeCheck) {
						showEmployeeLoginDialog(function() {
							switchToView("DISH_VIEW");
						});
					} else
						switchToView("DISH_VIEW");
				} else
					switchToView("DISH_ORDER_VIEW");
			}).appendTo("#orderItemListDiv");
			if (orderItem.id != 0
					&& orderItem.state == ORDER_ITEM_STATE.CANCELLED) {
				orderItemDiv.css({
					"text-decoration" : "line-through",
					"color" : "red"
				});
			}
			if (orderItem.id != 0
					&& orderItem.state == ORDER_ITEM_STATE.WAITING) {
				orderItemDiv.css({
					"color" : "green"
				});
			}

			if (!orderItem.customerNotePrinted && !orderItem.noCookingNote) {
				isAllPrintedCustomerNote = false;
			}
		}

		var dishOrderId = $.trim(dishOrder.id);
		dishOrderBriefId = $.i18n.prop('string_danHao')
				+ ":"
				+ dishOrderId.substring(dishOrderId.length - 4,
						dishOrderId.length);
		customerCountStr = dishOrder.customerCount + $.i18n.prop('string_ren');
		totalPriceStr = "&yen;" + dishOrder.finalPrice;

		if (isAllPrintedCustomerNote) {
			$('#reprintCustomerNoteButton').show();
		} else
			$('#printCustomerNoteButton').show();

		$("#dishOrderCreateTimeLabel").show();

		if ($isDesktop) {
			$("#dishOrderCreateTime").text(dishOrder.createTimeStr);
		} else
			$("#dishOrderCreateTime").text(dishOrder.createTimeHMStr);

	}

	$("#customerCountLabel").text(customerCountStr);
	$("#totalPriceLabel").html(totalPriceStr);
	$("#dishOrderBriefId").text(dishOrderBriefId);

	if (isDeskEmpty(deskView_SelectedDesk)) {
		$("#createDishOrderButton").show();
		$("#orderDishesButton").hide();
	} else {
		$("#createDishOrderButton").hide();
		$("#orderDishesButton").show();
	}
}

function customerCountLabelClick() {
	if ($isDesktop && $needEmployeeCheck)
		showEmployeeLoginDialog(function() {
			showAmountDialog($.i18n.prop('string_renShu') + "：",
					upateCustomerCount, $curDishOrder.customerCount);
		});
	else
		showAmountDialog($.i18n.prop('string_renShu') + "：",
				upateCustomerCount, $curDishOrder.customerCount);
}

function upateCustomerCount(customerCount) {
	showLoadingDialog($.i18n.prop('string_gengXinZhong'));
	var employeeId = $storeData.employee.id;

	$.ajax({
		type : 'POST',
		url : "../ordering/updateCustomerCount",
		data : {
			employeeId : employeeId,
			dishOrderId : $curDishOrder.id,
			customerCount : customerCount
		},
		dataType : "json",
		error : function(error) {
			showAlertDialog($.i18n.prop('string_cuoWu'), error.responseText);
			hideLoadingDialog();
		},
		success : function(dishOrder) {
			updateDishOrderPrice(dishOrder);
			updateDishOrderCache(dishOrder);
			$curDishOrder = dishOrder;
			updateDeskPanel();
			hideLoadingDialog();
		}
	});
}

function createDishOrderButtonClick() {
	if (!deskView_SelectedDesk) {
		showAlertDialog($.i18n.prop('string_tiShi'), $.i18n
				.prop('string_qingXuanZeZhuoZi'));
		return;
	}
	if ($isDesktop && $needEmployeeCheck)
		showEmployeeLoginDialog(function() {
			showAmountDialog($.i18n.prop('string_renShu'), createDishOrder);
		});
	else
		showAmountDialog($.i18n.prop('string_renShu'), createDishOrder);
}

function createDishOrder(customerCount) {
	showLoadingDialog($.i18n.prop("string_kaiTaiZhong"));
	var employeeId = $storeData.employee.id;
	var deskId = deskView_SelectedDesk.id;
	var serialNumber = "";

	$
			.ajax({
				type : 'POST',
				url : "../ordering/createDishOrder",
				data : {
					employeeId : employeeId,
					deskId : deskId,
					serialNumber : serialNumber,
					customerCount : customerCount
				},
				dataType : "json",
				error : function(error) {
					showAlertDialog($.i18n.prop('string_cuoWu'),
							error.responseText);
					hideLoadingDialog();
				},
				success : function(dishOrder) {
					updateDishOrderCache(dishOrder);
					$curDishOrder = dishOrder;

					for ( var dishId in $dishMap) {
						var dish = $dishMap[dishId];
						if (dish.autoOrder) {
							var orderItem = newOrderItemFromDish(dish);
							orderItem.amount = dish.amountPerCustomer != 0 ? dishOrder.customerCount
									* dish.amountPerCustomer
									: 1;
							$curDishOrder.orderItems.push(orderItem);

							if (dish.hasMealDealItems) {
								autoOrderingMealDealItems(dish, orderItem);
							}
						}
					}

					switchToView("DISH_VIEW");
					hideLoadingDialog();
				}
			});
}

function orderDishesButtonClick() {
	if ($isDesktop && $needEmployeeCheck)
		showEmployeeLoginDialog(function() {
			_orderDishesButtonClick();
		});
	else
		_orderDishesButtonClick();
}

function _orderDishesButtonClick() {

	var loadingHtml = new StringBuilder();
	loadingHtml.append("<div style=\"text-align:center;\">");
	loadingHtml.append("<img src=\"../images/loading.gif\" alt=\"loading\"/>");
	loadingHtml.append("</div>");

	$("#deskSelector").html(loadingHtml);
	switchToView("DISH_VIEW");
}

function payDishOrderButtonClick() {
	if ($isDesktop && $needEmployeeCheck)
		showEmployeeLoginDialog(function() {
			_payDishOrderButtonClick();
		});
	else
		_payDishOrderButtonClick();
}

function _payDishOrderButtonClick() {
	if ($curDishOrder == null) {
		showAlertDialog($.i18n.prop('string_tiShi'), $.i18n
				.prop('string_dangQianZhuoZiWuDingDanWuXuJieZhang'));
		return;
	}

	switchToView("CHECKOUT_VIEW");
}

function changeDeskButtonClick() {
	if ($isDesktop && $needEmployeeCheck)
		showEmployeeLoginDialog(function() {
			_changeDeskButtonClick();
		});
	else
		_changeDeskButtonClick();
}

function _changeDeskButtonClick() {

	var changeDeskDialog = null;

	if (!isSearchBookingDishOrder && !isShowSelfDishOrder
			&& (isDeskEmpty(deskView_SelectedDesk) || !$curDishOrder)) {
		showAlertDialog($.i18n.prop('string_tiShi'), $.i18n
				.prop('string_kongZhuoBuNengZhuanTai'));
		return;
	}

	var dialogDiv = $('<div>').addClass("pickDeskDialog").appendTo('body');
	$("<div>").text($.i18n.prop('string_qingXuanZeYaoZhuanRuDeZhuoHao'))
			.addClass("caption").appendTo(dialogDiv);
	var deskGroupSelector = $("<div>").addClass("deskGroupSelector").appendTo(
			dialogDiv);
	var deskSelector = $("<div>").addClass("overthrow deskSelector").appendTo(
			dialogDiv);
	var bottomDiv = $("<div>").addClass("pickDeskDialogBottom").appendTo(
			dialogDiv);
	var actionInfoDiv = $('<div>').appendTo(bottomDiv);

	if (!isSearchBookingDishOrder && !isShowSelfDishOrder) {
		actionInfoDiv.text(deskView_SelectedDesk.name);
	}
	var targetDesk = null;
	$('<div>').addClass("dishOrderCmdButton").text(
			$.i18n.prop('string_zhuanTai')).click(changeDeskOkButtonClick)
			.appendTo(bottomDiv);
	function changeDeskOkButtonClick() {
		var dishOrderId = $curDishOrder.id;
		if (targetDesk == null) {
			showAlertDialog($.i18n.prop('string_tiShi'), $.i18n
					.prop('string_qingXuanZeYaoZhuanRuDeZhuoZi'));
			return;
		}

		var employeeId = $storeData.employee.id;
		showLoadingDialog($.i18n.prop('string_zhengZaiZhuanTai'));
		$
				.ajax({
					type : 'POST',
					url : '../ordering/changeDesk',
					data : {
						employeeId : employeeId,
						dishOrderId : dishOrderId,
						targetDeskId : targetDesk.id
					},
					dataType : 'json',
					async : false,
					error : function(error) {
						hideLoadingDialog();
						showAlertDialog($.i18n.prop('string_cuoWu'),
								error.responseText);
					},
					success : function(dishOrder) {
						$dishOrderBriefByDeskIdMap[$curDishOrder.deskId] = null;
						hideLoadingDialog();
						updateDishOrderCache(dishOrder);
						$curDishOrder = dishOrder;

						deskView_SelectedDesk = targetDesk;
						deskView_DeskPicker.selectDesk(targetDesk);
						if (isSearchBookingDishOrder || isShowSelfDishOrder) {
							changeDeskDialog.close();

							for ( var dishId in $autoOrderDishMap) {
								var dish = $autoOrderDishMap[dishId];
								var isOrdered = false;
								for ( var i in $curDishOrder.orderItems) {
									var oi = $curDishOrder.orderItems[i];
									if (oi.dishId == dish.id) {
										isOrdered = true;
									}
								}
								if (!isOrdered) {
									var orderItem = newOrderItemFromDish(dish);
									if (dish.amountPerCustomer > 0) {
										orderItem.amount = $curDishOrder.customerCount
												* dish.amountPerCustomer;
									}
									$curDishOrder.orderItems.push(orderItem);

									if (dish.hasMealDealItems) {
										autoOrderingMealDealItems(dish,
												orderItem);
									}
								}
							}

							if ($isDesktop) {
								switchToView("DISH_VIEW");
								return;
							}

							switchToView("DISH_ORDER_VIEW");
							return;
						}

						deskView_DeskSelectedCallback(targetDesk);
						changeDeskDialog.close();
					}
				});
	}

	var changeDeskCancelButton = $('<button>').addClass("dishOrderCmdButton")
			.text($.i18n.prop('string_quXiao')).appendTo(bottomDiv);
	$(changeDeskCancelButton).click(function() {
		changeDeskDialog.close();
	});

	changeDeskDialog = $(dialogDiv).modal();

	var _SelectedDesk = null;

	if (!isSearchBookingDishOrder && !isShowSelfDishOrder) {
		_SelectedDesk = [ deskView_SelectedDesk ];
	}

	new DeskPicker(deskGroupSelector, deskSelector,
			deskViewDialog_DeskSelectedCallback,
			DeskPicker.filter.emptyDeskOnly, _SelectedDesk).refreshUI();
	function deskViewDialog_DeskSelectedCallback(selectedDesk) {
		targetDesk = selectedDesk;
		if (isSearchBookingDishOrder || isShowSelfDishOrder) {
			return;
		}
		if (targetDesk != null) {
			actionInfoDiv.text(deskView_SelectedDesk.name + " "
					+ $.i18n.prop('string_zhuan') + targetDesk.name);
		} else {
			actionInfoDiv.text(deskView_SelectedDesk.name);
		}
	}
}

function mergeDishOrderButtonClick() {
	if ($isDesktop && $needEmployeeCheck)
		showEmployeeLoginDialog(function() {
			_mergeDishOrderButtonClick();
		});
	else
		_mergeDishOrderButtonClick();
}
function _mergeDishOrderButtonClick() {
	var mergeDishOrderDialog = null;
	if (isDeskEmpty(deskView_SelectedDesk)) {
		showAlertDialog($.i18n.prop('string_tiShi'), $.i18n
				.prop('string_kongZhuoBuNengBingDan'));
		return;
	}

	var dialogDiv = $('<div>').addClass("pickDeskDialog").appendTo('body');
	$("<div>").text($.i18n.prop('string_qingXuanZeYaoHeBingDeZhuoHao'))
			.addClass("caption").appendTo(dialogDiv);
	var deskGroupSelector = $("<div>").addClass("deskGroupSelector").appendTo(
			dialogDiv);
	var deskSelector = $("<div>").addClass("overthrow deskSelector").appendTo(
			dialogDiv);
	var bottomDiv = $("<div>").addClass("pickDeskDialogBottom").appendTo(
			dialogDiv);
	var actionInfoDiv = $('<div>').text(deskView_SelectedDesk.name).appendTo(
			bottomDiv);

	var targetDesk = null;
	$('<button>').addClass("dishOrderCmdButton").text(
			$.i18n.prop('string_bingDan')).click(mergeDishOrderOKButtonClick)
			.appendTo(bottomDiv);
	function mergeDishOrderOKButtonClick() {
		var sourceDishOrderId = $curDishOrder.id;

		if (targetDesk == null) {
			showAlertDialog($.i18n.prop('string_tiShi'), $.i18n
					.prop('string_qingXuanZeYaoBingDanDeZhuoZi'));
			return;
		}
		var employeeId = $storeData.employee.id;
		showLoadingDialog($.i18n.prop('string_zhengZaiZhuanTai'));

		var targetDishOrderId = $dishOrderBriefByDeskIdMap[targetDesk.id].dishOrderId;
		$
				.ajax({
					type : 'POST',
					url : '../ordering/mergeDishOrder',
					data : {
						employeeId : employeeId,
						sourceDishOrderId : sourceDishOrderId,
						targetDishOrderId : targetDishOrderId
					},
					dataType : 'json',
					async : false,
					error : function(error) {
						hideLoadingDialog();
						showAlertDialog($.i18n.prop('string_cuoWu'),
								error.responseText);
					},
					success : function(dishOrder) {
						hideLoadingDialog();

						$curDishOrder.state = DISH_ORDER_STATE.CANCELLED;
						updateDishOrderCache($curDishOrder);

						updateDishOrderCache(dishOrder);

						deskView_DeskPicker.selectDesk(targetDesk);
						deskView_DeskSelectedCallback(targetDesk);
						mergeDishOrderDialog.close();
					}
				});
	}

	var mergeDishOrderCancelButton = $('<button>').addClass(
			"dishOrderCmdButton").text($.i18n.prop('string_quXiao')).appendTo(
			bottomDiv);
	$(mergeDishOrderCancelButton).click(function() {
		mergeDishOrderDialog.close();
	});

	mergeDishOrderDialog = $(dialogDiv).modal();

	new DeskPicker(deskGroupSelector, deskSelector,
			deskViewDialog_DeskSelectedCallback,
			DeskPicker.filter.occupiedDeskOnly, [ deskView_SelectedDesk ])
			.refreshUI();
	function deskViewDialog_DeskSelectedCallback(selectedDesk) {
		targetDesk = selectedDesk;
		if (targetDesk != null) {
			actionInfoDiv.text(deskView_SelectedDesk.name + " "
					+ $.i18n.prop('string_bingDao') + targetDesk.name);
		} else {
			actionInfoDiv.text(deskView_SelectedDesk.name);
		}
	}
}

function functionMenuButtonClick() {
	var dialogDiv = $('<div>').addClass("functionMenuDialog").attr("id",
			"functionMenuDialog").appendTo('body');

	var titlePanel = $("<div>").addClass("topPanel").text(
			$.i18n.prop('string_gongNengLieBiao')).appendTo(dialogDiv);

	var cancelDiv = $('<div>').addClass("cancelDiv").text("×").appendTo(
			dialogDiv);
	var functionMenuButtonSelector = $("<div>").addClass(
			"overthrow functionMenuButtonSelector").appendTo(dialogDiv);
	var controlPanelDiv = $("<div>").addClass("controlPanel").appendTo(
			dialogDiv);

	var dishOrderFieldset = $("<fieldset>").attr("id", "reportPanel").css(
			"margin-bottom", "1em").appendTo(functionMenuButtonSelector);
	$("<legend>").text("订单").appendTo(dishOrderFieldset);

	var dishOrderListButton = $("<div>").addClass(
			"ui-radius ui-shadow functionMenuButton").text("店内订单").appendTo(
			dishOrderFieldset);
	var bookingDishOrderListButton = $("<div>").addClass(
			"ui-radius ui-shadow functionMenuButton").text("自助订单列表").appendTo(
			dishOrderFieldset);
	var bookRecordListButton = $("<div>").addClass(
			"ui-radius ui-shadow functionMenuButton").text("预订记录列表").appendTo(
			dishOrderFieldset);

	var memberFieldset = $("<fieldset>").attr("id", "reportPanel").css(
			"margin-bottom", "1em").appendTo(functionMenuButtonSelector);
	$("<legend>").text("会员").appendTo(memberFieldset);

	var reportFieldset = $("<fieldset>").attr("id", "reportPanel").css(
			"margin-bottom", "1em");
	$("<legend>").text("报表").appendTo(reportFieldset);

	if ($storeData.employee.canViewReport) {
		reportFieldset.appendTo(functionMenuButtonSelector);
	}

	var systemFieldset = $("<fieldset>").attr("id", "reportPanel").css(
			"margin-bottom", "1em").appendTo(functionMenuButtonSelector);
	$("<legend>").text("系统").appendTo(systemFieldset);

	var editDishSoldoutButton = $("<div>").addClass(
			"ui-radius ui-shadow functionMenuButton").text("编辑菜品沽清");

	if (!$isDesktop) {
		var interfaceFieldset = $("<fieldset>").attr("id", "reportPanel").css(
				"margin-bottom", "1em").appendTo(functionMenuButtonSelector);
		$("<legend>").text("界面").appendTo(interfaceFieldset);
		$("<input>").attr("id", "showBlockDishCheckBox").attr("checked",
				$isBlock).attr("type", "checkbox").click(function() {
			$isBlock = this.checked;
			updateEmployeeInfo();
		}).appendTo(interfaceFieldset);
		$("<label>").attr("for", "showBlockDishCheckBox").text("方块显示菜品")
				.appendTo(interfaceFieldset);
	}

	// 財務報表
	$("<a>").css("text-decoration", "none").addClass(
			"ui-radius ui-shadow functionMenuButton").attr("href",
			"../reporting/classReporting?storeId=" + $storeId).attr("target",
			"_blank").text($.i18n.prop('string_caiWuBaoBiao')).appendTo(
			reportFieldset);

	// 銷售報表
	$("<a>").css("text-decoration", "none").addClass(
			"ui-radius ui-shadow functionMenuButton").attr(
			"href",
			"../reporting/dishCategorySellStats?startDate=&endDate=&storeId="
					+ $storeId).attr("target", "_blank").text(
			$.i18n.prop('string_xiaoShouBaoBiao')).appendTo(reportFieldset);

	// 添加报表列表 -->财务报表
	if ($storeData.employee.job === '店长' || $storeData.employee.job === '收银') {
		$("<a>").css("text-decoration", "none").addClass(
				"ui-radius ui-shadow functionMenuButton").attr(
				"href",
				"../member/memberOperatePage?storeId=" + $storeId
						+ "&&employeeId=" + $storeData.employee.id).attr(
				"target", "_blank").text("会员管理页面").appendTo(memberFieldset);
	}

	if ($storeData.employee.job === '店长') {
		$("<a>").css("text-decoration", "none").addClass(
				"ui-radius ui-shadow functionMenuButton").attr(
				"href",
				"../member/couponTemplateOperatePage?storeId=" + $storeId
						+ "&&employeeId=" + $storeData.employee.id).attr(
				"target", "_blank").text("优惠券管理页面").appendTo(memberFieldset);

		// 菜单编辑页面
		$("<a>").css("text-decoration", "none").addClass(
				"ui-radius ui-shadow functionMenuButton").attr("href",
				"../admin/dishManagementHome?storeId=" + $storeId).attr(
				"target", "_blank").text("数据管理页面").appendTo(systemFieldset);
	}

	if ($storeData.employee.job === '收银' || $storeData.employee.job === '店长') {
		var shiftClassButton = $("<div>").addClass(
				"ui-radius ui-shadow functionMenuButton").text(
				$.i18n.prop('string_jiaoBan')).appendTo(systemFieldset);
		shiftClassButton.click(function() {
			showShiftClassDialog();
			functionMenuPanelDialog.close();
		});
	}

	if ($storeData.employee.canCancelDishSoldOut)
		editDishSoldoutButton.appendTo(systemFieldset);

	var chooseTypeButton = $("<div>").addClass(
			"ui-radius ui-shadow functionMenuButton").text("更换操作页面").appendTo(
			systemFieldset);

	var logoutButton = $("<div>").addClass(
			"ui-radius ui-shadow functionMenuButton").text(
			$.i18n.prop('string_zhuXiaoDengLu')).appendTo(systemFieldset);

	var functionMenuPanelDialogCancelBtn = $('<button>').addClass(
			"operationButton").text($.i18n.prop('string_guanBiChuangKou'))
			.appendTo(controlPanelDiv);

	var functionMenuPanelDialog = $(dialogDiv).modal();

	var selectorTop = titlePanel.height() + 15;
	functionMenuButtonSelector.offset({
		top : selectorTop,
		left : 5
	});

	cancelDiv.click(function() {
		functionMenuPanelDialog.close();
	});

	dishOrderListButton.click(function() {
		dishOrderListButtonClick();
		functionMenuPanelDialog.close();
	});

	bookingDishOrderListButton.click(function() {
		isSearchBookingDishOrder = true;
		dishOrderListButtonClick();
		functionMenuPanelDialog.close();
	});

	bookRecordListButton.click(function() {
		isSearchBookRecord = true;
		bookingRecordsButtonClick();
		functionMenuPanelDialog.close();
	});

	chooseTypeButton.click(function() {
		window.location.href = '../chooseType';
	});

	editDishSoldoutButton.click(function() {
		functionMenuPanelDialog.close();
		switchToView('EDIT_DISH_VIEW');
	});

	logoutButton.click(function() {
		window.location.href = '../j_spring_security_logout';
	});

	functionMenuPanelDialogCancelBtn.click(function() {
		functionMenuPanelDialog.close();
	});
}

function updateEmployeeInfo() {
	$.ajax({
		type : 'POST',
		url : "../storeData/updateEmployeeIsBlock",
		data : {
			employeeId : $storeData.employee.id,
			isBlock : $isBlock
		},
		error : function(error) {
		},
		success : function(employee) {
			if (employee == null) {
				showAlertDialog("错误", "更新信息出错!");
				return;
			}
			$storeData.employee = employee;
			$("#showBlockDishCheckBox").attr("checked",
					employee.isShowBlockDishView);
		}
	});
}

function isDemo() {
	if (location.href.indexOf("127.0.0.1", 0) != -1
			|| location.href.indexOf("localhost", 0) != -1)
		return true;
	return false;
}

function reprintCustomerNoteButtonClick() {
	if (!$curDishOrder) {
		showAlertDialog($.i18n.prop('string_cuoWu'), $.i18n
				.prop('string_dangQianDingDanWeiKongWuFaDaYin'));
	} else {
		if ($isDesktop && $needEmployeeCheck)
			showEmployeeLoginDialog(checkingCustomerNotePrinters,
					postToReprintCustomerNote);
		else
			checkingCustomerNotePrinters(postToReprintCustomerNote);
	}
}

function printCustomerNoteButtonClick() {
	if (!$curDishOrder) {
		showAlertDialog($.i18n.prop('string_cuoWu'), $.i18n
				.prop('string_dangQianDingDanWeiKongWuFaDaYin'));
	} else {
		if ($isDesktop && $needEmployeeCheck)
			showEmployeeLoginDialog(checkingCustomerNotePrinters,
					postToPrintCustomerNote);
		else
			checkingCustomerNotePrinters(postToPrintCustomerNote);
	}
}

function checkingCustomerNotePrinters(callBack, dishOrder) {

	if (deskView_SelectedDesk != null && deskView_SelectedDesk != "") {
		if (deskView_SelectedDesk.posPrinterId != ""
				&& deskView_SelectedDesk.posPrinterId > 0) {
			callBack(deskView_SelectedDesk.posPrinterId, dishOrder);
			return;
		}
	}

	showLoadingDialog('正在提交...');
	$.ajax({
		url : '../printing/getCNPrintersByStoreId/' + $storeId,
		type : 'GET',
		timeout : 20000,
		error : function() {
			hideLoadingDialog();
			showAlertDialog("错误", "网络连接出错!请检查网络后再试!");
		},
		success : function(cnprinters) {
			hideLoadingDialog();
			if (cnprinters.length > 1) {
				var printerId = null;
				var posPrinterPanel = $("<div>").addClass("singleChoicePanel")
						.appendTo("body");
				$("<div>").text($.i18n.prop('string_louMianDaYingJiXuanZe'))
						.addClass("caption").appendTo(posPrinterPanel);
				var dialog = $(posPrinterPanel).modal();
				var contentDiv = $("<div>")
						.addClass("orderItemCmdPanelContent").addClass(
								"overthrow").appendTo(posPrinterPanel);
				for ( var i in cnprinters) {
					var printer = cnprinters[i];
					var printerItemDiv = $("<div>").attr("name",
							"printerItemDiv").data("printerId", printer.id)
							.addClass("singleChoiceItem").text(printer.name)
							.click(printerItemDivClick);

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
				var bottomDiv = $("<div>").addClass(
						"orderItemCmdPanelBottomDiv");
				bottomDiv.appendTo(posPrinterPanel);

				$("<a>").text($.i18n.prop('string_queDing')).addClass("button")
						.click(function() {
							dialog.close();
							callBack(printerId, dishOrder);
						}).appendTo(bottomDiv);
			} else if (cnprinters.length == 1) {
				callBack(cnprinters[0].id, dishOrder);
			} else {
				callBack(null, dishOrder);
			}
		}
	});
}

function postToReprintCustomerNote(printerId) {

	showLoadingDialog($.i18n.prop('string_zhengZaiTiJiaoDaYin'));

	$.ajax({
		type : 'POST',
		url : '../ordering/reprintCustomerNote',
		data : {
			dishOrderId : $curDishOrder.id,
			printerId : printerId
		},

		error : function() {
			hideLoadingDialog();
			showAlertDialog($.i18n.prop('string_yuDaJieZhangDan'), $.i18n
					.prop('string_daYingShiBaiQingShaoHouZaiShi'));
		},
		success : function() {
			hideLoadingDialog();
			updateDeskPanel();
			showAlertDialog($.i18n.prop('string_yuDaJieZhangDan'), $.i18n
					.prop('string_yiTiJiaoDaYinJiDaYin'));
		}
	});
}

function postToPrintCustomerNote(printerId) {

	showLoadingDialog($.i18n.prop('string_zhengZaiTiJiaoDaYin'));

	$.ajax({
		type : 'POST',
		url : '../ordering/printCustomerNote',
		data : {
			dishOrderId : $curDishOrder.id,
			employeeId : $storeData.employee.id,
			printerId : printerId
		},

		error : function() {
			hideLoadingDialog();
			showAlertDialog($.i18n.prop('string_daLouMianDan'), $.i18n
					.prop('string_daYingShiBaiQingShaoHouZaiShi'));
		},
		success : function(dishOrder) {
			hideLoadingDialog();
			if (dishOrder) {
				updateDishOrderCache(dishOrder);
				updateDeskPanel();
				showAlertDialog($.i18n.prop('string_daLouMianDan'), $.i18n
						.prop('string_yiTiJiaoDaYinJiDaYin'));
			} else
				showAlertDialog($.i18n.prop('string_daLouMianDan'),
						"打印出错!请刷新后再试!");
		}
	});
}

function setBookRecordReminders() {
	$('#bookingRecordsButton').hide();
	if ($bookingRecords.length > 0) {
		$('#bookingRecordsButton').show();
		$('#bookingRecordsButton').text($bookingRecords.length + " 预");
	}
	if (!isSearchBookRecord) {
		renderBookRecordContentDiv($('#bookRecordListPanel'), $bookingRecords);
	}
}

function setSelfDishOrderReminders() {
	$('#selfDishOrdersButton').hide();
	if ($selfDishOrders.length > 0) {
		$('#selfDishOrdersButton').show();
		$('#selfDishOrdersButton').text($selfDishOrders.length + " 自");
	}
}

function selfDishOrdersButtonClick() {
	isShowSelfDishOrder = true;
	dishOrderListButtonClick();
}

function bookingRecordsButtonClick() {
	var dialogDiv = $('<div>').addClass("functionMenuDialog").attr("id",
			"functionMenuDialog").appendTo('body');

	var bookingRecordsDialog = $(dialogDiv).modal();

	var titlePanel = $("<div>").addClass("topPanel").appendTo(dialogDiv);
	var searchInputPanel = $('<div>').css("width", "75%").css("display",
			"inline-block").css("padding-right", "2em");
	var titleOperatePanel = $('<div>').css("display", "inline-block");

	if (isSearchBookRecord) {
		var searchBookRecordSelect = $('<select>').appendTo(titlePanel).change(
				function() {
					var selected = $(this).val();

					if (selected == 0) {
						option1.show();
						option2.hide();
					} else {
						option2.show();
						option1.hide();
					}
				});
		$('<option>').val(0).text("按卡号或号码搜索").appendTo(searchBookRecordSelect);
		$('<option>').val(1).text("按订日期搜索").appendTo(searchBookRecordSelect);
		var option1 = $('<div>').css("width", "70%").css("display",
				"inline-block").appendTo(titlePanel);
		searchInputPanel.appendTo(option1);
		titleOperatePanel.appendTo(option1);

		var option2 = $('<div>').css("width", "70%").css("display",
				"inline-block").appendTo(titlePanel);
		option2.hide();

		var starTimeInput = $('<input>').attr("onclick",
				"new Calendar().show(this);").val(
				new Date().getFullYear() + "-" + (new Date().getMonth() + 1)
						+ "-" + new Date().getDate()).appendTo(option2);
		$('<span>').text(" 至 ").appendTo(option2);
		var endTimeInput = $('<input>').attr("onclick",
				"new Calendar().show(this);").appendTo(option2);

		$('<button>').addClass("button").text($.i18n.prop('string_souSuo'))
				.css("margin-left", " 3em").click(function() {
					var starTime = starTimeInput.val().trim();
					var endTime = endTimeInput.val().trim();

					if (starTime == "") {
						alert("请输入有效的起始日期!");
						return;
					}
					searchBookRecordsByDate(starTime, endTime);
				}).appendTo(option2);

	} else {
		titlePanel.text("预订记录");
	}

	var searchInput = $('<input>').addClass(
			"ui-input ui-border-solid ui-shadow ui-radius searchInput").attr(
			"placeholder", "输入完整的会员卡号或电话号码").appendTo(searchInputPanel);

	var searchButton = $('<button>').addClass("button").text(
			$.i18n.prop('string_souSuo')).appendTo(titleOperatePanel);

	$('<div>').addClass("cancelDiv").text("×").click(function() {
		isSearchBookRecord = false;
		bookingRecordsDialog.close();
	}).appendTo(dialogDiv);

	var controlPanelDiv = $("<div>").addClass("controlPanel").appendTo(
			dialogDiv);
	$('<button>').addClass("operationButton").text(
			$.i18n.prop('string_guanBiChuangKou')).click(function() {
		isSearchBookRecord = false;
		bookingRecordsDialog.close();
	}).appendTo(controlPanelDiv);

	var contentDiv = $("<div>").attr("id", "bookRecordListPanel").addClass(
			"overthrow dishOrderListPanel").appendTo(dialogDiv);
	var selectorTop = titlePanel.height() + 25;
	contentDiv.offset({
		top : selectorTop,
		left : 5
	});

	searchButton.click(function() {
		var searchStr = searchInput.val();
		if (!isNaN(searchStr) && Number(searchStr) != 0) {
			searchBookRecords(searchStr.trim());
		} else {
			alert("请输入正确的信息");
		}
	});
	contentDiv.empty();
	renderBookRecordContentDiv(contentDiv, $bookingRecords);
}

function searchBookRecords(searchStr) {
	var bookRecordListPanel = $('#bookRecordListPanel');
	bookRecordListPanel.html("");
	$.ajax({
		type : 'POST',
		url : '../book/getBookRecordsByPhoneOrMemberCartNo',
		data : {
			storeId : $storeData.store.id,
			searchStr : searchStr
		},
		dataType : 'json',
		async : false,
		error : function() {
		},
		success : function(bookRecords) {
			if (bookRecords != null && bookRecords.length > 0) {
				renderBookRecordContentDiv(bookRecordListPanel, bookRecords);
			} else {
				alert("查询不到订单信息!请确保输入的信息无误!");
			}
		}
	});
}

function searchBookRecordsByDate(starTime, endTime) {
	var bookRecordListPanel = $('#bookRecordListPanel');
	bookRecordListPanel.html("");
	$.ajax({
		type : 'POST',
		url : '../book/getBookRecordsByDate',
		data : {
			storeId : $storeData.store.id,
			starTime : starTime,
			endTime : endTime
		},
		dataType : 'json',
		async : false,
		error : function() {
		},
		success : function(bookRecords) {
			if (bookRecords != null && bookRecords.length > 0) {
				renderBookRecordContentDiv(bookRecordListPanel, bookRecords);
			} else {
				alert("查询不到订单信息!请确保输入的信息无误!");
			}
		}
	});
}

function renderBookRecordContentDiv(contentDiv, bookingRecords) {
	contentDiv.empty();
	var size = 0;
	for ( var i in bookingRecords) {
		var bookRecord = bookingRecords[i];
		if (bookRecord.state == 1) {
			size++;
		}
		if (bookRecord.state != 1 && !isSearchBookRecord) {
			continue;
		}
		var bookRecordDiv = $('<div>').addClass("bookRecordDiv").appendTo(
				contentDiv);

		var OrderItemListDiv = $('<div>').addClass("dishOrderItemListPanel")
				.appendTo(contentDiv);

		if (bookRecord.dishOrder != null
				&& bookRecord.dishOrder.orderItems != null) {
			for ( var i in bookRecord.dishOrder.orderItems) {
				var orderItem = bookRecord.dishOrder.orderItems[i];
				$('<div>').addClass("button orderItem")
						.text(orderItem.dishName).appendTo(OrderItemListDiv);
			}
		}

		var bookRecordCaptionHtml = new StringBuilder();

		bookRecordCaptionHtml.append([
				" " + $.i18n.prop('string_xingMing') + ":",
				bookRecord.contactName ]);
		bookRecordCaptionHtml.append([
				" " + $.i18n.prop('string_dianHua') + ":",
				bookRecord.contactTel ]);
		bookRecordCaptionHtml.append([ " 人数:", bookRecord.count ]);
		bookRecordCaptionHtml.append([ " 预计到点时间:",
				bookRecord.expectedArriveTimeToStr ]);
		bookRecordCaptionHtml.append([ " 类型:", bookRecord.resourceName ]);

		if (bookRecord.memo != "" && bookRecord.memo != null) {
			bookRecordCaptionHtml.append([ " 备注:", bookRecord.memo ]);
		}

		if (bookRecord.isServingArrived) {
			bookRecordCaptionHtml.append([ " 到店自动上菜" ]);
		}

		$('<div>').addClass("bookRecordCaptionPanel").html(
				bookRecordCaptionHtml.toString()).appendTo(bookRecordDiv);
		var bookRecordOperationPanel = $('<div>').addClass(
				"bookRecordOperationPanel").appendTo(bookRecordDiv);

		if (bookRecord.state == BOOK_RECORD_STATE.BOOKING) {
			$("<button>").data("bookRecord", bookRecord).data("isSure", true)
					.addClass("button").text("确定").click(buttonClick).appendTo(
							bookRecordOperationPanel);

			$("<button>").data("bookRecord", bookRecord).data("isSure", false)
					.addClass("button").text("取消").click(buttonClick).appendTo(
							bookRecordOperationPanel);
		} else if (bookRecord.state == BOOK_RECORD_STATE.CANCELLED) {
			bookRecordOperationPanel.text("已取消");
		} else if (bookRecord.state == BOOK_RECORD_STATE.CONFIRMED) {
			bookRecordOperationPanel.text("已确认");
		}
	}

	if (size > 0) {
		$('#bookingRecordsButton').text(size + " 预");
	} else {
		$('#bookingRecordsButton').hide();
	}

	function buttonClick() {
		var bookRecord = $(this).data("bookRecord");
		var isSuer = $(this).data("isSure");
		$
				.ajax({
					type : "POST",
					url : '../book/operatedBookrecord',
					data : {
						bookRecordId : bookRecord.id,
						employeeId : $storeData.employee.id,
						isSure : isSuer
					},
					error : function(error) {
						showAlertDialog($.i18n.prop('string_cuowu'),
								"更新预订记录出错!请稍后再试!!");
					},
					success : function(result) {
						if (result) {
							if (isSuer) {
								bookRecord.state = 2;
							} else {
								bookRecord.state = 0;
							}
							renderBookRecordContentDiv(contentDiv,
									bookingRecords);
							return;
						}
						showAlertDialog($.i18n.prop('string_cuowu'),
								"更新预订记录出错!请稍后再试!!");
					}
				});
	}
}

function restoreBookingDishOrder() {

	$.ajax({
		type : 'POST',
		url : "../ordering/restoreBookingDishOrder",
		data : {
			employeeId : $storeData.employee.id,
			dishOrderId : $curDishOrder.id,
			storeId : $storeId
		},
		dataType : 'json',
		error : function(error) {
			hideLoadingDialog();

			if (error.status == 403) {
				showAlertDialog($.i18n.prop('string_cuoWu'), "权限不足,无法进行操作!");
				return;
			}
			showAlertDialog($.i18n.prop('string_cuoWu'), error.responseText);
		},
		success : function(dishOrder) {
			hideLoadingDialog();
			$("#cancelDishOrderButton", "#dishView").text(
					$.i18n.prop('string_quXiao'));

			if (isShowSelfDishOrder) {
				updateDynamicData();
			}

			$dishOrderBriefByDeskIdMap[$curDishOrder.deskId] = null;
			updateDishOrderCache(dishOrder);
			$curDishOrder = null;
			isSearchBookingDishOrder = false;
			isShowSelfDishOrder = false;
			switchToView("DESK_VIEW");
		}
	});
}

var $curPaymentTypeId;
var $curCustomer;
var $isSubmitCheckout = false;

function initCheckoutView() {
	$("#confirmCheckoutButton").click(prepareToSubmitCheckout);
	$("#cancelCheckoutButton").click(function() {
		switchToView('DESK_VIEW');
	});

	$("#bindMemberButton").click(showSearchMemberDialog);

	$("#paymentTypes").delegate(
			"[name='payAmountLabel']",
			"click",
			function() {
				$curPaymentTypeId = this.id;
				if ($curPaymentTypeId != "paymentTypeLabel_coupon") {
					showAmountDialog($.i18n.prop('string_jinE'),
							closePaymentTypeDialog, $(this).text());
				}
			});
}

function showCheckoutView() {

	$curCustomer = null;
	if ($curDishOrder != null) {
		if ($curDishOrder.userAccountId) {
			$curCustomer = $.ajax({
				url : "../member/getMemberById",
				data : {
					userAccountId : $curDishOrder.userAccountId
				},
				type : "POST",
				dataType : 'json',
				async : false
			}).responseJSON;
			if ($curCustomer != null) {
				if (!$customerCouponTemplateListMap[$curCustomer.id]
						|| $customerCouponTemplateListMap[$curCustomer.id] == []) {
					$customerCouponTemplateListMap[$curCustomer.id] = [];
					$customerCouponTemplateListMap[$curCustomer.id]
							.push($storeData.couponTemplates);
				}
				if ($curDishOrder.discountRate == 1
						&& $curCustomer.discountRate != 1) {
					$curDishOrder.discountRate = $curCustomer.discountRate;
					changeDiscountRateOrServiceFeeRate();
				}
			}
		}
	}
	drawCheckoutInfos();
	$("#checkoutView").show();
}

function drawCheckoutInfos() {

	var deskInfoDiv = $("#deskInfo");
	var paymentTypesDiv = $("#paymentTypes");
	var priceInfoDiv = $("#priceInfo");
	var discountRateDiv = $("#discountRate");
	var serviceFeeRateDiv = $("#serviceFeeRate");
	var dishOrderItemList = $("#dishOrderItemList", "#checkoutView");

	$('#actualPayDiv').empty();
	$("#dishOrderMemoInput").val("");
	$('#userAccountInfo').empty();
	deskInfoDiv.empty();
	paymentTypesDiv.empty();
	priceInfoDiv.empty();
	discountRateDiv.empty();
	serviceFeeRateDiv.empty();

	$('<span>').text($.i18n.prop('string_yuanJia')).appendTo(priceInfoDiv);
	var totalPriceLabel = $('<label>').attr("id", "checkout_totalPriceLabel")
			.addClass("dishOrderDetailLabel").appendTo(priceInfoDiv);

	$('<span>').text($.i18n.prop('string_yingShou')).appendTo(priceInfoDiv);
	var finalPriceLabel = $('<label>').attr("id", "finalPriceLabel").addClass(
			"dishOrderDetailLabel").appendTo(priceInfoDiv);

	discountRateDiv.text($.i18n.prop('string_zheKouLv'));
	var discountRateRadio = $('<label>').addClass("button paymentType").css(
			"width", "2em").text("1").click(showDiscountRateDialog).appendTo(
			discountRateDiv);

	serviceFeeRateDiv.text($.i18n.prop('string_fuWuFeiLv'));
	var serviceFeeRateRadio = $('<label>').addClass("button paymentType").css(
			"width", "2em").css("display", "inline-block").text("0").click(
			showServiceFeeRateDialog).appendTo(serviceFeeRateDiv);

	if ($curDishOrder != null) {

		if ($curDishOrder.prePay != null && $curDishOrder.prePay > 0) {
			$('<span>').text("预付").appendTo(priceInfoDiv);
			$('<label>').text($curDishOrder.prePay).addClass(
					"dishOrderDetailLabel").appendTo(priceInfoDiv);
		}

		new CustomerInfoPicker($('#userAccountInfo'));
		var dishOrderId = $.trim($curDishOrder.id);
		var dishOrderBriefId = $.i18n.prop('string_danHao')
				+ '：'
				+ dishOrderId.substring(dishOrderId.length - 4,
						dishOrderId.length);
		if (deskView_SelectedDesk != null) {
			$("<span>").text(
					deskView_SelectedDesk.name + " "
							+ $curDishOrder.customerCount
							+ $.i18n.prop('string_ren') + dishOrderBriefId)
					.appendTo(deskInfoDiv);
		}

		if ($curDishOrder.discountRate != null)
			discountRateRadio.text($curDishOrder.discountRate);

		if ($curDishOrder.serviceFeeRate != null)
			serviceFeeRateRadio.text($curDishOrder.serviceFeeRate);

		totalPriceLabel.text($curDishOrder.totalPrice);
		finalPriceLabel.text($curDishOrder.finalPrice);
	} else {
		totalPriceLabel.text("0.0");
		finalPriceLabel.text("0.0");
	}

	var couponValue = getDishOrderCouponValue($curDishOrder);
	var amountToPay = $curDishOrder.finalPrice - couponValue;

	if (couponValue > $curDishOrder.finalPrice) {
		amountToPay = 0;
	}

	var isFirstPaymentType = true;
	for ( var i in $storeData.paymentTypes) {
		var paymentType = $storeData.paymentTypes[i];
		var paymentTypeDiv = $('<div>').text(paymentType.name + ":");
		var payAmountLabel = $('<label>').text("0.0").attr("id",
				"payAmountLabel" + paymentType.id).attr("name",
				"payAmountLabel").data("paymentType", paymentType).addClass(
				"button paymentType").appendTo(paymentTypeDiv);

		$('<div>').addClass("button").click(payAllButtonClick).data(
				"paymentType", paymentType).css("margin-left", "5px").text(
				$.i18n.prop('string_quanBu')).appendTo(paymentTypeDiv);

		$('<div>').addClass("button").click(payRemainButtonClick).data(
				"paymentType", paymentType).css("margin-left", "5px").text(
				$.i18n.prop('string_yuE')).appendTo(paymentTypeDiv);

		if (isFirstPaymentType) {
			payAmountLabel.text(amountToPay.toFixed(1));
			isFirstPaymentType = false;
		}
		paymentTypeDiv.appendTo(paymentTypesDiv);
	}

	if ($curCustomer && $curCustomer.balance > 0) {

		var paymentType = {
			id : 0,
			name : "会员卡余额",
			exchangeRate : 1,
			isPrepaid : false
		};
		var paymentTypeDiv = $('<div>').text(paymentType.name + ":");
		$('<label>').text("0.0").attr("id", "payAmountLabel" + paymentType.id)
				.attr("name", "payAmountLabel")
				.data("paymentType", paymentType)
				.addClass("button paymentType").appendTo(paymentTypeDiv);

		$('<div>').addClass("button").click(payAllButtonClick).data(
				"paymentType", paymentType).css("margin-left", "5px").text(
				$.i18n.prop('string_quanBu')).appendTo(paymentTypeDiv);

		$('<div>').addClass("button").click(payRemainButtonClick).data(
				"paymentType", paymentType).css("margin-left", "5px").text(
				$.i18n.prop('string_yuE')).appendTo(paymentTypeDiv);

		paymentTypeDiv.appendTo(paymentTypesDiv);
	}

	function payRemainButtonClick() {

		var paymentType = $(this).data("paymentType");
		var payAmountLabel = $("#payAmountLabel" + paymentType.id, $(this)
				.parent());
		payAmountLabel.text("0.0");

		var otherPaid = 0;
		$("[name='payAmountLabel']").each(
				function() {
					otherPaid += parseFloat($(this).text())
							* $(this).data("paymentType").exchangeRate;
				});
		otherPaid += couponValue;
		if ($curDishOrder != null) {
			if ($curDishOrder.finalPrice > otherPaid) {
				var amountToPay = ($curDishOrder.finalPrice - otherPaid)
						/ paymentType.exchangeRate;
				payAmountLabel.text(amountToPay.toFixed(1));
				if (paymentType.id == 0 && $curCustomer.balance < amountToPay) {
					payAmountLabel.text($curCustomer.balance.toFixed(1));
				}
			}
		}
		updateActualPaidLabel();
	}

	function payAllButtonClick() {

		var paymentType = $(this).data("paymentType");
		var payAmountLabel = $("#payAmountLabel" + paymentType.id, $(this)
				.parent());

		if ($curDishOrder != null) {
			var amountToPay = getMoneyToPayForDishOrder($curDishOrder)
					/ paymentType.exchangeRate;
			$("[name='payAmountLabel']").text("0.0");
			if (amountToPay > 0) {
				payAmountLabel.text(amountToPay.toFixed(1));
			}

			if (paymentType.id == 0 && $curCustomer.balance < amountToPay) {
				payAmountLabel.text($curCustomer.balance.toFixed(1));
			}
			updateActualPaidLabel();
		}
	}

	if (couponValue > 0) {
		$('<div>').text(
				$.i18n.prop('string_youHuiQuan') + couponValue.toFixed(1))
				.appendTo(paymentTypesDiv);
	}

	$('<span>').text($.i18n.prop('string_shiFu')).appendTo($('#actualPayDiv'));
	$('<label>').attr("id", "actualPaidLabel").addClass("dishOrderDetailLabel")
			.appendTo("#actualPayDiv");
	updateActualPaidLabel();

	new OrderItemList(null, null, dishOrderItemList, drawCheckoutInfos)
			.render();
}

function updateActualPaidLabel() {
	var actualPaid = 0;
	var couponValue = getDishOrderCouponValue($curDishOrder);
	$("[name='payAmountLabel']").each(
			function() {
				actualPaid += parseFloat($(this).text())
						* $(this).data("paymentType").exchangeRate;
			});
	actualPaid += couponValue;
	$("#actualPaidLabel").text(actualPaid.toFixed(1));
}

function showDiscountRateDialog() {
	showNamedValueDialog("discountRate", $storeData.discountRates, 1);
}

function showServiceFeeRateDialog() {
	showNamedValueDialog("serviceFeeRate", $storeData.serviceFeeRates, 0);
}

function showNamedValueDialog(name, rates, defaultRate) {
	var ratePanel = $("<div>").addClass("singleChoicePanel").appendTo("body");

	var dialog = $(ratePanel).modal();

	var contentDiv = $("<div>").addClass("orderItemCmdPanelContent").addClass(
			"overthrow").appendTo(ratePanel);

	for ( var i in rates) {
		var rate = rates[i];

		var backgroundColor = "";
		if (name == "discountRate") {
			if ($curDishOrder.discountRate == rate.value) {
				backgroundColor = "#6AA1D8";
			}
		} else if (name == "serviceFeeRate") {
			if ($curDishOrder.serviceFeeRate == rate.value) {
				backgroundColor = "#6AA1D8";
			}
		}

		var discountRateItemDiv = $("<div>").attr("name", "rateItemDiv").css(
				"background-color", backgroundColor).data("rateValue",
				rate.value).addClass("singleChoiceItem").text(rate.name).click(
				rateItemDivClick);
		discountRateItemDiv.appendTo(contentDiv);
	}

	$("<div>").attr("name", "rateItemDiv").css("background-color",
			$curDishOrder.discountRate ? "" : "#6AA1D8").addClass(
			"singleChoiceItem").data("rateValue", defaultRate).text(
			"(" + $.i18n.prop('string_wu') + ")").click(rateItemDivClick)
			.appendTo(contentDiv);

	function rateItemDivClick() {
		$("div[name='rateItemDiv']").removeAttr("style");
		$(this).css("background-color", "#6AA1D8");
		if (name == "discountRate") {
			$curDishOrder.discountRate = Number($(this).data("rateValue"));
		} else if (name == "serviceFeeRate") {
			$curDishOrder.serviceFeeRate = Number($(this).data("rateValue"));
		}
	}

	var bottomDiv = $("<div>").addClass("orderItemCmdPanelBottomDiv");
	bottomDiv.appendTo(ratePanel);

	$("<a>").text($.i18n.prop('string_queDing')).addClass("button").click(
			function() {
				dialog.close();
				changeDiscountRateOrServiceFeeRate();
			}).appendTo(bottomDiv);
}

function changeDiscountRateOrServiceFeeRate() {
	$.ajax({
		url : "../ordering/changeDiscountRateOrServiceFeeRate",
		data : {
			employeeId : $storeData.employee.id,
			dishOrderJsonText : JSON.stringify($curDishOrder)
		},
		type : "POST",
		dataType : 'json',
		async : false,
		error : function(error) {
			showAlertDialog($.i18n.prop('string_cuoWu'), error.responseText);
		},
		success : function(dishOrder) {
			if (dishOrder) {
				$curDishOrder = dishOrder;
				drawCheckoutInfos();
				return;
			}
			showAlertDialog($.i18n.prop('string_cuoWu'), "更新订单出错!请刷新后重试!");
		}
	});
}

function closePaymentTypeDialog(result) {

	$("#" + $curPaymentTypeId).html(result);
	updateActualPaidLabel();
	$("#dialog-digitKeyboard").hide();
	$("#dialogBackground").hide();
}

function prepareToSubmitCheckout() {
	var actualPaid = 0;
	var couponValue = getDishOrderCouponValue($curDishOrder);
	$("[name='payAmountLabel']").each(
			function() {
				actualPaid += parseFloat($(this).text())
						* $(this).data("paymentType").exchangeRate;
			});
	actualPaid += couponValue;

	if (!$curDishOrder)
		return;

	if ($curDishOrder.finalPrice != actualPaid) {
		showConfirmDialog("提示", "应收金额 : " + $curDishOrder.finalPrice
				+ " ,实收金额 : " + actualPaid + " <br>实收差价 : "
				+ (actualPaid - $curDishOrder.finalPrice) + " ,是否确定结账?",
				submitCheckOut);
	} else
		submitCheckOut();
}
function submitCheckOut() {

	if ($isSubmitCheckout)
		return;

	$isSubmitCheckout = true;

	showLoadingDialog($.i18n.prop('string_tiJiaoZhong'));

	var memo = $.trim($("#dishOrderMemoInput").val());
	var memberId = "";

	if ($curDishOrder != null) {
		$curDishOrder.payRecords = [];
		$("[name='payAmountLabel']").each(function() {

			var paymentType = $(this).data("paymentType");
			var amount = parseFloat($(this).text());
			if (amount > 0) {
				var payRecord = {};
				payRecord.paymentTypeId = paymentType.id;
				payRecord.typeName = paymentType.name;
				payRecord.exchangeRate = paymentType.exchangeRate;
				payRecord.amount = amount;
				payRecord.isPrepaid = false;
				$curDishOrder.payRecords.push(payRecord);
			}
		});

		if ($curDishOrder.prePay > 0) {
			var prePayRecord = {};
			prePayRecord.paymentTypeId = 1;
			prePayRecord.typeName = "预付款";
			prePayRecord.exchangeRate = 1;
			prePayRecord.amount = $curDishOrder.prePay;
			prePayRecord.isPrepaid = false;
			$curDishOrder.payRecords.push(prePayRecord);
		}

		if (memo != "" && memo != null) {
			$curDishOrder.memo = memo;
			memo.value = "";
		}

		if ($curCustomer) {
			memberId = $curCustomer.id;
		}

		var isCheckCouponsState = false;
		$
				.ajax({
					url : "../ordering/updateCouponsState",
					data : {
						couponRecordsJsonText : JSON
								.stringify($curDishOrder.payRecords),
						memberId : memberId,
						employeeId : $storeData.employee.id,
						dishOrderId : $curDishOrder.id,
						storeId : $storeId
					},
					type : "POST",
					dataType : 'json',
					async : false,
					error : function(error) {
						$isSubmitCheckout = false;
						hideLoadingDialog();
						if (error.status == 403) {
							showAlertDialog($.i18n.prop('string_cuoWu'),
									"权限不足,无法进行操作!");
							return;
						}
						showAlertDialog($.i18n.prop('string_cuoWu'),
								error.responseText);
					},
					success : function(result) {
						$isSubmitCheckout = false;
						isCheckCouponsState = result;
						if (!result) {
							hideLoadingDialog();
							showAlertDialog($.i18n.prop('string_cuoWu'),
									"当前优惠券有些已被使用或会员卡余额不足!");
							$curDishOrder.payRecords = [];
							showCheckoutView();
						}
					}
				});

		if (!isCheckCouponsState) {
			return;
		}

		var postData = {
			employeeId : $storeData.employee.id,
			dishOrderJsonText : JSON.stringify($curDishOrder)
		};
		$
				.ajax({
					url : "../ordering/payDishOrder",
					type : "POST",
					data : postData,
					dataType : 'json',
					error : function(error) {
						$isSubmitCheckout = false;
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
						$isSubmitCheckout = false;
						hideLoadingDialog();
						if (dishOrder != "" && dishOrder != null)
							updateDishOrderCache(dishOrder);

						switchToView("DESK_VIEW");
					}
				});
	} else {
		$isSubmitCheckout = false;
		switchToView("DESK_VIEW");
	}
}

function showSearchMemberDialog() {
	var dialogDiv = $('<div>').addClass("dishOrderListDialog").attr("id",
			"searchMemberDialog").appendTo('body');
	var titlePanel = $("<div>").addClass("topPanel ui-shadow").appendTo(
			dialogDiv);
	var cancelDiv = $('<div>').addClass("cancelDiv").text("×").appendTo(
			dialogDiv);
	var memberListPanel = $("<div>").addClass("overthrow dishOrderListPanel")
			.appendTo(dialogDiv);
	var controlPanelDiv = $("<div>").addClass("controlPanel").appendTo(
			dialogDiv);

	$('<label>').text(
			$.i18n.prop('string_qingShuRuHuiYuanKaHaoHuoDianHuaHaoMa') + ":")
			.appendTo(titlePanel);
	var searchInputPanel = $('<div>').addClass("searchInputPanel").css(
			"display", "inline-block").appendTo(titlePanel);
	var searchInput = $('<input>').addClass(
			"ui-input ui-border-solid ui-shadow ui-radius searchInput")
			.appendTo(searchInputPanel);

	var titleOperatePanel = $('<div>').addClass("titleOperatePanel").appendTo(
			titlePanel);
	var searchButton = $('<button>').addClass(
			"showDishOrderAllButton button right").text(
			$.i18n.prop('string_souSuo')).appendTo(titleOperatePanel);

	var memberListDialogCancelBtn = $('<button>').addClass("operationButton")
			.text($.i18n.prop('string_guanBiChuangKou')).appendTo(
					controlPanelDiv);

	var searchMemberDialog = $(dialogDiv).modal();

	var selectorTop = titlePanel.height() + 10;
	memberListPanel.offset({
		top : selectorTop,
		left : 5
	});

	cancelDiv.click(function() {
		searchMemberDialog.close();
	});

	memberListDialogCancelBtn.click(function() {
		searchMemberDialog.close();
	});

	searchButton
			.click(function() {
				var searchStr = searchInput.val();
				if (!isNaN(searchStr) && Number(searchStr) != 0) {
					searchMember(searchStr.trim());
				} else {
					alert($.i18n
							.prop('string_qingShuRuZhengQueDeHuiYuanKaHaoHuoDianHuaHaoMa'));
				}
			});

	memberListPanel.delegate(".chooseMember", "click", function() {
		$curCustomer = $(this).data("member");
		if ($curCustomer != null) {

			if (!$customerCouponTemplateListMap[$curCustomer.id]
					|| $customerCouponTemplateListMap[$curCustomer.id] == []) {
				$customerCouponTemplateListMap[$curCustomer.id] = [];
				$customerCouponTemplateListMap[$curCustomer.id]
						.push($storeData.couponTemplates);
			}

			$curDishOrder.userAccountId = $curCustomer.id;
			if ($curCustomer.discountRate != 1) {
				$curDishOrder.discountRate = $curCustomer.discountRate;
				changeDiscountRateOrServiceFeeRate();
			}
			drawCheckoutInfos();
		}
		searchMemberDialog.close();
	});

	function searchMember(submitStr) {
		memberListPanel.html("");
		$.ajax({
			type : 'POST',
			url : '../member/getMemberListByPhoneOrCardNo',
			data : {
				submitStr : submitStr,
				storeId : $storeId
			},
			dataType : 'json',
			async : false,
			error : function() {
			},
			success : function(memberList) {
				if (memberList != null) {
					renderMembers(memberListPanel, memberList);
				}
			}
		});
	}

	function renderMembers(memberListPanel, memberList) {
		for ( var i in memberList) {
			var member = memberList[i];
			if (member) {
				var memberDiv = $('<div>').addClass("dishOrder").attr("id",
						"memberDiv_" + i).appendTo(memberListPanel);
				var memberCaptionDiv = $('<div>').addClass("captionPanel")
						.appendTo(memberDiv);
				var memberOperationPanel = $('<div>').addClass(
						"dishOrderOperationPanel").appendTo(memberDiv);

				var memberCaptionHtml = new StringBuilder();
				memberCaptionHtml.append([
						" " + $.i18n.prop('string_huiYuanKaHao') + ":",
						$.trim(member.memberCardNo) ]);
				memberCaptionHtml
						.append([ " " + $.i18n.prop('string_xingMing') + ":",
								member.name ]);
				memberCaptionHtml.append([
						" " + $.i18n.prop('string_dianHua') + ":",
						member.mobileNo ]);
				memberCaptionDiv.html(memberCaptionHtml.toString());

				$("<button>").data("member", member).addClass(
						"button chooseMember").text(
						$.i18n.prop('string_xuanZe')).appendTo(
						memberOperationPanel);
			}
		}
	}
}

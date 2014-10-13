function CheckoutView(container) {
	var self = this;

	var eventHandlers = {
		'cancelCheckedOut' : []
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

	var currentCustomer = null;
	var dishOrder = null;
	var currentPaymentTypeId = 0;
	var couponSentCountByTemplateIdDict = {};

	var init = function() {

		$("#confirmCheckoutButton").click(submitCheckOut);
		$("#cancelCheckoutButton").click(function() {
			fireEvent('cancelCheckedOut');
		});
		$("#prePrintCheckoutBillButton").click(prePrintCheckoutBillButtonClick);

		function prePrintCheckoutBillButtonClick() {

			if (!dishOrder) {
				new AlertDialog($.i18n.prop('string_cuoWu'), $.i18n
						.prop('string_dangQianDingDanWeiKongWuFaDaYin')).show();
				return;
			}

			var loadingDialog = new LoadingDialog($.i18n
					.prop('string_zhengZaiTiJiaoDaYin'));
			loadingDialog.show();
			var ajaxReq = {
				type : 'POST',
				url : '../ordering/prePrintCheckoutBill',
				data : {
					employeeId : uiDataManager.getStoreData().employee.id,
					dishorderJsonStr : JSON.stringify(dishOrder)
				},
				dataType : 'json',
				error : function() {
					loadingDialog.hide();
					new AlertDialog(
							$.i18n.prop('string_yuDaYinJieZhangDan'),
							$.i18n
									.prop('string_yuDaYinJieZhangDanShiBaiQingShaoHouZaiShi'))
							.show();

				},
				success : function() {
					loadingDialog.hide();
					new AlertDialog($.i18n.prop('string_yuDaYinJieZhangDan'),
							$.i18n.prop('string_yiTiJiaoDaYinJiDaYin')).show();
				}
			};
			$.ajax(ajaxReq);
		}

		$("#bindMemberButton").click(function() {
			new showSearchMemberDialog(setCustomerInDishOrder).show();
		});

		function setCustomerInDishOrder(customer) {
			currentCustomer = customer;
			dishOrder.userAccountId = currentCustomer.id;
			drawCheckoutInfos();

			if (!couponSentCountByTemplateIdDict[currentCustomer.id]
					|| couponSentCountByTemplateIdDict[currentCustomer.id] == []) {
				couponSentCountByTemplateIdDict[currentCustomer.id] = [];
				couponSentCountByTemplateIdDict[currentCustomer.id]
						.push(uiDataManager.getStoreData().couponTemplates);
			}
		}

		$("#paymentTypes").delegate(
				"[name='payAmountLabel']",
				"click",
				function() {
					currentPaymentTypeId = this.id;
					if (currentPaymentTypeId != "paymentTypeLabel_coupon") {
						new AmountDialog($.i18n.prop('string_jinE'),
								closePaymentTypeDialog, $(this).text()).show();
					}
				});
	};

	this.show = function() {
		dishOrder = dishOrderManager.getCurrentDishOrder();
		if (dishOrder != null) {
			if (dishOrder.userAccountId) {
				currentCustomer = $.ajax({
					url : "../member/getMemberById",
					data : {
						userAccountId : dishOrder.userAccountId
					},
					type : "POST",
					dataType : 'json',
					async : false
				}).responseJSON;

				if (!couponSentCountByTemplateIdDict[currentCustomer.id]
						|| couponSentCountByTemplateIdDict[currentCustomer.id] == []) {
					couponSentCountByTemplateIdDict[currentCustomer.id] = [];
					couponSentCountByTemplateIdDict[currentCustomer.id]
							.push(uiDataManager.getStoreData().couponTemplates);
				}
			}
		}
		drawCheckoutInfos();
		$(container).show();
	};

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

		$('<span>').text($.i18n.prop('string_OriginalPrice')).appendTo(priceInfoDiv);
		var totalPriceLabel = $('<label>').attr("id",
				"checkout_totalPriceLabel").addClass("dishOrderDetailLabel")
				.appendTo(priceInfoDiv);

		$('<span>').text($.i18n.prop('string_FinalPrice')).appendTo(priceInfoDiv);
		var finalPriceLabel = $('<label>').attr("id", "finalPriceLabel")
				.addClass("dishOrderDetailLabel").appendTo(priceInfoDiv);

		discountRateDiv.text($.i18n.prop('string_DiscountRate'));
		var discountRateRadio = $('<label>').addClass("button paymentType")
				.css("width", "2em").text("1").click(showDiscountRateDialog)
				.appendTo(discountRateDiv);

		serviceFeeRateDiv.text($.i18n.prop('string_ServiceFeeRate'));
		var serviceFeeRateRadio = $('<label>').addClass("button paymentType")
				.css("width", "2em").css("display", "inline-block").text("0")
				.click(showServiceFeeRateDialog).appendTo(serviceFeeRateDiv);

		var couponValue = 0;
		var amountToPay = 0;

		if (dishOrder) {

			if (dishOrder.prePay != null && dishOrder.prePay > 0) {
				$('<span>').text("预付").appendTo(priceInfoDiv);
				$('<label>').text(dishOrder.prePay).addClass(
						"dishOrderDetailLabel").appendTo(priceInfoDiv);
			}

			new CustomerInfoPicker($('#userAccountInfo'), dishOrder,
					currentCustomer, couponSentCountByTemplateIdDict,
					useCouponClick);
			var dishOrderId = $.trim(dishOrder.id);
			var dishOrderBriefId = $.i18n.prop('string_danHao')
					+ '：'
					+ dishOrderId.substring(dishOrderId.length - 4,
							dishOrderId.length);
			if (typeof (deskView_SelectedDesk) != 'undefined'
					&& deskView_SelectedDesk != null) {
				$("<span>").text(
						deskView_SelectedDesk.name + " "
								+ dishOrder.customerCount
								+ $.i18n.prop('string_ren') + dishOrderBriefId)
						.appendTo(deskInfoDiv);
			}

			if (dishOrder.discountRate != null)
				discountRateRadio.text(dishOrder.discountRate);

			if (dishOrder.serviceFeeRate != null)
				serviceFeeRateRadio.text(dishOrder.serviceFeeRate);

			totalPriceLabel.text(dishOrder.totalPrice);
			finalPriceLabel.text(dishOrder.finalPrice);

			couponValue = dishOrderManager.getDishOrderCouponValue();
			amountToPay = dishOrder.finalPrice - couponValue;

			if (couponValue > dishOrder.finalPrice) {
				amountToPay = 0;
			}
		} else {
			totalPriceLabel.text("0.0");
			finalPriceLabel.text("0.0");
		}

		var isFirstPaymentType = true;
		for ( var i in uiDataManager.getStoreData().paymentTypes) {
			var paymentType = uiDataManager.getStoreData().paymentTypes[i];
			var paymentTypeDiv = $('<div>').text(paymentType.name + ":");
			var payAmountLabel = $('<label>').text("0.0").attr("id",
					"payAmountLabel" + paymentType.id).attr("name",
					"payAmountLabel").data("paymentType", paymentType)
					.addClass("button paymentType").appendTo(paymentTypeDiv);

			$('<div>').addClass("button").click(payAllButtonClick).data(
					"paymentType", paymentType).css("margin-left", "5px").text(
					$.i18n.prop('string_All')).appendTo(paymentTypeDiv);

			$('<div>').addClass("button").click(payRemainButtonClick).data(
					"paymentType", paymentType).css("margin-left", "5px").text(
					$.i18n.prop('string_Remain')).appendTo(paymentTypeDiv);

			if (isFirstPaymentType) {
				payAmountLabel.text(amountToPay.toFixed(1));
				isFirstPaymentType = false;
			}
			paymentTypeDiv.appendTo(paymentTypesDiv);
		}

		if (currentCustomer && currentCustomer.balance > 0) {

			var paymentType = {
				id : 0,
				name : "会员卡余额",
				exchangeRate : 1,
				isPrepaid : false
			};
			var paymentTypeDiv = $('<div>').text(paymentType.name + ":");
			$('<label>').text("0.0").attr("id",
					"payAmountLabel" + paymentType.id).attr("name",
					"payAmountLabel").data("paymentType", paymentType)
					.addClass("button paymentType").appendTo(paymentTypeDiv);

			$('<div>').addClass("button").click(payAllButtonClick).data(
					"paymentType", paymentType).css("margin-left", "5px").text(
					$.i18n.prop('string_quanBu')).appendTo(paymentTypeDiv);

			$('<div>').addClass("button").click(payRemainButtonClick).data(
					"paymentType", paymentType).css("margin-left", "5px").text(
					$.i18n.prop('string_yuE')).appendTo(paymentTypeDiv);

			paymentTypeDiv.appendTo(paymentTypesDiv);
		}

		function useCouponClick(couponId) {
			var coupons = currentCustomer.coupons;
			for ( var i in coupons) {
				var coupon = coupons[i];
				if (coupon.id == couponId) {
					if (coupon.state == 0) {
						coupon.state = 1;
					} else if (coupon.state == 1) {
						coupon.state = 0;
					}
					break;
				}
			}
			drawCheckoutInfos();
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
			if (dishOrder != null) {
				if (dishOrder.finalPrice > otherPaid) {
					var amountToPay = (dishOrder.finalPrice - otherPaid)
							/ paymentType.exchangeRate;
					payAmountLabel.text(amountToPay.toFixed(1));
					if (paymentType.id == 0
							&& currentCustomer.balance < amountToPay) {
						payAmountLabel.text(currentCustomer.balance.toFixed(1));
					}
				}
			}
			updateActualPaidLabel();
		}

		function payAllButtonClick() {

			var paymentType = $(this).data("paymentType");
			var payAmountLabel = $("#payAmountLabel" + paymentType.id, $(this)
					.parent());

			if (dishOrder != null) {
				var amountToPay = dishOrderManager.getMoneyToPayForDishOrder()
						/ paymentType.exchangeRate;
				$("[name='payAmountLabel']").text("0.0");
				if (amountToPay > 0) {
					payAmountLabel.text(amountToPay.toFixed(1));
				}

				if (paymentType.id == 0
						&& currentCustomer.balance < amountToPay) {
					payAmountLabel.text(currentCustomer.balance.toFixed(1));
				}
				updateActualPaidLabel();
			}
		}

		if (couponValue > 0) {
			$('<div>').text(
					$.i18n.prop('string_youHuiQuan') + couponValue.toFixed(1))
					.appendTo(paymentTypesDiv);
		}

		$('<span>').text($.i18n.prop('string_ActualPaid')).appendTo(
				$('#actualPayDiv'));
		$('<label>').attr("id", "actualPaidLabel").addClass(
				"dishOrderDetailLabel").appendTo("#actualPayDiv");
		updateActualPaidLabel();

		new OrderItemList(null, null, dishOrderItemList, drawCheckoutInfos)
				.render();
	}

	function updateActualPaidLabel() {
		var actualPaid = 0;
		var couponValue = dishOrderManager.getDishOrderCouponValue();
		$("[name='payAmountLabel']").each(
				function() {
					actualPaid += parseFloat($(this).text())
							* $(this).data("paymentType").exchangeRate;
				});
		actualPaid += couponValue;
		$("#actualPaidLabel").text(actualPaid.toFixed(1));
	}

	function showDiscountRateDialog() {
		showNamedValueDialog("discountRate",
				uiDataManager.getStoreData().discountRates, 1);
	}

	function showServiceFeeRateDialog() {
		showNamedValueDialog("serviceFeeRate",
				uiDataManager.getStoreData().serviceFeeRates, 0);
	}

	function showNamedValueDialog(name, rates, defaultRate) {
		var ratePanel = $("<div>").addClass("singleChoicePanel").appendTo(
				"body");

		var dialog = $(ratePanel).modal();

		var contentDiv = $("<div>").addClass("orderItemCmdPanelContent")
				.addClass("overthrow").appendTo(ratePanel);

		for ( var i in rates) {
			var rate = rates[i];

			var backgroundColor = "";
			if (name == "discountRate") {
				if (dishOrder.discountRate == rate.value) {
					backgroundColor = "#6AA1D8";
				}
			} else if (name == "serviceFeeRate") {
				if (dishOrder.serviceFeeRate == rate.value) {
					backgroundColor = "#6AA1D8";
				}
			}

			var discountRateItemDiv = $("<div>").attr("name", "rateItemDiv")
					.css("background-color", backgroundColor).data("rateValue",
							rate.value).addClass("singleChoiceItem").text(
							rate.name).click(rateItemDivClick);
			discountRateItemDiv.appendTo(contentDiv);
		}

		$("<div>").attr("name", "rateItemDiv").css("background-color",
				dishOrder.discountRate ? "" : "#6AA1D8").addClass(
				"singleChoiceItem").data("rateValue", defaultRate).text(
				"(" + $.i18n.prop('string_wu') + ")").click(rateItemDivClick)
				.appendTo(contentDiv);

		function rateItemDivClick() {
			$("div[name='rateItemDiv']").removeAttr("style");
			$(this).css("background-color", "#6AA1D8");
			if (name == "discountRate") {
				dishOrder.discountRate = Number($(this).data("rateValue"));
			} else if (name == "serviceFeeRate") {
				dishOrder.serviceFeeRate = Number($(this).data("rateValue"));
			}
		}

		var bottomDiv = $("<div>").addClass("orderItemCmdPanelBottomDiv");
		bottomDiv.appendTo(ratePanel);

		$("<a>").text($.i18n.prop('string_queDing')).addClass("button").click(
				function() {
					dialog.close();
					changeDiscountRateOrserviceFeeRate();
				}).appendTo(bottomDiv);
	}

	function changeDiscountRateOrserviceFeeRate() {
		if (dishOrder != null) {
			dishOrderManager.updateDishOrderPrice();
			drawCheckoutInfos();
		}
	}

	function closePaymentTypeDialog(result) {

		$("#" + currentPaymentTypeId).html(result);
		updateActualPaidLabel();
		$("#dialog-digitKeyboard").hide();
		$("#dialogBackground").hide();
	}

	function submitCheckOut() {

		var memo = $.trim($("#dishOrderMemoInput").val());

		var payRecords = [];
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
				payRecords.push(payRecord);
			}
		});

		dishOrderManager.checkOutOrder(payRecords, currentCustomer, memo);

		memo.value = "";
	}

	this.hide = function() {
		$(container).hide();
	};

	init();
}

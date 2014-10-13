if (window.location.search.indexOf('debug') > 0) {
	var RICE4Native = {
		readCard : function() {
			return "2513A6A0";
		},
		showInPoleDisplay : function(text) {
		},
		getCheckoutBillPrinterId : function() {
			return 1;
		}
	};
}

function CheckoutView(container) {
	var self = this;

	var eventHandlers = {
		'onSwitchViewCommand' : []
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

	var init = function() {

		dishOrderManager.attachEvent('onCurrentDishOrderChanged',
				drawCheckoutInfos);

		new OrderItemList(null, null, $("#dishOrderItemList", container));
		new DishOrderPricePanel($("#dishOrderPricePanel", container));

		$("#confirmCheckOutButton").click(
				function() {
					var dishOrder = dishOrderManager.getCurrentDishOrder();
					if (Math.abs(dishOrder.remainToPay) > 0.6) {
						new AlertDialog($.i18n.prop('string_Amount'), $.i18n
								.prop('string_PayAmountDiff')).show();
					} else {
						dishOrderManager.submitAndPayDishOrder();
					}
				});

		$("#switchToDishViewButton").click(function() {
			fireEvent('onSwitchViewCommand', 'DISH_VIEW');
		});

		$("#bindMemberButton").click(function() {
			new PickCustomerDialog(function(customer) {
				dishOrderManager.bindCustomer(customer.id);
			}).show();
		});

		if (typeof (RICE4Native) == 'undefined' || !enableDepositCard) {
			$("#depositCardButton", container).hide();
		}
		$("#depositCardButton", container).click(
				function() {
					var cardNo = RICE4Native.readCard();
					new DepositCardDialog(payCallback, cardNo).show();
					function payCallback(depositCard) {
						var dishOrder = dishOrderManager.getCurrentDishOrder();
						var payRecord = PayRecord.newFromDepositCard(
								depositCard, dishOrder.finalPrice);
						dishOrderManager.addPayRecord(payRecord);
					}
				});

		var paymentTypeList = $("#paymentTypeList", container);
		for ( var i in uiDataManager.getStoreData().paymentTypes) {
			var paymentType = uiDataManager.getStoreData().paymentTypes[i];
			var paymentTypeDiv = $('<div>').text(paymentType.name).data(
					'paymentType', paymentType).addClass("button").css(
					"margin", "1em").click(paymentTypeButtonClick).appendTo(
					paymentTypeList);
			function paymentTypeButtonClick() {
				var dishOrder = dishOrderManager.getCurrentDishOrder();
				var paymentType = $(this).data('paymentType');
				var remainToPay = dishOrder.remainToPay;
				var payRecord = PayRecord.newFromPaymentType(paymentType,
						remainToPay)
				dishOrderManager.addPayRecord(payRecord);

				if (paymentType.manualInput) {
					new AmountDialog($.i18n.prop('string_Amount'), remainToPay,
							okCallback).show();
					function okCallback(result) {
						payRecord.amount = result;
						if (result > remainToPay) {
							payRecord.makeChange = true;
							payRecord.change = result - remainToPay;
						}
						dishOrderManager.updateCurrentDishOrder();
					}
				}
			}
		}
	};

	this.show = function() {
		var dishOrder = dishOrderManager.getCurrentDishOrder();
		if (dishOrder && dishOrder.serialNumber == '0') {
			new AmountDialog($.i18n.prop('string_SerialNumber'), '', function(
					serialNumber) {
				dishOrderManager.setSerialNumber(serialNumber);
			}, true).show();
		}

		dishOrderManager.loadCustomerIfNeeded();
		$(container).show();
		drawCheckoutInfos();
	};

	function drawCheckoutInfos() {

		$('#userAccountInfo').empty();

		var amountToPay = 0;

		var dishOrder = dishOrderManager.getCurrentDishOrder();
		if (dishOrder) {
			new CustomerInfoPicker($('#userAccountInfo'), dishOrder).show();
		}

		if (typeof (RICE4Native) != 'undefined') {
			if (dishOrder) {
				RICE4Native.showInPoleDisplay(dishOrder.finalPrice.toFixed(2));
			} else {
				RICE4Native.showInPoleDisplay("0.00");
			}
		}

		var payRecordList = $("#payRecordList", container);
		payRecordList.empty();
		if (dishOrder && dishOrder.payRecords) {
			for ( var i in dishOrder.payRecords) {
				var payRecord = dishOrder.payRecords[i];
				var typeName = payRecord.typeName;
				if (payRecord.exchangeRate < 0) {
					typeName += '(' + $.i18n.prop('string_Refund') + ')';
				}
				if (payRecord.isBonus) {
					typeName += '(' + $.i18n.prop('string_Bonus') + ')';
				}
				var payRecordDiv = $('<div>').text(typeName + ":");
				$('<label>').text(payRecord.amount)
						.data("payRecord", payRecord).addClass(
								"button paymentType").appendTo(payRecordDiv)
						.click(payRecordLabelClick);

				function payRecordLabelClick() {
					var payRecord = $(this).data('payRecord');
					new AmountDialog($.i18n.prop('string_Amount'), $(this)
							.text(), function(result) {
						payRecord.amount = result;
						dishOrderManager.updateCurrentDishOrder();
					}).show();
				}
				var cancelButton = $('<div>').addClass("button").data(
						"payRecord", payRecord).css("margin-left", "5px").text(
						'X').appendTo(payRecordDiv);

				if (payRecord.id > 0) {
					cancelButton.css("background-color", "rgb(204, 204, 204)");

					var refundButton = $('<div>').addClass("button").data(
							"payRecord", payRecord).css("margin-left", "5px")
							.text($.i18n.prop('string_Refund'));
					refundButton.click(function() {
						var orgPayRecord = $(this).data('payRecord');
						var refundAmount = -dishOrder.remainToPay;
						if (refundAmount > orgPayRecord.amount) {
							refundAmount = orgPayRecord.amount;
						}
						var payRecord = PayRecord.refund(orgPayRecord,
								refundAmount)
						dishOrderManager.addPayRecord(payRecord);
					});
					if (payRecord.exchangeRate > 0) {
						refundButton.appendTo(payRecordDiv);
					}
				} else {
					if (payRecord.change > 0) {
						var makeChangeCheckbox = $('<input type="checkbox">')
								.attr('id', "makeChangeCheckbox" + i).attr(
										'checked', payRecord.makeChange).data(
										"payRecord", payRecord).css(
										"margin-left", "5px").appendTo(
										payRecordDiv);
						makeChangeCheckbox.click(function() {
							var payRecord = $(this).data('payRecord');
							var checked = $(this).attr('checked');
							payRecord.makeChange = checked;
							dishOrderManager.updateCurrentDishOrder();
						});

						var text = $.i18n.prop('string_MakeChange') + ':'
								+ payRecord.change;
						$('<label>').attr('for', 'makeChangeCheckbox' + i)
								.text(text).appendTo(payRecordDiv);
					}
					cancelButton.click(function() {
						var payRecord = $(this).data('payRecord');
						dishOrderManager.removePayRecord(payRecord);
					});
				}
				payRecordDiv.appendTo(payRecordList);
			}
		}
	}

	this.hide = function() {
		$(container).hide();
	};

	init();
}

function DishOrderManager() {
	var self = this;

	var eventHandlers = {
		'onCurrentDishOrderChanged' : [],
		'onDishOrdered' : [],
		'onDishOrderSubmitted' : [],
		'onDishOrderPaid' : [],
		'onDishOrderCancelled' : []
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
	var dishOrderCache = DishOrderCache.getInstance();

	var _currentDishOrder = null;
	this.getCurrentDishOrder = function() {
		return _currentDishOrder;
	};
	this.setCurrentDishOrder = function(dishOrder) {
		if (dishOrder != _currentDishOrder) {
			if (dishOrder && dishOrder.id > 0) {
				dishOrderCache.updateDishOrderCache(dishOrder);
			}
			if (_currentDishOrder && _currentDishOrder.id > 0
					&& !_currentDishOrder.deskId) {
				var checkPayDiff = !dishOrder
						|| dishOrder.id != _currentDishOrder.id;
				if (checkPayDiff && _currentDishOrder.remainToPay != 0) {
					new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
							.prop('string_PayAmountDiff')).show();
					return;
				}
			}
		}

		_currentDishOrder = dishOrder;
		self.updateDishOrderPrice();

		fireEvent('onCurrentDishOrderChanged', _currentDishOrder);
	};

	var addOrderItemForDish = function(dishOrder, employee, dish) {
		if (!dishOrder.orderItems) {
			dishOrder.orderItems = [];
		}

		var dishUnit = uiDataManager.getDishUnitByName(dish.unit);
		var orderItem = OrderItem.newFromDish(dish, dishUnit, employee,
				dishOrder.customerCount);
		dishOrder.orderItems.push(orderItem);
		autoOrderMealDealItems(dish, dishOrder, orderItem);

		return orderItem;
	};

	var checkOrderItemExist = function(orderItem) {
		var dishOrder = _currentDishOrder;
		if (!dishOrder) {
			return false;
		}
		if ($.inArray(orderItem, dishOrder.orderItems) == -1) {
			return false;
		}

		return true;
	};

	var checkPayRecordExist = function(payRecord) {
		var dishOrder = _currentDishOrder;
		if (!dishOrder) {
			return false;
		}
		if ($.inArray(payRecord, dishOrder.payRecords) == -1) {
			return false;
		}

		return true;
	};

	var autoOrderMealDealItems = function(dish, dishOrder, triggerOrderItem) {

		var mealDealItems = uiDataManager
				.getMealDealItemsBySourceDishId(dish.id);
		var orderedGroupNameList = [];

		for ( var i in mealDealItems) {
			var mealDealItem = mealDealItems[i];
			var groupName = $.trim(mealDealItem.groupName);
			if (orderedGroupNameList.indexOf(groupName) != -1) {
				continue;
			}
			orderedGroupNameList.push(groupName);

			var targetDish = uiDataManager
					.getDishById(mealDealItem.targetDishId);
			var dishUnit = uiDataManager.getDishUnitByName(targetDish.unit);
			var orderItem = OrderItem.newFromDish(targetDish, dishUnit);
			orderItem.dishPrice = mealDealItem.priceDelta;
			orderItem.dishVIPFee = 0;
			orderItem.price = 0;
			orderItem.mealDealItemId = mealDealItem.id;
			orderItem.clientTriggerId = triggerOrderItem.clientId;
			dishOrder.orderItems.push(orderItem);
		}
	};

	var setOrderItemPropertyIncludingSubOrderItems = function(orderItem,
			propertyName, propertyValue) {
		if (!checkOrderItemExist(orderItem)) {
			return;
		}

		orderItem[propertyName] = propertyValue;
		for ( var i in _currentDishOrder.orderItems) {
			var oi = _currentDishOrder.orderItems[i];
			if (!oi.triggerId) {
				continue;
			}
			if (oi.triggerId == orderItem.clientTriggerId
					|| oi.triggerId == orderItem.id) {
				oi[propertyName] = propertyValue;
			}
		}

		self.setCurrentDishOrder(_currentDishOrder);
	};

	var setDishOrderField = function(fieldName, fieldValue) {
		dishOrder = _currentDishOrder;
		if (!dishOrder) {
			return;
		}
		if (dishOrder.id == 0) {
			dishOrder[fieldName] = fieldValue;
			self.setCurrentDishOrder(dishOrder);
			return;
		}

		var loadingDialog = new LoadingDialog($.i18n.prop("string_Loading"));
		loadingDialog.show();

		var fieldDict = {
			'serialNumber' : 'serial_number',
			'discountRate' : 'discount_rate',
			'serviceFeeRate' : 'service_fee_rate'
		};

		var payload = getJsonRPCPayload();
		payload.params.dish_order_id = dishOrder.id;
		payload.params.field_name = fieldDict[fieldName];
		payload.params.field_value = fieldValue;

		var ajaxReq = getDefaultAjax(payload, rpc_urls.set_dish_order_field);

		$.ajax(ajaxReq).done(ajaxDone).fail(
				function() {
					loadingDialog.hide();
					new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
							.prop('string_Error')).show();
				});
		function ajaxDone(response) {
			loadingDialog.hide();

			if (response.error) {
				new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
						.prop('string_Error')).show();
				return;
			}

			var dishOrder = DishOrder.mapServerDishOrder(response.result);
			self.setCurrentDishOrder(dishOrder);
		}
	};

	var submitDishOrder = function(rpcUrl, successCallback) {
		if (!_currentDishOrder) {
			return;
		}

		if (typeof (RICE4Native) != 'undefined') {
			if (RICE4Native.getCheckoutBillPrinterId
					&& RICE4Native.getCheckoutBillPrinterId()) {
				_currentDishOrder.checkoutBillPrinterId = RICE4Native
						.getCheckoutBillPrinterId();
			}
			if (RICE4Native.getCustomerNotePrinterId
					&& RICE4Native.getCustomerNotePrinterId()) {
				_currentDishOrder.customerNotePrinterId = RICE4Native
						.getCustomerNotePrinterId();
			}
		}

		var dishOrderToSubmit = DishOrder
				.getDishOrderToSubmit(_currentDishOrder);

		var loadingDialog = new LoadingDialog($.i18n.prop('string_Submitting'));
		loadingDialog.show();

		var payload = getJsonRPCPayload();
		payload.params.db = db;
		payload.params.dish_order = dishOrderToSubmit;
		var ajaxReq = getDefaultAjax(payload, rpcUrl);

		$.ajax(ajaxReq).done(ajaxDone).fail(
				function() {
					loadingDialog.hide();
					new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
							.prop('string_Error')).show();
				});
		function ajaxDone(response) {
			loadingDialog.hide();
			if (!response.result) {
				new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
						.prop('string_Error')).show();
				return;
			}

			var dishOrder = DishOrder.mapServerDishOrder(response.result);
			self.setCurrentDishOrder(dishOrder);

			if (successCallback) {
				successCallback(dishOrder);
			}
		}
	};

	var mergeClientOrderItems = function(dishOrder) {
		if (!_currentDishOrder || !dishOrder) {
			return;
		}
		if (_currentDishOrder == null || !_currentDishOrder.orderItems
				|| !dishOrder.orderItems
				|| _currentDishOrder.id != dishOrder.id) {
			return;
		}

		for ( var i in _currentDishOrder.orderItems) {
			var orderItem = _currentDishOrder.orderItems[i];
			if (orderItem.id == 0) {
				var notExist = true;
				for ( var i in dishOrder.orderItems) {
					var oi = dishOrder.orderItems[i];
					if (orderItem == oi)
						notExist = false;
				}

				if (notExist) {
					dishOrder.orderItems.push(orderItem);
				}
			}
		}
	};

	var cancelSubmittedOrderItem = function(orderItem, amount, cancelReason) {
		var loadingDialog = new LoadingDialog($.i18n.prop('string_Loading'));
		loadingDialog.show();

		var payload = getJsonRPCPayload();
		payload.params.dish_order_id = orderItem.dishOrderId;
		payload.params.order_item_id = orderItem.id;
		payload.params.amount = amount;
		payload.params.cancel_reason = cancelReason;

		var ajaxReq = getDefaultAjax(payload, rpc_urls.cancel_order_item);

		$.ajax(ajaxReq).done(function(response) {
			if (response.error) {
				return;
			}

			var dishOrder = DishOrder.mapServerDishOrder(response.result);
			loadingDialog.hide();

			mergeClientOrderItems(dishOrder);
			self.setCurrentDishOrder(dishOrder);
		}).fail(
				function() {
					loadingDialog.hide();
					new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
							.prop('string_Error')).show();
				});
	};

	this.updateCurrentDishOrder = function() {
		self.setCurrentDishOrder(_currentDishOrder);
	};

	this.createDishOrder = function(customerCount, deskId, successCallback) {
		var loadingDialog = new LoadingDialog($.i18n
				.prop("string_CreatingDishOrder"));
		loadingDialog.show();

		var desk = uiDataManager.getDeskById(deskId);
		if (!desk) {
			return;
		}

		var store = uiDataManager.getStore();
		var checkoutBillPrinterId = store.checkoutBillPrinterId;

		dishOrder = {
			id : 0,
			deskId : desk.id,
			deskName : desk.name,
			storeName : store.name,
			chargeVIPFee : desk.chargeVIPFee,
			checkoutBillPrinterId : checkoutBillPrinterId,
			customerNotePrinterId : desk.customerNotePrinterId,
			customerCount : customerCount,
			serialNumber : '1',
			discountRate : 1,
			serviceFeeRate : 0
		};

		var payload = getJsonRPCPayload();
		payload.params.dish_order = DataMapper.mapClientEntity('DishOrder',
				dishOrder);
		var ajaxReq = getDefaultAjax(payload, rpc_urls.create_dish_order);

		$.ajax(ajaxReq).done(ajaxDone).fail(
				function() {
					loadingDialog.hide();
					new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
							.prop('string_Error')).show();
				});
		function ajaxDone(response) {
			loadingDialog.hide();
			if (!response.result) {
				new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
						.prop('string_Error')).show();
				return;
			}

			var dishOrder = DishOrder.mapServerDishOrder(response.result);
			var employee = uiDataManager.getStoreData().employee;

			for (i in uiDataManager.getAutoOrderDishList()) {
				var autoOrderDish = uiDataManager.getAutoOrderDishList()[i];
				addOrderItemForDish(dishOrder, employee, autoOrderDish);
			}

			self.setCurrentDishOrder(dishOrder);

			if (successCallback) {
				successCallback(dishOrder);
			}
		}
	};

	this.cancelDishOrder = function() {

		var dishOrder = _currentDishOrder;

		if (dishOrder.id == 0) {
			dishOrder.state = DishOrder.STATE.CANCELLED;
			self.setCurrentDishOrder(null);
			fireEvent('onDishOrderCancelled');
			return;
		}

		if (dishOrder.state != DishOrder.STATE.CREATING) {
			if (dishOrder.orderItems) {
				var oiList = [];
				for ( var i in dishOrder.orderItems) {
					if (dishOrder.orderItems[i].id != 0) {
						oiList.push(dishOrder.orderItems[i]);
					}
				}
				dishOrder.orderItems = oiList;
			}
			self.updateDishOrderPrice();
			dishOrderCache.updateDishOrderCache(dishOrder);
			self.setCurrentDishOrder(null);
			return;
		}

		var loadingDialog = new LoadingDialog($.i18n.prop('string_Submitting'));
		loadingDialog.show();

		var payload = getJsonRPCPayload();
		payload.params.dish_order_id = dishOrder.id;
		var ajaxReq = getDefaultAjax(payload, rpc_urls.cancel_dish_order);

		$.ajax(ajaxReq).done(ajaxDone).fail(
				function() {
					loadingDialog.hide();
					new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
							.prop('string_Error')).show();
				});
		function ajaxDone(response) {
			loadingDialog.hide();
			if (!response.result) {
				new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
						.prop('string_Error')).show();
				return;
			}

			dishOrder = DishOrder.mapServerDishOrder(response.result);
			self.setCurrentDishOrder(dishOrder);
			self.setCurrentDishOrder(null);

			fireEvent('onDishOrderCancelled');
		}
	};

	this.orderDish = function(dish) {
		var dishOrder = _currentDishOrder;
		var employee = uiDataManager.getStoreData().employee;
		if (!dishOrder) {
			var store = uiDataManager.getStore();
			var checkoutBillPrinterId = store.checkoutBillPrinterId;

			dishOrder = {
				id : 0,
				storeName : store.name,
				chargeVIPFee : false,
				checkoutBillPrinterId : checkoutBillPrinterId,
				customerCount : 1,
				serialNumber : '0',
				discountRate : 1,
				serviceFeeRate : 0
			};

			for (i in uiDataManager.getAutoOrderDishList()) {
				var autoOrderDish = uiDataManager.getAutoOrderDishList()[i];
				addOrderItemForDish(dishOrder, employee, autoOrderDish);
			}
		}

		var orderItem = addOrderItemForDish(dishOrder, employee, dish);
		self.setCurrentDishOrder(dishOrder);

		if (orderItem.editable) {
			new EditOrderItemDialog(orderItem, function(dishName, departmentId,
					dishPrice, unit) {
				self.setEditableOrderItemProperties(orderItem, dishName,
						departmentId, dishPrice, unit);
			}).show();
		}

		if (dish.weighing) {
			new DishAmountDialog($.i18n.prop('string_Amount'), orderItem,
					dishAmountDialogOkCallback).show();
			function dishAmountDialogOkCallback(amount, unit) {
				orderItem.unit = unit;
				var dishUnit = uiDataManager.getDishUnitByName(unit);
				orderItem.unitExchangeRate = dishUnit ? dishUnit.exchangeRate
						: 1;
				self.setOrderItemAmount(orderItem, amount);
			}
		}

		var dishTagGroups = uiDataManager.getDishTagGroupsByDishId(dish.id);
		if (dishTagGroups && dishTagGroups.length > 0) {
			new EditOrderItemOptionsDialog(orderItem,
					function(options, freeTag) {
						self.setOrderItemOptions(orderItem, options);
						self.setOrderItemFreeTag(orderItem, freeTag);
					}).show();
		}

		fireEvent('onDishOrdered', orderItem);
	};

	this.setSerialNumber = function(serialNumber) {
		setDishOrderField('serialNumber', serialNumber);
	};

	this.setDiscountRate = function(discountRate) {
		setDishOrderField('discountRate', discountRate);
	};

	this.setServiceFeeRate = function(serviceFeeRate) {
		setDishOrderField('serviceFeeRate', serviceFeeRate);
	};

	this.setFinalPrice = function(finalPrice) {
		var dishOrder = _currentDishOrder;
		if (!dishOrder) {
			return;
		}

		dishOrder.oddmentReduce = 0;
		self.updateDishOrderPrice();

		dishOrder.oddmentReduce = dishOrder.finalPrice - finalPrice;
		dishOrder.finalPrice = finalPrice;
		dishOrder.orgFinalPrice = finalPrice;

		self.setCurrentDishOrder(dishOrder);
	};

	this.setDishOrderTags = function(tags) {
		var dishOrder = _currentDishOrder;
		if (!dishOrder) {
			return;
		}

		dishOrder.tags = tags;
		self.setCurrentDishOrder(dishOrder);
	};

	this.submitProcessingDishOrder = function() {
		submitDishOrder(rpc_urls.submit_processing_dish_order, function(
				dishOrder) {
			fireEvent('onDishOrderSubmitted', dishOrder);
		});
	};

	this.submitAndPayDishOrder = function() {
		submitDishOrder(rpc_urls.submit_and_pay_dish_order,
				function(dishOrder) {
					fireEvent('onDishOrderPaid', dishOrder);
				});
	};

	this.submitTakeoutOrder = function() {
		submitDishOrder(rpc_urls.submit_takeout_dish_order,
				function(dishOrder) {
					fireEvent('onDishOrderSubmitted', dishOrder);
				});
	};

	this.changeDesk = function(targetDesk, successCallback) {

		if (!_currentDishOrder) {
			return;
		}

		var loadingDialog = new LoadingDialog($.i18n.prop("string_Loading"));
		loadingDialog.show();

		var payload = getJsonRPCPayload();
		payload.params.dish_order_id = _currentDishOrder.id;
		payload.params.target_desk_id = targetDesk.id;
		var ajaxReq = getDefaultAjax(payload, rpc_urls.change_desk);

		$.ajax(ajaxReq).done(ajaxDone).fail(
				function() {
					loadingDialog.hide();
					new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
							.prop('string_Error')).show();
				});
		function ajaxDone(response) {
			loadingDialog.hide();
			if (!response.result) {
				new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
						.prop('string_Error')).show();
				return;
			}

			var dishOrder = DishOrder.mapServerDishOrder(response.result);
			self.setCurrentDishOrder(dishOrder);

			if (successCallback) {
				successCallback(dishOrder);
			}
		}
	};

	this.mergeDishOrder = function(targetDishOrderId, successCallback) {

		if (!_currentDishOrder) {
			return;
		}

		var loadingDialog = new LoadingDialog($.i18n.prop("string_Loading"));
		loadingDialog.show();

		var payload = getJsonRPCPayload();
		payload.params.source_dish_order_id = _currentDishOrder.id;
		payload.params.target_dish_order_id = targetDishOrderId;
		var ajaxReq = getDefaultAjax(payload, rpc_urls.merge_dish_order);

		$.ajax(ajaxReq).done(ajaxDone).fail(
				function() {
					loadingDialog.hide();
					new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
							.prop('string_Error')).show();
				});
		function ajaxDone(response) {
			loadingDialog.hide();

			if (response.error) {
				new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
						.prop('string_Error')).show();
				return;
			}

			for (i in response.result) {
				dishOrder = DishOrder.mapServerDishOrder(response.result[i]);
				self.setCurrentDishOrder(dishOrder);
			}

			if (successCallback) {
				successCallback();
			}
		}
	};

	this.printCheckoutBill = function() {

		if (!_currentDishOrder) {
			return;
		}

		var loadingDialog = new LoadingDialog($.i18n.prop("string_Submitting"));
		loadingDialog.show();

		var checkoutBillPrinterId = null;
		if (typeof (RICE4Native) != 'undefined') {
			if (RICE4Native.getCheckoutBillPrinterId
					&& RICE4Native.getCheckoutBillPrinterId()) {
				checkoutBillPrinterId = RICE4Native.getCheckoutBillPrinterId();
			}
		}

		var payload = getJsonRPCPayload();
		payload.params.dish_order_id = _currentDishOrder.id;
		payload.params.context.checkout_bill_printer_id = checkoutBillPrinterId;
		var ajaxReq = getDefaultAjax(payload, rpc_urls.print_checkout_bill);
		$.ajax(ajaxReq).done(
				function(response) {
					loadingDialog.hide();
					if (!response.result) {
						new AlertDialog($.i18n.prop('string_SystemMessage'),
								$.i18n.prop('string_Error')).show();
					} else {
						new AlertDialog($.i18n.prop('string_SystemMessage'),
								$.i18n.prop('string_Succeeded')).show();
					}
				}).fail(
				function() {
					loadingDialog.hide();
					new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
							.prop('string_Error')).show();
				});
	}

	this.reprintCustomerNote = function() {

		if (!_currentDishOrder) {
			return;
		}

		var customerNotePrinterId = null;
		if (typeof (RICE4Native) != 'undefined') {
			if (RICE4Native.getCustomerNotePrinterId
					&& RICE4Native.getCustomerNotePrinterId()) {
				customerNotePrinterId = RICE4Native.getCustomerNotePrinterId();
			}
		}

		var loadingDialog = new LoadingDialog($.i18n.prop('string_Submitting'));
		loadingDialog.show();

		var payload = getJsonRPCPayload();
		payload.params.dish_order_id = _currentDishOrder.id;
		payload.params.context.customer_note_printer_id = customerNotePrinterId;
		var ajaxReq = getDefaultAjax(payload, rpc_urls.reprint_customer_note);

		$.ajax(ajaxReq).done(
				function(response) {
					loadingDialog.hide();
					if (!response.result) {
						new AlertDialog($.i18n.prop('string_SystemMessage'),
								$.i18n.prop('string_Error')).show();
					} else {
						new AlertDialog($.i18n.prop('string_SystemMessage'),
								$.i18n.prop('string_Succeeded')).show();
					}
				}).fail(
				function() {
					loadingDialog.hide();
					new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
							.prop('string_Error')).show();
				});
	}

	this.loadCustomerIfNeeded = function() {
		dishOrder = _currentDishOrder;
		if (!dishOrder) {
			return;
		}
		if (dishOrder.customer && dishOrder.customer.id == dishOrder.customerId) {
			self.setCurrentDishOrder(dishOrder);
			return;
		}

		if (!dishOrder.customerId) {
			if (dishOrder.customer) {
				dishOrder.customer = null;
				self.setCurrentDishOrder(dishOrder);
			}
			return;
		}

		UnibizProxy.getInstance().getCustomerDetails(dishOrder.customerId,
				function(customer) {
					dishOrder.customer = customer;
					self.setCurrentDishOrder(dishOrder);
				});
	};

	this.bindCustomer = function(customerId, successCallback) {
		if (!_currentDishOrder) {
			return;
		}

		var payload = getJsonRPCPayload();
		payload.params.dish_order_id = _currentDishOrder.id;
		payload.params.customerId = customerId;
		var ajaxReq = getDefaultAjax(payload, rpc_urls.bind_customer);

		$.ajax(ajaxReq).done(function() {
			_currentDishOrder.customerId = customerId;
			self.loadCustomerIfNeeded();
		}).fail(
				function() {
					new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
							.prop('string_Error')).show();
				});
	};

	this.setCustomerCount = function(customerCount, successCallback) {
		if (!_currentDishOrder) {
			return;
		}

		var loadingDialog = new LoadingDialog($.i18n.prop("string_Loading"));
		loadingDialog.show();

		var payload = getJsonRPCPayload();
		payload.params.dish_order_id = _currentDishOrder.id;
		payload.params.customer_count = customerCount;
		var ajaxReq = getDefaultAjax(payload, rpc_urls.set_customer_count);

		$.ajax(ajaxReq).done(ajaxDone).fail(
				function() {
					loadingDialog.hide();
					new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
							.prop('string_Error')).show();
				});
		function ajaxDone(response) {
			loadingDialog.hide();
			if (!response.result) {
				new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
						.prop('string_Error')).show();
				return;
			}

			var dishOrder = DishOrder.mapServerDishOrder(response.result);
			self.setCurrentDishOrder(dishOrder);

			if (successCallback) {
				successCallback(dishOrder);
			}
		}
	};

	this.restoreDishOrder = function(dishOrderId, successCallback) {

		var loadingDialog = new LoadingDialog($.i18n.prop("string_Loading"));
		loadingDialog.show();

		var payload = getJsonRPCPayload();
		payload.params.dish_order_id = dishOrderId;
		var ajaxReq = getDefaultAjax(payload, rpc_urls.restore_dish_order);

		$.ajax(ajaxReq).done(ajaxDone).fail(
				function() {
					loadingDialog.hide();
					new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
							.prop('string_Error')).show();
				});
		function ajaxDone(response) {
			loadingDialog.hide();
			if (!response.result) {
				new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
						.prop('string_Error')).show();
				return;
			}

			var dishOrder = DishOrder.mapServerDishOrder(response.result);
			self.setCurrentDishOrder(dishOrder);

			if (successCallback) {
				successCallback(dishOrder);
			}
		}
	};

	this.archiveDishOrders = function() {

		var loadingDialog = new LoadingDialog($.i18n.prop('string_Submitting'));
		loadingDialog.show();

		var payload = getJsonRPCPayload();
		var ajaxReq = getDefaultAjax(payload, rpc_urls.archive_dish_orders);

		$.ajax(ajaxReq).done(ajaxDone).fail(
				function() {
					loadingDialog.hide();
					new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
							.prop('string_Error')).show();
				});
		function ajaxDone(response) {
			loadingDialog.hide();

			if (response.error || !response.result) {
				new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
						.prop('string_Error')).show();
				return;
			}
		}
	};

	this.updateDishOrderPrice = function() {

		var dishOrder = _currentDishOrder;
		if (!dishOrder) {
			return;
		}

		DishOrder.updatePrice(dishOrder);
	};

	this.setDishOrderContact = function(contactName, contactMobile,
			contactAddress) {
		if (!_currentDishOrder) {
			return;
		}

		_currentDishOrder.contactName = contactName;
		_currentDishOrder.contactMobile = contactMobile;
		_currentDishOrder.contactAddress = contactAddress;
	};

	this.moveOrderItem = function(targetDishOrderId, orderItem) {
		if (!checkOrderItemExist(orderItem)) {
			return;
		}
		
		var loadingDialog = new LoadingDialog($.i18n.prop("string_Loading"));
		loadingDialog.show();

		var payload = getJsonRPCPayload();
		payload.params.source_dish_order_id = _currentDishOrder.id;
		payload.params.target_dish_order_id = targetDishOrderId;
		payload.params.order_item_id = orderItem.id;
		var ajaxReq = getDefaultAjax(payload, rpc_urls.move_order_item);

		$.ajax(ajaxReq).done(ajaxDone).fail(
				function() {
					loadingDialog.hide();
					new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
							.prop('string_Error')).show();
				});
		function ajaxDone(response) {
			loadingDialog.hide();

			if (response.error) {
				new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
						.prop('string_Error')).show();
				return;
			}

			for (i in response.result) {
				dishOrder = DishOrder.mapServerDishOrder(response.result[i]);
				self.setCurrentDishOrder(dishOrder);
			}

			if (successCallback) {
				successCallback();
			}
		}
	};

	this.setOrderItemAmount = function(orderItem, amount) {
		setOrderItemPropertyIncludingSubOrderItems(orderItem, 'amount', amount);
	};

	this.setOrderItemSuspended = function(orderItem, suspended) {
		setOrderItemPropertyIncludingSubOrderItems(orderItem, 'suspended',
				suspended);
	};

	this.setOrderItemNoCooking = function(orderItem, noCooking) {
		setOrderItemPropertyIncludingSubOrderItems(orderItem, 'noCooking',
				noCooking);
	};

	this.setOrderItemOptions = function(orderItem, options) {
		if (!checkOrderItemExist(orderItem)) {
			return;
		}

		orderItem.options = options;
		self.setCurrentDishOrder(_currentDishOrder);
	};

	this.setOrderItemTags = function(orderItem, tags) {
		if (!checkOrderItemExist(orderItem)) {
			return;
		}

		orderItem.tags = tags;
		self.setCurrentDishOrder(_currentDishOrder);
	};

	this.setOrderItemFreeTag = function(orderItem, freeTag) {
		if (!checkOrderItemExist(orderItem)) {
			return;
		}

		orderItem.freeTag = freeTag;
		self.setCurrentDishOrder(_currentDishOrder);
	};

	this.setEditableOrderItemProperties = function(orderItem, dishName,
			departmentId, dishPrice, unit) {
		if (!checkOrderItemExist(orderItem)) {
			return;
		}

		orderItem.dishName = dishName;
		orderItem.departmentId = departmentId;
		orderItem.dishPrice = dishPrice;
		orderItem.unit = unit;
		orderItem.orgUnit = unit;
		orderItem.unitExchangeRate = orderItem.orgUnitExchangeRate = 1;

		self.setCurrentDishOrder(_currentDishOrder);
	}

	this.setOrderItemDiscountRule = function(orderItem, discountRule) {
		if (!checkOrderItemExist(orderItem)) {
			return;
		}

		if (orderItem.id == 0) {
			orderItem.discountRuleId = discountRule.id;
			orderItem.ruleDiscountOnly = discountRule.noOverallDiscount;
			orderItem.ruleDiscountRate = discountRule.discountRate;
			orderItem.ruleDiscountValue = discountRule.value;

			self.setCurrentDishOrder(_currentDishOrder);
			return;
		}

		var loadingDialog = new LoadingDialog($.i18n.prop("string_Loading"));
		loadingDialog.show();

		var payload = getJsonRPCPayload();
		payload.params.dish_order_id = _currentDishOrder.id;
		payload.params.order_item_id = orderItem.id;
		payload.params.discount_rule_id = discountRule.id;

		var ajaxReq = getDefaultAjax(payload,
				rpc_urls.set_order_item_discount_rule);

		$.ajax(ajaxReq).done(ajaxDone).fail(
				function() {
					loadingDialog.hide();
					new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
							.prop('string_Error')).show();
				});
		function ajaxDone(response) {
			loadingDialog.hide();

			if (response.error) {
				new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
						.prop('string_Error')).show();
				return;
			}

			var dishOrder = DishOrder.mapServerDishOrder(response.result);
			self.setCurrentDishOrder(dishOrder);
		}
	};

	this.cancelOrderItem = function(orderItem, amount, cancelReason) {
		if (orderItem.id != 0) {
			cancelSubmittedOrderItem(orderItem, amount, cancelReason);
			return;
		}

		var dishOrder = _currentDishOrder;

		var oiIndex = $.inArray(orderItem, dishOrder.orderItems);
		if (oiIndex > -1) {
			dishOrder.orderItems.splice(oiIndex, 1);
		}
		var newOrderItems = []
		for ( var i in dishOrder.orderItems) {
			var oi = dishOrder.orderItems[i];
			if (oi.clientTriggerId != null
					&& oi.clientTriggerId == orderItem.clientId) {
				continue;
			}
			newOrderItems.push(oi);
		}
		dishOrder.orderItems = newOrderItems;

		self.setCurrentDishOrder(dishOrder);
	}

	this.changeMealDealItem = function(orderItem, mealDealItem) {
		if (!checkOrderItemExist(orderItem)) {
			return;
		}

		if (orderItem.id != 0) {
			return;
		}

		var targetDish = uiDataManager.getDishById(mealDealItem.targetDishId);

		orderItem.departmentId = targetDish.departmentId;
		orderItem.dishId = targetDish.id
		orderItem.dishName = targetDish.name;

		orderItem.mealDealItemId = mealDealItem.id;

		orderItem.orgUnit = targetDish.unit;
		orderItem.unit = targetDish.unit;

		var dishUnit = uiDataManager.getDishUnitByName(targetDish.unit);
		orderItem.orgUnitExchangeRate = dishUnit ? dishUnit.exchangeRate : 1;
		orderItem.unitExchangeRate = orderItem.orgUnitExchangeRate;

		orderItem.noOverallDiscount = targetDish.noDiscount;
		orderItem.dishPrice = mealDealItem.priceDelta;
		orderItem.noCustomerNote = targetDish.noCustomerNote,
				orderItem.noCookingNote = targetDish.noCookingNote,

				self.setCurrentDishOrder(_currentDishOrder);
		return;
	}

	this.addPayRecord = function(payRecord) {
		var dishOrder = _currentDishOrder;
		if (!dishOrder) {
			return;
		}

		if (!dishOrder.payRecords)
			dishOrder.payRecords = []

		dishOrder.payRecords.push(payRecord);

		self.setCurrentDishOrder(dishOrder)
	}

	this.removePayRecord = function(payRecord) {
		var dishOrder = _currentDishOrder;
		var oiIndex = $.inArray(payRecord, dishOrder.payRecords);
		if (oiIndex > -1) {
			dishOrder.payRecords.splice(oiIndex, 1);
		}
		self.setCurrentDishOrder(dishOrder);
	}
}

DishOrderManager.getInstance = function() {
	if (typeof (DishOrderManager._instance) == "undefined") {
		DishOrderManager._instance = new DishOrderManager();
	}

	return DishOrderManager._instance;
};

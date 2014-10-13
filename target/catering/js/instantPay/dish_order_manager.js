function DishOrderManager() {
	var self = this;

	var eventHandlers = {
		'onCurrentDishOrderChanged' : [],
		'onDishOrdered' : [],
		'onDishOrderSubmitted' : [],
		'onOrderCheckedOut' : [],
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

	var _currentDishOrder = null;
	this.getCurrentDishOrder = function() {
		return _currentDishOrder;
	};
	this.setCurrentDishOrder = function(currentDishOrder) {
		_currentDishOrder = currentDishOrder;
		fireEvent('onCurrentDishOrderChanged', _currentDishOrder);
	};

	var autoOrderMealDealItems = function(dish, dishOrder, triggerOrderItem) {

		var clientTriggerId = Math.ceil(Math.random() * 10e10);
		triggerOrderItem.clientTriggerId = clientTriggerId;

		var mealDealItems = uiDataManager
				.getMealDealItemsByTargetDishId(dish.id);
		var orderedGroupNameList = [];

		for ( var i in mealDealItems) {
			var mealDealItem = mealDealItems[i];
			var groupName = $.trim(mealDealItem.groupName);
			if (orderedGroupNameList.indexOf(groupName) != -1) {
				continue;
			}
			orderedGroupNameList.push(groupName);

			var orderItem = OrderItem.newFromDish(mealDealItem.sourceDish);
			orderItem.dishPrice = 0;
			orderItem.price = 0;
			orderItem.mealDealItemId = mealDealItem.id;
			orderItem.triggerId = clientTriggerId;
			dishOrder.orderItems.push(orderItem);
		}
	};

	this.getOrderItemOrgPrice = function(orderItem, deskId) {
		var desk = uiDataManager.getDeskById(deskId);
		var chargeVIPFee = desk == null ? false : desk.chargeVIPFee;
		var dish = uiDataManager.getDishById(orderItem.dishId);
		var mealDealItem = uiDataManager
				.getMealDealItemById(orderItem.mealDealItemId);
		var orgDishUnit = uiDataManager.getDishUnitByName(orderItem.orgUnit);
		var dishUnit = uiDataManager.getDishUnitByName(orderItem.unit);

		return OrderItem.getOrgPrice(orderItem, chargeVIPFee, dish,
				mealDealItem, orgDishUnit, dishUnit);
	};

	this.createDishOrder = function(employeeId, deskId, customerCount) {

		var loadingDialog = new LoadingDialog($.i18n
				.prop("string_CreatingDishOrder"));
		loadingDialog.show();

		var serialNumber = "";

		var ajaxReq = {
			type : 'POST',
			async : false,
			url : "../ordering/createDishOrder",
			data : {
				employeeId : employeeId,
				deskId : deskId,
				serialNumber : serialNumber,
				customerCount : customerCount
			},
			dataType : "json"
		};

		var dishOrder = $.ajax(ajaxReq).responseJSON;

		loadingDialog.hide();
		if (typeof (dishOrder) == "undefined") {
			new AlertDialog($.i18n.prop('string_Error'), $.i18n
					.prop('string_CreateDishOrderError')).show();
			return null;
		}

		uiDataManager.updateDishOrderCache(dishOrder);
		var autoOrderDishList = uiDataManager.getAutoOrderDishList();
		for ( var i in autoOrderDishList) {
			var dish = autoOrderDishList[i];
			var orderItem = OrderItem.newFromDish(dish, customerCount);
			dishOrder.orderItems.push(orderItem);
		}

		return dishOrder;
	};

	this.orderDish = function(employeeId, dish) {
		var dishOrder = _currentDishOrder;

		if (!dishOrder) {
			dishOrder = self.createDishOrder(employeeId, 0, 1);
			if (!dishOrder) {
				self.setCurrentDishOrder(null);
				return;
			}
		}

		if (!dishOrder.orderItems) {
			dishOrder.orderItems = [];
		}

		var orderItem = OrderItem.newFromDish(dish, dishOrder.customerCount);
		dishOrder.orderItems.push(orderItem);

		if (dish.hasMealDealItems) {
			autoOrderMealDealItems(dish, dishOrder, orderItem);
		}

		self.setCurrentDishOrder(dishOrder);

		fireEvent('onDishOrdered', orderItem);
	};

	this.submitOrder = function() {
		var storeData = uiDataManager.getStoreData();
		var dishOrder = _currentDishOrder;

		if (!dishOrder) {
			new AlertDialog($.i18n.prop('string_cuoWu'), $.i18n
					.prop('string_dangQianDingDanWeiKongWuFaTiJiao')).show();
			return;
		}

		var dishOrderToSubmit = $.extend(true, {}, dishOrder);

		dishOrderToSubmit.orderItems = [];
		for ( var i in dishOrder.orderItems) {
			var orderItem = $.extend(true, {}, dishOrder.orderItems[i]);
			if (orderItem.state != ORDER_ITEM_STATE.WAITING) {
				continue;
			}

			dishOrderToSubmit.orderItems.push(orderItem);
		}

		var loadingDialog = new LoadingDialog($.i18n.prop('string_Submitting'));
		loadingDialog.show();

		var postData = {
			employeeId : storeData.employee.id,
			printerId : null,
			dishOrderJsonText : JSON.stringify(dishOrderToSubmit)
		};

		var ajaxReq = {
			type : 'POST',
			url : "../ordering/submitDishOrder",
			data : postData,
			dataType : 'json',
			error : function(error) {
				loadingDialog.hide();
				new AlertDialog($.i18n.prop('string_Error'), error.responseText)
						.show();
			},
			success : function(dishOrder) {
				uiDataManager.updateDishOrderCache(dishOrder);
				loadingDialog.hide();

				self.setCurrentDishOrder(dishOrder);

				fireEvent('onDishOrderSubmitted', dishOrder);
			}
		};

		$.ajax(ajaxReq);
	};

	this.checkOutOrder = function(payRecords, currentCustomer, memo) {

		var dishOrder = _currentDishOrder;
		var loadingDialog = new LoadingDialog($.i18n.prop('string_tiJiaoZhong'));
		loadingDialog.show();

		var memberId = "";
		if (dishOrder) {
			for ( var i in payRecords) {
				dishOrder.payRecords.push(payRecords[i]);
			}
			if (dishOrder.prePay > 0) {
				var prePayRecord = {};
				prePayRecord.paymentTypeId = 1;
				prePayRecord.typeName = "预付款";
				prePayRecord.exchangeRate = 1;
				prePayRecord.amount = dishOrder.prePay;
				prePayRecord.isPrepaid = false;
				dishOrder.payRecords.push(prePayRecord);
			}

			if (memo != "" && memo != null) {
				dishOrder.memo = memo;
			}

			if (currentCustomer) {
				memberId = currentCustomer.id;
			}

			var isCheckCouponsState = false;
			$.ajax({
				url : "../ordering/updateCouponsState",
				data : {
					couponRecordsJsonText : JSON
							.stringify(dishOrder.payRecords),
					memberId : memberId,
					employeeId : uiDataManager.getStoreData().employee.id,
					dishOrderId : dishOrder.id,
					storeId : storeId
				},
				type : "POST",
				dataType : 'json',
				async : false,
				error : function(error) {
					loadingDialog.hide();
					if (error.status == 403) {
						new AlertDialog($.i18n.prop('string_cuoWu'),
								"权限不足,无法进行操作!").show();
						return;
					}
					new AlertDialog($.i18n.prop('string_cuoWu'),
							error.responseText).show();
				},
				success : function(result) {
					isCheckCouponsState = result;
					if (!result) {
						loadingDialog.hide();
						new AlertDialog($.i18n.prop('string_cuoWu'),
								"当前优惠券有些已被使用或会员卡余额不足!").show();
						dishOrder.payRecords = [];
					}
				}
			});

			if (!isCheckCouponsState) {
				return;
			}

			var postData = {
				employeeId : uiDataManager.getStoreData().employee.id,
				dishOrderJsonText : JSON.stringify(dishOrder)
			};
			$.ajax({
				url : "../ordering/payDishOrder",
				type : "POST",
				data : postData,
				dataType : 'json',
				error : function(error) {
					loadingDialog.hide();
					if (error.status == 403) {
						new AlertDialog($.i18n.prop('string_cuoWu'),
								"权限不足,无法进行操作!").show();
						return;
					}
					new AlertDialog($.i18n.prop('string_cuoWu'),
							error.responseText).show();
				},
				success : function(dishOrder) {
					loadingDialog.hide();
					if (dishOrder != "" && dishOrder != null)
						uiDataManager.updateDishOrderCache(dishOrder);

					fireEvent('onOrderCheckedOut');
				}
			});
		} else
			fireEvent('onOrderCheckedOut');
	};

	this.getMoneyToPayForDishOrder = function() {
		return _currentDishOrder.finalPrice - self.getDishOrderCouponValue();
	};

	this.getDishOrderCouponValue = function() {
		var couponValue = 0;
		if (_currentDishOrder && _currentDishOrder.payRecords) {
			for ( var i in _currentDishOrder.payRecords) {
				var payRecord = _currentDishOrder.payRecords[i];
				if (payRecord.paymentTypeId == null
						|| payRecord.paymentTypeId == 0) {
					couponValue += payRecord.amount;
				}
			}
		}

		return couponValue;
	};

	this.updateDishOrderPrice = function() {

		var dishOrder = _currentDishOrder;
		if (dishOrder.orderItems == null) {
			dishOrder.totalPrice = dishOrder.discountedPrice = 0;
			dishOrder.serviceFee = dishOrder.finalPrice = 0;
			return;
		}

		var totalPrice = 0, discountedPrice = 0;

		for ( var i in dishOrder.orderItems) {
			var oi = dishOrder.orderItems[i];

			oi.price = OrderItem.getOrderItemPrice(dishOrder, oi);
			if (oi.state != ORDER_ITEM_STATE.CANCELLED) {
				totalPrice += self.getOrderItemOrgPrice(oi, dishOrder.deskId);
				discountedPrice += oi.price;
			}
		}

		totalPrice = Math.round(totalPrice * 10) / 10.0;
		discountedPrice = Math.round(discountedPrice * 10) / 10.0;

		dishOrder.totalPrice = totalPrice;
		dishOrder.discountedPrice = discountedPrice;

		var serviceFee = discountedPrice * dishOrder.serviceFeeRate;
		serviceFee = Math.round(serviceFee * 10) / 10.0;
		dishOrder.serviceFee = serviceFee;

		var finalPrice = discountedPrice + serviceFee;
		if (dishOrder.prePay != null && dishOrder.prePay > 0) {
			finalPrice = finalPrice - dishOrder.prePay;
		}

		if (finalPrice < 0) {
			finalPrice = 0;
		}

		dishOrder.finalPrice = Math.round(finalPrice);
	};

}

DishOrderManager.getInstance = function() {
	if (typeof (DishOrderManager._instance) == "undefined") {
		DishOrderManager._instance = new DishOrderManager();
	}

	return DishOrderManager._instance;
};

DISH_ORDER_STATE = {
	PROCESSING : 1,
	PAID : 2,
	ARCHIVED : 3,
	CREATING : 4,
	CANCELLED : 5,
	PAYING : 6
};

ORDER_ITEM_STATE = {
	WAITING : 1,
	PRINTING : 2,
	PREPARING : 3,
	COOKING : 4,
	DELIVERING : 5,
	SERVED : 6,
	CANCELLED : 7
};
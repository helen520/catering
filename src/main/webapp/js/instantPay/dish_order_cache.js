function DishOrderCache() {
	var self = this;
	var eventHandlers = {
		'onMyDishOrderSetChanged' : [],
		'onActiveDishOrderSetChanged' : []
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

	var clientDishOrders = [];
	var myDishOrders = [];
	var autoUpdateActiveDishOrders = false;
	var lastActiveDishOrderSetHash = 0;
	var uiDataManager = UIDataManager.getInstance();

	var dishOrderMap = {};
	this.getDishOrderById = function(id) {
		return dishOrderMap[id];
	};

	var dishOrderBriefMap = {};
	this.getDishOrderBriefById = function(id) {
		return dishOrderBriefMap[id];
	};

	var dishOrderBriefByDeskIdMap = {};
	this.getDishOrderBriefByDeskId = function(deskId) {
		return dishOrderBriefByDeskIdMap[deskId];
	};

	var updateActiveDishOrders = function() {

		var ajaxRequest = {
			type : 'POST',
			url : "../storeData/getActiveDishOrderDynamicData/" + $storeId,
			data : {
				lastActiveDishOrderSetHash : lastActiveDishOrderSetHash,
			},
			dataType : "json",
			async : true,
			error : function(error) {
				if (new Date().getTime() - $lastSyncDynamicDataTime > 70000) {
					$("#syncDynamicDataState").html("同步订单信息失败!");
				}
				if (error.status == 200) {// session timeout
					showAlertDialog("提示", error, function() {
						window.onbeforeunload = undefined;
						window.location.href = "../store/" + $storeId;
					});
				}
			},
			success : function(hashDict) {
				if (lastActiveDishOrderSetHash != hashDict[0]) {
					dishOrderBriefMap = {};
					dishOrderBriefByDeskIdMap = {};
					for ( var i in hashDict) {
						if (i == 0) {
							continue;
						}
						var dob = hashDict[i];
						dishOrderBriefMap[dob.dishOrderId] = dob;
						dishOrderBriefByDeskIdMap[dob.deskId] = dob;
					}

					lastActiveDishOrderSetHash = hashDict[0];
					fireEvent('onActiveDishOrderSetChanged');
				}
			}
		};

		$.ajax(ajaxRequest).always(function() {
			if (autoUpdateActiveDishOrders) {
				window.setTimeout(updateActiveDishOrders, 15 * 1000);
			}
		});
	};

	this.startUpdateActiveDishOrders = function() {
		autoUpdateActiveDishOrders = true;
		window.setTimeout(updateActiveDishOrders, 100);
	};

	this.stopUpdateActiveDishOrders = function() {
		autoUpdateActiveDishOrders = false;
	};

	this.saveClientDishOrder = function(dishOrder) {
		clientDishOrders.splice(0, 0, dishOrder);

		var dishOrders = self.getMyDishOrders();
		fireEvent('onMyDishOrderSetChanged', dishOrders);
	};

	this.removeClientDishOrder = function(dishOrder) {
		for (i in clientDishOrders) {
			if (dishOrder.clientId) {
				if (dishOrder.clientId == clientDishOrders[i].clientId) {
					clientDishOrders.splice(i, 1);
				}
			}
		}

		var dishOrders = self.getMyDishOrders();
		fireEvent('onMyDishOrderSetChanged', dishOrders);
	};

	this.updateDishOrderCache = function(dishOrder) {

		var dob = {
			id : dishOrder.id,
			deskId : dishOrder.deskId,
			customerCount : dishOrder.customerCount,
			state : dishOrder.state,
			totalPrice : dishOrder.totalPrice,
			hash : dishOrder.hash
		};
		dishOrderBriefMap[dob.id] = dob;
		dishOrderMap[dishOrder.id] = dishOrder;

		dishOrderBriefByDeskIdMap = {};
		for ( var i in dishOrderBriefMap) {
			var dob = dishOrderBriefMap[i];
			dishOrderBriefByDeskIdMap[dob.deskId] = dob;
		}

		var replaced = false;
		for (i in myDishOrders) {
			if (dishOrder.id == myDishOrders[i].id) {
				myDishOrders[i] = dishOrder;
				replaced = true;
			}
		}

		if (!replaced) {
			myDishOrders.splice(0, 0, dishOrder);
		}

		var dishOrders = self.getMyDishOrders();
		fireEvent('onMyDishOrderSetChanged', dishOrders);
		fireEvent('onActiveDishOrderSetChanged');
	};

	this.loadMyDishOrders = function() {

		var ajaxRequest = {
			url : "../ordering/loadMyDishOrders",
			data : {
				employeeId : uiDataManager.getStoreData().employee.id,
			},
			type : "POST",
			dataType : 'json',
			async : false,
			error : function(error) {
				new AlertDialog($.i18n.prop('string_cuoWu'), error.responseText)
						.show();
			},
			success : function(dishOrders) {
				if (dishOrders) {
					myDishOrders = dishOrders;
					var dishOrders = self.getMyDishOrders();
					fireEvent('onMyDishOrderSetChanged', dishOrders);
				} else
					new AlertDialog($.i18n.prop('string_cuoWu'),
							"更新订单出错!请刷新后重试!").show();
			}
		};
		$.ajax(ajaxRequest);
	};

	this.getMyDishOrders = function() {
		return $.merge($.extend(true, [], clientDishOrders), myDishOrders);
	};

	this.searchDishOrdersById = function(searchDishOrderBriefId,
			successCallback) {

		var ajaxRequest = {
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
				new AlertDialog($.i18n.prop('string_cuoWu'), error.responseText)
						.show();
			},
			success : function(searchedDishOrders) {
				if (searchedDishOrders != null) {
					if (successCallback) {
						successCallback(searchedDishOrders);
					}
				}
			}
		};
		$.ajax(ajaxRequest);
	};

	this.getPaidDishOrders = function(successCallback) {
		$.ajax({
			type : 'POST',
			url : "../ordering/getDishOrderList",
			data : {
				dishOrderBriefId : 0,
				storeId : $storeId,
				isSearchBookingDishOrder : false,
				isSearchBookingDishOrderByDate : false,
			},
			error : function() {
				new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
						.prop('string_Error')).show();
			},
			success : function(dishOrders) {
				if (!dishOrders)
					return;

				if (successCallback)
					successCallback(dishOrders);

			}
		});
	};

	this.isDeskEmpty = function(desk) {
		var orderBrief = self.getDishOrderBriefByDeskId(desk.id);
		if (orderBrief) {
			if (orderBrief.state == DishOrder.STATE.CREATING
					|| orderBrief.state == DishOrder.STATE.PROCESSING) {
				return false;
			}
		}

		return true;
	};
}

DishOrderCache.getInstance = function() {
	if (typeof (DishOrderCache._instance) == "undefined") {
		DishOrderCache._instance = new DishOrderCache();
	}

	return DishOrderCache._instance;
};

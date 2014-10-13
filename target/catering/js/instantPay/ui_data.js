function UIDataManager() {
	var self = this;

	var eventHandlers = {
		'onDataLoaded' : [],
		'onMenuChanged' : [],
		'onDishOrderSetChanged' : []
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

	var deskByGroupNameMap = {};
	var discountRuleMap = {};
	var defaultEditableDish = null;
	var commonDishTagsByGroupNameMap = {};
	var dishUnitsByGroupIdMap = {};

	var lastMenuHash = 0;
	var lastActiveDishOrderSetHash = 0;
	var dishOrderBriefMap = {};
	var dishOrderBriefByDeskIdMap = {};

	var dishOrderMap = {};

	var _storeData = {};
	this.getStoreData = function() {
		return _storeData;
	};

	var _autoOrderDishList = [];
	this.getAutoOrderDishList = function() {
		return _autoOrderDishList;
	};

	var deskMap = {};
	this.getDeskById = function(deskId) {
		return deskMap[deskId];
	};

	var dishCategoryMap = {};
	this.getDishCategoryById = function(dishCategoryId) {
		return dishCategoryMap[dishCategoryId];
	};

	var dishMap = {};
	this.getDishById = function(dishId) {
		return dishMap[dishId];
	};

	var dishUnitByNameMap = {};
	this.getDishUnitByName = function(name) {
		return dishUnitByNameMap[name];
	};

	var mealDealItemMap = {};
	this.getMealDealItemById = function(mealDealItemId) {
		return mealDealItemMap[mealDealItemId];
	};

	var mealDealItemsByTargetDishIdMap = {};
	this.getMealDealItemsByTargetDishId = function(targetDishId) {
		return mealDealItemsByTargetDishIdMap[targetDishId];
	};

	this.getUnibizSid = function() {
		return _storeData.employee.unibizSid;
	};
	
	this.getUnibizUid = function() {
		return _storeData.employee.unibizUid;
	};

	this.getUnibizSessionId = function() {
		return _storeData.employee.unibizSessionId;
	};

	var updateMenuDataHashMaps = function(menus) {
		var quickIndexCodeDict = {
			"abcABC" : '2',
			"defDEF" : '3',
			"ghiGHI" : '4',
			"jklJKL" : '5',
			"mnoMNO" : '6',
			"pqrsPQRS" : '7',
			"tuvTUV" : '8',
			"wxyzWXYZ" : '9',
		};
		dishCategoryMap = [];

		for (var i = 0; i < menus.length; i++) {
			for (var j = 0; j < menus[i].dishCategories.length; j++) {
				var dishCategory = menus[i].dishCategories[j];
				dishCategoryMap[dishCategory.id] = dishCategory;

				for (var k = 0; k < dishCategory.dishes.length; k++) {
					var dish = dishCategory.dishes[k];
					dishMap[dish.id] = dish;
					if (dish.editable && defaultEditableDish == null) {
						defaultEditableDish = dish;
					}

					if (dish.autoOrder) {
						_autoOrderDishList.push(dish);
					}

					dish.quickIndexCode = "";
					if (!dish.indexCode) {
						continue;
					}

					for (var l = 0; l < dish.indexCode.length; l++) {
						var str = dish.indexCode[l];
						for (key in quickIndexCodeDict) {
							if (key.indexOf(str) != -1) {
								dish.quickIndexCode += quickIndexCodeDict[key];
							}
						}
					}
				}
			}
		}
	};

	var updateDynamicData = function(storeId) {
		var ajaxReq = {
			type : 'POST',
			url : "../storeData/getDynamicDataBriefByStoreId/" + storeId,
			data : {
				lastMenuHash : lastMenuHash,
				lastActiveDishOrderSetHash : lastActiveDishOrderSetHash
			},
			dataType : "json",
			async : true,
			error : errorHandler,
			success : successHandler
		};

		function successHandler(data) {
			var dynamicData = data;

			if (lastActiveDishOrderSetHash != dynamicData.activeDishOrderSetHash) {
				dishOrderBriefMap = {};
				dishOrderBriefByDeskIdMap = {};
				for ( var i in dynamicData.dishOrderBriefs) {
					var dob = dynamicData.dishOrderBriefs[i];
					dishOrderBriefMap[dob.dishOrderId] = dob;
					dishOrderBriefByDeskIdMap[dob.deskId] = dob;
				}

				lastActiveDishOrderSetHash = dynamicData.activeDishOrderSetHash;
				fireEvent('onDishOrderSetChanged', dynamicData);
			}

			if (lastMenuHash != dynamicData.menuHash) {
				dishCategoryBriefs = dynamicData.dishCategoryBriefs;
				lastMenuHash = dynamicData.menuHash;
				updateDishes(dishCategoryBriefs);

				fireEvent('onMenuChanged');
			}

			function updateDishes(dishCategoryBriefs) {
				for ( var i in dishCategoryBriefs) {
					var dcb = dishCategoryBriefs[i];
					if (dishCategoryMap[dcb.dishCategoryId]) {
						if (dishCategoryMap[dcb.dishCategoryId].jsonHash != dcb.jsonHash) {
							updateDishCategory(dcb.dishCategoryId);
						}
					} else {
						updateDishCategory(dcb.dishCategoryId);
					}
				}
			}

			function updateDishCategory(dishCategoryId) {
				var ajaxReq = {
					type : 'POST',
					url : "../storeData/getDishCategoryById/" + dishCategoryId,
					data : {},
					dataType : "json",
					async : false,
					success : function(dishCategory) {
						for ( var i in _storeData.menus) {
							if (_storeData.menus[i].id != dishCategory.menuId) {
								continue;
							}

							var dishCategories = [];
							for ( var j in _storeData.menus[i].dishCategories) {
								var dc = _storeData.menus[i].dishCategories[j];
								if (dc.id == dishCategory.id) {
									dishCategories.push(dishCategory);
								} else {
									dishCategories.push(dc);
								}
							}

							_storeData.menus[i].dishCategories = dishCategories;
							updateMenuDataHashMaps(_storeData.menus);
						}
					}
				};

				$.ajax(ajaxReq);
			}
		}

		function errorHandler(error) {
			if (error.status == 200) {// session timeout
				new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
						.prop('string_LoginTimeout')).show();
				window.onbeforeunload = undefined;
				window.location.href = window.location.href;
			}
		}

		$.ajax(ajaxReq);
	};

	this.loadData = function(storeId) {

		var loadingDialog = new LoadingDialog($.i18n
				.prop('string_DataSynchronizing'));
		loadingDialog.show();

		_storeData = $.ajax({
			url : "../storeData/getStoreDataById/" + storeId,
			async : false
		}).responseJSON;

		loadingDialog.hide();

		if (typeof (_storeData) == "undefined") {
			new AlertDialog($.i18n.prop('string_Error'), $.i18n
					.prop('string_LoadUIDataFailed')).show();
			return;
		}

		for ( var i in _storeData.desks) {
			deskMap[_storeData.desks[i].id] = _storeData.desks[i];
		}

		deskByGroupNameMap['ALL'] = [];
		for ( var i in _storeData.desks) {
			var desk = _storeData.desks[i];
			var deskGroupName = $.trim(desk.groupName);
			if (deskByGroupNameMap[deskGroupName] == null) {
				deskByGroupNameMap[deskGroupName] = [];
			}
			deskByGroupNameMap[deskGroupName].push(desk);
			deskByGroupNameMap['ALL'].push(desk);
		}

		for ( var i in _storeData.discountRules) {
			var discountRule = _storeData.discountRules[i];
			discountRuleMap[discountRule.id] = discountRule;
		}
		for ( var i in _storeData.commonDishTags) {
			var dt = _storeData.commonDishTags[i];

			var groupName = dt.groupName;
			if (!commonDishTagsByGroupNameMap[groupName]) {
				commonDishTagsByGroupNameMap[groupName] = [];
			}
			commonDishTagsByGroupNameMap[groupName].push(dt);
		}

		updateMenuDataHashMaps(_storeData.menus);

		for ( var i in _storeData.dishUnits) {
			var du = _storeData.dishUnits[i];
			dishUnitByNameMap[du.name] = du;
			if (!dishUnitsByGroupIdMap[du.groupNumber]) {
				dishUnitsByGroupIdMap[du.groupNumber] = [];
			}
			dishUnitsByGroupIdMap[du.groupNumber].push(du);
		}

		for ( var i in _storeData.mealDealItems) {
			var md = _storeData.mealDealItems[i];
			mealDealItemMap[md.id] = md;

			if (!mealDealItemsByTargetDishIdMap[md.targetDishId]) {
				mealDealItemsByTargetDishIdMap[md.targetDishId] = [];
			}
			mealDealItemsByTargetDishIdMap[md.targetDishId].push(md);
		}

		updateDynamicData(storeId);
		fireEvent('onDataLoaded', _storeData);
	};

	this.updateDishOrderCache = function(dishOrder) {

		var dob = {
			dishOrderId : dishOrder.id,
			deskId : dishOrder.deskId,
			customerCount : dishOrder.customerCount,
			state : dishOrder.state,
			totalPrice : dishOrder.totalPrice,
			jsonHash : dishOrder.jsonHash,
			isHasSelfOrder : dishOrder.isHasSelfOrder,
			prePrintCheckoutNotePrinted : dishOrder.prePrintCheckoutNotePrinted
		};
		dishOrderBriefMap[dob.dishOrderId] = dob;
		dishOrderBriefByDeskIdMap[dob.deskId] = dob;

		dishOrderMap[dishOrder.id] = dishOrder;
	};
}

UIDataManager.getInstance = function() {
	if (typeof (UIDataManager._instance) == "undefined") {
		UIDataManager._instance = new UIDataManager();
	}

	return UIDataManager._instance;
};

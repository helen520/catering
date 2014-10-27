function UIDataManager() {
	var self = this;

	var eventHandlers = {
		'onDataLoaded' : [],
		'onMenuChanged' : []
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

	var defaultEditableDish = null;
	var isDynamicDataError = false;

	var _storeData = {};
	this.getStoreData = function() {
		return _storeData;
	};

	var _store = {};
	this.getStore = function() {
		return _store;
	};

	var _autoOrderDishList = [];
	this.getAutoOrderDishList = function() {
		return _autoOrderDishList;
	};

	var deskMap = {};
	this.getDeskById = function(deskId) {
		return deskMap[deskId];
	};

	var desksByGroupNameMap = {};
	this.getDesksByGroupName = function(groupName) {
		return desksByGroupNameMap[groupName];
	};

	var _deskGroupNames = [];
	this.getDeskGroupNames = function() {
		return _deskGroupNames;
	};

	var dishCategoryMap = {};
	this.getDishCategoryById = function(dishCategoryId) {
		return dishCategoryMap[dishCategoryId];
	};

	var dishMap = {};
	this.getDishById = function(dishId) {
		return dishMap[dishId];
	};

	var _commonDishTagGroupList = [];
	this.getCommonDishTagGroups = function() {
		return _commonDishTagGroupList;
	};

	var dishTagGroupsByDishIdMap = {};
	this.getDishTagGroupsByDishId = function(dishId) {
		return dishTagGroupsByDishIdMap[dishId];
	};

	var dishUnitByNameMap = {};
	this.getDishUnitByName = function(name) {
		return dishUnitByNameMap[name];
	};

	var dishUnitsByGroupIdMap = {};
	this.getDishUnitsByGroupId = function(groupId) {
		return dishUnitsByGroupIdMap[groupId];
	};

	var mealDealItemMap = {};
	this.getMealDealItemById = function(mealDealItemId) {
		return mealDealItemMap[mealDealItemId];
	};

	var mealDealItemsBySourceDishIdMap = {};
	this.getMealDealItemsBySourceDishId = function(sourceDishId) {
		return mealDealItemsBySourceDishIdMap[sourceDishId];
	};

	var changableMealDealItemsMap = {};
	this.getChangableMealDealItems = function(mealDealItemId) {
		return changableMealDealItemsMap[mealDealItemId];
	};

	var discountRuleMap = {};
	this.getDiscountRuleById = function(discountRuleId) {
		return discountRuleMap[discountRuleId];
	};

	var _couponTemplateList = [];
	this.getCouponTemplateList = function() {
		return _couponTemplateList;
	};

	var _customerNotePrinterList = [];
	this.getCustomerNotePrinterList = function() {
		return _customerNotePrinterList;
	};

	var updateMenu = function() {
		var ajaxRequest = {
			type : 'POST',
			url : "../storeData/getdDishCategoryHashDictDynamicData/"
					+ $storeId,
			dataType : "json",
			async : true,
			error : function(error) {
				isDynamicDataError = true;
				new AlertDialog("提示", "同步菜单出错!", function() {
					window.setTimeout(updateMenu, 100);
				}).show();
			},
			success : function(dish_category_hash_dict) {
				isDynamicDataError = false;
				updateDishes(dish_category_hash_dict);
			}
		};

		$.ajax(ajaxRequest).always(function() {
			if (!isDynamicDataError)
				window.setTimeout(updateMenu, 30 * 1000);
		});
	};

	var processStoreData = function() {
		_store = _storeData.store;
		for ( var i in _storeData.desks) {
			deskMap[_storeData.desks[i].id] = _storeData.desks[i];
		}

		desksByGroupNameMap['ALL'] = [];
		_deskGroupNames.push('ALL');
		for ( var i in _storeData.desks) {
			var desk = _storeData.desks[i];
			var deskGroupName = $.trim(desk.groupName);
			if (desksByGroupNameMap[deskGroupName] == null) {
				desksByGroupNameMap[deskGroupName] = [];
				_deskGroupNames.push(deskGroupName);
			}
			desksByGroupNameMap[deskGroupName].push(desk);
			desksByGroupNameMap['ALL'].push(desk);
		}

		for ( var i in _storeData.discountRules) {
			var discountRule = _storeData.discountRules[i];
			discountRuleMap[discountRule.id] = discountRule;
		}

		for ( var i in _storeData.dishTagGroups) {
			var dtg = _storeData.dishTagGroups[i];

			if (!dtg.dishId) {
				_commonDishTagGroupList.push(dtg);
			} else {
				if (dishTagGroupsByDishIdMap[dtg.dishId] == null) {
					dishTagGroupsByDishIdMap[dtg.dishId] = [];
				}
				dishTagGroupsByDishIdMap[dtg.dishId].push(dtg);
			}
		}

		updateMenuDataHashMaps(_storeData.menus);

		for ( var i in _storeData.dishUnits) {
			var du = _storeData.dishUnits[i];
			dishUnitByNameMap[du.name] = du;
			if (!dishUnitsByGroupIdMap[du.groupName]) {
				dishUnitsByGroupIdMap[du.groupName] = [];
			}
			dishUnitsByGroupIdMap[du.groupName].push(du);
		}

		for ( var i in _storeData.mealDealItems) {
			var mdi = _storeData.mealDealItems[i];
			mealDealItemMap[mdi.id] = mdi;

			if (!mealDealItemsBySourceDishIdMap[mdi.sourceDishId]) {
				mealDealItemsBySourceDishIdMap[mdi.sourceDishId] = [];
			}
			mealDealItemsBySourceDishIdMap[mdi.sourceDishId].push(mdi);
		}

		for ( var i in _storeData.mealDealItems) {
			var mdi = _storeData.mealDealItems[i];
			var groupName = $.trim(mdi.groupName);
			changableMealDealItemsMap[mdi.id] = [];

			var mealDealItems = mealDealItemsBySourceDishIdMap[mdi.sourceDishId];
			for ( var j in mealDealItems) {
				var mdi2 = mealDealItems[j];
				if (groupName == $.trim(mdi2.groupName)) {
					changableMealDealItemsMap[mdi.id].push(mdi2);
				}
			}
		}

		if (_storeData.employee) {
			AuthorityManager.getInstance().setCurrentEmployee(
					_storeData.employee);
		}

		window.setTimeout(updateMenu, 30 * 1000);
		fireEvent('onDataLoaded', _storeData);
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

		dishCategoryMap = {};
		dishMap = {};
		_autoOrderDishList = [];

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

	this.updateDish = function(dishId) {
		$.ajax({
			type : 'POST',
			url : "../admin/editDishSoldOut",
			data : {
				dishId : dishId,
				employeeId : AuthorityManager.getInstance()
						.getCurrentEmployee().id
			},
			dataType : 'text',
			error : function(error) {
			},
			success : function(dish) {
				updateMenu();
			}
		});

	};

	var updateDishes = function(dishCategoryHashDict) {
		for ( var dishCategoryId in dishCategoryHashDict) {
			var jsonHash = dishCategoryHashDict[dishCategoryId].jsonHash;
			if (dishCategoryMap[dishCategoryId]) {
				if (dishCategoryMap[dishCategoryId].jsonHash != jsonHash) {
					updateDishCategory(dishCategoryId);
				}
			} else {
				updateDishCategory(dishCategoryId);
			}
		}
	};

	var updateDishCategory = function(dishCategoryId) {

		$.ajax({
			type : 'POST',
			url : "../storeData/getDishCategoryById/" + dishCategoryId,
			data : {},
			dataType : "json",
			async : false,
			success : function(dishCategory) {
				if (!dishCategory)
					return;

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

				fireEvent('onMenuChanged');
			}
		});
	};

	this.loadData = function() {

		var loadingDialog = new LoadingDialog($.i18n
				.prop('string_DataSynchronizing'));
		loadingDialog.show();

		_storeData = $
				.ajax({
					url : "../storeData/getStoreDataById/" + $storeId,
					async : false,
					error : function(error) {
						loadingDialog.hide();
						new AlertDialog($.i18n.prop('string_cuoWu'),
								error.responseText).show();
						return;
					}
				}).responseJSON;

		loadingDialog.hide();

		if (typeof (_storeData) != "undefined")
			processStoreData();
	};

	this.filterDishes = function(filterText) {

		filterText = filterText.toLowerCase();
		var result = [];
		for ( var i in dishMap) {
			var dish = dishMap[i];
			if ((dish.name && dish.name.indexOf(filterText) > -1)
					|| (dish.alias && dish.alias.indexOf(filterText) > -1)
					|| (dish.indexCode && dish.indexCode.indexOf(filterText) > -1)
					|| (dish.quickIndexCode && dish.quickIndexCode
							.indexOf(filterText) > -1))
				result.push(dishMap[i]);
		}

		return result;
	};
}

UIDataManager.getInstance = function() {
	if (typeof (UIDataManager._instance) == "undefined") {
		UIDataManager._instance = new UIDataManager();
	}

	return UIDataManager._instance;
};

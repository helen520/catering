var $storeId;
var $storeData;
var $isFirstUpdateDynamicData = true;
var $deskMap = {};
var $deskByGroupNameMap = {};
var $discountRuleMap = {};
var $dishMap = {};
var $autoOrderDishMap = {};
var $defaultEditableDish = null;
var $mealDealItemMap = {};
var $mealDealItemsByTargetDishIdMap = {};
var $dishCategoryMap = {};
var $commonDishTagsByGroupNameMap = {};
var $dishUnitByNameMap = {};
var $dishUnitsByGroupIdMap = {};
var $customerCouponTemplateListMap = {};

var $dynamicData;
var $dishCategoryBriefs;
var $lastMenuHash = 0;
var $lastActiveDishOrderSetHash = 0;
var $lastBookingRecordsHash = 0;
var $lastSelfDishOrdersHash = 0;
var $dishOrderBriefMap = {};
var $dishOrderBriefByDeskIdMap = {};
var $bookingRecords = [];
var $selfDishOrders = [];

var $dishOrderMap = {};
var $curDishOrder;
var $lastSyncDynamicDataTime = 0;
var DISH_ORDER_STATE = {
	PROCESSING : 1,
	PAID : 2,
	ARCHIVED : 3,
	CREATING : 4,
	CANCELLED : 5,
	PAYING : 6
};
var ORDER_ITEM_STATE = {
	WAITING : 1,
	PRINTING : 2,
	PREPARING : 3,
	COOKING : 4,
	DELIVERING : 5,
	SERVED : 6,
	CANCELLED : 7
};

var BOOK_RECORD_STATE = {
	CANCELLED : 0,
	BOOKING : 1,
	CONFIRMED : 2
};

function initUIData(storeId) {

	$storeId = storeId;
	$storeData = $.ajax({
		url : "../storeData/getStoreDataById/" + $storeId,
		async : false,
		error : function(message) {
			hideLoadingDialog();
			showAlertDialog($.i18n.prop('string_huoQuHuanJingShuJuCuoWu'),
					message.responseText);
			return;
		}
	}).responseJSON;
	// lert($storeData.employee.unibizSid+"-"+$storeData.employee.unibizSessionId);
	for ( var i in $storeData.desks) {
		$deskMap[$storeData.desks[i].id] = $storeData.desks[i];
	}

	$deskByGroupNameMap[$.i18n.prop('string_quanBu')] = []; // $.i18n.prop('string_quanBu')
	for ( var i in $storeData.desks) {
		var desk = $storeData.desks[i];
		var deskGroupName = $.trim(desk.groupName);
		if ($deskByGroupNameMap[deskGroupName] == null) {
			$deskByGroupNameMap[deskGroupName] = [];
		}
		$deskByGroupNameMap[deskGroupName].push(desk);
		$deskByGroupNameMap[$.i18n.prop('string_quanBu')].push(desk);
	}

	for ( var i in $storeData.discountRules) {
		var discountRule = $storeData.discountRules[i];
		$discountRuleMap[discountRule.id] = discountRule;
	}
	for ( var i in $storeData.commonDishTags) {
		var dt = $storeData.commonDishTags[i];

		var groupName = dt.groupName;
		if (groupName == "") {
			groupName = "(" + $.i18n.prop('string_weiFenZu') + ")";
		}
		if (!$commonDishTagsByGroupNameMap[groupName]) {
			$commonDishTagsByGroupNameMap[groupName] = [];
		}
		$commonDishTagsByGroupNameMap[groupName].push(dt);
	}

	updateMenuDataHashMaps($storeData.menus);

	for ( var i in $storeData.dishUnits) {
		var du = $storeData.dishUnits[i];
		$dishUnitByNameMap[du.name] = du;
		if (!$dishUnitsByGroupIdMap[du.groupNumber]) {
			$dishUnitsByGroupIdMap[du.groupNumber] = [];
		}
		$dishUnitsByGroupIdMap[du.groupNumber].push(du);
	}

	for ( var i in $storeData.mealDealItems) {
		var md = $storeData.mealDealItems[i];
		$mealDealItemMap[md.id] = md;

		if (!$mealDealItemsByTargetDishIdMap[md.targetDishId]) {
			$mealDealItemsByTargetDishIdMap[md.targetDishId] = [];
		}
		$mealDealItemsByTargetDishIdMap[md.targetDishId].push(md);
	}
}

function updateMenuDataHashMaps(menus) {
	$dishCategoryMap = [];

	for (var i = 0; i < menus.length; i++) {
		for (var j = 0; j < $storeData.menus[i].dishCategories.length; j++) {
			var dishCategory = $storeData.menus[i].dishCategories[j];
			$dishCategoryMap[dishCategory.id] = dishCategory;
			for (var k = 0; k < dishCategory.dishes.length; k++) {
				var dish = dishCategory.dishes[k];
				$dishMap[dish.id] = dish;
				if (dish.editable && $defaultEditableDish == null) {
					$defaultEditableDish = dish;
				}

				if (dish.autoOrder) {
					$autoOrderDishMap[dish.id] = dish;
				}

				dish.quickIndexCode = "";
				if (dish.indexCode) {
					for (var l = 0; l < dish.indexCode.length; l++) {
						var str = dish.indexCode[l];
						if (str == "a" || str == "A" || str == "b"
								|| str == "B" || str == "c" || str == "C")
							dish.quickIndexCode += 2;
						else if (str == "d" || str == "D" || str == "e"
								|| str == "E" || str == "f" || str == "F")
							dish.quickIndexCode += 3;
						else if (str == "g" || str == "G" || str == "h"
								|| str == "H" || str == "i" || str == "I")
							dish.quickIndexCode += 4;
						else if (str == "j" || str == "J" || str == "k"
								|| str == "K" || str == "l" || str == "L")
							dish.quickIndexCode += 5;
						else if (str == "m" || str == "M" || str == "n"
								|| str == "N" || str == "o" || str == "O")
							dish.quickIndexCode += 6;
						else if (str == "p" || str == "P" || str == "q"
								|| str == "Q" || str == "r" || str == "R"
								|| str == "s" || str == "S")
							dish.quickIndexCode += 7;
						else if (str == "t" || str == "T" || str == "u"
								|| str == "U" || str == "v" || str == "V")
							dish.quickIndexCode += 8;
						else if (str == "w" || str == "W" || str == "x"
								|| str == "X" || str == "y" || str == "Y"
								|| str == "z" || str == "Z")
							dish.quickIndexCode += 9;
					}
				}
			}
		}
	}
}

function updateDynamicData(dishOrderSetChangedCallback, menuChangedCallback,
		errorCallback, selfDishOrderChangeCallback) {
	$
			.ajax({
				type : 'POST',
				url : "../storeData/getDynamicDataBriefByStoreId/" + $storeId,
				data : {
					lastMenuHash : $lastMenuHash,
					lastActiveDishOrderSetHash : $lastActiveDishOrderSetHash,
					lastBookingRecordsHash : $lastBookingRecordsHash,
					lastSelfDishOrdersHash : $lastSelfDishOrdersHash
				},
				dataType : "json",
				async : true,
				error : function(error) {
					if (new Date().getTime() - $lastSyncDynamicDataTime > 70000) {
						$("#syncDynamicDataState")
								.html(
										$.i18n
												.prop('string_lianJieZhongDuanShuJuTongBuShiBai'));
					}
					if (error.status == 200) {// session timeout
						showAlertDialog($.i18n.prop('string_tiShi'), $.i18n
								.prop('string_dengLuChaoShi'), function() {
							window.onbeforeunload = undefined;
							window.location.href = "../store/" + $storeId;
						});
					}
					if (errorCallback)
						errorCallback();
				},
				success : function(data) {
					$dynamicData = data;
					$lastSyncDynamicDataTime = new Date().getTime();
					$("#syncDynamicDataState").html("");

					if ($lastActiveDishOrderSetHash != $dynamicData.activeDishOrderSetHash) {
						$dishOrderBriefMap = {};
						$dishOrderBriefByDeskIdMap = {};
						for ( var i in $dynamicData.dishOrderBriefs) {
							var dob = $dynamicData.dishOrderBriefs[i];
							$dishOrderBriefMap[dob.dishOrderId] = dob;
							$dishOrderBriefByDeskIdMap[dob.deskId] = dob;
						}

						$lastActiveDishOrderSetHash = $dynamicData.activeDishOrderSetHash;

						if (dishOrderSetChangedCallback) {
							dishOrderSetChangedCallback();
						}
					}

					if ($lastMenuHash != $dynamicData.menuHash) {
						$dishCategoryBriefs = $dynamicData.dishCategoryBriefs;
						$lastMenuHash = $dynamicData.menuHash;

						if (!$isFirstUpdateDynamicData) {
							updateDishes();
						}

						if (menuChangedCallback) {
							menuChangedCallback();
						}

						$isFirstUpdateDynamicData = false;
					}

					if ($lastBookingRecordsHash != $dynamicData.bookingRecordsHash) {
						$lastBookingRecordsHash = $dynamicData.bookingRecordsHash;

						$bookingRecords = $dynamicData.bookRecords;
						setBookRecordReminders();
					}

					if ($lastSelfDishOrdersHash != $dynamicData.selfDishOrdersHash) {
						$lastSelfDishOrdersHash = $dynamicData.selfDishOrdersHash;

						$selfDishOrders = $dynamicData.selfDishOrders;
						setSelfDishOrderReminders();

						if (selfDishOrderChangeCallback) {
							selfDishOrderChangeCallback();
						}
					}
				}
			});
}

function updateDishes() {
	for ( var i in $dishCategoryBriefs) {
		var dcb = $dishCategoryBriefs[i];
		if ($dishCategoryMap[dcb.dishCategoryId]) {
			if ($dishCategoryMap[dcb.dishCategoryId].jsonHash != dcb.jsonHash) {
				updateDishCategory(dcb.dishCategoryId);
			}
		} else {
			updateDishCategory(dcb.dishCategoryId);
		}
	}
}

function forceUpdateDishes() {
	for ( var i in $dishCategoryBriefs) {
		var dcb = $dishCategoryBriefs[i];
		updateDishCategory(dcb.dishCategoryId);
	}
}

function updateDishCategory(dishCategoryId) {
	$.ajax({
		type : 'POST',
		url : "../storeData/getDishCategoryById/" + dishCategoryId,
		data : {},
		dataType : "json",
		async : false,
		success : function(dishCategory) {
			for ( var i in $storeData.menus) {
				if ($storeData.menus[i].id != dishCategory.menuId) {
					continue;
				}

				var dishCategories = [];
				for ( var j in $storeData.menus[i].dishCategories) {
					var dc = $storeData.menus[i].dishCategories[j];
					if (dc.id == dishCategory.id) {
						dishCategories.push(dishCategory);
					} else {
						dishCategories.push(dc);
					}
				}

				$storeData.menus[i].dishCategories = dishCategories;

				updateMenuDataHashMaps($storeData.menus);
			}
		}
	});
}

function updateDishOrderCache(dishOrder) {

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
	$dishOrderBriefMap[dob.dishOrderId] = dob;
	$dishOrderBriefByDeskIdMap[dob.deskId] = dob;

	$dishOrderMap[dishOrder.id] = dishOrder;
}

function mergeClientOrderItems(dishOrder) {
	if (!$curDishOrder || !dishOrder) {
		return;
	}
	if ($curDishOrder == null || !$curDishOrder.orderItems
			|| !dishOrder.orderItems || $curDishOrder.id != dishOrder.id) {
		return;
	}

	for ( var i in $curDishOrder.orderItems) {
		var orderItem = $curDishOrder.orderItems[i];
		if (orderItem.state == ORDER_ITEM_STATE.WAITING) {
			var notExist = true;
			if (orderItem.id != 0)
				for ( var i in dishOrder.orderItems) {
					var oi = dishOrder.orderItems[i];
					if (orderItem.id == oi.id)
						notExist = false;
				}
			if (notExist)
				dishOrder.orderItems.push(orderItem);
		}
	}

	updateDishOrderPrice(dishOrder);
}
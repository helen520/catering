var $storeId;
var $storeData;
var $dishMap = {};
var $mealDealItemMap = {};
var $mealDealItemsByTargetDishIdMap = {};
var $dishCategoryMap = {};
var $commonDishTagsByGroupNameMap = {};
var $dishUnitByNameMap = {};
var $dishUnitsByGroupIdMap = {};
var $curDishOrder;
var $member;
var $bookRecord;
var $autoOrderDishs = [];

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

function initUIData(storeId, openId) {

	$storeId = storeId;
	$storeData = $.ajax({
		url : "../demoWechat/getWechatSelfStoreDataById/" + $storeId,
		async : false,
		error : function(message) {
			hideLoadingDialog();
			showAlertDialog($.i18n.prop('string_huoQuHuanJingShuJuCuoWu'),
					message.responseText);
			return;
		}
	}).responseJSON;

	$member = $.ajax({
		url : "../member/getMemberByOpenId",
		data : {
			openId : openId,
		},
		async : false,
		error : function(message) {
			hideLoadingDialog();
			showAlertDialog($.i18n.prop('string_huoQuHuanJingShuJuCuoWu'),
					message.responseText);
			return;
		}
	}).responseJSON;

	$.ajax({
		type : 'POST',
		url : "../demoWechat/getDishOrderByOpenId",
		data : {
			openId : openId,
		},
		dataType : "json",
		async : false,
		error : function(error) {
			$curDishOrder = {};
			$curDishOrder.orderItems = [];
		},
		success : function(order) {
			$curDishOrder = order;
		}
	});

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

	updateMenuDataHashMaps($storeData.menus);

	$curDishOrder.storeId = $storeId;
	if ($bookRecordId != 0 && $bookRecordId != null) {
		$bookRecord = getBookRecordById($bookRecordId);
		if ($bookRecord == null && $curDishOrder.bookRecordId != null
				&& $curDishOrder.bookRecordId != 0) {
			$bookRecord = getBookRecordById($curDishOrder.bookRecordId);
		}
		if ($bookRecord != null) {
			$curDishOrder.bookRecordId = $bookRecordId;
			$curDishOrder.customerCount = $bookRecord.count;
			updateChangeCustomerCountAutoDish($bookRecord.count);
			$curDishOrder.expectedArriveTime = $bookRecord.expectedArriveTime;
		}
	}
}

function getBookRecordById(bookRecordId) {
	return $.ajax({
		url : "../book/getBookRecordsById",
		data : {
			bookRecordId : bookRecordId
		},
		async : false,
		error : function(message) {
			hideLoadingDialog();
			showAlertDialog($.i18n.prop('string_huoQuHuanJingShuJuCuoWu'),
					message.responseText);
			return;
		}
	}).responseJSON;
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
				if (dish.autoOrder) {
					$autoOrderDishs.push(dish);
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

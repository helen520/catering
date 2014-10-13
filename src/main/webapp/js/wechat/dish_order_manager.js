function newOrderItemFromDish(dish) {
	var orderItem = {
		id : 0,
		departmentId : dish.departmentId,
		dishId : dish.id,
		dishName : dish.name,
		orgUnit : dish.unit,
		unit : dish.unit,
		noOverallDiscount : dish.noDiscount,
		editable : dish.editable,
		dishPrice : dish.price,
		price : dish.price,
		noCustomerNote : dish.noCustomerNote,
		noCookingNote : dish.noCookingNote,
		amount : 1,
		hasMealDealItems : dish.hasMealDealItems,
		state : ORDER_ITEM_STATE.WAITING,
	};

	return orderItem;
}

function getOrderItemOrgPrice(dishOrder, orderItem) {

	var dish = $dishMap[orderItem.dishId];

	if (orderItem.state == ORDER_ITEM_STATE.CANCELLED) {
		return 0;
	}

	var dishPrice = dish.price;

	if (orderItem.mealDealItemId != null) {
		var mealDealItem = $mealDealItemMap[orderItem.mealDealItemId];
		dishPrice = mealDealItem.priceDelta;
	}

	var unitRatio = 1;
	var orgDishUnit = $dishUnitByNameMap[orderItem.orgUnit];
	var dishUnit = $dishUnitByNameMap[orderItem.unit];
	if (orgDishUnit && dishUnit) {
		if (orgDishUnit.groupNumber == dishUnit.groupNumber
				&& orgDishUnit.exchangeRate != 0) {
			unitRatio = dishUnit.exchangeRate / orgDishUnit.exchangeRate;
		}
	}
	dishPrice *= unitRatio;
	dishPrice = Math.round(dishPrice * 10) / 10;

	if (!orderItem.editable) {
		orderItem.dishPrice = dishPrice;
	} else {
		orderItem.unit = orderItem.orgUnit;
	}
	var orgPrice = orderItem.dishPrice * orderItem.amount;

	var oitList = orderItem.options;
	if (oitList != null) {
		for ( var i in oitList) {
			orgPrice += oitList[i].priceDelta * oitList[i].amount;
		}
	}
	oitList = orderItem.tags;
	if (oitList != null) {
		for ( var i in oitList) {
			orgPrice += oitList[i].priceDelta * oitList[i].amount;
		}
	}
	oitList = orderItem.freeTags;
	if (oitList != null) {
		for ( var i in oitList) {
			orgPrice += oitList[i].priceDelta * oitList[i].amount;
		}
	}

	orgPrice = Math.round(orgPrice * 10) / 10;
	return orgPrice;
}

function updateDishOrderPrice(dishOrder) {

	if (dishOrder.orderItems == null) {
		dishOrder.totalPrice = dishOrder.discountedPrice = 0;
		dishOrder.serviceFee = dishOrder.finalPrice = 0;
		return;
	}

	var totalPrice = 0;

	for ( var i in dishOrder.orderItems) {
		var oi = dishOrder.orderItems[i];
		oi.price = getOrderItemOrgPrice(dishOrder, oi);
		if (oi.state != ORDER_ITEM_STATE.CANCELLED) {
			totalPrice += oi.price;
		}
	}

	totalPrice = Math.round(totalPrice * 10) / 10.0;

	dishOrder.totalPrice = totalPrice;
	dishOrder.discountedPrice = totalPrice;
	dishOrder.finalPrice = totalPrice;
}

function getOrderItemOptionsText(orderItem) {
	var text = "";

	for ( var i in orderItem.options) {
		var orderItemTag = orderItem.options[i];
		text += $.trim(orderItemTag.name) + "[￥" + orderItemTag.priceDelta
				+ "]×" + orderItemTag.amount + ",";
	}
	return text.substring(0, text.length - 1);
}

function getOrderItemTagsText(orderItem) {
	var text = "";

	for ( var i in orderItem.tags) {
		var orderItemTag = orderItem.tags[i];
		text += $.trim(orderItemTag.name) + "[￥" + orderItemTag.priceDelta
				+ "]×" + orderItemTag.amount + ",";
	}
	for ( var i in orderItem.freeTags) {
		var orderItemTag = orderItem.freeTags[i];
		text += $.trim(orderItemTag.name) + "[￥" + orderItemTag.priceDelta
				+ "]×" + orderItemTag.amount + ",";
	}

	return text.substring(0, text.length - 1);
}

function getRandomNumber() {
	var randSeed = new Date().getTime();
	randSeed = ((randSeed * 9301 + 49297) % 233280) / (233280.0);
	return Math.ceil(randSeed * 100000);
}

function autoOrderingMealDealItems(dish, orderItem) {

	var clientTriggerId = getRandomNumber();
	orderItem.clientTriggerId = clientTriggerId;

	var mealDealItems = $mealDealItemsByTargetDishIdMap[dish.id];
	var mealDealItemByGroupNameMap = {};

	for ( var i in mealDealItems) {
		var mealDealItem = mealDealItems[i];
		var groupName = $.trim(mealDealItem.groupName);
		if (!mealDealItemByGroupNameMap[groupName]) {
			mealDealItemByGroupNameMap[groupName] = (mealDealItem);

			var mealDealItemOrderItem = newOrderItemFromDish(mealDealItem.sourceDish);
			mealDealItemOrderItem.dishPrice = 0;
			mealDealItemOrderItem.price = 0;
			mealDealItemOrderItem.mealDealItemId = mealDealItem.id;
			mealDealItemOrderItem.triggerId = clientTriggerId;
			$curDishOrder.orderItems.push(mealDealItemOrderItem);
		}
	}
}

function getDishOrderTagsText(dishOrder) {
	var text = "";

	for ( var i in dishOrder.tags) {
		var dishOrderTag = dishOrder.tags[i];
		text += $.trim(dishOrderTag.name) + "×" + dishOrderTag.amount + ",";
	}
	for ( var i in dishOrder.freeTags) {
		var dishOrderTag = dishOrder.freeTags[i];
		text += $.trim(dishOrderTag.name) + "×" + dishOrderTag.amount + ",";
	}

	return text.substring(0, text.length - 1);
}
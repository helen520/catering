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
		employeeId : $storeData.employee.id
	};

	return orderItem;
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
			mealDealItemOrderItem.amount = 0;
			mealDealItemOrderItem.mealDealItemId = mealDealItem.id;
			mealDealItemOrderItem.triggerId = clientTriggerId;
			$curDishOrder.orderItems.push(mealDealItemOrderItem);
		}
	}
}

function getRandomNumber() {
	var randSeed = new Date().getTime();
	randSeed = ((randSeed * 9301 + 49297) % 233280) / (233280.0);
	return Math.ceil(randSeed * 100000);
}

function getDishOrderCouponValue(dishOrder) {
	var couponValue = 0;

	if (dishOrder.payRecords) {
		for ( var i in dishOrder.payRecords) {
			var payRecord = dishOrder.payRecords[i];
			if (payRecord.paymentTypeId == null || payRecord.paymentTypeId == 0) {
				couponValue += payRecord.amount;
			}
		}
	}

	return couponValue;
}

function getMoneyToPayForDishOrder(dishOrder) {
	return dishOrder.finalPrice - getDishOrderCouponValue(dishOrder);
}

function updateDishOrderPrice(dishOrder) {

	if (dishOrder.orderItems == null) {
		dishOrder.totalPrice = dishOrder.discountedPrice = 0;
		dishOrder.serviceFee = dishOrder.finalPrice = 0;
		return;
	}

	var totalPrice = 0, discountedPrice = 0;

	updateMealDealItemsAmount(dishOrder);

	for ( var i in dishOrder.orderItems) {
		var oi = dishOrder.orderItems[i];

		oi.price = getOrderItemPrice(dishOrder, oi);
		if (oi.state != ORDER_ITEM_STATE.CANCELLED) {
			totalPrice += getOrderItemOrgPrice(dishOrder, oi);
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
	if ($curDishOrder.prePay != null && $curDishOrder.prePay > 0) {
		finalPrice = finalPrice - $curDishOrder.prePay;
	}

	if (finalPrice < 0) {
		finalPrice = 0;
	}

	dishOrder.finalPrice = Math.round(finalPrice);
}

function updateMealDealItemsAmount(dishOrder) {

	for ( var i in dishOrder.orderItems) {
		var oi = dishOrder.orderItems[i];

		if (oi.hasMealDealItems) {
			for ( var j in dishOrder.orderItems) {
				var mealDealItem = dishOrder.orderItems[j];
				if (mealDealItem.triggerId != null
						&& (mealDealItem.triggerId == oi.clientTriggerId || mealDealItem.triggerId == oi.id)) {
					mealDealItem.amount = oi.amount;
				}
			}
		}
	}
}

function getOrderItemOrgPrice(dishOrder, orderItem) {

	var desk = $deskMap[dishOrder.deskId];
	var chargeVIPFee = desk == null ? false : desk.chargeVIPFee;

	var dish = $dishMap[orderItem.dishId];

	if (dish == null) {
		return orderItem.price;
	}

	if (orderItem.state == ORDER_ITEM_STATE.CANCELLED) {
		return 0;
	}

	var dishPrice = dish.price;

	if (orderItem.mealDealItemId != null) {
		var mealDealItem = $mealDealItemMap[orderItem.mealDealItemId];

		if (mealDealItem != null) {
			dishPrice = mealDealItem.priceDelta;
		} else
			dishPrice = 0;
	}
	if (chargeVIPFee) {
		dishPrice += dish.vipfee;
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

function getOrderItemPrice(dishOrder, orderItem) {

	var price = getOrderItemOrgPrice(dishOrder, orderItem);

	var discountRule = null;
	if (orderItem.discountRuleId != null) {
		discountRule = $discountRuleMap[orderItem.discountRuleId];
	}

	if (discountRule == null) {
		if (!orderItem.noOverallDiscount) {
			price *= dishOrder.discountRate;
		}
	} else {
		price *= discountRule.discountRate;
		if (!discountRule.noOverallDiscount && !orderItem.noOverallDiscount) {
			price *= dishOrder.discountRate;
		}
		price -= discountRule.value;
	}

	price = Math.round(price * 10) / 10.0;
	price = price < 0 ? 0 : price;

	return price;
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
var OrderItem = {
	newFromDish : function(dish, customerCount) {
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

		customerCount = customerCount ? customerCount : 1;
		orderItem.amount = dish.amountPerCustomer != 0 ? customerCount
				* dish.amountPerCustomer : 1;
		return orderItem;
	},

	getOptionsText : function(orderItem) {
		var text = "";

		for ( var i in orderItem.options) {
			var orderItemTag = orderItem.options[i];
			text += $.trim(orderItemTag.name) + "[￥" + orderItemTag.priceDelta
					+ "]×" + orderItemTag.amount + ",";
		}
		return text.substring(0, text.length - 1);
	},

	getTagsText : function(orderItem) {
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
	},

	getOrgPrice : function(orderItem, chargeVIPFee, dish, mealDealItem,
			orgDishUnit, dishUnit) {

		if (dish == null) {
			return orderItem.price;
		}

		if (orderItem.state == ORDER_ITEM_STATE.CANCELLED) {
			return 0;
		}

		var dishPrice = dish.price;

		if (mealDealItem) {
			dishPrice = mealDealItem.priceDelta;
		}
		if (chargeVIPFee) {
			dishPrice += dish.vipfee;
		}

		var unitRatio = 1;
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
	},

	getOrderItemPrice : function(dishOrder, orderItem) {

		var price = new DishOrderManager().getOrderItemOrgPrice(orderItem,
				dishOrder.deskId);

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
};
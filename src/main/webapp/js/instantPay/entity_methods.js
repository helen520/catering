var DishOrder = {
	STATE : {
		PROCESSING : '1',
		PAID : '2',
		ARCHIVED : '3',
		CREATING : '4',
		CANCELLED : '5',
		PAYING : '6'
	},

	updatePrice : function(dishOrder) {

		if (dishOrder.orderItems == null) {
			dishOrder.totalPrice = dishOrder.discountedPrice = 0;
			dishOrder.serviceFee = dishOrder.finalPrice = 0;
			return;
		}

		var totalPrice = 0, discountedPrice = 0;

		for ( var i in dishOrder.orderItems) {
			var oi = dishOrder.orderItems[i];
			if (oi.id != 0) {
				oi.clientId = oi.id;
			}
			if (oi.triggerId) {
				oi.clientTriggerId = oi.triggerId;
			}

			OrderItem.updatePrice(oi, dishOrder);
			if (oi.state != OrderItem.STATE.CANCELLED) {
				totalPrice += oi.orgPrice;
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
		dishOrder.oddmentReduce = dishOrder.oddmentReduce ? dishOrder.oddmentReduce
				: 0;
		finalPrice = Math.round(finalPrice) - dishOrder.oddmentReduce;

		if (dishOrder.prePay != null && dishOrder.prePay > 0)
			finalPrice = finalPrice - dishOrder.prePay;

		if (finalPrice < 0)
			finalPrice = 0;

		if (!dishOrder.orgFinalPrice || finalPrice != dishOrder.orgFinalPrice) {
			finalPrice += dishOrder.oddmentReduce;
			dishOrder.oddmentReduce = 0;
			dishOrder.orgFinalPrice = finalPrice;
		}

		dishOrder.finalPrice = finalPrice;

		var actualPaid = 0;
		for ( var i in dishOrder.payRecords) {
			var payRecord = dishOrder.payRecords[i];
			var amount = payRecord.amount;
			if (payRecord.makeChange) {
				amount -= payRecord.change;
			}
			actualPaid += amount * payRecord.exchangeRate;
		}
		dishOrder.actualPaid = actualPaid;

		dishOrder.remainToPay = dishOrder.finalPrice - dishOrder.actualPaid;
	},

	getDishOrderToSubmit : function(dishOrder) {

		var dishOrderToSubmit = dishOrder;
		if (dishOrder.orderItems) {
			dishOrderToSubmit.order_items = [];
			for ( var i in dishOrder.orderItems) {
				var orderItem = dishOrder.orderItems[i];
				if (orderItem.id != 0) {
					continue;
				}

				var orderItemTags = [];
				if (orderItem.freeTag) {
					orderItemTags.push(orderItem.freeTag);
				}
				if (orderItem.options) {
					orderItemTags = $.merge(orderItemTags, orderItem.options);
				}
				if (orderItem.tags) {
					orderItemTags = $.merge(orderItemTags, orderItem.tags);
				}
				for ( var j in orderItemTags) {
					var oit = orderItemTags[j];
					orderItemTags[j] = oit;
				}
				orderItem.order_item_tags = orderItemTags;
				dishOrderToSubmit.order_items.push(orderItem);
			}
		}

		if (dishOrder.payRecords) {
			dishOrderToSubmit.pay_records = [];
			for ( var i in dishOrder.payRecords) {
				var payRecord = $.extend(true, {}, dishOrder.payRecords[i]);
				if (payRecord.makeChange) {
					payRecord.amount -= payRecord.change;
				}
				if (payRecord.id != 0) {
					continue;
				}

				dishOrderToSubmit.pay_records.push(payRecord);
			}
		}

		if (dishOrder.tags) {
			dishOrderToSubmit.dish_order_tags = [];
			for ( var i in dishOrder.tags) {
				var dishOrderTag = dishOrder.tags[i];
				if (dishOrderTag.id != 0) {
					continue;
				}
				dishOrderToSubmit.dish_order_tags.push(dishOrderTag);
			}
		}

		return dishOrderToSubmit;
	},

	getSubOrderItems : function(dishOrder, orderItem) {
		var subOrderItems = [];
		for (i in dishOrder.orderItems) {
			if (dishOrder.orderItems[i].clientTriggerId && orderItem.clientId) {
				if (dishOrder.orderItems[i].clientTriggerId == orderItem.clientId) {
					subOrderItems.push(dishOrder.orderItems[i]);
				}
			}
		}

		return subOrderItems;
	},

	getDishOrderedAmount : function(dishOrder, dish) {
		var amount = 0;

		if (dishOrder) {
			for ( var i in dishOrder.orderItems) {
				var orderItem = dishOrder.orderItems[i];
				if (orderItem.id == 0 && orderItem.dishId == dish.id
						&& !orderItem.clientTriggerId) {
					amount += orderItem.amount;
				}
			}
		}
		return amount;
	},

	getOrderedItem : function(dishOrder, dish) {
		if (dishOrder) {
			for ( var i in dishOrder.orderItems) {
				var orderItem = dishOrder.orderItems[i];
				if (orderItem.id == 0 && orderItem.dishId == dish.id
						&& !orderItem.clientTriggerId) {
					return orderItem;
				}
			}
		}
		return null;
	},

	getAllOrderItemsAmount : function(dishOrder) {
		var amount = 0;
		if (dishOrder) {
			for ( var i in dishOrder.orderItems) {
				var orderItem = dishOrder.orderItems[i];
				if (orderItem.state != OrderItem.STATE.CANCELLED)
					amount += orderItem.amount;

			}
		}
		return amount;
	},
};

var OrderItem = {

	STATE : {
		WAITING : '1',
		COOKING : '4',
		CANCELLED : '7',
		SERVED : '6'
	},

	newFromDish : function(dish, dishUnit, employee, customerCount) {
		var clientId = Math.ceil(Math.random() * 10e10);
		var orderItem = {
			id : 0,
			clientId : clientId,
			employeeId : null,
			departmentId : dish.departmentId,
			dishId : dish.id,
			dishName : dish.name,

			orgUnit : dish.unit,
			unit : dish.unit,
			noOverallDiscount : dish.noDiscount,

			editable : dish.editable,
			dishPrice : dish.price,
			dishVIPFee : dish.vipFee,
			price : dish.price,
			noCustomerNote : dish.noCustomerNote,
			noCookingNote : dish.noCookingNote,
			amount : 1,
			state : OrderItem.STATE.WAITING
		};

		orderItem.employeeId = employee ? employee.id : null;
		customerCount = customerCount ? customerCount : 1;
		orderItem.amount = dish.amountPerCustomer != 0 ? customerCount
				* dish.amountPerCustomer : 1;
		return orderItem;
	},

	getTagsText : function(orderItem) {
		var tags = $.extend(true, [], orderItem.tags);
		if (orderItem.orderItemTags) {
			tags = $.merge(tags, orderItem.orderItemTags);
		}

		return OrderItemTag.tagsToText($.merge(tags, [ orderItem.freeTag ]));
	},

	updatePrice : function(orderItem, dishOrder) {

		orderItem.orgPrice = OrderItem.getOrgPrice(orderItem,
				dishOrder.chargeVIPFee);
		var price = orderItem.orgPrice;

		var noOverallDiscount = orderItem.noOverallDiscount;
		if (orderItem.discountRuleId && orderItem.ruleDiscountOnly) {
			noOverallDiscount = true;
		}
		if (!noOverallDiscount) {
			price *= dishOrder.discountRate;
		}
		if (orderItem.discountRuleId) {
			price *= orderItem.ruleDiscountRate;
			price -= orderItem.ruleDiscountValue;
		}

		price = Math.round(price * 10) / 10.0;
		price = price < 0 ? 0 : price;

		orderItem.price = price;
	},

	getOrgPrice : function(orderItem, chargeVIPFee) {

		if (orderItem.state == OrderItem.STATE.CANCELLED) {
			return 0;
		}

		var dishPrice = orderItem.dishPrice;
		if (chargeVIPFee) {
			dishPrice += orderItem.dishVIPFee;
		}

		var unitRatio = 1;
		dishPrice *= unitRatio;
		dishPrice = Math.round(dishPrice * 10) / 10;

		var orgPrice = dishPrice * orderItem.amount;

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
		if (orderItem.freeTag) {
			orgPrice += orderItem.freeTag.priceDelta * orderItem.freeTag.amount;
		}

		orgPrice = Math.round(orgPrice * 10) / 10;
		return orgPrice;
	}
};

var OrderItemTag = {
	newFromDishTag : function(orderItem, dishTag) {
		var orderItemTag = {};

		orderItemTag.id = 0;
		orderItemTag.orderItemId = orderItem.id;
		orderItemTag.dishId = orderItem.dishId;
		orderItemTag.dishTagId = dishTag.id;
		orderItemTag.name = $.trim(dishTag.name);
		orderItemTag.unit = $.trim(dishTag.unit);
		orderItemTag.priceDelta = dishTag.priceDelta;
		orderItemTag.amount = 1;

		return orderItemTag;
	},

	newFreeTag : function(orderItem, name, priceDelta) {
		var orderItemTag = {};
		orderItemTag.orderItemId = orderItem.id;
		orderItemTag.dishTagId = null;
		orderItemTag.departmentId = orderItem.departmentId;
		orderItemTag.name = name;
		orderItemTag.unit = '';
		orderItemTag.priceDelta = priceDelta;
		orderItemTag.amount = 1;

		return orderItemTag;
	},

	tagsToText : function(tags) {
		text = "";

		for ( var i in tags) {
			var tag = tags[i];
			if (!tag) {
				continue;
			}

			text += $.trim(tag.name);
			if (tag.priceDelta > 0) {
				text += "[￥" + tag.priceDelta + "]";
			}
			if (tag.amount != 1) {
				text += 'x' + tag.amount;
			}
			text += ",";
		}

		return text.substring(0, text.length - 1);
	}
};

var DishOrderTag = {
	newFromDishTag : function(dishOrder, dishTag) {
		var dishOrderTag = {};

		dishOrderTag.id = 0;
		dishOrderTag.dishTagId = dishTag.id;
		dishOrderTag.dishOrderId = dishOrder.id;
		dishOrderTag.name = $.trim(dishTag.name);
		dishOrderTag.unit = $.trim(dishTag.unit);
		dishOrderTag.amount = 1;

		return dishOrderTag;
	},

	tagsToText : function(tags) {
		text = "";

		for ( var i in tags) {
			var tag = tags[i];
			if (!tag) {
				continue;
			}

			text += $.trim(tag.name);
			if (tag.amount != 1) {
				text += "x" + tag.amount;
			}
			text += ",";
		}

		return text.substring(0, text.length - 1);
	}
};

var PayRecord = {
	newFromPaymentType : function(paymentType, amount) {
		var payRecord = {};
		payRecord.id = 0;
		payRecord.depositCardId = null;
		payRecord.paymentTypeId = paymentType.id;
		payRecord.typeName = paymentType.name;
		payRecord.isBonus = false;
		if (paymentType.exchangeRate) {
			payRecord.exchangeRate = paymentType.exchangeRate;
		} else {
			payRecord.exchangeRate = 1;
		}

		amount = amount / payRecord.exchangeRate;
		if (paymentType.initValue > 0 && amount > paymentType.initValue) {
			payRecord.amount = paymentType.initValue;
		} else {
			payRecord.amount = amount;
		}
		payRecord.makeChange = true;
		payRecord.change = 0;

		return payRecord;
	},

	newFromDepositCard : function(depositCard, amount, isBonus) {
		var payRecord = {};
		payRecord.id = 0;
		payRecord.depositCardId = depositCard.id;
		payRecord.paymentTypeId = null;
		payRecord.typeName = $.i18n.prop('string_DepositCard');
		payRecord.exchangeRate = 1;
		payRecord.amount = amount;
		payRecord.isBonus = isBonus;
		payRecord.memo = depositCard.name;

		payRecord.makeChange = true;
		payRecord.change = 0;

		return payRecord;
	},

	refund : function(orgPayRecord, amount) {
		var payRecord = {};
		payRecord.id = 0;
		payRecord.depositCardId = orgPayRecord.depositCardId;
		payRecord.paymentTypeId = orgPayRecord.paymentTypeId;
		payRecord.typeName = orgPayRecord.typeName;
		payRecord.exchangeRate = -orgPayRecord.exchangeRate;
		payRecord.amount = amount;
		payRecord.isBonus = orgPayRecord.isBonus;

		payRecord.makeChange = true;
		payRecord.change = 0;

		return payRecord;
	}
};
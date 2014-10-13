function DishOrderPricePanel(container) {

	var uiDataManager = UIDataManager.getInstance();
	var dishOrderManager = DishOrderManager.getInstance();

	var discountRateDiv = $('<div>');
	var discountRateLabel = $('<label>');
	var serviceFeeRateDiv = $('<div>');
	var serviceFeeRateLabel = $('<label>');
	var priceInfoDiv = $('<div style="padding: .2em">');
	var totalPriceLabel = $('<label>');
	var finalPriceLabel = $('<label>');
	var serialNumberDiv = $('<div>');
	var serialNumberLabel = $('<label>');
	var actualPaidLabel = $('<label>');
	var dishOrderMemoText = $('<input type="text">');

	var init = function() {
		dishOrderManager.attachEvent('onCurrentDishOrderChanged', render);

		discountRateDiv.css('display', 'inline-block').css('margin-right',
				'1em').text($.i18n.prop('string_DiscountRate')).appendTo(
				container);
		discountRateLabel.addClass("button paymentType").css("width", "2em")
				.text("1").click(discountRateLabelClick).appendTo(
						discountRateDiv);
		function discountRateLabelClick() {
			var dishOrder = dishOrderManager.getCurrentDishOrder();
			if (!dishOrder) {
				return;
			}
			new NamedValueDialog('Discount Rate', dishOrder.discountRate,
					function(rateValue) {
						dishOrderManager.setDiscountRate(rateValue);
					}).show();
		}

		serviceFeeRateDiv.css('display', 'inline-block').text(
				$.i18n.prop('string_ServiceFeeRate')).appendTo(container);
		serviceFeeRateLabel.addClass("button paymentType").css("width", "2em")
				.text("0").click(serviceFeeRateLabelClick).appendTo(
						serviceFeeRateDiv);
		function serviceFeeRateLabelClick() {
			var dishOrder = dishOrderManager.getCurrentDishOrder();
			if (!dishOrder) {
				return;
			}
			new NamedValueDialog('Service Fee Rate', dishOrder.serviceFeeRate,
					function(rateValue) {
						dishOrderManager.setServiceFeeRate(rateValue);
					}).show();
		}

		// container.append(priceInfoDiv).append(actualPaidDiv).append(
		// $('<div>').append(dishOrderMemoText));

		container.append(priceInfoDiv);
		$('<span>').text($.i18n.prop('string_OriginalPrice')).appendTo(
				priceInfoDiv);
		totalPriceLabel.addClass("dishOrderDetailLabel").text("0.0").appendTo(
				priceInfoDiv);
		$('<span>').text($.i18n.prop('string_FinalPrice')).appendTo(
				priceInfoDiv);
		finalPriceLabel.addClass("button paymentType").css("width", "2em")
				.text("0.0").click(finalPriceLabelClick).appendTo(priceInfoDiv);
		function finalPriceLabelClick() {
			new AmountDialog($.i18n.prop('string_FinalPrice'), finalPriceLabel
					.text(), function(finalPrice) {
				dishOrderManager.setFinalPrice(finalPrice);
			}, false).show();
		}
		$('<div>').addClass("button").text($.i18n.prop('string_ReduceOddment'))
				.click(reduceOddmentButtonClick).appendTo(priceInfoDiv);
		function reduceOddmentButtonClick() {
			var dishOrder = dishOrderManager.getCurrentDishOrder();
			if (!dishOrder) {
				return;
			}

			var finalPrice = Math.floor(dishOrder.finalPrice / 5) * 5
			dishOrderManager.setFinalPrice(finalPrice);
		}

		serialNumberDiv.text($.i18n.prop('string_SerialNumber')).appendTo(
				container);
		serialNumberLabel.addClass("button paymentType").css("width", "2em")
				.text("0").click(serialNumberLabelClick).appendTo(
						serialNumberDiv);
		function serialNumberLabelClick() {
			new AmountDialog($.i18n.prop('string_SerialNumber'),
					serialNumberLabel.text(), function(serialNumber) {
						dishOrderManager.setSerialNumber(serialNumber);
					}, true).show();
		}

		$('<span>').text($.i18n.prop('string_ActualPaid')).appendTo(
				serialNumberDiv);
		actualPaidLabel.addClass("dishOrderDetailLabel").css("width", "2em")
				.text('0.0').appendTo(serialNumberDiv);

		render();
	};

	var render = function() {

		var dishOrder = dishOrderManager.getCurrentDishOrder();

		$("#dishOrderMemoInput").val("");

		var dishOrder = dishOrderManager.getCurrentDishOrder();
		if (dishOrder) {
			$("#dishOrderMemoInput").val(dishOrder.memo);

			if (dishOrder.discountRate) {
				discountRateLabel.text(dishOrder.discountRate);
			}
			if (dishOrder.serviceFeeRate) {
				serviceFeeRateLabel.text(dishOrder.serviceFeeRate);
			}
			if (dishOrder.serialNumber) {
				serialNumberLabel.text(dishOrder.serialNumber);
			}

			totalPriceLabel.text(dishOrder.totalPrice);
			finalPriceLabel.text(dishOrder.finalPrice);
			actualPaidLabel.text(dishOrder.actualPaid);
		} else {
			$("#dishOrderMemoInput").val('');

			discountRateLabel.text('1');
			serviceFeeRateLabel.text('0');
			serialNumberLabel.text('0');
			totalPriceLabel.text('0.0');
			finalPriceLabel.text('0.0');
			actualPaidLabel.text('0.0');
		}
	};

	init();
}
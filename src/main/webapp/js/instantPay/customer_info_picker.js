function CustomerInfoPicker(container, dishOrder) {

	var showCoupon = function(container, coupon) {
		var couponItemLi = $('<li>').addClass("power");

		var articalTitle = $('<article>').click(showCouponDetailInfo).data(
				"couponId", coupon.id);
		function showCouponDetailInfo() {
			var couponId = $(this).data("couponId");
			var coupondetailDiv = $(this).parent().find(
					"#coupondetailDiv_" + couponId);
			coupondetailDiv.toggle();
		}

		$('<span>').text(coupon.title).css("float", "left").appendTo(
				articalTitle);
		if (coupon.state == 0) {
			$('<span>').text($.i18n.prop('string_zhuangTaiYouXiao')).css(
					"float", "right").appendTo(articalTitle);
		} else if (coupon.state == 1) {
			$('<span>').text($.i18n.prop('string_zhuangTaiYiShiYong')).css(
					"float", "right").appendTo(articalTitle);
			var payRecord = {};
			payRecord.typeName = $.i18n.prop('string_youHuiQuan');
			payRecord.exchangeRate = 1;
			payRecord.amount = coupon.value;
			payRecord.isPrepaid = false;
			payRecord.couponId = coupon.id;
			dishOrder.payRecords.push(payRecord);
		}
		$('<div>').css("clear", "both").appendTo(articalTitle);
		articalTitle.appendTo(couponItemLi);

		var coupondetailDiv = $('<div>').attr("id",
				"coupondetailDiv_" + coupon.id).css("display", "none");
		if (coupon.state == 0) {
			$('<div>').text($.i18n.prop('string_liJiShiYong')).addClass("use")
					.click(couponOperationButtonClick).data("couponId",
							coupon.id).appendTo(coupondetailDiv);
		} else if (coupon.state == 1) {
			$('<div>').text($.i18n.prop('string_quXiaoShiYong'))
					.addClass("use").click(couponOperationButtonClick).data(
							"couponId", coupon.id).appendTo(coupondetailDiv);
		}

		function couponOperationButtonClick() {
			var couponId = $(this).data("couponId");
			userCouponCallBack(couponId);
		}

		$('<b>').text($.i18n.prop('string_xiangXiShuoMing')).appendTo(
				coupondetailDiv);

		var coupondetailUl = $('<ul>');
		$('<li>').text(
				$.i18n.prop('string_youXiaoQi') + ":" + coupon.startDateStr
						+ $.i18n.prop('string_zhi') + coupon.validDate)
				.appendTo(coupondetailUl);
		if (coupon.value > 0) {
			$('<li>').text($.i18n.prop('string_keDiXiao') + ":" + coupon.value)
					.appendTo(coupondetailUl);
		}
		$('<li>').html(coupon.text).appendTo(coupondetailUl);

		coupondetailUl.appendTo(coupondetailDiv);
		coupondetailDiv.appendTo(couponItemLi);
		couponItemLi.appendTo(container);
	};

	this.show = function() {
		container.empty();

		var customer = dishOrder.customer;
		if (!customer) {
			return;
		}

		var customerInfoDiv = $('<div>');
		$('<label>').text(
				$.i18n.prop('string_Name') + ":" + customer.name + " "
						+ $.i18n.prop('string_Mobile') + ":" + customer.mobile
						+ " " + $.i18n.prop('string_MembershipCardNo') + ":"
						+ customer.membership_card_no
						+ $.i18n.prop('string_Balance')
						+ customer.prepay_balance).appendTo(customerInfoDiv);
		$('<div>').addClass("button").text($.i18n.prop('string_IssueCoupon'))
				.click(function() {
					new IssueCouponDialog(customer.id).show();
				}).appendTo(customerInfoDiv);

		var customerCouponsUl = $('<ul>').addClass("round");
		var coupons = customer.coupons;
		if (coupons) {
			for ( var i in coupons) {
				var coupon = coupons[i];
				showCoupon(customerCouponsUl, coupon);
			}
		}
		customerCouponsUl.appendTo(customerInfoDiv);
		customerInfoDiv.appendTo(container);
	};
}
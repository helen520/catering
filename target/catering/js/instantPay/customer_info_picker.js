function CustomerInfoPicker(customerInfoPickerContainer, dishOrder, customer,
		couponSentCountByTemplateIdDict, userCouponCallBack) {

	var uiDataManager = UIDataManager.getInstance();
	customerInfoPickerContainer.empty();
	dishOrder.payRecords = [];
	if (customer) {
		var customerInfoDiv = $('<div>');
		$('<label>').text(
				$.i18n.prop('string_xingMing') + ":" + customer.name + " "
						+ $.i18n.prop('string_dianHua') + ":"
						+ customer.mobileNo + " " + $.i18n.prop('string_kaHao')
						+ ":" + customer.memberCardNo + " 余额:"
						+ customer.balance).appendTo(customerInfoDiv);
		$('<div>').addClass("button").text($.i18n.prop('string_faYouHuiQuan'))
				.click(showSendCouponDialog).appendTo(customerInfoDiv);

		var customerCouponsUl = $('<ul>').addClass("round");
		var coupons = customer.coupons;
		if (coupons) {
			for ( var i in coupons) {
				var coupon = coupons[i];
				var couponItemLi = $('<li>').addClass("power");

				var articalTitle = $('<article>').click(showCouponDetailInfo)
						.data("couponId", coupon.id);
				$('<span>').text(coupon.title).css("float", "left").appendTo(
						articalTitle);
				if (coupon.state == 0) {
					$('<span>').text($.i18n.prop('string_zhuangTaiYouXiao'))
							.css("float", "right").appendTo(articalTitle);
				} else if (coupon.state == 1) {
					$('<span>').text($.i18n.prop('string_zhuangTaiYiShiYong'))
							.css("float", "right").appendTo(articalTitle);
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
					$('<div>').text($.i18n.prop('string_liJiShiYong'))
							.addClass("use").click(couponOperationButtonClick)
							.data("couponId", coupon.id).appendTo(
									coupondetailDiv);
				} else if (coupon.state == 1) {
					$('<div>').text($.i18n.prop('string_quXiaoShiYong'))
							.addClass("use").click(couponOperationButtonClick)
							.data("couponId", coupon.id).appendTo(
									coupondetailDiv);
				}
				$('<b>').text($.i18n.prop('string_xiangXiShuoMing')).appendTo(
						coupondetailDiv);

				var coupondetailUl = $('<ul>');
				$('<li>').text(
						$.i18n.prop('string_youXiaoQi') + ":"
								+ coupon.startDateStr
								+ $.i18n.prop('string_zhi') + coupon.validDate)
						.appendTo(coupondetailUl);
				if (coupon.value > 0) {
					$('<li>')
							.text(
									$.i18n.prop('string_keDiXiao') + ":"
											+ coupon.value).appendTo(
									coupondetailUl);
				}
				$('<li>').html(coupon.text).appendTo(coupondetailUl);

				coupondetailUl.appendTo(coupondetailDiv);
				coupondetailDiv.appendTo(couponItemLi);
				couponItemLi.appendTo(customerCouponsUl);
			}

			function showCouponDetailInfo() {
				var couponId = $(this).data("couponId");
				var coupondetailDiv = $(this).parent().find(
						"#coupondetailDiv_" + couponId);
				coupondetailDiv.toggle();
			}

			function couponOperationButtonClick() {
				var couponId = $(this).data("couponId");
				userCouponCallBack(couponId);
			}
		}
		customerCouponsUl.appendTo(customerInfoDiv);
		customerInfoDiv.appendTo(customerInfoPickerContainer);

		function showSendCouponDialog() {
			var couponListPanel = $('<div>').addClass("singleChoicePanel")
					.appendTo("body");
			var dialog = $(couponListPanel).modal();
			var contentDiv = $('<div>').addClass("orderItemCmdPanelContent")
					.addClass("overthrow").appendTo(couponListPanel);

			getCouponTemplateListView(contentDiv);
			var bottomDiv = $('<div>').addClass("orderItemCmdPanelBottomDiv");
			bottomDiv.appendTo(couponListPanel);

			$('<div>').text($.i18n.prop('string_guanBi')).addClass("button")
					.click(function() {
						dialog.close();
					}).appendTo(bottomDiv);

			$('<div>').addClass("button").text($.i18n.prop('string_faQuan'))
					.css("margin-left", "10px").click(sentCouponClick)
					.appendTo(bottomDiv);

			function sentCouponClick() {
				var couponTemplates = couponSentCountByTemplateIdDict[customer.id][0];
				var postData = {
					userAccountId : customer.id,
					storeId : storeId,
					employeeId : uiDataManager.getStoreData().employee.id,
					couponTemplatesJsonText : JSON.stringify(couponTemplates)
				};

				couponSentCountByTemplateIdDict[customer.id] = [];
				couponSentCountByTemplateIdDict[customer.id].push($.ajax({
					url : "../member/sendCoupons",
					type : "POST",
					data : postData,
					dataType : 'json',
					async : false,
					error : function(error) {

						if (error.status == 403) {
							new AlertDialog($.i18n.prop('string_cuoWu'),
									"权限不足,无法进行操作!").show();
							return;
						}
						new AlertDialog($.i18n.prop('string_cuoWu'),
								error.responseText).show();
					},
					success : function(dishOrder) {
					}
				}).responseJSON);
				getCouponTemplateListView(contentDiv);
			}

			function getCouponTemplateListView(contentDiv) {

				contentDiv.empty();
				var couponTemplates = couponSentCountByTemplateIdDict[customer.id][0];
				if (!couponTemplates) {
					return;
				}
				for ( var i in couponTemplates) {
					var couponTemplate = couponTemplates[i];
					var couponTemplateItemDiv = $('<div>').addClass(
							"couponTemplateItem");

					var couponTemplateItemTopDiv = $('<div>');
					$('<span>').text(
							couponTemplate.title + " 可抵扣:"
									+ couponTemplate.value).appendTo(
							couponTemplateItemTopDiv);
					if (couponTemplate.alreadySendAmount > 0) {
						$('<label>').text(
								$.i18n.prop('string_yiFa')
										+ couponTemplate.alreadySendAmount
										+ $.i18n.prop('string_zhang'))
								.addClass("dishOrderDetailLabel").appendTo(
										couponTemplateItemTopDiv);
					}

					var couponTemplateItemOperationDiv = $('<div>').addClass(
							"couponTemplateItemOperation");
					$('<div>').addClass("button").data("couponTemplate",
							couponTemplate).text("-").click(function() {
						var couponTemplate = $(this).data("couponTemplate");
						if (couponTemplate.amount > 0) {
							couponTemplate.amount -= 1;
						}
						getCouponTemplateListView(contentDiv);
					}).appendTo(couponTemplateItemOperationDiv);
					$('<label>').addClass("dishOrderDetailLabel").text(
							couponTemplate.amount).appendTo(
							couponTemplateItemOperationDiv);
					$('<div>').addClass("button").text("+").data(
							"couponTemplate", couponTemplate).click(function() {
						var couponTemplate = $(this).data("couponTemplate");
						couponTemplate.amount += 1;
						getCouponTemplateListView(contentDiv);
					}).appendTo(couponTemplateItemOperationDiv);
					couponTemplateItemOperationDiv
							.appendTo(couponTemplateItemTopDiv);

					$('<div>').css("clear", "both").appendTo(
							couponTemplateItemTopDiv);

					couponTemplateItemTopDiv.appendTo(couponTemplateItemDiv);
					$('<div>').html(
							$.i18n.prop('string_xiangQingShuoMing')
									+ couponTemplate.text).appendTo(
							couponTemplateItemDiv);

					couponTemplateItemDiv.appendTo(contentDiv);
				}
			}
		}
	}
}
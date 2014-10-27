function CustomerManager() {
	var self = this;

	var eventHandlers = {};

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

	var uiDataManager = UIDataManager.getInstance();

	this.searchCustomer = function(keyword, successCallback) {
		var loadingDialog = new LoadingDialog($.i18n.prop('string_Loading'));
		loadingDialog.show();

		$.ajax({
			type : 'POST',
			url : "../member/getMemberListByPhoneOrCardNo",
			data : {
				keyword : keyword,
				storeId : $storeId
			},
			dataType : "json",
			error : function() {
				loadingDialog.hide();
				new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
						.prop('string_Error')).show();
			},
			success : function(customers) {
				loadingDialog.hide();
				if (successCallback) {
					successCallback(customers);
				}
			}
		});
	};

	this.getCustomerDetails = function(customer_id, successCallback) {
		var loadingDialog = new LoadingDialog($.i18n.prop('string_Loading'));
		loadingDialog.show();

		$.ajax({
			type : 'POST',
			url : "../member/getMemberById",
			data : {
				userAccountId : customer_id,
			},
			dataType : "json",
			error : function() {
				loadingDialog.hide();
				new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
						.prop('string_Error')).show();
			},
			success : function(customer) {
				loadingDialog.hide();
				if (successCallback) {
					successCallback(customer);
				}
			}
		});
	};

	this.issueCoupon = function(couponTemplateId, customerId, successCallback) {
		var loadingDialog = new LoadingDialog($.i18n.prop('string_Loading'));
		loadingDialog.show();

		$.ajax({
			type : 'POST',
			url : "../member/sendCouponsByCouponTemplateId",
			data : {
				userAccountId : customer_id,
				couponTemplateId : couponTemplateId,
				employeeId : uiDataManager.getStoreData().employee.id,
				storeId : $storeId
			},
			dataType : "json",
			error : function() {
				loadingDialog.hide();
				new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
						.prop('string_Error')).show();
			},
			success : function(coupons) {
				loadingDialog.hide();
				if (successCallback) {
					successCallback(coupons);
				}
			}
		});
	};
}

CustomerManager.getInstance = function() {
	if (typeof (CustomerManager._instance) == "undefined") {
		CustomerManager._instance = new CustomerManager();
	}

	return CustomerManager._instance;
};

function WorkConsole(storeId) {
	var self = this;

	var uiDataManager = UIDataManager.getInstance();
	var dishOrderManager = DishOrderManager.getInstance();

	var dishView = null;
	var checkoutView = null;

	var init = function() {
//		window.onbeforeunload = function() {
//			return "刷新页面或返回都会丢失当前操作!或关闭页面!\n\t注销登录请直接按离开此页面!";
//		};

		$.i18n.properties({
			name : 'strings',
			path : '../resources/instantPay/',
			mode : 'map'
		});

		$.i18n.properties({
			name : 'elementTexts',
			path : '../resources/instantPay/',
			mode : 'map'
		});

		uiDataManager.attachEvent('onDataLoaded', uiDataManagerDataLoaded);
		uiDataManager.loadData(storeId);

		function uiDataManagerDataLoaded() {
			UnibizProxy.getInstance();
			
			dishView = new DishView($("#dishView"), uiDataManager);
			checkoutView = new CheckoutView($("#checkoutView"), uiDataManager);
			self.switchToView("DISH_VIEW");
		}

		dishOrderManager.attachEvent('onDishOrderSubmitted', function() {
			self.switchToView('CHECKOUT_VIEW');
		});

		dishOrderManager.attachEvent('onOrderCheckedOut', function() {
			self.switchToView('DISH_VIEW');
		});

		checkoutView.attachEvent('cancelCheckedOut', function() {
			self.switchToView('DISH_VIEW');
		});

	};

	this.switchToView = function(toView) {

		dishView.hide();
		checkoutView.hide();

		if (toView == "DISH_VIEW") {
			dishView.show();
		}
		if (toView == "CHECKOUT_VIEW") {
			checkoutView.show();
		}
	};

	init();
}

function StringBuilder() {
	var _string = new Array();
	this.append = function(args) {
		if (typeof (args) != "object") {
			_string.push(args);
		} else {
			_string = _string.concat(args);
		}
	};
	this.toString = function() {
		return _string.join("");
	};
}

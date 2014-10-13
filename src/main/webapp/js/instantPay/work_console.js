function WorkConsole() {
	var self = this;

	var uiDataManager = UIDataManager.getInstance();
	var dishOrderManager = DishOrderManager.getInstance();
	var dishOrderCache = DishOrderCache.getInstance();

	var dishView = null;
	var checkoutView = null;
	var dishOrderListView = null;

	var init = function() {
		jQuery.i18n.properties({
			name : 'strings', // 资源文件名称
			path : '../resources/i18n/', // 资源文件路径
			mode : 'map', // 用Map的方式使用资源文件中的值
		});
		uiDataManager.attachEvent('onDataLoaded', uiDataManagerDataLoaded);
		uiDataManager.loadData();

		function uiDataManagerDataLoaded() {
			dishOrderCache.loadMyDishOrders();

			dishView = new DishView($("#dishView"));
			checkoutView = new CheckoutView($("#checkoutView"));
			dishOrderListView = new DishOrderListView($("#dishOrderListView"));

			dishView.attachEvent('onSwitchViewCommand',
					SwitchViewCommandHandler);
			dishOrderListView.attachEvent('onSwitchViewCommand',
					SwitchViewCommandHandler);
			checkoutView.attachEvent('onSwitchViewCommand',
					SwitchViewCommandHandler);
			function SwitchViewCommandHandler(viewName) {
				self.switchToView(viewName);
			}

			self.switchToView("DISH_VIEW");
		}

		dishOrderManager.attachEvent('onDishOrderPaid', function(dishOrder) {
			dishOrderCache.updateDishOrderCache(dishOrder);
			dishOrderManager.setCurrentDishOrder(null);

			self.switchToView('DISH_VIEW');
		});
	};

	this.switchToView = function(toView) {

		dishView.hide();
		checkoutView.hide();
		dishOrderListView.hide();

		if (toView == "DISH_VIEW")
			dishView.show();

		if (toView == "CHECKOUT_VIEW")
			checkoutView.show();

		if (toView == "DISH_ORDER_LIST_VIEW")
			dishOrderListView.show();
	};

	init();
}

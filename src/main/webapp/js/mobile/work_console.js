var $isEditing = false;
var $isDesktop = false;
var $needEmployeeCheck = false;

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

$(function() {

	loadProperties();

	showLoadingDialog($.i18n.prop('string_tongBuZhong'));
	var index = window.location.pathname.lastIndexOf("/");
	storeId = window.location.pathname.substring(index + 1);
	initUIData(storeId);

	initDeskView();
	initDishView();
	initDishOrderView();
	initCheckoutView();
	switchToView("DESK_VIEW");

	updateDynamicData(function() {
		refreshDeskViewUI();
		hideLoadingDialog();
	});
	window.setInterval(cronJob, 30 * 1000);

	if (window.location.pathname.indexOf("dishView") >= 0
			|| window.location.pathname.indexOf("dishOrderView") >= 0) {
		$curDishOrder = $dishOrderForTest;
	}
	// TODO for test, will remove
	if (window.location.pathname.indexOf("dishView") >= 0) {
		switchToView("DISH_VIEW");
	}
	// TODO for test, will remove
	if (window.location.pathname.indexOf("dishOrderView") >= 0) {
		switchToView("DISH_ORDER_VIEW");
	}
});

XBack.listen(function() {
	window.opener = null;
	window.open('', '_self');
	window.close();
});

window.onbeforeunload = onbeforeunload_handler;
function onbeforeunload_handler() {
	return $.i18n
			.prop('string_shuaXinYeMianHuoFanHuiDouHuiDiuShiDangQianCaoZuoHuoGuanBiYeMianZhuXiaoDengLuQingZhiJieAnLiKaiCiYeMian');
}

function cronJob() {
	updateDynamicData(function() {
		refreshDeskViewUI();
	}, function() {
		if (dishPicker != null)
			dishPicker.refreshUI();
		renderMenu();
	});
}

function switchToView(toView) {

	$("#deskView").hide();
	$("#dishView").hide();
	$("#dishOrderView").hide();
	$("#checkoutView").hide();

	$curCustomer = null;
	if (toView == "DESK_VIEW") {
		$isEditing = false;
		showDeskView();
	} else if (toView == "DISH_VIEW") {
		$isEditing = true;
		showDishView();
	} else if (toView == "DISH_ORDER_VIEW") {
		$isEditing = true;
		showDishOrderView();
	} else if (toView == "CHECKOUT_VIEW") {
		$isEditing = true;
		showCheckoutView();
	} else {
		$isEditing = true;
	}
}

function loadProperties() {
	jQuery.i18n
			.properties({
				name : 'strings', // 资源文件名称
				path : '../resources/i18n/', // 资源文件路径
				mode : 'map', // 用Map的方式使用资源文件中的值
			});
}
var $isEditing = false;
var $isDesktop = true;
var $needEmployeeCheck = true;
var $templeEmployee = null;

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

XBack.listen(function() {
	window.opener = null;
	window.open('', '_self');
	window.close();
});

window.onbeforeunload = onbeforeunload_handler;
function onbeforeunload_handler() {
	return "刷新页面或返回都会丢失当前操作!或关闭页面!\n\t注销登录请直接按离开此页面!";
}

$(function() {

	var width = $(window).width();
	var index = window.location.pathname.lastIndexOf("/");
	storeId = window.location.pathname.substring(index + 1);
	// if (width < 780) {
	// window.location.href = "../store/" + storeId;
	// return;
	// }

	loadProperties();

	showLoadingDialog($.i18n.prop('string_tongBuZhong'));
	index = window.location.href.indexOf("isCashier");
	if (index > 0)
		$needEmployeeCheck = false;
	initUIData(storeId);

	initDeskView();
	initDishView();
	initCheckoutView();
	switchToView("DESK_VIEW");

	updateDynamicData(function() {
		refreshDeskViewUI();
		hideLoadingDialog();
	});
	window.setInterval(cronJob, 30 * 1000);
});

function cronJob() {
	updateDynamicData(function() {
		refreshDeskViewUI();
	}, function() {
		if (dishPicker != null)
			dishPicker.refreshUI();
	});
}

function switchToView(toView) {

	$("#deskView").hide();
	$("#dishView").hide();
	$("#checkoutView").hide();
	$("#loginInfoDiv").hide();

	if (toView == "DESK_VIEW") {
		$isEditing = false;
		$("#loginInfoDiv").show();
		showDeskView();
	} else if (toView == "DISH_VIEW") {
		$isEditing = true;
		showDishView();
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
				callback : function() {
					// desktop
					// checkout_view.jsp
					$("#bindMemberButton").text(
							$.i18n.prop('string_guanLianHuiYuan'));
					$("#confirmCheckoutButton").text(
							$.i18n.prop('string_queRenFuKuan'));
					$("#prePrintCheckoutBillButton").text(
							$.i18n.prop('string_yuDaJieZhangDan'));
					$("#cancelCheckoutButton").text(
							$.i18n.prop('string_quXiaoFuKuan'));
					$("#yiDianCaiPinLieBiao").text(
							$.i18n.prop('string_yiDianCaiPinLieBiao'));
					// desk_view.jsp
					$("#functionMenuButton")
							.text($.i18n.prop('string_gengDuo'));
					$("#statInfoPanel .caption")
							.text(
									$.i18n
											.prop('string_qingXuanZeTaiHaoYiJinXingCaoZuo'));
					$("#createDishOrderButton").text(
							$.i18n.prop('string_kaiTai'));
					$("#orderDishesButton").text($.i18n.prop('string_dianCai'));
					$("#payDishOrderButton").text(
							$.i18n.prop('string_jieZhang'));
					$("#changeDeskButton").text($.i18n.prop('string_zhuanTai'));
					$("#mergeDishOrderButton").text(
							$.i18n.prop('string_bingDan'));
					$("#reprintCustomerNoteButton").text("重打楼面单");
					$("#printCustomerNoteButton").text(
							$.i18n.prop('string_daLouMianDan'));
					// dish_view.jsp
					$("#dv_string_deskNum").text($.i18n.prop('string_zhuoHao'));
					$("#dv_string_renShu").text($.i18n.prop('string_renShu'));
					$("#dv_string_total_price").text(
							$.i18n.prop('string_zongJia'));
					$("#cancelDishOrderButton").text(
							$.i18n.prop('string_quXiao'));
					$("#dishOrderTagsButton").text(
							$.i18n.prop('string_zhengDanZuoFa'));
					$("#submitDishOrderButton").text(
							$.i18n.prop('string_queRenXiaDan'));

				}
			});
}
var $isEditing = false;
var $isDesktop = false;
var $needEmployeeCheck = false;
var $isWechatSelf = true;
var $openId;
var $bookRecordId;

function get_url_param(name) {
	if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)'))
			.exec(location.search))
		return decodeURIComponent(name[1]);
}

$(function() {
	loadProperties();
	showLoadingDialog($.i18n.prop('string_tongBuZhong'));
	var index = window.location.pathname.lastIndexOf("/");
	storeId = window.location.pathname.substring(index + 1);
	$openId = get_url_param("openId");
	$bookRecordId = get_url_param("bookRecordId");
	var curView = get_url_param("view");
	initUIData(storeId, $openId);

	initDishView();
	initDishOrderView();
	initCheckouView();
	if (curView)
		switchToView(curView);
	else
		switchToView("DISH_VIEW");

	hideLoadingDialog();
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

function initCheckouView() {
	$("#checkoutReturnButton").click(
			function() {
				location.href = "./" + $storeId + "?openId=" + $openId
						+ "&view=DISH_ORDER_VIEW";
			});
}

function switchToView(toView) {

	$("#dishView").hide();
	$("#dishOrderView").hide();
	$("#checkoutView").hide();

	if (toView == "DISH_VIEW") {
		showDishView();
	} else if (toView == "DISH_ORDER_VIEW") {
		showDishOrderView();
	} else if (toView == "CHECKOUT_VIEW") {
		showCheckoutView();
	}
}

function loadProperties() {
	jQuery.i18n
			.properties({
				name : 'strings', // 资源文件名称
				path : '../resources/i18n/', // 资源文件路径
				mode : 'map', // 用Map的方式使用资源文件中的值
				callback : function() {
					// wechat
					// checkout_view.jsp
					$("#bindMemberButton").text(
							$.i18n.prop('string_guanLianHuiYuan'));
					$("#yiDianCaiPinLieBiao").text(
							$.i18n.prop('string_yiDianCaiPinLieBiao'));
					$("#confirmCheckoutButton").text(
							$.i18n.prop('string_queRenFuKuan'));
					$("#prePrintCheckoutBillButton").text(
							$.i18n.prop('string_yuDaJieZhangDan'));
					$("#cancelCheckoutButton").text(
							$.i18n.prop('string_quXiaoFuKuan'));
					// dish_order_view.jsp
					$("#dov_string_deskNum")
							.text($.i18n.prop('string_zhuoHao'));
					$("#dov_string_renShu").text($.i18n.prop('string_renShu'));
					$("#dov_string_total_price").text(
							$.i18n.prop('string_zongJia'));
					$("#returnToDishViewButton").text(
							$.i18n.prop('string_fanHui'));
					$("#dishOrderTagsButton").text(
							$.i18n.prop('string_zhengDanZuoFa'));
					$("#submitDishOrderButton").text(
							$.i18n.prop('string_xiaDan'));
					// dish_view.jsp
					$("#dv_string_search_str").text(
							$.i18n.prop('string_chaZhao'));
					$("#searchDishButton").text($.i18n.prop('string_souSuo'));
					$("#clearDishFilterButton").text(
							$.i18n.prop('string_qingKong'));
					$("#cancelDishOrderButton").text(
							$.i18n.prop('string_quXiao'));
					$("#confirmDishOrderButton").text(
							$.i18n.prop('string_yiDian'));
				}
			});
}
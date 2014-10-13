$(function() {
	$("#prePayDishOrderButton").click(prePayDishOrderButtonOnClick);
});

function showCheckoutView() {
	drawCheckoutInfos();
	$("#checkoutView").show();
}

function drawCheckoutInfos() {
	if ($member != null) {
		$("#balance").text($member.balance);
		$("#prePay_dishOrder_price").text($curDishOrder.finalPrice.toFixed(1));
	} else {
		$("#prePay_infos").empty();
		$("#prePay_infos").text("不存在用户无法进行操作!!!");
	}
}

function prePayDishOrderButtonOnClick() {

	var prePayPrice = Number($("#prePay_price").val());
	if (prePayPrice == "" || prePayPrice == null
			|| prePayPrice < ($curDishOrder.finalPrice.toFixed(1) * 0.3)
			|| prePayPrice > $member.balance) {
		showAlertDialog("提示", "您的输入的预付款金额有误或小余订单总价的30%或你的余额不够支付当前订单预付款!请重新输入!");
		return;
	}

	if (prePayPrice > $curDishOrder.finalPrice.toFixed(1)) {
		prePayPrice = $curDishOrder.finalPrice.toFixed(1);
	}

	$curDishOrder.prePay = prePayPrice;
	$curDishOrder.userAccountId = $member.id;

	submitDishOrder(true);
}
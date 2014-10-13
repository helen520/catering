var shiftClassDialog;
function showShiftClassDialog() {

	shiftClassDialog = $("#dialog-shiftClass").modal();
	drawReportInfo();
}

function drawReportInfo() {
	$("#shiftClassTotalIncome").text($.i18n.prop('string_zongShouRu'));
	var tr=$("#shiftClassTotalIncomeTr").get(0);
	tr.children[0].innerText=$.i18n.prop('string_dingDanShu');
	tr.children[1].innerText=$.i18n.prop('string_zongJia');
	tr.children[2].innerText=$.i18n.prop('string_zheHouZongJia');
	tr.children[3].innerText=$.i18n.prop('string_zongFuWuFei');
	tr.children[4].innerText=$.i18n.prop('string_shiShouKuan');
	
	$("#shiftClassPayDetail").text($.i18n.prop('string_zhiFuMingXi'));
	$("#shiftClass").text($.i18n.prop('string_jiaoBan'));
	$("#shiftClassCancle").text($.i18n.prop('string_quXiao'));


	var reportData = $.ajax({
		url : '../storeData/getReportDataByStoreId/' + $storeId,
		async : false
	}).responseJSON;
	$('#shiftClass_payRecordInfos').empty();
	var dishOrderCount = $("#shiftClass_dishOrderCount");
	var totalPrice = $("#shiftClass_totalPrice");
	var discountedTotalPrice = $("#shiftClass_discountedTotalPrice");
	var totalServiceFee = $("#shiftClass_totalServiceFee");
	var totalIncome = $("#shiftClass_totalIncome");
	var payRecordInfos = $("#shiftClass_payRecordInfos");

	var payRecordInfosTitleTr = $('<tr>');
	$('<td>').text($.i18n.prop('string_shouRuXiangMu')).appendTo(payRecordInfosTitleTr);
	$('<td>').text($.i18n.prop('string_jiLuShu')).css("min-width", "50px").appendTo(payRecordInfosTitleTr);
	$('<td>').text($.i18n.prop('string_yuanBi')).css("min-width", "45px").appendTo(payRecordInfosTitleTr);
	$('<td>').text($.i18n.prop('string_huiLv')).css("min-width", "45px").appendTo(payRecordInfosTitleTr);
	$('<td>').text($.i18n.prop('string_jinE')).css("min-width", "45px").appendTo(payRecordInfosTitleTr);
	payRecordInfosTitleTr.appendTo(payRecordInfos);
	if (reportData != null) {
		dishOrderCount.html(reportData.dishOrderCount);
		totalPrice.html(reportData.totalPrice);
		discountedTotalPrice.html(reportData.discountedTotalPrice);
		totalServiceFee.html(reportData.totalServiceFee);
		totalIncome.html(reportData.totalIncome);

		for ( var i = 0; i < reportData.payRecordInfos.length; i++) {
			var payRecordInfo = reportData.payRecordInfos[i];
			var payRecordInfosInfo = $('<tr>');
			$('<td>').text(payRecordInfo.name).appendTo(payRecordInfosInfo);
			$('<td>').text(payRecordInfo.count).appendTo(payRecordInfosInfo);
			$('<td>').text(payRecordInfo.totalPrice).appendTo(
					payRecordInfosInfo);
			$('<td>').text(payRecordInfo.exchangeRate).appendTo(
					payRecordInfosInfo);
			$('<td>').text(payRecordInfo.finalPrice).appendTo(
					payRecordInfosInfo);
			payRecordInfosInfo.appendTo(payRecordInfos);
		}
	}
}

function dismissDialog() {

	shiftClassDialog.closeNotRemoved();
}

function dismissShiftClassDialog() {

	$.ajax({
		url : '../ordering/shiftClass',
		data : {
			employeeId : $storeData.employee.id,
			storeId : $storeId
		},
		typa : 'POST',
		dataType : 'text',
		error : function() {
			alert($.i18n.prop('string_yanZhengChuCuoQingChongShi'));
		},
		success : function(result) {
			if (!result) {
				alert($.i18n.prop('string_quanXianBuZuWuFaJiaoBan'));
				return;
			}
			dismissDialog();
		}
	});
}
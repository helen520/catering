function checkInput(thisObject) {
	var startDate = thisObject.form.startDate.value;
	var endDate = thisObject.form.endDate.value;
	if (startDate == "") {
		alert($.i18n.prop('string_qingXuanZeKaiShiRiQi'));
		return;
	}
	if (endDate == "") {
		alert($.i18n.prop('string_qingXuanZeJieShuRiQi'));
		return;
	}
	var startDateArr = startDate.split('-');
	var endDateArr = endDate.split('-');
	var startDateLong = parseFloat(startDateArr[0] + startDateArr[1]
			+ startDateArr[2]);
	var endDateLong = parseFloat(endDateArr[0] + endDateArr[1] + endDateArr[2]);
	if (startDateLong > endDateLong) {
		alert($.i18n.prop('string_kaiShiRiQiDaYuJieShuRiQi'));
		return;
	}
	thisObject.form.submit();
}
$(document).ready(
		function() {

			$(function() {
				jQuery.i18n.properties({
					name : 'strings', // 资源文件名称
					path : '../resources/i18n/', // 资源文件路径
					mode : 'map', // 用Map的方式使用资源文件中的值
					callback : function() {
						// DishOrderTable
						var trobj = $("#DishOrderTr").get(0);
						trobj.children[1].innerText = $.i18n
								.prop('string_shiJian');
						trobj.children[2].innerText = $.i18n
								.prop('string_taiMing');
						trobj.children[3].innerText = $.i18n
								.prop('string_renShu');
						trobj.children[4].innerText = $.i18n
								.prop('string_xiaoFeiJinE');
						trobj.children[5].innerText = $.i18n
								.prop('string_zheKouLv');
						trobj.children[6].innerText = $.i18n
								.prop('string_zheHouJinE');
						trobj.children[7].innerText = $.i18n
								.prop('string_fuWuFei');
						trobj.children[8].innerText = $.i18n
								.prop('string_yingShou');
						trobj.children[9].innerText = $.i18n
								.prop('string_beiZhu');
						// trobj.children[10].innerText=
						// $.i18n.prop('string_liuShuiHao');
						// DepartmentStatTable
						trobj = $("#DepartmentStatTr").get(0);
						trobj.children[0].innerText = $.i18n
								.prop('string_buMen');
						trobj.children[1].innerText = $.i18n
								.prop('string_chuPinShu');
						trobj.children[2].innerText = $.i18n
								.prop('string_zongYuanJia');
						trobj.children[3].innerText = $.i18n
								.prop('string_zheHouZongJia');
						trobj.children[4].innerText = $.i18n
								.prop('string_zongZheKou');
						trobj.children[5].innerText = $.i18n
								.prop('string_zongFuWuFei');
						trobj.children[6].innerText = $.i18n
								.prop('string_youHuiQuan');
						trobj.children[7].innerText = $.i18n
								.prop('string_zongJia');
						// FinanceStatTable
						trobj = $("#FinanceStatTr").get(0);
						trobj.children[0].innerText = $.i18n
								.prop('string_dingDanShu');
						trobj.children[1].innerText = "人数";
						trobj.children[2].innerText = $.i18n
								.prop('string_zheQianZongJia');
						trobj.children[3].innerText = $.i18n
								.prop('string_zheHouZongJia');
						trobj.children[4].innerText = $.i18n
								.prop('string_zongFuWuFei');
						trobj.children[5].innerText = "人均消费";
						trobj.children[6].innerText = $.i18n
								.prop('string_yingShouKuan');
						// PaymentStatTable
						trobj = $("#PaymentStatTr").get(0);
						trobj.children[0].innerText = $.i18n
								.prop('string_shouRuXiangMu');
						trobj.children[1].innerText = $.i18n
								.prop('string_jiLuShu');
						trobj.children[2].innerText = $.i18n
								.prop('string_yuanBi');
						trobj.children[3].innerText = $.i18n
								.prop('string_huiLv');
						trobj.children[4].innerText = $.i18n
								.prop('string_jinE');
						$("#totalPaying").text(
								$.i18n.prop('string_fuKuanZongE'));
					}
				});

			});

		});

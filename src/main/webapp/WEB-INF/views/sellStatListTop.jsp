<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>

<div id="reportLists">
	<br /> <a
		href="../reporting/dishCategorySellStats?startDate=&endDate=&storeId=${storeId}"><span
		id="stringLeiBieXiaoShouTongJi">类别销售统计</span></a> <a
		href="../reporting/deskNoSellStats?startDate=&endDate=&storeId=${storeId}"><span
		id="stringTaiHaoXiaoShouTongJi">台号销售统计</span></a> <a
		href="../reporting/employeeSellStats?startDate=&endDate=&storeId=${storeId}"><span
		id="stringYuanGongXiaoShouTongJi">员工销售统计</span></a> <a
		href="../reporting/departmentSellStat?departmentValue=&startDate=&endDate=&storeId=${storeId}"><span
		id="stringBuMenXiaoShouTongJi">部门销售统计</span></a> <a
		href="../reporting/materialRecordStat?startDate=&endDate=&storeId=${storeId}"><span
		id="stringBuMenXiaoShouTongJi">原料消耗统计</span></a>
	<button onclick="window.print()">打印页面信息</button>
</div>
<script type="text/javascript">
	$(document)
			.ready(
					function() {
						$(function() {
							jQuery.i18n
									.properties({
										name : 'strings', //资源文件名称
										path : '../resources/i18n/', //资源文件路径
										mode : 'map', //用Map的方式使用资源文件中的值
										callback : function() {
											//类别销售统计
											$("#stringLeiBieXiaoShouTongJi")
													.text(
															$.i18n
																	.prop('string_leiBieXiaoShouTongJi'));
											//台号销售统计
											$("#stringTaiHaoXiaoShouTongJi")
													.text(
															$.i18n
																	.prop('string_taiHaoXiaoShouTongJi'));
											//部门销售统计
											$("#stringBuMenXiaoShouTongJi")
													.text(
															$.i18n
																	.prop('string_buMenXiaoShouTongJi'));
										}
									});

						});
					});
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
		var endDateLong = parseFloat(endDateArr[0] + endDateArr[1]
				+ endDateArr[2]);
		if (startDateLong > endDateLong) {
			alert($.i18n.prop('string_kaiShiRiQiDaYuJieShuRiQi'));
			return;
		}
		thisObject.form.submit();
	}
</script>

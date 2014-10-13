<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<div id="dialog-shiftClass" class="shiftClassDialog">
	<div class="overthrow"
		style="position: fixed; top: 5.5em; left: 2.5em; right: 2.5em; bottom: 7.5em;">
		<span id="shiftClassTotalIncome">总收入</span>
		<table style="text-align: center; margin-bottom: 5px; width: 100%">
			<tr id="shiftClassTotalIncomeTr">
				<td style="min-width: 50px">订单数</td>
				<td style="min-width: 40px">总价</td>
				<td>折后总价</td>
				<td>总服务费</td>
				<td style="min-width: 50px">实收款</td>
			</tr>
			<tr>
				<td id="shiftClass_dishOrderCount"></td>
				<td id="shiftClass_totalPrice"></td>
				<td id="shiftClass_discountedTotalPrice"></td>
				<td id="shiftClass_totalServiceFee"></td>
				<td id="shiftClass_totalIncome"></td>
			</tr>
		</table>
		<span id="shiftClassPayDetail">支付明细</span>
		<table style="text-align: center; width: 100%">
			<tbody id="shiftClass_payRecordInfos"></tbody>
		</table>
	</div>
	<div style="position: absolute; bottom: 5px; left: 0px; width: 100%">
		<div style="text-align: center; margin-top: 15px">
			<a class="button" onclick="dismissShiftClassDialog()"><span
				id="shiftClass">交班</span></a> <a class="button"
				onclick="dismissDialog()"><span id="shiftClassCancle">取消</span></a>
		</div>
	</div>
</div>
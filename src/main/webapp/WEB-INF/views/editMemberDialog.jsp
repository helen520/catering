<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<div class="confirmDialogTitle">编辑会员窗口</div>
<div align="center" style="background-color: white; padding: .3em">
	<div>
		<table cellspacing="0" cellpadding="0" align="center">
			<tr>
				<td><span>用户姓名</span>：&nbsp;&nbsp;<input id="member_edit_name"
					type='text' value="${member.name}"></td>
			</tr>
			<tr>
				<td><span>手机号码</span>：&nbsp;&nbsp;<input id="member_edit_phone"
					type="tel" value="${member.mobileNo}"></td>
			</tr>
			<tr>
				<td><span>会员卡号</span>：&nbsp;&nbsp;<input
					id="member_edit_cardNo" type='text' value="${member.memberCardNo}"></td>
			</tr>
			<tr>
				<td><span>&nbsp;&nbsp;折扣率</span>：&nbsp;&nbsp;<select
					id="member_edit_discountRate">
						<option value="1">无</option>
						<c:forEach items="${discountRates}" var="discountRate">
							<c:choose>
								<c:when test="${discountRate.value eq member.discountRate}">
									<option value="${discountRate.value}" selected="selected">${discountRate.name}</option>
								</c:when>
								<c:otherwise>
									<option value="${discountRate.value}">${discountRate.name}</option>
								</c:otherwise>
							</c:choose>
						</c:forEach>
				</select></td>
			</tr>
			<tr>
				<td><span>积&nbsp;&nbsp;&nbsp;&nbsp;分</span>：&nbsp;&nbsp;<input
					id="member_edit_point" type='number' value="${member.point}"></td>
			</tr>
		</table>
	</div>

	<div>
		<div class="dialogButton" onclick="submitEditMemberInfo()">确定</div>
		<div class="dialogButton" onclick="dismissEditMemberDialog()">取消</div>
	</div>
</div>


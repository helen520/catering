var reMobile = new RegExp(/^(13[0-9]|15[0-9]|18[0-9])\d{8}$/);
var $customerCouponTemplateListMap = {};
var $couponTemplates = [];
$(function() {
	$('.searchMemberButton').click(function() {
		searchMember();
	});
	$('.newMemberButton').click(function() {
		showRegisterMemberDialog();
	});
	$('.searchAllMemberButton').click(function() {
		searchMember('all');
	});
	$('.searchInput').click(function() {
		this.value = '';
	});

	loadProperties();

	var storeId = $("#storeId").val();
	$couponTemplates = $.ajax({
		url : "../member/getCouponTemplateByStoreId/" + storeId,
		async : false,
		error : function(message) {
			hideLoadingDialog();
			alert($.i18n.prop('string_huoQuHuanJingShuJuCuoWu'),
					message.responseText);
			return;
		}
	}).responseJSON;

	$("#searchInput").click(function() {
		$(this).val("");
	});

	$("#memberListPanel").delegate(
			".button",
			"click",
			function() {
				var member = $(this).data("member");
				var storeId = $("#storeId").val();

				if (member)
					$.ajax({
						type : "POST",
						url : '../member/getEditMemberDialog',
						data : {
							memberId : member.id,
							storeId : storeId
						},
						error : function() {
							showAlertDialog($.i18n.prop('string_cuowu'),
									"获取会员信息出错!请刷新后再试!");
						},
						success : function(content) {
							showEditMemberPage(content);
						}
					});
			});

	$("#memberListPanel").delegate(".recharge", "click", function() {
		var member = $(this).data("member");
		if (member)
			showRechargePage(member);
	});

	$("#memberListPanel").delegate(".balanceRecord", "click", function() {
		var member = $(this).data("member");
		if (member)
			showBalanceRecordDialog(member);
	});

	$("#memberListPanel")
			.delegate(
					".sendCoupon",
					"click",
					function() {
						var member = $(this).data("member");
						if (member) {
							if (!$customerCouponTemplateListMap[member.id]
									|| $customerCouponTemplateListMap[member.id] == []) {
								$customerCouponTemplateListMap[member.id] = [];

								var couponTemplates = [];
								for ( var i in $couponTemplates) {
									var couponTemplate = $couponTemplates[i];
									couponTemplate.amount = 0;
									couponTemplate.alreadySendAmount = 0;
									couponTemplates.push(couponTemplate);
								}
								$customerCouponTemplateListMap[member.id]
										.push(couponTemplates);
							}
							showSendCouponDialog(member);
						}
					});
});
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

function loadProperties() {
	jQuery.i18n.properties({
		name : 'strings', // 资源文件名称
		path : '../resources/i18n/', // 资源文件路径
		mode : 'map', // 用Map的方式使用资源文件中的值
		callback : function() {
		}
	});
}

var lastSubmitStr;
function searchMember(str) {

	var memberListPanel = $("#memberListPanel");
	var submitStr = $.trim($("#searchInput").val());
	var storeId = $("#storeId").val();
	memberListPanel.html("");
	if (str) {
		submitStr = str;
	}

	lastSubmitStr = submitStr;
	$.ajax({
		type : 'POST',
		url : '../member/getMemberListByPhoneOrCardNo',
		data : {
			keyword : submitStr,
			storeId : storeId
		},
		dataType : 'json',
		async : false,
		error : function() {
			showAlertDialog($.i18n.prop('string_cuowu'), "获取会员信息出错!请刷新后再试!");
		},
		success : function(memberList) {
			$("#searchInput").val("输入会员卡号或电话号码");
			if (memberList != null) {
				renderMembers(memberListPanel, memberList);
			}
		}
	});
}

function renderMembers(memberListPanel, memberList) {
	for ( var i in memberList) {
		var member = memberList[i];
		if (member) {
			var memberDiv = $('<div>').addClass("memberItem").attr("id",
					"memberDiv_" + i).appendTo(memberListPanel);
			var memberCaptionDiv = $('<div>').addClass("captionPanel")
					.appendTo(memberDiv);
			var memberOperationPanel = $('<div>').addClass(
					"memberItemOperationPanel").appendTo(memberDiv);

			$('<div>').css("clear", "both").appendTo(memberDiv);
			var couponListDiv = $('<div>').addClass("couponListPanel")
					.appendTo(memberDiv);

			var memberCaptionHtml = new StringBuilder();
			memberCaptionHtml.append([
					Number(i) + 1 + "." + $.i18n.prop('string_huiYuanKaHao')
							+ ":", $.trim(member.memberCardNo) ]);
			memberCaptionHtml.append([
					" " + $.i18n.prop('string_xingMing') + ":", member.name ]);
			memberCaptionHtml
					.append([ " " + $.i18n.prop('string_dianHua') + ":",
							member.mobileNo ]);
			memberCaptionHtml.append([ " 折扣率: ", member.discountRate ]);
			memberCaptionHtml.append([ " 余额: ", member.balance ]);
			memberCaptionHtml.append([ " 积分: ", member.point ]);
			memberCaptionDiv.html(memberCaptionHtml.toString());

			if (member.coupons != null && member.coupons.length > 0) {
				for ( var i in member.coupons) {
					var coupon = member.coupons[i];
					var couponHtml = new StringBuilder();
					couponHtml.append("<div class=\"button coupon\">");
					couponHtml.append(coupon.title);
					couponHtml.append(" 可抵扣:");
					couponHtml.append(coupon.value);
					couponHtml.append("</div>");
					$(couponHtml.toString()).appendTo(couponListDiv);
				}
			}
			$("<button>").data("member", member).addClass("button").text("编辑")
					.appendTo(memberOperationPanel);

			$("<button>").data("member", member).addClass("sendCoupon").text(
					"发券").appendTo(memberOperationPanel);

			$("<button>").data("member", member).addClass("recharge")
					.text("充值").appendTo(memberOperationPanel);

			$("<button>").data("member", member).addClass("balanceRecord")
					.text("消费记录").appendTo(memberOperationPanel);
		}
	}
}

function showRechargePage(member) {
	var dialogDiv = $("<div>").addClass("confirmDialog").appendTo('body');
	var modal = $(dialogDiv).modal();
	$("<div>").text("会员充值").addClass("confirmDialogTitle").appendTo(dialogDiv);
	var contentDiv = $("<div>").addClass("confirmDialogMessage").appendTo(
			dialogDiv);

	$("<span>").text("充值金额:").appendTo(contentDiv);
	$("<input>").attr("id", "rechargeAmount").attr("type", "number").appendTo(
			contentDiv);

	$("<br>").appendTo(contentDiv);

	$("<span>").text("充值方式:").appendTo(contentDiv);
	var select = $("<select>").attr("id", "rechargeType").appendTo(contentDiv);
	$("<option>").text("现金").val("现金").attr("selected", "selected").appendTo(
			select);
	$("<option>").text("刷卡").val("刷卡").appendTo(select);
	$("<option>").text("赠送").val("赠送").appendTo(select);

	var operationDiv = $("<div>").addClass("operationDiv");
	$("<div>").data("member", member).addClass("dialogButton").text(
			$.i18n.prop('string_queDing')).appendTo(operationDiv).click(
			function() {
				var amount = $("#rechargeAmount").val();
				var type = $("#rechargeType").val();
				var employeeId = $("#employeeId").val();
				var storeId = $("#storeId").val();
				var userAccountId = member.id;
				if (amount == "" || amount <= 0) {
					alert("请输入正确的金额");
					return;
				}
				$.ajax({
					url : '../member/rechargeMember',
					type : 'POST',
					data : {
						storeId : storeId,
						employeeId : employeeId,
						userAccountId : userAccountId,
						amount : amount,
						type : type
					},
					error : function() {
						alert("充值出错!请稍后再试!");
					},
					success : function() {
						modal.close();
						alert("充值成功!!");
						searchMember(lastSubmitStr);
					}
				});
			});
	$("<div>").addClass("dialogButton").text($.i18n.prop('string_quXiao'))
			.appendTo(operationDiv).click(function() {
				modal.close();
			});
	operationDiv.appendTo(dialogDiv);
}

function showBalanceRecordDialog(member) {

	var balanceRecords = $.ajax({
		url : "../member/getBalanceRecord/" + member.id,
		async : false,
		error : function(message) {
			hideLoadingDialog();
			showAlertDialog($.i18n.prop('string_huoQuHuanJingShuJuCuoWu'),
					message.responseText);
			return;
		}
	}).responseJSON;

	var dialogDiv = $('<div>').addClass("functionMenuDialog").attr("id",
			"functionMenuDialog").appendTo('body');

	var balanceRecordDialog = $(dialogDiv).modal();

	var titlePanel = $("<div>").addClass("confirmDialogTitle").text("消费/充值记录")
			.appendTo(dialogDiv);

	$('<div>').addClass("cancelDiv").text("×").click(function() {
		balanceRecordDialog.close();
	}).appendTo(dialogDiv);

	var functionMenuButtonSelector = $("<div>").addClass(
			"overthrow functionMenuButtonSelector").appendTo(dialogDiv);

	var controlPanelDiv = $("<div>").addClass("controlPanel").appendTo(
			dialogDiv);

	$('<button>').addClass("button")
			.text($.i18n.prop('string_guanBiChuangKou')).click(function() {
				balanceRecordDialog.close();
			}).appendTo(controlPanelDiv);

	for ( var i in balanceRecords) {
		var balanceRecord = balanceRecords[i];
		$('<div>').addClass("couponListPanel").text(
				"时间 : " + balanceRecord.createTimeStr + " "
						+ balanceRecord.dataSnapShot).appendTo(
				functionMenuButtonSelector);
	}

	var selectorTop = titlePanel.height() + 15;
	functionMenuButtonSelector.offset({
		top : selectorTop,
		left : 5
	});
}

function submitEditMemberInfo() {
	var phone = $("#member_edit_phone").val();
	var cardNo = $("#member_edit_cardNo").val();
	var storeId = $("#storeId").val();

	showLoadingDialog("更新中...");

	var reMobile = new RegExp(/^(13[0-9]|15[0-9]|18[0-9])\d{8}$/);
	if (!reMobile.test(phone)) {
		hideLoadingDialog();
		showAlertDialog($.i18n.prop('string_cuoWu'), "请输入正确的手机号码!");
		return;
	}
	if (isNaN(phone) || isNaN(cardNo)) {
		hideLoadingDialog();
		showAlertDialog($.i18n.prop('string_cuoWu'), $.i18n
				.prop('string_shouJiHaoMaBiXuShiShuZi'));
		return;
	}

	$.ajax({
		url : '../member/checkPhoneOrCardNoIsExisted',
		type : 'POST',
		data : {
			storeId : storeId,
			cardNo : cardNo,
			phone : phone
		},
		error : function() {
			hideLoadingDialog();
			showAlertDialog($.i18n.prop('string_cuowu'), "更新会员信息出错!请刷稍后再试!");
		},
		success : function(result) {
			if (result == 0) {
				hideLoadingDialog();
				showAlertDialog("提示", "不存在该会员!无法更新!!!");
			} else if (result == 1) {
				updateMemberInfo();
			} else if (result == 2) {
				hideLoadingDialog();
				showAlertDialog("提示", "会员卡号和手机号码均已被使用!无法更新!!!");
			}
		}
	});
}

function updateMemberInfo() {

	var userName = $('#member_edit_name').val();
	var tel = $.trim($('#member_edit_phone').val());
	var cardNo = $.trim($('#member_edit_cardNo').val());
	var discountRate = $.trim($('#member_edit_discountRate').val());
	var point = $.trim($('#member_edit_point').val());
	var storeId = $("#storeId").val();
	$
			.ajax({
				url : '../member/updateMemberInfo',
				type : 'POST',
				data : {
					storeId : storeId,
					cardNo : cardNo,
					name : userName,
					phone : tel,
					discountRate : discountRate,
					point : point
				},
				dataType : 'json',
				error : function() {
					showAlertDialog($.i18n.prop('string_cuowu'),
							"更新会员信息出错!请刷稍后再试!");
				},
				success : function(result) {
					hideLoadingDialog();
					if (result) {
						dismissEditMemberDialog();
						searchMember(lastSubmitStr);
					} else
						showAlertDialog($.i18n.prop('string_cuowu'),
								"更新会员信息出错!请刷稍后再试!");
				}
			});
};

function showSendCouponDialog(member) {
	var couponListPanel = $('<div>').appendTo("body");
	var dialog = $(couponListPanel).modal();
	couponListPanel.addClass("singleChoicePanel");
	var contentDiv = $('<div>').addClass("orderItemCmdPanelContent").addClass(
			"overthrow").appendTo(couponListPanel);

	getCouponTemplateListView(contentDiv);
	var bottomDiv = $('<div>').addClass("orderItemCmdPanelBottomDiv");
	bottomDiv.appendTo(couponListPanel);

	$('<div>').text($.i18n.prop('string_guanBi')).addClass("button").click(
			function() {
				dialog.close();
				searchMember(lastSubmitStr);
			}).appendTo(bottomDiv);

	$('<div>')
			.addClass("button")
			.text($.i18n.prop('string_faQuan'))
			.css("margin-left", "10px")
			.click(
					function() {
						var couponTemplates = $customerCouponTemplateListMap[member.id][0];
						var storeId = $("#storeId").val();
						var employeeId = $("#employeeId").val();
						var postData = {
							userAccountId : member.id,
							storeId : storeId,
							employeeId : employeeId,
							couponTemplatesJsonText : JSON
									.stringify(couponTemplates)
						};

						$customerCouponTemplateListMap[member.id] = [];
						$customerCouponTemplateListMap[member.id].push($.ajax({
							url : "../member/sendCoupons",
							type : "POST",
							data : postData,
							dataType : 'json',
							async : false,
							error : function(error) {

								if (error.status == 403) {
									showAlertDialog(
											$.i18n.prop('string_cuoWu'),
											"权限不足,无法进行操作!");
									return;
								}
								showAlertDialog($.i18n.prop('string_cuoWu'),
										error.responseText);
							},
							success : function(dishOrder) {
							}
						}).responseJSON);
						getCouponTemplateListView(contentDiv);
					}).appendTo(bottomDiv);

	function getCouponTemplateListView(contentDiv) {

		contentDiv.empty();
		var couponTemplates = $customerCouponTemplateListMap[member.id][0];
		if (couponTemplates) {
			for ( var i in couponTemplates) {
				var couponTemplate = couponTemplates[i];
				var couponTemplateItemDiv = $('<div>').addClass(
						"couponTemplateItem");

				var couponTemplateItemTopDiv = $('<div>');
				$('<span>').text(
						couponTemplate.title + " 可抵扣:" + couponTemplate.value)
						.appendTo(couponTemplateItemTopDiv);
				if (couponTemplate.alreadySendAmount > 0) {
					$('<label>').text(
							$.i18n.prop('string_yiFa')
									+ couponTemplate.alreadySendAmount
									+ $.i18n.prop('string_zhang')).addClass(
							"dishOrderDetailLabel").appendTo(
							couponTemplateItemTopDiv);
				}

				var couponTemplateItemOperationDiv = $('<div>').addClass(
						"couponTemplateItemOperation");
				$('<div>').addClass("button").data("couponTemplate",
						couponTemplate).text("-").click(function() {
					var couponTemplate = $(this).data("couponTemplate");
					if (couponTemplate.amount > 0) {
						couponTemplate.amount -= 1;
					}
					getCouponTemplateListView(contentDiv);
				}).appendTo(couponTemplateItemOperationDiv);
				$('<label>').addClass("dishOrderDetailLabel").text(
						couponTemplate.amount).appendTo(
						couponTemplateItemOperationDiv);
				$('<div>').addClass("button").text("+").data("couponTemplate",
						couponTemplate).click(function() {
					var couponTemplate = $(this).data("couponTemplate");
					couponTemplate.amount += 1;
					getCouponTemplateListView(contentDiv);
				}).appendTo(couponTemplateItemOperationDiv);
				couponTemplateItemOperationDiv
						.appendTo(couponTemplateItemTopDiv);

				$('<div>').css("clear", "both").appendTo(
						couponTemplateItemTopDiv);

				couponTemplateItemTopDiv.appendTo(couponTemplateItemDiv);
				$('<div>').html(
						$.i18n.prop('string_xiangQingShuoMing')
								+ couponTemplate.text).appendTo(
						couponTemplateItemDiv);

				couponTemplateItemDiv.appendTo(contentDiv);
			}
		}
	}
}

var registerMemberDialog;
function showRegisterMemberDialog() {
	registerMemberDialog = $("#registerMemberView").addClass("confirmDialog")
			.modal();
}

function dismissRegisterMemberDialog() {

	$('#member_name').val("");
	$('#member_phone').val("");
	$('#member_cardNo').val("");
	if (registerMemberDialog)
		registerMemberDialog.closeNotRemoved();
}

function submitRegisterMember(storeId) {

	showLoadingDialog($.i18n.prop('string_tiJiaoZhong'));

	if (!registerMemberDialog) {
		return;
	}

	var userName = $('#member_name').val();
	var tel = $.trim($('#member_phone').val());
	var cardNo = $.trim($('#member_cardNo').val());
	var discountRate = $.trim($('#member_discountRate').val());
	var point = $.trim($('#member_point').val());
	var reMobile = new RegExp(/^(13[0-9]|15[0-9]|18[0-9])\d{8}$/);
	if (!reMobile.test(tel) || !cardNo) {
		hideLoadingDialog();
		showAlertDialog($.i18n.prop('string_cuoWu'), "请输入正确的手机号码和会员卡号!");
		return;
	}
	if (isNaN(tel)) {
		hideLoadingDialog();
		showAlertDialog($.i18n.prop('string_cuoWu'), $.i18n
				.prop('string_shouJiHaoMaBiXuShiShuZi'));
		return;
	}

	$.ajax({
		url : '../member/registerOrUpdateMember',
		data : {
			storeId : storeId,
			cardNo : cardNo,
			name : userName,
			phone : tel,
			discountRate : discountRate,
			point : point,
			isUpdate : false
		},
		type : 'POST',
		dataType : 'json',
		error : function(result) {
			hideLoadingDialog();
			showAlertDialog($.i18n.prop('string_cuoWu'), result.responseText);
		},
		success : function(result) {
			hideLoadingDialog();
			if (result == 0) {
				dismissRegisterMemberDialog();
				showAlertDialog("注册更新会员", "注册或更新成功!");
				searchMember(lastSubmitStr);
			} else if (result == 1) {
				showAlertDialog($.i18n.prop('string_cuoWu'), "会员卡号已被注册!!!");
			} else if (result == 2) {
				showConfirmDialog("提示", "会员卡号已被使用,是否更换该会员的手机号码和其他信息?",
						registerMemberPageByMan, storeId);
			} else if (result == 3) {
				showAlertDialog("提示", "会员卡号和手机号码均已被使用!无法更新或新建!!!");
			}
		}
	});
};

function registerMemberPageByMan(storeId) {

	showLoadingDialog($.i18n.prop('string_tiJiaoZhong'));
	var userName = $('#member_name').val();
	var tel = $.trim($('#member_phone').val());
	var cardNo = $.trim($('#member_cardNo').val());
	var discountRate = $.trim($('#member_discountRate').val());
	var point = $.trim($('#member_point').val());
	$.ajax({
		url : '../member/registerOrUpdateMember',
		data : {
			storeId : storeId,
			cardNo : cardNo,
			name : userName,
			phone : tel,
			discountRate : discountRate,
			point : point,
			isUpdate : true
		},
		type : 'POST',
		dataType : 'json',
		error : function(result) {
			hideLoadingDialog();
			showAlertDialog($.i18n.prop('string_cuoWu'), result.responseText);
		},
		success : function(result) {
			hideLoadingDialog();
			dismissRegisterMemberDialog();
			showAlertDialog("注册更新会员", "注册或更新成功!");
			searchMember(lastSubmitStr);
		}
	});
}

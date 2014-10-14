function showAmountDialog(title, okCallback, initValue) {
	var dialogDiv = $("<div>").addClass("amountDialog").appendTo('body');
	var digitKb = $("<div>").appendTo(dialogDiv).digitKeyboard(title, false,
			initValue);

	$("<div>").addClass("dialogButton").text($.i18n.prop('string_queDing'))
			.appendTo(dialogDiv).click(function() {
				if (okCallback) {
					okCallback(parseFloat(digitKb.getText()));
				}
				modal.close();
			});
	$("<div>").addClass("dialogButton").text($.i18n.prop('string_quXiao'))
			.appendTo(dialogDiv).click(function() {
				modal.close();
			});
	var modal = $(dialogDiv).modal({
		level : 5
	});
}

function showDishAmountDialog(title, orderItem, okCallback, cancelCallback) {
	var dialogDiv = $("<div>").addClass("amountDialog").appendTo('body');
	var digitKb = $("<div>").appendTo(dialogDiv).digitKeyboard(title, false,
			orderItem.amount, orderItem.unit);
	var dishUnitDiv = $("<div>").addClass("dishUnitPanel").appendTo(dialogDiv);
	var dishUnit = $dishUnitByNameMap[orderItem.orgUnit];
	if (dishUnit && !orderItem.editable) {
		var duList = $dishUnitsByGroupIdMap[dishUnit.groupNumber];
		if (duList.length > 1)
			for ( var i in duList) {
				var du = duList[i];
				var duDiv = $("<div>").addClass("dishUnitSingleChoiceItem")
						.text(du.name).appendTo(dishUnitDiv).click(
								dishUnitSingleChoiceItemClick);
				if (!orderItem.unit)
					orderItem.unit = orderItem.orgUnit;
				if (orderItem.unit == du.name)
					duDiv.css("background-color", "#6AA1D8");
			}
	}
	function dishUnitSingleChoiceItemClick() {
		$(".dishUnitSingleChoiceItem").removeAttr("style");
		$(this).css("background-color", "#6AA1D8");
		orderItem.unit = $(this).text();
		var digitUnit = $("#digitUnit");
		if (digitUnit) {
			digitUnit.text(orderItem.unit);
		}
	}

	$("<div>").addClass("dialogButton").text($.i18n.prop('string_queDing'))
			.appendTo(dialogDiv).click(function() {
				if (okCallback)
					okCallback(parseFloat(digitKb.getText()));
				showDishAmountModal.close();
			});
	$("<div>").addClass("dialogButton").text($.i18n.prop('string_quXiao'))
			.appendTo(dialogDiv).click(function() {
				if (cancelCallback)
					cancelCallback();
				showDishAmountModal.close();
			});

	var showDishAmountModal = $(dialogDiv).modal({
		level : 5
	});
}

var smartCardNo;
var isShowedEmployeeLoginDialog = false;
function showEmployeeLoginDialog(okCallback, arg1, arg2, isAuthority) {
	var dialogDiv = $("<div>").addClass("amountDialog").appendTo('body');
	var workNumberKb = $("<div>").addClass("floatLeft").appendTo(dialogDiv)
			.digitKeyboard($.i18n.prop('string_gongHao') + ": ");
	$("<div>").addClass("floatLeft").css("width", "1em").appendTo(dialogDiv);
	var passwordKb = $("<div>").addClass("floatRight").appendTo(dialogDiv)
			.digitKeyboard($.i18n.prop('string_miMa') + ": ", true);
	workNumberKb.setText("");
	passwordKb.setText("");

	$("<div>").addClass("clearBoth").appendTo(dialogDiv);
	var bottomDiv = $("<div>").css("text-align", "center").appendTo(dialogDiv);
	$("<div>").addClass("dialogButton").text($.i18n.prop('string_dengLu')).css(
			"margin-right", "3em").appendTo(bottomDiv).click(loginButtonClick);
	smartCardNo = "";
	isShowedEmployeeLoginDialog = true;

	function keyDown(e) {
		var keycode = event.keyCode;
		var realkey = String.fromCharCode(event.keyCode);

		if (keycode != 13) {
			smartCardNo += realkey;
		} else {
			passwordKb.focus();
			passwordKb.setText(smartCardNo);
			loginButtonClick();
		}
	}
	document.onkeydown = keyDown;

	function loginButtonClick() {
		showLoadingDialog($.i18n.prop('string_janChaShenFen'));
		var postData = {
			workNumber : workNumberKb.getText(),
			password : passwordKb.getText(),
		};

		$
				.ajax({
					type : 'POST',
					url : "../employeeLogin/" + $storeId,
					data : postData,
					dataType : "json",
					error : function(error) {
						if (!alertDialog || alertDialog.is(":hidden")) {
							showAlertDialog(
									$.i18n.prop('string_cuoWu'),
									$.i18n
											.prop('string_dengLuShiBaiQingJianChaGongHaoHeMiMa'));
						}
						hideLoadingDialog();
						passwordKb.setText("");
						smartCardNo = "";
					},
					success : function(employee) {
						if (isAuthority) {
							$templeEmployee = employee;
						} else
							$storeData.employee = employee;
						hideLoadingDialog();
						document.onkeydown = null;
						modal.close();
						isShowedEmployeeLoginDialog = false;
						if (okCallback) {
							okCallback(arg1, arg2);
						}
					}
				});
	}

	$("<div>").addClass("dialogButton").text($.i18n.prop('string_quXiao'))
			.appendTo(bottomDiv).click(function() {
				document.onkeydown = null;
				isShowedEmployeeLoginDialog = false;
				modal.close();
			});
	var modal = $(dialogDiv).modal({
		level : 3
	});
}

function showConfirmDialog(title, message, confirmCallback, storeId,
		cancelCallback) {
	var dialogDiv = $("<div>").addClass("confirmDialog").appendTo('body');
	$("<div>").text(title).addClass("confirmDialogTitle").appendTo(dialogDiv);
	$("<div>").text(message).addClass("confirmDialogMessage").appendTo(
			dialogDiv);

	var operationDiv = $("<div>").addClass("operationDiv");
	$("<div>").addClass("dialogButton").text($.i18n.prop('string_queDing'))
			.appendTo(operationDiv).click(function() {
				if (confirmCallback)
					confirmCallback(storeId);
				modal.close();
			});
	$("<div>").addClass("dialogButton").text($.i18n.prop('string_quXiao'))
			.appendTo(operationDiv).click(function() {
				if (cancelCallback)
					cancelCallback();
				modal.close();
			});
	operationDiv.appendTo(dialogDiv);
	var modal = $(dialogDiv).modal({
		level : 10
	});
}

var alertDialog;
function showAlertDialog(title, message, callback) {
	var dialogDiv = $("<div>").addClass("confirmDialog").appendTo('body');
	$("<div>").text(title).addClass("confirmDialogTitle").appendTo(dialogDiv);
	if (message)
		$("<div>").text(message).addClass("confirmDialogMessage").appendTo(
				dialogDiv);

	$("<div>").addClass("alertButton").text($.i18n.prop('string_queDing'))
			.appendTo(dialogDiv).click(function() {
				if (callback)
					callback();
				alertDialog.close();
			});
	alertDialog = $(dialogDiv).modal({
		level : 10
	});
}

var loadingDialog;
function showLoadingDialog(loadingText) {
	if (!loadingText)
		loadingText = $.i18n.prop('string_jiaZaiZhong');
	var dialogDiv = $("<div>").addClass("loadingDialog").text(loadingText)
			.appendTo('body').click(function() {
				hideLoadingDialog();
			});
	loadingDialog = $(dialogDiv).modal({
		level : 10
	});
}

function hideLoadingDialog() {
	loadingDialog.close();
}

var searchInputDailog;
var searchInputCallBack;
function showSearchInputDailog(onclickCallBack, isDeskTop) {

	searchInputDailog = $("<div>").appendTo('body');
	searchInputCallBack = onclickCallBack;
	var nameValue = [ {
		"1" : "&nbsp;",
		"2" : "abc",
		"3" : "def",
		"" : "Del"
	}, {
		"4" : "ghi",
		"5" : "jkl",
		"6" : "mno",
		"" : "0"
	}, {
		"7" : "pqrs",
		"8" : "tuv",
		"9" : "wxyz",
		"" : "关闭"
	} ];

	if (isDeskTop) {
		nameValue = [ {
			"1" : "&nbsp;",
			"2" : "abc",
			"3" : "def",
			"" : "Del"
		}, {
			"4" : "ghi",
			"5" : "jkl",
			"6" : "mno",
			"" : "0"
		}, {
			"7" : "pqrs",
			"8" : "tuv",
			"9" : "wxyz",
			"" : "C"
		} ];
	}

	for ( var i in nameValue) {
		var partStr = nameValue[i];
		var contentPartDiv = $("<div>");
		for ( var j in partStr) {
			var value = partStr[j];
			$("<div>").html(j + "<br>" + value).addClass("searchButton").data(
					"value", value).data("number", j)
					.click(searchButtonOnClick).appendTo(contentPartDiv);
		}
		contentPartDiv.appendTo(searchInputDailog);
	}

	function searchButtonOnClick() {

		var value = $(this).data("value");
		var number = $(this).data("number");
		textView = $("[name='dishFilterTextInput']", "#dishView");
		switch (value) {
		case "Del":
			if (textView) {
				var orgValue = $(textView).val();
				var va = "";
				if (orgValue.length > 1) {
					va = orgValue.substring(0, orgValue.length - 1);
				}
				$(textView).val(va);
				if (searchInputCallBack) {
					searchInputCallBack();
				}
			}
			break;
		case "关闭":
			searchInputDailog.hide();
			if (textView) {
				$(textView).val("");
			}
			break;

		case "C":
			if (textView) {
				$(textView).val("");
			}
			break;

		default:
			if (textView) {
				if (!number) {
					number = value;
				}
				$(textView).val($(textView).val() + number);
				if (searchInputCallBack) {
					searchInputCallBack();
				}
			}
			break;
		}
	}

	return searchInputDailog;
}

function changeSearchInputCallBack(CallBack) {
	searchInputCallBack = CallBack;
}

function hideSearchInputDailog() {
	if (searchInputDailog) {
		searchInputDailog.hide();
	}
}

var editMemberDialog;
function showEditMemberPage(contentDiv) {

	if (!contentDiv)
		return;
	var dialogDiv = $("<div>").addClass("confirmDialog").appendTo('body');
	dialogDiv.html(contentDiv);

	editMemberDialog = $(dialogDiv).modal({
		level : 3
	});
}

function dismissEditMemberDialog() {
	if (editMemberDialog)
		editMemberDialog.close();

	$("#editMemberDialog").html("");
}

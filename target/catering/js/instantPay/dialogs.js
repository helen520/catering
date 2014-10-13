function LoadingDialog(loadingText) {
	var self = this;
	var loadingDialog = null;

	this.show = function() {
		if (!loadingText)
			loadingText = $.i18n.prop('string_Loading');
		var dialogDiv = $("<div>").addClass("loadingDialog").text(loadingText)
				.appendTo('body').click(self.hide);
		loadingDialog = $(dialogDiv).modal({
			level : 10
		});
	};

	this.hide = function() {
		if (loadingDialog) {
			loadingDialog.close();
		}
	};
}

function AlertDialog(title, message, callback) {

	this.show = function() {
		var alertDialog;
		var dialogDiv = $("<div>").addClass("confirmDialog").appendTo('body');
		$("<div>").text(title).addClass("confirmDialogTitle").appendTo(
				dialogDiv);
		if (message) {
			$("<div>").text(message).addClass("confirmDialogMessage").appendTo(
					dialogDiv);
		}

		$("<div>").addClass("alertButton").text($.i18n.prop('string_Confirm'))
				.appendTo(dialogDiv).click(confirmButtonClick);
		alertDialog = $(dialogDiv).modal({
			level : 10
		});

		function confirmButtonClick() {
			if (callback) {
				callback();
			}
			alertDialog.close();
		}
	};
}

function AmountDialog(title, okCallback, initValue) {

	this.show = function() {
		var dialogDiv = $("<div>").addClass("amountDialog").appendTo('body');
		var digitKb = $("<div>").appendTo(dialogDiv).digitKeyboard(title,
				false, initValue);

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
	};
}

function showSearchMemberDialog(callBack) {

	this.show = function() {
		var dialogDiv = $('<div>').addClass("dishOrderListDialog").attr("id",
				"searchMemberDialog").appendTo('body');
		var titlePanel = $("<div>").addClass("topPanel ui-shadow").appendTo(
				dialogDiv);
		var cancelDiv = $('<div>').addClass("cancelDiv").text("×").appendTo(
				dialogDiv);
		var memberListPanel = $("<div>").addClass(
				"overthrow dishOrderListPanel").appendTo(dialogDiv);
		var controlPanelDiv = $("<div>").addClass("controlPanel").appendTo(
				dialogDiv);

		$('<label>').text(
				$.i18n.prop('string_qingShuRuHuiYuanKaHaoHuoDianHuaHaoMa')
						+ ":").appendTo(titlePanel);
		var searchInputPanel = $('<div>').addClass("searchInputPanel").css(
				"display", "inline-block").appendTo(titlePanel);
		var searchInput = $('<input>').addClass(
				"ui-input ui-border-solid ui-shadow ui-radius searchInput")
				.appendTo(searchInputPanel);

		var titleOperatePanel = $('<div>').addClass("titleOperatePanel")
				.appendTo(titlePanel);
		var searchButton = $('<button>').addClass(
				"showDishOrderAllButton button right").text(
				$.i18n.prop('string_souSuo')).appendTo(titleOperatePanel);

		var memberListDialogCancelBtn = $('<button>').addClass(
				"operationButton").text($.i18n.prop('string_guanBiChuangKou'))
				.appendTo(controlPanelDiv);

		var searchMemberDialog = $(dialogDiv).modal();

		var selectorTop = titlePanel.height() + 10;
		memberListPanel.offset({
			top : selectorTop,
			left : 5
		});

		cancelDiv.click(function() {
			searchMemberDialog.close();
		});

		memberListDialogCancelBtn.click(function() {
			searchMemberDialog.close();
		});

		searchButton
				.click(function() {
					var searchStr = searchInput.val();
					if (!isNaN(searchStr) && Number(searchStr) != 0) {
						searchMember(searchStr.trim());
					} else {
						alert($.i18n
								.prop('string_qingShuRuZhengQueDeHuiYuanKaHaoHuoDianHuaHaoMa'));
					}
				});

		memberListPanel.delegate(".chooseMember", "click", function() {
			currentCustomer = $(this).data("member");
			if (currentCustomer != null && callBack) {
				callBack(currentCustomer);
			}
			searchMemberDialog.close();
		});

		function searchMember(submitStr) {

			memberListPanel.html("");
			UnibizProxy.getInstance().searchCustomer(submitStr,
					function(customers) {
						renderMembers(memberListPanel, customers);
					});
		}

		function renderMembers(memberListPanel, memberList) {
			for ( var i in memberList) {
				var member = memberList[i];
				if (member) {
					var memberDiv = $('<div>').addClass("dishOrder").attr("id",
							"memberDiv_" + i).appendTo(memberListPanel);
					var memberCaptionDiv = $('<div>').addClass("captionPanel")
							.appendTo(memberDiv);
					var memberOperationPanel = $('<div>').addClass(
							"dishOrderOperationPanel").appendTo(memberDiv);

					var memberCaptionHtml = new StringBuilder();
					memberCaptionHtml.append([
							" " + $.i18n.prop('string_huiYuanKaHao') + ":",
							$.trim(member.memberCardNo) ]);
					memberCaptionHtml.append([
							" " + $.i18n.prop('string_xingMing') + ":",
							member.name ]);
					memberCaptionHtml.append([
							" " + $.i18n.prop('string_dianHua') + ":",
							member.mobileNo ]);
					memberCaptionDiv.html(memberCaptionHtml.toString());

					$("<button>").data("member", member).addClass(
							"button chooseMember").text(
							$.i18n.prop('string_xuanZe')).appendTo(
							memberOperationPanel);
				}
			}
		}
	};
}

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

function AlertDialog(title, message, okCallback) {

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
			if (okCallback) {
				okCallback();
			}
			alertDialog.close();
		}
	};
}

function ConfirmDialog(title, message, okCallback) {

	this.show = function() {

		var dialogDiv = $("<div>").addClass("confirmDialog").appendTo('body');
		var confirmDialog = $(dialogDiv).modal({
			level : 10
		});

		$("<div>").text(title).addClass("confirmDialogTitle").appendTo(
				dialogDiv);
		if (message) {
			$("<div>").text(message).addClass("confirmDialogMessage").appendTo(
					dialogDiv);
		}

		var operationDiv = $("<div>").addClass("operationDiv").appendTo(
				dialogDiv);
		$("<div>").addClass("dialogButton").text($.i18n.prop('string_Confirm'))
				.appendTo(operationDiv).click(function() {
					if (okCallback) {
						okCallback();
					}
					confirmDialog.close();
				});
		$("<div>").addClass("dialogButton").text($.i18n.prop('string_Cancel'))
				.appendTo(operationDiv).click(function() {
					confirmDialog.close();
				});
	};
}

function AmountDialog(title, initValue, okCallback, isHex) {

	this.show = function() {
		var dialogDiv = $("<div>").addClass("amountDialog").appendTo('body');
		var digitKb = $("<div>").appendTo(dialogDiv).digitKeyboard(title,
				false, initValue, undefined, isHex);

		$("<div>").addClass("dialogButton").text($.i18n.prop('string_Confirm'))
				.appendTo(dialogDiv).click(function() {
					if (okCallback) {
						if (isHex){
							okCallback(digitKb.getText());	
						}
						else {
							okCallback(parseFloat(digitKb.getText()));
						}						
					}
					modal.close();
				});
		$("<div>").addClass("dialogButton").text($.i18n.prop('string_Cancel'))
				.appendTo(dialogDiv).click(function() {
					modal.close();
				});
		var modal = $(dialogDiv).modal({
			level : 5
		});
	};
}

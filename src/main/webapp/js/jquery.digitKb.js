(function($) {

	$.fn.digitKeyboard = function(title, isPasswordKeyboard, initValue, unit,
			isHex) {

		var keyboard = this;
		var captionContainer = $("<div>").appendTo(keyboard);

		var text = "";
		var unitText = "";
		if (initValue != undefined)// do not use if(initValue), case initValue
			// may equal 0
			text = initValue;

		if (unit != undefined && unit != "")
			unitText = unit;

		if (title != null) {
			$('<div>').addClass("digitKeyboardCaption").text(title + " ")
					.appendTo(captionContainer);
		}
		var amountAndUnitDiv = $('<div>').appendTo(captionContainer);

		var amountDiv = $('<div>').addClass("digitAmount");
		$('<span>').css("background", "#6AA1D8").text(text).appendTo(amountDiv);

		var unitDiv = $('<div>').addClass("digitUnit");
		if (unitText != "") {
			amountDiv.css("width", "55%").css("float", " left;");
			unitDiv.text(unitText).appendTo(amountAndUnitDiv);
		}
		amountDiv.appendTo(amountAndUnitDiv);

		$('<div>').css("clear", " both").appendTo(captionContainer);

		var keyDiv = $('<div>').appendTo(this);

		if (isHex) {
			$('<div>').text("A").attr("name", "keyButton").click(btnClick)
					.appendTo(keyDiv);
			$('<div>').text("B").attr("name", "keyButton").click(btnClick)
					.appendTo(keyDiv);
			$('<div>').text("C").attr("name", "keyButton").click(btnClick)
					.appendTo(keyDiv);
			$('<div>').css("clear", "both").appendTo(keyDiv);
			$('<div>').text("D").attr("name", "keyButton").click(btnClick)
					.appendTo(keyDiv);
			$('<div>').text("E").attr("name", "keyButton").click(btnClick)
					.appendTo(keyDiv);
			$('<div>').text("F").attr("name", "keyButton").click(btnClick)
					.appendTo(keyDiv);
			$('<div>').css("clear", "both").appendTo(keyDiv);
		}

		var btn = 1;
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				$('<div>').text(btn++).attr("name", "keyButton")
						.click(btnClick).appendTo(keyDiv);
			}
			$('<div>').css("clear", "both").appendTo(keyDiv);
		}

		$('<div>').text(".").attr("name", "keyButton").click(btnClick)
				.appendTo(keyDiv);
		$('<div>').text("0").attr("name", "keyButton").click(btnClick)
				.appendTo(keyDiv);
		$('<div>').text("<=").attr("name", "keyButton").click(
				function() {
					text = "0";
					amountDiv.text("");
					$('<span>').css("background", "#6AA1D8").text("0")
							.appendTo(amountDiv);
				}).appendTo(keyDiv);

		$("[name=keyButton]", keyDiv).addClass("digitButton");

		$('<div>').css("clear", "both").appendTo(keyDiv);

		this.getText = function() {
			return text;
		};

		this.setText = function(newText) {
			text = newText;
			if (isPasswordKeyboard) {
				newText = textChangeToPassword(newText);
			}
			return amountDiv.text(text);
		};

		this.setUnit = function(unit) {
			unitDiv.text(unit)
		};

		return this;

		function btnClick() {
			if (amountDiv.is(':has(span)'))
				text = '';
			var newText = text = text + $(this).text();
			if (isPasswordKeyboard) {
				newText = textChangeToPassword(newText);
			}
			amountDiv.text(newText);
		}

		function textChangeToPassword(inputPassword) {
			var outputPassword = "";
			for (var i = 0; i < inputPassword.length; i++) {
				outputPassword += "*";
			}
			return outputPassword;
		}
	};
})(jQuery);

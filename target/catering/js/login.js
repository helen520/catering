$(function() {
	$.i18n.delCurrentLanguage();
	$("#selectedLanguage").change(function() {
		var selectedLanguage = $("#selectedLanguage").val();
		$.i18n.setCurrentLanguage(selectedLanguage);
		loadProperties();
		$("#selectedLanguage").val(selectedLanguage);
	});

	loadProperties();
	$("#selectedLanguage").val($.i18n.browserLang());
	
	var urlStr = window.location.href;
	var test = new RegExp("demo","g");
	var result = urlStr.match(test);
	if(!(result===null)){
		$("#demo_hint").show();	
	}	
});

function loadProperties() {
	jQuery.i18n.properties({
		name : 'strings',
		path : 'resources/i18n/',
		mode : 'map',
		callback : function(supportedLanguagesMap) {
			$("#loginState").text($.i18n.prop('string_dengLuShiBai'));
			$("#loginFailureReason").text($.i18n.prop('string_yuanYingYongHuMingHuoMiMaCuoWu'));
			$("#successblock_text").text($.i18n.prop('string_miMaXiuGaiChengGongQingChongXingDengLu'));
			$("#user_text").text($.i18n.prop('string_yongHu'));
			$("#password_text").text($.i18n.prop('string_miMa'));
			$("#selectedLanguage_text").text($.i18n.prop('string_xuanZeYuYan'));
			$("#submit_button").val($.i18n.prop('string_dengLu'));
			$("#reset_button").val($.i18n.prop('string_chongZhi'));
			$("#modifyPassword").html($.i18n.prop('string_xiuGaiMiMa'));

			var selectObj = $("#selectedLanguage");
			selectObj.empty();

			for ( var key in supportedLanguagesMap) {
				$("<option>").val(key).text(supportedLanguagesMap[key]).appendTo(selectObj);
			}
		}
	});
}
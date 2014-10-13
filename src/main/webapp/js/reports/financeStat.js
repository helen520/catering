var requireAuthority = "CanViewReports";
var yOffset;
var rawDepartmentByIdMap = {};
var dishOrderTemplate;
var rawDishOrders;

$(document).ready(initUI);
function initUI() {
	//var adtList = //jsonRPCClient.ReportingService.getADTList(configuration.storeId);
//		var adtList=new Array("1369295335094","1369219024492","1369218862505","1369218067646");
//		
//	for ( var i in adtList) {
//		var adt = adtList[i];
//		var adtInDate = new Date(adt);
//
//		$('<option>', {
//			text :adt,// adtInDate.toDateTimeString(),
//			value : adt
//		}).appendTo($("#ADTSelect"));
//	}

	
}
function selectedChange(){
	var adt = parseInt($("#ADTSelect").val());
	$("#ADTLabel").text("ADT:" + adt);
}
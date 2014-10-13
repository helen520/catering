$(function() {
	$("#showSelectedReporting").click(function() {

		var selectedReportingTitleDiv = $("#selectedReportingTitle").text("");

		var startDate = parseInt($("#statrDate").val());
		var startDateStr = new Date(startDate).toDateString();

		var endDate = parseInt($("#endDate").val());
		var endDateStr = new Date(endDate).toDateString();

		var titleText = startDateStr + "到" + endDateStr + "菜品取消报表";

		selectedReportingTitleDiv.text(titleText);
	});
});
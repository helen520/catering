// JavaScript Document
$(function() {

	$("#datepicker").datepicker(
			{
				minDate : 0,
				maxDate : 15,
				onChangeMonthYear : function() {
					var currentDate = $("#datepicker").datepicker("getDate");
					$("#expectedArriveDate").val(
							$.datepicker.formatDate("yy-mm-dd", currentDate));
					if ($("#selectedTimeRangeItem").length > 0) {
						getResources();
					}
				},
				onSelect : function() {
					var currentDate = $("#datepicker").datepicker("getDate");
					$("#expectedArriveDate").val(
							$.datepicker.formatDate("yy-mm-dd", currentDate));
					if ($("#selectedTimeRangeItem").length > 0) {
						getResources();
					}
				}
			});

	$("#timeRangeItems .time-range-item")
			.click(
					function() {

						var arriveTimeOptions = $(this).attr(
								"arriveTimeOptions");

						$("#timeRangeItems .time-range-item").each(function() {
							$(this).removeAttr("id");
							$(this).removeClass("selected");
						});
						$(this).attr("id", "selectedTimeRangeItem");
						$(this).addClass("selected");

						getResources();

						var arriveTimeOptionArray = null;
						if (arriveTimeOptions != "") {
							arriveTimeOptionArray = arriveTimeOptions
									.split(",");
						}
						if (arriveTimeOptionArray.length > 0) {
							$("#arriveTimeOptionAlert").css("display", "black");
							var arriveTimeOptionsHtml = "";
							for (var i = 0; i < arriveTimeOptionArray.length; i++) {
								if (i != 0) {
									arriveTimeOptionsHtml = arriveTimeOptionsHtml
											.concat("<div class=\"left arrive-time-option\">");
								} else {
									arriveTimeOptionsHtml = arriveTimeOptionsHtml
											.concat("<div id=\"expectedArriveTime\" class=\"left arrive-time-option selected\">");
								}
								arriveTimeOptionsHtml = arriveTimeOptionsHtml
										.concat(arriveTimeOptionArray[i]);
								arriveTimeOptionsHtml = arriveTimeOptionsHtml
										.concat("</div>");
							}
							arriveTimeOptionsHtml = arriveTimeOptionsHtml
									.concat("<div class=\"clear\"></div>");
							$("#arriveTimeOptions").html(arriveTimeOptionsHtml);
							addArriveTimeOptionEvent();
						} else {
							$("#arriveTimeOptionAlert").css("display", "none");
						}

						$("#bookInfo").css("display", "block");
					});

	$("#submitBooking")
			.click(
					function() {
						var timeRangeId = $("#selectedTimeRangeItem").attr(
								"timeRageId");
						var resourceStr = "";
						var storeId = $.trim($("#storeId").val());
						var customerUserId = $.trim($("#customerUserId").val());
						var contactName = $.trim($("#contactName").val());
						var contactTel = $.trim($("#contactTel").val());
						var expectedArriveTime = $
								.trim($("#expectedArriveTime").text());
						var expectedArriveDate = $("#expectedArriveDate").val();
						var count = $("#count").val();
						var openId = $("#openId").val();
						var memo = $("#memo").val();
						var isServingArrived = $("#isServingArrived")[0].checked;

						var selectedResources = document
								.getElementsByName("resource");
						for (var i = 0; i < selectedResources.length; i++) {
							var resource = selectedResources[i];
							if (resource.checked) {
								var resourceId = $(resource).attr("resourceId");
								var resourceName = $(resource).attr(
										"resourceName");
								var resourceAmount = Number($(resource).attr(
										"resourceAmount"));
								if (!(resourceAmount > 0)) {
									alert(resourceName + "数量为0，不能预订！");
									resource.checked = !resource.checked;
									return;
								}
								resourceStr = resourceStr.concat(resourceId);
								resourceStr = resourceStr.concat(",");
								resourceStr = resourceStr.concat(resourceName);
								break;
							}
						}

						if (timeRangeId == "") {
							alert("请选择预订的服务！");
							return;
						}

						if ($("#timeRangeResources").html() != ""
								&& resourceStr == "") {
							alert("请选择你要预订的服务！");
							return;
						}

						if ($("#arriveTimeOptions").html() != ""
								&& expectedArriveTime == "") {
							alert("请选择到点时间！");
							return;
						}

						if (contactName == "") {
							alert("联系人不能为空！");
							return;
						}

						if (contactTel == "") {
							alert("联系电话不能为空！");
							return;
						}

						if (count == "") {
							alert("人数不能为空！");
							return;
						}

						var month = Number(expectedArriveDate.split("-")[1]);
						var date = Number(expectedArriveDate.split("-")[2]);
						var hours = Number(expectedArriveTime.split(":")[0]);
						var minutes = Number(expectedArriveTime.split(":")[1]);

						var nowMonth = Number(new Date().getMonth() + 1);
						var nowDate = Number(new Date().getDate());
						var nowHours = Number(new Date().getHours());
						var nowMinutes = Number(new Date().getMinutes());

						if (month == nowMonth) {
							if (date == nowDate) {
								if (hours < nowHours) {
									alert("无法预订已过时间!");
									return;
								} else if (hours == nowHours) {
									if (minutes < nowMinutes) {
										alert("无法预订已过时间!");
										return;
									}
								}
							}
						}

						$
								.ajax({
									url : "submitBook",
									type : 'POST',
									data : {
										timeRangeId : timeRangeId,
										resourceStr : resourceStr,
										storeId : storeId,
										customerUserId : customerUserId,
										contactName : contactName,
										contactTel : contactTel,
										expectedArriveTime : expectedArriveTime,
										expectedArriveDate : expectedArriveDate,
										count : count,
										memo : memo,
										isServingArrived : isServingArrived
									},
									timeout : 25000,
									error : function() {

									},
									success : function(result) {
										if (result != "" && result != null) {
											if (result.hadBookingDishOrder) {
												alert("预订成功！");
												window.location.reload();
												return;
											}
											if (isServingArrived) {
												window.location.href = "../wechat_self/"
														+ storeId
														+ "?openId="
														+ openId
														+ "&userId="
														+ customerUserId
														+ "&bookRecordId="
														+ result.id;
												return;
											}
											if (confirm("预订成功！是否预先点菜?点击确认进入点菜页面!")) {
												window.location.href = "../wechat_self/"
														+ storeId
														+ "?openId="
														+ openId
														+ "&userId="
														+ customerUserId
														+ "&bookRecordId="
														+ result.id;
												return;
											}
											window.location.reload();
											return;
										}
										alert("网络异常，预订失败！");
										return;
									}
								});
					});

});

function addArriveTimeOptionEvent() {
	$("#arriveTimeOptions .arrive-time-option").click(function() {
		$("#arriveTimeOptions .arrive-time-option").each(function() {
			$(this).removeAttr("id");
			$(this).removeClass("selected");
		});
		$(this).attr("id", "expectedArriveTime");
		$(this).addClass("selected");
	});
}

function getResources() {

	var timeRangeId = $("#selectedTimeRangeItem").attr("timeRageId");
	var storeId = $.trim($("#storeId").val());
	var expectedArriveDate = $("#expectedArriveDate").val();

	$.ajax({
		url : "getResources",

		type : 'POST',

		data : {
			storeId : storeId,
			timeRangeId : timeRangeId,
			expectedArriveDate : expectedArriveDate
		},

		dataType : 'html',

		timeout : 25000,

		error : function() {
			alert("error");
		},
		success : function(result) {

			var timeRangeResources = eval(result);
			var timeRangeResourcesHtml = "";

			for (var i = 0; i < timeRangeResources.length; i++) {
				var timeRangeResource = timeRangeResources[i];
				timeRangeResourcesHtml = timeRangeResourcesHtml
						.concat("<div class=\"time-range-resource-item\">");
				timeRangeResourcesHtml = timeRangeResourcesHtml
						.concat("<label>");
				timeRangeResourcesHtml = timeRangeResourcesHtml
						.concat("<input resourceId='");
				timeRangeResourcesHtml = timeRangeResourcesHtml
						.concat(timeRangeResource.id);
				timeRangeResourcesHtml = timeRangeResourcesHtml
						.concat("' resourceName='");
				timeRangeResourcesHtml = timeRangeResourcesHtml
						.concat(timeRangeResource.name);
				timeRangeResourcesHtml = timeRangeResourcesHtml
						.concat("' resourceAmount='");
				timeRangeResourcesHtml = timeRangeResourcesHtml
						.concat(timeRangeResource.amount);
				timeRangeResourcesHtml = timeRangeResourcesHtml
						.concat("' name=\"resource\" type='radio'/>");
				timeRangeResourcesHtml = timeRangeResourcesHtml
						.concat(timeRangeResource.name);
				timeRangeResourcesHtml = timeRangeResourcesHtml.concat("(可预订数:"
						+ timeRangeResource.amount + ")");
				timeRangeResourcesHtml = timeRangeResourcesHtml
						.concat("</label>");
				timeRangeResourcesHtml = timeRangeResourcesHtml
						.concat("</div>");
			}

			$("#timeRangeResources").html(timeRangeResourcesHtml);
			// addTimeRangeResourcesEvent();

			var firstResourceItemObj = $("#timeRangeResources").find(
					".time-range-resource-item").first();
			if (firstResourceItemObj.html() != "undefined") {
				var selectObj = firstResourceItemObj.find("input");
				selectObj.attr("checked", "checked");
			}
		}
	});
}

function addTimeRangeResourcesEvent() {
	$("#timeRangeResources label").click(function() {
		var selectObj = $(this).find("input");
		if (selectObj.attr("checked") != "checked") {
			selectObj.attr("checked", true);
		} else {
			selectObj.attr("checked", false);
		}
	});
}

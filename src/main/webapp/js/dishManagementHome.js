var $storeId = 0;
var $menus;
var $curDesk;
var $curMenu;
var $pickedDishIndex;
var $curDishCategoryId;
var $curDish;
var $departments;
var $dishCategoriesMap = {};
var $addDishTagDialog;
var $dishTagDialog;
var $trTdIndexForSelected;
var $dishIdByNameMap = {};
var $dishNameByIdMap = {};
var $bomLinesByDishIdMap = {};
var $dishByIdMap = {};
var $dishNames;
var $selectedDish = "";
var $curFormDialog;
var $dishManagementData;
var $curPosPrinter;
var $curDepartment;
var $curBookingTimeRange;
var $curRoomResource;
var $curPaymentType;
var $curServiceFeeRate;
var $curDiscountRate;
var $curCancelReason;
var $curDishUnit;
var $curMaterial;
var $curEmployee;
var $curStore;
var $curDiscountRule;
var $dishAutoComplete;
var $materialAutoComplete;

$(function() {
	$storeId = Number(getQueryString("storeId"));
	loadProperties();
	loadData();

	$("#menus").click(function() {
		$(".menuButton").removeClass("selected-menu");
		$(this).addClass("selected-menu");
		clearScreen();
		renderDishMenus();
	});

	$("#materials").click(function() {
		$(".menuButton").removeClass("selected-menu");
		$(this).addClass("selected-menu");
		clearScreen();
		renderMaterials();
	});

	$("#commonDishTags").click(function() {
		$(".menuButton").removeClass("selected-menu");
		$(this).addClass("selected-menu");
		$pickedDishIndex = null;
		clearScreen();
		renderDishTags();
	});

	$("#desks").click(function() {
		$(".menuButton").removeClass("selected-menu");
		$(this).addClass("selected-menu");
		clearScreen();
		renderDesks();
	});

	$("#posPrinters").click(function() {
		$(".menuButton").removeClass("selected-menu");
		$(this).addClass("selected-menu");
		clearScreen();
		renderPosPrinters();
	});

	$("#departments").click(function() {
		$(".menuButton").removeClass("selected-menu");
		$(this).addClass("selected-menu");
		clearScreen();
		renderDepartments();
	});

	$("#bookingTimeRanges").click(function() {
		$(".menuButton").removeClass("selected-menu");
		$(this).addClass("selected-menu");
		clearScreen();
		renderBookingTimeRanges();
	});

	$("#roomResources").click(function() {
		$(".menuButton").removeClass("selected-menu");
		$(this).addClass("selected-menu");
		clearScreen();
		renderRoomResources();
	});

	$("#paymentTypes").click(function() {
		$(".menuButton").removeClass("selected-menu");
		$(this).addClass("selected-menu");
		clearScreen();
		renderPaymentTypes();
	});

	$("#serviceFeeRates").click(function() {
		$(".menuButton").removeClass("selected-menu");
		$(this).addClass("selected-menu");
		clearScreen();
		renderServiceFeeRates();
	});

	$("#discountRates").click(function() {
		$(".menuButton").removeClass("selected-menu");
		$(this).addClass("selected-menu");
		clearScreen();
		renderDiscountRates();
	});

	$("#cancelReasons").click(function() {
		$(".menuButton").removeClass("selected-menu");
		$(this).addClass("selected-menu");
		clearScreen();
		renderCancelReasons();
	});

	$("#discountRules").click(function() {
		$(".menuButton").removeClass("selected-menu");
		$(this).addClass("selected-menu");
		clearScreen();
		renderDiscountRules();
	});

	$("#dishUnits").click(function() {
		$(".menuButton").removeClass("selected-menu");
		$(this).addClass("selected-menu");
		clearScreen();
		renderDishUnits();
	});

	$("#employees").click(function() {
		$(".menuButton").removeClass("selected-menu");
		$(this).addClass("selected-menu");
		clearScreen();
		renderEmployees();
	});

	$("#store").click(function() {
		$(".menuButton").removeClass("selected-menu");
		$(this).addClass("selected-menu");
		clearScreen();
		renderStore();
	});

	$("#departmentList")
			.delegate(
					".item",
					"click",
					function() {
						if ($(this).hasClass("addDepartmentBtn")) {
							$("#departmentList .item").removeClass("selected");
							$(this).addClass("selected");
							$("#formDepartmentId").val(0);
							$curDepartment = null;
							showFormDialog(
									"#addOrUpdateDepartmentDialogTemplate",
									submitDepartment);
							return;
						}

						var departmentIndex = Number($(this).attr(
								"departmentIndex"));
						$curDepartment = $dishManagementData.departments[departmentIndex];
						if ($(this).hasClass("selected")) {
							$("#formDepartmentId").val($curDepartment.id);
							$("#formDepartmentName").val($curDepartment.name);
							$("#formDepartmentCookingNotePrinterId").val(
									$curDepartment.cookingNotePrinterId);
							$("#formDepartmentDelivererNotePrinterId").val(
									$curDepartment.delivererNotePrinterId);
							$("#formDepartmentSliceCookingNotes")
									.prop("checked",
											$curDepartment.sliceCookingNotes);

							showFormDialog(
									"#addOrUpdateDepartmentDialogTemplate",
									submitDepartment, deleteDepartment);
							return;
						}

						$("#departmentList .item").removeClass("selected");
						$(this).addClass("selected");
					});

	$("#posPrinterList")
			.delegate(
					".item",
					"click",
					function() {
						if ($(this).hasClass("addPosPrinterBtn")) {
							$("#posPrinterList .item").removeClass("selected");
							$(this).addClass("selected");
							$("#posPrinterId").val(0);
							$curDesk = null;
							$("#testPrinter").hide();
							showFormDialog(
									"#addOrUpdatePosPrinterDialogTemplate",
									submitPosPrinter);
							return;
						}

						var posPrinterIndex = Number($(this).attr(
								"posPrinterIndex"));
						$curPosPrinter = $dishManagementData.posPrinters[posPrinterIndex];
						if ($(this).hasClass("selected")) {
							$("#testPrinter").show();
							$("#posPrinterId").val($curPosPrinter.id);
							$("#posPrinterName").val($curPosPrinter.name);
							$("#posPrinterCanPrintCustomerNote").prop(
									"checked",
									$curPosPrinter.canPrintCustomerNote);
							$("#posPrinterDeviceName").val(
									$curPosPrinter.deviceName);
							$("#posPrinterBaudBase").val(
									$curPosPrinter.baudBase);
							$("#posPrinterFrameWidth").val(
									$curPosPrinter.frameWidth);
							$("#posPrinterCharactersPerLine").val(
									$curPosPrinter.charactersPerLine);
							$("#posPrinterNumber").val($curPosPrinter.number);
							$("#posPrinterBeep").prop("checked",
									$curPosPrinter.beep);

							showFormDialog(
									"#addOrUpdatePosPrinterDialogTemplate",
									submitPosPrinter, deletePosPrinter);
							return;
						}

						$("#posPrinterList .item").removeClass("selected");
						$(this).addClass("selected");
					});

	$("#deskList")
			.delegate(
					".deskItem",
					"click",
					function() {
						if ($(this).hasClass("addDeskBtn")) {
							$("#deskList .deskItem").removeClass(
									"selected-desk");
							$(this).addClass("selected-desk");
							$("#deskId").val(0);
							$curDesk = null;
							showFormDialog("#addOrUpdateDeskDialogTemplate",
									submitDesk);
							return;
						}

						var deskIndex = Number($(this).attr("deskIndex"));
						$curDesk = $dishManagementData.desks[deskIndex];
						if ($(this).hasClass("selected-desk")) {
							$("#deskId").val($curDesk.id);
							$("#deskName").val($curDesk.name);
							$("#deskGroupName").val($curDesk.groupName);
							$("#deskCustomerNotePrinterId").val(
									$curDesk.posPrinterId);
							$("#deskNumber").val($curDesk.number);
							$("#deskChargeVIPFee").prop("checked",
									$curDesk.chargeVIPFee);
							$("#deskServiceFeeRate").val(
									$curDesk.serviceFeeRate);
							$("#deskEnabled").prop("checked", $curDesk.enabled);
							$("#deskSort").val($curDesk.sort);
							$("#deskForTesting").prop("checked",
									$curDesk.forTesting);

							showFormDialog("#addOrUpdateDeskDialogTemplate",
									submitDesk, deleteDesk);
							return;
						}

						$("#deskList .deskItem").removeClass("selected-desk");
						$(this).addClass("selected-desk");
					});

	$("#dishMenuList")
			.delegate(
					".dishMenuItem",
					"click",
					function() {
						if ($(this).hasClass("addMenuBtn")) {
							$("#dishCategoryList").hide();
							$("#dishList").html("");
							$("#dishTagList").html("");

							$curMenu = null;
							$("#menuId").val(0);
							$("#menuName").val("");
							$("#menuSort").val(0);
							showFormDialog("#addOrUpdateMenuDialogTemplate",
									submitMenu);
							return;
						}

						var dishMenuIndex = Number($(this)
								.attr("dishMenuIndex"));
						$curMenu = $menus[dishMenuIndex];
						if ($(this).hasClass("selected-dish-menu")) {
							$("#menuId").val($curMenu.id);
							$("#menuName").val($curMenu.name);
							$("#menuSort").val($curMenu.sort);
							showFormDialog("#addOrUpdateMenuDialogTemplate",
									submitMenu, deleteMenu);
							return;
						}

						$("#dishMenuList .dishMenuItem").removeClass(
								"selected-dish-menu");
						$(this).addClass("selected-dish-menu");
						renderCurMenuDishCategories();
						$("#dishCategoryList").show();
						$("#dishList").html("");
						$("#dishTagList").html("");
					});

	$("#dishCategoryList").delegate(
			".dishCategoryItem",
			"click",
			function() {
				if ($(this).hasClass("addDishCategoryBtn")) {
					$("#dishList").html("");
					$("#dishTagList").html("");
					$("#dishCategoryList .dishCategoryItem").removeClass(
							"selected-dish-category-background");
					$(this).addClass("selected-dish-category-background");
					$curDishCategoryId = null;
					$("#formDishCategoryId").val(0);
					showFormDialog("#addOrUpdateDishCategoryDialogTemplate",
							submitDishCategory);
					return;
				}

				$curDishCategoryId = Number($(this).attr("dishCategoryId"));
				if ($(this).hasClass("selected-dish-category-background")) {
					var dishCategory = $dishCategoriesMap[$curDishCategoryId];
					$("#formDishCategoryId").val(dishCategory.id);
					$("#formDishCategoryName").val(dishCategory.name);
					$("#formDishMenuOptions").val(dishCategory.menuId);
					$("#formDishCategoryAlias").val(dishCategory.alias);
					$("#formDishCategorySort").val(dishCategory.sort);
					showFormDialog("#addOrUpdateDishCategoryDialogTemplate",
							submitDishCategory, deleteDishCategory);
					return;
				}
				renderDishes($curDishCategoryId);
			});

	$("#dishList")
			.delegate(
					".dishItem",
					"click",
					function() {
						if ($(this).hasClass("addDishMenuButton")) {
							$("#dishList .dishItem").removeClass(
									"selected-dish-item-background");
							$(this).addClass("selected-dish-item-background");
							$curDish = null;
							addDish();
							return;
						}

						$pickedDishIndex = Number($(this).attr("dishIndex"));
						$curDish = $dishCategoriesMap[$curDishCategoryId].dishes[$pickedDishIndex];
						if ($(this).hasClass("selected-dish-item-background")) {
							editDish($curDishCategoryId, $curDish);
							return;
						}
						$("#dishList .dishItem").removeClass(
								"selected-dish-item-background");
						$(this).addClass("selected-dish-item-background");

						renderDishTags();
						$("#dishTagList").show();
					});

	$("#dishTagList").delegate(
			".dishTagItem",
			"click",
			function() {
				if ($(this).hasClass("addDishTagBtn")) {
					$("#dishTagList .dishTagItem").removeClass(
							"selected-dishTag-item-background");
					$(this).addClass("selected-dishTag-item-background");

					$("#formDishTagId").val(0);
					showFormDialog("#addOrUpdateDishTagDialogTemplate",
							submitDishTag);
					return;
				}

				if ($(this).hasClass("selected-dishTag-item-background")) {
					var id = Number($(this).attr("dishtagid"));
					$("#formDishTagId").val(id);
					var dishTag = $dishTagByIdMap[id];
					$("#formDishTagName").val(dishTag.name);
					$("#formDishTagAlias").val(dishTag.alias);
					$("#formDishTagGroupName").val(dishTag.groupName);
					$("#formOptionSetNoName").val(dishTag.optionSetNo);
					$("#formDishTagSort").val(dishTag.sort);
					$("#formDishTagPriceDelta").val(dishTag.priceDelta);
					showFormDialog("#addOrUpdateDishTagDialogTemplate",
							submitDishTag, deleteDishTag);
					return;
				}
				$("#dishTagList .dishTagItem").removeClass(
						"selected-dishTag-item-background");
				$(this).addClass("selected-dishTag-item-background");
			});

	$("#bookingTimeRangeList")
			.delegate(
					".item",
					"click",
					function() {
						if ($(this).hasClass("addBookingTimeRangeBtn")) {
							$("#bookingTimeRangeList .item").removeClass(
									"selected");
							$(this).addClass("selected");
							$("#timeRangeId").val(0);
							$curBookingTimeRange = null;
							showFormDialog(
									"#addOrUpdateBookingTimeRangeDialogTemplate",
									submitBookingTimeRange);
							return;
						}

						var timeRangeIndex = Number($(this).attr(
								"timeRangeIndex"));
						$curBookingTimeRange = $dishManagementData.timeRanges[timeRangeIndex];
						if ($(this).hasClass("selected")) {
							$("#timeRangeId").val($curBookingTimeRange.id);
							$("#timeRangeName").val($curBookingTimeRange.name);
							$("#arriveTimeOptions").val(
									$curBookingTimeRange.arriveTimeOptions);

							showFormDialog(
									"#addOrUpdateBookingTimeRangeDialogTemplate",
									submitBookingTimeRange,
									deleteBookingTimeRange);
							return;
						}

						$("#bookingTimeRangeList .item")
								.removeClass("selected");
						$(this).addClass("selected");
					});

	$("#roomResourceList")
			.delegate(
					".item",
					"click",
					function() {
						if ($(this).hasClass("addRoomResourceBtn")) {
							$("#roomResourceList .item")
									.removeClass("selected");
							$(this).addClass("selected");
							$("#resourceId").val(0);
							$curRoomResource = null;
							showFormDialog(
									"#addOrUpdateRoomResourceDialogTemplate",
									submitRoomResource);
							return;
						}

						var resourceIndex = Number($(this)
								.attr("resourceIndex"));
						$curRoomResource = $dishManagementData.resources[resourceIndex];
						if ($(this).hasClass("selected")) {
							$("#resourceId").val($curRoomResource.id);
							$("#resourceName").val($curRoomResource.name);
							$("#formTimeRangeId").val(
									$curRoomResource.timeRangeId);
							$("#timeRangeAmount").val($curRoomResource.amount);
							showFormDialog(
									"#addOrUpdateRoomResourceDialogTemplate",
									submitRoomResource, deleteRoomResource);
							return;
						}

						$("#roomResourceList .item").removeClass("selected");
						$(this).addClass("selected");
					});

	$("#paymentTypeList")
			.delegate(
					".item",
					"click",
					function() {
						if ($(this).hasClass("addPaymentTypeBtn")) {
							$("#paymentTypeList .item").removeClass("selected");
							$(this).addClass("selected");
							$("#paymentTypeId").val(0);
							$curPaymentType = null;
							showFormDialog(
									"#addOrUpdatePaymentTypeDialogTemplate",
									submitPaymentType);
							return;
						}

						var paymentTypeIndex = Number($(this).attr(
								"paymentTypeIndex"));
						$curPaymentType = $dishManagementData.paymentTypes[paymentTypeIndex];
						if ($(this).hasClass("selected")) {
							$("#paymentTypeId").val($curPaymentType.id);
							$("#paymentTypeName").val($curPaymentType.name);
							$("#paymentTypeExchangeRate").val(
									$curPaymentType.exchangeRate);
							$("#paymentTypeSort").val($curPaymentType.sort);

							showFormDialog(
									"#addOrUpdatePaymentTypeDialogTemplate",
									submitPaymentType, deletePaymentType);
							return;
						}

						$("#paymentTypeList .item").removeClass("selected");
						$(this).addClass("selected");
					});

	$("#serviceFeeRateList")
			.delegate(
					".item",
					"click",
					function() {
						if ($(this).hasClass("addServiceFeeRateBtn")) {
							$("#serviceFeeRateList .item").removeClass(
									"selected");
							$(this).addClass("selected");
							$("#addOrUpdateServiceFeeRateDialogTemplate #id")
									.val(0);
							$curServiceFeeRate = null;
							showFormDialog(
									"#addOrUpdateServiceFeeRateDialogTemplate",
									submitNamedValue);
							return;
						}

						var serviceFeeRateIndex = Number($(this).attr(
								"serviceFeeRateIndex"));
						$curServiceFeeRate = $dishManagementData.serviceFeeRates[serviceFeeRateIndex];
						if ($(this).hasClass("selected")) {
							$("#addOrUpdateServiceFeeRateDialogTemplate #id")
									.val($curServiceFeeRate.id);
							$("#addOrUpdateServiceFeeRateDialogTemplate #name")
									.val($curServiceFeeRate.name);
							$("#addOrUpdateServiceFeeRateDialogTemplate #type")
									.val($curServiceFeeRate.type);
							$("#addOrUpdateServiceFeeRateDialogTemplate #value")
									.val($curServiceFeeRate.value);
							showFormDialog(
									"#addOrUpdateServiceFeeRateDialogTemplate",
									submitNamedValue, deleteNamedValue);
							return;
						}

						$("#serviceFeeRateList .item").removeClass("selected");
						$(this).addClass("selected");
					});

	$("#discountRateList")
			.delegate(
					".item",
					"click",
					function() {
						if ($(this).hasClass("addDiscountRateBtn")) {
							$("#discountRateList .item")
									.removeClass("selected");
							$(this).addClass("selected");
							$("#addOrUpdateDiscountRateDialogTemplate #id")
									.val(0);
							$curDiscountRate = null;
							showFormDialog(
									"#addOrUpdateDiscountRateDialogTemplate",
									submitNamedValue);
							return;
						}

						var discountRateIndex = Number($(this).attr(
								"discountRateIndex"));
						$curDiscountRate = $dishManagementData.discountRates[discountRateIndex];
						if ($(this).hasClass("selected")) {
							$("#addOrUpdateDiscountRateDialogTemplate #id")
									.val($curDiscountRate.id);
							$("#addOrUpdateDiscountRateDialogTemplate #name")
									.val($curDiscountRate.name);
							$("#addOrUpdateDiscountRateDialogTemplate #type")
									.val($curDiscountRate.type);
							$("#addOrUpdateDiscountRateDialogTemplate #value")
									.val($curDiscountRate.value);
							showFormDialog(
									"#addOrUpdateDiscountRateDialogTemplate",
									submitNamedValue, deleteNamedValue);
							return;
						}

						$("#discountRateList .item").removeClass("selected");
						$(this).addClass("selected");
					});

	$("#cancelReasonList")
			.delegate(
					".item",
					"click",
					function() {
						if ($(this).hasClass("addCancelReasonBtn")) {
							$("#cancelReasonList .item")
									.removeClass("selected");
							$(this).addClass("selected");
							$("#addOrUpdateCancelReasonDialogTemplate #id")
									.val(0);
							$curCancelReason = null;
							showFormDialog(
									"#addOrUpdateCancelReasonDialogTemplate",
									submitNamedValue);
							return;
						}

						var cancelReasonIndex = Number($(this).attr(
								"cancelReasonIndex"));
						$curCancelReason = $dishManagementData.cancelReasons[cancelReasonIndex];
						if ($(this).hasClass("selected")) {
							$("#addOrUpdateCancelReasonDialogTemplate #id")
									.val($curCancelReason.id);
							$("#addOrUpdateCancelReasonDialogTemplate #name")
									.val($curCancelReason.name);
							$("#addOrUpdateCancelReasonDialogTemplate #type")
									.val($curCancelReason.type);
							$("#addOrUpdateCancelReasonDialogTemplate #value")
									.val($curCancelReason.value);
							showFormDialog(
									"#addOrUpdateCancelReasonDialogTemplate",
									submitNamedValue, deleteNamedValue);

							return;
						}

						$("#cancelReasonList .item").removeClass("selected");
						$(this).addClass("selected");
					});

	$("#discountRuleList")
			.delegate(
					".item",
					"click",
					function() {
						if ($(this).hasClass("addDiscountRuleBtn")) {
							$("#discountRuleList .item")
									.removeClass("selected");
							$(this).addClass("selected");
							$("#discountRuleId").val(0);
							$curDiscountRule = null;
							showFormDialog(
									"#addOrUpdateDiscountRuleDialogTemplate",
									submitDiscountRule);
							return;

						}

						var discountRuleIndex = Number($(this).attr(
								"discountRuleIndex"));
						$curDiscountRule = $dishManagementData.discountRules[discountRuleIndex];
						if ($(this).hasClass("selected")) {
							$("#discountRuleId").val($curDiscountRule.id);
							$("#discountRuleName").val($curDiscountRule.name);
							$("#discountRuleValue").val($curDiscountRule.value);
							$("#discountRuleDiscountRate").val(
									$curDiscountRule.discountRate);
							$("#discountRuleNoOverallDiscount").prop("checked",
									$curDiscountRule.noOverallDiscount);
							showFormDialog(
									"#addOrUpdateDiscountRuleDialogTemplate",
									submitDiscountRule, deleteDiscountRule);

							return;
						}

						$("#discountRuleList .item").removeClass("selected");
						$(this).addClass("selected");
					});

	$("#dishUnitList").delegate(
			".item",
			"click",
			function() {
				if ($(this).hasClass("addDishUnitBtn")) {
					$("#dishUnitList .item").removeClass("selected");
					$(this).addClass("selected");
					$("#dishUnitId").val(0);
					$curDishUnit = null;
					showFormDialog("#addOrUpdateDishUnitDialogTemplate",
							submitDishUnit);
					return;
				}

				var dishUnitIndex = Number($(this).attr("dishUnitIndex"));
				$curDishUnit = $dishManagementData.dishUnits[dishUnitIndex];
				if ($(this).hasClass("selected")) {
					$("#dishUnitId").val($curDishUnit.id);
					$("#dishUnitName").val($curDishUnit.name);
					$("#dishUnitGroupNumber").val($curDishUnit.groupNumber);
					$("#dishUnitExchangeRate").val($curDishUnit.exchangeRate);
					$("#dishUnitSort").val($curDishUnit.sort);

					showFormDialog("#addOrUpdateDishUnitDialogTemplate",
							submitDishUnit, deleteDishUnit);
					return;
				}

				$("#dishUnitList .item").removeClass("selected");
				$(this).addClass("selected");
			});

	$("#employeeList").delegate(
			".item",
			"click",
			function() {

				var employeeIndex = Number($(this).attr("employeeIndex"));
				$curEmployee = $dishManagementData.employees[employeeIndex];
				if ($(this).hasClass("selected")) {
					$("#employeeId").val($curEmployee.id);
					$("#employeeName").val($curEmployee.name);
					$("#employeeLoginNo").val($curEmployee.loginNo);
					$("#employeeWorkNumber").val($curEmployee.workNumber);
					$("#employeeSmartCardNo").val($curEmployee.smartCardNo);
					$("#employeeCanRestoreDishOrder").prop("checked",
							$curEmployee.canRestoreDishOrder);
					$("#employeeCanPreprintCheckoutNote").prop("checked",
							$curEmployee.canPreprintCheckoutNote);
					$("#employeeCanCancelOrderItem").prop("checked",
							$curEmployee.canCancelOrderItem);
					$("#employeeCanViewReport").prop("checked",
							$curEmployee.canViewReport);
					$("#employeeCanCancelDishSoldOut").prop("checked",
							$curEmployee.canCancelDishSoldOut);

					showFormDialog("#addOrUpdateEmployeeDialogTemplate",
							submitEmployee);
					return;
				}

				$("#employeeList .item").removeClass("selected");
				$(this).addClass("selected");
			});

	$("#storeList").delegate(
			".item",
			"click",
			function() {

				$curStore = $dishManagementData.store;
				if ($(this).hasClass("selected")) {
					$("#storeId").val($curStore.id);
					$("#storeName").val($curStore.name);
					$("#stroeCheckoutPosPrinterId").val(
							$curStore.checkoutPosPrinterId);
					$("#storeAutoPrintCustomerNote").prop("checked",
							$curStore.autoPrintCustomerNote);
					$("#storeNoShowPriceInCustomerNote").prop("checked",
							$curStore.noShowPriceInCustomerNote);
					$("#storePointRate").val($curStore.pointRate);
					$("#storeIncludedCouponValueInPoint").prop("checked",
							$curStore.includedCouponValueInPoint);
					$("#storeIsDoubleSizeFont").prop("checked",
							$curStore.isDoubleSizeFont);
					$("#storeActivity").val($curStore.storeActivity);

					showFormDialog("#addOrUpdateStoreDialogTemplate",
							submitStore);
					return;
				}

				$("#employeeList .item").removeClass("selected");
				$(this).addClass("selected");
			});

	$("#materialList").delegate(
			".item",
			"click",
			function() {
				if ($(this).hasClass("addMaterialBtn")) {
					$("#materialList .item").removeClass("selected");
					$(this).addClass("selected");
					$("#materialId").val(0);
					$curMaterial = null;
					showFormDialog("#addOrUpdateMaterialDialogTemplate",
							submitMaterial);
					return;
				}

				var materialIndex = Number($(this).attr("materialIndex"));
				$curMaterial = $dishManagementData.materials[materialIndex];
				if ($(this).hasClass("selected")) {
					$("#materialId").val($curMaterial.id);
					$("#materialName").val($curMaterial.name);
					$("#materialSort").val($curMaterial.sort);

					showFormDialog("#addOrUpdateMaterialDialogTemplate",
							submitMaterial, deleteMaterial);
					return;
				}

				$("#materialList .item").removeClass("selected");
				$(this).addClass("selected");
			});

	$("#editDishToSoldOutMenuButton").click(editDishToSoldOut);

	$("#testPrinter").click(testPrinter);

	$("#uploadify").uploadify({
		uploader : '../admin/uploadImage',
		swf : '../js/vendor/uploadify.swf',
		auto : true,
		multi : false,
		method : 'POST',
		removeTimeout : 1,
		fileSizeLimit : 2 * 1024,
		formData : {
			storeId : $storeId
		},
		fileTypeExts : '*.gif;*.jpg;*.jpeg;*.png',
		buttonText : '选择图片',
		onSelectError : function() {
			alert(' 请选择*.gif;*.jpg;*.jpeg;*.png格式的图片!');
		},
		onUploadError : function(file, errorCode, errorMsg, errorString) {
			alert('无法上传该图片,错误原因: ' + errorString);
		},
		onUploadSuccess : function(file, data, response) {
			if (data == "false") {
				alert("上传图片出错!请稍后再试!");
				return;
			}
			$("[name='showDishPicPath']").val(data.split("||")[0]);
			$("[name='secondPicPath']").attr("src", data.split("||")[1]);
		}
	});
});

function closeCurFormDialog() {
	$("#meal_deal_tab").empty();
	$("#uploadifyDiv").hide();
	$curFormDialog.closeNotRemoved();
}

function renderDesks() {
	var deskHtml = new StringBuilder();
	deskHtml.append("<div class='addDeskBtn button deskItem'>+</div>");
	for ( var i in $dishManagementData.desks) {
		var desk = $dishManagementData.desks[i];
		deskHtml
				.append([ "<div class=\"button deskItem\" deskIndex='", i, "'>" ]);
		deskHtml.append(desk.name);
		deskHtml.append("</div>");
	}
	$("#deskList").html(deskHtml.toString());
}

function deleteDishTag() {
	if (confirm("确定删除此菜品做法?"))
		$.ajax({
			type : "POST",
			url : "../admin/deleteDishTag",
			data : {
				id : this.form.formDishTagId.value
			},
			dataType : "json",
			async : false,
			error : function(error) {
				alert("不能删除此菜品做法:" + error.responseText);
			},
			success : function(noOrderExist) {
				if (noOrderExist) {
					alert("删除菜品做法成功");
					loadData();
					renderDishTags();
					closeCurFormDialog();
				} else
					alert("不能删除此菜品做法:存在此做法的订单");
			}
		});
}

function clearScreen() {
	$("#dishMenuList").html("");
	$("#dishCategoryList").html("");
	$("#dishList").html("");
	$("#dishTagList").html("");
	$("#deskList").html("");
	$("#posPrinterList").html("");
	$("#departmentList").html("");
	$("#bookingTimeRangeList").html("");
	$("#roomResourceList").html("");
	$("#paymentTypeList").html("");
	$("#serviceFeeRateList").html("");
	$("#discountRateList").html("");
	$("#cancelReasonList").html("");
	$("#discountRuleList").html("");
	$("#dishUnitList").html("");
	$("#employeeList").html("");
	$("#storeList").html("");
	$("#materialList").html("");
}

function submitDishTag() {
	var curDishId = null;
	if ($pickedDishIndex != null)
		curDishId = $dishCategoriesMap[$curDishCategoryId].dishes[$pickedDishIndex].id;
	$.ajax({
		type : 'POST',
		url : "../admin/addOrUpdateDishTag",
		data : {
			id : this.form.formDishTagId.value,
			storeId : $storeId,
			dishId : curDishId,
			groupName : this.form.formDishTagGroupName.value,
			optionSetNo : this.form.formOptionSetNoName.value,
			name : this.form.formDishTagName.value,
			alias : this.form.formDishTagAlias.value,
			priceDelta : this.form.formDishTagPriceDelta.value,
			sort : this.form.formDishTagSort.value
		},
		dataType : "json",
		async : false,
		error : function(error) {
			alert("提交失败:" + error.responseText);
		},
		success : function(menu) {
			alert("提交成功!");
			loadData();
			renderDishTags();
			closeCurFormDialog();
		}
	});
}

function renderDishTags() {
	var curDishTags = {};
	if ($pickedDishIndex != null) {
		var curDish = $dishCategoriesMap[$curDishCategoryId].dishes[$pickedDishIndex];
		curDishTags = curDish.dishTags;
	} else
		curDishTags = $dishManagementData.commonDishTags;

	var dishTagsHtml = new StringBuilder();
	dishTagsHtml
			.append("<div class='addDishTagBtn button dishTagItem'>+</div>");
	for ( var i in curDishTags) {
		var dishTag = curDishTags[i];
		dishTagsHtml.append([ "<div class=\"button dishTagItem\" dishTagId='",
				dishTag.id, "'>" ]);
		dishTagsHtml.append(dishTag.name);
		dishTagsHtml.append("</div>");
	}
	$("#dishTagList").html(dishTagsHtml.toString());
}

function submitDishCategory() {
	var id = this.form.formDishCategoryId.value;
	var menuId = this.form.formDishMenuOptions.value;
	var name = this.form.formDishCategoryName.value;
	var alias = this.form.formDishCategoryAlias.value;
	var sort = this.form.formDishCategorySort.value;
	if ($curDishCategoryId != null)
		id = $curDishCategoryId;

	$.ajax({
		type : 'POST',
		url : "../admin/addOrUpdateDishCategory",
		data : {
			id : id,
			menuId : menuId,
			name : name,
			alias : alias,
			sort : sort
		},
		dataType : "json",
		async : false,
		error : function(error) {
			alert("提交失败:" + error.responseText);
		},
		success : function(menu) {
			alert("提交成功!");
			loadData();
			renderCurMenuDishCategories();
			closeCurFormDialog();
		}
	});
}

function deleteDishCategory() {
	if (confirm("确定删除此菜品分类?"))
		$.ajax({
			type : "POST",
			url : "../admin/deleteDishCategory",
			data : {
				id : $curDishCategoryId
			},
			dataType : "json",
			async : false,
			error : function(error) {
				alert("不能删除此菜品分类:" + error.responseText);
			},
			success : function(noDishExist) {
				if (noDishExist) {
					alert("删除菜品分类成功");
					loadData();
					renderCurMenuDishCategories();
					closeCurFormDialog();
				} else
					alert("不能删除此菜品分类:此菜品分类包含菜品，请先删除该菜品分类下的菜品再试");
			}
		});
}

function deleteMenu() {
	var id = this.form.menuId.value;
	if (confirm("确定删除此菜谱?"))
		$.ajax({
			type : "POST",
			url : "../admin/deleteMenu",
			data : {
				id : id
			},
			dataType : "json",
			async : false,
			error : function(error) {
				alert("不能删除此菜谱:" + error.responseText);
			},
			success : function(noDishExist) {
				if (noDishExist) {
					alert("删除菜谱成功");
					loadData();
					renderDishMenus();
					closeCurFormDialog();
				} else
					alert("不能删除此菜谱:此菜谱包含菜品，请先删除该菜谱下的菜品再试");
			}
		});
}

function deleteDesk() {
	var id = this.form.deskId.value;
	if (confirm("确定删除此餐台?"))
		$.ajax({
			type : "POST",
			url : "../admin/deleteDesk",
			data : {
				id : id
			},
			dataType : "json",
			async : false,
			error : function(error) {
				alert("不能删除此餐台:" + error.responseText);
			},
			success : function(noOrderExist) {
				if (noOrderExist) {
					alert("删除餐台成功");
					loadData();
					renderDesks();
					closeCurFormDialog();
				} else
					alert("不能删除此餐台:请先删除该餐台所有订单再试");
			}
		});
}

function showFormDialog(dialogTemplateStr, confirmCallBack, deleteCallback,
		copyDishCallback) {

	var dialogDiv = $(dialogTemplateStr);
	dialogDiv.find("form #operationPanel").remove();
	dialogDiv.find(".cancelFormDialogBtn").remove();

	dialogDiv.prepend($("<div>").addClass("cancelFormDialogBtn").text("×")
			.click(closeCurFormDialog));
	var operationPanelDiv = $("<div>").addClass("operationPanel").attr("id",
			"operationPanel");

	$("<input>").attr("type", "button").addClass("menuButton").val("确定")
			.appendTo(operationPanelDiv).click(confirmCallBack);
	if (typeof copyDishCallback != "undefined")
		$("<input>").attr("type", "button").addClass("menuButton").val("复制")
				.appendTo(operationPanelDiv).click(copyDishCallback);
	$("<input>").attr("type", "button").addClass("menuButton").val("取消")
			.appendTo(operationPanelDiv).click(closeCurFormDialog);
	if (typeof deleteCallback != "undefined")
		$("<input>").attr("type", "button").attr("style",
				"background-color:red;margin-left:50px").addClass("menuButton")
				.val("删除").appendTo(operationPanelDiv).click(deleteCallback);

	operationPanelDiv.appendTo(dialogDiv.find("form"));
	$curFormDialog = $(dialogDiv).modal();
}

function renderDishMenus() {
	var dishMenuHtml = new StringBuilder();
	dishMenuHtml.append("<div class='addMenuBtn button dishMenuItem'>+</div>");
	for ( var i in $menus) {
		var menu = $menus[i];
		dishMenuHtml
				.append([ "<div class=\"button dishMenuItem\" dishMenuIndex='",
						i, "'>" ]);
		dishMenuHtml.append(menu.name);
		dishMenuHtml.append("</div>");
	}
	$("#dishMenuList").html(dishMenuHtml.toString());
}

function renderMaterials() {
	var materialHtml = new StringBuilder();
	materialHtml.append("<div class='addMaterialBtn item'>+</div>");
	for ( var i in $dishManagementData.materials) {
		var material = $dishManagementData.materials[i];
		materialHtml.append([ "<div class=\"item\" materialIndex='", i, "'>" ]);
		materialHtml.append(material.name);
		materialHtml.append("</div>");
	}

	$("#materialList").html(materialHtml.toString());
};

function submitMaterial() {
	var id = this.form.materialId.value;
	var name = this.form.materialName.value;
	var sort = this.form.materialSort.value;

	$.ajax({
		type : 'POST',
		url : "../admin/addOrUpdateMaterial",
		data : {
			id : id,
			storeId : $storeId,
			sort : sort,
			name : name
		},
		dataType : "json",
		async : false,
		error : function(error) {
			alert("提交失败:" + error.responseText);
		},
		success : function(material) {
			if (material) {
				alert("提交成功!");
				loadData();
				renderMaterials();
				closeCurFormDialog();
			} else
				alert("更新失败!请刷新后再试!");
		}
	});
}

function deleteMaterial() {
	if (confirm("确定删除?"))
		$.ajax({
			type : "POST",
			url : "../admin/deleteMaterial",
			data : {
				id : this.form.materialId.value
			},
			dataType : "json",
			async : false,
			error : function(error) {
				alert("不能删除:" + error.responseText);
			},
			success : function(flag) {
				closeCurFormDialog();
				if (flag) {
					alert("删除成功");
					loadData();
					renderMaterials();
				} else
					alert("不能删除!");
			}
		});
}

function submitBOMLine(callBack) {
	var form = document.getElementById("bomLineForm");
	var id = form.bomLineId.value;
	var dishName = form.bomLineDish.value;
	var dishId = form.bomLineDish.objectId;
	if (dishId == null) {
		dishId = form.bomLineDishId.value;
	}
	var materialName = form.bomLineMaterial.value;
	var materialId = form.bomLineMaterial.objectId;
	if (materialId == null) {
		materialId = form.bomLineMaterialId.value;
	}
	var weight = form.bomLineWeight.value;
	var sort = form.bomLineSort.value;

	if (dishId == "" || dishId == null || materialId == null
			|| materialId == "") {
		alert("无法添加未添加原料的原料或菜品!请输入菜品或原料后再提示框中选择!");
		return;
	}

	var checkDishName = $dishByIdMap[dishId].name;
	var checkMaterialName = "";
	for ( var i in $dishManagementData.materials) {
		var material = $dishManagementData.materials[i];
		if (material.id == materialId) {
			checkMaterialName = material.name;
			break;
		}
	}

	if (checkDishName != dishName || checkMaterialName != materialName) {
		alert("无法添加未添加原料的原料或菜品!请输入菜品或原料后再提示框中选择!");
		return;
	}

	if (isNaN(weight) || weight == "") {
		alert("请输入正确的重量!");
		return;
	}

	$.ajax({
		type : 'POST',
		url : "../admin/submitBOMLine",
		data : {
			id : id,
			storeId : $storeId,
			dishName : dishName,
			dishId : dishId,
			materialName : materialName,
			materialId : materialId,
			weight : weight,
			sort : sort
		},
		dataType : "json",
		async : false,
		error : function(error) {
			alert("提交失败:" + error.responseText);
		},
		success : function(bomLine) {
			if (bomLine) {
				alert("提交成功!");
				loadData();
				renderDishBOMLines();
			} else
				alert("更新失败!请刷新后再试!");

			if (callBack) {
				callBack();
			}
		}
	});
}

function deleteBOMLine() {
	if (confirm("确定删除?")) {
		var bomLineId = $(this).data("bomLine").id;
		$.ajax({
			type : "POST",
			url : "../admin/deleteBOMLine",
			data : {
				id : bomLineId
			},
			dataType : "json",
			async : false,
			error : function(error) {
				alert("不能删除:" + error.responseText);
			},
			success : function(flag) {
				if (flag) {
					alert("删除成功");
					loadData();
					renderDishBOMLines();
				} else
					alert("不能删除!");
			}
		});
	}
}

function renderDishBOMLines() {
	var bomLineTab = $("[name='bom_line_tab']");
	bomLineTab.empty();
	var bomLines = $bomLinesByDishIdMap[$curDish.id];

	for ( var i in bomLines) {
		var bomLine = bomLines[i];
		var bomLineDiv = $("<div>").css("text-align", "center");
		$("<label>").text(" 原料:").appendTo(bomLineDiv);
		$("<input>").addClass("ui_radius ui-shadow ui-border-solid input")
				.attr("readonly", "readonly").val(bomLine.materialName).attr(
						"type", "text").appendTo(bomLineDiv);
		$("<label>").text(" 消耗重量(g):").appendTo(bomLineDiv);
		$("<input>").addClass("ui_radius ui-shadow ui-border-solid input")
				.attr("readonly", "readonly").val(bomLine.weight).attr("type",
						"text").appendTo(bomLineDiv);
		$("<label>").text(" 排序:").appendTo(bomLineDiv);
		$("<input>").addClass("ui_radius ui-shadow ui-border-solid input")
				.attr("readonly", "readonly").val(bomLine.sort).attr("type",
						"text").appendTo(bomLineDiv);
		$("<input>").addClass(
				"operatetr ui_radius ui-shadow ui-border-solid input").css(
				"margin-left", "2em").val("编辑").data("bomLine", bomLine).attr(
				"type", "button").click(showEditBOMLineDialog).appendTo(
				bomLineDiv);
		$("<input>").addClass(
				"operatetr ui_radius ui-shadow ui-border-solid input").css(
				"margin-left", "1em").val("删除").data("bomLine", bomLine).attr(
				"type", "text").click(deleteBOMLine).appendTo(bomLineDiv);
		bomLineDiv.appendTo(bomLineTab);
	}
}

function renderCurMenuDishCategories() {
	var dishCategories = $curMenu.dishCategories;
	var dishCategoriesHtml = new StringBuilder();
	dishCategoriesHtml
			.append("<div class=\"button dishCategoryItem dish-category-background addDishCategoryBtn\" >+</div>");

	for ( var i in dishCategories) {
		var dishCategory = dishCategories[i];
		dishCategoriesHtml
				.append([
						"<div class=\"button dishCategoryItem dish-category-background\" dishCategoryId='",
						dishCategory.id, "'" ]);
		dishCategoriesHtml.append([ "id='dishCategoryId_", dishCategory.id,
				"'>" ]);
		dishCategoriesHtml.append(dishCategory.name);
		dishCategoriesHtml.append("</div>");
	}

	$("#dishCategoryList").html(dishCategoriesHtml.toString());
}

function renderDishes(dishCategoryId) {
	var dishes = $dishCategoriesMap[dishCategoryId].dishes;
	var dishesHtml = new StringBuilder();
	dishesHtml
			.append([ "<div class=\"button dishItem dish-item-background addDishMenuButton\" id='addDishMenuButton'>+</div>" ]);
	for ( var i in dishes) {
		var dish = dishes[i];
		dishesHtml
				.append([
						"<div class=\"button dishItem dish-item-background\" dishIndex='",
						i, "' dishCategoryId='", dishCategoryId, "'>" ]);
		dishesHtml.append(dish.name);
		dishesHtml.append("</div>");
	}

	$("#dishList").html(dishesHtml.toString());
	$("#dishTagList").html("");

	$("#dishCategoryList .dishCategoryItem").removeClass(
			"selected-dish-category-background");
	$("#dishCategoryId_" + dishCategoryId).addClass(
			"selected-dish-category-background");
}

function addEditDishEvent() {

	$("#selectAll").click(
			function() {
				var checkboxList = document.getElementById(
						"dishCheckboxOptions").getElementsByTagName("input");
				if ($(this).is(":checked")) {
					for ( var i in checkboxList) {
						checkboxList[i].checked = true;
					}
				} else {
					for ( var i in checkboxList) {
						checkboxList[i].checked = false;
					}
				}
			});
}

function deleteDish() {
	var dishId = this.form.id.value;
	if (confirm("确定删除此菜品"))
		$.ajax({
			type : "POST",
			url : "../admin/deleteDish",
			data : {
				dishId : dishId
			},
			dataType : "json",
			async : false,
			error : function(error) {
				alert("不能删除此菜品,请先删除完该菜品的做法,再删除此菜!");
			},
			success : function(noOrderingRecord) {
				if (noOrderingRecord) {
					alert("删除菜品成功");
					$("#uploadifyDiv").hide();
					loadData();
					renderDishes($curDishCategoryId);
					closeCurFormDialog();
				} else
					alert("不能删除此菜品或存在此菜品的点餐纪录");
			}
		});
}

function addDish() {

	showFormDialog("#addOrUpdateDishDialogTemplate", submitDish, deleteDish,
			copyDish);

	$("#addOrUpdateDishDialog .addId").each(function() {
		$(this).attr("id", $(this).attr("attributeId"));
	});

	addEditDishEvent();
	var form = document.getElementById("addDish");
	// for ( var dishCategoryId in $dishCategoriesMap) {
	// form.dishCategoryId.value = dishCategoryId;
	// break;
	// }
	form.id.value = 0;
	form.showDishPicPath.value = "";
	form.secondPicPath.src = "";
	form.name.value = "";
	form.alias.value = "";
	form.indexCode.value = "";
	form.price.value = 0;
	form.unit.value = "";
	form.amountPerCustomer.value = 0;
	form.VIPFee.value = 0;
	form.dishSort.value = 0;
	form.description.value = "";

	form.noCookingNote.checked = false;
	form.noCustomerNote.checked = false;
	form.noDiscount.checked = false;
	form.frequent.checked = false;
	form.autoOrder.checked = false;
	form.editable.checked = false;
	form.newDish.checked = false;
	form.recommended.checked = false;
	form.soldOut.checked = false;
	form.enabled.checked = true;
	form.needWeigh.checked = false;
	form.hasMealDealItems.checked = false;
	form.dishCategoryId.value = $curDishCategoryId;
	form.departmentId.value = $departments != null && $departments.length > 0 ? $departments[0].id
			: "";

	$("#uploadifyDiv").show();
}
function editMealDealItemInit() {
	editMealDealItem("add");
}

// 套餐编辑
function editMealDealItem(type) {
	// document.getElementById("mealDealItemDetail").style.display="none";

	showFormDialog("#addOrUpdateMealDealItemDialogTemplate",
			submitMealDealItem, deleteDish);

	$("#addOrUpdateMealDealItemDialog .addId").each(function() {
		$(this).attr("id", $(this).attr("attributeId"));
	});

	if (type == "edit") {
		$("#addOrUpdateMealDealItemDialog #mealDealItemDetail").addClass(
				"mealDealItemDetailShow");
		$("#addOrUpdateMealDealItemDialog #mealDealItemDetail").removeClass(
				"mealDealItemDetailHide");
	} else {
		$("#addOrUpdateMealDealItemDialog #mealDealItemDetail").addClass(
				"mealDealItemDetailHide");
		$("#addOrUpdateMealDealItemDialog #mealDealItemDetail").removeClass(
				"mealDealItemDetailShow");
		addMealDealItemTr("");

	}

	$("#uploadifyDiv").show();
}

function addMealDealItemOnclick() {
	addMealDealItemTr("");
}

function addBOMLineOnclick() {
	showEditBOMLineDialog();
}

function showEditBOMLineDialog() {

	var bomLine = $(this).data("bomLine");

	if (bomLine) {
		$("#bomLineId").val(bomLine.id);
		$("#bomLineDish").val(bomLine.dishName);
		$("#bomLineDishId").val(bomLine.dishId);
		$("#bomLineMaterial").val(bomLine.materialName);
		$("#bomLineMaterialId").val(bomLine.materialId);
		$("#bomLineWeight").val(bomLine.weight);
		$("#bomLineSort").val(bomLine.sort);
	} else {
		$("#bomLineId").val(0);
		$("#bomLineDish").val($curDish.name);
		$("#bomLineDishId").val($curDish.id);
	}

	document.getElementById("bomLineDish").inputValue = "";
	document.getElementById("bomLineMaterial").inputValue = "";

	var dialogDiv = $("#addOrUpdateBOMLineDialogTemplate");
	dialogDiv.find("form #operationPanel").remove();

	var operationPanelDiv = $("<div>").addClass("operationPanel").attr("id",
			"operationPanel");
	$("<input>").attr("type", "button").addClass("menuButton").val("确定")
			.appendTo(operationPanelDiv).click(function() {
				submitBOMLine(function() {
					dialog.closeNotRemoved();
				});
			});
	$("<input>").attr("type", "button").addClass("menuButton").val("取消")
			.appendTo(operationPanelDiv).click(function() {
				dialog.closeNotRemoved();
			});
	operationPanelDiv.appendTo(dialogDiv.find("form"));
	var dialog = $(dialogDiv).modal({
		level : 5
	});
}

function selectedDishName(obj) {
	var selectedText = $(obj).find("option:selected").text();
	var selectedValue = $(obj).find("option:selected").val();
	$(obj).closest('td').find('input:text').val(selectedText);
	$(obj).closest('td').find('#dishId').val(selectedValue);
	var attr_name = $(obj).closest('td').find('input:text').attr("name");
	if (attr_name == "mealdealname") {
		$selectedDish = selectedValue + "," + selectedText;
	}
}
function inputDishName(obj, type) {

	if (type == 'click' || type == 'change'
			|| (type != 'change' && type != 'click')) {
		emptySelect();
		var trindex = $(obj).closest('td').parent().index();
		var tdindex = $(obj).closest('td').index();
		$trTdIndexForSelected = trindex + "," + tdindex;

		if ($selectedDish) {
			var attr_name = $(obj).closest('td').find('input:text')
					.attr("name");
			if (attr_name == "mealdealname") {
				$(obj).closest('td').find('input:text').val(
						$selectedDish.split(',')[1]);
				$(obj).closest('td').find('#dishId').val(
						$selectedDish.split(',')[0]);
			}
		}
	}
	var attr_name = $(obj).attr("name");
	var inputtext = $(obj).val();
	var parten = /^\s*$/;

	var selectDishObj = $(obj).closest('td').find("select");
	selectDishObj.show();
	if (selectDishObj) {
		selectDishObj.empty();
	}

	$("<option>").attr("value", "").text("请选择").appendTo(selectDishObj);

	var len = $dishNames.length;
	var dish = null;
	for (var i = 0; i < len; i++) {
		var dishName = $dishNames[i];
		var dishId = $dishIdByNameMap[dishName];
		dish = $dishByIdMap[dishId];
		if (!parten.test(inputtext) && type != 'click' && type == 'change') {
			if (dishName.indexOf(inputtext) >= 0) {
				if (attr_name == "dishname") {
					if (!dish.hasMealDealItems) {
						$("<option>").attr("value", dishId).text(dishName)
								.appendTo(selectDishObj);
					}
				}
				if (attr_name == "mealdealname") {
					if (dish.hasMealDealItems) {
						$("<option>").attr("value", dishId).text(dishName)
								.appendTo(selectDishObj);
					}
				}
			}
		} else {
			if (attr_name == "dishname") {
				if (!dish.hasMealDealItems) {
					$("<option>").attr("value", dishId).text(dishName)
							.appendTo(selectDishObj);
				}
			}
			if (attr_name == "mealdealname") {
				if (dish.hasMealDealItems) {
					$("<option>").attr("value", dishId).text(dishName)
							.appendTo(selectDishObj);
				}
			}
			// $("<option>").attr("value",dishId).text(dishName).appendTo(selectDishObj);
		}
	}
}
function addMealDealItemTr(mealDealItemObj) {

	var tab_obj = $("#meal_deal_tab");
	var textlist = [ "菜名:", "套餐:", "组:", "排序:", "选择:" ];
	var name_css_list = [ "dishname", "mealdealname", "groupname", "sort",
			"dishcheckbox" ];
	var classlist = "ui_radius ui-shadow ui-border-solid ui-input";
	var select_css = "selectDishName";
	var typelist = "text";
	var len = textlist.length;

	if (textlist.length != name_css_list.length) {
		alert("输入的数目不对！");
		return;
	}
	var trobj;
	if (mealDealItemObj.mealDealItemList) {// 修改
		var mealDealItemList = mealDealItemObj.mealDealItemList;
		var mealDealItemLen = mealDealItemList.length;

		for (var j = 0; j < mealDealItemLen; j++) {
			trobj = $('<tr>').appendTo(tab_obj);
			for (var i = 0; i < len; i++) {
				var tdobj = $('<td>').text(textlist[i]).appendTo(trobj);
				switch (textlist[i]) {
				case "菜名:":
					var inputobj = $("<input>").attr("name", name_css_list[i])
							.attr("type", typelist).attr("onclick",
									"inputDishName(this,\"click\")")
							.attr("onkeyup", "inputDishName(this,\"change\")")
							.addClass(name_css_list[i]).addClass(classlist)
							.appendTo(tdobj).attr("value",
									mealDealItemList[j].sourceDish.name);
					$("<input>").attr("type", "hidden").attr("id", "dishId")
							.attr("value", mealDealItemList[j].sourceDish.id)
							.addClass(select_css).appendTo(tdobj);

					$("<input>").attr("type", "hidden").attr("id", "mdiId")
							.attr("value", mealDealItemList[j].id).addClass(
									select_css).appendTo(tdobj);
					$("<select>").attr("onchange", "selectedDishName(this)")
							.addClass(select_css).appendTo(tdobj);

					break;
				case "套餐:":
					var inputobj = $("<input>").attr("name", name_css_list[i])
							.attr("type", typelist).attr("onclick",
									"inputDishName(this,\"click\")")
							.attr("onkeyup", "inputDishName(this,\"change\")")
							.addClass(name_css_list[i]).addClass(classlist)
							.appendTo(tdobj).attr("value",
									mealDealItemList[j].dishName);
					$("<input>").attr("type", "hidden").attr("id", "dishId")
							.addClass(select_css).appendTo(tdobj).attr("value",
									mealDealItemList[j].targetDishId);
					$("<select>").attr("onchange", "selectedDishName(this)")
							.addClass(select_css).appendTo(tdobj);
					break;
				case "组:":
					$('<input>').attr('name', name_css_list[i]).attr('type',
							typelist).addClass(name_css_list[i]).attr(
							'onfocus', 'emptySelect()').attr('onclick',
							'emptySelect()').addClass(classlist).attr('value',
							mealDealItemList[j].groupName).appendTo(tdobj);
					break;
				case "排序:":
					$('<input>').attr('name', name_css_list[i]).attr('type',
							typelist).addClass(name_css_list[i]).attr(
							'onfocus', 'emptySelect()').attr('onclick',
							'emptySelect()').addClass(classlist).attr('value',
							mealDealItemList[j].sort).appendTo(tdobj);
					break;
				case "选择:":
					$('<input>').attr('name', name_css_list[i]).attr('type',
							'checkbox').appendTo(tdobj);
					break;
				}
			}
		}
	} else { // 添加
		trobj = $('<tr>').appendTo(tab_obj);
		for (i = 0; i < len; i++) {
			var tdobj = $('<td>').text(textlist[i]).appendTo(trobj);
			if (i < 2) {
				var selectedDishId = "";
				var selectedDishText = "";
				if ($selectedDish && i == 1) {
					selectedDishId = $selectedDish.split(',')[0];
					selectedDishText = $selectedDish.split(',')[1];
				}
				var inputobj = $("<input>").attr("name", name_css_list[i])
						.attr("type", typelist).attr("onclick",
								"inputDishName(this,\"click\")").attr(
								"onkeyup", "inputDishName(this,\"change\")")
						.addClass(name_css_list[i]).attr("value",
								selectedDishText).addClass(classlist).appendTo(
								tdobj);
				$("<input>").attr("type", "hidden").attr("id", "dishId").attr(
						"value", selectedDishId).addClass(select_css).appendTo(
						tdobj);
				$("<input>").attr("type", "hidden").attr("id", "mdiId").attr(
						"value", "").addClass(select_css).appendTo(tdobj);
				$("<select>").attr("onchange", "selectedDishName(this)")
						.addClass(select_css).appendTo(tdobj);
			} else if (i == len - 1) {
				$('<input>').attr('name', name_css_list[i]).attr('type',
						'checkbox').appendTo(tdobj);
			} else {
				$('<input>').attr('name', name_css_list[i]).attr('type',
						typelist).addClass(name_css_list[i]).attr('onfocus',
						'emptySelect()').attr('onclick', 'emptySelect()')
						.addClass(classlist).appendTo(tdobj);
			}
		}
	}
}

function emptySelect() {
	if ($trTdIndexForSelected) {
		var trtd = $trTdIndexForSelected.split(',');
		var trindex = trtd[0];
		var tdindex = trtd[1];
		var selectedClear = $("#meal_deal_tab").find("tr:eq(" + trindex + ")")
				.find("td:eq(" + tdindex + ")").find("select");
		if (selectedClear) {
			selectedClear.empty();
			selectedClear.hide();
		}
		// document.getElementById("mealDealItemDetail").style.display = "none";
	}
}
function deleteMealDealItemRow() {
	if (confirm("！！确定删除所选？")) {
		var mdiIdList = "";
		var trobj = $("#meal_deal_tab tr");
		var len = trobj.length;
		if (len > 0) {
			// trobj[len-1].remove();
			var dishCheckboxList = trobj.find("td").find("input:checkbox");
			for (var i = 0; i < len; i++) {
				if (dishCheckboxList[i].checked) {

					var selectedDish = $(trobj).eq(i).find("td:eq(0)").find(
							"#mdiId").val().trim();
					if (selectedDish.length > 0) {
						mdiIdList += ",";
						mdiIdList += selectedDish;
						mdiIdList += ",";
					}
					trobj[i].remove();
				}
			}
		}
		// 异步删除
		if (mdiIdList.length > 0) {
			$.ajax({
				type : "POST",
				url : "../admin/deleteMealDealItemsById",
				data : {
					mdiIds : JSON.stringify(mdiIdList)
				},
				dataType : "json",
				async : true,
				error : function() {
				},
				success : function() {
				}
			});
		}
	}
}

function submitMealDealItem() {

	if (!$storeId) {
		return;
	}
	var form = this.form;

	var tabobj = $("#meal_deal_tab");
	var len = tabobj.find("tr").length;
	arr = [];
	var tr;
	var mdiId;
	var sourceDishId;
	var sourceDish;
	var targetDishId;
	var targetDishName;
	var groupName;
	var sort;
	for (var i = 0; i < len; i++) {
		tr = tabobj.find("tr:eq(" + i + ")");
		if (tr) {
			sourceDishId = tr.find("td:eq(0)").find("#dishId").val();
			if (!sourceDishId) {
				alert("请选择菜名");
				return;
			}
			sourceDish = $dishByIdMap[sourceDishId];
			targetDishId = tr.find("td:eq(1)").find("#dishId").val();
			if (!targetDishId) {
				alert("请选择套餐");
				return;
			}
			targetDishName = tr.find("td:eq(1)").find('input:text').val();
			if (!targetDishName) {
				alert("请选择套餐");
				return;
			}
			groupName = tr.find("td:eq(2)").find("input").val();
			if (!groupName) {
				alert("请输入组");
				return;
			}
			sort = tr.find("td:eq(3)").find("input").val();
			if (!sort) {
				sort = "1";
			}
			var newMealDealItem = {};

			newMealDealItem.id = tr.find("td:eq(0)").find("#mdiId").val();
			newMealDealItem.storeId = $storeId;
			newMealDealItem.targetDishId = targetDishId;
			newMealDealItem.sourceDish = sourceDish;
			newMealDealItem.groupName = groupName;
			newMealDealItem.priceDelta = 0;
			newMealDealItem.sort = sort;
			newMealDealItem.dishName = targetDishName;

			arr.push(newMealDealItem);
		}
	}

	var newDish = {};
	// /*修改保存
	if (form.dishIdHide.value) {
		var dishCategoryId = form.dishCategoryId.value;
		$curDishCategoryId = dishCategoryId;

		newDish.id = form.dishIdHide.value;
		newDish.picPath = form.showDishPicPath.value;
		newDish.secondPicPath = form.secondPicPath.src;
		var dishName = form.name.value;
		newDish.name = dishName;
		newDish.alias = form.alias.value;
		newDish.indexCode = form.indexCode.value;
		newDish.price = form.price.value;
		newDish.unit = form.unit.value;
		newDish.amountPerCustomer = form.amountPerCustomer.value;
		newDish.vipfee = form.VIPFee.value;

		var dishCategory = $dishCategoriesMap[dishCategoryId];
		newDish.sort = dishCategory.sort * 1000 + dishCategory.dishes.length;
		if (form.dishSort.value) {
			newDish.sort = form.dishSort.value;
		}
		// newDish.sort = form.sort.value;
		// newDish.dishCategory = {};
		// newDish.dishCategory.id = 1;
		// = 1;//form.dishCategoryId.value;
		newDish.departmentId = form.departmentId.value;
		newDish.description = form.description.value;

		newDish.noCookingNote = form.noCookingNote.checked;
		newDish.noCustomerNote = form.noCustomerNote.checked;
		newDish.noDiscount = form.noDiscount.checked;
		newDish.frequent = form.frequent.checked;
		newDish.autoOrder = form.autoOrder.checked;
		newDish.editable = form.editable.checked;
		newDish.newDish = form.newDish.checked;
		newDish.recommended = form.recommended.checked;
		newDish.soldOut = form.soldOut.checked;
		newDish.enabled = form.enabled.checked;
		newDish.needWeigh = form.needWeigh.checked;
		newDish.hasMealDealItems = form.hasMealDealItems.checked;

		if (form.name.value == "") {
			window.alert($.i18n.prop('string_caiMingBuNengWeiKong'));
			form.name.focus();
			return;
		}

		$.ajax({
			type : 'POST',
			url : "../admin/saveDishAndMealItemList",
			data : {
				dishCategoryId : dishCategoryId,
				dishJsonText : JSON.stringify(newDish),
				mealDealItems : JSON.stringify(arr)
			},
			dataType : "json",
			async : true,
			error : function() {
			},
			success : function(dish) {
				if (dish.id) {
					window.alert("保存成功！");
				}
				loadData();
				renderDishes($curDishCategoryId);
				$("#dishCategoryOptionsMDITemplate").val($curDishCategoryId);
				$("#departmentOptionsMDITemplate").val(dish.departmentId);
			}
		});
	} else {
		if (arr) {
			$.ajax({
				type : "POST",
				url : "../admin/addOrUpdateMealDealItem",
				data : {
					mealDealItemJsonList : JSON.stringify(arr)
				},
				dataType : "json",
				async : true,
				error : function() {
				},
				success : function(MealDealItemManagenent) {
					if (MealDealItemManagenent.mealDealItemList) {

						if (!form.dishIdHide.value) {
							loadData();
							loadMealDealItem(form.dishIdHide.value);
							$selectedDish = "";
							var clearTab = $("#meal_deal_tab");
							var clearTr;
							var clearLen = clearTab.find("tr").length;
							for (var i = 0; i < clearLen; i++) {
								clearTr = tabobj.find("tr:eq(" + i + ")");
								clearTr.find("td").find("input").val("");
							}
							window.alert("保存成功！");
						}
					}
				}
			});
		}
	}
}

function loadMealDealItem(targetDishId) {
	if (targetDishId) {
		// $("#mealDealItemDetail").show();
		var mealDealItemManagenent = $.ajax({
			url : "../admin/getMealDealItemsByTargetDishId?targetDishId="
					+ targetDishId,
			async : false
		}).responseJSON;
		var targgetDish = $dishByIdMap[targetDishId];
		$selectedDish = targetDishId + "," + targgetDish.name;
		$("#meal_deal_tab").empty();
		addMealDealItemTr(mealDealItemManagenent);
	}
}

// 套餐end
function editDish(dishCategoryId, dish) {
	$("#meal_deal_tab").empty();
	$("#bom_line_tab").empty();
	if (dish.hasMealDealItems) {
		editMealDealItem("edit");
		loadMealDealItem(dish.id);

		var form = document.getElementById("addMealDealItem");

		$("#mealDealItemDetail").show();
		form.dishIdHide.value = dish.id;

		addEditDishEvent();

	} else {
		showFormDialog("#addOrUpdateDishDialogTemplate", submitDish,
				deleteDish, copyDish);

		$("#addOrUpdateDishDialog .addId").each(function() {
			$(this).attr("id", $(this).attr("attributeId"));
		});
		addEditDishEvent();
		form = document.getElementById("addDish");
	}// dish.hasMealDealItems else结束

	// addMealDealItem
	form.id.value = dish.id;
	form.showDishPicPath.value = dish.picPath;
	form.secondPicPath.src = dish.secondPicPath;
	form.name.value = dish.name;
	form.alias.value = dish.alias;
	form.indexCode.value = dish.indexCode;
	form.price.value = dish.price;
	form.unit.value = dish.unit;
	form.amountPerCustomer.value = dish.amountPerCustomer;
	form.VIPFee.value = dish.vipfee;
	form.dishSort.value = dish.sort;
	form.dishCategoryId.value = dishCategoryId;
	form.departmentId.value = dish.departmentId;
	form.description.value = dish.description;

	form.noCookingNote.checked = dish.noCookingNote;
	form.noCustomerNote.checked = dish.noCustomerNote;
	form.noDiscount.checked = dish.noDiscount;
	form.frequent.checked = dish.frequent;
	form.autoOrder.checked = dish.autoOrder;
	form.editable.checked = dish.editable;
	form.newDish.checked = dish.newDish;
	form.recommended.checked = dish.recommended;
	form.soldOut.checked = dish.soldOut;
	form.enabled.checked = dish.enabled;
	form.needWeigh.checked = dish.needWeigh;
	form.hasMealDealItems.checked = dish.hasMealDealItems;

	$("#uploadifyDiv").show();
	renderDishBOMLines();
}

function submitDish() {
	var form = this.form;
	var dishCategoryId = form.dishCategoryId.value;
	$curDishCategoryId = dishCategoryId;

	var newDish = {};
	newDish.id = form.id.value;
	newDish.picPath = form.showDishPicPath.value;
	newDish.secondPicPath = form.secondPicPath.src;
	newDish.name = form.name.value;
	newDish.alias = form.alias.value;
	newDish.indexCode = form.indexCode.value;
	newDish.price = form.price.value;
	newDish.unit = form.unit.value;
	newDish.amountPerCustomer = form.amountPerCustomer.value;
	newDish.vipfee = form.VIPFee.value;

	var dishCategory = $dishCategoriesMap[dishCategoryId];
	newDish.sort = dishCategory.sort * 1000 + dishCategory.dishes.length;
	if (form.dishSort.value) {
		newDish.sort = form.dishSort.value;
	}
	// newDish.sort = form.sort.value;
	// newDish.dishCategory = {};
	// newDish.dishCategory.id = 1;
	// = 1;//form.dishCategoryId.value;
	newDish.departmentId = form.departmentId.value;
	newDish.description = form.description.value;

	newDish.noCookingNote = form.noCookingNote.checked;
	newDish.noCustomerNote = form.noCustomerNote.checked;
	newDish.noDiscount = form.noDiscount.checked;
	newDish.frequent = form.frequent.checked;
	newDish.autoOrder = form.autoOrder.checked;
	newDish.editable = form.editable.checked;
	newDish.newDish = form.newDish.checked;
	newDish.recommended = form.recommended.checked;
	newDish.soldOut = form.soldOut.checked;
	newDish.enabled = form.enabled.checked;
	newDish.needWeigh = form.needWeigh.checked;
	newDish.hasMealDealItems = form.hasMealDealItems.checked;

	if (form.name.value == "") {
		window.alert($.i18n.prop('string_caiMingBuNengWeiKong'));
		form.name.focus();
		return;
	}

	var operatePromptMsg = "";
	if (newDish.id != "" && newDish.id != 0) {
		operatePromptMsg = $.i18n.prop('string_caiPinGengXinChengGong');
	} else {
		operatePromptMsg = $.i18n
				.prop('string_caiPinTianJiaChengGongChongXinBianJiKeJiXuTianJia');
	}

	$.ajax({
		type : 'POST',
		url : "../admin/addOrUpdateDish",
		// contentType : 'application/json',
		data : {
			dishCategoryId : dishCategoryId,
			dishJsonText : JSON.stringify(newDish)
		},
		dataType : "json",
		async : true,
		error : function() {
		},
		success : function(dish) {
			if (dish.id != undefined) {
				window.alert(operatePromptMsg);
			}
			loadData();
			renderDishes($curDishCategoryId);
			$("#dishCategoryOptionsTemplate").val($curDishCategoryId);
			$("#departmentOptionsTemplate").val(dish.departmentId);
		}
	});
}

function copyDish() {
	var form = this.form;
	var dishCategoryId = form.dishCategoryId.value;
	var dishId = form.id.value;

	$.ajax({
		type : 'POST',
		url : "../admin/copyDish",
		// contentType : 'application/json',
		data : {
			dishCategoryId : dishCategoryId,
			dishId : dishId
		},
		dataType : "json",
		async : true,
		error : function(error) {
			alert("提交失败:" + error.responseText);
		},
		success : function(dish) {
			if (dish.id != undefined) {
				alert("复制成功!");
				$("#uploadifyDiv").hide();
				closeCurFormDialog();
			}
			loadData();
			renderDishes($curDishCategoryId);
		}
	});

}

function submitMenu() {
	var id = this.form.menuId.value;
	var name = this.form.menuName.value;
	var sort = this.form.menuSort.value;
	if ($curMenu != null)
		id = $curMenu.id;

	$.ajax({
		type : 'POST',
		url : "../admin/addOrUpdateMenu",
		data : {
			id : id,
			storeId : $storeId,
			name : name,
			sort : sort
		},
		dataType : "json",
		async : false,
		error : function(error) {
			alert("提交失败:" + error.responseText);
		},
		success : function(menu) {
			alert("提交成功!");
			loadData();
			renderDishMenus();
			closeCurFormDialog();
		}
	});
}

function submitDesk() {
	var id = this.form.deskId.value;
	var name = this.form.deskName.value;
	var sort = this.form.deskSort.value;
	var groupName = this.form.deskGroupName.value;
	var posPrinterId = this.form.deskCustomerNotePrinterId.value;
	var chargeVIPFee = this.form.deskChargeVIPFee.checked;
	var serviceFeeRate = this.form.deskServiceFeeRate.value;
	var enabled = this.form.deskEnabled.checked;
	var number = this.form.deskNumber.value;
	var forTesting = this.form.deskForTesting.checked;

	$.ajax({
		type : 'POST',
		url : "../admin/addOrUpdateDesk",
		data : {
			id : id,
			storeId : $storeId,
			name : name,
			groupName : groupName,
			chargeVIPFee : chargeVIPFee,
			serviceFeeRate : serviceFeeRate,
			enabled : enabled,
			number : number,
			forTesting : forTesting,
			sort : sort,
			posPrinterId : posPrinterId
		},
		dataType : "json",
		async : false,
		error : function(error) {
			alert("提交失败:" + error.responseText);
		},
		success : function(desk) {
			alert("提交成功!");
			loadData();
			renderDesks();
			closeCurFormDialog();
		}
	});
}

function editDishToSoldOut() {
	clearScreen();
	$(".menuButton").removeClass("selected-menu");
	$(this).addClass("selected-menu");

	var dishListContainer = $("#dishList").empty();
	var dishListContainerWidth = dishListContainer.width();
	var dishCategoryNameWidth = dishListContainerWidth * 0.2;
	var listCellRightWidth = dishListContainerWidth * 0.7;
	var operatePanelWidth = dishListContainerWidth * 0.1;
	var dishNameWidth = listCellRightWidth * 0.2;
	var soldOutWidth = listCellRightWidth * 0.1;
	var remainWidth = listCellRightWidth * 0.3;
	var limitPerDayWidth = listCellRightWidth * 0.3;

	var editDishToSoldOutDiv = $("<div>").addClass("editDishToSoldOut");
	dishListContainer.html(editDishToSoldOutDiv);

	var dishCategories = $curMenu.dishCategories;

	for ( var i in dishCategories) {
		var dishCategory = dishCategories[i];
		var dishes = dishCategory.dishes;
		var dishCategoryCaptionDiv = $("<div>").addClass("list_row").data(
				"categoryId", dishCategory.id).click(showDishCategoryItems)
				.appendTo(editDishToSoldOutDiv);
		$("<div>").text("分类 - " + dishCategory.name).addClass(
				"list_cell caption").css("width", dishCategoryNameWidth)
				.appendTo(dishCategoryCaptionDiv);
		var dishCategoryCaptionRightDiv = $("<div>").addClass(
				"list_cell caption dishCategoryCaptionRightDiv").appendTo(
				dishCategoryCaptionDiv);
		$("<div>").text($.i18n.prop('string_caoZuo')).addClass(
				"list_cell caption").appendTo(dishCategoryCaptionDiv);

		$("<div>").text($.i18n.prop('string_caiMing')).addClass(
				"captionDishName list_cell").css("width", dishNameWidth)
				.appendTo(dishCategoryCaptionRightDiv);
		var captionSoldOutDiv = $("<div>").addClass("captionSoldOut list_cell")
				.css("width", soldOutWidth).css("z-index", "999").appendTo(
						dishCategoryCaptionRightDiv);
		var selectedAllLabel = $("<label>")
				.text($.i18n.prop('string_quanXuan')).appendTo(
						captionSoldOutDiv);
		selectedAllLabel.prepend($("<input>").attr("name", "selectedAll").attr(
				"id", "dishCategoryId_" + dishCategory.id).attr("type",
				"checkBox"));

		var captionNoDiscountDiv = $("<div>").addClass(
				"captionSoldOut list_cell").css("width", soldOutWidth).css(
				"z-index", "999").appendTo(dishCategoryCaptionRightDiv);
		var selectedAllNoDiscountLabel = $("<label>").text(
				$.i18n.prop('string_quanXuan')).appendTo(captionNoDiscountDiv);
		selectedAllNoDiscountLabel.prepend($("<input>").attr("name",
				"selectedAll").attr("id",
				"dishCategoryId_noDiscount_" + dishCategory.id).attr("type",
				"checkBox"));

		$("<div>").text($.i18n.prop('string_shengYuFenShu')).addClass(
				"captionRemain list_cell").css("width", remainWidth).appendTo(
				dishCategoryCaptionRightDiv);
		$("<div>").text($.i18n.prop('string_meiTianFenShu')).addClass(
				"captionLimitPerDay list_cell").css("width", limitPerDayWidth)
				.appendTo(dishCategoryCaptionRightDiv);

		var dishCategoryItemDiv = $("<div>").addClass("list_row").css(
				"display", "none").attr("id", dishCategory.id).appendTo(
				editDishToSoldOutDiv);
		$("<div>").text(dishCategory.name).addClass(
				"dishCategoryName list_cell").appendTo(dishCategoryItemDiv);
		var dishCategoryItemRightDiv = $("<div>").addClass(
				"list_cell list_cell_right").appendTo(dishCategoryItemDiv);
		var operatePanelDiv = $("<div>").addClass("list_cell operatePanel")
				.css("width", operatePanelWidth).appendTo(dishCategoryItemDiv);
		var operateButton = $("<input>").attr("type", "button").attr("name",
				"updateSelectedDish").attr("dishCategoryId", dishCategory.id)
				.val($.i18n.prop('string_piLiangGengXin')).addClass("button")
				.appendTo(operatePanelDiv);

		if (dishes == null || dishes.length == 0) {
			var dishItemDiv = $("<div>").addClass("list_row").appendTo(
					dishCategoryItemRightDiv);
			$("<div>").html("&nbsp;").addClass("dishName list_cell").css(
					"width", dishNameWidth).appendTo(dishItemDiv);
			$("<div>").text("").addClass("soldOut list_cell").css("width",
					soldOutWidth).appendTo(dishItemDiv);
			$("<div>").text("").addClass("remain list_cell").css("width",
					remainWidth).appendTo(dishItemDiv);
			$("<div>").text("").addClass("limitPerDay list_cell").css("width",
					limitPerDayWidth).appendTo(dishItemDiv);
			operateButton.css("background-color", "#CCC").attr("disabled",
					"disabled");
		} else {
			$("<div>").attr("id",
					"dishCategoryDishesUpdateMsg_" + dishCategory.id).addClass(
					"messageDiv").appendTo(operatePanelDiv);
		}

		for ( var j in dishes) {
			var dish = dishes[j];
			var dishItemDiv = $("<div>").addClass("list_row").appendTo(
					dishCategoryItemRightDiv);
			$("<div>").text(dish.name).addClass(
					"dishName list_cell grayBorderBottom").css("width",
					dishNameWidth).appendTo(dishItemDiv);
			var selectedDishLabel = $("<label>").text(
					$.i18n.prop('string_guQing')).addClass(
					"soldOut list_cell grayBorderBottom").css("width",
					soldOutWidth).appendTo(dishItemDiv);
			selectedDishLabel.prepend($("<input>").attr("name",
					"dishCategoryId_" + dishCategory.id).attr("type",
					"checkBox").attr("id", dish.id).attr("checked",
					dish.soldOut));

			var selectedNoDiscountLabel = $("<label>").text("无折扣").addClass(
					"noDiscount list_cell grayBorderBottom").css("width",
					soldOutWidth).appendTo(dishItemDiv);
			selectedNoDiscountLabel.prepend($("<input>").attr("name",
					"dishCategoryId_noDiscount_" + dishCategory.id).attr(
					"type", "checkBox").attr("id", "noDiscount_" + dish.id)
					.attr("checked", dish.noDiscount));

			var remainDiv = $("<div>").addClass(
					"remain list_cell grayBorderBottom").css("width",
					remainWidth).appendTo(dishItemDiv);
			var remainInput = $("<input>").val(dish.remain).attr("id",
					"remain_" + dish.id).appendTo(remainDiv);
			if (remainInput.width() > remainWidth) {
				remainInput.css("width", remainWidth);
			}
			var limitPerDayDiv = $("<div>").addClass(
					"limitPerDay list_cell grayBorderBottom").css("width",
					limitPerDayWidth).appendTo(dishItemDiv);
			var limitPerDayInput = $("<input>").val(dish.limitPerDay).attr(
					"id", "limitPerDay_" + dish.id).appendTo(limitPerDayDiv);
			if (limitPerDayInput.width() > limitPerDayWidth) {
				limitPerDayInput.css("width", limitPerDayWidth);
			}
		}
	}

	$("[name='selectedAll']").click(function() {
		var selectedDishCheckBoxs = document.getElementsByName(this.id);
		for ( var i in selectedDishCheckBoxs) {
			selectedDishCheckBoxs[i].checked = $(this).is(":checked");
		}
	});

	$("#dishList .list_cell_right .soldOut input").click(function() {
		selectedAll(this.name);
	});

	$("[name='updateSelectedDish']")
			.click(
					function() {
						var dishCategoryId = $(this).attr("dishCategoryId");
						var dishUpdateBfiefArry = new Array();
						var selectedDishCheckBoxs = document
								.getElementsByName("dishCategoryId_"
										+ dishCategoryId);

						for (var i = 0; i < selectedDishCheckBoxs.length; i++) {
							var dish = {};
							var checkedBox = selectedDishCheckBoxs[i];
							var noDiscountcheckedBox = document
									.getElementById("noDiscount_"
											+ checkedBox.id);
							var remainStr = $("#remain_" + checkedBox.id).val();
							var limitPerDayStr = $(
									"#limitPerDay_" + checkedBox.id).val();

							dish.id = checkedBox.id;
							dish.soldOut = checkedBox.checked;
							dish.remain = $.isNumeric(remainStr) ? Number(remainStr)
									: '';
							dish.limitPerDay = $.isNumeric(limitPerDayStr) ? Number(limitPerDayStr)
									: '';
							dish.noDiscount = noDiscountcheckedBox.checked;

							dishUpdateBfiefArry.push(dish);
						}

						updateDishArray(dishUpdateBfiefArry, dishCategoryId,
								this);
					});

	function updateDishArray(dishArray, dishCategoryId, thisBtn) {

		$(thisBtn).addClass("disabledButton");
		$("#dishCategoryDishesUpdateMsg_" + dishCategoryId).css("color",
				"#000000").text($.i18n.prop('string_zhengZaiGengXin'));
		$.ajax({
			type : 'POST',
			url : "../admin/updateDishList",
			data : {
				dishesJsonText : JSON.stringify(dishArray)
			},
			dataType : 'json',
			error : function(error) {
				$("#dishCategoryDishesUpdateMsg_" + dishCategoryId).css(
						"color", "red").text(
						$.i18n.prop('string_gengXinShiBaiQingChongShi'));
				$(thisBtn).removeClass("disabledButton");
			},
			success : function(dishArray) {
				$dishCategoriesMap[dishCategoryId] = dishArray;
				loadData();
				$("#dishCategoryDishesUpdateMsg_" + dishCategoryId).css(
						"color", "green").text(
						$.i18n.prop('string_caiPinGengXinChengGong'));
				$(thisBtn).removeClass("disabledButton");
			}
		});
	}

	function selectedAll(dishCategoryId) {
		var selectedDishCheckBoxs = document.getElementsByName(dishCategoryId);
		var selectedAll = selectedDishCheckBoxs.length > 0 ? true : false;
		for (var i = 0; i < selectedDishCheckBoxs.length; i++) {
			if (!selectedDishCheckBoxs[i].checked) {
				selectedAll = false;
			}
		}
		$("#" + dishCategoryId)[0].checked = selectedAll;
	}
}

function showDishCategoryItems() {
	var categoryId = $(this).data("categoryId");
	$("#" + categoryId).toggle();
}

function loadData() {
	$dishManagementData = $.ajax({
		url : "../admin/getDishManagementDataByStoreId?storeId=" + $storeId,
		async : false
	}).responseJSON;

	$menus = $dishManagementData.menus;
	$departments = $dishManagementData.departments;
	$dishTagList = $dishManagementData.commonDishTags.slice(0);
	$dishTagByIdMap = {};
	$dishNameByIdMap = {};
	$dishIdByNameMap = {};
	$dishByIdMap = {};
	$bomLinesByDishIdMap = {};
	$dishNames = [];

	for ( var i in $dishManagementData.bomLines) {
		var bomLine = $dishManagementData.bomLines[i];

		if ($bomLinesByDishIdMap[bomLine.dishId] == null) {
			$bomLinesByDishIdMap[bomLine.dishId] = [];
		}
		$bomLinesByDishIdMap[bomLine.dishId].push(bomLine);
	}

	for ( var i in $dishTagList) {
		var dishTag = $dishTagList[i];
		$dishTagByIdMap[dishTag.id] = dishTag;
	}

	var posPrinterOptionsHtml = new StringBuilder();
	posPrinterOptionsHtml.append([ "<option value=" + 0 + ">" ]);
	posPrinterOptionsHtml.append("无");
	posPrinterOptionsHtml.append("</option>");
	for ( var i in $dishManagementData.posPrinters) {
		var posPrinter = $dishManagementData.posPrinters[i];
		posPrinterOptionsHtml
				.append([ "<option value=" + posPrinter.id + ">" ]);
		posPrinterOptionsHtml.append(posPrinter.name);
		posPrinterOptionsHtml.append("</option>");
	}

	$("#formDepartmentCookingNotePrinterId").html(
			posPrinterOptionsHtml.toString());

	$("#formDepartmentDelivererNotePrinterId").html(
			posPrinterOptionsHtml.toString());

	$("#deskCustomerNotePrinterId").html(posPrinterOptionsHtml.toString());

	$("#stroeCheckoutPosPrinterId").html(posPrinterOptionsHtml.toString());

	var timeRangeOptionsHtml = new StringBuilder();
	for ( var i in $dishManagementData.timeRanges) {
		var timeRange = $dishManagementData.timeRanges[i];
		timeRangeOptionsHtml.append([ "<option value=" + timeRange.id + ">" ]);
		timeRangeOptionsHtml.append(timeRange.name);
		timeRangeOptionsHtml.append("</option>");
	}

	$("#formTimeRangeId").html(timeRangeOptionsHtml.toString());

	if ($menus != null && $menus.length > 0) {
		$curMenu = $menus[0];
		var menusObj = $("#menus");
		menusObj.attr("menuIndex", 0);
		// menusObj.html($curMenu.name);
		// renderCurMenuDishCategories();

		var dishCategoryOptionsHtml = new StringBuilder();
		var dishMenuOptionsHtml = new StringBuilder();
		$dishNames = new Array();
		for ( var i in $menus) {
			var menu = $menus[i];
			var dishCategories = $menus[i].dishCategories;
			dishMenuOptionsHtml.append([ "<option value=" + menu.id + ">" ]);
			dishMenuOptionsHtml.append(menu.name);
			dishMenuOptionsHtml.append("</option>");

			for ( var j in dishCategories) {
				var dishCategory = dishCategories[j];
				$dishCategoriesMap[dishCategory.id] = dishCategory;
				dishCategoryOptionsHtml.append([ "<option value=\""
						+ dishCategory.id + "\">" ]);
				dishCategoryOptionsHtml.append(dishCategory.name);
				dishCategoryOptionsHtml.append("</option>");
				var dishes = dishCategory.dishes;
				for ( var k in dishes) {
					var dish = dishes[k];
					$dishNameByIdMap[dish.id] = dish.name;
					$dishIdByNameMap[$dishNameByIdMap[dish.id]] = dish.id;
					$dishNames.push($dishNameByIdMap[dish.id]);
					$dishByIdMap[dish.id] = dish;
					dish.dishTags = [];
					for ( var l in dish.dishOptionSets) {
						var dos = dish.dishOptionSets[l];
						for ( var m in dos.dishTags) {
							var dishTag = dos.dishTags[m];
							dish.dishTags.push(dishTag);
							$dishTagList.push(dishTag);
							$dishTagByIdMap[dishTag.id] = dishTag;
						}
					}
					for ( var j in dish.dishTagGroups) {
						var dtg = dish.dishTagGroups[j];
						for ( var m in dtg.dishTags) {
							var dishTag = dtg.dishTags[m];
							dish.dishTags.push(dishTag);
							$dishTagList.push(dishTag);
							$dishTagByIdMap[dishTag.id] = dishTag;
						}
					}
				}
			}
		}
		$("#formDishMenuOptions").html(dishMenuOptionsHtml.toString());
		$("#dishCategoryOptionsTemplate").html(
				dishCategoryOptionsHtml.toString());
		$("#dishCategoryOptionsMDITemplate").html(
				dishCategoryOptionsHtml.toString());
	}

	if ($departments != null) {
		var departmentOptionsHtml = new StringBuilder();
		for ( var i in $departments) {
			var department = $departments[i];
			departmentOptionsHtml.append([ "<option value=\"", department.id,
					"\">" ]);
			departmentOptionsHtml.append(department.name);
			departmentOptionsHtml.append("</option>");
		}
		$("#departmentOptionsTemplate").html(departmentOptionsHtml.toString());
		$("#departmentOptionsMDITemplate").html(
				departmentOptionsHtml.toString());
	}

	if ($dishAutoComplete) {
		$dishAutoComplete.changeData($dishByIdMap);
	}

	if ($materialAutoComplete) {
		$materialAutoComplete.changeData($dishManagementData.materials);
	}
}

// 菜品输入自动提示
addEvent.call(null, 'load', function() {
	$dishAutoComplete = autoComplete.call(
			getElementsByClassName('autoComplete'), {/* 使用call或apply调用此方法 */
				source : $dishByIdMap,
				elemCSS : {
					focus : {
						'color' : 'black',
						'background' : '#ccc'
					},
					blur : {
						'color' : 'black',
						'background' : 'transparent'
					}
				},/* 些对象中的key要js对象中的style属性支持 */
				input : 'input',/* 输入框使用input元素 */
				popup : 'ul'/* 提示框使用ul元素 */
			});
});

// 原料输入自动提示
addEvent.call(null, 'load', function() {
	$materialAutoComplete = autoComplete.call(
			getElementsByClassName('autoCompleteMaterial'), {/* 使用call或apply调用此方法 */
				source : $dishManagementData.materials,
				elemCSS : {
					focus : {
						'color' : 'black',
						'background' : '#ccc'
					},
					blur : {
						'color' : 'black',
						'background' : 'transparent'
					}
				},/* 些对象中的key要js对象中的style属性支持 */
				input : 'input',/* 输入框使用input元素 */
				popup : 'ul'/* 提示框使用ul元素 */
			});
});

function getRandomNumber() {
	var randSeed = new Date().getTime();
	randSeed = ((randSeed * 9301 + 49297) % 233280) / (233280.0);
	return Math.ceil(randSeed * 100000);
}

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

function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
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

function testPrinter() {

	var printerId = this.form.posPrinterId.value;

	$.ajax({
		url : "../printing/state/" + printerId,
		async : false,
		error : function(error) {
			alert("打印失败:" + error.responseText);
		},
		success : function(result) {
			if (result != 1) {
				alert("打印机未连接服务器!请检查设备是否正常!");
				return;
			}
			$.ajax({
				type : "POST",
				url : "../printing/testPrinter",
				data : {
					printerId : printerId
				},
				dataType : "json",
				async : false,
				error : function(error) {
					alert("打印失败:" + error.responseText);
				}
			});
		}
	});
}

function renderPosPrinters() {
	var posPrinterHtml = new StringBuilder();
	posPrinterHtml.append("<div class='addPosPrinterBtn item'>+</div>");
	for ( var i in $dishManagementData.posPrinters) {
		var posPrinter = $dishManagementData.posPrinters[i];
		posPrinterHtml.append([ "<div class=\"item\" posPrinterIndex='", i,
				"'>" ]);
		posPrinterHtml.append(posPrinter.name);
		posPrinterHtml.append("</div>");
	}
	$("#posPrinterList").html(posPrinterHtml.toString());
}

function submitPosPrinter() {
	var id = this.form.posPrinterId.value;
	var name = this.form.posPrinterName.value;
	var canPrintCheckoutBill = this.form.posPrinterCanPrintCheckoutBill.value;
	var canPrintCustomerNote = this.form.posPrinterCanPrintCustomerNote.checked;
	var deviceName = this.form.posPrinterDeviceName.value;
	var baudBase = this.form.posPrinterBaudBase.value;
	var beep = this.form.posPrinterBeep.checked;
	var frameWidth = this.form.posPrinterFrameWidth.value;
	var charactersPerLine = this.form.posPrinterCharactersPerLine.value;
	var number = this.form.posPrinterNumber.value;

	$.ajax({
		type : 'POST',
		url : "../admin/addOrUpdatePosPrinter",
		data : {
			id : id,
			storeId : $storeId,
			name : name,
			canPrintCheckoutBill : canPrintCheckoutBill,
			canPrintCustomerNote : canPrintCustomerNote,
			deviceName : deviceName,
			baudBase : baudBase,
			number : number,
			beep : beep,
			frameWidth : frameWidth,
			charactersPerLine : charactersPerLine
		},
		dataType : "json",
		async : false,
		error : function(error) {
			alert("提交失败:" + error.responseText);
		},
		success : function(posPrinter) {
			alert("提交成功!");
			loadData();
			renderPosPrinters();
			closeCurFormDialog();
		}
	});
}

function deletePosPrinter() {
	if (confirm("确定删除此打印机?"))
		$.ajax({
			type : "POST",
			url : "../admin/deletePosPrinter",
			data : {
				id : this.form.posPrinterId.value
			},
			dataType : "json",
			async : false,
			error : function(error) {
				alert("不能删除此打印机:" + error.responseText);
			},
			success : function(flag) {
				if (flag) {
					alert("删除打印机成功");
					loadData();
					renderPosPrinters();
					closeCurFormDialog();
				} else
					alert("不能删除此打印机!");
			}
		});
}

function renderDepartments() {
	var departmentHtml = new StringBuilder();
	departmentHtml.append("<div class='addDepartmentBtn item'>+</div>");
	for ( var i in $dishManagementData.departments) {
		var department = $dishManagementData.departments[i];
		departmentHtml.append([ "<div class=\"item\" departmentIndex='", i,
				"'>" ]);
		departmentHtml.append(department.name);
		departmentHtml.append("</div>");
	}
	$("#departmentList").html(departmentHtml.toString());
}

function submitDepartment() {
	var id = this.form.formDepartmentId.value;
	var name = this.form.formDepartmentName.value;
	var cookingNotePrinterId = this.form.formDepartmentCookingNotePrinterId.value;
	var delivererNotePrinterId = this.form.formDepartmentDelivererNotePrinterId.value;
	var sliceCookingNotes = this.form.formDepartmentSliceCookingNotes.checked;

	$.ajax({
		type : 'POST',
		url : "../admin/addOrUpdateDepartment",
		data : {
			id : id,
			storeId : $storeId,
			name : name,
			cookingNotePrinterId : cookingNotePrinterId,
			delivererNotePrinterId : delivererNotePrinterId,
			sliceCookingNotes : sliceCookingNotes
		},
		dataType : "json",
		async : false,
		error : function(error) {
			alert("提交失败:" + error.responseText);
		},
		success : function(department) {
			alert("提交成功!");
			loadData();
			renderDepartments();
			closeCurFormDialog();
		}
	});
}

function deleteDepartment() {
	if (confirm("确定删除此部门?"))
		$.ajax({
			type : "POST",
			url : "../admin/deleteDepartment",
			data : {
				id : this.form.formDepartmentId.value
			},
			dataType : "json",
			async : false,
			error : function(error) {
				alert("不能删除此部门:" + error.responseText);
			},
			success : function(flag) {
				if (flag) {
					alert("删除部门成功");
					loadData();
					renderDepartments();
					closeCurFormDialog();
				} else
					alert("不能删除此部门!");
			}
		});
}

function renderBookingTimeRanges() {
	var bookingTimeRangeHtml = new StringBuilder();
	bookingTimeRangeHtml
			.append("<div class='addBookingTimeRangeBtn item'>+</div>");
	for ( var i in $dishManagementData.timeRanges) {
		var timeRange = $dishManagementData.timeRanges[i];
		bookingTimeRangeHtml.append([ "<div class=\"item\" timeRangeIndex='",
				i, "'>" ]);
		bookingTimeRangeHtml.append(timeRange.name);
		bookingTimeRangeHtml.append("</div>");
	}
	$("#bookingTimeRangeList").html(bookingTimeRangeHtml.toString());
}

function submitBookingTimeRange() {
	var id = this.form.timeRangeId.value;
	var name = this.form.timeRangeName.value;
	var arriveTimeOptions = this.form.arriveTimeOptions.value;

	$.ajax({
		type : 'POST',
		url : "../admin/addOrUpdateTimeRange",
		data : {
			id : id,
			storeId : $storeId,
			name : name,
			arriveTimeOptions : arriveTimeOptions
		},
		dataType : "json",
		async : false,
		error : function(error) {
			alert("提交失败:" + error.responseText);
		},
		success : function(timeRange) {
			alert("提交成功!");
			loadData();
			renderBookingTimeRanges();
			closeCurFormDialog();
		}
	});
}

function deleteBookingTimeRange() {
	if (confirm("确定删除?"))
		$.ajax({
			type : "POST",
			url : "../admin/deleteTimeRange",
			data : {
				id : this.form.timeRangeId.value
			},
			dataType : "json",
			async : false,
			error : function(error) {
				alert("不能删除:" + error.responseText);
			},
			success : function(flag) {
				if (flag) {
					alert("删除成功");
					loadData();
					renderBookingTimeRanges();
					closeCurFormDialog();
				} else
					alert("不能删除!");
			}
		});
}

function renderRoomResources() {
	var roomResourceHtml = new StringBuilder();
	roomResourceHtml.append("<div class='addRoomResourceBtn item'>+</div>");
	for ( var i in $dishManagementData.resources) {
		var resource = $dishManagementData.resources[i];
		roomResourceHtml.append([ "<div class=\"item\" resourceIndex='", i,
				"'>" ]);
		roomResourceHtml.append(resource.name);
		roomResourceHtml.append("</div>");
	}

	$("#roomResourceList").html(roomResourceHtml.toString());
}

function submitRoomResource() {
	var id = this.form.resourceId.value;
	var name = this.form.resourceName.value;
	var timeRangeId = this.form.formTimeRangeId.value;
	var amount = this.form.timeRangeAmount.value;

	$.ajax({
		type : 'POST',
		url : "../admin/addOrUpdateResource",
		data : {
			id : id,
			name : name,
			timeRangeId : timeRangeId,
			amount : amount
		},
		dataType : "json",
		async : false,
		error : function(error) {
			alert("提交失败:" + error.responseText);
		},
		success : function(resource) {
			alert("提交成功!");
			loadData();
			renderRoomResources();
			closeCurFormDialog();
		}
	});
}

function deleteRoomResource() {
	if (confirm("确定删除?"))
		$.ajax({
			type : "POST",
			url : "../admin/deleteResource",
			data : {
				id : this.form.resourceId.value
			},
			dataType : "json",
			async : false,
			error : function(error) {
				alert("不能删除:" + error.responseText);
			},
			success : function(flag) {
				if (flag) {
					alert("删除成功");
					loadData();
					renderRoomResources();
					closeCurFormDialog();
				} else
					alert("不能删除!");
			}
		});
}

function renderPaymentTypes() {
	var paymentTypeHtml = new StringBuilder();
	paymentTypeHtml.append("<div class='addPaymentTypeBtn item'>+</div>");
	for ( var i in $dishManagementData.paymentTypes) {
		var paymentType = $dishManagementData.paymentTypes[i];
		paymentTypeHtml.append([ "<div class=\"item\" paymentTypeIndex='", i,
				"'>" ]);
		paymentTypeHtml.append(paymentType.name);
		paymentTypeHtml.append("</div>");
	}
	$("#paymentTypeList").html(paymentTypeHtml.toString());
}

function submitPaymentType() {
	var id = this.form.paymentTypeId.value;
	var exchangeRate = this.form.paymentTypeExchangeRate.value;
	var name = this.form.paymentTypeName.value;
	var sort = this.form.paymentTypeSort.value;

	$.ajax({
		type : 'POST',
		url : "../admin/addOrUpdatePaymentType",
		data : {
			id : id,
			storeId : $storeId,
			exchangeRate : exchangeRate,
			name : name,
			sort : sort
		},
		dataType : "json",
		async : false,
		error : function(error) {
			alert("提交失败:" + error.responseText);
		},
		success : function(paymentType) {
			alert("提交成功!");
			loadData();
			clearScreen();
			renderPaymentTypes();
			closeCurFormDialog();
		}
	});
}

function deletePaymentType() {
	if (confirm("确定删除?"))
		$.ajax({
			type : "POST",
			url : "../admin/deletePaymentType",
			data : {
				id : this.form.paymentTypeId.value
			},
			dataType : "json",
			async : false,
			error : function(error) {
				alert("不能删除:" + error.responseText);
			},
			success : function(flag) {
				if (flag) {
					alert("删除成功");
					loadData();
					renderPaymentTypes();
					closeCurFormDialog();
				} else
					alert("不能删除!");
			}
		});
}

function renderServiceFeeRates() {
	var serviceFeeRateHtml = new StringBuilder();
	serviceFeeRateHtml.append("<div class='addServiceFeeRateBtn item'>+</div>");
	for ( var i in $dishManagementData.serviceFeeRates) {
		var serviceFeeRate = $dishManagementData.serviceFeeRates[i];
		serviceFeeRateHtml.append([
				"<div class=\"item\" serviceFeeRateIndex='", i, "'>" ]);
		serviceFeeRateHtml.append(serviceFeeRate.name);
		serviceFeeRateHtml.append("</div>");
	}
	$("#serviceFeeRateList").html(serviceFeeRateHtml.toString());
}

function renderCancelReasons() {
	var cancelReasonHtml = new StringBuilder();
	cancelReasonHtml.append("<div class='addCancelReasonBtn item'>+</div>");
	for ( var i in $dishManagementData.cancelReasons) {
		var cancelReason = $dishManagementData.cancelReasons[i];
		cancelReasonHtml.append([ "<div class=\"item\" cancelReasonIndex='", i,
				"'>" ]);
		cancelReasonHtml.append(cancelReason.name);
		cancelReasonHtml.append("</div>");
	}
	$("#cancelReasonList").html(cancelReasonHtml.toString());
}

function renderDiscountRules() {
	var discountRuleHtml = new StringBuilder();
	discountRuleHtml.append("<div class='addDiscountRuleBtn item'>+</div>");
	for ( var i in $dishManagementData.discountRules) {
		var discountRule = $dishManagementData.discountRules[i];
		discountRuleHtml.append([ "<div class=\"item\" discountRuleIndex='", i,
				"'>" ]);
		discountRuleHtml.append(discountRule.name);
		discountRuleHtml.append("</div>");
	}
	$("#discountRuleList").html(discountRuleHtml.toString());
}

function submitNamedValue() {
	var id = this.form.id.value;
	var name = this.form.name.value;
	var type = this.form.type.value;
	var value = this.form.value.value;

	$.ajax({
		type : 'POST',
		url : "../admin/addOrUpdateNamedValue",
		data : {
			id : id,
			storeId : $storeId,
			name : name,
			type : type,
			value : value
		},
		dataType : "json",
		async : false,
		error : function(error) {
			alert("提交失败:" + error.responseText);
		},
		success : function(namedValue) {
			alert("提交成功!");
			loadData();
			clearScreen();
			if (namedValue.type == "DISCOUNT_RATE") {
				renderDiscountRates();
			} else if (namedValue.type == "CANCEL_REASON") {
				renderCancelReasons();
			} else if (namedValue.type == "SERVICE_FEE_RATE") {
				renderServiceFeeRates();
			}
			closeCurFormDialog();
		}
	});
}

function deleteNamedValue() {
	if (confirm("确定删除?"))
		$.ajax({
			type : "POST",
			url : "../admin/deleteNamedValue",
			data : {
				id : this.form.id.value
			},
			dataType : "json",
			async : false,
			error : function(error) {
				alert("不能删除:" + error.responseText);
			},
			success : function(flag) {
				if (flag == 0) {
					alert("不能删除!");
					return;
				}

				alert("删除成功");
				loadData();
				closeCurFormDialog();
				if (flag == 1) {
					renderDiscountRates();
				} else if (flag == 2) {
					renderServiceFeeRates();
				} else if (flag == 3) {
					renderCancelReasons();
				}
			}
		});
}

function renderDiscountRates() {
	var discountRateHtml = new StringBuilder();
	discountRateHtml.append("<div class='addDiscountRateBtn item'>+</div>");
	for ( var i in $dishManagementData.discountRates) {
		var discountRate = $dishManagementData.discountRates[i];
		discountRateHtml.append([ "<div class=\"item\" discountRateIndex='", i,
				"'>" ]);
		discountRateHtml.append(discountRate.name);
		discountRateHtml.append("</div>");
	}
	$("#discountRateList").html(discountRateHtml.toString());
}

function submitDiscountRule() {
	var id = this.form.discountRuleId.value;
	var name = this.form.discountRuleName.value;
	var value = this.form.discountRuleValue.value;
	var discountRate = this.form.discountRuleDiscountRate.value;
	var noOverallDiscount = this.form.discountRuleNoOverallDiscount.checked;

	$.ajax({
		type : 'POST',
		url : "../admin/addOrUpdateDiscountRule",
		data : {
			id : id,
			storeId : $storeId,
			name : name,
			value : value,
			discountRate : discountRate,
			noOverallDiscount : noOverallDiscount
		},
		dataType : "json",
		async : false,
		error : function(error) {
			alert("提交失败:" + error.responseText);
		},
		success : function(discountRule) {
			closeCurFormDialog();
			if (discountRule) {
				alert("提交成功!");
				loadData();
				clearScreen();
				renderDiscountRules();
			} else
				alert("更新失败,请刷新后再试!");
		}
	});
}

function deleteDiscountRule() {
	if (confirm("确定删除?"))
		$.ajax({
			type : "POST",
			url : "../admin/deleteDiscountRule",
			data : {
				id : this.form.discountRuleId.value
			},
			dataType : "json",
			async : false,
			error : function(error) {
				alert("不能删除:" + error.responseText);
			},
			success : function(flag) {
				closeCurFormDialog();
				if (flag) {
					alert("删除成功");
					loadData();
					renderDiscountRules();
				} else
					alert("删除失败,请刷新后再试!");
			}
		});
}

function renderDishUnits() {
	var dishUnitHtml = new StringBuilder();
	dishUnitHtml.append("<div class='addDishUnitBtn item'>+</div>");
	for ( var i in $dishManagementData.dishUnits) {
		var dishUnit = $dishManagementData.dishUnits[i];
		dishUnitHtml.append([ "<div class=\"item\" dishUnitIndex='", i, "'>" ]);
		dishUnitHtml.append(dishUnit.name);
		dishUnitHtml.append("</div>");
	}
	$("#dishUnitList").html(dishUnitHtml.toString());
}

function submitDishUnit() {
	var id = this.form.dishUnitId.value;
	var name = this.form.dishUnitName.value;
	var groupNumber = this.form.dishUnitGroupNumber.value;
	var exchangeRate = this.form.dishUnitExchangeRate.value;
	var sort = this.form.dishUnitSort.value;

	$.ajax({
		type : 'POST',
		url : "../admin/addOrUpdateDishUnit",
		data : {
			id : id,
			storeId : $storeId,
			name : name,
			groupNumber : groupNumber,
			exchangeRate : exchangeRate,
			sort : sort
		},
		dataType : "json",
		async : false,
		error : function(error) {
			alert("提交失败:" + error.responseText);
		},
		success : function(dishUnit) {
			alert("提交成功!");
			loadData();
			renderDishUnits();
			closeCurFormDialog();
		}
	});
}

function deleteDishUnit() {
	if (confirm("确定删除?"))
		$.ajax({
			type : "POST",
			url : "../admin/deleteDishUnit",
			data : {
				id : this.form.dishUnitId.value
			},
			dataType : "json",
			async : false,
			error : function(error) {
				alert("不能删除:" + error.responseText);
			},
			success : function(flag) {
				closeCurFormDialog();
				if (flag) {
					alert("删除成功");
					loadData();
					renderDishUnits();
				} else
					alert("不能删除!");
			}
		});
}

function renderEmployees() {
	var employeeHtml = new StringBuilder();
	for ( var i in $dishManagementData.employees) {
		var employee = $dishManagementData.employees[i];
		employeeHtml.append([ "<div class=\"item\" employeeIndex='", i, "'>" ]);
		employeeHtml.append(employee.name);
		employeeHtml.append("</div>");
	}
	$("#employeeList").html(employeeHtml.toString());
}

function submitEmployee() {
	var id = this.form.employeeId.value;
	var name = this.form.employeeName.value;
	var workNumber = this.form.employeeWorkNumber.value;
	var smartCardNo = this.form.employeeSmartCardNo.value;
	var canRestoreDishOrder = this.form.employeeCanRestoreDishOrder.checked;
	var canPreprintCheckoutNote = this.form.employeeCanPreprintCheckoutNote.checked;
	var canCancelOrderItem = this.form.employeeCanCancelOrderItem.checked;
	var canViewReport = this.form.employeeCanViewReport.checked;
	var canCancelDishSoldOut = this.form.employeeCanCancelDishSoldOut.checked;

	$.ajax({
		type : 'POST',
		url : "../admin/addOrUpdateEmployee",
		data : {
			id : id,
			storeId : $storeId,
			name : name,
			workNumber : workNumber,
			smartCardNo : smartCardNo,
			canRestoreDishOrder : canRestoreDishOrder,
			canPreprintCheckoutNote : canPreprintCheckoutNote,
			canCancelOrderItem : canCancelOrderItem,
			canViewReport : canViewReport,
			canCancelDishSoldOut : canCancelDishSoldOut
		},
		dataType : "json",
		async : false,
		error : function(error) {
			alert("提交失败:" + error.responseText);
		},
		success : function(employee) {
			closeCurFormDialog();
			if (employee) {
				alert("提交成功!");
				loadData();
				renderEmployees();
			} else
				alert("更新失败!请刷新后再试!");

		}
	});
}

function renderStore() {
	var store = $dishManagementData.store;
	var storeHtml = new StringBuilder();
	storeHtml.append([ "<div class=\"item\">" ]);
	storeHtml.append(store.name);
	storeHtml.append("</div>");

	$("#storeList").html(storeHtml.toString());
}

function submitStore() {
	var id = this.form.storeId.value;
	var checkoutPosPrinterId = this.form.stroeCheckoutPosPrinterId.value;
	var autoPrintCustomerNote = this.form.storeAutoPrintCustomerNote.checked;
	var noShowPriceInCustomerNote = this.form.storeNoShowPriceInCustomerNote.checked;
	var pointRate = this.form.storePointRate.value;
	var includedCouponValueInPoint = this.form.storeIncludedCouponValueInPoint.checked;
	var isDoubleSizeFont = this.form.storeIsDoubleSizeFont.checked;
	var storeActivity = this.form.storeActivity.value;

	$.ajax({
		type : 'POST',
		url : "../admin/addOrUpdateStore",
		data : {
			id : id,
			checkoutPosPrinterId : checkoutPosPrinterId,
			autoPrintCustomerNote : autoPrintCustomerNote,
			noShowPriceInCustomerNote : noShowPriceInCustomerNote,
			pointRate : pointRate,
			includedCouponValueInPoint : includedCouponValueInPoint,
			isDoubleSizeFont : isDoubleSizeFont,
			storeActivity : storeActivity
		},
		dataType : "json",
		async : false,
		error : function(error) {
			alert("提交失败:" + error.responseText);
		},
		success : function(store) {
			closeCurFormDialog();
			if (store) {
				alert("提交成功!");
				loadData();
				renderStore();
			} else
				alert("更新失败!请刷新后再试!");
		}
	});
}

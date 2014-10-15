function EditDishView(container) {

	var self = this;

	var eventHandlers = {
		'onSwitchViewCommand' : []
	};

	this.attachEvent = function(eventName, handler) {
		if (eventName in eventHandlers) {
			eventHandlers[eventName].push(handler);
		}
	};

	var fireEvent = function(eventName) {
		var args = [];
		for (var i = 1; i < arguments.length; i++) {
			args.push(arguments[i]);
		}
		if (eventName in eventHandlers) {
			for ( var i in eventHandlers[eventName]) {
				eventHandlers[eventName][i].apply(self, args);
			}
		}
	};

	var editDishPicker = null;

	var init = function() {

		$("#switchToDeskViewButton", container).click(function() {
			switchToView('DESK_VIEW');
		});

		$("#restoreSoldOutDishesButton", container).click(
				function() {
					showEmployeeLoginDialog(restoreSoldOutDishes, null, null,
							true);
					function restoreSoldOutDishes() {
						if (!$storeData.employee.canCancelDishSoldOut
								&& $templeEmployee
								&& !$templeEmployee.canCancelDishSoldOut) {
							showAlertDialog($.i18n.prop('string_cuoWu'),
									"权限不足!无法进行操作!");
							return;
						}

						$.ajax({
							type : 'POST',
							url : "../admin/restoreSoldOutDishes",
							data : {
								employeeId : $storeData.employee.id,
								storeId : $storeId
							},
							dataType : "json",
							error : function(error) {
								showAlertDialog($.i18n.prop('string_cuoWu'),
										error.responseText);
							},
							success : function(result) {
								forceUpdateDishes();
								editDishPicker.refreshUI();
							}
						});
					}
				});

		editDishPicker = new DishPicker($('#editDishViewMain', container),
				null, false, true);

		$(window).resize(function() {
			editDishPicker.refreshUI();
		});
	};

	this.show = function() {
		$(container).show();
		editDishPicker.refreshUI();
	};

	this.hide = function() {
		$(container).hide();
	};

	init();
}

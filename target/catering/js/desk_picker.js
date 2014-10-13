function DeskPicker(groupContainer, listContainer, deskSelectedCallback,
		filter, invisibleDeskList) {
	var selectedDeskGroupName = $.trim($.i18n.prop('string_quanBu'));
	var selectedDesk;

	groupContainer.delegate(".deskGroupButton", "click", deskGroupButtonClick);
	listContainer.delegate(".deskButton", "click", deskButtonClick);

	renderDeskGroups();

	this.refreshUI = renderDesks;
	this.selectDesk = selectDesk;

	function selectDesk(desk) {
		selectedDesk = desk;
		renderDesks();
	}

	function deskGroupButtonClick() {
		selectedDesk = null;
		selectedDeskGroupName = $(this).data("deskGroupName");
		renderDeskGroups();
		renderDesks();
	}

	function deskButtonClick() {

		var deskId = $(this).data("deskId");
		var deskPanel = $("#deskPanel");

		if (selectedDesk && selectedDesk.id == deskId) {
			selectedDesk = null;
		} else {
			selectedDesk = $deskMap[deskId];
		}

		renderDesks();

		if (deskSelectedCallback) {
			deskSelectedCallback(selectedDesk);
		}
	}

	function renderDeskGroups() {
		groupContainer.empty();
		for ( var deskGroupName in $deskByGroupNameMap) {
			var deskGroupButton = $('<button>').addClass("deskGroupButton")
					.text(deskGroupName);
			deskGroupButton.data("deskGroupName", deskGroupName).appendTo(
					groupContainer);

			if (deskGroupName == selectedDeskGroupName) {
				deskGroupButton.addClass("deskGroupButtonSelected");
			}
		}
	}

	function renderDesks() {

		var top = groupContainer.offset().top + groupContainer.height() + 10;
		listContainer.offset({
			top : top,
			left : 5
		});

		var desks = $deskByGroupNameMap[selectedDeskGroupName];
		var orgDeskButtons = listContainer.children();
		var orgDeskButtonCount = orgDeskButtons.length;
		var showDeskCount = 0;

		for ( var i in desks) {
			var desk = desks[i];

			if (filter == DeskPicker.filter.emptyDeskOnly && !isDeskEmpty(desk)) {
				continue;
			}
			if (filter == DeskPicker.filter.occupiedDeskOnly
					&& isDeskEmpty(desk)) {
				continue;
			}

			if (!desk.enabled) {
				continue;
			}

			var invisible = false;
			for ( var j in invisibleDeskList) {
				if (invisibleDeskList[j].id == desk.id) {
					invisible = true;
				}
			}
			if (invisible) {
				continue;
			}

			var deskButton = null;
			if (showDeskCount < orgDeskButtonCount) {
				deskButton = $(orgDeskButtons[showDeskCount]);
				deskButton.removeClass().addClass("button").addClass(
						"deskButton");
			} else {
				deskButton = $("<div>").addClass("button").addClass(
						"deskButton");
				deskButton.appendTo(listContainer);
			}

			deskButton.text(desk.name).data("deskId", desk.id).show();

			var orderBrief = $dishOrderBriefByDeskIdMap[desk.id];
			var selected = selectedDesk && selectedDesk.id == desk.id;
			if (selected) {
				deskButton.addClass("deskButtonSelected");
			}

			if (isDeskEmpty(desk)) {
				deskButton.addClass("deskStateEmpty");
			} else {
				if (orderBrief.state == DISH_ORDER_STATE.PROCESSING) {
					if (orderBrief.prePrintCheckoutNotePrinted) {
						deskButton.addClass("deskStatePaying");
					} else
						deskButton.addClass("deskStateProccessing");

					if (orderBrief.isHasSelfOrder) {
						deskButton.html(desk.name + "<br> <br>待确认");
					}
				}
				if (orderBrief.state == DISH_ORDER_STATE.CREATING) {
					deskButton.addClass("deskStateCreating");
				}
			}

			showDeskCount++;
		}
		for (var j = showDeskCount; j < orgDeskButtonCount; j++) {
			$(orgDeskButtons[j]).hide();
		}
	}
}

DeskPicker.filter = {
	none : 1,
	emptyDeskOnly : 2,
	occupiedDeskOnly : 3
};
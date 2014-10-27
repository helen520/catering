function AuthorityManager() {
	var self = this;

	var eventHandlers = {
		'onCurrentEmployeeChanged' : []
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

	var uiDataManager = UIDataManager.getInstance();
	var longSession = false;

	if (typeof (ls) != "undefined") {
		longSession = true;
	}

	var _currentEmployee = null;
	this.getCurrentEmployee = function() {
		return _currentEmployee;
	};

	this.setCurrentEmployee = function(employee) {
		_currentEmployee = employee;
		fireEvent('onCurrentEmployeeChanged', _currentEmployee);
	};

	var checkPrivilege = function(employee, privilege) {
		if (!employee) {
			return false;
		}
		if (employee[privilege]) {
			return true;
		}

		return false;
	};

	this.getAuthority = function(privilege, okCallback, isAuthority) {
		if (longSession && checkPrivilege(_currentEmployee, privilege)) {
			if (okCallback) {
				okCallback();
			}

			return;
		}

		new EmployeeLoginDialog(function(employee, isAuthority) {

			if (!isAuthority)
				self.setCurrentEmployee(employee);

			if (checkPrivilege(employee, privilege)) {
				if (okCallback) {
					okCallback();
				}
			} else {
				new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
						.prop('string_NoPrivilege')).show();
			}
		}).show();
	};

	this.getTemporaryAuthority = function(privilege, okCallback) {
		if (longSession && checkPrivilege(_currentEmployee, privilege)) {
			if (okCallback) {
				okCallback();
			}

			return;
		}

		self.forceTemporaryAuthority(privilege, okCallback);
	};

	this.forceTemporaryAuthority = function(privilege, okCallback) {
		new EmployeeLoginDialog(function(employee, sessionInfo) {
			if (checkPrivilege(employee, privilege)) {
				if (okCallback) {
					okCallback();
				}
			} else {
				new AlertDialog($.i18n.prop('string_SystemMessage'), $.i18n
						.prop('string_NoPrivilege')).show();
			}
		}).show();
	};
}

AuthorityManager.getInstance = function() {
	if (typeof (AuthorityManager._instance) == "undefined") {
		AuthorityManager._instance = new AuthorityManager();
	}

	return AuthorityManager._instance;
};

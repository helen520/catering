function UnibizProxy() {
	var self = this;
	var unibizUrl = null;
	var rpcBaseUrl = null;
	var sid = null;
	var session_id = null;

	var init = function() {
		var uiDataManager = UIDataManager.getInstance();
		unibizUrl = uiDataManager.getStoreData().store.unibizURL;
		rpcBaseUrl = unibizUrl + 'unibiz/rpc/';

		var url = rpcBaseUrl + 'get_sid';
		$.ajax(getJsonPAjaxReq(getJsonRPCPayload(), url)).done(
				function(response, textStatus, jqXHR) {
					sid = response.result;
					getSessionId(sid);
				});

		function getSessionId(sid) {
			var employee = uiDataManager.getStoreData().employee;
			result = $.ajax({
				url : "../storeData/getUnibizSessionId?employeeId="
						+ employee.id + "&unibizUrl=" + unibizUrl + "&sid="
						+ sid,
				async : false
			});

			session_id = result.responseText;
		}
	};

	var getJsonRPCPayload = function() {
		var payload = {
			id : 'r110',
			method : 'call',
			jsonrpc : '2.0',
			params : {
				context : {
					lang : 'zh_CN',
					tz : 'Asia/Shanghai',
				},
				session_id : session_id
			}
		};
		return payload;
	};

	var getJsonPAjaxReq = function(payload, url) {
		var ajaxReq = {
			type : "GET",
			jsonp : "jsonp",
			dataType : 'jsonp',
			data : {
				r : JSON.stringify(payload)
			},
			url : url
		};

		return ajaxReq;
	};

	this.searchCustomer = function(keyword, callback) {
		var url = rpcBaseUrl + 'search_customer';
		var payload = getJsonRPCPayload();
		payload.params.keyword = keyword;
		$.ajax(getJsonPAjaxReq(payload, url)).done(
				function(response, textStatus, jqXHR) {
					customers = response.result;
					if (callback) {
						callback(customers);
					}
				});
	};

	init();
}

UnibizProxy.getInstance = function() {
	if (typeof (UnibizProxy._instance) == "undefined") {
		UnibizProxy._instance = new UnibizProxy();
	}

	return UnibizProxy._instance;
};

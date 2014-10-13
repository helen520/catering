package helen.catering.controller;

import helen.catering.model.DynamicDataBrief;
import helen.catering.model.ReportData;
import helen.catering.model.StoreData;
import helen.catering.model.entities.DishCategory;
import helen.catering.model.entities.Employee;
import helen.catering.model.entities.UserAccount;
import helen.catering.service.ReportingService;
import helen.catering.service.ServiceException;
import helen.catering.service.StoreDataService;
import helen.catering.service.UserService;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("storeData")
public class StoreDataController {

	@Autowired
	StoreDataService _storeDataService;

	@Autowired
	UserService _userService;

	@Autowired
	ReportingService _reportingService;

	@ResponseBody
	@RequestMapping("getStoreDataById/{storeId}")
	public StoreData getStoreDataById(@PathVariable long storeId)
			throws ServiceException {
		String userName = "";
		try {
			userName = ((User) SecurityContextHolder.getContext()
					.getAuthentication().getPrincipal()).getUsername();
		} catch (Exception ex) {
		}
		// TODO for test, will remove
		if (userName == "")
			userName = "2";
		UserAccount userAccount = _userService.getUserByName(userName);
		Employee employee = null;
		if (userAccount != null)
			employee = _userService.getEmployeeByUserAccountId(userAccount
					.getId());
		StoreData sd = _storeDataService.getStoreDataById(storeId);
		sd.setUserAccount(userAccount);
		sd.setEmployee(employee);
		return sd;
	}

	@ResponseBody
	@RequestMapping("getDynamicDataBriefByStoreId/{storeId}")
	public DynamicDataBrief getDynamicDataBriefByStoreId(
			@PathVariable long storeId,
			@RequestParam String lastMenuHash,
			@RequestParam String lastActiveDishOrderSetHash,
			@RequestParam(value = "lastBookingRecordsHash", required = false, defaultValue = "0") String lastBookingRecordsHash,
			@RequestParam(value = "lastSelfDishOrdersHash", required = false, defaultValue = "0") String lastSelfDishOrdersHash) {

		return _storeDataService.getDynamicDataBriefById(storeId, lastMenuHash,
				lastActiveDishOrderSetHash, lastBookingRecordsHash,
				lastSelfDishOrdersHash);
	}

	@ResponseBody
	@RequestMapping("getActiveDishOrderDynamicData/{storeId}")
	public List<Object> getActiveDishOrderDynamicData(
			@PathVariable long storeId,
			@RequestParam String lastActiveDishOrderSetHash) {

		return _storeDataService.getActiveDishOrderDynamicData(storeId,
				lastActiveDishOrderSetHash);
	}

	@ResponseBody
	@RequestMapping(value = "salesDataReset", method = RequestMethod.POST)
	public boolean salesDataReset(HttpServletRequest request,
			HttpServletResponse response, @RequestParam long storeId) {
		if (request.getLocalAddr().startsWith("127.0.0.1"))
			return _storeDataService.salesDataReset(storeId);
		return false;
	}

	@ResponseBody
	@RequestMapping("getDishCategoryById/{dishCategoryId}")
	public DishCategory getDishCategoryById(@PathVariable long dishCategoryId) {
		return _storeDataService.getDishCategoryById(dishCategoryId);
	}

	@ResponseBody
	@RequestMapping("getReportDataByStoreId/{storeId}")
	public ReportData getReportDataByStoreId(@PathVariable long storeId) {

		return _reportingService.getReportDataByStoreId(storeId);
	}

	@ResponseBody
	@RequestMapping("updateEmployeeIsBlock")
	public Employee updateEmployeeIsBlock(@RequestParam long employeeId,
			@RequestParam boolean isBlock) {
		return _userService.updateEmployeeIsBlock(employeeId, isBlock);
	}
}

package helen.catering.controller;

import helen.catering.model.entities.Employee;
import helen.catering.model.entities.Store;
import helen.catering.model.entities.UserAccount;
import helen.catering.service.ServiceException;
import helen.catering.service.StoreDataService;
import helen.catering.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class LoginController {

	@Autowired
	UserService _userService;
	@Autowired
	StoreDataService _storeDataService;

	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public String login(ModelMap model) throws ServiceException {
		return "login";
	}

	@RequestMapping(value = "/employeeLogin/{storeId}", method = RequestMethod.POST)
	public @ResponseBody
	Employee employeeLogin(@PathVariable long storeId,
			@RequestParam String workNumber, @RequestParam String password)
			throws ServiceException {
		Employee employee = null;

		if (workNumber == "" && password != "") {
			employee = _userService.getEmployeeByStoreIdAndSmartCardNo(storeId,
					password);
		} else
			employee = _userService.getEmployeeByStoreIdAndWorkNumber(storeId,
					workNumber);

		if (employee == null) {
			throw new ServiceException(ServiceException.LOGIN_FAILED);
		}

		UserAccount ua = _userService.getUserAccountById(employee
				.getUserAccountId());
		if (!ua.getPassword().trim().equals(password.trim())) {
			throw new ServiceException(ServiceException.LOGIN_FAILED);
		}
		return employee;
	}

	@RequestMapping(value = "/loginfailed", method = RequestMethod.GET)
	public String loginerror(ModelMap model) {
		model.addAttribute("error", "true");
		return "login";
	}

	@RequestMapping(value = "/logout", method = RequestMethod.GET)
	public String logout(ModelMap model) {
		return "login";
	}

	@RequestMapping(value = "/chooseType", method = RequestMethod.GET)
	public ModelAndView chooseType(ModelMap model) throws Exception {
		User user = null;
		try {
			user = (User) SecurityContextHolder.getContext()
					.getAuthentication().getPrincipal();
		} catch (Exception ex) {
		}

		if (user == null) {
			return new ModelAndView("redirect:/login");
		}

		UserAccount userAccount = _userService
				.getUserByName(user.getUsername());

		if (userAccount == null)
			throw new ServiceException(
					ServiceException.LOGIN_FAILED_MORE_THAN_ONE);

		Store store = _storeDataService.getStoreById(userAccount.getStoreId());
		if (store.getIsInstantPay() && !store.getIsNormal()) {
			return new ModelAndView("redirect:/instantPay");
		}

		ModelAndView mav = new ModelAndView();
		mav.setViewName("chooseType");
		mav.addObject("store", store);
		return mav;
	}

	@RequestMapping(value = "modifyPassword")
	public String modifyPassword(ModelMap model) {
		return "modifyPassword";
	}

	@RequestMapping(value = "submitNewPassword")
	public String submitNewPassword(ModelMap model,
			@RequestParam(value = "userName") String userName,
			@RequestParam(value = "oldPassword") String oldPassword,
			@RequestParam(value = "newPassword") String newPassword) {

		if (newPassword == "") {
			model.addAttribute("notice", "true");
			return "modifyPassword";
		}

		boolean isSuccessed = _userService.modifyUserPassword(userName,
				oldPassword, newPassword);
		if (isSuccessed) {
			model.addAttribute("success", "true");
			return "login";
		} else {
			model.addAttribute("error", "true");
			return "modifyPassword";
		}
	}
}

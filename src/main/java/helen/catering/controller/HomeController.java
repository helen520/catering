package helen.catering.controller;

import helen.catering.model.entities.Store;
import helen.catering.model.entities.UserAccount;
import helen.catering.service.ServiceException;
import helen.catering.service.StoreDataService;
import helen.catering.service.UserService;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.GrantedAuthorityImpl;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class HomeController {

	@Autowired
	UserService _userService;
	@Autowired
	StoreDataService _storeDataService;

	// TODO do not redirect, override spring login success
	@RequestMapping(value = "/role", method = RequestMethod.GET)
	public @ResponseBody
	boolean role() {
		Collection<? extends GrantedAuthority> authorities = SecurityContextHolder
				.getContext().getAuthentication().getAuthorities();
		boolean authorized = authorities.contains(new GrantedAuthorityImpl(
				"ROLE_ADMIN"));

		return authorized;
	}

	// TODO do not redirect, override spring login success
	@RequestMapping(value = "/store", method = RequestMethod.GET)
	public ModelAndView mobileHome() throws ServiceException {
		User user = null;
		try {
			user = (User) SecurityContextHolder.getContext()
					.getAuthentication().getPrincipal();
		} catch (Exception ex) {
		}
		// TODO for test, will remove
		if (user == null)
			return new ModelAndView("redirect:/store/1");
		UserAccount userAccount = _userService
				.getUserByName(user.getUsername());

		if (userAccount == null)
			throw new ServiceException(ServiceException.LOGIN_FAILED_MORE_THAN_ONE);

		Store store = _storeDataService.getStoreById(userAccount.getStoreId());
		if (!store.getIsNormal()) {
			return new ModelAndView("redirect:/instantPay/"
					+ userAccount.getStoreId());
		}

		return new ModelAndView("redirect:/store/" + userAccount.getStoreId());
	}

	@RequestMapping(value = "/store/{storeId}", method = RequestMethod.GET)
	public ModelAndView mobileHome(@PathVariable long storeId) {
		try {
			_userService.AssertStoreAuth(storeId);
		} catch (Exception ex) {
			return new ModelAndView("redirect:/j_spring_security_logout");
		}

		return new ModelAndView("/mobile/work_console");
	}

	@RequestMapping(value = "/dishView/{storeId}", method = RequestMethod.GET)
	public String dishView(@PathVariable long storeId) {
		return "/mobile/work_console";
	}

	@RequestMapping(value = "/dishOrderView/{storeId}", method = RequestMethod.GET)
	public String dishOrderView(@PathVariable long storeId) {
		return "/mobile/work_console";
	}

	@RequestMapping(value = "/desktop", method = RequestMethod.GET)
	public ModelAndView desktopHome() throws Exception {
		User user = null;
		try {
			user = (User) SecurityContextHolder.getContext()
					.getAuthentication().getPrincipal();
		} catch (Exception ex) {
		}
		// TODO for test, will remove
		if (user == null)
			return new ModelAndView("redirect:/desktop/1");
		UserAccount userAccount = _userService
				.getUserByName(user.getUsername());

		if (userAccount == null)
			throw new ServiceException(ServiceException.LOGIN_FAILED_MORE_THAN_ONE);

		Store store = _storeDataService.getStoreById(userAccount.getStoreId());
		if (!store.getIsNormal()) {
			return new ModelAndView("redirect:/instantPay/"
					+ userAccount.getStoreId());
		}

		return new ModelAndView("redirect:/desktop/" + userAccount.getStoreId());
	}

	@RequestMapping(value = "/desktop/{storeId}", method = RequestMethod.GET)
	public ModelAndView desktopHome(@PathVariable long storeId) {
		try {
			_userService.AssertStoreAuth(storeId);
		} catch (Exception ex) {
			return new ModelAndView("redirect:/j_spring_security_logout");
		}
		return new ModelAndView("desktop/work_console");
	}

	@RequestMapping(value = "/instantPay", method = RequestMethod.GET)
	public ModelAndView InstantPayHome() throws Exception {
		User user = null;
		try {
			user = (User) SecurityContextHolder.getContext()
					.getAuthentication().getPrincipal();
		} catch (Exception ex) {
		}

		if (user == null)
			return new ModelAndView("redirect:/instantPay/1");
		UserAccount userAccount = _userService
				.getUserByName(user.getUsername());

		if (userAccount == null)
			throw new ServiceException(ServiceException.LOGIN_FAILED_MORE_THAN_ONE);

		Store store = _storeDataService.getStoreById(userAccount.getStoreId());
		if (!store.getIsInstantPay()) {
			return new ModelAndView("redirect:/chooseType");
		}

		return new ModelAndView("redirect:/instantPay/"
				+ userAccount.getStoreId());
	}

	@RequestMapping(value = "/instantPay/{storeId}", method = RequestMethod.GET)
	public ModelAndView instantPayHome(@PathVariable long storeId) {
		try {
			_userService.AssertStoreAuth(storeId);
		} catch (Exception ex) {
			return new ModelAndView("redirect:/j_spring_security_logout");
		}
		return new ModelAndView("instantPay/work_console");
	}

	@RequestMapping(value = "/wechat_self/{storeId}", method = RequestMethod.GET)
	public ModelAndView wechat_self(
			@PathVariable long storeId,
			@RequestParam(required = false, defaultValue = "") String openId,
			@RequestParam(required = false, defaultValue = "0") Long userId,
			@RequestParam(required = false, defaultValue = "0") Long bookRecordId) {

		UserAccount userAccount = null;

		if (userId != 0) {
			userAccount = _userService.getUserAccountById(userId);
		} else if (!openId.equals("")) {
			userAccount = _userService.getUserAccountByOpenId(openId);
		}

		Store store = _storeDataService.getStoreById(storeId);

		if (userAccount == null || store == null) {
			return new ModelAndView("error").addObject("message",
					"用户不存在或店面不存在!!!");
		}

		if (openId.equals("") && !userAccount.getWeChatOpenId().equals("")) {
			openId = userAccount.getWeChatOpenId();
		}

		if (userAccount.getMemberCardNo() == null) {
			return new ModelAndView("redirect:/member/memberPage?storeId="
					+ storeId + "&&userId=" + userId + "&&openId=" + openId
					+ "&&isOrdering=true");
		}

		return new ModelAndView("wechat/self");
	}
}

package helen.catering.service;

public class ServiceException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public static final String LOGIN_FAILED = "登录失败。";

	public static final String LOGIN_FAILED_MORE_THAN_ONE = "登录失败，存在多个相同帐号！";

	public static final String NOT_LOGINED = "未登陆";

	public static final String DESK_OCCUPIED = "该台号已有订单，不能开台。";

	public static final String WRONG_DISH_ORDER_STATE = "订单状态已改变，不能执行当前操作";

	public static final String NOT_AUTHORUTY = "权限不足，不能执行当前操作";

	public ServiceException(String message) {
		super(message);
	}
}

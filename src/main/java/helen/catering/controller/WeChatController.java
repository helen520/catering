package helen.catering.controller;

import helen.catering.model.StoreData;
import helen.catering.model.entities.DishOrder;
import helen.catering.service.MessageProcessingHandler;
import helen.catering.service.OrderingService;
import helen.catering.service.ServiceException;
import helen.catering.service.StoreDataService;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.security.MessageDigest;
import java.util.Arrays;

import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("demoWechat")
public class WeChatController {

	private static final Logger logger = LoggerFactory
			.getLogger(WeChatController.class);
	private static final String TOKEN = "token";

	@Autowired
	OrderingService _orderingService;

	@Autowired
	StoreDataService _storeDataService;

	@Autowired
	private MessageProcessingHandler messageHandler;

	@RequestMapping(value = "unisourcewechat", method = RequestMethod.GET)
	public void wechatGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String signature = request.getParameter("signature");
		String timestamp = request.getParameter("timestamp");
		String nonce = request.getParameter("nonce");
		String echostr = request.getParameter("echostr");
		String[] tmpArr = { TOKEN, timestamp, nonce };
		Arrays.sort(tmpArr);
		String tmpStr = this.ArrayToString(tmpArr);
		tmpStr = this.SHA1Encode(tmpStr);
		if (tmpStr.equalsIgnoreCase(signature)) {
			response.getWriter().print(echostr);
		} else {
			response.getWriter().print("error");
		}
	}

	@RequestMapping(value = "unisourcewechat", method = RequestMethod.POST)
	public void wechatPOST(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setCharacterEncoding("UTF-8");
		response.setContentType("text/xml");
		String postStr = null;
		String responseText = "";
		try {
			postStr = this.readStreamParameter(request.getInputStream()); // 微信传来信息进行utf编码
			if (null != postStr && !postStr.isEmpty()) {
				responseText = messageHandler.selectWhichMsgType(postStr);
				response.getWriter().print(responseText);
				response.getWriter().flush();
				response.getWriter().close();
				logger.info("回复微信用户的信息--------------- 字节长 = "
						+ responseText.getBytes("utf-8").length + "\r\n "
						+ responseText + "----------------------\r\n");
			} else {
				// response.getWriter().print("");
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e + "");
		}
	}

	// 转换加密
	// 数组转字符串
	public String ArrayToString(String[] arr) {
		StringBuffer bf = new StringBuffer();
		for (int i = 0; i < arr.length; i++) {
			bf.append(arr[i]);
		}
		return bf.toString();
	}

	// sha1加密
	public String SHA1Encode(String sourceString) {
		String resultString = null;
		try {
			resultString = new String(sourceString);
			MessageDigest md = MessageDigest.getInstance("SHA-1");
			resultString = byte2hexString(md.digest(resultString.getBytes()));
		} catch (Exception ex) {
		}
		return resultString;
	}

	public final String byte2hexString(byte[] bytes) {
		StringBuffer buf = new StringBuffer(bytes.length * 2);
		for (int i = 0; i < bytes.length; i++) {
			if (((int) bytes[i] & 0xff) < 0x10) {
				buf.append("0");
			}
			buf.append(Long.toString((int) bytes[i] & 0xff, 16));
		}
		return buf.toString().toUpperCase();
	}

	public String readStreamParameter(ServletInputStream in) {
		StringBuilder buffer = new StringBuilder();
		BufferedReader reader = null;
		try {
			reader = new BufferedReader(new InputStreamReader(in, "utf-8"));
			String line = null;
			while ((line = reader.readLine()) != null) {
				buffer.append(line);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (null != reader) {
				try {
					reader.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return buffer.toString();
	}

	@ResponseBody
	@RequestMapping("getWechatSelfStoreDataById/{storeId}")
	public StoreData getWechatSelfStoreDataById(@PathVariable long storeId)
			throws ServiceException {
		// TODO filter editable dish
		StoreData sd = _storeDataService.getStoreDataById(storeId);
		return sd;
	}

	@ResponseBody
	@RequestMapping("getDishOrderByOpenId")
	public DishOrder getDishOrderByOpenId(@RequestParam String openId) {
		return _orderingService.getDishOrderByOpenId(openId);
	}

	@ResponseBody
	@RequestMapping("submitDishOrder")
	public DishOrder submitDishOrder(@RequestParam String openId,
			@RequestParam String dishOrderJsonText) throws Exception {
		DishOrder dishOrder = DishOrder.fromJsonText(dishOrderJsonText);

		dishOrder.setDiscountRate(1);
		dishOrder.setServiceFeeRate(0);

		DishOrder resultDishOrder = _orderingService.submitSelfDishOrder(
				openId, dishOrder);
		return resultDishOrder;
	}

}

package helen.catering.service;

import helen.catering.Utils;
import helen.catering.dao.StoreDao;
import helen.catering.dao.UserAccountDao;
import helen.catering.model.CommonMesage;
import helen.catering.model.entities.Store;
import helen.catering.model.entities.UserAccount;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Date;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class MessageProcessingHandler {

	private static final Logger logger = LoggerFactory
			.getLogger(MessageProcessingHandler.class);

	@Autowired
	StoreDao _storeDao;

	@Autowired
	UserAccountDao _userAccountDao;

	public String selectWhichMsgType(String postStr) {
		Document document = null;
		UserAccount user = null;
		CommonMesage msg = null;
		String isay = "";
		try {
			document = DocumentHelper.parseText(postStr);

			if (null == document) {
				return "";
			}
			Element root = document.getRootElement();
			String msgType = root.elementTextTrim("MsgType");
			msg = new CommonMesage(root.elementText("FromUserName"),
					root.elementText("ToUserName"), Integer.parseInt(root
							.elementTextTrim("CreateTime")),
					root.elementTextTrim("MsgType"));
			Store store = _storeDao
					.selectstoreIdForWechat(msg.getToStorename());
			if (store == null) {
				logger.info("selectWhichMsgType   storefront == null");
				return commonResult(msg, "亲,本店正在维护，请稍后使用。");
			}
			user = _userAccountDao
					.getUserAccountByOpenId(msg.getFromUsername());
			if (msgType.equals("text"))// 文本
			{
				if (user == null) {
					return commonResult(msg, "亲,本店正在维护，请稍后使用。");
				}
				return menuListPage(msg, user, store);
				// return commonResult(msg, eventTypeMsg("subscribe", msg,
				// store));

			} else if (msgType.equals("image"))// 图片
			{
				return commonResult(msg, "无法识别");
			} else if (msgType.equals("location"))// 地理
			{
				return commonResult(msg, "无法识别");
			} else if (msgType.equals("link"))// 链接
			{
				return commonResult(msg, "无法识别");
			} else if (msgType.equals("event"))// 事件
			{
				String Event = root.elementText("Event");
				isay = eventTypeMsg(Event, msg, store);
				isay = handler2048Byte(isay);

				return eventTypeMsg("subscribe", msg, store);
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("error", e);
			return commonResult(msg, "系统正在更新，请稍等");
		}
		return commonResult(msg, "无法识别.....");
	}

	private String menuListPage(CommonMesage msg, UserAccount user, Store store)
			throws IOException {

		JSONArray JsonArray = getSortJsonArray(store.getWeChatPicMsg());
		logger.error("menuListPage-->JsonArray", JsonArray);
		String toUser = msg.getFromUsername();
		logger.error("menuListPage-->toUser", toUser);
		String fromUser = msg.getToStorename();
		logger.error("menuListPage-->fromUser", fromUser);
		int articleCount = JsonArray.size() > 6 ? 6 : JsonArray.size();
		logger.error("menuListPage-->articleCount ", articleCount);
		StringBuffer xmlStrBuf = new StringBuffer();

		xmlStrBuf.append("<xml>");
		xmlStrBuf.append("<ToUserName><![CDATA[");
		xmlStrBuf.append(toUser);
		xmlStrBuf.append("]]></ToUserName>");
		xmlStrBuf.append("<FromUserName><![CDATA[");
		xmlStrBuf.append(fromUser);
		xmlStrBuf.append("]]></FromUserName>");
		xmlStrBuf.append("<CreateTime>");
		xmlStrBuf.append(new Date().getTime());
		xmlStrBuf.append("</CreateTime>");
		xmlStrBuf.append("<MsgType><![CDATA[news]]></MsgType>");
		xmlStrBuf.append("<ArticleCount>");
		xmlStrBuf.append(articleCount);
		xmlStrBuf.append("</ArticleCount>");
		xmlStrBuf.append("<Articles>");
		logger.error("menuListPage-->start->xmlStrBuf", xmlStrBuf.toString());

		for (int i = 0; i < articleCount; i++) {
			String titleStr = JsonArray.getJSONObject(i).getString("title");
			logger.error("menuListPage-->titleStr", titleStr);
			long storeId = JsonArray.getJSONObject(i).getLong("storeId");
			logger.error("menuListPage-->storeId", storeId);
			String picUrlStr = JsonArray.getJSONObject(i).getString("picUrl");
			logger.error("menuListPage-->picUrlStr", picUrlStr);
			String url = JsonArray.getJSONObject(i).has("url") ? JsonArray
					.getJSONObject(i).getString("url") : "";
			logger.error("menuListPage-->url", url);
			String description = JsonArray.getJSONObject(i).getString(
					"description");
			logger.error("menuListPage-->description", description);

			StringBuffer itemUrlStrBuf = new StringBuffer();

			if (url != null && url != "") {
				// if (url.contains("http")) {
				// itemUrlStrBuf.append(url);
				// } else {
				itemUrlStrBuf.append(store.getRealmName());
				if (url.contains("{userId}")) {
					url = url.replace("{userId}", String.valueOf(user.getId()));
				}
				if (url.contains("{openId}")) {
					url = url.replace("{openId}",
							String.valueOf(user.getWeChatOpenId()));
				}
				itemUrlStrBuf.append(url);
				// }
			} else {
				itemUrlStrBuf.append(store.getRealmName());
				itemUrlStrBuf.append("/wechat/index.html?userId=");
				itemUrlStrBuf.append(user.getId());
				itemUrlStrBuf.append("&&storeId=");
				itemUrlStrBuf.append(storeId);
			}
			logger.error("menuListPage-->itemUrlStrBuf", itemUrlStrBuf);

			xmlStrBuf.append("<item>");
			xmlStrBuf.append("<Title><![CDATA[");
			xmlStrBuf.append(titleStr);
			xmlStrBuf.append("]]></Title>");
			xmlStrBuf.append("<Description><![CDATA[");
			xmlStrBuf.append(description);
			xmlStrBuf.append("]]></Description>");
			xmlStrBuf.append("<PicUrl><![CDATA[");
			xmlStrBuf.append(picUrlStr);
			xmlStrBuf.append("]]></PicUrl>");
			xmlStrBuf.append("<Url><![CDATA[");
			xmlStrBuf.append(itemUrlStrBuf);
			xmlStrBuf.append("]]></Url>");
			xmlStrBuf.append("</item>");
		}

		xmlStrBuf.append("</Articles>");
		xmlStrBuf.append("<FuncFlag>1</FuncFlag>");
		xmlStrBuf.append("</xml>");
		logger.info("menuListPage-->end->xmlStrBuf", xmlStrBuf.toString());
		return xmlStrBuf.toString();
	}

	private JSONArray getSortJsonArray(String jsonStr) {
		String loggerInfoStr = Utils.getIP() + " getJsonArray";
		logger.info(loggerInfoStr + ",input:jsonStr=" + jsonStr);

		JSONArray jsonArray = null;
		if (jsonStr != null && !jsonStr.equals("")) {
			try {
				jsonStr = URLDecoder.decode(jsonStr, "utf-8");
			} catch (UnsupportedEncodingException e) {
				logger.error("json设置编码出错", e);
			}

			jsonArray = JSONArray.fromObject(jsonStr);

			JSONObject jsonObject = null;
			for (int i = jsonArray.size() - 1; i > 0; --i) {
				for (int j = 0; j < i; ++j) {
					if (jsonArray.getJSONObject(j + 1).getInt("sortKey") < jsonArray
							.getJSONObject(j).getInt("sortKey")) {
						jsonObject = jsonArray.getJSONObject(j);
						jsonArray.set(j, jsonArray.getJSONObject(j + 1));
						jsonArray.set(j + 1, jsonObject);
					}
				}
			}
		}
		logger.info(loggerInfoStr + ",output:jsonArray=" + jsonArray);
		return jsonArray;
	}

	public String commonResult(CommonMesage msg, String isay) {
		String result = "<xml>" + "<ToUserName><![CDATA["
				+ msg.getFromUsername() + "]]></ToUserName>"
				+ "<FromUserName><![CDATA[" + msg.getToStorename()
				+ "]]></FromUserName>" + "<CreateTime>" + new Date().getTime()
				+ "</CreateTime>" + "<MsgType><![CDATA[text]]></MsgType>"
				+ "<Content><![CDATA[" + isay + "]]></Content>"
				+ "<FuncFlag>0</FuncFlag>" + "</xml>";
		return result;
	}

	public String eventTypeMsg(String Event, CommonMesage msg, Store store)
			throws Exception {
		UserAccount user = _userAccountDao.getUserAccountByOpenId(msg
				.getFromUsername());
		if (Event.equals("subscribe")) {
			logger.info("有人关注了您:openID为" + msg.getFromUsername());
			if (user == null) {
				user = new UserAccount();
				user.setCreateTime(System.currentTimeMillis());
				user.setDiscountRate(1);
				user.setStoreId(store.getId());
				user.setWeChatOpenId(msg.getFromUsername());
				_userAccountDao.save(user);
			}
			String isay = menuListPage(msg, user, store);
			return isay;
		} else if (Event.equals("unsubscribe")) {
			logger.info("有人取消关注了:openID为" + msg.getFromUsername());
			return unsubscribeString(msg);
		}
		return "";
	}

	private String unsubscribeString(CommonMesage msg) {
		return "感谢使用。";
	}

	public String handler2048Byte(String isay) {
		try {
			int isayByteLength = isay.getBytes("utf-8").length;
			logger.info("内容字节数为:" + isayByteLength);
			int rear = isay.length();
			while (isayByteLength >= 2048) {
				isayByteLength -= isay.substring(rear - 1, rear).getBytes(
						"utf-8").length;
				rear--;
			}
			if (isay.length() != rear) {
				isay = isay.substring(0, rear - 3);
				isay += "...";
			}
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return isay;
	}
}

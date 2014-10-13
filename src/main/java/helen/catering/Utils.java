package helen.catering;

import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.Collection;
import java.util.Random;

import org.apache.commons.httpclient.Header;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.methods.PostMethod;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.GrantedAuthorityImpl;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

public class Utils {
	public static long generateEntityId() {
		Random ran = new Random();
		return System.currentTimeMillis() * 100 + ran.nextInt(10000);
	}

	public static long generateEntityId(int timeDelta) {

		long id = generateEntityId();
		return id + 10000 * timeDelta;
	}

	public static String getIP() {
		return ((ServletRequestAttributes) RequestContextHolder
				.currentRequestAttributes()).getRequest().getRemoteAddr();
	}

	public static String bytesToString(byte[] bytes) {
		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < bytes.length; i++) {
			sb.append(bytes[i]).append(" ");
		}
		return sb.toString();
	}

	static NumberFormat mAmountFormat;
	static NumberFormat mCurrencyFormat;
	static NumberFormat mPriceFormat;
	static NumberFormat mPriceFormatForceZero;

	public static String formatAmount(double number) {

		if (mAmountFormat == null) {
			NumberFormat nf = NumberFormat.getIntegerInstance();
			nf.setMaximumFractionDigits(1);
			nf.setMinimumFractionDigits(0);
			mAmountFormat = nf;
		}

		return mAmountFormat.format(number);
	}

	public static String formatCurrency(double number) {

		if (mCurrencyFormat == null) {
			NumberFormat nf = NumberFormat.getCurrencyInstance();
			nf.setMaximumFractionDigits(1);
			nf.setMinimumFractionDigits(1);
			mCurrencyFormat = nf;
		}

		return mCurrencyFormat.format(number);
	}

	public static String formatPrice(double number, boolean forceFractionZero) {

		if (forceFractionZero) {
			if (mPriceFormatForceZero == null) {
				NumberFormat nf = NumberFormat.getIntegerInstance();
				nf.setMaximumFractionDigits(1);
				nf.setMinimumFractionDigits(1);
				nf.setGroupingUsed(false);
				mPriceFormatForceZero = nf;
			}

			return mPriceFormatForceZero.format(number);
		} else {
			if (mPriceFormat == null) {
				NumberFormat nf = NumberFormat.getIntegerInstance();
				nf.setMaximumFractionDigits(1);
				nf.setMinimumFractionDigits(0);
				nf.setGroupingUsed(false);
				mPriceFormat = nf;
			}

			return mPriceFormat.format(number);
		}
	}

	public static String formatPercentage(double percent) {

		NumberFormat nf = NumberFormat.getPercentInstance();
		return nf.format(percent);
	}

	public static String formatShortDateTime(Object date) {
		SimpleDateFormat sdf = new SimpleDateFormat("MM-dd HH:mm");
		return sdf.format(date);
	}

	public static String formatShortDateTimeYMD(Object date) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		return sdf.format(date);
	}

	public static String formatShortDateTimeYMDHM(Object date) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		return sdf.format(date);
	}

	public static String formatShortDateTimeHM(Object date) {
		SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
		return sdf.format(date);
	}

	public static String sendMsgReturnCode(String targetTelephone) {
		String code = randomMath();
		String message = "你的验证码为" + code;

		try {
			HttpClient client = new HttpClient();
			PostMethod post = new PostMethod("http://gbk.sms.webchinese.cn");
			post.addRequestHeader("Content-Type",
					"application/x-www-form-urlencoded;charset=gbk");// 在头文件中设置转码
			NameValuePair[] data = { new NameValuePair("Uid", "unisource"),
					new NameValuePair("Key", "2bdee452c875ff3a5b28"),
					new NameValuePair("smsMob", targetTelephone),
					new NameValuePair("smsText", message) };
			post.setRequestBody(data);

			client.executeMethod(post);
			Header[] headers = post.getResponseHeaders();
			int statusCode = post.getStatusCode();
			System.out.println("statusCode:" + statusCode);
			for (Header h : headers) {
				System.out.println(h.toString());
			}
			String result = new String(post.getResponseBodyAsString().getBytes(
					"gbk"));
			System.out.println(result);
			post.releaseConnection();
		} catch (Exception e) {
			System.out.println(e.toString());
		}
		return code;
	}

	public static boolean sendMessage(String targetTelephone, String message) {
		try {
			System.out.println("sending message ~~~~~~~~~~~~");
			HttpClient client = new HttpClient();
			PostMethod post = new PostMethod("http://gbk.sms.webchinese.cn");
			post.addRequestHeader("Content-Type",
					"application/x-www-form-urlencoded;charset=gbk");// 在头文件中设置转码
			NameValuePair[] data = { new NameValuePair("Uid", "unisource"),
					new NameValuePair("Key", "2bdee452c875ff3a5b28"),
					new NameValuePair("smsMob", targetTelephone),
					new NameValuePair("smsText", message) };
			post.setRequestBody(data);

			client.executeMethod(post);
			Header[] headers = post.getResponseHeaders();
			int statusCode = post.getStatusCode();
			System.out.println("statusCode:" + statusCode);
			for (Header h : headers) {
				System.out.println(h.toString());
			}
			String result = new String(post.getResponseBodyAsString().getBytes(
					"gbk"));
			System.out.println(result);
			post.releaseConnection();
		} catch (Exception e) {
			System.out.println(e.toString());
			return false;
		}
		return true;
	}

	private static String randomMath() {
		String result = "";
		for (int i = 0; i < 6; i++) {
			Random random = new Random();
			int figure = random.nextInt(10);
			result = result + figure;
		}
		return result;
	}

	/**
	 * 判断当前登录用户是否有角色权限
	 * 
	 * @param role
	 *            角色
	 * @return true/false
	 */
	public static boolean hasRole(String role) {
		Collection<? extends GrantedAuthority> authorities = SecurityContextHolder
				.getContext().getAuthentication().getAuthorities();
		return authorities.contains(new GrantedAuthorityImpl(role));
	}
}

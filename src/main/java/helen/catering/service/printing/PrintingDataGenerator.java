package helen.catering.service.printing;

import helen.catering.Utils;
import helen.catering.model.FinanceStat;
import helen.catering.model.PaymentStat;
import helen.catering.model.SetMeal;
import helen.catering.model.entities.DishOrder;
import helen.catering.model.entities.Employee;
import helen.catering.model.entities.OrderItem;
import helen.catering.model.entities.PayRecord;
import helen.catering.model.entities.PosPrinter;
import helen.catering.model.entities.Store;
import helen.catering.model.entities.UserAccount;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.DateFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.map.ObjectMapper;

public class PrintingDataGenerator {

	static Comparator<OrderItem> orderItemComparetor = new Comparator<OrderItem>() {
		public int compare(OrderItem object1, OrderItem object2) {
			Long ct1 = object1.getCreateTime();
			Long ct2 = object2.getCreateTime();
			return ct1.compareTo(ct2);
		}
	};

	final static byte[] resetCommand = new byte[] { 0x1B, 0x40 };
	final static byte[] newLineCommand = new byte[] { 0x0A };
	final static byte[] boldFontCommand = new byte[] { 0x1B, 0x21, 0x08 };
	final static byte[] doubleHeightFontCommand = new byte[] { 0x1B, 0x21,
			0x10, 0x1C, 0x21, 0x08, 0x1D, 0x21, 0x1 };
	final static byte[] doubleSizeFontCommand = new byte[] { 0x1B, 0x21, 0x30,
			0x1C, 0x21, 0x0C, 0x1D, 0x21, 0x11 };
	final static byte[] doubleSizeAndBoldFontCommand = new byte[] { 0x1B, 0x21,
			0x38, 0x1C, 0x21, 0x0C, 0x1D, 0x21, 0x11 };
	final static byte[] normalFontCommand = new byte[] { 0x1B, 0x21, 0x0, 0x1C,
			0x21, 0x0, 0x1D, 0x21, 0x0 };
	final static byte[] cutPaperCommand = new byte[] { 0x1D, 0x56, 0x00 };

	final static byte[] beepCommand = new byte[] { 0x1B, 0x43, 0x01, 0x12, 0x01 };

	private static boolean isChinese(char c) {
		Character.UnicodeBlock ub = Character.UnicodeBlock.of(c);
		if (ub == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS
				|| ub == Character.UnicodeBlock.CJK_COMPATIBILITY_IDEOGRAPHS
				|| ub == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS_EXTENSION_A
				|| ub == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS_EXTENSION_B
				|| ub == Character.UnicodeBlock.CJK_SYMBOLS_AND_PUNCTUATION
				|| ub == Character.UnicodeBlock.HALFWIDTH_AND_FULLWIDTH_FORMS
				|| ub == Character.UnicodeBlock.GENERAL_PUNCTUATION) {
			return true;
		}

		return false;
	}

	private static int getPrintingLength(String text) {
		int printingLength = 0;

		char[] textChars = text.toCharArray();
		for (char c : textChars) {
			if (isChinese(c)) {
				printingLength += 2;
			} else {
				printingLength += 1;
			}
		}

		return printingLength;
	}

	private static String padLeftTo(String text, int targetPrintingLength) {
		int printingLength = getPrintingLength(text);

		StringBuilder sb = new StringBuilder();
		for (int i = printingLength; i < targetPrintingLength; i++) {
			sb.append(' ');
		}
		sb.append(text);

		return sb.toString();
	}

	private static String padRightTo(String text, int targetPrintingLength) {
		int printingLength = getPrintingLength(text);

		StringBuilder sb = new StringBuilder(text);
		for (int i = printingLength; i < targetPrintingLength; i++) {
			sb.append(' ');
		}

		return sb.toString();
	}

	private static String padSidesTo(String text, int targetPrintingLength) {
		int printingLength = getPrintingLength(text);

		int leftToPad = (targetPrintingLength - printingLength) / 2;
		int rightToPad = targetPrintingLength - printingLength - leftToPad;

		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < leftToPad; i++) {
			sb.append(' ');
		}
		sb.append(text);
		for (int i = 0; i < rightToPad; i++) {
			sb.append(' ');
		}

		return sb.toString();
	}

	private static String getDoubleSplitLine(int length) {
		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < length; i++) {
			sb.append('=');
		}

		return sb.toString();
	}

	private static String getSingleSplitLine(int length) {
		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < length; i++) {
			sb.append('-');
		}

		return sb.toString();
	}

	private static void alignLeft(ByteArrayOutputStream outStream,
			int charsPerLine, String text1, String text2) throws Exception {

		outStream.write(text1.getBytes("GB2312"));
		int text1Length = getPrintingLength(text1);
		int text2Length = getPrintingLength(text2);
		if (text1Length + text2Length > charsPerLine) {
			outStream.write(newLineCommand);
		}
		outStream.write(text2.getBytes("GB2312"));
		outStream.write(newLineCommand);
	}

	private static void alignSides(ByteArrayOutputStream outStream,
			int charsPerLine, String leftText, String rightText,
			boolean doubleLeftFontSize) throws Exception {

		if (doubleLeftFontSize) {
			outStream.write(doubleSizeFontCommand);
		}
		outStream.write(leftText.getBytes("GB2312"));
		outStream.write(normalFontCommand);

		int leftLength = getPrintingLength(leftText);
		if (doubleLeftFontSize) {
			leftLength *= 2;
		}
		int rightLength = getPrintingLength(rightText);

		if (leftLength + rightLength > charsPerLine) {
			outStream.write(newLineCommand);
			rightText = padLeftTo(rightText, charsPerLine);
		} else {
			rightText = padLeftTo(rightText, charsPerLine - leftLength);
		}
		outStream.write(rightText.getBytes("GB2312"));
		outStream.write(newLineCommand);
	}

	private static byte[] getDishOrderHeaderDataPacket(Employee operator,
			PosPrinter posPrinter, DishOrder dishOrder, int curIndex,
			int totalCount, boolean isCookingNote) throws Exception {

		ByteArrayOutputStream outStream = new java.io.ByteArrayOutputStream();
		int charsPerLine = posPrinter.getCharactersPerLine();

		for (int i = 0; i < posPrinter.getHeaderEmptyLines(); i++) {
			outStream.write(newLineCommand);
		}

		String line;
		outStream.write(normalFontCommand);
		if (isCookingNote) {
			line = "做菜单";
		} else {
			line = "传菜单";
		}

		line = padSidesTo(line, charsPerLine);
		outStream.write(line.getBytes("GB2312"));

		outStream.write(newLineCommand);
		outStream.write(getDoubleSplitLine(charsPerLine).getBytes("GB2312"));
		outStream.write(newLineCommand);

		String seqString = "";
		if (totalCount > 0)
			seqString = "[" + curIndex + "/" + totalCount + "]";
		outStream.write(doubleSizeAndBoldFontCommand);
		outStream.write(dishOrder.getDeskName().getBytes("GB2312"));
		outStream.write(seqString.getBytes("GB2312"));
		outStream.write(newLineCommand);

		if (isCookingNote && dishOrder.getTagText().length() > 0) {
			String dishOrderTagStr = '(' + dishOrder.getTagText() + ')';
			outStream.write(dishOrderTagStr.getBytes("GB2312"));
			outStream.write(newLineCommand);
		}

		outStream.write(normalFontCommand);

		String text1 = "人数:" + dishOrder.getCustomerCount();
		text1 = padRightTo(text1, 8) + ' ';
		String text2 = "单号:" + String.valueOf(dishOrder.getId());
		alignLeft(outStream, charsPerLine, text1, text2);

		text1 = "操作:" + operator.getName();
		text1 = padRightTo(text1, 13) + ' ';
		text2 = Utils.formatShortDateTime(new Date());
		alignLeft(outStream, charsPerLine, text1, text2);

		if (dishOrder.getExpectedArriveTime() != null) {
			outStream.write(newLineCommand);
			outStream.write(boldFontCommand);
			text1 = "到店时间:"
					+ Utils.formatShortDateTime(dishOrder
							.getExpectedArriveTime());
			outStream.write(text1.getBytes("GB2312"));
			outStream.write(newLineCommand);
		}

		outStream.write(getDoubleSplitLine(charsPerLine).getBytes("GB2312"));

		return outStream.toByteArray();
	}

	public static byte[] getOpenCashBoxDataPacket() throws IOException {
		return new byte[] { 0x1B, 0x40, 0x1B, 0x70, 0x0, 0x32, (byte) 0xC8 };
	}

	public static byte[] getCheckoutBillDataPacket(PosPrinter posPrinter,
			Store store, Employee employee, DishOrder dishOrder,
			UserAccount user, boolean isPrePrint) throws Exception {

		if (posPrinter == null) {
			return new byte[0];
		}

		String storeName = "";
		if (store != null) {
			storeName = store.getName();
		}

		int charsPerLine = posPrinter.getCharactersPerLine();
		charsPerLine = charsPerLine < 25 ? 25 : charsPerLine;

		ByteArrayOutputStream outStream = new java.io.ByteArrayOutputStream();

		outStream.write(resetCommand);
		for (int i = 0; i < posPrinter.getHeaderEmptyLines(); i++) {
			outStream.write(newLineCommand);
		}

		String line;
		outStream.write(normalFontCommand);
		if (isPrePrint) {
			line = "预打结账单";
		} else {
			line = "结账单";
		}

		line = padSidesTo(line, charsPerLine);
		outStream.write(line.getBytes("GB2312"));

		outStream.write(newLineCommand);
		outStream.write(getDoubleSplitLine(charsPerLine).getBytes("GB2312"));
		outStream.write(newLineCommand);

		outStream.write(doubleSizeAndBoldFontCommand);
		outStream.write(storeName.getBytes("GB2312"));
		outStream.write(newLineCommand);
		outStream.write(normalFontCommand);
		outStream.write(newLineCommand);

		outStream.write(newLineCommand);
		outStream.write(doubleSizeFontCommand);
		line = "桌号:" + dishOrder.getDeskName();
		outStream.write(line.getBytes("GB2312"));
		outStream.write(newLineCommand);

		outStream.write(normalFontCommand);
		String text1 = "开台:"
				+ Utils.formatShortDateTime(new Date(dishOrder.getCreateTime()))
				+ "  ";
		String text2 = "打单:" + Utils.formatShortDateTime(new Date());
		alignLeft(outStream, charsPerLine, text1, text2);

		text1 = "收银:";
		if (employee != null) {
			text1 += employee.getName();
		}
		text1 = padRightTo(text1, 13) + ' ';
		text2 = "人数:" + dishOrder.getCustomerCount();

		alignLeft(outStream, charsPerLine, text1, text2);

		line = "单号:" + dishOrder.getId();
		if (dishOrder.getSerialNumber() != null
				&& dishOrder.getSerialNumber().length() > 0) {
			line += "/" + dishOrder.getSerialNumber();
		}
		outStream.write(line.getBytes("GB2312"));
		outStream.write(newLineCommand);

		outStream.write(getDoubleSplitLine(charsPerLine).getBytes("GB2312"));
		outStream.write(newLineCommand);

		line = " 单价  " + "  数量 " + " 价格";
		line = padLeftTo(line, charsPerLine - 1);
		outStream.write(line.getBytes("GB2312"));

		outStream.write(newLineCommand);
		outStream.write(getSingleSplitLine(charsPerLine).getBytes("GB2312"));
		outStream.write(newLineCommand);

		ObjectMapper objectMapper = new ObjectMapper();
		String jsonDishOrder = objectMapper.writeValueAsString(dishOrder);
		DishOrder copyDishOrder = objectMapper.reader(DishOrder.class)
				.readValue(jsonDishOrder);

		List<OrderItem> orderItemList = copyDishOrder.getOrderItems();
		List<OrderItem> orderItems = new ArrayList<OrderItem>();
		List<OrderItem> printOrderItemList = new ArrayList<OrderItem>();
		List<OrderItem> setMealOrderItemList = new ArrayList<OrderItem>();

		Map<Long, SetMeal> setMealListByTriggerIdMap = new HashMap<Long, SetMeal>();

		for (int i = 0; i < orderItemList.size(); i++) {
			OrderItem orderItem = orderItemList.get(i);

			for (int j = orderItemList.size() - 1; j > i; j--) {
				OrderItem oi = orderItemList.get(j);

				if (orderItem.getDishId() == oi.getDishId()) {
					if (checkIsSameOrderItem(orderItem, oi)) {
						orderItem.setAmount(orderItem.getAmount()
								+ oi.getAmount());
						orderItem
								.setPrice(orderItem.getPrice() + oi.getPrice());
						orderItemList.remove(oi);
					}
				}
			}
			orderItems.add(orderItem);
		}

		while (orderItems.size() > 0) {
			OrderItem orderItem = orderItems.remove(0);

			if (orderItem.getState() == OrderItem.STATE_CANCELLED) {
				continue;
			}
			if (!setMealListByTriggerIdMap.containsKey(orderItem.getId())
					&& orderItem.getHasMealDealItems()) {
				SetMeal setMeal = new SetMeal();
				setMeal.setSetMealId(orderItem.getId());
				setMeal.setSetMealName(orderItem.getDishName());
				setMealListByTriggerIdMap.put(orderItem.getId(), setMeal);
			}

			if (orderItem.getTriggerId() != null) {
				setMealOrderItemList.add(orderItem);
			} else {
				printOrderItemList.add(orderItem);
			}
		}

		while (setMealOrderItemList.size() > 0) {
			OrderItem orderItem = setMealOrderItemList.remove(0);
			if (setMealListByTriggerIdMap.containsKey(orderItem.getTriggerId())) {
				SetMeal setMeal = setMealListByTriggerIdMap.get(orderItem
						.getTriggerId());
				setMeal.getSetMealOrderItems().add(orderItem);
			}
		}

		int index = 1;
		for (OrderItem orderItem : printOrderItemList) {

			String leftText = String.valueOf(index++) + '.'
					+ orderItem.getPrintingDishName() + ' ';

			if (orderItem.getNoOverallDiscount()) {
				leftText += "*";
			}

			if (index <= 10) {
				leftText = ' ' + leftText;
			}

			String dishPriceText = Utils.formatPrice(orderItem.getDishPrice(),
					true) + ' ';
			dishPriceText = padLeftTo(dishPriceText, 6);
			String amountAndUnitText = Utils
					.formatAmount(orderItem.getAmount())
					+ orderItem.getUnit()
					+ ' ';
			amountAndUnitText = padLeftTo(amountAndUnitText, 7);
			String priceText = Utils.formatPrice(orderItem.getPrice(), true);
			priceText = padLeftTo(priceText, 6);

			String rightText = dishPriceText + amountAndUnitText + priceText;

			alignSides(outStream, charsPerLine, leftText, rightText,
					store.getIsDoubleSizeFont());

			if (orderItem.getHasMealDealItems()) {
				for (OrderItem setMealOrderItem : setMealListByTriggerIdMap
						.get(orderItem.getId()).getSetMealOrderItems()) {
					setMealOrderItemStrInOutputStream(outStream, charsPerLine,
							setMealOrderItem);
				}
			}

			if (orderItem.getMemo() != null && orderItem.getMemo() != "") {
				alignSides(outStream, charsPerLine, orderItem.getMemo(), " ",
						false);
			}
		}

		outStream.write(normalFontCommand);
		outStream.write(getDoubleSplitLine(charsPerLine).getBytes("GB2312"));
		outStream.write(newLineCommand);

		if (dishOrder.getTotalPrice() != dishOrder.getFinalPrice()) {
			String totalPriceText = Utils.formatPrice(
					dishOrder.getTotalPrice(), true);
			line = "消费:    " + padLeftTo(totalPriceText, 6);
			outStream.write(line.getBytes("GB2312"));
			outStream.write(newLineCommand);

			double totalDiscount = dishOrder.getTotalPrice()
					- dishOrder.getDiscountedPrice();
			if (totalDiscount > 0) {
				line = "折扣率:  "
						+ padLeftTo("" + dishOrder.getDiscountRate(), 6);
				outStream.write(line.getBytes("GB2312"));
				outStream.write(newLineCommand);

				String totalDiscountText = '-' + Utils.formatPrice(
						totalDiscount, true);
				line = "折扣金额:" + padLeftTo(totalDiscountText, 6);
				outStream.write(line.getBytes("GB2312"));
				outStream.write(newLineCommand);
			}

			if (dishOrder.getServiceFee() > 0) {
				String serviceFeeText = Utils.formatPrice(
						dishOrder.getServiceFee(), true);
				line = "服务费:  " + padLeftTo(serviceFeeText, 6);
				outStream.write(line.getBytes("GB2312"));
				outStream.write(newLineCommand);
			}

			if ((dishOrder.getPayRecords() == null || dishOrder.getPayRecords()
					.size() <= 0)
					&& dishOrder.getPrePay() != null
					&& dishOrder.getPrePay() > 0) {
				line = "预付款: " + padLeftTo(dishOrder.getPrePay() + "", 6);
				outStream.write(line.getBytes("GB2312"));
				outStream.write(newLineCommand);
			}
		}

		outStream.write(doubleSizeAndBoldFontCommand);
		String finalPriceText = Utils.formatPrice(dishOrder.getFinalPrice(),
				true);
		finalPriceText = "合计:" + finalPriceText;
		finalPriceText = padLeftTo(finalPriceText, charsPerLine / 2);
		outStream.write(finalPriceText.getBytes("GB2312"));
		outStream.write(newLineCommand);
		outStream.write(normalFontCommand);

		double actualPaid = 0;
		if (dishOrder.getPayRecords().size() > 0) {
			outStream
					.write(getSingleSplitLine(charsPerLine).getBytes("GB2312"));
			outStream.write(newLineCommand);

			for (PayRecord pr : dishOrder.getPayRecords()) {
				line = padRightTo(pr.getTypeName() + ':', 6);
				outStream.write(line.getBytes("GB2312"));
				line = Utils.formatPrice(pr.getAmount(), true);
				line = padLeftTo(line, 8);
				outStream.write(line.getBytes("GB2312"));
				outStream.write(newLineCommand);

				actualPaid += pr.getAmount();
			}

			line = Utils.formatPrice(actualPaid, true);
			line = "实收:" + line;
			line = padLeftTo(line, charsPerLine / 2);
			outStream.write(doubleSizeAndBoldFontCommand);
			outStream.write(line.getBytes("GB2312"));
			outStream.write(newLineCommand);
			outStream.write(normalFontCommand);
		}

		if (!isPrePrint && user != null) {
			line = "  账户余额:" + user.getBalance();
			outStream.write(line.getBytes("GB2312"));
			outStream.write(newLineCommand);
		}

		if (dishOrder.getMemo() != null && dishOrder.getMemo().length() > 0) {
			outStream.write(newLineCommand);
			outStream.write(newLineCommand);
			outStream.write("  备注:".getBytes("GB2312"));
			outStream.write(dishOrder.getMemo().getBytes("GB2312"));
		}

		if (store != null && store.getStoreActivity() != null
				&& !store.getStoreActivity().equals("")) {
			outStream.write(newLineCommand);
			outStream.write("  店内活动:".getBytes("GB2312"));
			outStream.write(newLineCommand);
			outStream.write(store.getStoreActivity().getBytes("GB2312"));
		}

		for (int i = 0; i < posPrinter.getTailEmptyLines(); i++) {
			outStream.write(newLineCommand);
		}

		for (int i = 0; i < 8; i++) {
			outStream.write(newLineCommand);
		}

		outStream.write(cutPaperCommand);
		return outStream.toByteArray();
	}

	private static boolean checkIsSameOrderItem(OrderItem orderItem,
			OrderItem oi) {

		long oiId = oi.getId();
		double oiAmount = oi.getAmount();
		double oiPrice = oi.getPrice();
		long oiCreateTime = oi.getCreateTime();
		Long oiEmployeeId = null;
		if (oi.getEmployeeId() != null) {
			oiEmployeeId = oi.getEmployeeId();
		}

		oi.setId(orderItem.getId());
		oi.setAmount(orderItem.getAmount());
		oi.setPrice(orderItem.getPrice());
		oi.setCreateTime(orderItem.getCreateTime());
		if (orderItem.getEmployeeId() != null) {
			oi.setEmployeeId(orderItem.getEmployeeId());
		} else {
			oi.setEmployeeId(null);
		}

		ObjectMapper om = new ObjectMapper();
		org.getopt.util.hash.FNV164 fnv1 = new org.getopt.util.hash.FNV164();
		org.getopt.util.hash.FNV164 fnv2 = new org.getopt.util.hash.FNV164();
		try {
			byte[] jsonBytes = om.writeValueAsBytes(orderItem);
			fnv1.init(jsonBytes, 0, jsonBytes.length);
			String str1 = String.valueOf(fnv1.getHash());

			byte[] jsonBytes2 = om.writeValueAsBytes(oi);
			fnv2.init(jsonBytes2, 0, jsonBytes2.length);
			String str2 = String.valueOf(fnv2.getHash());

			oi.setId(oiId);
			oi.setAmount(oiAmount);
			oi.setPrice(oiPrice);
			oi.setCreateTime(oiCreateTime);
			oi.setEmployeeId(oiEmployeeId);
			if (str1.equals(str2)) {
				return true;
			} else
				return false;
		} catch (Exception e) {
			return false;
		}
	}

	public static void setMealOrderItemStrInOutputStream(
			ByteArrayOutputStream outStream, int charsPerLine,
			OrderItem orderItem) throws Exception {
		String setMealOrderItemStr = padLeftTo(
				"--" + orderItem.getPrintingDishName(), 6);
		if (orderItem.getPrice() > 0) {
			setMealOrderItemStr += padLeftTo(
					Double.toString(orderItem.getPrice()), 3);
		}
		alignSides(outStream, charsPerLine, setMealOrderItemStr, " ", false);
	}

	public static byte[] getCustomerNoteDataPacket(PosPrinter posPrinter,
			Employee employee, Store store, DishOrder dishOrder,
			List<OrderItem> orderItems) throws Exception {
		if (posPrinter == null) {
			return new byte[0];
		}

		String storeName = "";
		if (store != null) {
			storeName = store.getName();
		}

		int charsPerLine = posPrinter.getCharactersPerLine();
		charsPerLine = charsPerLine < 25 ? 25 : charsPerLine;

		ByteArrayOutputStream outStream = new java.io.ByteArrayOutputStream();

		outStream.write(resetCommand);
		for (int i = 0; i < posPrinter.getHeaderEmptyLines(); i++) {
			outStream.write(newLineCommand);
		}

		outStream.write(normalFontCommand);
		String line = padSidesTo("楼面单", charsPerLine);
		outStream.write(line.getBytes("GB2312"));

		outStream.write(newLineCommand);
		outStream.write(getDoubleSplitLine(charsPerLine).getBytes("GB2312"));
		outStream.write(newLineCommand);

		outStream.write(doubleSizeAndBoldFontCommand);
		outStream.write(storeName.getBytes("GB2312"));
		outStream.write(newLineCommand);

		outStream.write(newLineCommand);
		outStream.write(doubleSizeFontCommand);
		line = "桌号:" + dishOrder.getDeskName();
		outStream.write(line.getBytes("GB2312"));
		outStream.write(newLineCommand);

		outStream.write(normalFontCommand);
		String text1 = "开台:"
				+ Utils.formatShortDateTime(new Date(dishOrder.getCreateTime()))
				+ "  ";
		String text2 = "打单:" + Utils.formatShortDateTime(new Date());
		alignLeft(outStream, charsPerLine, text1, text2);

		text1 = "开台人:";
		if (employee != null) {
			text1 += employee.getName();
		}
		text1 = padRightTo(text1, 13) + ' ';
		text2 = "人数:" + dishOrder.getCustomerCount();

		alignLeft(outStream, charsPerLine, text1, text2);

		line = "单号:" + dishOrder.getId();
		if (dishOrder.getSerialNumber() != null
				&& dishOrder.getSerialNumber().length() > 0) {
			line += "/" + dishOrder.getSerialNumber();
		}
		outStream.write(line.getBytes("GB2312"));
		outStream.write(newLineCommand);

		outStream.write(getDoubleSplitLine(charsPerLine).getBytes("GB2312"));
		outStream.write(newLineCommand);

		if (store.getNoShowPriceInCustomerNote()) {
			line = "  数量 ";
		} else
			line = " 单价  " + "  数量 " + " 价格";

		line = padLeftTo(line, charsPerLine - 1);
		outStream.write(line.getBytes("GB2312"));

		outStream.write(newLineCommand);
		outStream.write(getSingleSplitLine(charsPerLine).getBytes("GB2312"));
		outStream.write(newLineCommand);

		int index = 1;
		double totalPrice = 0;
		for (OrderItem orderItem : orderItems) {

			if (orderItem.getTriggerId() != null) {
				setMealOrderItemStrInOutputStream(outStream, charsPerLine,
						orderItem);
			} else {

				double price = orderItem.getPrice();

				String leftText = String.valueOf(index++) + '.';
				if (orderItem.isSuspended()) {
					leftText += "!!叫起!!";
				}

				if (orderItem.getState() == OrderItem.STATE_CANCELLED) {
					price = 0;
					leftText += "(取消)";
				}

				totalPrice += price;

				leftText += orderItem.getPrintingDishName() + ' ';

				if (orderItem.getOrderItemTags() != null
						&& orderItem.getOrderItemTags().size() > 0) {
					leftText += "(" + orderItem.getTagText() + ")";
				}

				if (index <= 10) {
					leftText = ' ' + leftText;
				}

				String dishPriceText = Utils.formatPrice(
						orderItem.getDishPrice(), true) + ' ';
				dishPriceText = padLeftTo(dishPriceText, 6);
				String amountAndUnitText = Utils.formatAmount(orderItem
						.getAmount()) + orderItem.getUnit() + ' ';
				amountAndUnitText = padLeftTo(amountAndUnitText, 7);
				String priceText = Utils.formatPrice(price, true);
				priceText = padLeftTo(priceText, 6);

				String rightText = dishPriceText + amountAndUnitText
						+ priceText;
				if (store.getNoShowPriceInCustomerNote())
					rightText = amountAndUnitText;

				alignSides(outStream, charsPerLine, leftText, rightText, true);
			}
		}

		outStream.write(normalFontCommand);
		outStream.write(getDoubleSplitLine(charsPerLine).getBytes("GB2312"));
		outStream.write(newLineCommand);

		if (!store.getNoShowPriceInCustomerNote()) {

			outStream.write(doubleSizeAndBoldFontCommand);
			String totalPriceText = Utils.formatPrice(totalPrice, true);
			totalPriceText = "合计:" + totalPriceText;
			totalPriceText = padLeftTo(totalPriceText, charsPerLine / 2);
			outStream.write(totalPriceText.getBytes("GB2312"));
			outStream.write(newLineCommand);
			outStream.write(normalFontCommand);
		}

		for (int i = 0; i < posPrinter.getTailEmptyLines(); i++) {
			outStream.write(newLineCommand);
		}

		outStream.write(cutPaperCommand);

		return outStream.toByteArray();
	}

	public static byte[] getDeliveryNoteDataPacket(PosPrinter posPrinter,
			Store store, Employee operator, DishOrder dishOrder,
			List<OrderItem> orderItemList) throws Exception {
		ByteArrayOutputStream outStream = new java.io.ByteArrayOutputStream();

		outStream.write(resetCommand);

		byte[] dishOrderHeaderDataPacket = PrintingDataGenerator
				.getDishOrderHeaderDataPacket(operator, posPrinter, dishOrder,
						0, 0, false);
		outStream.write(dishOrderHeaderDataPacket);

		for (OrderItem orderItem : orderItemList) {
			if (orderItem.getNoCookingNote()) {
				continue;
			}

			byte[] orderItemDataPacket = PrintingDataGenerator
					.getOrderItemDataPacket(posPrinter.getCharactersPerLine(),
							dishOrder, orderItem, null);
			outStream.write(orderItemDataPacket);
		}

		for (int i = 0; i < posPrinter.getTailEmptyLines(); i++) {
			outStream.write(newLineCommand);
		}
		outStream.write(cutPaperCommand);
		if (posPrinter.isBeep()) {
			outStream.write(beepCommand);
		}
		return outStream.toByteArray();
	}

	public static byte[] getCookingNoteDataPacket(Employee operator,
			PosPrinter posPrinter, DishOrder dishOrder,
			List<OrderItem> orderItemList, Store store,
			HashMap<Long, String> setMealNameListByTriggerIdMap, boolean slice,
			int curCookingNoteIndex, int totalCookingNoteCount)
			throws Exception {

		ByteArrayOutputStream outStream = new java.io.ByteArrayOutputStream();

		outStream.write(resetCommand);
		if (!slice) {
			byte[] dishOrderHeaderDataPacket = getDishOrderHeaderDataPacket(
					operator, posPrinter, dishOrder, 0, 0, true);
			outStream.write(dishOrderHeaderDataPacket);
		}
		for (OrderItem orderItem : orderItemList) {
			if (orderItem.getNoCookingNote()) {
				continue;
			}

			if (slice) {
				byte[] dishOrderHeaderDataPacket = PrintingDataGenerator
						.getDishOrderHeaderDataPacket(operator, posPrinter,
								dishOrder, curCookingNoteIndex,
								totalCookingNoteCount, true);
				outStream.write(dishOrderHeaderDataPacket);
			}

			long triggerId = orderItem.getTriggerId() != null ? orderItem
					.getTriggerId() : -1;
			String setMealName = setMealNameListByTriggerIdMap
					.containsKey(triggerId) ? setMealNameListByTriggerIdMap
					.get(triggerId) : null;
			byte[] orderItemDataPacket = getOrderItemDataPacket(
					posPrinter.getCharactersPerLine(), dishOrder, orderItem,
					setMealName);
			outStream.write(orderItemDataPacket);

			if (slice) {
				for (int i = 0; i < posPrinter.getTailEmptyLines(); i++) {
					outStream.write(newLineCommand);
				}
				outStream.write(cutPaperCommand);
			}
		}
		if (!slice) {
			for (int i = 0; i < posPrinter.getTailEmptyLines(); i++) {
				outStream.write(newLineCommand);
			}
			outStream.write(cutPaperCommand);
		}
		if (posPrinter.isBeep()) {
			outStream.write(beepCommand);
		}

		return outStream.toByteArray();
	}

	public static byte[] getOrderItemDataPacket(int charsPerLine,
			DishOrder dishOrder, OrderItem orderItem, String setMealName)
			throws IOException {

		ByteArrayOutputStream outStream = new java.io.ByteArrayOutputStream();

		outStream.write(normalFontCommand);
		outStream.write(newLineCommand);

		outStream.write(doubleSizeFontCommand);

		if (setMealName != null) {
			outStream.write(newLineCommand);
			String setMealNameStr = "(" + setMealName + ")";
			outStream.write(setMealNameStr.getBytes("GB2312"));
			outStream.write(newLineCommand);
		}

		if (orderItem.isSuspended()) {
			outStream.write(newLineCommand);
			outStream.write("!!!叫起!!!".getBytes("GB2312"));
			outStream.write(newLineCommand);
			outStream.write(newLineCommand);
		}
		if (orderItem.getNoCooking()) {
			outStream.write(newLineCommand);
			outStream.write("!!!免做!!!".getBytes("GB2312"));
			outStream.write(newLineCommand);
			outStream.write(newLineCommand);
		}

		outStream.write(newLineCommand);
		String line = "[" + Utils.formatAmount(orderItem.getAmount())
				+ orderItem.getUnit() + "]" + orderItem.getPrintingDishName();
		outStream.write(line.getBytes("GB2312"));

		if (orderItem.getOrderItemTags() != null
				&& orderItem.getOrderItemTags().size() > 0) {
			outStream.write(newLineCommand);
			outStream.write(doubleHeightFontCommand);
			line = '(' + orderItem.getTagText() + ')';
			outStream.write(line.getBytes("GB2312"));
		}

		outStream.write(normalFontCommand);
		outStream.write(newLineCommand);

		outStream.write(getDoubleSplitLine(charsPerLine).getBytes("GB2312"));
		outStream.write(newLineCommand);

		return outStream.toByteArray();
	}

	public static byte[] getRePrintToKitchenPacket(Employee operator,
			Employee employee, Store store, DishOrder mDishOrder,
			List<OrderItem> oiList, String deskName) throws IOException {

		ByteArrayOutputStream outStream = new java.io.ByteArrayOutputStream();

		outStream.write(doubleSizeAndBoldFontCommand);

		String line = mDishOrder.getDeskName();
		line = "[" + deskName + "]转[" + line + "]";
		outStream.write(line.getBytes("GB2312"));
		outStream.write(normalFontCommand);
		outStream.write(newLineCommand);

		String customerCountHintText = "";
		if (store != null) {
			customerCountHintText = store.getCustomerCountHintText();
		}
		line = mDishOrder.getCustomerCount() + customerCountHintText + "  ";
		if (employee != null) {
			line += " 开台人:" + employee.getName() + "  ";
		}
		outStream.write(line.getBytes("GB2312"));
		outStream.write(newLineCommand);

		DateFormat dateFm = DateFormat.getDateTimeInstance(DateFormat.SHORT,
				DateFormat.SHORT);
		line = "开台时间" + dateFm.format(new Date(mDishOrder.getCreateTime()));
		outStream.write(line.getBytes("GB2312"));
		outStream.write(newLineCommand);
		line = "打单时间" + dateFm.format(new Date(System.currentTimeMillis()));
		outStream.write(line.getBytes("GB2312"));
		outStream.write(newLineCommand);

		line = "================" + operator.getName();
		outStream.write(line.getBytes("GB2312"));
		outStream.write(newLineCommand);

		outStream.write(doubleHeightFontCommand);

		line = "";
		if (oiList.size() > 0) {
			for (OrderItem oi : oiList) {
				if (oi.getNoCookingNote()) {
					continue;
				}
				line += oi.getDishName();
				if (oiList.indexOf(oi) < oiList.size() - 1) {
					line += " , ";
				}
			}
		}
		outStream.write(line.getBytes("GB2312"));
		outStream.write(normalFontCommand);
		outStream.write(newLineCommand);

		line = "-----------------------";
		outStream.write(line.getBytes("GB2312"));
		outStream.write(newLineCommand);

		for (int i = 0; i < 5; i++) {
			outStream.write(newLineCommand);
		}
		outStream.write(cutPaperCommand);

		return outStream.toByteArray();
	}

	public static byte[] getCancelOrderItemDataPacket(Employee operator,
			PosPrinter posPrinter, DishOrder dishOrder, OrderItem orderItem,
			boolean isCookingNote) throws Exception {

		ByteArrayOutputStream outStream = new java.io.ByteArrayOutputStream();

		outStream.write(getDishOrderHeaderDataPacket(operator, posPrinter,
				dishOrder, 0, 0, isCookingNote));
		outStream.write(doubleSizeAndBoldFontCommand);
		outStream.write("!!!取消!!!".getBytes("GB2312"));
		outStream.write(newLineCommand);
		outStream.write(getOrderItemDataPacket(
				posPrinter.getCharactersPerLine(), dishOrder, orderItem, null));

		for (int i = 0; i < posPrinter.getTailEmptyLines(); i++) {
			outStream.write(newLineCommand);
		}
		outStream.write(cutPaperCommand);

		return outStream.toByteArray();
	}

	public static byte[] getShiftClassReportPacket(FinanceStat financeStat,
			PosPrinter posPrinter, Store store, Employee operator)
			throws IOException {

		ByteArrayOutputStream outStream = new java.io.ByteArrayOutputStream();

		String storefrontName = "";

		if (store != null) {
			storefrontName = store.getName();
		}

		String line = storefrontName;
		for (int i = 0; i < posPrinter.getHeaderEmptyLines(); i++) {
			outStream.write(newLineCommand);
		}
		outStream.write(doubleSizeFontCommand);
		outStream.write(line.getBytes("GB2312"));
		outStream.write(newLineCommand);
		outStream.write(newLineCommand);

		outStream.write(normalFontCommand);
		line = operator.getName() + " ";

		DateFormat dateFm = DateFormat.getDateTimeInstance(DateFormat.SHORT,
				DateFormat.SHORT);
		line += "交班时间: " + dateFm.format(new Date(System.currentTimeMillis()));
		outStream.write(line.getBytes("GB2312"));
		outStream.write(newLineCommand);

		outStream.write(normalFontCommand);
		line = "------------------------";
		outStream.write(line.getBytes("GB2312"));
		outStream.write(newLineCommand);

		outStream.write(normalFontCommand);
		line = "总收入";
		outStream.write(line.getBytes("GB2312"));
		outStream.write(newLineCommand);

		outStream.write(normalFontCommand);
		line = setShiftClasssReportLine("  订单数", posPrinter,
				Double.toString(financeStat.getDishOrderCount()));
		outStream.write(line.getBytes("GB2312"));
		outStream.write(newLineCommand);

		outStream.write(normalFontCommand);
		line = setShiftClasssReportLine("  总价", posPrinter,
				Utils.formatPrice(financeStat.getTotalPrice(), true));
		outStream.write(line.getBytes("GB2312"));
		outStream.write(newLineCommand);

		outStream.write(normalFontCommand);
		line = setShiftClasssReportLine("  折后总价", posPrinter,
				Utils.formatPrice(financeStat.getTotalDiscountedPrice(), true));
		outStream.write(line.getBytes("GB2312"));
		outStream.write(newLineCommand);

		outStream.write(normalFontCommand);
		line = setShiftClasssReportLine("  总服务费", posPrinter,
				Utils.formatPrice(financeStat.getTotalServiceFee(), true));
		outStream.write(line.getBytes("GB2312"));
		outStream.write(newLineCommand);

		outStream.write(normalFontCommand);
		line = setShiftClasssReportLine("  实收款", posPrinter,
				Utils.formatPrice(financeStat.getTotalActualPaid(), true));
		outStream.write(line.getBytes("GB2312"));
		outStream.write(newLineCommand);

		outStream.write(normalFontCommand);
		line = "------------------------";
		outStream.write(line.getBytes("GB2312"));
		outStream.write(newLineCommand);

		outStream.write(normalFontCommand);
		line = "支付明细";
		outStream.write(line.getBytes("GB2312"));
		outStream.write(newLineCommand);

		outStream.write(normalFontCommand);
		line = setShiftClasssReportLine(" 收入项目", posPrinter, "-1");
		outStream.write(line.getBytes("GB2312"));

		line = setShiftClasssReportLine("记录数", posPrinter, "-1");
		outStream.write(line.getBytes("GB2312"));

		line = "金额";
		outStream.write(line.getBytes("GB2312"));
		outStream.write(newLineCommand);

		List<PaymentStat> paymentStatList = financeStat.getPaymentStats();
		for (PaymentStat paymentStat : paymentStatList) {
			outStream.write(normalFontCommand);

			line = setShiftClasssReportLine("   " + paymentStat.getTypeName(),
					posPrinter, "-1");
			outStream.write(line.getBytes("GB2312"));

			line = setShiftClasssReportLine(
					"  " + paymentStat.getPayRecordCount(), posPrinter, "-1");
			outStream.write(line.getBytes("GB2312"));

			line = Double
					.toString(Math.round(paymentStat.getTotalAmount() * 10) / 10);
			outStream.write(line.getBytes("GB2312"));
			outStream.write(newLineCommand);
		}

		outStream.write(normalFontCommand);
		line = "------------------------";
		outStream.write(line.getBytes("GB2312"));
		outStream.write(newLineCommand);

		for (int i = 0; i < posPrinter.getTailEmptyLines(); i++) {
			outStream.write(newLineCommand);
		}

		for (int i = 0; i < 8; i++) {
			outStream.write(newLineCommand);
		}

		outStream.write(cutPaperCommand);

		return outStream.toByteArray();
	}

	public static byte[] getRechargeBalanceNotePacket(UserAccount member,
			PosPrinter posPrinter, Store store, Employee employee, double amount)
			throws Exception {

		if (posPrinter == null) {
			return new byte[0];
		}

		String storeName = "";
		if (store != null) {
			storeName = store.getName();
		}

		int charsPerLine = posPrinter.getCharactersPerLine();
		charsPerLine = charsPerLine < 25 ? 25 : charsPerLine;

		ByteArrayOutputStream outStream = new java.io.ByteArrayOutputStream();

		outStream.write(resetCommand);
		for (int i = 0; i < posPrinter.getHeaderEmptyLines(); i++) {
			outStream.write(newLineCommand);
		}

		outStream.write(normalFontCommand);
		String line = padSidesTo("充值票据单", charsPerLine);
		outStream.write(line.getBytes("GB2312"));

		outStream.write(newLineCommand);
		outStream.write(getDoubleSplitLine(charsPerLine).getBytes("GB2312"));
		outStream.write(newLineCommand);

		outStream.write(doubleSizeAndBoldFontCommand);
		outStream.write(storeName.getBytes("GB2312"));
		outStream.write(newLineCommand);
		outStream.write(normalFontCommand);
		outStream.write(newLineCommand);

		outStream.write(normalFontCommand);
		String text1 = "充值时间:" + Utils.formatShortDateTime(new Date());
		String text2 = "操作员:" + employee.getName();
		alignLeft(outStream, charsPerLine, text1, text2);

		outStream.write(newLineCommand);
		line = "会员卡号:" + member.getMemberCardNo();
		outStream.write(line.getBytes("GB2312"));

		outStream.write(newLineCommand);
		outStream.write(getDoubleSplitLine(charsPerLine).getBytes("GB2312"));

		outStream.write(newLineCommand);
		outStream.write(doubleSizeAndBoldFontCommand);
		line = "充值金额:" + amount;
		outStream.write(line.getBytes("GB2312"));

		outStream.write(normalFontCommand);
		outStream.write(newLineCommand);
		outStream.write(getDoubleSplitLine(charsPerLine).getBytes("GB2312"));

		outStream.write(newLineCommand);
		outStream.write(doubleSizeAndBoldFontCommand);
		line = "帐号余额:" + member.getBalance();
		outStream.write(line.getBytes("GB2312"));

		outStream.write(newLineCommand);
		outStream.write(normalFontCommand);
		outStream.write(" 充值金额只限本店消费使用，不退现及其它使用".getBytes("GB2312"));

		for (int i = 0; i < posPrinter.getTailEmptyLines(); i++) {
			outStream.write(newLineCommand);
		}

		for (int i = 0; i < 3; i++) {
			outStream.write(newLineCommand);
		}

		outStream.write(cutPaperCommand);

		return outStream.toByteArray();
	}

	public static byte[] getTestingPacket() throws IOException {

		ByteArrayOutputStream outStream = new java.io.ByteArrayOutputStream();

		for (int i = 0; i < 10; i++) {
			outStream.write(newLineCommand);
		}

		outStream.write(doubleSizeFontCommand);
		String line = "------------------------";
		outStream.write(line.getBytes("GB2312"));
		outStream.write(newLineCommand);

		line = "打印机测试!!!!!!!!!!!!!";
		outStream.write(line.getBytes("GB2312"));
		outStream.write(newLineCommand);

		line = "------------------------";
		outStream.write(line.getBytes("GB2312"));
		outStream.write(newLineCommand);

		for (int i = 0; i < 10; i++) {
			outStream.write(newLineCommand);
		}
		outStream.write(cutPaperCommand);
		outStream.write(beepCommand);

		return outStream.toByteArray();
	}

	private static String setShiftClasssReportLine(String name,
			PosPrinter posPrinter, String financeStat) {

		String line = name;

		int nameWidth = getPrintingLength(line);
		int whiteSpaceLen = posPrinter.getCharactersPerLine() / 3 - nameWidth;

		if (!financeStat.endsWith("-1")) {

			int sNameWidth = getPrintingLength(financeStat);

			whiteSpaceLen = 4 * posPrinter.getCharactersPerLine() / 5
					- nameWidth - sNameWidth;

			for (int i = 0; i < whiteSpaceLen; i++) {
				line += " ";
			}

			line += financeStat;
		} else {
			for (int i = 0; i < whiteSpaceLen; i++) {
				line += " ";
			}
		}

		return line;
	}
}

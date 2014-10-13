package helen.catering.controller;

import helen.catering.Utils;
import helen.catering.model.MealDealItemManagenent;
import helen.catering.model.StoreData;
import helen.catering.model.entities.BOMLine;
import helen.catering.model.entities.Department;
import helen.catering.model.entities.Desk;
import helen.catering.model.entities.DiscountRule;
import helen.catering.model.entities.Dish;
import helen.catering.model.entities.DishCategory;
import helen.catering.model.entities.DishTag;
import helen.catering.model.entities.DishUnit;
import helen.catering.model.entities.Employee;
import helen.catering.model.entities.Material;
import helen.catering.model.entities.MealDealItem;
import helen.catering.model.entities.Menu;
import helen.catering.model.entities.NamedValue;
import helen.catering.model.entities.PaymentType;
import helen.catering.model.entities.PosPrinter;
import helen.catering.model.entities.Resource;
import helen.catering.model.entities.Store;
import helen.catering.model.entities.TimeRange;
import helen.catering.model.entities.UserAccount;
import helen.catering.service.MenuManagingService;
import helen.catering.service.ServiceException;
import helen.catering.service.StoreDataService;
import helen.catering.service.UserService;

import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.channels.FileChannel;
import java.util.Iterator;
import java.util.List;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.sun.image.codec.jpeg.JPEGCodec;
import com.sun.image.codec.jpeg.JPEGImageEncoder;

@SuppressWarnings("restriction")
@Controller
@RequestMapping("admin")
public class DishMenuManagementController {
	@Autowired
	private MenuManagingService _menuManagingService;
	@Autowired
	private UserService _userService;
	@Autowired
	StoreDataService _storeDataService;

	private String filePath = "D:\\catering\\src\\main\\webapp\\dishPic";// 存放上传文件的目录
	private String targetFilePath = "D:\\catering\\target\\catering\\dishPic";

	@SuppressWarnings("rawtypes")
	@ResponseBody
	@RequestMapping(value = "uploadImage", method = RequestMethod.POST)
	public String uploadImage(HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		response.setContentType("text/plain");
		response.setCharacterEncoding("UTF-8");
		// 向客户端发送响应正文

		String bigPicPath = "../dishPic/";
		String smallPicPath = "../dishPic/";
		String storeId = "";

		try {
			File path = new File(filePath);
			if (!path.exists())
				path.mkdirs();

			// 创建一个基于硬盘的FileItem工厂
			DiskFileItemFactory factory = new DiskFileItemFactory();
			// 设置向硬盘写数据时所用的缓冲区的大小，此处为4K
			factory.setSizeThreshold(4 * 1024);
			// 设置临时目录
			factory.setRepository(path);

			// 创建一个文件上传处理器
			ServletFileUpload upload = new ServletFileUpload(factory);
			// 设置允许上传的文件的最大尺寸，此处为4M
			upload.setSizeMax(1 * 1024 * 1024);

			List items = upload.parseRequest(request);

			Iterator iter = items.iterator();

			while (iter.hasNext()) {
				FileItem item = (FileItem) iter.next();

				if (item.getFieldName().equals("storeId")) {
					storeId = item.getString();
				}

				if (!item.isFormField()) {
					String filename = item.getName();
					int index = filename.lastIndexOf("\\");
					filename = filename.substring(index + 1, filename.length());
					long fileSize = item.getSize();

					if (filename.equals("") && fileSize == 0) {
						break;
					}

					int indexSplit = filename.lastIndexOf(".");
					long picNameId = Utils.generateEntityId();
					String picName = picNameId
							+ filename.substring(indexSplit, filename.length());
					String bigPicName = picNameId + "-248X155"
							+ filename.substring(indexSplit, filename.length());
					String smallPicName = picNameId + "-85X53"
							+ filename.substring(indexSplit, filename.length());

					bigPicPath += storeId + "/" + bigPicName;
					smallPicPath += storeId + "/" + smallPicName;

					String uploadFilePath = filePath + "\\" + storeId + "\\";
					String filePath = uploadFilePath + picName;
					String bigFilePath = uploadFilePath + bigPicName;
					String smallFilePath = uploadFilePath + smallPicName;

					File pathFile = new File(uploadFilePath);
					if (!pathFile.exists())
						pathFile.mkdirs();

					File uploadFile = new File(filePath);

					// 保存原图
					// item.write(uploadFile);

					saveImageFile(uploadFile, bigFilePath);

					saveImageFile(uploadFile, smallFilePath);

					String targetUploadFilePath = targetFilePath + "\\"
							+ storeId + "\\";
					String targetBigFilePath = targetUploadFilePath
							+ bigPicName;
					String targetSmallFilePath = targetUploadFilePath
							+ smallPicName;

					File targetPathFile = new File(targetUploadFilePath);
					if (!targetPathFile.exists())
						targetPathFile.mkdirs();

					copyImageFile(bigFilePath, targetBigFilePath);

					copyImageFile(bigFilePath, targetSmallFilePath);

				}
			}
			return smallPicPath + "||" + bigPicPath;
		} catch (Exception ex) {
			ex.printStackTrace();
			return "false";
		}
	}

	public void saveImageFile(File imageFile, String savePath) throws Exception {
		Image img = ImageIO.read(imageFile);

		// 构造Image对象
		BufferedImage tag = new BufferedImage(248, 155,
				BufferedImage.TYPE_INT_RGB);
		tag.getGraphics().drawImage(img, 0, 0, 248, 155, null);
		FileOutputStream bigOut = new FileOutputStream(savePath);
		JPEGImageEncoder encoder = JPEGCodec.createJPEGEncoder(bigOut);
		encoder.encode(tag);
		bigOut.close();
	}

	@SuppressWarnings("resource")
	public void copyImageFile(String orangeImagePath, String savePath)
			throws Exception {

		FileChannel srcChannel = new FileInputStream(orangeImagePath)
				.getChannel();

		FileChannel copyChannel = new FileOutputStream(savePath).getChannel();
		copyChannel.transferFrom(srcChannel, 0, srcChannel.size());
		srcChannel.close();
		copyChannel.close();
	}

	@RequestMapping("dishManagementHome")
	public ModelAndView dishMenuHome(@RequestParam long storeId)
			throws Exception {

		UserAccount user = null;
		try {
			user = _userService.AssertStoreAuth(storeId);
		} catch (Exception ex) {
			return new ModelAndView("redirect:/j_spring_security_logout");
		}

		Employee employee = _userService.getEmployeeByUserAccountId(user
				.getId());

		if (employee.getJob().equals("店长") || employee.getJob().equals("收银")) {
			ModelAndView mav = new ModelAndView();
			mav.addObject("storeId", storeId);
			mav.addObject("employee", employee);
			mav.setViewName("dishManagementHome");
			return mav;
		}

		throw new ServiceException(ServiceException.NOT_AUTHORUTY);
	}

	@ResponseBody
	@RequestMapping("getDishManagementDataByStoreId")
	public StoreData getDishManagementDataByStoreId(@RequestParam long storeId)
			throws ServiceException {

		UserAccount user = null;
		try {
			user = _userService.AssertStoreAuth(storeId);
		} catch (Exception ex) {
			return null;
		}

		return this._menuManagingService.getDishManagementDataByStoreId(
				storeId, user.getId());
	}

	@ResponseBody
	@RequestMapping("addOrUpdateDish")
	public Dish addOrUpdateDish(@RequestParam long dishCategoryId,
			@RequestParam String dishJsonText) {
		Dish dish = Dish.fromJsonText(dishJsonText);
		return this._menuManagingService.saveDish(dishCategoryId, dish);

	}

	@ResponseBody
	@RequestMapping("copyDish")
	public Dish copyDish(@RequestParam long dishCategoryId,
			@RequestParam long dishId) {
		return this._menuManagingService.copyDish(dishCategoryId, dishId);

	}

	@ResponseBody
	@RequestMapping(value = "addOrUpdateDishCategory", method = RequestMethod.POST)
	public DishCategory addOrUpdateDishCategory(@RequestParam long id,
			@RequestParam long menuId, @RequestParam String name,
			@RequestParam String alias, @RequestParam int sort) {
		return this._menuManagingService.saveDishCategory(id, menuId, name,
				alias, sort);
	}

	@ResponseBody
	@RequestMapping(value = "addOrUpdateMenu", method = RequestMethod.POST)
	public Menu addOrUpdateMenu(@RequestParam long id,
			@RequestParam long storeId, @RequestParam String name,
			@RequestParam int sort) {
		return this._menuManagingService.saveMenu(id, storeId, name, sort);
	}

	@ResponseBody
	@RequestMapping(value = "addOrUpdateDesk", method = RequestMethod.POST)
	public Desk addOrUpdateDesk(@RequestParam long id,
			@RequestParam long storeId, @RequestParam String name,
			@RequestParam String groupName, @RequestParam boolean chargeVIPFee,
			@RequestParam double serviceFeeRate, @RequestParam boolean enabled,
			@RequestParam int number, @RequestParam int sort,
			@RequestParam boolean forTesting, @RequestParam Long posPrinterId) {
		return this._menuManagingService.saveDesk(id, storeId, name, groupName,
				chargeVIPFee, serviceFeeRate, enabled, number, sort,
				forTesting, posPrinterId);
	}

	@ResponseBody
	@RequestMapping(value = "addOrUpdatePosPrinter", method = RequestMethod.POST)
	public PosPrinter addOrUpdatePosPrinter(@RequestParam long id,
			@RequestParam long storeId, @RequestParam String name,
			@RequestParam boolean canPrintCheckoutBill,
			@RequestParam boolean canPrintCustomerNote,
			@RequestParam String deviceName, @RequestParam Integer baudBase,
			@RequestParam int number, @RequestParam boolean beep,
			@RequestParam int frameWidth, @RequestParam int charactersPerLine) {
		return this._menuManagingService.savePosPrinter(id, storeId, name,
				canPrintCheckoutBill, canPrintCustomerNote, deviceName,
				baudBase, number, beep, frameWidth, charactersPerLine);
	}

	@ResponseBody
	@RequestMapping("addOrUpdateDishTag")
	public DishTag addDishTag(@RequestParam long id,
			@RequestParam long storeId, @RequestParam Long dishId,
			@RequestParam String groupName, @RequestParam Integer optionSetNo,
			@RequestParam String name, @RequestParam String alias,
			@RequestParam double priceDelta, @RequestParam int sort) {
		return this._menuManagingService.saveDishTag(id, storeId, dishId,
				groupName, optionSetNo, name, alias, priceDelta, sort);
	}

	@ResponseBody
	@RequestMapping("addOrUpdateMealDealItem")
	public MealDealItemManagenent addOrUpdateMealDealItem(
			@RequestParam String mealDealItemJsonList) {

		ObjectMapper om = new ObjectMapper();
		try {
			MealDealItem[] brifDishs = om.reader(MealDealItem[].class)
					.readValue(mealDealItemJsonList);

			return this._menuManagingService.saveMealDealItem(brifDishs);
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
	}

	@ResponseBody
	@RequestMapping("getMealDealItemsByTargetDishId")
	public MealDealItemManagenent getMealDealItemsByTargetDishId(
			@RequestParam long targetDishId) throws ServiceException {
		return this._menuManagingService
				.getMealDealItemsByTargetDishId(targetDishId);
	}

	@ResponseBody
	@RequestMapping("saveDishAndMealItemList")
	public Dish saveDishAndMealItemList(@RequestParam long dishCategoryId,
			@RequestParam String dishJsonText,
			@RequestParam String mealDealItems) {
		Dish dish = Dish.fromJsonText(dishJsonText);

		ObjectMapper om = new ObjectMapper();
		try {
			MealDealItem[] brifDishs = om.reader(MealDealItem[].class)
					.readValue(mealDealItems);
			return this._menuManagingService.saveDishAndMealItemList(
					dishCategoryId, dish, brifDishs);
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
	}

	@ResponseBody
	@RequestMapping("deleteMealDealItemsById")
	public boolean deleteMealDealItemsById(@RequestParam String mdiIds) {
		return this._menuManagingService.deleteMealDealItemsById(mdiIds);
	}

	@ResponseBody
	@RequestMapping("deleteDishTag")
	public boolean deleteDishTag(@RequestParam long id) {
		return this._menuManagingService.deleteDishTag(id);
	}

	@ResponseBody
	@RequestMapping(value = "deleteDish", method = RequestMethod.POST)
	public boolean deleteDish(@RequestParam long dishId) {
		return this._menuManagingService.deleteDish(dishId);
	}

	@ResponseBody
	@RequestMapping(value = "deleteMenu", method = RequestMethod.POST)
	public boolean deleteMenu(@RequestParam long id) {
		return this._menuManagingService.deleteMenu(id);
	}

	@ResponseBody
	@RequestMapping(value = "deleteDesk", method = RequestMethod.POST)
	public boolean deleteDesk(@RequestParam long id) {
		return this._menuManagingService.deleteDesk(id);
	}

	@ResponseBody
	@RequestMapping(value = "deletePosPrinter", method = RequestMethod.POST)
	public boolean deletePosPrinter(@RequestParam long id) {
		return this._menuManagingService.deletePosPrinter(id);
	}

	@ResponseBody
	@RequestMapping(value = "deleteDishCategory", method = RequestMethod.POST)
	public boolean deleteDishCategory(@RequestParam long id) {
		return this._menuManagingService.deleteDishCategory(id);
	}

	@ResponseBody
	@RequestMapping("updateDishList")
	public List<Dish> updateDishList(@RequestParam String dishesJsonText)
			throws Exception {
		ObjectMapper om = new ObjectMapper();
		Dish[] brifDishs = om.reader(Dish[].class).readValue(dishesJsonText);
		return this._menuManagingService.updateDishListByBrifDishs(brifDishs);
	}

	@ResponseBody
	@RequestMapping("cancelDishSoldOut")
	public String cancelDishSoldOut(@RequestParam long dishId,
			@RequestParam long employeeId) {
		return this._menuManagingService.cancelDishSoldOut(dishId, employeeId);
	}

	@ResponseBody
	@RequestMapping(value = "addOrUpdateDepartment", method = RequestMethod.POST)
	public Department addOrUpdateDepartment(@RequestParam long id,
			@RequestParam long storeId, @RequestParam String name,
			@RequestParam Long cookingNotePrinterId,
			@RequestParam Long delivererNotePrinterId,
			@RequestParam boolean sliceCookingNotes) {
		return this._menuManagingService
				.saveDepartment(id, storeId, name, cookingNotePrinterId,
						delivererNotePrinterId, sliceCookingNotes);
	}

	@ResponseBody
	@RequestMapping(value = "deleteDepartment", method = RequestMethod.POST)
	public boolean deleteDepartment(@RequestParam long id) {
		return this._menuManagingService.deleteDepartment(id);
	}

	@ResponseBody
	@RequestMapping(value = "addOrUpdateTimeRange", method = RequestMethod.POST)
	public TimeRange addOrUpdateTimeRange(@RequestParam long id,
			@RequestParam long storeId, @RequestParam String name,
			@RequestParam String arriveTimeOptions) {
		return this._menuManagingService.saveTimeRange(id, storeId, name,
				arriveTimeOptions);
	}

	@ResponseBody
	@RequestMapping(value = "deleteTimeRange", method = RequestMethod.POST)
	public boolean deleteTimeRange(@RequestParam long id) {
		return this._menuManagingService.deleteTimeRange(id);
	}

	@ResponseBody
	@RequestMapping(value = "addOrUpdateResource", method = RequestMethod.POST)
	public Resource addOrUpdateResource(@RequestParam long id,
			@RequestParam String name, @RequestParam long timeRangeId,
			@RequestParam int amount) {
		return this._menuManagingService.saveResource(id, name, timeRangeId,
				amount);
	}

	@ResponseBody
	@RequestMapping(value = "deleteResource", method = RequestMethod.POST)
	public boolean deleteResource(@RequestParam long id) {
		return this._menuManagingService.deleteResource(id);
	}

	@ResponseBody
	@RequestMapping(value = "addOrUpdatePaymentType", method = RequestMethod.POST)
	public PaymentType addOrUpdatePaymentType(@RequestParam long id,
			@RequestParam long storeId, @RequestParam String name,
			@RequestParam double exchangeRate, @RequestParam int sort) {
		return this._menuManagingService.savePaymentType(id, name, storeId,
				exchangeRate, sort);
	}

	@ResponseBody
	@RequestMapping(value = "deletePaymentType", method = RequestMethod.POST)
	public boolean deletePaymentType(@RequestParam long id) {
		return this._menuManagingService.deletePaymentType(id);
	}

	@ResponseBody
	@RequestMapping(value = "addOrUpdateNamedValue", method = RequestMethod.POST)
	public NamedValue addOrUpdateNamedValue(@RequestParam long id,
			@RequestParam long storeId, @RequestParam String name,
			@RequestParam String type, @RequestParam double value) {
		return this._menuManagingService.saveNamedValue(id, name, storeId,
				type, value);
	}

	@ResponseBody
	@RequestMapping(value = "deleteNamedValue", method = RequestMethod.POST)
	public int deleteNamedValue(@RequestParam long id) {
		String type = _menuManagingService.getBeforDeleteNameValueTypeById(id);
		if (!this._menuManagingService.deleteNamedValue(id)) {
			return 0;
		}

		if (type.endsWith(NamedValue.TYPE_DISCOUNT_RATE)) {
			return 1;
		} else if (type.endsWith(NamedValue.TYPE_SERVICE_FEE_RATE)) {
			return 2;
		} else if (type.endsWith(NamedValue.TYPE_CANCEL_REASON)) {
			return 3;
		}

		return 0;
	}

	@ResponseBody
	@RequestMapping(value = "addOrUpdateDishUnit", method = RequestMethod.POST)
	public DishUnit addOrUpdateDishUnit(@RequestParam long id,
			@RequestParam long storeId, @RequestParam String name,
			@RequestParam double exchangeRate, @RequestParam int sort,
			@RequestParam int groupNumber) {
		return this._menuManagingService.saveDishUnit(id, name, storeId,
				exchangeRate, groupNumber, sort);
	}

	@ResponseBody
	@RequestMapping(value = "deleteDishUnit", method = RequestMethod.POST)
	public boolean deleteDishUnit(@RequestParam long id) {
		return this._menuManagingService.deleteDishUnit(id);
	}

	@ResponseBody
	@RequestMapping(value = "addOrUpdateEmployee", method = RequestMethod.POST)
	public Employee updateEmployee(
			@RequestParam long id,
			@RequestParam(defaultValue = "") String name,
			@RequestParam(defaultValue = "") String workNumber,
			@RequestParam(defaultValue = "") String smartCardNo,
			@RequestParam(defaultValue = "false") boolean canRestoreDishOrder,
			@RequestParam(defaultValue = "false") boolean canPreprintCheckoutNote,
			@RequestParam(defaultValue = "false") boolean canCancelOrderItem,
			@RequestParam(defaultValue = "false") boolean canViewReport) {
		return this._menuManagingService.updateEmployee(id, name, workNumber,
				smartCardNo, canRestoreDishOrder, canPreprintCheckoutNote,
				canCancelOrderItem, canViewReport);
	}

	@ResponseBody
	@RequestMapping(value = "addOrUpdateStore", method = RequestMethod.POST)
	public Store updateStore(
			@RequestParam long id,
			@RequestParam(defaultValue = "0") long checkoutPosPrinterId,
			@RequestParam(defaultValue = "false") boolean autoPrintCustomerNote,
			@RequestParam(defaultValue = "false") boolean noShowPriceInCustomerNote,
			@RequestParam(defaultValue = "1") double pointRate,
			@RequestParam(defaultValue = "false") boolean includedCouponValueInPoint,
			@RequestParam(defaultValue = "false") boolean isDoubleSizeFont,
			@RequestParam(defaultValue = "") String storeActivity) {
		return this._menuManagingService.updateStore(id, checkoutPosPrinterId,
				autoPrintCustomerNote, noShowPriceInCustomerNote, pointRate,
				includedCouponValueInPoint, isDoubleSizeFont, storeActivity);
	}

	@ResponseBody
	@RequestMapping(value = "addOrUpdateDiscountRule", method = RequestMethod.POST)
	public DiscountRule addOrUpdateDiscountRule(@RequestParam long id,
			@RequestParam long storeId, @RequestParam String name,
			@RequestParam double value, @RequestParam double discountRate,
			@RequestParam boolean noOverallDiscount) {
		return this._menuManagingService.addOrUpdateDiscountRule(id, name,
				storeId, value, discountRate, noOverallDiscount);
	}

	@ResponseBody
	@RequestMapping(value = "deleteDiscountRule", method = RequestMethod.POST)
	public boolean deleteDiscountRule(@RequestParam long id) {
		return this._menuManagingService.deleteDiscountRule(id);
	}

	@ResponseBody
	@RequestMapping(value = "addOrUpdateMaterial", method = RequestMethod.POST)
	public Material addOrUpdateMaterial(@RequestParam long id,
			@RequestParam long storeId, @RequestParam int sort,
			@RequestParam(defaultValue = "") String name) {
		return this._menuManagingService.addOrUpdateMaterial(id, name, storeId,
				sort);
	}

	@ResponseBody
	@RequestMapping(value = "deleteMaterial", method = RequestMethod.POST)
	public boolean deleteMaterial(@RequestParam long id) {
		return this._menuManagingService.deleteMaterial(id);
	}

	@ResponseBody
	@RequestMapping(value = "submitBOMLine", method = RequestMethod.POST)
	public BOMLine submitBOMLine(@RequestParam long id,
			@RequestParam long storeId, @RequestParam String dishName,
			@RequestParam long dishId, @RequestParam String materialName,
			@RequestParam long materialId, @RequestParam double weight,
			@RequestParam int sort) {
		return this._menuManagingService.submitBOMLine(id, storeId, dishName,
				dishId, materialName, materialId, weight, sort);
	}

	@ResponseBody
	@RequestMapping(value = "deleteBOMLine", method = RequestMethod.POST)
	public boolean deleteBOMLine(@RequestParam long id) {
		return this._menuManagingService.deleteBOMLine(id);
	}
}

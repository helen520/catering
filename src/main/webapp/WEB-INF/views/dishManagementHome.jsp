<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title>数据管理</title>
<meta name="description" content="">
<meta name="viewport"
	content="width=device-width,initial-scale=1,user-scalable=no,maximum-scale=1">
<link rel="stylesheet" href="../css/dishManagementHome.css" />
<link rel="stylesheet" href="../css/uploadify.css" />
<script src="../js/autoComplete.js"></script>
</head>
<body>
	<div id="dishMenuControlPanel" class="dishMenuControlPanel">
		<button id="menus" class="menuButton">菜谱</button>
		<button id="materials" class="menuButton">原料</button>
		<button id="editDishToSoldOutMenuButton" class="menuButton">菜品批量编辑</button>
		<button id="commonDishTags" class="menuButton">公共做法</button>
		<button id="desks" class="menuButton">餐台</button>
		<button id="posPrinters" class="menuButton">打印机</button>
		<button id="departments" class="menuButton">部门</button>
		<button id="bookingTimeRanges" class="menuButton">预定时间</button>
		<button id="roomResources" class="menuButton">预定房间种类</button>
		<button id="paymentTypes" class="menuButton">付款方式</button>
		<button id="serviceFeeRates" class="menuButton">服务费率</button>
		<button id="discountRates" class="menuButton">折扣率</button>
		<button id="cancelReasons" class="menuButton">退菜理由</button>
		<button id="discountRules" class="menuButton">菜品优惠</button>
		<button id="dishUnits" class="menuButton">菜品单位</button>
		<c:if test="${employee.job=='店长' }">
			<button id="employees" class="menuButton">员工管理</button>
		</c:if>
		<button id="store" class="menuButton">店面管理</button>
	</div>
	<div id="dishMenuList" class="dishMenuPanel"></div>
	<div id="dishCategoryList" class="dishCategoryPanel"></div>
	<div id="dishList" class="dishList"></div>
	<div id="dishTagList" class="dishTagPanel"></div>
	<div id="deskList"></div>
	<div id="posPrinterList"></div>
	<div id="departmentList"></div>
	<div id="bookingTimeRangeList"></div>
	<div id="roomResourceList"></div>
	<div id="paymentTypeList"></div>
	<div id="serviceFeeRateList"></div>
	<div id="discountRateList"></div>
	<div id="cancelReasonList"></div>
	<div id="dishUnitList"></div>
	<div id="employeeList"></div>
	<div id="storeList"></div>
	<div id="discountRuleList"></div>
	<div id="materialList"></div>

	<div class="uploadifyDiv" id="uploadifyDiv" style="display: none;">
		<input type="file" name="uploadify" id="uploadify" />
	</div>

	<div id="addOrUpdateBOMLineDialogTemplate"
		class="ui-radius ui-shadow bomLineDialog">
		<form name="bomLineForm" id="bomLineForm" method="post">
			<div>
				<center>
					<h1>物料清单编辑</h1>
				</center>
				<input id="bomLineId" type="hidden" /> <input id="bomLineDishId"
					type="hidden" /> <input id="bomLineMaterialId" type="hidden" />
				<ul>
					<li style="list-style: none;">
						<div class="autoComplete">
							<label>菜品 </label><input id="bomLineDish" readonly="readonly"
								class="ui-input ui-radius ui-shadow ui-border-solid" />
							<ul>
								<li></li>
							</ul>
						</div>
					</li>
					<br />
					<br />
					<br />
					<li style="list-style: none;">
						<div class="autoCompleteMaterial">
							<label>原料 </label><input id="bomLineMaterial"
								class="ui-input ui-radius ui-shadow ui-border-solid" />
							<ul>
								<li></li>
							</ul>
						</div>
					</li>
					<br />
					<br />
					<br />(
					<font color="red">提示：可输入查找</font>)
					<li><label>消耗重量(克)</label> <input id="bomLineWeight"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text" /></li>
					<br />
					<br />
					<li><label>序号</label> <input id="bomLineSort"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text"
						value="0" /></li>
				</ul>
			</div>
		</form>
	</div>

	<div id="addOrUpdateMaterialDialogTemplate"
		class="formDialog ui-radius ui-shadow">
		<form name="materialForm" id="materialForm" method="post">
			<div>
				<center>
					<h1>原料编辑</h1>
				</center>
				<ul>
					<input id="materialId" type="hidden" />
					<li><label>原料名称</label> <input id="materialName"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text"
						placeholder="如：牛肉" /></li>
					<br />
					<li><label>序号</label> <input id="materialSort"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text"
						value="0" /></li>
				</ul>
			</div>
		</form>
	</div>

	<div id="addOrUpdateDiscountRuleDialogTemplate"
		class="formDialog ui-radius ui-shadow">
		<form name="discountRuleForm" id="discountRuleForm" method="post">
			<div>
				<center>
					<h1>菜品优惠编辑</h1>
				</center>
				<ul>
					<input id="discountRuleId" type="hidden" />
					<li><label>优惠名称</label> <input id="discountRuleName"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text"
						placeholder="如：菜品八折优惠" /></li>
					<br />
					<li><label>抵扣金额</label> <input id="discountRuleValue"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text"
						value="0" placeholder="菜品价格减抵扣金额" /></li>
					<br />
					<li><label>折扣率</label> <input id="discountRuleDiscountRate"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="number"
						value="1" placeholder="0~1,菜品价格乘于折扣率" /></li>
					<br />
					<span>抵扣金额与折扣率,一般情况下只填一个,如果都填了,那么菜品的价格则会先乘于折扣率再减去抵扣金额!</span>
					<br />
					<li><label>不可覆盖</label> <input
						id="discountRuleNoOverallDiscount" type="checkbox"
						checked="checked" /><span>(勾上,则该菜品优惠完的价格不受结账页面的折扣率的影响)</span></li>
				</ul>
			</div>
		</form>
	</div>

	<div id="addOrUpdateStoreDialogTemplate"
		class="formDialog ui-radius ui-shadow">
		<form name="storeForm" id="storeForm" method="post">
			<div>
				<center>
					<h1>店面信息编辑</h1>
				</center>
				<ul>
					<input id="storeId" type="hidden" />
					<li><label>店名</label> <input id="storeName"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text"
						readonly="readonly" /></li>
					<br />
					<li><label>结账打印机</label> <select
						id="stroeCheckoutPosPrinterId" name="stroeCheckoutPosPrinterId"
						class="ui-input ui-radius ui-shadow ui-border-solid">
					</select></li>
					<br />
					<li><label>自动打楼面单</label> <input
						id="storeAutoPrintCustomerNote" type="checkbox" /></li>
					<br />
					<li><label>楼面单不显示价格</label> <input
						id="storeNoShowPriceInCustomerNote" type="checkbox" /></li>
					<br />
					<li><label>积分兑换率</label> <input id="storePointRate" value="1"
						class="ui-input ui-radius ui-shadow ui-border-solid"
						placeholder="积分兑换率 * 实收金额 = 积分" type="number" /></li>
					<br />
					<li><label>积分兑换是否算上优惠券金额</label> <input
						id="storeIncludedCouponValueInPoint" type="checkbox" /></li>
					<br />
					<li><label>大字体显示菜名</label> <input id="storeIsDoubleSizeFont"
						type="checkbox" /></li>
					<br />
					<li><label>店内活动(结账单显示)</label> <textarea id="storeActivity"
							class="ui-input ui-radius ui-shadow ui-border-solid" rows="5"
							cols="20"></textarea>
				</ul>
			</div>
		</form>
	</div>

	<div id="addOrUpdateEmployeeDialogTemplate"
		class="formDialog ui-radius ui-shadow">
		<form name="employeeForm" id="employeeForm" method="post">
			<div>
				<center>
					<h1>员工信息编辑</h1>
				</center>
				<ul>
					<input id="employeeId" type="hidden" />
					<li><label>登录帐号</label> <input id="employeeLoginNo"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text"
						readonly="readonly" /></li>
					<br />
					<li><label>姓名</label> <input id="employeeName"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text" /></li>
					<br />
					<li><label>工号</label> <input id="employeeWorkNumber"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text" /></li>
					<br />
					<li><label>刷卡号</label> <input id="employeeSmartCardNo"
						class="ui-input ui-radius ui-shadow ui-border-solid"
						type="password" /></li>
					<br />
					<li><label>可还原订单</label> <input
						id="employeeCanRestoreDishOrder" type="checkbox" /></li>
					<br />
					<li><label>可预打结账单</label> <input
						id="employeeCanPreprintCheckoutNote" type="checkbox" /></li>
					<br />
					<li><label>可取消菜品</label> <input
						id="employeeCanCancelOrderItem" type="checkbox" /></li>
					<br />
					<li><label>可取查看报表</label> <input id="employeeCanViewReport"
						type="checkbox" /></li>
					<br />
					<li><label>可恢复菜品销售</label> <input
						id="employeeCanCancelDishSoldOut" type="checkbox" /></li>
				</ul>
			</div>
		</form>
	</div>

	<div id="addOrUpdateBookingTimeRangeDialogTemplate"
		class="formDialog ui-radius ui-shadow">
		<form name="timeRangeForm" id="timeRangeForm" method="post">
			<div>
				<center>
					<h1>预订时间编辑</h1>
				</center>
				<ul>
					<input id="timeRangeId" type="hidden" value="0" />
					<li><label>名称</label> <input id="timeRangeName"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text"
						value="" placeholder="如：午市/晚市" /></li>
					<br />
					<li><label>时间项</label> <input id="arriveTimeOptions"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text"
						value="" placeholder="如：11:30,12:00,12:30" /><span>
							注意:每个时间项要用","号(英文符号)隔开!</span></li>
				</ul>
			</div>
		</form>
	</div>

	<div id="addOrUpdateRoomResourceDialogTemplate"
		class="formDialog ui-radius ui-shadow">
		<form name="resourceForm" id="resourceForm" method="post">
			<div>
				<center>
					<h1>预订房间类型编辑</h1>
				</center>
				<ul>
					<input id="resourceId" type="hidden" value="0" />
					<li><label>名称</label> <input id="resourceName"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text"
						value="" placeholder="如：大厅" /></li>
					<br />
					<li><label>预定时间</label> <select id="formTimeRangeId"
						name="formTimeRangeId"
						class="ui-inputui-radiusui-shadowui-border-solid">
					</select></li>
					<br />
					<li><label>可订数量</label> <input id="timeRangeAmount"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="number"
						value="1" placeholder="如：1" /></li>
				</ul>
			</div>
		</form>
	</div>

	<div id="addOrUpdatePaymentTypeDialogTemplate"
		class="formDialog ui-radius ui-shadow">
		<form name="paymentTypeForm" id="paymentTypeForm" method="post">
			<div>
				<center>
					<h1>付款方式编辑</h1>
				</center>
				<ul>
					<input id="paymentTypeId" type="hidden" value="0" />
					<li><label>名称</label> <input id="paymentTypeName"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text"
						value="" placeholder="如：现金" /></li>
					<br />
					<li><label>换算率</label> <input id="paymentTypeExchangeRate"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="number"
						value="1" placeholder="0~1,人民币填1,其他货币填汇率" /></li>
					<br />
					<li><label>排序</label> <input id="paymentTypeSort"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="number"
						value="1" /></li>
				</ul>
			</div>
		</form>
	</div>

	<div id="addOrUpdateServiceFeeRateDialogTemplate"
		class="formDialog ui-radius ui-shadow">
		<form name="serviceFeeRateForm" id="serviceFeeRateForm" method="post">
			<div>
				<center>
					<h1>服务费率编辑</h1>
				</center>
				<ul>
					<input id="id" type="hidden" value="0" />
					<input id="type" type="hidden" value="SERVICE_FEE_RATE" />
					<li><label>名称</label> <input id="name"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text"
						value="" placeholder="如：10%服务费" /></li>
					<br />
					<li><label>费率</label> <input id="value"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="number"
						value="" placeholder="如：0.1" /></li>
				</ul>
			</div>
		</form>
	</div>

	<div id="addOrUpdateDiscountRateDialogTemplate"
		class="formDialog ui-radius ui-shadow">
		<form name="discountRateForm" id="discountRateForm" method="post">
			<div>
				<center>
					<h1>折扣率编辑</h1>
				</center>
				<ul>
					<input id="id" type="hidden" value="0" />
					<input id="type" type="hidden" value="DISCOUNT_RATE" />
					<li><label>名称</label> <input id="name"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text"
						value="" placeholder="如：9折" /></li>
					<br />
					<li><label>费率</label> <input id="value"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="number"
						value="" placeholder="如：0.9" /></li>
				</ul>
			</div>
		</form>
	</div>

	<div id="addOrUpdateCancelReasonDialogTemplate"
		class="formDialog ui-radius ui-shadow">
		<form name="cancelReasonForm" id="cancelReasonForm" method="post">
			<div>
				<center>
					<h1>退菜理由编辑</h1>
				</center>
				<ul>
					<input id="id" type="hidden" value="0" />
					<input id="type" type="hidden" value="CANCEL_REASON" />
					<input id="value" type="hidden" value="0" />
					<li><label>原因</label> <input id="name"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text"
						value="" placeholder="如：点错菜" /></li>
				</ul>
			</div>
		</form>
	</div>

	<div id="addOrUpdateDishUnitDialogTemplate"
		class="formDialog ui-radius ui-shadow">
		<form name="dishUnitForm" id="dishUnitForm" method="post">
			<div>
				<center>
					<h1>菜品单位编辑</h1>
				</center>
				<ul>
					<input id="dishUnitId" type="hidden" value="0" />
					<li><label>名称</label> <input id="dishUnitName"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text"
						value="" placeholder="如：例牌" /></li>
					<br />
					<li><label>分组号</label> <input id="dishUnitGroupNumber"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="number"
						value="1" placeholder="如：1,组号相同即一起显示" /></li>
					<br />
					<li><label>原价倍数</label> <input id="dishUnitExchangeRate"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="number"
						value="1" placeholder="如：1,(1为原价)" /></li>
					<br />
					<li><label>排序</label> <input id="dishUnitSort"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="number"
						value="1" /></li>
				</ul>
			</div>
		</form>
	</div>

	<div id="addOrUpdateMenuDialogTemplate"
		class="formDialog ui-radius ui-shadow">
		<form name="menuForm" id="menuForm" method="post">
			<div>
				<center>
					<h1>菜谱编辑</h1>
				</center>
				<ul>
					<input id="menuId" type="hidden" value="0" />
					<li><label>名称</label> <input id="menuName"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text"
						value="" placeholder="如：下午茶" /></li>
					<br />
					<li><label>序号</label> <input id="menuSort"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="number"
						value="1" placeholder="如：1" /></li>
				</ul>
			</div>
		</form>
	</div>

	<div id="addOrUpdatePosPrinterDialogTemplate"
		class="formDialog ui-radius ui-shadow">
		<form name="posPrinterForm" id="posPrinterForm" method="post">
			<div>
				<center>
					<h1>打印机编辑</h1>
					<input id="testPrinter" type="button" value="打印测试" />
				</center>
				<ul>
					<li><label>ID</label> <input id="posPrinterId"
						class="
						ui-input ui-radius ui-shadow ui-border-solid"
						type="text" readonly="readonly" value="0" /></li>
					<br />
					<input id="posPrinterCanPrintCheckoutBill" type="hidden"
						value="false" />
					<li><label>名称</label> <input id="posPrinterName"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text"
						value="" placeholder="如：厨房打印机" /></li>
					<br />
					<li><label>号码</label> <input id="posPrinterNumber"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="number"
						value="" placeholder="见DTU背面，如：1001" /></li>
					<br />
					<li><label>可打印楼面单</label> <input
						id="posPrinterCanPrintCustomerNote" type="checkbox" /></li>
					<br />
					<li><label>设备接口</label> <input id="posPrinterDeviceName"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text"
						value="COM1" placeholder="如：COM1" /></li>
					<br />
					<li><label>波特率</label> <input id="posPrinterBaudBase"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="number"
						value="19200" placeholder="为串口连接时此参数有效，如：19200" /></li>
					<br />
					<li><label>打印完成发声</label> <input id="posPrinterBeep"
						type="checkbox" /></li>
					<br />
					<li><label>小票宽度</label> <input id="posPrinterFrameWidth"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="number"
						value="58" placeholder="58或80" /></li>
					<br />
					<li><label>每行字符数</label> <input
						id="posPrinterCharactersPerLine"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="number"
						value="32" placeholder="32或42" /></li>
				</ul>
			</div>
		</form>
	</div>

	<div id="addOrUpdateDepartmentDialogTemplate"
		class="formDialog ui-radius ui-shadow">
		<form name="departmentForm" id="departmentForm" method="post">
			<div>
				<center>
					<h1>部门编辑</h1>
				</center>
				<ul>
					<input id="formDepartmentId" type="hidden" value="0" />
					<li><label>名称</label> <input id="formDepartmentName"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text"
						value="" placeholder="如：厨房" /></li>
					<br />
					<li><label>做菜打印机</label> <select
						id="formDepartmentCookingNotePrinterId"
						name="formDepartmentCookingNotePrinterId"
						class="ui-input ui-radius ui-shadow ui-border-solid">
					</select></li>
					<br />
					<li><label>传菜打印机</label> <select
						id="formDepartmentDelivererNotePrinterId"
						class="ui-input ui-radius ui-shadow ui-border-solid"></select></li>
					<br />
					<li><label>每个菜一张单</label> <input
						id="formDepartmentSliceCookingNotes" type="checkbox" checked /></li>
				</ul>
			</div>
		</form>
	</div>

	<div id="addOrUpdateDeskDialogTemplate"
		class="formDialog ui-radius ui-shadow">
		<form name="deskForm" id="deskForm" method="post">
			<div>
				<center>
					<h1>餐台编辑</h1>
				</center>
				<ul>
					<input id="deskId" type="hidden" value="0" />
					<li><label>名称</label> <input id="deskName"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text"
						value="" placeholder="如：1号桌" /></li>
					<br />
					<li><label>组名</label> <input id="deskGroupName"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text"
						value="" placeholder="如：大厅" /></li>
					<br />
					<li><label>桌号</label> <input id="deskNumber"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text"
						value="" placeholder="如：1" /></li>
					<br />
					<li><label>楼面打印机</label> <select
						id="deskCustomerNotePrinterId" name="deskCustomerNotePrinterId"
						class="ui-input ui-radius ui-shadow ui-border-solid">
					</select></li>
					<br />
					<li><label>VIP收费</label> <input id="deskChargeVIPFee"
						type="checkbox" /></li>
					<br />
					<li><label>服务费率</label> <input id="deskServiceFeeRate"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="number"
						value="" placeholder="如：0.1" /></li>
					<br />
					<li><label>可用</label> <input id="deskEnabled" type="checkbox"
						checked /></li>
					<br />
					<li><label>仅用作测试</label> <input id="deskForTesting"
						type="checkbox" /></li>
					<br />
					<li><label>序号</label> <input id="deskSort"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="number"
						value="1" placeholder="如：1" /></li>
				</ul>
			</div>
		</form>
	</div>

	<div id="addOrUpdateDishCategoryDialogTemplate"
		class="formDialog ui-radius ui-shadow">
		<form name="dishCategoryForm" id="dishCategoryForm" method="post">
			<div>
				<center>
					<h1>菜品分类编辑</h1>
				</center>
				<ul>
					<input id="formDishCategoryId" type="hidden" value="0" />
					<li><label>菜谱</label><select id="formDishMenuOptions"
						class="ui-input ui-radius ui-shadow ui-border-solid addId">
					</select></li>
					<br />
					<li><label>名称</label> <input id="formDishCategoryName"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text"
						value="" placeholder="如：海鲜" /></li>
					<br />
					<li><label>别名</label> <input id="formDishCategoryAlias"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text"
						value="" placeholder="如：Fish" /></li>
					<br />
					<li><label>序号</label> <input id="formDishCategorySort"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="number"
						value="1" placeholder="如：1" /></li>
				</ul>
			</div>
		</form>
	</div>

	<div id="addOrUpdateDishDialogTemplate"
		class="addOrUpdateDishDialog ui-radius ui-shadow">
		<form attributeId="addDish" class="addId newDish" name="addDish"
			id="addDish" action="addDish" method="post">
			<div>
				<ul style="display: none;">
					<li><input name="id" type="hidden" value="" /></li>
					<li><input name="showDishPicPath" type="hidden" value="" /></li>
				</ul>
				<div class="image">
					<img alt="菜品图片" style="width: 10em;" name="secondPicPath" src="">
				</div>
				<div style="color: red; padding: .2em">&nbsp;&nbsp;&nbsp;图片最大不超过2M,选择完图片后要点击下面的确定按钮才会保存图片!</div>
				<div class="new-line">
					菜名 <input name="name"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text"
						value="" />
				</div>
				<div class="new-line">
					别名<input name="alias"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text"
						value="" />
				</div>
				<div class="new-line">
					检索字母<input name="indexCode"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text"
						value="" />
				</div>
				<div class="new-line">
					<span>(菜名每个字的首个拼音字幕,如米饭:mf)</span>
				</div>
				<div class="new-line">
					单位 <input name="unit"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text"
						value="份" />
				</div>
				<div class="new-line">
					价格<input name="price"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="number"
						value="" />
				</div>
				<div class="new-line">
					人均消费<input name="amountPerCustomer"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="number"
						value="" />
				</div>
				<div class="new-line">
					贵宾加价 <input name="VIPFee"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="number"
						value="0" />
				</div>
				<div class="new-line">
					菜品序号 <input name="dishSort"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="number"
						value="" />
				</div>
				<div class="new-line">
					分类<select id="dishCategoryOptionsTemplate"
						attributeId="dishCategoryOptions" name="dishCategoryId"
						class="ui-input ui-radius ui-shadow ui-border-solid addId">
						<!--  <option value="1">快餐</option> -->
						<!--  <option value="2">小炒</option> -->
					</select>
				</div>
				<div class="new-line">
					部门 <select id="departmentOptionsTemplate"
						attributeId="departmentOptions" name="departmentId"
						class="ui-input ui-radius ui-shadow ui-border-solid addId">
						<!-- <option value="1">厨房</option> -->
						<!-- <option value="2">吧台</option> -->
					</select>
				</div>
				<div attributeId="dishCheckboxOptions" class="new-line addId">
					<label><input name="noCookingNote" type="checkbox" />不打厨房单</label>
					<label><input name="noCustomerNote" type="checkbox" />不打楼面单</label>
					<label><input name="noDiscount" type="checkbox" />无折扣</label> <label><input
						name="frequent" type="checkbox" />常用菜</label> <label><input
						name="autoOrder" type="checkbox" />开桌自动菜</label> <label><input
						name="editable" type="checkbox" />可编辑</label> <label><input
						name="newDish" type="checkbox" />新品</label> <label><input
						name="recommended" type="checkbox" />推荐</label> <label><input
						name="soldOut" type="checkbox" />沽清</label> <label><input
						name="enabled" type="checkbox" />启用</label> <label><input
						name="needWeigh" type="checkbox" />需输入数量</label> <label><input
						name="hasMealDealItems" type="checkbox" />套餐</label>
				</div>
				<div class="descriptionDiv">
					描述：
					<textarea name="description"
						class="ui-input ui-radius ui-shadow ui-border-solid" rows="5"
						cols="20"></textarea>
				</div>

				<hr />
				<div style="padding: 15px 0px 0px 15px;">物料清单：</div>
				<div style="text-align: center;">
					<input type="text" readonly="readonly" value="+"
						onclick="addBOMLineOnclick()"
						class="addId operatetr ui_radius ui-shadow ui-border-solid input" />
				</div>
				<div name="bom_line_tab"></div>
			</div>
		</form>
	</div>

	<div id="addOrUpdateDishTagDialogTemplate"
		class="formDialog ui-radius ui-shadow">
		<form name="dishTagForm" id="dishTagForm" method="post">
			<div>
				<center>
					<h1>菜品做法编辑</h1>
				</center>
				<ul>
					<input id="formDishTagId" type="hidden" value="0" />
					<input id="formDishTagDishId" type="hidden" value="0" />
					<li><label>名称</label> <input id="formDishTagName"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text"
						value="" placeholder="如：免辣" /></li>
					<br />
					<li><label>别名</label> <input id="formDishTagAlias"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text"
						value="" placeholder="如：avoid spicy" /></li>
					<br />
					<li><label>组名</label> <input id="formDishTagGroupName"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text"
						value="" placeholder="如：时蔬做法" /></li>
					<br />
					<li><label>单选</label> <input id="formOptionSetNoName"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="number"
						value="" placeholder="单选:填1;多选则不用填" /></li>
					<br />
					<li><label>加价</label> <input id="formDishTagPriceDelta"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="text"
						value="0" placeholder="如：2" /></li>
					<br />
					<li><label>序号</label> <input id="formDishTagSort"
						class="ui-input ui-radius ui-shadow ui-border-solid" type="number"
						value="10" placeholder="如：10" /></li>
				</ul>
			</div>
		</form>
	</div>

	<!--编辑套餐 start -->
	<div id="addOrUpdateMealDealItemDialogTemplate"
		class="formDialog ui-radius ui-shadow">
		<form attributeId="addMealDealItem" class="addId mealDealItem"
			id="addMealDealItem" name="addMealDealItem" action="addMealDealItem"
			method="post">
			<div>
				<input name="showDishPicPath" type="hidden" value="" />
				<!--"newDish" newMealDealItem -->
				<div id="mealDealItemDetail" class="mealDealItemtop"
					style="padding: 15px 0px 0px 15px;">
					套餐明细：
					<div class="image">
						<img alt="菜品图片" style="width: 10em;" name="secondPicPath" src="">
					</div>
					<div style="color: red; padding: .2em">&nbsp;&nbsp;&nbsp;图片最大不超过2M,选择完图片后要点击下面的确定按钮才会保存图片!</div>
					<table id="editDishTable">
						<tr>
							<th>套餐名</th>
							<td><input type="text" name="name"
								class="mealdealname ui_radius ui-shadow ui-border-solid ui-input" /></td>
							<th>别名</th>
							<td><input type="text" name="alias"
								class="mealdealname ui_radius ui-shadow ui-border-solid ui-input" /></td>
							<th>检索字母</th>
							<td><input type="text" name="indexCode"
								class="mealdealname ui_radius ui-shadow ui-border-solid ui-input" /></td>
							<th>单位</th>
							<td><input type="text" name="unit"
								class="mealdealname ui_radius ui-shadow ui-border-solid ui-input" /></td>
							<th>价格</th>
							<td><input type="text" name="price"
								class="mealdealname ui_radius ui-shadow ui-border-solid ui-input" /></td>
						</tr>
						<tr>
							<th>人均消费</th>
							<td><input type="number" name="amountPerCustomer" value="1"
								class="mealdealname ui_radius ui-shadow ui-border-solid ui-input" /></td>
							<th>贵宾加价</th>
							<td><input type="text" name="VIPFee"
								class="mealdealname ui_radius ui-shadow ui-border-solid ui-input" /></td>
							<th>菜品序号</th>
							<td><input type="number" name="dishSort" value="1"
								class="mealdealname ui_radius ui-shadow ui-border-solid ui-input" /></td>
							<th>分类</th>
							<td>
								<div class="new-line">
									<select id="dishCategoryOptionsMDITemplate"
										attributeId="dishCategoryOptions" id="dishCategoryOptions"
										name="dishCategoryId"
										class="ui-input ui-radius ui-shadow ui-border-solid addId">
										<!--  <option value="1">快餐</option> -->
										<!--  <option value="2">小炒</option> -->
									</select>
								</div>
							</td>
							<th>部门</th>
							<td>
								<div class="new-line">
									<select id="departmentOptionsMDITemplate"
										attributeId="departmentOptions" name="departmentId"
										class="ui-input ui-radius ui-shadow ui-border-solid addId">
										<!-- <option value="1">厨房</option> -->
										<!-- <option value="2">吧台</option> -->
									</select>
								</div>
							</td>
						</tr>
						<tr>
							<td colspan="10">
								<div attributeId="dishCheckboxOptions" class="new-line addId">
									<label><input name="noCookingNote" type="checkbox" />不打厨房单</label>
									<label><input name="noCustomerNote" type="checkbox" />不打楼面单</label>
									<label><input name="noDiscount" type="checkbox" />无折扣</label>
									<label><input name="frequent" type="checkbox" />常用菜</label> <label><input
										name="autoOrder" type="checkbox" />开桌自动菜</label> <label><input
										name="editable" type="checkbox" />可编辑</label> <label><input
										name="newDish" type="checkbox" />新品</label> <label><input
										name="recommended" type="checkbox" />推荐</label> <label><input
										name="soldOut" type="checkbox" />沽清</label> <label><input
										name="enabled" type="checkbox" />启用</label> <label><input
										name="needWeigh" type="checkbox" />需输入数量</label> <label><input
										name="hasMealDealItems" type="checkbox" />套餐</label>
								</div>
							</td>
						</tr>
						<tr>
							<th>描述：</th>
							<td colspan="7">
								<div class="descriptionDiv">
									<textarea name="description" style="width: 70%;"
										class="ui-input ui-radius ui-shadow ui-border-solid" rows="3"
										cols="50"></textarea>
								</div>
							</td>
						</tr>
					</table>
				</div>
				<hr />
				<div style="padding: 15px 0px 0px 15px;">物料清单：</div>
				<div style="text-align: center;">
					<input type="text" readonly="readonly" value="+"
						onclick="addBOMLineOnclick()"
						class="addId operatetr ui_radius ui-shadow ui-border-solid ui-input" />
				</div>
				<div name="bom_line_tab"></div>
				<input name="dishIdHide" type="hidden" value="" /> <input
					name="mdiIdHide" id="mdiIdHide" type="hidden" value="" />
				<hr />
				<div style="padding: 15px 0px 0px 15px;">
					套餐搭配：(<font color="red">提示：可输入查找</font>)
				</div>

				<div style="text-align: center;">
					<input type="text" readonly="readonly" value="+"
						onclick="addMealDealItemOnclick()"
						class="addId operatetr ui_radius ui-shadow ui-border-solid ui-input" />
					<input type="text" readonly="readonly" value="删除所选"
						onclick="deleteMealDealItemRow()"
						class="addId operatetr ui_radius ui-shadow ui-border-solid ui-input" />
				</div>
				<table attributeId="meal_deal_tab" id="meal_deal_tab" class="addId">
				</table>
			</div>
		</form>
	</div>


	<!--编辑套餐end -->

	<script src="../js/vendor/jquery-1.10.1.min.js"></script>
	<script src="../js/jquery.modal.js"></script>
	<script type="text/javascript"
		src="../js/vendor/jquery.i18n.properties-1.0.9.js"></script>
	<script src="../js/dishManagementHome.js"></script>
	<script type="text/javascript"
		src="../js/vendor/jquery.uploadify-3.1.min.js"></script>
</body>
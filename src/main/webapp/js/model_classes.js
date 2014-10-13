function Department() {
	this.id = {};
	this.storeId = {};
	this.cookingNotePrinterId = {};
	this.delivererNotePrinterId = {};
	this.secondaryDelivererNotePrinterId = {};
	this.name = {};
	this.sliceCookingNotes = {};
}

function Desk() {
	this.id = {};
	this.storeId = {};
	this.name = {};
	this.groupName = {};
	this.number = {};
	this.vip = {};
	this.serviceFeeRate = {};
	this.forTesting = {};
	this.enabled = {};
	this.sort = {};
}

function DiscountRule() {
	this.id = {};
	this.storeId = {};
	this.name = {};
	this.value = {};
	this.discountRate = {};
	this.level = {};
	this.noOverallDiscount = {};
}

function Dish() {
	this.id = {};
	this.departmentId = {};
	this.dishCategoryId = {};
	this.name = {};
	this.alias = {};
	this.description = {};
	this.noCookingNote = {};
	this.picPath = {};
	this.unit = {};
	this.price = {};
	this.vipfee = {};
	this.noDiscount = {};
	this.amountPerCustomer = {};
	this.frequent = {};
	this.autoOrder = {};
	this.editable = {};
	this.newDish = {};
	this.recommended = {};
	this.soldOut = {};
	this.dishOptionSets = [ new DishOptionSet() ];	
}

function DishCategory() {
	this.id = {};
	this.menuId = {};
	this.name = {};
	this.alias = {};
	this.sort = {};
	this.dishes = [ new Dish() ];
}

function DishOptionSet() {
	this.optionSetNo = {};
	this.dishTags = [ new DishTag() ];
}

function DishOrder() {
	this.id = {};
	this.storeId = {};
	this.deskId = {};
	this.creatorEmployeeId = {};
	this.editorEmployeeId = {};
	this.createTime = {};
	this.lockTime = {};
	this.deskName = {};
	this.serialNumber = {};	
	this.customerCount = {};
	this.state = {};
	this.totalPrice = {};
	this.discountRate = {};
	this.discountedPrice = {};
	this.serviceFeeRate = {};
	this.serviceFee = {};
	this.finalPrice = {};
	this.archivedTime = {};
	this.userAccountId = {};
	this.orderItems = [ new OrderItem() ];
}

function DishTag() {
	this.id = {};
	this.storeId = {};
	this.dishId = {};
	this.departmentId = {};
	this.name = {};
	this.alias = {};
	this.groupNumber = {};
	this.groupName = {};
	this.unit = {};
	this.priceDelta = {};
	this.amountPerDish = {};
	this.sort = {};
}

function DishTagGroup() {
	this.groupName = {};
	this.dishTags = [ new DishTag() ];
}

function DishUnit() {
	this.id = {};
	this.storeId = {};
	this.name = {};
	this.groupNumber = {};
	this.exchangeRate = {};
	this.sort = {};
}

function Menu() {
	this.id = {};
	this.storeId = {};
	this.name = {};
	this.sort = {};
	this.dishCategories = [ new DishCategory() ];
}

function PaymentType() {
	this.id = {};
	this.storeId = {};
	this.name = {};
	this.exchangeRate = {};
	this.initValueRatio = {};
	this.prepaid = {};
	this.sort = {};
}

function OrderItem() {
	this.id = {};
	this.dishOrderId = {};
	this.departmentId = {};
	this.dishId = {};
	this.discountRuleId = {};
	this.createTime = {};
	this.dishName = {};	
	this.orgUnit = {};
	this.unit = {};
	this.editable = {};
	this.price = {};
	this.amount = {};
	this.suspended = {};
	this.noCookingNote = {};
	this.state = {};
	this.memo = {};
}

function OrderItemTag(){
	this.id = {};
	this.orderItemId = {};
	this.dishTagId = {};
	this.departmentId = {};
	this.name = {};
	this.unit = {};
	this.priceDelta = {};
	this.amount = {};
}

function PaymentType(){
	this.id = {};
	this.storeId = {};
	this.name = {};
	this.exchangeRate = {};
	this.initValueRatio = {};
	this.prepaid = {};
	this.sort = {};
}

function PayRecord(){
	this.id = {};
	this.dishOrderId = {};
	this.paymentTypeId = {};
	this.typeName = {};
	this.exchangeRate = {};
	this.amount = {};
	this.prepaid = {};
	this.couponId = {};
}

function Store() {
	this.id = {};
	this.headStoreId = {};
	this.name = {};
	this.address = {};
	this.discountRateCSV = {};
	this.serviceFeeRateCSV = {};
	this.defaultDishUnitName = {};
	this.suspendedText = {};
	this.customerCountHintText = {};
	this.checkoutPosPrinterId = {};
	this.backupCheckoutPosPrintId = {};
	this.skipPayingState = {};
	this.dishPictureBaseUrl = {};
	this.description = {};
}

function StoreData() {
	this.id = 0;
	this.store = new Store();
	this.desks = [ new Desk() ];
	this.paymentTypes = [ new PaymentType() ];
	this.discountRules = [ new DiscountRules() ];
	this.departments = [ new Department() ];
	this.commonDishTags = [ new DishTag() ];
	this.menus = [ new Menus() ];
}

function ReportData() {
	this.dishOrderCount = {};
	this.totalPrice = {};
	this.discountedTotalPrice = {};
	this.totalServiceFee = {};
	this.totalIncome = {};
	this.payRecordInfos = [ new PayRecordInfo() ];
}

function PayRecordInfo() {
	this.name = {};
	this.count = {};
	this.totalPrice = {};
	this.exchangeRate = {};
	this.finalPrice = {};
}

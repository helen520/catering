<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>

<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
<meta name="format-detection" content="telephone=no">
<title>$.i18n.prop('string_huiYuanXinXi')</title>
<link rel="stylesheet" href="../css/memberPage.css">
<script type="text/javascript" src="../js/vendor/jquery-1.10.1.min.js"></script>
<script type="text/javascript"
	src="../js/vendor/jquery.i18n.properties-1.0.9.js"></script>
<style>
abbr,article,aside,audio,canvas,datalist,details,dialog,eventsource,figure,figcaption,footer,header,hgroup,mark,menu,meter,nav,output,progress,section,small,time,video,legend
	{
	display: block;
}
</style>
<script type="text/javascript">
	var isTimeout = true;
	var isSendMsgError = false;
    var count = 60; 
	function ajaxSendMsg() {
		//发送短信
		if (isTimeout) {
			var userId = $('#userId').val();
			var tel = $.trim($('#phone').val());
			var storeId = $('#storeId').val();
			var reMobile = new RegExp(/^(13[0-9]|15[0-9]|18[0-9])\d{8}$/);
			if (!reMobile.test(tel)) {
				alert($.i18n.prop('string_qingShuRuZhengQueDeShouJiHaoMa'));
				isTimeout = true;
				return false;
			}
			if (isNaN(tel)) {
				alert($.i18n.prop('string_shouJiHaoMaBiXuShiShuZi'));
				isTimeout = true;
				return false;
			}
			isTimeout = false;
			setTimeout(BtnCount, 1000);
			$.ajax({
				url : 'sendMsg',
				data : {
					userId : userId,
					telephone : tel,
					storeId:storeId
				},
				type : 'POST',
				dataType : 'text',
				error : function() {
					alert($.i18n.prop('string_faSongShiBai'));
					isSendMsgError = true;
				},
				success : function(result) {
					if (result =="exist") {
						alert("该手机号码已经注册为本店的会员,无法再次注册!请更换手机号码!");
						isSendMsgError = true;
					}
				}
			});
		};
	}
	function BtnCount() {
		if (count == 0 || isSendMsgError) {
			$("#checkingPhone").attr("class","checking");
			isTimeout = true;
			isSendMsgError = false;
			count =60;
	        document.getElementById("checkingPhone").innerHTML="<span>"+$.i18n.prop('string_faSongYanZhengMa')+"</span>";
	        clearTimeout(BtnCount); 
        }else {
        	$("#checkingPhone").attr("class","checked");
            count--;
			document.getElementById("checkingPhone").innerHTML="<span>(" + count.toString() + ")"+$.i18n.prop('string_miaoHouZhongFa')+"</span>";
            setTimeout(BtnCount, 1000);
        }
	};
	
	function ajaxRegisterMember(){
		var userId = $('#userId').val();
		var storeId = $('#storeId').val();
		var tel = $.trim($('#phone').val());
		var captcha = $.trim($('#captcha').val());
		var isBooking = $('#isBooking').val();
		var isOrdering = $('#isOrdering').val();

		var reMobile = new RegExp(/^(13[0-9]|15[0-9]|18[0-9])\d{8}$/);
		if (!reMobile.test(tel)) {
			alert($.i18n.prop('string_qingShuRuZhengQueDeShouJiHaoMa'));
			return ;
		}
		if (isNaN(tel)) {
			alert($.i18n.prop('string_shouJiHaoMaBiXuShiShuZi'));
			return ;
		}
		if (captcha == "") {
			alert($.i18n.prop('string_qingShuRuYanZhengMa'));
			return ;
		}
		isTimeout = false;
		$.ajax({
			url : 'submitRegisterMember',
			data : {
				userId : userId,
				storeId : storeId,
				phone : tel,
				captcha : captcha,
				isBooking : isBooking,
				isOrdering : isOrdering
			},
			type : 'POST',
			dataType : 'text',
			error : function() {
				alert($.i18n.prop('string_lingQuShiBaiQingShaoHouZaiShi'));
			},
			success : function(result) {
				if(result == ""){
					alert($.i18n.prop('string_qingShuRuZhengQueDeYanZhengMa'));
				}else{
					window.location.href = "../"+result;
				}
			}
		});
	};
	function showDetailsInfo(id){
		var detailsInfoDivs = $("[name = showDetailsInfo]");
		var detailsInfoDivShow =document.getElementById("showDetailsInfo_"+id);
		var isShowed = false;
		if(!detailsInfoDivShow){
			return;
		}
		if(detailsInfoDivShow.style.display=="block"){
			isShowed = true;
		}
		for ( var index = 0; index < detailsInfoDivs.length; index++) {
			var detailsInfoDiv = detailsInfoDivs.slice(index, index + 1);
			detailsInfoDiv.attr("style","display: none;");
		}
		
		if(!isShowed){
			detailsInfoDivShow.style.display="block";
		}
	}
	function dismissConfirm(){
		var couponId = $("#couponId");
		var confirm =document.getElementById("confirm");
		var confirmBackground =document.getElementById("confirmBackground");
		if(confirm.style.display=="block"){
			confirm.style.display="none";
		}
		if(confirmBackground.style.display=="block"){
			confirmBackground.style.display="none";
		}
		couponId.val(0);
	};
	function showConfirm(id){
		var couponId = $("#couponId");
		var confirm =document.getElementById("confirm");
		var confirmBackground =document.getElementById("confirmBackground");
		couponId.val(id);
		if(confirmBackground.style.display=="none"){
			confirmBackground.style.display="block";
		}
		if(confirm.style.display=="none"||confirm.style.display==""){
			confirm.style.display="block";
		}
	};
	function useCoupon(){
		var couponId = Number($("#couponId").val());
		var useCouponBtn = $("#useCouponBtn_"+couponId);
		var userId = $('#userId').val();
		if (couponId == 0) {
			alert($.i18n.prop('string_youHuiQuanBuCunZaiQingShuaXinYeMian'));
			window.location.href = "";
		}
		$.ajax({
			url : 'useCoupon',
			data : {
				couponId : couponId,
				userId : userId
			},
			type : "POST",
			dataType : "text",
			error : function(){
				alert($.i18n.prop('string_shiYongChuCuoQingShaoHouZaiShi'));
			},
			success : function(result){
				if(result == "")
					alert($.i18n.prop('string_youHuiQuanBuCunZaiQingShuaXinYeMian'));
				useCouponBtn.attr("onclick","");
				useCouponBtn.attr("class","show");
				useCouponBtn.html($.i18n.prop('string_chuShiBenYeShiYongTeQuan'));
				dismissConfirm();
			}
		});
	};

	$(document).ready(function(){
		$(function(){
			jQuery.i18n.properties({
				name:'strings', //资源文件名称
				path:'../resources/i18n/', //资源文件路径
				mode:'map', //用Map的方式使用资源文件中的值
				callback: function() {
					document.title = $.i18n.prop('string_huiYuanXinXi');	
					$("#stringHuiYuanKa").text($.i18n.prop('string_huiYuanKa'));
					$("#stringHuiYuanZunXiangDuoZhongChaoZhiTeQuan").text($.i18n.prop('string_huiYuanZunXiangDuoZhongChaoZhiTeQuan'));
					$("#stringYanZhengShouJiHaoMaLingQuHuiYuanKa").text($.i18n.prop('string_yanZhengShouJiHaoMaLingQuHuiYuanKa'));
					$("#stringShouJiHao").text($.i18n.prop('string_shouJiHao'));
					$("#stringYanZhengMa").text($.i18n.prop('string_yanZhengMa'));
					$("#checkingPhone").text($.i18n.prop('string_faSongYanZhengMa'));//发送验证码
					$("#stringLingQuHuiYuanKa").text($.i18n.prop('string_lingQuHuiYuanKa'));
					$("#stringHuiYuanKaHao").text($.i18n.prop('string_huiYuanKaHao'));
					$("#stringHuiYuanKa1").text($.i18n.prop('string_huiYuanKa'));
					$("#stringShiYongShiXiangFuWuYuanChuShiCiKa").text($.i18n.prop('string_shiYongShiXiangFuWuYuanChuShiCiKa'));
					$("#stringXiangQingShuoMing").text($.i18n.prop('string_xiangQingShuoMing'));
					$("#stringYouXiaoQi").text($.i18n.prop('string_youXiaoQi'));
					$("#stringZhi").text($.i18n.prop('string_zhi'));
					$("#stringJiFen").text($.i18n.prop('string_jiFen'));
					$("#stringFen").text($.i18n.prop('string_fen_one'));
					$("#stringXiangQingShuoMing1").text($.i18n.prop('string_xiangQingShuoMing'));
					$("#stringYuCunYuE").text($.i18n.prop('string_yuCunYuE'));
					$("#stringYuan").text($.i18n.prop('string_yuan'));
					$("#stringXiangQingShuoMing2").text($.i18n.prop('string_xiangQingShuoMing'));
					$("#stringLiJiShiYong").text($.i18n.prop('string_liJiShiYong'));
					$("#stringXiangQingShuoMing3").text($.i18n.prop('string_xiangQingShuoMing'));
					$("#stringYouXiaoQi1").text($.i18n.prop('string_youXiaoQi'));
					$("#stringZhi1").text($.i18n.prop('string_zhi'));
					$("#stringKeDiXiao").text($.i18n.prop('string_keDiXiao'));
					$("#stringYuan1").text($.i18n.prop('string_yuan'));
					$("#stringTiShi").text($.i18n.prop('string_tiShi'));
					$("#stringBenTeQuanZhiNengShiYongYiCiShiFouLiJiShiYong").text($.i18n.prop('string_benTeQuanZhiNengShiYongYiCiShiFouLiJiShiYong'));
					$("#stringFou").text($.i18n.prop('string_fou'));
					$("#stringShi").text($.i18n.prop('string_shi'));
				}
			});
		});
	});
</script>
</head>
<body id="page_card" class="">
	<div id="mappContainer">
		<input id="userId" hidden="hidden" value="${userAccount.id}">
		<input id="storeId" hidden="hidden" value="${store.id}"> <input
			id="isBooking" hidden="hidden" value="${isBooking}"> <input
			id="isOrdering" hidden="hidden" value="${isOrdering}">
		<c:choose>
			<c:when test="${isNotMember}">
				<div class="inner root">
					<div class="center cardCtn">
						<div class="pdo msk1"
							style="width: 313.5px; height: 135px; top: 88px; left: 0; z-index: 3; background: url(../images/msk1.png) no-repeat 0 0, url(../images/bk_repeat1_1.jpg) repeat-x 0 45px, url(../images/bk_repeat1_1.jpg) repeat-x 0 68px; -webkit-background-size: 312.5px 45px, 313px 23.5px, 313px 23.5px; background-size: 312.5px 45px, 313px 23.5px, 313px 23.5px;"></div>
						<div class="pdo card"
							style="background: url(../images/card1.png) no-repeat 0 0; -webkit-background-size: 267px 159px; background-size: 267px 159px;">
							<img src="../images/spacer.gif" class="logo"> <strong
								style="position: absolute; left: 30px; display: inline-block; height: 40px; top: 60px; line-height: 24px; font-size: 20px;">
								<span
								style="color: #670700; text-shadow: 0 1px #d95b4d; display: inline-block; text-align: left;">${store.name}</span>
							</strong> <strong
								style="position: absolute; right: 15px; inline-block; top: 10px; line-height: 24px; font-size: 10px;">
								<span
								style="color: #ff0000; text-shadow: 0 1px #d95b4d; display: inline-block; text-align: left;"
								id="stringHuiYuanKa">会员卡</span>
							</strong>
						</div>
					</div>
					<br>
					<div style="text-align: left;; margin-left: 5px">
						<c:if test="${isBooking or isOrdering}">
							<div>
								<span style="margin-left: 2em; font-size: 23px; color: red;">
									请先注册为本店会员,便可享受在线预定和店内点餐功能!</span>
							</div>
						</c:if>
						<span style="margin-left: 10px; font-size: 20px"
							id="stringHuiYuanZunXiangDuoZhongChaoZhiTeQuan">
							会员尊享多种超值特权</span>
						<ul style="margin-left: 25px; margin-top: 10px">
							<li style="height: 30px"
								id="stringYanZhengShouJiHaoMaLingQuHuiYuanKa">验证手机号码领取会员卡</li>
							<li style="height: 30px"><em id="stringShouJiHao">手机号</em>:&nbsp;
								<input id="phone" value="${phone}" type="tel"
								style="width: 100px"> <a class="checking"
								id="checkingPhone" style="background-color: gray;"
								onclick="ajaxSendMsg();">发送验证码</a></li>
							<li style="height: 40px"><em id="stringYanZhengMa">验证码</em>:&nbsp;
								<input id="captcha" type="tel" style="width: 60px"> <a
								class="yes" id="stringLingQuHuiYuanKa"
								style="background-color: gray;" onclick="ajaxRegisterMember();">领取会员卡</a>
							</li>
						</ul>
					</div>
				</div>
			</c:when>
			<c:otherwise>
				<div class="inner root">
					<div class="card"
						style="background: url(../images/card1.png) no-repeat 0 0; -webkit-background-size: 267px 159px; background-size: 267px 159px;">
						<img src="../images/spacer.gif" class="logo"> <strong
							class="pdo verify"> <span
							style="color: #670700; text-shadow: 0 1px #d95b4d;"> <em
								style="color: #670700; text-shadow: 0 1px #d95b4d;"><span
									id="stringHuiYuanKaHao">会员卡号</span></em>${userAccount.memberCardNo}
						</span>
						</strong> <strong
							style="position: absolute; left: 30px; display: inline-block; height: 40px; top: 60px; line-height: 24px; font-size: 20px;">
							<span
							style="color: #670700; text-shadow: 0 1px #d95b4d; display: inline-block; text-align: left;">${store.name}</span>
						</strong> <strong
							style="position: absolute; right: 15px; inline-block; top: 10px; line-height: 24px; font-size: 10px;">
							<span
							style="color: #a78767; text-shadow: 0 1px #e4caad; display: inline-block; text-align: left;"
							id="stringHuiYuanKa1">会员卡</span>
						</strong>
					</div>
					<p>
						<span id="stringShiYongShiXiangFuWuYuanChuShiCiKa">使用时向服务员出示此卡</span>
					</p>
					<ul class="round" id="publics">
						<c:forEach items="${memberPoliciesDOBFalseText}" var="item">
							<li class="power "
								style="background: url(../images/icon_power2.png) no-repeat 9px 14px; -webkit-background-size: 24px 21px; background-size: 24px 21px;">
								<article>
									<a class="oneline close" onclick="showDetailsInfo(${item.id})">${item.title}</a>
								</article>
								<div id="showDetailsInfo_${item.id}" name="showDetailsInfo"
									style="display: none;">
									<c:if test="${item.subTitle == '' || item.subTitle == null}">
										<b><span id="stringXiangQingShuoMing">详情说明</span></b>
									</c:if>
									${item.subTitle}
									<ul>
										<li><span id="stringYouXiaoQi">有效期</span>：${item.startDateStr}<span
											id="stringZhi">至</span>${item.validDate}</li>
										<li>${item.text}</li>
									</ul>
								</div>
							</li>
						</c:forEach>
					</ul>
					<ul class="round" id="customs">
						<c:forEach items="${memberPoliciesDOBFalseUrl}" var="item">
							<li><a href="${item.url}">${item.title}</a></li>
						</c:forEach>
					</ul>
					<ul class="round" id="privates">
						<li class="power"
							style="background: url(../images/icon_score.png) no-repeat 9px 14px; -webkit-background-size: 24px 21px; background-size: 24px 21px;">
							<article>
								<a class="oneline close" onclick="showDetailsInfo(1)"><em
									id="stringJiFen">积分</em>: ${userAccount.point}<em
									id="stringJiFen">分</em></a>
							</article> <c:if
								test="${store.pointingRules != '' && store.pointingRules != null}">
								<div id="showDetailsInfo_1" name="showDetailsInfo"
									style="display: none;">
									<b><span id="stringXiangQingShuoMing1">详情说明</span></b>
									<ul>
										<li>${store.pointingRules}</li>
									</ul>
								</div>
							</c:if>
						</li>
						<li class="power"
							style="background: url(../images/icon_balance.png) no-repeat 9px 14px; -webkit-background-size: 24px 21px; background-size: 24px 21px;">
							<article>
								<a class="oneline close" onclick="showDetailsInfo(2)"><em
									id="stringYuCunYuE">预存余额</em>: ${userAccount.balance }<em
									id="stringYuan">元</em></a>
							</article>
							<div id="showDetailsInfo_2" name="showDetailsInfo"
								style="display: none;">
								<c:if
									test="${store.cashAccountRules != '' && store.cashAccountRules != null}">
									<b><span id="stringXiangQingShuoMing2">详情说明</span></b>
									<ul>
										<li>${store.cashAccountRules}</li>
									</ul>
								</c:if>
								<c:if test="${operationLogs  != null && !empty operationLogs}">
									<b><span>充值消费记录</span></b>
									<ul>
										<c:forEach items="${operationLogs}" var="operationLog">
											<li>时间 : ${operationLog.createTimeStr }
												${operationLog.dataSnapShot }</li>
										</c:forEach>
									</ul>
								</c:if>
							</div>
						</li>
						<c:forEach items="${coupons}" var="coupon">
							<li class="power"
								style="background: url(../images/icon_power1.png) no-repeat 9px 14px; -webkit-background-size: 24px 21px; background-size: 24px 21px;">
								<article>
									<a class="oneline close"
										onclick="showDetailsInfo(${coupon.id})">${coupon.title}</a>
								</article>
								<div id="showDetailsInfo_${coupon.id}" name="showDetailsInfo"
									style="display: none;">
									<c:if test="${coupon.value == '' || coupon.value <= 0}">
										<a id="useCouponBtn_${coupon.id}" class="use"
											onclick="showConfirm(${coupon.id})"><span
											id="stringLiJiShiYong">立即使用</span></a>
									</c:if>
									<c:if
										test="${coupon.subTitle == '' || coupon.subTitle == null}">
										<b><span id="stringXiangQingShuoMing3">详情说明</span></b>
									</c:if>
									${coupon.subTitle}
									<ul>
										<li><span id="stringYouXiaoQi1">有效期</span>：${coupon.startDateStr}<span
											id="stringZhi1">至</span>${coupon.validDate}</li>
										<c:if test="${coupon.value != 0}">
											<li><span id="stringKeDiXiao">可抵消</span>:${coupon.value}<span
												id="stringYuan1">元</span></li>
										</c:if>
										<li>${coupon.text}</li>
									</ul>
								</div>
							</li>
						</c:forEach>
					</ul>
					<ul class="round">
						<c:forEach items="${memberPoliciesDOBTrueUrl}" var="item">
							<li><a class="bind" href="${item.url}">${item.title}</a></li>
						</c:forEach>
					</ul>
				</div>
			</c:otherwise>
		</c:choose>
		<div id="confirmBackground" onclick="dismissConfirm()"
			style="background-color: #000; transition: opacity .6s ease-in-out; opacity: .6; width: 100%; height: 100%; text-align: center; position: fixed; left: 0; bottom: 0; display: none;"></div>
		<input id="couponId" hidden="hidden">
		<div id="confirm" class="confirm">
			<article class="article">
				<h1
					style="margin: 4px 1px 0 1px; line-height: 45px; text-align: center; font-size: 16px; text-shadow: 0 1px #f1f1f1; border-bottom: 1px solid #a6a6a6; box-shadow: 0 1px 1px #e3e3e3;">
					<span id="stringTiShi">提示</span>
				</h1>
				<p
					style="height: 57px; padding: 8px 0 2px 0; line-height: 28px; font-size: 14px; text-align: center; text-shadow: 0 1px #efefef; color: #151515;">
					<span id="stringBenTeQuanZhiNengShiYongYiCiShiFouLiJiShiYong">本特权只能使用一次,
						是否立即使用?</span>
				</p>
				<div>
					<a onclick="dismissConfirm()" class="confirmNo"><span
						id="stringFou">否</span></a> <a onclick="useCoupon()"
						class="confirmYes"><span id="stringShi">是</span></a>
				</div>
			</article>
		</div>
	</div>
</body>
</html>
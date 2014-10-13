<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ page language="java" contentType="text/html;charset-utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<title>菜式销售统计</title>
	<script type="text/javascript" src="../js/vendor/jquery-1.10.1.min.js"></script>
	<script type="text/javascript" src="../js/vendor/jquery.i18n.properties-1.0.9.js"></script>
	<script type="text/javascript">
$(document).ready(function(){
	$(function(){
		jQuery.i18n.properties({
			name:'strings', //资源文件名称
			path:'../resources/i18n/', //资源文件路径
			mode:'map', //用Map的方式使用资源文件中的值
			callback: function() {
				var title=$.i18n.prop('string_caiShiXiaoShouTongJi');
				document.title=title;
				$("h3").text(title);
				//table
				var trobj=$("#DishSellStatsTr").get(0);
				trobj.children[0].innerText=
					$.i18n.prop('string_caiShi');
				trobj.children[1].innerText=
					$.i18n.prop('string_chuPinShu');
				trobj.children[2].innerText=
					$.i18n.prop('string_zheQianZongJia');
				trobj.children[3].innerText=
					$.i18n.prop('string_zheHouZongJia');	
			}
		});

		});
});
</script>
<style>
body {
	width: 800px;
	margin: 0px auto;
	padding-bottom: 200px;
}

table {
	border: 1px solid #999;
	border-spacing: 0px;
}

th {
	border: 1px solid #999;
	padding: 2px;
	background-color: #DDD;
}

td {
	border: 1px solid #999;
	padding: 2px;
}

input[type=text] {
	width: 100px;
}
</style>
</head>
<body>
	<h2 id="GoBackDish2DishCategory">
		<a id="GoBackLink"
			href="dishCategorySellStats?storeId=${storeId}&startDate=${startDate}&endDate=${endDate}">返回</a>
	</h2>
	<h3>菜式销售统计</h3>
	<br />
	<table id="DishSellStatsTable" summary="">
		<thead>
			<tr id="DishSellStatsTr">
				<th>菜式</th>
				<th>出品数</th>
				<th>折前总价</th>
				<th>折后总价</th>
			</tr>
		</thead>
		<tbody id="DishSellStatsTBody">
			<c:forEach items="${sellStatObject}" var="sellStat">

				<tr id="DishOrderTr">
					<td><c:choose>
							<c:when test="${sellStat.amount>0}">
								<a
									href='dishSellDetail?storeId=${storeId}&dishId=${sellStat.itemID }&dishCategoryId=${dishCategoryId}&startDate=${startDate}&endDate=${endDate}'>
									${sellStat.itemName} </a>

							</c:when>
							<c:otherwise>
						${sellStat.itemName}
						</c:otherwise>
						</c:choose></td>
					<td><fmt:formatNumber value="${sellStat.amount}"
							pattern="#.##" maxFractionDigits="2"></fmt:formatNumber></td>
					<td><fmt:formatNumber value="${sellStat.totalOrgPrice}"
							pattern="#.##" maxFractionDigits="2"></fmt:formatNumber></td>
					<td><fmt:formatNumber value="${sellStat.totalPrice}"
							pattern="#.##" maxFractionDigits="2"></fmt:formatNumber></td>
				</tr>


			</c:forEach>
		</tbody>
	</table>
</body>
</html>

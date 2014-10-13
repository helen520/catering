<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page language="java" contentType="text/html;charset-utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<title>菜式销售明细</title>
<script type="text/javascript" src="../js/vendor/jquery-1.10.1.min.js"></script>
<script type="text/javascript"
	src="../js/vendor/jquery.i18n.properties-1.0.9.js"></script>
<script type="text/javascript">
	$(document).ready(
			function() {
				$(function() {
					jQuery.i18n.properties({
						name : 'strings', //资源文件名称
						path : '../resources/i18n/', //资源文件路径
						mode : 'map', //用Map的方式使用资源文件中的值
						callback : function() {
							var title = $.i18n
									.prop('string_caiShiXiaoShouMingXi');
							document.title = title;
							$("h3").text(title);
							//table
							var trobj = $("#OrderItemsTr").get(0);
							trobj.children[0].innerText = $.i18n
									.prop('string_xuHao');
							trobj.children[2].innerText = $.i18n
									.prop('string_caiMing');
							trobj.children[3].innerText = $.i18n
									.prop('string_shuliang');
							trobj.children[4].innerText = $.i18n
									.prop('string_danWei');
							trobj.children[5].innerText = $.i18n
									.prop('string_xiaDan');
							trobj.children[6].innerText = $.i18n
									.prop('string_taiHao');

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
			href="dishSellStats?storeId=${storeId}&dishCategoryId=${dishCategoryId}&startDate=${startDate}&endDate=${endDate}">返回</a>
	</h2>
	<h3>菜式销售明细</h3>
	<table id="OrderItemsTable" summary="">
		<thead>
			<tr id="OrderItemsTr">
				<th>序号</th>
				<th>ID</th>
				<th>菜名</th>
				<th>数量</th>
				<th>单位</th>
				<th>下单</th>
				<th>台号</th>
			</tr>
		</thead>
		<tbody id="OrderItemsTBody">
			<c:forEach items="${sellStatObject}" var="sellStat"
				varStatus="sellStatIndex">

				<tr>
					<td align="center">${(sellStatIndex.index)+1}</td>
					<td>${sellStat.id}</td>
					<td>${sellStat.dishName}</td>
					<td>${sellStat.amount}</td>
					<td>${sellStat.unit}</td>
					<td>${sellStat.memo}</td>
					<td>${sellStat.deskName}</td>
				</tr>
			</c:forEach>
		</tbody>
	</table>

</body>
</html>
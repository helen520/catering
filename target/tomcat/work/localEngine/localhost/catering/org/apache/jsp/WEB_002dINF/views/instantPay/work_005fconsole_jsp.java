package org.apache.jsp.WEB_002dINF.views.instantPay;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class work_005fconsole_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static final JspFactory _jspxFactory = JspFactory.getDefaultFactory();

  private static java.util.List _jspx_dependants;

  private javax.el.ExpressionFactory _el_expressionfactory;
  private org.apache.AnnotationProcessor _jsp_annotationprocessor;

  public Object getDependants() {
    return _jspx_dependants;
  }

  public void _jspInit() {
    _el_expressionfactory = _jspxFactory.getJspApplicationContext(getServletConfig().getServletContext()).getExpressionFactory();
    _jsp_annotationprocessor = (org.apache.AnnotationProcessor) getServletConfig().getServletContext().getAttribute(org.apache.AnnotationProcessor.class.getName());
  }

  public void _jspDestroy() {
  }

  public void _jspService(HttpServletRequest request, HttpServletResponse response)
        throws java.io.IOException, ServletException {

    PageContext pageContext = null;
    HttpSession session = null;
    ServletContext application = null;
    ServletConfig config = null;
    JspWriter out = null;
    Object page = this;
    JspWriter _jspx_out = null;
    PageContext _jspx_page_context = null;


    try {
      response.setContentType("text/html; charset=utf-8");
      pageContext = _jspxFactory.getPageContext(this, request, response,
      			null, true, 8192, true);
      _jspx_page_context = pageContext;
      application = pageContext.getServletContext();
      config = pageContext.getServletConfig();
      session = pageContext.getSession();
      out = pageContext.getOut();
      _jspx_out = out;

      out.write("\n");
      out.write("\n");
      out.write("<!DOCTYPE html>\n");
      out.write("<html>\n");
      out.write("<head>\n");
      out.write("<meta charset=\"utf-8\">\n");
      out.write("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n");
      out.write("<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge,chrome=1\">\n");
      out.write("<title>CATERING</title>\n");
      out.write("<meta name=\"description\" content=\"\" />\n");
      out.write("<meta name=\"viewport\"\n");
      out.write("\tcontent=\"width=device-width,initial-scale=1,user-scalable=no,maximum-scale=1\" />\n");
      out.write("<link rel=\"shortcut icon\" href=\"../favicon.ico\" />\n");
      out.write("<link rel=\"stylesheet\" href=\"../css/normalize.css\" />\n");
      out.write("<link rel=\"stylesheet\" href=\"../css/instantPay/work_console.css\" />\n");
      out.write("<link rel=\"stylesheet\" href=\"../css/instantPay/dish_view.css\" />\n");
      out.write("<link rel=\"stylesheet\" href=\"../css/instantPay/checkout_view.css\">\n");
      out.write("<link rel=\"stylesheet\" href=\"../css/instantPay/dish_order_list_view.css\" />\n");
      out.write("<link rel=\"stylesheet\" href=\"../css/instantPay/dish_picker.css\" />\n");
      out.write("<link rel=\"stylesheet\" href=\"../css/order_item_list.css\" />\n");
      out.write("<link rel=\"stylesheet\" href=\"../css/dialogs.css\" />\n");
      out.write("\n");
      out.write("<script type=\"text/javascript\" src=\"../js/vendor/jquery-1.10.1.min.js\"></script>\n");
      out.write("<script type=\"text/javascript\">\n");
      out.write("\tvar $storeId = 0;\n");
      out.write("\t$(function() {\n");
      out.write("\t\tvar index = window.location.pathname.lastIndexOf(\"/\");\n");
      out.write("\t\t$storeId = window.location.pathname.substring(index + 1);\n");
      out.write("\t\tnew WorkConsole();\n");
      out.write("\t});\n");
      out.write("</script>\n");
      out.write("</head>\n");
      out.write("<body style=\"font-weight: bold;\">\n");
      out.write("\t<div id=\"dishView\" style=\"display: none\">\n");
      out.write("\t\t<div id=\"dishViewLeft\" class=\"dishPicker\"></div>\n");
      out.write("\t\t<div id=\"dishViewBottomLeft\">\n");
      out.write("\t\t\t<div style=\"font-size: 14px; text-align: center;\">\n");
      out.write("\t\t\t\t<span id=\"dv_string_total_price\"> 总价</span> : <span\n");
      out.write("\t\t\t\t\tid=\"totalPriceLabel\">0</span>\n");
      out.write("\t\t\t</div>\n");
      out.write("\t\t\t<hr />\n");
      out.write("\t\t\t<div>\n");
      out.write("\t\t\t\t<div id=\"leftCmdButtonContainer\">\n");
      out.write("\t\t\t\t\t<div id=\"cancelDishOrderButton\" class=\"dishOrderCmdButton\">取消点菜</div>\n");
      out.write("\t\t\t\t\t<div id=\"switchToDishOrderListViewButton\"\n");
      out.write("\t\t\t\t\t\tclass=\"dishOrderCmdButton\">订单列表</div>\n");
      out.write("\t\t\t\t\t<div id=\"newDishOrderButton\" class=\"dishOrderCmdButton\">新订单</div>\n");
      out.write("\t\t\t\t</div>\n");
      out.write("\t\t\t\t<div id=\"centerCmdButtonContainer\">\n");
      out.write("\t\t\t\t\t<div id=\"dishOrderTagsButton\" class=\"dishOrderCmdButton\">整单做法</div>\n");
      out.write("\t\t\t\t\t<label id=\"dishOrderTagTextLabel\"></label>\n");
      out.write("\t\t\t\t</div>\n");
      out.write("\t\t\t\t<div id=\"rightCmdButtonContainer\">\n");
      out.write("\t\t\t\t\t<div id=\"switchToCheckoutViewButton\" class=\"dishOrderCmdButton\">结账</div>\n");
      out.write("\t\t\t\t</div>\n");
      out.write("\t\t\t</div>\n");
      out.write("\t\t</div>\n");
      out.write("\t\t<div id=\"dishViewRight\">\n");
      out.write("\t\t\t<div id=\"dishOrderItemCmdPanel\"></div>\n");
      out.write("\t\t\t<div id=\"dishOrderItemList\" class=\"overthrow\"></div>\n");
      out.write("\t\t\t<div id=\"loginInfoDiv\" class=\"overthrow\">\n");
      out.write("\t\t\t\t操作员:<label id=\"employeeNameLabel\"></label>\n");
      out.write("\t\t\t\t<div id=\"logoutEmployeeButton\" class=\"dishOrderCmdButton\">登出</div>\n");
      out.write("\t\t\t</div>\n");
      out.write("\t\t</div>\n");
      out.write("\t</div>\n");
      out.write("\t<div id=\"checkoutView\" style=\"display: none;\">\n");
      out.write("\t\t<div id=\"checkoutViewLeft\" class=\"overthrow\">\n");
      out.write("\t\t\t<div id=\"deskInfo\" class=\"caption\" align=\"center\"></div>\n");
      out.write("\t\t\t<div\n");
      out.write("\t\t\t\tstyle=\"position: absolute; left: 1em; bottom: 5em; top: 2em; width: 16em\">\n");
      out.write("\t\t\t\t<fieldset>\n");
      out.write("\t\t\t\t\t<legend style=\"text-align: left;\">会员</legend>\n");
      out.write("\t\t\t\t\t<div id=\"bindMemberButton\" class=\"button\">关联会员</div>\n");
      out.write("\t\t\t\t\t<div id=\"userAccountInfo\"></div>\n");
      out.write("\t\t\t\t</fieldset>\n");
      out.write("\t\t\t</div>\n");
      out.write("\t\t\t<div\n");
      out.write("\t\t\t\tstyle=\"position: absolute; left: 18em; right: 2em; bottom: 5em; top: 2em;\">\n");
      out.write("\t\t\t\t<fieldset id=\"dishOrderPricePanel\">\n");
      out.write("\t\t\t\t\t<legend style=\"text-align: left;\">价格</legend>\n");
      out.write("\t\t\t\t</fieldset>\n");
      out.write("\t\t\t\t<fieldset>\n");
      out.write("\t\t\t\t\t<legend style=\"text-align: left;\">付款方式</legend>\n");
      out.write("\t\t\t\t\t<div id=\"paymentTypeList\">\n");
      out.write("\t\t\t\t\t\t<div id=\"depositCardButton\" class=\"button\" style=\"margin: 1em\">储值卡付费</div>\n");
      out.write("\t\t\t\t\t</div>\n");
      out.write("\t\t\t\t</fieldset>\n");
      out.write("\t\t\t\t<fieldset>\n");
      out.write("\t\t\t\t\t<legend style=\"text-align: left;\">付款记录</legend>\n");
      out.write("\t\t\t\t\t<div id=\"payRecordList\"></div>\n");
      out.write("\t\t\t\t</fieldset>\n");
      out.write("\t\t\t</div>\n");
      out.write("\t\t</div>\n");
      out.write("\t\t<div id=\"checkoutViewBottomLeft\">\n");
      out.write("\t\t\t<div class=\"dishOrderCmdButton floatRight\" id=\"confirmCheckOutButton\">确认付款</div>\n");
      out.write("\t\t\t<div class=\"dishOrderCmdButton floatLeft\" id=\"switchToDishViewButton\">继续点菜</div>\n");
      out.write("\t\t</div>\n");
      out.write("\t\t<div id=\"checkoutViewRight\" class=\"overthrow\">\n");
      out.write("\t\t\t<div id=\"orderItemListCaption\">\n");
      out.write("\t\t\t\t<div style=\"padding: 0.5em; display: inline-block\">已点菜品列表</div>\n");
      out.write("\t\t\t</div>\n");
      out.write("\t\t\t<div id=\"dishOrderItemList\" class=\"centerDiv\"></div>\n");
      out.write("\t\t</div>\n");
      out.write("\t</div>\n");
      out.write("\t<div id=\"dishOrderListView\" style=\"display: none\">\n");
      out.write("\t\t<div id=\"titlePanel\" class=\"topPanel\">\n");
      out.write("\t\t\t<input type=\"text\" class=\"searchDishOrdreIdInput\"\n");
      out.write("\t\t\t\tid=\"searchDishOrdreIdText\" placeholder=\"输入订单号(至少3位)\" />\n");
      out.write("\t\t\t<button class=\"dishOrderCmdButton\" id=\"searchDishOrdersByIdButton\">搜索</button>\n");
      out.write("\t\t\t<button class=\"dishOrderCmdButton\" id=\"myDishOrdersButton\">我的订单</button>\n");
      out.write("\t\t</div>\n");
      out.write("\t\t<div id=\"dishOrderListPanel\" class=\"overthrow dishOrderListPanel\"></div>\n");
      out.write("\t\t<div id=\"dishOrderListViewBottom\">\n");
      out.write("\t\t\t<div id=\"switchToDishViewButton\" class=\"dishOrderCmdButton\">返回点菜</div>\n");
      out.write("\t\t</div>\n");
      out.write("\t</div>\n");
      out.write("\t<div id=\"dialog-shiftClass\" class=\"shiftClassDialog\">\n");
      out.write("\t\t<div class=\"overthrow\"\n");
      out.write("\t\t\tstyle=\"position: fixed; top: 5.5em; left: 2.5em; right: 2.5em; bottom: 7.5em;\">\n");
      out.write("\t\t\t<span id=\"shiftClassTotalIncome\">总收入</span>\n");
      out.write("\t\t\t<table style=\"text-align: center; margin-bottom: 5px; width: 100%\">\n");
      out.write("\t\t\t\t<tr id=\"shiftClassTotalIncomeTr\">\n");
      out.write("\t\t\t\t\t<td style=\"min-width: 50px\">订单数</td>\n");
      out.write("\t\t\t\t\t<td style=\"min-width: 40px\">总价</td>\n");
      out.write("\t\t\t\t\t<td>折后总价</td>\n");
      out.write("\t\t\t\t\t<td>总服务费</td>\n");
      out.write("\t\t\t\t\t<td style=\"min-width: 50px\">实收款</td>\n");
      out.write("\t\t\t\t</tr>\n");
      out.write("\t\t\t\t<tr>\n");
      out.write("\t\t\t\t\t<td id=\"shiftClass_dishOrderCount\"></td>\n");
      out.write("\t\t\t\t\t<td id=\"shiftClass_totalPrice\"></td>\n");
      out.write("\t\t\t\t\t<td id=\"shiftClass_discountedTotalPrice\"></td>\n");
      out.write("\t\t\t\t\t<td id=\"shiftClass_totalServiceFee\"></td>\n");
      out.write("\t\t\t\t\t<td id=\"shiftClass_totalIncome\"></td>\n");
      out.write("\t\t\t\t</tr>\n");
      out.write("\t\t\t</table>\n");
      out.write("\t\t\t<span id=\"shiftClassPayDetail\">支付明细</span>\n");
      out.write("\t\t\t<table style=\"text-align: center; width: 100%\">\n");
      out.write("\t\t\t\t<tbody id=\"shiftClass_payRecordInfos\"></tbody>\n");
      out.write("\t\t\t</table>\n");
      out.write("\t\t</div>\n");
      out.write("\t\t<div style=\"position: absolute; bottom: 5px; left: 0px; width: 100%\">\n");
      out.write("\t\t\t<div style=\"text-align: center; margin-top: 15px\">\n");
      out.write("\t\t\t\t<a class=\"button\" onclick=\"dismissShiftClassDialog()\"><span\n");
      out.write("\t\t\t\t\tid=\"shiftClass\">交班</span></a> <a class=\"button\"\n");
      out.write("\t\t\t\t\tonclick=\"dismissDialog()\"><span id=\"shiftClassCancle\">取消</span></a>\n");
      out.write("\t\t\t</div>\n");
      out.write("\t\t</div>\n");
      out.write("\t</div>\n");
      out.write("\t<div id=\"debugOutput\"></div>\n");
      out.write("\n");
      out.write("\t<script type=\"text/javascript\" src=\"../js/vendor/overthrow.min.js\"></script>\n");
      out.write("\n");
      out.write("\t<script type=\"text/javascript\" src=\"../js/jquery.modal.js\"></script>\n");
      out.write("\t<script type=\"text/javascript\" src=\"../js/jquery.digitKb.js\"></script>\n");
      out.write("\t<script type=\"text/javascript\" src=\"../js/xback.js\"></script>\n");
      out.write("\n");
      out.write("\n");
      out.write("\t<script type=\"text/javascript\"\n");
      out.write("\t\tsrc=\"../js/instantPay/authority_manager.js\"></script>\n");
      out.write("\t<script type=\"text/javascript\" src=\"../js/instantPay/checkout_view.js\"\n");
      out.write("\t\tcharset=\"utf-8\"></script>\n");
      out.write("\t<script type=\"text/javascript\" src=\"../js/instantPay/common_dialogs.js\"\n");
      out.write("\t\tcharset=\"utf-8\"></script>\n");
      out.write("\t<script type=\"text/javascript\"\n");
      out.write("\t\tsrc=\"../js/instantPay/customer_info_picker.js\" charset=\"utf-8\"></script>\n");
      out.write("\t<script type=\"text/javascript\" src=\"../js/instantPay/dialogs.js\"></script>\n");
      out.write("\t<script type=\"text/javascript\"\n");
      out.write("\t\tsrc=\"../js/instantPay/dish_order_cache.js\"></script>\n");
      out.write("\t<script type=\"text/javascript\"\n");
      out.write("\t\tsrc=\"../js/instantPay/dish_order_list_view.js\"></script>\n");
      out.write("\t<script type=\"text/javascript\"\n");
      out.write("\t\tsrc=\"../js/instantPay/dish_order_manager.js\"></script>\n");
      out.write("\t<script type=\"text/javascript\"\n");
      out.write("\t\tsrc=\"../js/instantPay/dish_order_price_panel.js\"></script>\n");
      out.write("\t<script type=\"text/javascript\" src=\"../js/instantPay/dish_picker.js\"\n");
      out.write("\t\tcharset=\"utf-8\"></script>\n");
      out.write("\t<script type=\"text/javascript\" src=\"../js/instantPay/dish_view.js\"\n");
      out.write("\t\tcharset=\"utf-8\"></script>\n");
      out.write("\t<script type=\"text/javascript\" src=\"../js/instantPay/entity_methods.js\"\n");
      out.write("\t\tcharset=\"utf-8\"></script>\n");
      out.write("\t<script type=\"text/javascript\"\n");
      out.write("\t\tsrc=\"../js/instantPay/jquery.i18n.properties.js\"></script>\n");
      out.write("\t<script type=\"text/javascript\"\n");
      out.write("\t\tsrc=\"../js/instantPay/order_item_list.js\" charset=\"utf-8\"></script>\n");
      out.write("\t<script type=\"text/javascript\"\n");
      out.write("\t\tsrc=\"../js/instantPay/ui_data_manager.js\" charset=\"utf-8\"></script>\n");
      out.write("\t<script type=\"text/javascript\" src=\"../js/instantPay/work_console.js\"\n");
      out.write("\t\tcharset=\"utf-8\"></script>\n");
      out.write("\t<script type=\"text/javascript\" src=\"../js/shiftClass.js\"\n");
      out.write("\t\tcharset=\"utf-8\"></script>\n");
      out.write("</body>\n");
      out.write("</html>\n");
    } catch (Throwable t) {
      if (!(t instanceof SkipPageException)){
        out = _jspx_out;
        if (out != null && out.getBufferSize() != 0)
          try { out.clearBuffer(); } catch (java.io.IOException e) {}
        if (_jspx_page_context != null) _jspx_page_context.handlePageException(t);
      }
    } finally {
      _jspxFactory.releasePageContext(_jspx_page_context);
    }
  }
}

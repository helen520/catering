package org.apache.jsp.WEB_002dINF.views.desktop;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class work_005fconsole_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static final JspFactory _jspxFactory = JspFactory.getDefaultFactory();

  private static java.util.List _jspx_dependants;

  static {
    _jspx_dependants = new java.util.ArrayList(4);
    _jspx_dependants.add("/WEB-INF/views/desktop/desk_view.jsp");
    _jspx_dependants.add("/WEB-INF/views/desktop/dish_view.jsp");
    _jspx_dependants.add("/WEB-INF/views/desktop/checkout_view.jsp");
    _jspx_dependants.add("/WEB-INF/views/desktop/../shiftClassDialog.jsp");
  }

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
      out.write("<meta name=\"description\" content=\"\">\n");
      out.write("<meta name=\"viewport\"\n");
      out.write("\tcontent=\"width=device-width,initial-scale=1,user-scalable=no,maximum-scale=1\">\n");
      out.write("<link rel=\"shortcut icon\" href=\"../favicon.ico\" />\n");
      out.write("<link rel=\"stylesheet\" href=\"../css/normalize.css\">\n");
      out.write("<link rel=\"stylesheet\" href=\"../css/desktop/work_console.css\">\n");
      out.write("<link rel=\"stylesheet\" href=\"../css/desktop/desk_view.css\" />\n");
      out.write("<link rel=\"stylesheet\" href=\"../css/mobile/dish_order_list.css\" />\n");
      out.write("<link rel=\"stylesheet\" href=\"../css/desktop/dish_view.css\" />\n");
      out.write("<link rel=\"stylesheet\" href=\"../css/desktop/checkout_view.css\">\n");
      out.write("<link rel=\"stylesheet\" href=\"../css/dish_picker.css\" />\n");
      out.write("<link rel=\"stylesheet\" href=\"../css/order_item_list.css\">\n");
      out.write("<link rel=\"stylesheet\" href=\"../css/dialogs.css\">\n");
      out.write("\n");
      out.write("<!--[if lt IE 9]>\n");
      out.write("            <script src=\"//html5shiv.googlecode.com/svn/trunk/html5.js\"></script>\n");
      out.write("            <script>window.html5 || document.write('<script src=\"js/vendor/html5shiv.js\"><\\/script>')</script>\n");
      out.write("        <![endif]-->\n");
      out.write("</head>\n");
      out.write("<body style=\"font-weight: bold;\">\n");
      out.write("\t");
      out.write("\n");
      out.write("\n");
      out.write("<div id=\"deskView\" style=\"display: block;\">\n");
      out.write("\t<div class=\"topControlPanel\">\n");
      out.write("\t\t<div class=\"functionButtons\">\n");
      out.write("\t\t\t<button id=\"bookingRecordsButton\"\n");
      out.write("\t\t\t\tclass=\"functionButton bookingRecordsButton\"></button>\n");
      out.write("\t\t\t<button id=\"selfDishOrdersButton\"\n");
      out.write("\t\t\t\tclass=\"functionButton selfDishOrdersButton\"></button>\n");
      out.write("\t\t\t<button id=\"functionMenuButton\" class=\"functionButton\">更多</button>\n");
      out.write("\t\t</div>\n");
      out.write("\t\t<div id=\"deskGroupSelector\">\n");
      out.write("\t\t\t<!-- \tdrawDeskGroups   -->\n");
      out.write("\t\t</div>\n");
      out.write("\t</div>\n");
      out.write("\n");
      out.write("\t<div id=\"deskSelector\" class=\"overthrow\">\n");
      out.write("\t\t<!--      drawDesks      -->\n");
      out.write("\t</div>\n");
      out.write("\t<div id=\"loginInfoDiv\" class=\"overthrow\">\n");
      out.write("\t\t操作员:<label id=\"employeeNameLabel\"></label>\n");
      out.write("\t\t<div id=\"logoutEmployeeButton\" class=\"dishOrderCmdButton\">登出</div>\n");
      out.write("\t</div>\n");
      out.write("\t<div id=\"statInfoPanel\">\n");
      out.write("\t\t<div class=\"caption\">请选择台号以进行操作</div>\n");
      out.write("\t</div>\n");
      out.write("\t<div id=\"deskPanel\">\n");
      out.write("\t\t<div id=\"deskBriefDiv\" class=\"caption\">\n");
      out.write("\t\t\t<label id=\"deskNameLabel\"></label> <label id=\"customerCountLabel\"\n");
      out.write("\t\t\t\tclass=\"numberButton\"></label> <label id=\"totalPriceLabel\">¥100.0</label>\n");
      out.write("\t\t\t<label id=\"dishOrderBriefId\"></label> <br> <label\n");
      out.write("\t\t\t\tid=\"dishOrderCreateTimeLabel\">开台时间:</label><label\n");
      out.write("\t\t\t\tid=\"dishOrderCreateTime\"></label>\n");
      out.write("\t\t</div>\n");
      out.write("\t\t<div id=\"deskOperationPanel\">\n");
      out.write("\t\t\t<div class=\"dishOrderCmdButton\" id=\"createDishOrderButton\">开台</div>\n");
      out.write("\t\t\t<div class=\"dishOrderCmdButton\" id=\"orderDishesButton\">点菜</div>\n");
      out.write("\t\t\t<div class=\"dishOrderCmdButton\" id=\"payDishOrderButton\">结帐</div>\n");
      out.write("\t\t\t<div class=\"clear\"></div>\n");
      out.write("\t\t\t<div class=\"dishOrderCmdButton\" id=\"changeDeskButton\">转台</div>\n");
      out.write("\t\t\t<div class=\"dishOrderCmdButton\" id=\"mergeDishOrderButton\">并单</div>\n");
      out.write("\t\t\t<div class=\"clear\"></div>\n");
      out.write("\t\t\t<div class=\"dishOrderCmdButton printButton\"\n");
      out.write("\t\t\t\tid=\"printCustomerNoteButton\">打楼面单</div>\n");
      out.write("\t\t\t<div class=\"dishOrderCmdButton printButton\"\n");
      out.write("\t\t\t\tid=\"reprintCustomerNoteButton\">重打楼面单</div>\n");
      out.write("\t\t\t<div class=\"dishOrderCmdButton printButton\"\n");
      out.write("\t\t\t\tid=\"prePrintCheckoutBillButton\">预打结账单</div>\n");
      out.write("\t\t</div>\n");
      out.write("\t\t<div id=\"orderItemListDiv\" class=\"overthrow\">\n");
      out.write("\t\t\t<!-- drawDishOrderInfo -->\n");
      out.write("\t\t</div>\n");
      out.write("\t</div>\n");
      out.write("</div>\n");
      out.write('\n');
      out.write('	');
      out.write("\n");
      out.write("\n");
      out.write("<div id=\"dishView\" style=\"display: none\">\n");
      out.write("\t<div id=\"dishViewLeft\">\t\t\n");
      out.write("\t</div>\n");
      out.write("\t<div id=\"dishViewBottomLeft\">\n");
      out.write("\t\t<div style=\"font-size: 14px; text-align: center;\">\n");
      out.write("\t\t\t<span id=\"dv_string_deskNum\">桌号</span>: <span id=\"deskNameLabel\">0</span>&nbsp;&nbsp; \n");
      out.write("\t\t\t<span id=\"dv_string_renShu\">人数</span>: <span\n");
      out.write("\t\t\t\tid=\"customerCountLabel\">0</span>&nbsp;&nbsp;\n");
      out.write("\t\t\t\t<span id=\"dv_string_total_price\"> 总价</span>\n");
      out.write("\t\t\t\t: <span\n");
      out.write("\t\t\t\tid=\"totalPriceLabel\">0</span>\n");
      out.write("\t\t</div>\n");
      out.write("\t\t<hr />\n");
      out.write("\t\t<div>\n");
      out.write("\t\t\t<div style=\"width: 30%; float: left; text-align: left;\">\n");
      out.write("\t\t\t<!--class=\"string_quXiaoDianCai\" ???? dishOrderCmdButton -->\n");
      out.write("\t\t\t\t<div id=\"cancelDishOrderButton\" class=\"dishOrderCmdButton\">取消点菜</div>\n");
      out.write("\t\t\t</div>\n");
      out.write("\t\t\t<div style=\"width: 40%; float: left; text-align: center;\">\n");
      out.write("\t\t\t\t<div id=\"dishOrderTagsButton\" class=\"dishOrderCmdButton\">整单做法</div>\n");
      out.write("\t\t\t</div>\n");
      out.write("\t\t\t<div style=\"width: 30%; float: left; text-align: right;\">\n");
      out.write("\t\t\t\t<div id=\"submitDishOrderButton\" class=\"dishOrderCmdButton\">确认下单</div>\n");
      out.write("\t\t\t</div>\n");
      out.write("\t\t</div>\n");
      out.write("\t</div>\n");
      out.write("\t<div id=\"dishViewRight\">\n");
      out.write("\t\t<div id=\"dishOrderItemCmdPanel\"></div>\n");
      out.write("\t\t<div id=\"dishOrderItemList\" class=\"overthrow\"></div>\n");
      out.write("\t</div>\n");
      out.write("</div>");
      out.write('\n');
      out.write('	');
      out.write("\n");
      out.write("\n");
      out.write("<div id=\"checkoutView\" style=\"display: none;\">\n");
      out.write("\t<div id=\"checkoutViewLeft\" class=\"overthrow\">\n");
      out.write("\t\t<div id=\"deskInfo\" class=\"caption\" align=\"center\"></div>\n");
      out.write("\t\t<div style=\"float: left; width: 50%;\">\n");
      out.write("\t\t\t<fieldset>\n");
      out.write("\t\t\t\t<legend style=\"text-align: left;\">价格</legend>\n");
      out.write("\t\t\t\t<div id=\"discountRate\"></div>\n");
      out.write("\t\t\t\t<div id=\"serviceFeeRate\"></div>\n");
      out.write("\t\t\t\t<div id=\"priceInfo\" style=\"padding: .2em\"></div>\n");
      out.write("\t\t\t\t<div id=\"actualPayDiv\"></div>\n");
      out.write("\t\t\t\t<div>\n");
      out.write("\t\t\t\t\t备注:<input type=\"text\" id=\"dishOrderMemoInput\">\n");
      out.write("\t\t\t\t</div>\n");
      out.write("\t\t\t</fieldset>\n");
      out.write("\t\t\t<fieldset style=\"height: 90%\">\n");
      out.write("\t\t\t\t<legend style=\"text-align: left;\">会员</legend>\n");
      out.write("\t\t\t\t<div id=\"bindMemberButton\" class=\"button\">关联会员</div>\n");
      out.write("\t\t\t\t<div id=\"userAccountInfo\"></div>\n");
      out.write("\t\t\t</fieldset>\n");
      out.write("\t\t</div>\n");
      out.write("\t\t<fieldset style=\"height: 90%\">\n");
      out.write("\t\t\t<legend style=\"text-align: left;\">付款</legend>\n");
      out.write("\t\t\t<div id=\"paymentTypes\"></div>\n");
      out.write("\t\t</fieldset>\n");
      out.write("\t</div>\n");
      out.write("\t<div id=\"checkoutViewBottomLeft\">\n");
      out.write("\t\t<div class=\"dishOrderCmdButton floatRight\" id=\"confirmCheckoutButton\">确认付款</div>\n");
      out.write("\t\t<div class=\"dishOrderCmdButton floatLeft\" id=\"cancelCheckoutButton\">取消付款</div>\n");
      out.write("\t</div>\n");
      out.write("\t<div id=\"checkoutViewRight\" class=\"overthrow\">\n");
      out.write("\t\t<div id=\"orderItemListCaption\">\n");
      out.write("\t\t\t<div id=\"yiDianCaiPinLieBiao\"\n");
      out.write("\t\t\t\tstyle=\"padding: 0.5em; display: inline-block\">已点菜品列表</div>\n");
      out.write("\t\t</div>\n");
      out.write("\t\t<div id=\"dishOrderItemList\" class=\"centerDiv\"></div>\n");
      out.write("\t</div>\n");
      out.write("</div>");
      out.write('\n');
      out.write('	');
      out.write("\n");
      out.write("\n");
      out.write("<div id=\"dialog-shiftClass\" class=\"shiftClassDialog\">\n");
      out.write("\t<div class=\"overthrow\"\n");
      out.write("\t\tstyle=\"position: fixed; top: 5.5em; left: 2.5em; right: 2.5em; bottom: 7.5em;\">\n");
      out.write("\t\t<span id=\"shiftClassTotalIncome\">总收入</span>\n");
      out.write("\t\t<table style=\"text-align: center; margin-bottom: 5px; width: 100%\">\n");
      out.write("\t\t\t<tr id=\"shiftClassTotalIncomeTr\">\n");
      out.write("\t\t\t\t<td style=\"min-width: 50px\">订单数</td>\n");
      out.write("\t\t\t\t<td style=\"min-width: 40px\">总价</td>\n");
      out.write("\t\t\t\t<td>折后总价</td>\n");
      out.write("\t\t\t\t<td>总服务费</td>\n");
      out.write("\t\t\t\t<td style=\"min-width: 50px\">实收款</td>\n");
      out.write("\t\t\t</tr>\n");
      out.write("\t\t\t<tr>\n");
      out.write("\t\t\t\t<td id=\"shiftClass_dishOrderCount\"></td>\n");
      out.write("\t\t\t\t<td id=\"shiftClass_totalPrice\"></td>\n");
      out.write("\t\t\t\t<td id=\"shiftClass_discountedTotalPrice\"></td>\n");
      out.write("\t\t\t\t<td id=\"shiftClass_totalServiceFee\"></td>\n");
      out.write("\t\t\t\t<td id=\"shiftClass_totalIncome\"></td>\n");
      out.write("\t\t\t</tr>\n");
      out.write("\t\t</table>\n");
      out.write("\t\t<span id=\"shiftClassPayDetail\">支付明细</span>\n");
      out.write("\t\t<table style=\"text-align: center; width: 100%\">\n");
      out.write("\t\t\t<tbody id=\"shiftClass_payRecordInfos\"></tbody>\n");
      out.write("\t\t</table>\n");
      out.write("\t</div>\n");
      out.write("\t<div style=\"position: absolute; bottom: 5px; left: 0px; width: 100%\">\n");
      out.write("\t\t<div style=\"text-align: center; margin-top: 15px\">\n");
      out.write("\t\t\t<a class=\"button\" onclick=\"dismissShiftClassDialog()\"><span\n");
      out.write("\t\t\t\tid=\"shiftClass\">交班</span></a> <a class=\"button\"\n");
      out.write("\t\t\t\tonclick=\"dismissDialog()\"><span id=\"shiftClassCancle\">取消</span></a>\n");
      out.write("\t\t</div>\n");
      out.write("\t</div>\n");
      out.write("</div>");
      out.write("\n");
      out.write("\n");
      out.write("\t<div id=\"debugOutput\"></div>\n");
      out.write("\n");
      out.write("\t<script type=\"text/javascript\" src=\"../js/vendor/jquery-1.10.1.min.js\"></script>\n");
      out.write("\t<script type=\"text/javascript\" src=\"../js/vendor/overthrow.min.js\"></script>\n");
      out.write("\n");
      out.write("\t<script type=\"text/javascript\"\n");
      out.write("\t\tsrc=\"../js/vendor/jquery.i18n.properties-1.0.9.js\"></script>\n");
      out.write("\n");
      out.write("\t<script type=\"text/javascript\" src=\"../js/vendor/Calendar3.js\"></script>\n");
      out.write("\t<script type=\"text/javascript\" src=\"../js/jquery.modal.js\"></script>\n");
      out.write("\t<script type=\"text/javascript\" src=\"../js/jquery.digitKb.js\"></script>\n");
      out.write("\t<script type=\"text/javascript\" src=\"../js/dialogs.js\"></script>\n");
      out.write("\t<script type=\"text/javascript\" src=\"../js/xback.js\"></script>\n");
      out.write("\n");
      out.write("\t<script type=\"text/javascript\" src=\"../js/ui_data.js\" charset=\"utf-8\"></script>\n");
      out.write("\t<script type=\"text/javascript\" src=\"../js/dish_order_manager.js\"\n");
      out.write("\t\tcharset=\"utf-8\"></script>\n");
      out.write("\t<script type=\"text/javascript\" src=\"../js/desk_picker.js\"\n");
      out.write("\t\tcharset=\"utf-8\"></script>\n");
      out.write("\t<script type=\"text/javascript\" src=\"../js/dish_picker.js\"\n");
      out.write("\t\tcharset=\"utf-8\"></script>\n");
      out.write("\t<script type=\"text/javascript\" src=\"../js/order_item_list.js\"\n");
      out.write("\t\tcharset=\"utf-8\"></script>\n");
      out.write("\t<script type=\"text/javascript\" src=\"../js/shiftClass.js\"\n");
      out.write("\t\tcharset=\"utf-8\"></script>\n");
      out.write("\t<script type=\"text/javascript\" src=\"../js/customer_info_picker.js\"\n");
      out.write("\t\tcharset=\"utf-8\"></script>\n");
      out.write("\t<script type=\"text/javascript\" src=\"../js/desk_view.js\" charset=\"utf-8\"></script>\n");
      out.write("\t<script type=\"text/javascript\" src=\"../js/checkout_view.js\"\n");
      out.write("\t\tcharset=\"utf-8\"></script>\n");
      out.write("\t<script type=\"text/javascript\" src=\"../js/desktop/work_console.js\"\n");
      out.write("\t\tcharset=\"utf-8\"></script>\n");
      out.write("\t<script type=\"text/javascript\" src=\"../js/mobile/dish_order_list.js\"\n");
      out.write("\t\tcharset=\"utf-8\"></script>\n");
      out.write("\t<script type=\"text/javascript\" src=\"../js/desktop/dish_view.js\"\n");
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

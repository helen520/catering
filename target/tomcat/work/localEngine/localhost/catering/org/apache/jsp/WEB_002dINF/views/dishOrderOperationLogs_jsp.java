package org.apache.jsp.WEB_002dINF.views;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class dishOrderOperationLogs_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static final JspFactory _jspxFactory = JspFactory.getDefaultFactory();

  private static java.util.List _jspx_dependants;

  static {
    _jspx_dependants = new java.util.ArrayList(1);
    _jspx_dependants.add("/WEB-INF/views/reportListTop.jsp");
  }

  private org.apache.jasper.runtime.TagHandlerPool _005fjspx_005ftagPool_005fc_005fforEach_0026_005fvar_005fitems;

  private javax.el.ExpressionFactory _el_expressionfactory;
  private org.apache.AnnotationProcessor _jsp_annotationprocessor;

  public Object getDependants() {
    return _jspx_dependants;
  }

  public void _jspInit() {
    _005fjspx_005ftagPool_005fc_005fforEach_0026_005fvar_005fitems = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
    _el_expressionfactory = _jspxFactory.getJspApplicationContext(getServletConfig().getServletContext()).getExpressionFactory();
    _jsp_annotationprocessor = (org.apache.AnnotationProcessor) getServletConfig().getServletContext().getAttribute(org.apache.AnnotationProcessor.class.getName());
  }

  public void _jspDestroy() {
    _005fjspx_005ftagPool_005fc_005fforEach_0026_005fvar_005fitems.release();
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
      out.write("\n");
      out.write("\n");
      out.write("<!DOCTYPE html PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\">\n");
      out.write("<html>\n");
      out.write("<head>\n");
      out.write("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n");
      out.write("<title>订单操作记录</title>\n");
      out.write("<script type=\"text/javascript\" src=\"../js/vendor/jquery-1.10.1.min.js\"></script>\n");
      out.write("<script type=\"text/javascript\"\n");
      out.write("\tsrc=\"../js/vendor/jquery.i18n.properties-1.0.9.js\"></script>\n");
      out.write("<script type=\"text/javascript\" src=\"../js/vendor/Calendar3.js\"></script>\n");
      out.write("\n");
      out.write("<style>\n");
      out.write("body {\n");
      out.write("\twidth: 800px;\n");
      out.write("\tmargin: 0px auto;\n");
      out.write("\tpadding-bottom: 200px;\n");
      out.write("}\n");
      out.write("\n");
      out.write(".title {\n");
      out.write("\tpadding: 20px;\n");
      out.write("}\n");
      out.write("\n");
      out.write("table {\n");
      out.write("\tborder: 1px solid #000000;\n");
      out.write("\tborder-spacing: 0px;\n");
      out.write("}\n");
      out.write("\n");
      out.write("th {\n");
      out.write("\tborder: 1px solid #000000;\n");
      out.write("\tpadding: 2px;\n");
      out.write("}\n");
      out.write("\n");
      out.write("td {\n");
      out.write("\tborder: 1px solid #000000;\n");
      out.write("\tpadding: 2px;\n");
      out.write("}\n");
      out.write("\n");
      out.write("input[type=text] {\n");
      out.write("\twidth: 100px;\n");
      out.write("}\n");
      out.write("</style>\n");
      out.write("</head>\n");
      out.write("<body>\n");
      out.write("\t<div id=\"ReportTablesDiv\" style=\"width: 800px;\">\n");
      out.write("\t\t");
      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("<div id=\"reportLists\">\n");
      out.write("\t<br /> <a href=\"../reporting/currentClass?storeId=");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${storeId}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("\"><span\n");
      out.write("\t\tid=\"stringCurrentClass\">当班报表</span></a> <a\n");
      out.write("\t\thref=\"../reporting/classReporting?storeId=");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${storeId}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("\"><span\n");
      out.write("\t\tid=\"stringClassReporting\">交班报表</span></a> <a\n");
      out.write("\t\thref=\"../reporting/classesInTimeRange?startDate=&endDate=&storeId=");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${storeId}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("\"><span\n");
      out.write("\t\tid=\"stringClassesInTimeRange\">汇总交班报表</span></a> <a\n");
      out.write("\t\thref=\"../reporting/dailyReporting?dateToReport=&storeId=");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${storeId}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("\"><span\n");
      out.write("\t\tid=\"stringDailyReporting\">每日报表</span></a> <a\n");
      out.write("\t\thref=\"../reporting/timeRangeReporting?startDate=&endDate=&storeId=");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${storeId}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("\"><span\n");
      out.write("\t\tid=\"TimeRangeReporting\">时段报表</span></a> <a\n");
      out.write("\t\thref=\"../reporting/cookerDishReporting?storeId=");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${storeId}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("\"><span\n");
      out.write("\t\tid=\"stringCookerDishReporting\">厨师菜品报表</span></a> <a\n");
      out.write("\t\thref=\"../reporting/balanceRecordsReporting?&storeId=");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${storeId}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("\"><span\n");
      out.write("\t\tid=\"stringBalanceRecordsReporting\">会员充值/消费记录</span></a> <a\n");
      out.write("\t\thref=\"../reporting/memberBalanceReporting?&storeId=");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${storeId}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("\"><span\n");
      out.write("\t\tid=\"stringMemberBalanceReporting\">会员余额</span></a> <a\n");
      out.write("\t\thref=\"../reporting/dishOrderOperationLogs?&storeId=");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${storeId}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("\"><span\n");
      out.write("\t\tid=\"stringDishOrderOperationLogs\">订单操作记录</span></a> <a\n");
      out.write("\t\thref=\"../reporting/couponOperationLogs?&storeId=");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${storeId}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("\"><span\n");
      out.write("\t\tid=\"stringDishOrderOperationLogs\">优惠券操作记录</span></a>\n");
      out.write("\t<button onclick=\"window.print()\">打印页面信息</button>\n");
      out.write("</div>\n");
      out.write("<script type=\"text/javascript\">\n");
      out.write("\tfunction checkInput(thisObject) {\n");
      out.write("\t\tvar startDate = thisObject.form.startDate.value;\n");
      out.write("\t\tvar endDate = thisObject.form.endDate.value;\n");
      out.write("\t\tif (startDate == \"\") {\n");
      out.write("\t\t\talert($.i18n.prop('string_qingXuanZeKaiShiRiQi'));\n");
      out.write("\t\t\treturn;\n");
      out.write("\t\t}\n");
      out.write("\t\tif (endDate == \"\") {\n");
      out.write("\t\t\talert($.i18n.prop('string_qingXuanZeJieShuRiQi'));\n");
      out.write("\t\t\treturn;\n");
      out.write("\t\t}\n");
      out.write("\t\tvar startDateArr = startDate.split('-');\n");
      out.write("\t\tvar endDateArr = endDate.split('-');\n");
      out.write("\t\tvar startDateLong = parseFloat(startDateArr[0] + startDateArr[1]\n");
      out.write("\t\t\t\t+ startDateArr[2]);\n");
      out.write("\t\tvar endDateLong = parseFloat(endDateArr[0] + endDateArr[1]\n");
      out.write("\t\t\t\t+ endDateArr[2]);\n");
      out.write("\t\tif (startDateLong > endDateLong) {\n");
      out.write("\t\t\talert($.i18n.prop('string_kaiShiRiQiDaYuJieShuRiQi'));\n");
      out.write("\t\t\treturn;\n");
      out.write("\t\t}\n");
      out.write("\t\tthisObject.form.submit();\n");
      out.write("\t}\n");
      out.write("\n");
      out.write("\tfunction checkInputOneDay(thisObject) {\n");
      out.write("\t\tif (thisObject.form.dateToReport.value == \"\") {\n");
      out.write("\t\t\talert(\"请选择日期\");\n");
      out.write("\t\t\treturn;\n");
      out.write("\t\t}\n");
      out.write("\t\tthisObject.form.submit();\n");
      out.write("\n");
      out.write("\t}\n");
      out.write("</script>\n");
      out.write("\n");
      out.write("\t\t<div>\n");
      out.write("\t\t\t<form action=\"dishOrderOperationLogs\" method=\"GET\">\n");
      out.write("\t\t\t\t<h3>订单操作记录</h3>\n");
      out.write("\t\t\t\t<input type=\"hidden\" value=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${storeId }", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("\" name=\"storeId\" id=\"storeId\" />\n");
      out.write("\t\t\t\t<span> <input type=\"text\" name=\"startDate\"\n");
      out.write("\t\t\t\t\tvalue=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${ startDate }", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("\" id=\"startDate\" size=\"10\" maxlength=\"10\"\n");
      out.write("\t\t\t\t\tonclick=\"new Calendar().show(this);\" readonly=\"readonly\" />\n");
      out.write("\t\t\t\t</span> <span id=\"until\">至</span> <span> <input type=\"text\"\n");
      out.write("\t\t\t\t\tname=\"endDate\" value=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${ endDate }", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("\" id=\"endDate\" size=\"10\"\n");
      out.write("\t\t\t\t\tmaxlength=\"10\" onclick=\"new Calendar().show(this);\"\n");
      out.write("\t\t\t\t\treadonly=\"readonly\" />\n");
      out.write("\t\t\t\t</span> <input type=\"button\" value=\"提交\" onclick=\"checkInput(this)\" />\n");
      out.write("\t\t\t</form>\n");
      out.write("\t\t</div>\n");
      out.write("\t\t<table style=\"width: 800px; text-align: center; margin-top: .5em;\">\n");
      out.write("\t\t\t<thead>\n");
      out.write("\t\t\t\t<tr>\n");
      out.write("\t\t\t\t\t<th style=\"min-width: 5em;\">时间</th>\n");
      out.write("\t\t\t\t\t<th>操作详情</th>\n");
      out.write("\t\t\t\t</tr>\n");
      out.write("\t\t\t</thead>\n");
      out.write("\t\t\t<tbody>\n");
      out.write("\t\t\t\t");
      if (_jspx_meth_c_005fforEach_005f0(_jspx_page_context))
        return;
      out.write("\n");
      out.write("\t\t\t</tbody>\n");
      out.write("\t\t</table>\n");
      out.write("\t</div>\n");
      out.write("</body>\n");
      out.write("</html>");
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

  private boolean _jspx_meth_c_005fforEach_005f0(PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  c:forEach
    org.apache.taglibs.standard.tag.rt.core.ForEachTag _jspx_th_c_005fforEach_005f0 = (org.apache.taglibs.standard.tag.rt.core.ForEachTag) _005fjspx_005ftagPool_005fc_005fforEach_0026_005fvar_005fitems.get(org.apache.taglibs.standard.tag.rt.core.ForEachTag.class);
    _jspx_th_c_005fforEach_005f0.setPageContext(_jspx_page_context);
    _jspx_th_c_005fforEach_005f0.setParent(null);
    // /WEB-INF/views/dishOrderOperationLogs.jsp(72,4) name = items type = java.lang.Object reqTime = true required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005fforEach_005f0.setItems((java.lang.Object) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${operationLogs }", java.lang.Object.class, (PageContext)_jspx_page_context, null, false));
    // /WEB-INF/views/dishOrderOperationLogs.jsp(72,4) name = var type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005fforEach_005f0.setVar("operationLog");
    int[] _jspx_push_body_count_c_005fforEach_005f0 = new int[] { 0 };
    try {
      int _jspx_eval_c_005fforEach_005f0 = _jspx_th_c_005fforEach_005f0.doStartTag();
      if (_jspx_eval_c_005fforEach_005f0 != javax.servlet.jsp.tagext.Tag.SKIP_BODY) {
        do {
          out.write("\n");
          out.write("\t\t\t\t\t<tr>\n");
          out.write("\t\t\t\t\t\t<td>");
          out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${operationLog.createTimeStr }", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
          out.write("</td>\n");
          out.write("\t\t\t\t\t\t<td style=\"text-align: left;\">");
          out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${operationLog.text}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
          out.write("</td>\n");
          out.write("\t\t\t\t\t</tr>\n");
          out.write("\t\t\t\t");
          int evalDoAfterBody = _jspx_th_c_005fforEach_005f0.doAfterBody();
          if (evalDoAfterBody != javax.servlet.jsp.tagext.BodyTag.EVAL_BODY_AGAIN)
            break;
        } while (true);
      }
      if (_jspx_th_c_005fforEach_005f0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
        return true;
      }
    } catch (Throwable _jspx_exception) {
      while (_jspx_push_body_count_c_005fforEach_005f0[0]-- > 0)
        out = _jspx_page_context.popBody();
      _jspx_th_c_005fforEach_005f0.doCatch(_jspx_exception);
    } finally {
      _jspx_th_c_005fforEach_005f0.doFinally();
      _005fjspx_005ftagPool_005fc_005fforEach_0026_005fvar_005fitems.reuse(_jspx_th_c_005fforEach_005f0);
    }
    return false;
  }
}

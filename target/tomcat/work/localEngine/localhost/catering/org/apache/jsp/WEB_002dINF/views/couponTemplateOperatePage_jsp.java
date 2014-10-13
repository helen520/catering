package org.apache.jsp.WEB_002dINF.views;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class couponTemplateOperatePage_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static final JspFactory _jspxFactory = JspFactory.getDefaultFactory();

  private static java.util.List _jspx_dependants;

  private org.apache.jasper.runtime.TagHandlerPool _005fjspx_005ftagPool_005fc_005fforEach_0026_005fvar_005fitems;
  private org.apache.jasper.runtime.TagHandlerPool _005fjspx_005ftagPool_005fc_005fif_0026_005ftest;
  private org.apache.jasper.runtime.TagHandlerPool _005fjspx_005ftagPool_005fc_005fchoose;
  private org.apache.jasper.runtime.TagHandlerPool _005fjspx_005ftagPool_005fc_005fwhen_0026_005ftest;
  private org.apache.jasper.runtime.TagHandlerPool _005fjspx_005ftagPool_005fc_005fotherwise;

  private javax.el.ExpressionFactory _el_expressionfactory;
  private org.apache.AnnotationProcessor _jsp_annotationprocessor;

  public Object getDependants() {
    return _jspx_dependants;
  }

  public void _jspInit() {
    _005fjspx_005ftagPool_005fc_005fforEach_0026_005fvar_005fitems = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
    _005fjspx_005ftagPool_005fc_005fif_0026_005ftest = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
    _005fjspx_005ftagPool_005fc_005fchoose = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
    _005fjspx_005ftagPool_005fc_005fwhen_0026_005ftest = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
    _005fjspx_005ftagPool_005fc_005fotherwise = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
    _el_expressionfactory = _jspxFactory.getJspApplicationContext(getServletConfig().getServletContext()).getExpressionFactory();
    _jsp_annotationprocessor = (org.apache.AnnotationProcessor) getServletConfig().getServletContext().getAttribute(org.apache.AnnotationProcessor.class.getName());
  }

  public void _jspDestroy() {
    _005fjspx_005ftagPool_005fc_005fforEach_0026_005fvar_005fitems.release();
    _005fjspx_005ftagPool_005fc_005fif_0026_005ftest.release();
    _005fjspx_005ftagPool_005fc_005fchoose.release();
    _005fjspx_005ftagPool_005fc_005fwhen_0026_005ftest.release();
    _005fjspx_005ftagPool_005fc_005fotherwise.release();
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

      out.write("\r\n");
      out.write("\r\n");
      out.write("<html>\r\n");
      out.write("<head>\r\n");
      out.write("<meta charset=\"utf-8\">\r\n");
      out.write("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\r\n");
      out.write("<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge,chrome=1\">\r\n");
      out.write("<title>CATERING</title>\r\n");
      out.write("<meta name=\"description\" content=\"\">\r\n");
      out.write("<meta name=\"viewport\"\r\n");
      out.write("\tcontent=\"width=device-width,initial-scale=1,user-scalable=no,maximum-scale=1,minimum-scale=1\">\r\n");
      out.write("<script type=\"text/javascript\" src=\"../js/vendor/jquery-1.10.1.min.js\"></script>\r\n");
      out.write("<script type=\"text/javascript\"\r\n");
      out.write("\tsrc=\"../js/vendor/jquery.i18n.properties-1.0.9.js\"></script>\r\n");
      out.write("<script type=\"text/javascript\" src=\"../js/dialogs.js\"></script>\r\n");
      out.write("<script type=\"text/javascript\" src=\"../js/vendor/Calendar3.js\"></script>\r\n");
      out.write("<script type=\"text/javascript\" src=\"../js/jquery.modal.js\"></script>\r\n");
      out.write("<link rel=\"stylesheet\" href=\"../css/dialogs.css\">\r\n");
      out.write("<style>\r\n");
      out.write(".ui-radius {\r\n");
      out.write("\tborder-radius: 0.75em;\r\n");
      out.write("}\r\n");
      out.write("\r\n");
      out.write(".ui-shadow {\r\n");
      out.write("\t-webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, .15);\r\n");
      out.write("\t-moz-box-shadow: 0 1px 3px rgba(0, 0, 0, .15);\r\n");
      out.write("\tbox-shadow: 0 1px 3px rgba(0, 0, 0, .15);\r\n");
      out.write("}\r\n");
      out.write("\r\n");
      out.write(".ui-input {\r\n");
      out.write("\tpadding: .4em 5px;\r\n");
      out.write("\tmargin: 0;\r\n");
      out.write("\tdisplay: inline-block;\r\n");
      out.write("\tbackground: transparent none;\r\n");
      out.write("\toutline: 0 !important;\r\n");
      out.write("\t-webkit-appearance: none;\r\n");
      out.write("\tmin-height: 1.4em;\r\n");
      out.write("\tline-height: 1.4em;\r\n");
      out.write("\tfont-family: Helvetica, Arial, sans-serif;\r\n");
      out.write("\tcolor: #333;\r\n");
      out.write("\ttext-shadow: 0 1px 0 #fff;\r\n");
      out.write("\t-webkit-rtl-ordering: logical;\r\n");
      out.write("\t-webkit-user-select: text;\r\n");
      out.write("\tcursor: auto;\r\n");
      out.write("\tletter-spacing: normal;\r\n");
      out.write("\tfont: -webkit-small-control;\r\n");
      out.write("\tword-spacing: normal;\r\n");
      out.write("\ttext-transform: none;\r\n");
      out.write("\ttext-indent: 0px;\r\n");
      out.write("\ttext-align: start;\r\n");
      out.write("\t-webkit-writing-mode: horizontal-tb;\r\n");
      out.write("}\r\n");
      out.write("\r\n");
      out.write(".ui-border-solid {\r\n");
      out.write("\tborder: 1px solid #CCC;\r\n");
      out.write("\tposition: absolute;\r\n");
      out.write("\tleft: 70px;\r\n");
      out.write("\tright: 10px;\r\n");
      out.write("}\r\n");
      out.write("\r\n");
      out.write(".createCouponTemplate {\r\n");
      out.write("\tline-height: 2em;\r\n");
      out.write("\tpadding: 10px 0px;\r\n");
      out.write("\tposition: relative;\r\n");
      out.write("}\r\n");
      out.write("\r\n");
      out.write(".button {\r\n");
      out.write("\tdisplay: inline-block;\r\n");
      out.write("\tbackground-color: #FF9640;\r\n");
      out.write("\toutline: none;\r\n");
      out.write("\tcursor: pointer;\r\n");
      out.write("\ttext-align: center;\r\n");
      out.write("\ttext-decoration: none;\r\n");
      out.write("\tfont: 14px/100% Arial, Helvetica, sans-serif;\r\n");
      out.write("\tpadding: .5em 1em .55em;\r\n");
      out.write("\t-webkit-border-radius: .5em;\r\n");
      out.write("\t-moz-border-radius: .5em;\r\n");
      out.write("\tborder-radius: .5em;\r\n");
      out.write("\t-webkit-box-shadow: 0 1px 2px rgba(0, 0, 0, .2);\r\n");
      out.write("\t-moz-box-shadow: 0 1px 2px rgba(0, 0, 0, .2);\r\n");
      out.write("\tbox-shadow: 0 1px 2px rgba(0, 0, 0, .2);\r\n");
      out.write("}\r\n");
      out.write("\r\n");
      out.write(".couponTemplateItem {\r\n");
      out.write("\tpadding: 0.5em;\r\n");
      out.write("\tmargin: 0.5em;\r\n");
      out.write("\tbackground-color: #eee;\r\n");
      out.write("}\r\n");
      out.write("</style>\r\n");
      out.write("\r\n");
      out.write("<script type=\"text/javascript\">\r\n");
      out.write("\t$(function() {\r\n");
      out.write("\t\tloadProperties();\r\n");
      out.write("\t\t$(\"[name='sendCouponToAllMember']\").click(\r\n");
      out.write("\t\t\t\tsendCouponToAllMemberBtnOnClick);\r\n");
      out.write("\t\t$(\"[name='deleteCouponTemplateBtn']\").click(\r\n");
      out.write("\t\t\t\tdeleteCouponTemplateBtnOnClick);\r\n");
      out.write("\t});\r\n");
      out.write("\tfunction StringBuilder() {\r\n");
      out.write("\t\tvar _string = new Array();\r\n");
      out.write("\t\tthis.append = function(args) {\r\n");
      out.write("\t\t\tif (typeof (args) != \"object\") {\r\n");
      out.write("\t\t\t\t_string.push(args);\r\n");
      out.write("\t\t\t} else {\r\n");
      out.write("\t\t\t\t_string = _string.concat(args);\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t};\r\n");
      out.write("\t\tthis.toString = function() {\r\n");
      out.write("\t\t\treturn _string.join(\"\");\r\n");
      out.write("\t\t};\r\n");
      out.write("\t}\r\n");
      out.write("\r\n");
      out.write("\tfunction loadProperties() {\r\n");
      out.write("\t\tjQuery.i18n.properties({\r\n");
      out.write("\t\t\tname : 'strings', // 资源文件名称\r\n");
      out.write("\t\t\tpath : '../resources/i18n/', // 资源文件路径\r\n");
      out.write("\t\t\tmode : 'map', // 用Map的方式使用资源文件中的值\r\n");
      out.write("\t\t\tcallback : function() {\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t});\r\n");
      out.write("\t}\r\n");
      out.write("\tfunction validFromNowOnClick() {\r\n");
      out.write("\t\tvar validFromNow = $(\"#validFromNow\")[0].checked;\r\n");
      out.write("\t\t$(\"#validFromNowDate\").hide();\r\n");
      out.write("\t\t$(\"#validFromDate\").hide();\r\n");
      out.write("\r\n");
      out.write("\t\tif (validFromNow) {\r\n");
      out.write("\t\t\t$(\"#validFromNowDate\").show();\r\n");
      out.write("\t\t} else {\r\n");
      out.write("\t\t\t$(\"#validFromDate\").show();\r\n");
      out.write("\t\t}\r\n");
      out.write("\t}\r\n");
      out.write("\r\n");
      out.write("\tfunction submitCreateCouponTemplate() {\r\n");
      out.write("\t\tvar storeId = $(\"#storeId\").val();\r\n");
      out.write("\t\tvar employeeId = $(\"#employeeId\").val();\r\n");
      out.write("\t\tvar title = $(\"#title\").val();\r\n");
      out.write("\t\tvar subTitle = $(\"#subTitle\").val();\r\n");
      out.write("\t\tvar text = $(\"#text\").val();\r\n");
      out.write("\t\tvar value = $(\"#value\").val();\r\n");
      out.write("\t\tvar triggerEvent = 1;\r\n");
      out.write("\t\tvar validFromNow = $(\"#validFromNow\")[0].checked;\r\n");
      out.write("\t\tvar validDays = Number($(\"#validDays\").val());\r\n");
      out.write("\t\tvar startDate = $(\"#startDate\").val();\r\n");
      out.write("\t\tvar endDate = $(\"#endDate\").val();\r\n");
      out.write("\r\n");
      out.write("\t\tfor ( var i in $(\"[name='triggerEvent']\")) {\r\n");
      out.write("\t\t\tradioButton = $(\"[name='triggerEvent']\")[i];\r\n");
      out.write("\t\t\tif (radioButton.checked) {\r\n");
      out.write("\t\t\t\ttriggerEvent = radioButton.value;\r\n");
      out.write("\t\t\t\tbreak;\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t}\r\n");
      out.write("\r\n");
      out.write("\t\tif (title == \"\" || text == \"\") {\r\n");
      out.write("\t\t\talert(\"标题和内容不能为空!!\");\r\n");
      out.write("\t\t\treturn;\r\n");
      out.write("\t\t}\r\n");
      out.write("\r\n");
      out.write("\t\tif (validFromNow) {\r\n");
      out.write("\t\t\tif (validDays == \"\" || validDays <= 0) {\r\n");
      out.write("\t\t\t\talert(\"有效天数不能为空且必须大于零!!\");\r\n");
      out.write("\t\t\t\treturn;\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tstartDate = 0;\r\n");
      out.write("\t\t\tendDate = 0;\r\n");
      out.write("\t\t} else {\r\n");
      out.write("\t\t\tif (startDate == \"\" || endDate == \"\") {\r\n");
      out.write("\t\t\t\talert(\"开始有效期和结束日期不能为空!!\");\r\n");
      out.write("\t\t\t\treturn;\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tvalidDays = 0;\r\n");
      out.write("\t\t}\r\n");
      out.write("\r\n");
      out.write("\t\t$.ajax({\r\n");
      out.write("\t\t\turl : 'submitCreateCouponTemplate',\r\n");
      out.write("\t\t\ttype : 'POST',\r\n");
      out.write("\t\t\tdata : {\r\n");
      out.write("\t\t\t\tstoreId : storeId,\r\n");
      out.write("\t\t\t\temployeeId : employeeId,\r\n");
      out.write("\t\t\t\ttitle : title,\r\n");
      out.write("\t\t\t\tsubTitle : subTitle,\r\n");
      out.write("\t\t\t\ttext : text,\r\n");
      out.write("\t\t\t\tvalue : value,\r\n");
      out.write("\t\t\t\ttriggerEvent : triggerEvent,\r\n");
      out.write("\t\t\t\tvalidFromNow : validFromNow,\r\n");
      out.write("\t\t\t\tvalidDays : validDays,\r\n");
      out.write("\t\t\t\tstartDate : startDate,\r\n");
      out.write("\t\t\t\tendDate : endDate,\r\n");
      out.write("\t\t\t},\r\n");
      out.write("\t\t\terror : function() {\r\n");
      out.write("\t\t\t\talert(\"创建优惠券模版出错!请稍后再试!\");\r\n");
      out.write("\t\t\t\treturn;\r\n");
      out.write("\t\t\t},\r\n");
      out.write("\t\t\tsuccess : function(result) {\r\n");
      out.write("\t\t\t\tif (!result) {\r\n");
      out.write("\t\t\t\t\talert(\"创建优惠券模版出错!请稍后再试!!!!\");\r\n");
      out.write("\t\t\t\t\treturn;\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t\twindow.location.href = \"\";\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t});\r\n");
      out.write("\t}\r\n");
      out.write("\r\n");
      out.write("\tfunction deleteCouponTemplateBtnOnClick() {\r\n");
      out.write("\t\tvar storeId = $(\"#storeId\").val();\r\n");
      out.write("\t\tvar employeeId = $(\"#employeeId\").val();\r\n");
      out.write("\t\tvar couponTemplateId = this.value;\r\n");
      out.write("\t\tif (confirm(\"确认要删除该优惠券模版?\")) {\r\n");
      out.write("\t\t\t$.ajax({\r\n");
      out.write("\t\t\t\turl : 'deleteCouponTemplate',\r\n");
      out.write("\t\t\t\ttype : 'POST',\r\n");
      out.write("\t\t\t\tdata : {\r\n");
      out.write("\t\t\t\t\tstoreId : storeId,\r\n");
      out.write("\t\t\t\t\temployeeId : employeeId,\r\n");
      out.write("\t\t\t\t\tcouponTemplateId : couponTemplateId\r\n");
      out.write("\t\t\t\t},\r\n");
      out.write("\t\t\t\terror : function() {\r\n");
      out.write("\t\t\t\t\talert(\"删除优惠券模版出错!请稍后再试!\");\r\n");
      out.write("\t\t\t\t\treturn;\r\n");
      out.write("\t\t\t\t},\r\n");
      out.write("\t\t\t\tsuccess : function(result) {\r\n");
      out.write("\t\t\t\t\tif (!result) {\r\n");
      out.write("\t\t\t\t\t\talert(\"删除优惠券模版出错!请稍后再试!!!!\");\r\n");
      out.write("\t\t\t\t\t\treturn;\r\n");
      out.write("\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t\twindow.location.href = \"\";\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t});\r\n");
      out.write("\t\t}\r\n");
      out.write("\t}\r\n");
      out.write("\r\n");
      out.write("\tfunction sendCouponToAllMemberBtnOnClick() {\r\n");
      out.write("\t\tvar storeId = $(\"#storeId\").val();\r\n");
      out.write("\t\tvar employeeId = $(\"#employeeId\").val();\r\n");
      out.write("\t\tvar couponTemplateId = this.value;\r\n");
      out.write("\r\n");
      out.write("\t\tif (confirm(\"确认要群发优惠券给所有会员?\")) {\r\n");
      out.write("\t\t\t$.ajax({\r\n");
      out.write("\t\t\t\turl : 'sendCouponToAllMember',\r\n");
      out.write("\t\t\t\ttype : 'POST',\r\n");
      out.write("\t\t\t\tdata : {\r\n");
      out.write("\t\t\t\t\tstoreId : storeId,\r\n");
      out.write("\t\t\t\t\temployeeId : employeeId,\r\n");
      out.write("\t\t\t\t\tcouponTemplateId : couponTemplateId\r\n");
      out.write("\t\t\t\t},\r\n");
      out.write("\t\t\t\terror : function() {\r\n");
      out.write("\t\t\t\t\talert(\"群发优惠券出错!请稍后再试!\");\r\n");
      out.write("\t\t\t\t\treturn;\r\n");
      out.write("\t\t\t\t},\r\n");
      out.write("\t\t\t\tsuccess : function(result) {\r\n");
      out.write("\t\t\t\t\tif (!result) {\r\n");
      out.write("\t\t\t\t\t\talert(\"群发优惠券出错!请稍后再试!!!!\");\r\n");
      out.write("\t\t\t\t\t\treturn;\r\n");
      out.write("\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t\talert(\"已群发优惠券给所有会员!\");\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t});\r\n");
      out.write("\t\t}\r\n");
      out.write("\t}\r\n");
      out.write("</script>\r\n");
      out.write("</head>\r\n");
      out.write("<body>\r\n");
      out.write("\t<input id=\"storeId\" value=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${storeId}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("\" type=\"hidden\">\r\n");
      out.write("\t<input id=\"employeeId\" value=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${employeeId}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("\" type=\"hidden\">\r\n");
      out.write("\t<div id=\"createNewCouponTemplate\" class=\"createCouponTemplate\">\r\n");
      out.write("\t\t<div>\r\n");
      out.write("\t\t\t标题 <input id=\"title\"\r\n");
      out.write("\t\t\t\tclass=\"ui-input ui-radius ui-shadow ui-border-solid\" type=\"text\">\r\n");
      out.write("\t\t</div>\r\n");
      out.write("\t\t<div>\r\n");
      out.write("\t\t\t副标题 <input id=\"subTitle\"\r\n");
      out.write("\t\t\t\tclass=\"ui-input ui-radius ui-shadow ui-border-solid\" type=\"text\">\r\n");
      out.write("\t\t</div>\r\n");
      out.write("\t\t<div>\r\n");
      out.write("\t\t\t内容 <input id=\"text\"\r\n");
      out.write("\t\t\t\tclass=\"ui-input ui-radius ui-shadow ui-border-solid\" type=\"text\">\r\n");
      out.write("\t\t</div>\r\n");
      out.write("\t\t<div>\r\n");
      out.write("\t\t\t可抵扣 <input id=\"value\"\r\n");
      out.write("\t\t\t\tclass=\"ui-input ui-radius ui-shadow ui-border-solid\" type=\"text\"\r\n");
      out.write("\t\t\t\tvalue=\"0\">\r\n");
      out.write("\t\t</div>\r\n");
      out.write("\t\t<div>\r\n");
      out.write("\t\t\t触发方式 <input name=\"triggerEvent\" type=\"radio\" value=\"1\"\r\n");
      out.write("\t\t\t\tchecked=\"checked\"> 开卡自动发&nbsp;<input name=\"triggerEvent\"\r\n");
      out.write("\t\t\t\ttype=\"radio\" value=\"2\"> 手动发\r\n");
      out.write("\t\t</div>\r\n");
      out.write("\t\t<div>\r\n");
      out.write("\t\t\t有效方式 <input id=\"validFromNow\" type=\"checkbox\" checked=\"checked\"\r\n");
      out.write("\t\t\t\tonclick=\"validFromNowOnClick()\"> <span>从发卡起有效</span>\r\n");
      out.write("\t\t</div>\r\n");
      out.write("\t\t<div id=\"validFromNowDate\">\r\n");
      out.write("\t\t\t有效天数 <input id=\"validDays\"\r\n");
      out.write("\t\t\t\tclass=\"ui-input ui-radius ui-shadow ui-border-solid\" type=\"text\">\r\n");
      out.write("\t\t</div>\r\n");
      out.write("\t\t<div id=\"validFromDate\" style=\"display: none;\">\r\n");
      out.write("\t\t\t开始有效期 <input id=\"startDate\" onclick=\"new Calendar().show(this);\">\r\n");
      out.write("\t\t\t结束日期 <input id=\"endDate\" onclick=\"new Calendar().show(this);\">\r\n");
      out.write("\t\t</div>\r\n");
      out.write("\t\t<div style=\"text-align: center;\">\r\n");
      out.write("\t\t\t<div id=\"123\" class=\"button\" onclick=\"submitCreateCouponTemplate()\">新建</div>\r\n");
      out.write("\t\t</div>\r\n");
      out.write("\t</div>\r\n");
      out.write("\t<div id=\"couponTemplateList\">\r\n");
      out.write("\t\t");
      if (_jspx_meth_c_005fforEach_005f0(_jspx_page_context))
        return;
      out.write("\r\n");
      out.write("\t</div>\r\n");
      out.write("</body>\r\n");
      out.write("</html>\r\n");
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
    // /WEB-INF/views/couponTemplateOperatePage.jsp(307,2) name = items type = java.lang.Object reqTime = true required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005fforEach_005f0.setItems((java.lang.Object) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${ couponTemplates}", java.lang.Object.class, (PageContext)_jspx_page_context, null, false));
    // /WEB-INF/views/couponTemplateOperatePage.jsp(307,2) name = var type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005fforEach_005f0.setVar("couponTemplate");
    int[] _jspx_push_body_count_c_005fforEach_005f0 = new int[] { 0 };
    try {
      int _jspx_eval_c_005fforEach_005f0 = _jspx_th_c_005fforEach_005f0.doStartTag();
      if (_jspx_eval_c_005fforEach_005f0 != javax.servlet.jsp.tagext.Tag.SKIP_BODY) {
        do {
          out.write("\r\n");
          out.write("\t\t\t<div class=\"couponTemplateItem\">\r\n");
          out.write("\t\t\t\t<span>");
          out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${couponTemplate.title}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
          out.write("</span>\r\n");
          out.write("\t\t\t\t<div style=\"float: right;\">\r\n");
          out.write("\t\t\t\t\t<button name=\"sendCouponToAllMember\" class=\"button\"\r\n");
          out.write("\t\t\t\t\t\tvalue=\"");
          out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${couponTemplate.id}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
          out.write("\">群发</button>\r\n");
          out.write("\t\t\t\t\t<button name=\"deleteCouponTemplateBtn\" class=\"button\"\r\n");
          out.write("\t\t\t\t\t\tvalue=\"");
          out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${couponTemplate.id}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
          out.write("\">删除</button>\r\n");
          out.write("\t\t\t\t</div>\r\n");
          out.write("\r\n");
          out.write("\t\t\t\t<p>");
          out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${couponTemplate.subTitle}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
          out.write("</p>\r\n");
          out.write("\t\t\t\t<p>\r\n");
          out.write("\t\t\t\t\t可抵扣:");
          out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${couponTemplate.value}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
          out.write("&nbsp;&nbsp; 触发方式:\r\n");
          out.write("\t\t\t\t\t");
          if (_jspx_meth_c_005fif_005f0(_jspx_th_c_005fforEach_005f0, _jspx_page_context, _jspx_push_body_count_c_005fforEach_005f0))
            return true;
          out.write("\r\n");
          out.write("\t\t\t\t\t");
          if (_jspx_meth_c_005fif_005f1(_jspx_th_c_005fforEach_005f0, _jspx_page_context, _jspx_push_body_count_c_005fforEach_005f0))
            return true;
          out.write("\r\n");
          out.write("\t\t\t\t</p>\r\n");
          out.write("\t\t\t\t<p>\r\n");
          out.write("\t\t\t\t\t");
          if (_jspx_meth_c_005fchoose_005f0(_jspx_th_c_005fforEach_005f0, _jspx_page_context, _jspx_push_body_count_c_005fforEach_005f0))
            return true;
          out.write("\r\n");
          out.write("\t\t\t\t</p>\r\n");
          out.write("\t\t\t\t<p>&nbsp;&nbsp;&nbsp;&nbsp;");
          out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${couponTemplate.text}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
          out.write("</p>\r\n");
          out.write("\t\t\t</div>\r\n");
          out.write("\t\t");
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

  private boolean _jspx_meth_c_005fif_005f0(javax.servlet.jsp.tagext.JspTag _jspx_th_c_005fforEach_005f0, PageContext _jspx_page_context, int[] _jspx_push_body_count_c_005fforEach_005f0)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  c:if
    org.apache.taglibs.standard.tag.rt.core.IfTag _jspx_th_c_005fif_005f0 = (org.apache.taglibs.standard.tag.rt.core.IfTag) _005fjspx_005ftagPool_005fc_005fif_0026_005ftest.get(org.apache.taglibs.standard.tag.rt.core.IfTag.class);
    _jspx_th_c_005fif_005f0.setPageContext(_jspx_page_context);
    _jspx_th_c_005fif_005f0.setParent((javax.servlet.jsp.tagext.Tag) _jspx_th_c_005fforEach_005f0);
    // /WEB-INF/views/couponTemplateOperatePage.jsp(320,5) name = test type = boolean reqTime = true required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005fif_005f0.setTest(((java.lang.Boolean) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${couponTemplate.triggerEvent==1}", java.lang.Boolean.class, (PageContext)_jspx_page_context, null, false)).booleanValue());
    int _jspx_eval_c_005fif_005f0 = _jspx_th_c_005fif_005f0.doStartTag();
    if (_jspx_eval_c_005fif_005f0 != javax.servlet.jsp.tagext.Tag.SKIP_BODY) {
      do {
        out.write(" 开卡自动发");
        int evalDoAfterBody = _jspx_th_c_005fif_005f0.doAfterBody();
        if (evalDoAfterBody != javax.servlet.jsp.tagext.BodyTag.EVAL_BODY_AGAIN)
          break;
      } while (true);
    }
    if (_jspx_th_c_005fif_005f0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _005fjspx_005ftagPool_005fc_005fif_0026_005ftest.reuse(_jspx_th_c_005fif_005f0);
      return true;
    }
    _005fjspx_005ftagPool_005fc_005fif_0026_005ftest.reuse(_jspx_th_c_005fif_005f0);
    return false;
  }

  private boolean _jspx_meth_c_005fif_005f1(javax.servlet.jsp.tagext.JspTag _jspx_th_c_005fforEach_005f0, PageContext _jspx_page_context, int[] _jspx_push_body_count_c_005fforEach_005f0)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  c:if
    org.apache.taglibs.standard.tag.rt.core.IfTag _jspx_th_c_005fif_005f1 = (org.apache.taglibs.standard.tag.rt.core.IfTag) _005fjspx_005ftagPool_005fc_005fif_0026_005ftest.get(org.apache.taglibs.standard.tag.rt.core.IfTag.class);
    _jspx_th_c_005fif_005f1.setPageContext(_jspx_page_context);
    _jspx_th_c_005fif_005f1.setParent((javax.servlet.jsp.tagext.Tag) _jspx_th_c_005fforEach_005f0);
    // /WEB-INF/views/couponTemplateOperatePage.jsp(321,5) name = test type = boolean reqTime = true required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005fif_005f1.setTest(((java.lang.Boolean) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${couponTemplate.triggerEvent==2}", java.lang.Boolean.class, (PageContext)_jspx_page_context, null, false)).booleanValue());
    int _jspx_eval_c_005fif_005f1 = _jspx_th_c_005fif_005f1.doStartTag();
    if (_jspx_eval_c_005fif_005f1 != javax.servlet.jsp.tagext.Tag.SKIP_BODY) {
      do {
        out.write(" 手动发");
        int evalDoAfterBody = _jspx_th_c_005fif_005f1.doAfterBody();
        if (evalDoAfterBody != javax.servlet.jsp.tagext.BodyTag.EVAL_BODY_AGAIN)
          break;
      } while (true);
    }
    if (_jspx_th_c_005fif_005f1.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _005fjspx_005ftagPool_005fc_005fif_0026_005ftest.reuse(_jspx_th_c_005fif_005f1);
      return true;
    }
    _005fjspx_005ftagPool_005fc_005fif_0026_005ftest.reuse(_jspx_th_c_005fif_005f1);
    return false;
  }

  private boolean _jspx_meth_c_005fchoose_005f0(javax.servlet.jsp.tagext.JspTag _jspx_th_c_005fforEach_005f0, PageContext _jspx_page_context, int[] _jspx_push_body_count_c_005fforEach_005f0)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  c:choose
    org.apache.taglibs.standard.tag.common.core.ChooseTag _jspx_th_c_005fchoose_005f0 = (org.apache.taglibs.standard.tag.common.core.ChooseTag) _005fjspx_005ftagPool_005fc_005fchoose.get(org.apache.taglibs.standard.tag.common.core.ChooseTag.class);
    _jspx_th_c_005fchoose_005f0.setPageContext(_jspx_page_context);
    _jspx_th_c_005fchoose_005f0.setParent((javax.servlet.jsp.tagext.Tag) _jspx_th_c_005fforEach_005f0);
    int _jspx_eval_c_005fchoose_005f0 = _jspx_th_c_005fchoose_005f0.doStartTag();
    if (_jspx_eval_c_005fchoose_005f0 != javax.servlet.jsp.tagext.Tag.SKIP_BODY) {
      do {
        out.write("\r\n");
        out.write("\t\t\t\t\t\t");
        if (_jspx_meth_c_005fwhen_005f0(_jspx_th_c_005fchoose_005f0, _jspx_page_context, _jspx_push_body_count_c_005fforEach_005f0))
          return true;
        out.write("\r\n");
        out.write("\t\t\t\t\t\t");
        if (_jspx_meth_c_005fotherwise_005f0(_jspx_th_c_005fchoose_005f0, _jspx_page_context, _jspx_push_body_count_c_005fforEach_005f0))
          return true;
        out.write("\r\n");
        out.write("\t\t\t\t\t");
        int evalDoAfterBody = _jspx_th_c_005fchoose_005f0.doAfterBody();
        if (evalDoAfterBody != javax.servlet.jsp.tagext.BodyTag.EVAL_BODY_AGAIN)
          break;
      } while (true);
    }
    if (_jspx_th_c_005fchoose_005f0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _005fjspx_005ftagPool_005fc_005fchoose.reuse(_jspx_th_c_005fchoose_005f0);
      return true;
    }
    _005fjspx_005ftagPool_005fc_005fchoose.reuse(_jspx_th_c_005fchoose_005f0);
    return false;
  }

  private boolean _jspx_meth_c_005fwhen_005f0(javax.servlet.jsp.tagext.JspTag _jspx_th_c_005fchoose_005f0, PageContext _jspx_page_context, int[] _jspx_push_body_count_c_005fforEach_005f0)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  c:when
    org.apache.taglibs.standard.tag.rt.core.WhenTag _jspx_th_c_005fwhen_005f0 = (org.apache.taglibs.standard.tag.rt.core.WhenTag) _005fjspx_005ftagPool_005fc_005fwhen_0026_005ftest.get(org.apache.taglibs.standard.tag.rt.core.WhenTag.class);
    _jspx_th_c_005fwhen_005f0.setPageContext(_jspx_page_context);
    _jspx_th_c_005fwhen_005f0.setParent((javax.servlet.jsp.tagext.Tag) _jspx_th_c_005fchoose_005f0);
    // /WEB-INF/views/couponTemplateOperatePage.jsp(325,6) name = test type = boolean reqTime = true required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005fwhen_005f0.setTest(((java.lang.Boolean) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${couponTemplate.validFromNow}", java.lang.Boolean.class, (PageContext)_jspx_page_context, null, false)).booleanValue());
    int _jspx_eval_c_005fwhen_005f0 = _jspx_th_c_005fwhen_005f0.doStartTag();
    if (_jspx_eval_c_005fwhen_005f0 != javax.servlet.jsp.tagext.Tag.SKIP_BODY) {
      do {
        out.write("\r\n");
        out.write("\t\t\t\t\t\t\t有效天数 : ");
        out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${couponTemplate.validDays}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
        out.write("\r\n");
        out.write("\t\t\t\t\t\t");
        int evalDoAfterBody = _jspx_th_c_005fwhen_005f0.doAfterBody();
        if (evalDoAfterBody != javax.servlet.jsp.tagext.BodyTag.EVAL_BODY_AGAIN)
          break;
      } while (true);
    }
    if (_jspx_th_c_005fwhen_005f0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _005fjspx_005ftagPool_005fc_005fwhen_0026_005ftest.reuse(_jspx_th_c_005fwhen_005f0);
      return true;
    }
    _005fjspx_005ftagPool_005fc_005fwhen_0026_005ftest.reuse(_jspx_th_c_005fwhen_005f0);
    return false;
  }

  private boolean _jspx_meth_c_005fotherwise_005f0(javax.servlet.jsp.tagext.JspTag _jspx_th_c_005fchoose_005f0, PageContext _jspx_page_context, int[] _jspx_push_body_count_c_005fforEach_005f0)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  c:otherwise
    org.apache.taglibs.standard.tag.common.core.OtherwiseTag _jspx_th_c_005fotherwise_005f0 = (org.apache.taglibs.standard.tag.common.core.OtherwiseTag) _005fjspx_005ftagPool_005fc_005fotherwise.get(org.apache.taglibs.standard.tag.common.core.OtherwiseTag.class);
    _jspx_th_c_005fotherwise_005f0.setPageContext(_jspx_page_context);
    _jspx_th_c_005fotherwise_005f0.setParent((javax.servlet.jsp.tagext.Tag) _jspx_th_c_005fchoose_005f0);
    int _jspx_eval_c_005fotherwise_005f0 = _jspx_th_c_005fotherwise_005f0.doStartTag();
    if (_jspx_eval_c_005fotherwise_005f0 != javax.servlet.jsp.tagext.Tag.SKIP_BODY) {
      do {
        out.write("\r\n");
        out.write("\t\t\t\t\t\t\t有效期 ");
        out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${couponTemplate.startDateStr}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
        out.write(' ');
        out.write('至');
        out.write(' ');
        out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${couponTemplate.endDateStr}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
        out.write("\r\n");
        out.write("\t\t\t\t\t\t");
        int evalDoAfterBody = _jspx_th_c_005fotherwise_005f0.doAfterBody();
        if (evalDoAfterBody != javax.servlet.jsp.tagext.BodyTag.EVAL_BODY_AGAIN)
          break;
      } while (true);
    }
    if (_jspx_th_c_005fotherwise_005f0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _005fjspx_005ftagPool_005fc_005fotherwise.reuse(_jspx_th_c_005fotherwise_005f0);
      return true;
    }
    _005fjspx_005ftagPool_005fc_005fotherwise.reuse(_jspx_th_c_005fotherwise_005f0);
    return false;
  }
}

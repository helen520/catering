package org.apache.jsp.WEB_002dINF.views;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class modifyPassword_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static final JspFactory _jspxFactory = JspFactory.getDefaultFactory();

  private static java.util.List _jspx_dependants;

  private org.apache.jasper.runtime.TagHandlerPool _005fjspx_005ftagPool_005fc_005fif_0026_005ftest;

  private javax.el.ExpressionFactory _el_expressionfactory;
  private org.apache.AnnotationProcessor _jsp_annotationprocessor;

  public Object getDependants() {
    return _jspx_dependants;
  }

  public void _jspInit() {
    _005fjspx_005ftagPool_005fc_005fif_0026_005ftest = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
    _el_expressionfactory = _jspxFactory.getJspApplicationContext(getServletConfig().getServletContext()).getExpressionFactory();
    _jsp_annotationprocessor = (org.apache.AnnotationProcessor) getServletConfig().getServletContext().getAttribute(org.apache.AnnotationProcessor.class.getName());
  }

  public void _jspDestroy() {
    _005fjspx_005ftagPool_005fc_005fif_0026_005ftest.release();
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
      out.write("<title>RICE3</title>\r\n");
      out.write("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\r\n");
      out.write("<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge,chrome=1\">\r\n");
      out.write("<meta name=\"viewport\"\r\n");
      out.write("\tcontent=\"width=device-width,initial-scale=1,user-scalable=no,maximum-scale=1\">\r\n");
      out.write("<style>\r\n");
      out.write(".errorblock {\r\n");
      out.write("\tcolor: #ff0000;\r\n");
      out.write("\tbackground-color: #ffEEEE;\r\n");
      out.write("\tborder: 3px solid #ff0000;\r\n");
      out.write("\tpadding: 8px;\r\n");
      out.write("\tmargin: 10px;\r\n");
      out.write("\ttext-align: center;\r\n");
      out.write("}\r\n");
      out.write("\r\n");
      out.write("input[type=text],input[type=password] {\r\n");
      out.write("\twidth: 120px;\r\n");
      out.write("\theight: 25px;\r\n");
      out.write("}\r\n");
      out.write("\r\n");
      out.write("input[type=button],input[type=reset] {\r\n");
      out.write("\theight: 35px;\r\n");
      out.write("\twidth: 65px;\r\n");
      out.write("}\r\n");
      out.write("\r\n");
      out.write("table {\r\n");
      out.write("\tborder: 1px solid #ccc;\r\n");
      out.write("\tpadding: 15px;\r\n");
      out.write("\t/*width: 100%;//*/\r\n");
      out.write("\tmargin-top: 10px;\r\n");
      out.write("\tfont-size: 15px;\r\n");
      out.write("}\r\n");
      out.write("\r\n");
      out.write("table td {\r\n");
      out.write("\theight: 35px;\r\n");
      out.write("\ttext-align: center;\r\n");
      out.write("}\r\n");
      out.write("</style>\r\n");
      out.write("</head>\r\n");
      out.write("<body>\r\n");
      out.write("\t");
      if (_jspx_meth_c_005fif_005f0(_jspx_page_context))
        return;
      out.write("\r\n");
      out.write("\r\n");
      out.write("\t");
      if (_jspx_meth_c_005fif_005f1(_jspx_page_context))
        return;
      out.write("\r\n");
      out.write("\r\n");
      out.write("\t<form name='f' action=\"submitNewPassword\" method='POST'>\r\n");
      out.write("\t\t<table cellspacing=\"0\" cellpadding=\"0\" align=\"center\">\r\n");
      out.write("\t\t\t<tr>\r\n");
      out.write("\t\t\t\t<td><span id=\"user_text\">用户名</span> :</td>\r\n");
      out.write("\t\t\t\t<td colspan=\"2\"><input type='text' name='userName'></td>\r\n");
      out.write("\t\t\t</tr>\r\n");
      out.write("\t\t\t<tr>\r\n");
      out.write("\t\t\t\t<td><span id=\"oldPassword_text\">旧密码</span> :</td>\r\n");
      out.write("\t\t\t\t<td colspan=\"2\"><input type='password' name='oldPassword' /></td>\r\n");
      out.write("\t\t\t</tr>\r\n");
      out.write("\t\t\t<tr>\r\n");
      out.write("\t\t\t\t<td><span id=\"newPassword_text\">新密码</span> :</td>\r\n");
      out.write("\t\t\t\t<td colspan=\"2\"><input type='password' name='newPassword' /></td>\r\n");
      out.write("\t\t\t</tr>\r\n");
      out.write("\t\t\t<tr>\r\n");
      out.write("\t\t\t\t<td><span id=\"reNewPassword_text\">重复新密码</span> :</td>\r\n");
      out.write("\t\t\t\t<td colspan=\"2\"><input type='password' name='reNewPassword' /></td>\r\n");
      out.write("\t\t\t</tr>\r\n");
      out.write("\t\t\t<tr>\r\n");
      out.write("\t\t\t\t<td align=\"center\"><input onclick=\"checkInput(this)\"\r\n");
      out.write("\t\t\t\t\ttype=\"button\" value=\"确认\" /></td>\r\n");
      out.write("\t\t\t\t<td align=\"center\"><input id=\"reset_button\" name=\"reset\"\r\n");
      out.write("\t\t\t\t\ttype=\"reset\" value=\"重置\" /></td>\r\n");
      out.write("\t\t\t\t<td align=\"center\"><a id=\"returnLogin\" href='login'>返回</a></td>\r\n");
      out.write("\t\t\t</tr>\r\n");
      out.write("\t\t</table>\r\n");
      out.write("\t</form>\r\n");
      out.write("\t<script type=\"text/javascript\" src=\"js/vendor/jquery-1.10.1.min.js\"></script>\r\n");
      out.write("\t<script type=\"text/javascript\"\r\n");
      out.write("\t\tsrc=\"js/vendor/jquery.i18n.properties-1.0.9.js\"></script>\r\n");
      out.write("\t<script type=\"text/javascript\">\r\n");
      out.write("\t\t$(function() {\r\n");
      out.write("\t\t\tjQuery.i18n.properties({\r\n");
      out.write("\t\t\t\tname : 'strings',\r\n");
      out.write("\t\t\t\tpath : 'resources/i18n/',\r\n");
      out.write("\t\t\t\tmode : 'map',\r\n");
      out.write("\t\t\t\tcallback : function() {\r\n");
      out.write("\t\t\t\t\t$(\"#modifiedState\")\r\n");
      out.write("\t\t\t\t\t\t\t.text($.i18n.prop('string_xiuGaiShiBai'));\r\n");
      out.write("\t\t\t\t\t$(\"#user_text\").text($.i18n.prop('string_yongHu'));\r\n");
      out.write("\t\t\t\t\t$(\"#oldPassword_text\").text($.i18n.prop('string_jiuMiMa'));\r\n");
      out.write("\t\t\t\t\t$(\"#newPassword_text\").text($.i18n.prop('string_xinMiMa'));\r\n");
      out.write("\t\t\t\t\t$(\"#submit_button\").val($.i18n.prop('string_queRen'));\r\n");
      out.write("\t\t\t\t\t$(\"#reset_button\").val($.i18n.prop('string_chongZhi'));\r\n");
      out.write("\t\t\t\t\t$(\"#return\").text($.i18n.prop('string_fanHui'));\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t});\r\n");
      out.write("\t\t});\r\n");
      out.write("\t\tfunction checkInput(thisObject) {\r\n");
      out.write("\t\t\tvar userName = $.trim(thisObject.form.userName.value);\r\n");
      out.write("\t\t\tvar oldPassword = $.trim(thisObject.form.oldPassword.value);\r\n");
      out.write("\t\t\tvar newPassword = $.trim(thisObject.form.newPassword.value);\r\n");
      out.write("\t\t\tvar reNewPassword = $.trim(thisObject.form.reNewPassword.value);\r\n");
      out.write("\r\n");
      out.write("\t\t\tif (userName == \"\" || oldPassword == \"\" || newPassword == \"\"\r\n");
      out.write("\t\t\t\t\t|| reNewPassword == \"\") {\r\n");
      out.write("\t\t\t\talert(\"请输入完整信息!\");\r\n");
      out.write("\t\t\t\treturn;\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\r\n");
      out.write("\t\t\tif (newPassword !== reNewPassword) {\r\n");
      out.write("\t\t\t\talert(\"重复输入的密码不一致!请重新输入!\");\r\n");
      out.write("\t\t\t\treturn;\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tthisObject.form.submit();\r\n");
      out.write("\t\t}\r\n");
      out.write("\t</script>\r\n");
      out.write("</body>\r\n");
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

  private boolean _jspx_meth_c_005fif_005f0(PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  c:if
    org.apache.taglibs.standard.tag.rt.core.IfTag _jspx_th_c_005fif_005f0 = (org.apache.taglibs.standard.tag.rt.core.IfTag) _005fjspx_005ftagPool_005fc_005fif_0026_005ftest.get(org.apache.taglibs.standard.tag.rt.core.IfTag.class);
    _jspx_th_c_005fif_005f0.setPageContext(_jspx_page_context);
    _jspx_th_c_005fif_005f0.setParent(null);
    // /WEB-INF/views/modifyPassword.jsp(46,1) name = test type = boolean reqTime = true required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005fif_005f0.setTest(((java.lang.Boolean) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${not empty error}", java.lang.Boolean.class, (PageContext)_jspx_page_context, null, false)).booleanValue());
    int _jspx_eval_c_005fif_005f0 = _jspx_th_c_005fif_005f0.doStartTag();
    if (_jspx_eval_c_005fif_005f0 != javax.servlet.jsp.tagext.Tag.SKIP_BODY) {
      do {
        out.write("\r\n");
        out.write("\t\t<div class=\"errorblock\">\r\n");
        out.write("\t\t\t<div id=\"modifiedState\">修改失败</div>\r\n");
        out.write("\t\t\t<div id=\"modifiedFailureReason\">原因:用户名或密码错误</div>\r\n");
        out.write("\t\t</div>\r\n");
        out.write("\t");
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

  private boolean _jspx_meth_c_005fif_005f1(PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  c:if
    org.apache.taglibs.standard.tag.rt.core.IfTag _jspx_th_c_005fif_005f1 = (org.apache.taglibs.standard.tag.rt.core.IfTag) _005fjspx_005ftagPool_005fc_005fif_0026_005ftest.get(org.apache.taglibs.standard.tag.rt.core.IfTag.class);
    _jspx_th_c_005fif_005f1.setPageContext(_jspx_page_context);
    _jspx_th_c_005fif_005f1.setParent(null);
    // /WEB-INF/views/modifyPassword.jsp(53,1) name = test type = boolean reqTime = true required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005fif_005f1.setTest(((java.lang.Boolean) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${not empty notice}", java.lang.Boolean.class, (PageContext)_jspx_page_context, null, false)).booleanValue());
    int _jspx_eval_c_005fif_005f1 = _jspx_th_c_005fif_005f1.doStartTag();
    if (_jspx_eval_c_005fif_005f1 != javax.servlet.jsp.tagext.Tag.SKIP_BODY) {
      do {
        out.write("\r\n");
        out.write("\t\t<div class=\"errorblock\">\r\n");
        out.write("\t\t\t<div id=\"modifiedState\">修改失败</div>\r\n");
        out.write("\t\t\t<div id=\"modifiedFailureReason\">原因:密码不能为空!</div>\r\n");
        out.write("\t\t</div>\r\n");
        out.write("\t");
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
}

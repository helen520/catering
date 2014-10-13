package helen.catering.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.AbstractHandlerExceptionResolver;

@Component
public class RestResponseStatusExceptionResolver extends
		AbstractHandlerExceptionResolver {
	@Override
	protected ModelAndView doResolveException(HttpServletRequest request,
			HttpServletResponse response, Object handler, Exception ex) {
		response.setStatus(506);
		ModelAndView mv = new ModelAndView();
		mv.setViewName("error");
		mv.addObject("message",ex.getMessage());
		ex.printStackTrace();
		return mv;
	}
}
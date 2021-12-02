package com.amrTm.backLMS.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

@Component
public class UserOAuth2FailureHandler implements AuthenticationFailureHandler {
	
	private DefaultRedirectStrategy redirect = new DefaultRedirectStrategy();
	
	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException exception) throws IOException, ServletException {
		SecurityContextHolder.clearContext();
		redirect.sendRedirect(request, response, "http://localhost:3000/login?auth="+exception.getMessage()+"&err=403");
	}
}

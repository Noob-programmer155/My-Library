package com.amrTm.backLMS.security;

import java.io.IOException;
import java.util.Base64;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.amrTm.backLMS.entity.User;
import com.amrTm.backLMS.repository.UserRepo;

@Component
public class UserOAuth2SuccessHandler implements AuthenticationSuccessHandler{
	
	@Autowired
	private UserRepo userRepo;
	
	private DefaultRedirectStrategy redirect = new DefaultRedirectStrategy();
	
	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {
		UserDetail auth = (UserDetail)authentication.getPrincipal();
		User user = userRepo.findByEmail(auth.getUsername()).get();
		StringBuilder sb = new StringBuilder();
		sb.append("Access").append("=").append(user.getId()).append("&")
		.append("Usr").append("=").append(Base64.getEncoder().encodeToString(user.getName().getBytes())).append("&")
		.append("lk").append("=").append(Base64.getEncoder().encodeToString(user.getEmail().getBytes()));
		redirect.sendRedirect(request, response, "http://localhost:3000/verify-user?"+sb.toString());
	}
}

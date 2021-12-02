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
		UserDetail user = (UserDetail)authentication.getPrincipal();
		User yu = userRepo.findByEmail(user.getUsername()).get();
		StringBuilder tu = new StringBuilder();
		tu.append("Access").append("=").append(yu.getId()).append("&")
		.append("Usr").append("=").append(Base64.getEncoder().encodeToString(yu.getName().getBytes())).append("&")
		.append("lk").append("=").append(Base64.getEncoder().encodeToString(yu.getEmail().getBytes()));
		redirect.sendRedirect(request, response, "http://localhost:3000/verify-user?"+tu.toString());
	}
}

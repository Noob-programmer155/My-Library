package com.amrTm.backLMS.token_service;

import java.io.IOException;
import java.text.ParseException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.JwtException;

public class TokenFilter extends OncePerRequestFilter{
	
	private TokenTools tokenTools; 
	
	public TokenFilter(TokenTools tokenTools) {
		this.tokenTools = tokenTools;
	}
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		try {
			String token = tokenTools.resolveToken(request);
			if(tokenTools.validateToken(token)) {
				Authentication auth = tokenTools.getAuth(token);
				SecurityContextHolder.getContext().setAuthentication(auth);
			}}
		catch(IllegalArgumentException e) {
			SecurityContextHolder.clearContext();
			throw new IllegalArgumentException(e.getMessage());
		}
		catch(JwtException e) {
			SecurityContextHolder.clearContext();
			throw new JwtException(e.getMessage());
		} catch (ParseException e) {
			SecurityContextHolder.clearContext();
			throw new IllegalArgumentException(e.getMessage());
		}
		filterChain.doFilter(request, response);
	}
}

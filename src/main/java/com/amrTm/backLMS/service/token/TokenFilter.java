package com.amrTm.backLMS.service.token;

import java.io.IOException;
import java.text.ParseException;
import java.util.List;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.JwtException;

public class TokenFilter extends OncePerRequestFilter{
	
	private TokenTools tokenTools; 
	private List<String> ignorePath;
	
	private AntPathMatcher pathMatcher = new AntPathMatcher();
	public TokenFilter(TokenTools tokenTools, List<String> ignorePath) {
		this.tokenTools = tokenTools;
		this.ignorePath = ignorePath;
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
	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
		return ignorePath.stream().anyMatch(a -> {return pathMatcher.match(a, request.getRequestURI());});
	}
}

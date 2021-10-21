package com.amrTm.backLMS.token_service;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.text.ParseException;
import java.util.Arrays;
import java.util.Base64;
import java.util.Collections;
import java.util.Date;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.amrTm.backLMS.cookie_tools.Cookie_Tools;
import com.amrTm.backLMS.cookie_tools.CustomCookie;
import com.amrTm.backLMS.cookie_tools.CustomCookie.site;
import com.amrTm.backLMS.entity.Role;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Service
public class TokenTools {
	private final long exp = 86400000;
	private final String privateApi = "Some Password Secret Api";
	private PrivateKey secret;
	private String api;
	
	@PostConstruct
	private void generatedKey() throws NoSuchAlgorithmException {
		KeyPairGenerator key = KeyPairGenerator.getInstance("RSA");
		key.initialize(2048);
		KeyPair pair = key.generateKeyPair();
		secret = pair.getPrivate();
		api = Base64.getEncoder().encodeToString(privateApi.getBytes());
	}
	
	private String initToken(String username, String email, String role) {
		Date date =  new Date();
		Claims claim = Jwts.claims().setSubject(email);
		claim.put("un", username);
		claim.put("rl", role);
		claim.put("api", api);
		return Jwts.builder()
				.setClaims(claim)
				.setIssuedAt(date)
				.setExpiration(new Date(date.getTime()+exp))
				.signWith(SignatureAlgorithm.RS512, secret)
				.compact();
	}
	
	public boolean createToken(String username, String email, Role role, HttpServletResponse res) {
		String token = initToken(username, email, role.toString());
		CustomCookie cookie = new CustomCookie("JLMS_TOKEN",token);
		cookie.setDomain("localhost");
		cookie.setHttpOnly(true);
//		cookie.setSecure(true);
		cookie.setSecure(false);
		cookie.setMaxAge(86400l);
		cookie.setPath("/");
		cookie.setSameSite(site.NONE);
		Cookie_Tools.buildCookie(res, cookie);
		return true;
	}
	
	public Authentication getAuth(String token) {
		Jws<Claims> claim = Jwts.parser().setSigningKey(secret).parseClaimsJws(token);
		Role role = Role.valueOf((String)claim.getBody().get("rl"));
		return new UsernamePasswordAuthenticationToken(claim.getBody().getSubject(), "", Collections.singletonList(role));
	}
	
	public String resolveToken(HttpServletRequest req) throws ParseException {
		CustomCookie cookie = Cookie_Tools.getCustomCookie(req, "JLMS_TOKEN");
		return cookie.getValue();
	}
	
	public boolean validateToken(String token) {
		Jws<Claims> claim = Jwts.parser().setSigningKey(secret).parseClaimsJws(token);
		String api = (String)claim.getBody().get("api");
		byte[] a = Base64.getDecoder().decode(api);
		byte[] b = Base64.getDecoder().decode(this.api);
		return Arrays.equals(a, b);
	}
}

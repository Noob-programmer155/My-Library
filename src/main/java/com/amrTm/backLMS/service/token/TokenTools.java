package com.amrTm.backLMS.service.token;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
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
import com.amrTm.backLMS.configuration.CookieConfig;
import com.amrTm.backLMS.configuration.CustomCookie;
import com.amrTm.backLMS.configuration.CustomCookie.sameSite;
import com.amrTm.backLMS.entity.Role;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Service
public class TokenTools {
	private final long exp = 86400000;
	private PrivateKey secret;
	private String api;
	
	@PostConstruct
	private void generatedKey() throws NoSuchAlgorithmException {
		KeyPairGenerator key = KeyPairGenerator.getInstance("RSA");
		key.initialize(2048);
		KeyPair pair = key.generateKeyPair();
		secret = pair.getPrivate();
		PublicKey publicKey = pair.getPublic();
		api = Base64.getEncoder().encodeToString(publicKey.getEncoded());
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
		cookie.setSecure(true);
//		if using SameSite NONE, secure must to enable
//		cookie.setSecure(false);
		cookie.setMaxAge(86400);
		cookie.setPath("/");
		cookie.setSameSite(sameSite.NONE);
		CookieConfig.buildCookie(res, cookie);
		return true;
	}
	
	public Authentication getAuth(String token) {
		Jws<Claims> claim = Jwts.parser().setSigningKey(secret).parseClaimsJws(token);
		Role role = Role.valueOf((String)claim.getBody().get("rl"));
		return new UsernamePasswordAuthenticationToken(claim.getBody().getSubject(), "", Collections.singletonList(role));
	}
	
	public String resolveToken(HttpServletRequest req) throws ParseException {
		CustomCookie cookie = CookieConfig.getCustomCookie(req, "JLMS_TOKEN");
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

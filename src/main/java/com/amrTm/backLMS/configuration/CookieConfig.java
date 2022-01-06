package com.amrTm.backLMS.configuration;

import java.text.ParseException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class CookieConfig {
	public static CustomCookie getCustomCookie(HttpServletRequest req, String cookiename) throws ParseException {
		String sw = req.getHeader("Cookie");
		CustomCookie cc = null;
		String[] tr = sw.split(";\s");
		if(tr.length > 0) {
			for(String hf:tr) {
				if(hf.startsWith(cookiename)) {
					cc = new CustomCookie(hf.split("=")[0],hf.split("=")[1]);
					break;
				}
			}
		}
		else {
			if(sw.startsWith(cookiename)) {
				cc = new CustomCookie(sw.split("=")[0],sw.split("=")[1]);
			}
		}
		return cc;
	}
	
	public static void buildCookie(HttpServletResponse res, CustomCookie cookie) {
		res.addHeader("Set-Cookie", cookie.build());
	}
}

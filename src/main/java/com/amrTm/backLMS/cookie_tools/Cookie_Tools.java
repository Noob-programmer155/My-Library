package com.amrTm.backLMS.cookie_tools;

import java.text.ParseException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class Cookie_Tools {
	public static CustomCookie getCustomCookie(HttpServletRequest req, String cookiename) throws ParseException {
		String sw = req.getHeader("Cookie");
		CustomCookie cc = null;
		String[] tr = sw.split(";\s");
		for(String hf:tr) {
			if(hf.startsWith(cookiename)) {
				cc = new CustomCookie(hf.split("=")[0],hf.split("=")[1]);
				break;
			}
		}
		return cc;
	}
	
	public static void buildCookie(HttpServletResponse res, CustomCookie cookie) {
		res.addHeader("Set-Cookie", cookie.build());
	}
}

package com.amrTm.backLMS.configuration;

import java.text.ParseException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class CookieConfig {
	public static CustomCookie getCustomCookie(HttpServletRequest req, String cookiename) throws ParseException {
		String data = req.getHeader("Cookie");
		CustomCookie cc = null;
		String[] datas = data.split(";\s");
		if(datas.length > 0) {
			for(String item:datas) {
				if(item.startsWith(cookiename)) {
					cc = new CustomCookie(item.split("=")[0],item.split("=")[1]);
					break;
				}
			}
		}
		else {
			if(data.startsWith(cookiename)) {
				cc = new CustomCookie(data.split("=")[0],data.split("=")[1]);
			}
		}
		return cc;
	}
	
	public static void buildCookie(HttpServletResponse res, CustomCookie cookie) {
		res.addHeader("Set-Cookie", cookie.build());
	}
}

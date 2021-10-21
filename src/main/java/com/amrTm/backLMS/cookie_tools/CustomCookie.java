package com.amrTm.backLMS.cookie_tools;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

public class CustomCookie {
	public enum site{ 
		LAX, STRICT, NONE}; 
	private String name;
	private String value;
	private String path="";
	private String domain="";
	private Long maxAge;
	private boolean secure=false,httpOnly=false;
	private site sameSite;

	public CustomCookie(String name, String value) {
		this.name=name;
		this.value=value;
	}
	
	public String build() {
		StringBuffer tr = new StringBuffer();
		tr.append(name);
		tr.append('=');
		tr.append(value);
		tr.append(';');
		if(!path.isEmpty()) {
			tr.append("Path=");
			tr.append(path);
			tr.append(';');
		}
		if(!domain.isEmpty()) {
			tr.append("Domain=");
			tr.append(domain);
			tr.append(';');
		}
		if(maxAge!=null) {
			tr.append("Expires=");
			tr.append(toUTCString(new Date(new Date().getTime()+(maxAge*1000))));
			tr.append(';');
		}
		if (secure) {tr.append("Secure;");}
		if (httpOnly) {tr.append("HttpOnly;");}
		switch(sameSite) {
			case LAX:
				tr.append("SameSite=Lax");
				break;
			case STRICT:
				tr.append("SameSite=Strict");
				break;
			case NONE:
				tr.append("SameSite=None");
				break;
			default:
				tr.append("SameSite=Lax");
		}
		return tr.toString();
	}
	
	public String toUTCString(Date date) {
        SimpleDateFormat sd = new SimpleDateFormat("EEE, yyyy-MMM-dd HH:mm:ss z");
        sd.setTimeZone(TimeZone.getTimeZone("GMT"));
        return sd.format(date);
    }

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getDomain() {
		return domain;
	}

	public void setDomain(String domain) {
		this.domain = domain;
	}

	public Long getMaxAge() {
		return maxAge;
	}

	public void setMaxAge(Long maxAge) {
		this.maxAge = maxAge;
	}

	public boolean isSecure() {
		return secure;
	}

	public void setSecure(boolean secure) {
		this.secure = secure;
	}

	public boolean isHttpOnly() {
		return httpOnly;
	}

	public void setHttpOnly(boolean httpOnly) {
		this.httpOnly = httpOnly;
	}

	public site getSameSite() {
		return sameSite;
	}

	public void setSameSite(site sameSite) {
		this.sameSite = sameSite;
	}
}

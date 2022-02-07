package com.amrTm.backLMS.configuration;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

public class CustomCookie{
	public enum sameSite{ 
		LAX, STRICT, NONE}; 
	private String name;
	private String value;
	private String path="";
	private String domain="";
	private Long maxAge;
	private boolean secure=false,httpOnly=false;
	private sameSite ss;

	public CustomCookie(String name, String value) {
		this.name=name;
		this.value=value;
	}
	
	public String build() {
		StringBuffer sb = new StringBuffer();
		sb.append(name);
		sb.append('=');
		sb.append(value);
		sb.append(';');
		if(!path.isEmpty()) {
			sb.append("Path=");
			sb.append(path);
			sb.append(';');
		}
		if(!domain.isEmpty()) {
			sb.append("Domain=");
			sb.append(domain);
			sb.append(';');
		}
		if(maxAge!=null) {
			sb.append("Expires=");
			sb.append(toUTCString(new Date(new Date().getTime()+(maxAge*1000))));
			sb.append(';');
		}
		if (secure) {sb.append("Secure;");}
		if (httpOnly) {sb.append("HttpOnly;");}
		switch(ss) {
			case LAX:
				sb.append("SameSite=Lax");
				break;
			case STRICT:
				sb.append("SameSite=Strict");
				break;
			case NONE:
				sb.append("SameSite=None");
				break;
			default:
				sb.append("SameSite=Lax");
		}
		return sb.toString();
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path=path;
	}

	public String getDomain() {
		return domain;
	}

	public void setDomain(String domain) {
		this.domain=domain;
	}

	public long getMaxAge() {
		return maxAge;
	}

	public void setMaxAge(int maxAge) {
		this.maxAge = (long) maxAge;
	}
	
	public String toUTCString(Date date) {
        SimpleDateFormat sdf = new SimpleDateFormat("EEE, yyyy-MMM-dd HH:mm:ss z");
        sdf.setTimeZone(TimeZone.getTimeZone("GMT"));
        return sdf.format(date);
    }

	public boolean isSecure() {
		return secure;
	}

	public void setSecure(boolean secure) {
		this.secure=secure;
	}

	public boolean isHttpOnly() {
		return httpOnly;
	}

	public void setHttpOnly(boolean httpOnly) {
		this.httpOnly = httpOnly;
	}

	public sameSite getSameSite() {
		return ss;
	}

	public void setSameSite(sameSite sameSite) {
		this.ss = sameSite;
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
}

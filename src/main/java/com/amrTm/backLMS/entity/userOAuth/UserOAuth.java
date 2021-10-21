package com.amrTm.backLMS.entity.userOAuth;

import java.util.Map;

public abstract class UserOAuth {
	protected Map<String,Object> attr;
	
	public UserOAuth(Map<String,Object> attr) {
		this.attr = attr;
	}

	public Map<String, Object> getAttr() {
		return attr;
	}
	
	public abstract String getId();
	public abstract String getName();
	public abstract String getEmail();
	public abstract String getImageUrl();
}

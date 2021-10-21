package com.amrTm.backLMS.entity.userOAuth;

import java.util.Map;

public class FacebookUser extends UserOAuth{

	public FacebookUser(Map<String, Object> attr) {
		super(attr);
	}

	@Override
	public String getId() {
		return (String)attr.get("id");
	}

	@Override
	public String getName() {
		return (String)attr.get("name");
	}

	@Override
	public String getEmail() {
		return (String)attr.get("email");
	}

	@Override
	public String getImageUrl() {
		if(attr.containsKey("picture")) {
			Map<String,Object> picture = (Map<String,Object>) attr.get("picture");
			if(picture.containsKey("data")) {
				Map<String,Object> data = (Map<String,Object>) picture.get("data");
				if(data.containsKey("url")) {
					return (String) data.get("url");
				}
			}
		}
		return null;
	}
}

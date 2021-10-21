package com.amrTm.backLMS.entity.userOAuth;

import java.util.Map;

public class GoogleUser extends UserOAuth {

	public GoogleUser(Map<String, Object> attr) {
		super(attr);
	}

	@Override
	public String getId() {
		return (String) attr.get("sub");
	}

	@Override
	public String getName() {
		return (String) attr.get("name");
	}

	@Override
	public String getEmail() {
		return (String) attr.get("email");
	}

	@Override
	public String getImageUrl() {
		return (String) attr.get("picture");
	}
}

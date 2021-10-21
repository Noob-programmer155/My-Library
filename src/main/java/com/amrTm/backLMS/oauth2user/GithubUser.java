package com.amrTm.backLMS.oauth2user;

import java.util.Map;

public class GithubUser extends UserOAuth{

	public GithubUser(Map<String, Object> attr) {
		super(attr);
	}

	@Override
	public String getId() {
		return ((Integer) attr.get("id")).toString();
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
		return (String) attr.get("avatar_url");
	}
}

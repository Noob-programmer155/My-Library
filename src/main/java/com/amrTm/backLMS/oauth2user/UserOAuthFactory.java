package com.amrTm.backLMS.oauth2user;

import java.util.Map;

import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;

import com.amrTm.backLMS.entity.Provider;

public class UserOAuthFactory {
	public static UserOAuth getUserOAuth(String registration, Map<String,Object> attr) {
		if(registration.equalsIgnoreCase(Provider.google.toString())) {
			return new GoogleUser(attr);
		}
		else if(registration.equalsIgnoreCase(Provider.github.toString())) {
			return new GithubUser(attr);
		}
		else if(registration.equalsIgnoreCase(Provider.facebook.toString())) {
			return new FacebookUser(attr);
		}
		else {
			throw new OAuth2AuthenticationException(new OAuth2Error("405"), "Sorry! Login with " + registration + " is not supported yet.");
		}
	}
}

package com.amrTm.backLMS.service;

import java.util.Collections;
import java.util.Optional;

import javax.naming.AuthenticationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.amrTm.backLMS.configuration.UserOAuthFactory;
import com.amrTm.backLMS.entity.Role;
import com.amrTm.backLMS.entity.User;
import com.amrTm.backLMS.entity.userOAuth.Provider;
import com.amrTm.backLMS.entity.userOAuth.UserOAuth;
import com.amrTm.backLMS.repository.UserRepo;
import com.amrTm.backLMS.security.UserDetail;

@Service
public class UserOAuth2Service extends DefaultOAuth2UserService{

	@Autowired
	private UserRepo userRepo;
	
	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
		OAuth2User user = super.loadUser(userRequest);
		try {
			return procedUserOAuth(userRequest, user);
		} catch (AuthenticationException e) {
			// TODO Auto-generated catch block
			return null;
		}
	}
	
	private OAuth2User procedUserOAuth(OAuth2UserRequest userRequest, OAuth2User oAuth2User) throws AuthenticationException {
		UserOAuth userObject = UserOAuthFactory.getUserOAuth(userRequest.getClientRegistration().getRegistrationId(), oAuth2User.getAttributes());
		
		Optional<User> user = userRepo.findByEmail(userObject.getEmail());
		User userOAuth;
		if(user.isPresent()) {
			if(user.get().getProvider() != null) {
				if(user.get().getProvider().equals(Provider.valueOf(userRequest.getClientRegistration().getRegistrationId()))) {
					userOAuth = updateUser(user.get(), userObject);
				}
				else {
					return UserDetail.create(user.get().getEmail(), "", Collections.singletonList(user.get().getRole()), userObject.getAttr());
				}
			}
			else {
				return UserDetail.create(user.get().getEmail(), "", Collections.singletonList(user.get().getRole()), userObject.getAttr());
			}
		}
		else {
			userOAuth = createUser(userObject, userRequest.getClientRegistration().getRegistrationId());
		}
		return UserDetail.create(userOAuth.getEmail(), userOAuth.getPassword(), Collections.singletonList(userOAuth.getRole()), userObject.getAttr());
	}
	
	private User updateUser(User user, UserOAuth updateUser) {
		user.setName(updateUser.getName());
		user.setClientId(updateUser.getId());
		user.setEmail(updateUser.getEmail());
		user.setImage_url(updateUser.getImageUrl());
		return userRepo.save(user);
	}
	
	private User createUser(UserOAuth updateUser, String regId) {
		User user = new User();
		user.setClientId(updateUser.getId());
		user.setEmail(updateUser.getEmail());
		user.setImage_url(updateUser.getImageUrl());
		user.setName(updateUser.getName());
		user.setPassword(null);
		user.setProvider(Provider.valueOf(regId));
		user.setRole(Role.USER);
		return userRepo.save(user);
	}
}

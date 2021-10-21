package com.amrTm.backLMS.security;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import com.amrTm.backLMS.entity.Role;

public class UserDetail implements UserDetails, OAuth2User{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private Map<String, Object> attribute;
	private Collection<? extends GrantedAuthority> auth;
	private String password;
	private String username;

	public UserDetail(String username, String password , Collection<? extends GrantedAuthority> auth, Map<String, Object> attribute) {
		this.auth = auth;
		this.password = password;
		this.username = username;
		this.attribute = attribute;
	}
	
	public static UserDetail create(String username, String password, List<Role> role, Map<String, Object> attribute) {
		return new UserDetail(username,password, role, attribute);
	}
	
	@Override
	public Map<String, Object> getAttributes() {
		// TODO Auto-generated method stub
		return attribute;
	}

	@Override
	public String getName() {
		// TODO Auto-generated method stub
		return username;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		// TODO Auto-generated method stub
		return auth;
	}

	@Override
	public String getPassword() {
		// TODO Auto-generated method stub
		return password;
	}

	@Override
	public String getUsername() {
		// TODO Auto-generated method stub
		return username;
	}

	@Override
	public boolean isAccountNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isEnabled() {
		// TODO Auto-generated method stub
		return true;
	}
}

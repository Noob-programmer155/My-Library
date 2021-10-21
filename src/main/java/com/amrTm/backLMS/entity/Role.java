package com.amrTm.backLMS.entity;

import org.springframework.security.core.GrantedAuthority;

public enum Role implements GrantedAuthority{
	ANON,
	USER,
	SELLER,
	ADMINISTRATIF,
	MANAGER;

	@Override
	public String getAuthority() {
		return toString();
	}
	
}

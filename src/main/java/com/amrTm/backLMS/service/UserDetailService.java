package com.amrTm.backLMS.service;

import java.util.Collections;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.amrTm.backLMS.entity.Role;
import com.amrTm.backLMS.entity.User;
import com.amrTm.backLMS.repository.UserRepo;
import com.amrTm.backLMS.security.UserDetail;

@Service
public class UserDetailService implements UserDetailsService{
	
	@Autowired
	private UserRepo userRepo;
	
	@PostConstruct
	private void createManager() {
		if (userRepo.findByEmail("rijal.amar29@gmail.com").isEmpty()) {
			User user = new User();
			user.setClientId(null);
			user.setEmail("rijal.amar29@gmail.com");
			user.setImage_url(null);
			user.setName("Amar");
			user.setPassword(new BCryptPasswordEncoder().encode("Amar1234#"));
			user.setProvider(null);
			user.setRole(Role.MANAGER);
			
			userRepo.save(user);
		}
	}
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepo.findByEmail(username).get();
		return UserDetail.create(user.getEmail(), user.getPassword(), Collections.singletonList(user.getRole()), null);
	}
}

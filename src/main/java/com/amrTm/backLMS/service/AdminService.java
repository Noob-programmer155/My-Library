package com.amrTm.backLMS.service;

import java.io.IOException;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.amrTm.backLMS.DTO.UserDTO;
import com.amrTm.backLMS.DTO.UserInfoDTO;
import com.amrTm.backLMS.entity.Role;
import com.amrTm.backLMS.entity.User;
import com.amrTm.backLMS.mailservice.MailService;
import com.amrTm.backLMS.repository.UserRepo;
import com.amrTm.backLMS.token_service.TokenTools;

@Service
public class AdminService {
	@Autowired
	private UserRepo userRepo;
	
	@Autowired
	private TokenTools tokenTools;
	
	@Autowired
	private MailService mailService;
	
	@Autowired
	private AuthenticationManager authenticationManager;
	
	@PreAuthorize("hasAnyAuthority('ADMINISTRATIF','MANAGER','USER','SELLER')")
	public UserInfoDTO getInfoAdmin() {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		return userRepo.findByEmail(email).map(a -> {
			UserInfoDTO bg = new UserInfoDTO();
			bg.setId(a.getId());
			bg.setImage(a.getImage());
			bg.setImage_url(a.getImage_url());
			bg.setName(a.getName());
			bg.setEmail(a.getEmail());
			bg.setRole(a.getRole().toString());
			return bg;
		}).get();
	}
	
	public UserInfoDTO standardLogin(String username, String password, HttpServletResponse res) throws IOException {
		Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username,password));
		User user = userRepo.findByEmail(auth.getName()).get();
		if (tokenTools.createToken(user.getName(), user.getEmail(), user.getRole(), res)) {
			UserInfoDTO bg = new UserInfoDTO();
			bg.setId(user.getId());
			bg.setImage(user.getImage());
			bg.setImage_url(user.getImage_url());
			bg.setName(user.getName());
			bg.setEmail(user.getEmail());
			bg.setRole(user.getRole().toString());
			return bg;
		}
		res.sendError(401);
		return null;
	}
	
	public UserInfoDTO standardSignup(UserDTO user, HttpServletResponse res) throws IOException, MessagingException {
		User yu = new User();
		yu.setClientId(null);
		yu.setEmail(user.getEmail());
		if(!user.getImage().isEmpty()) {
			yu.setImage(user.getImage());
		}
		yu.setImage_url(null);
		yu.setName(user.getName());
		yu.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
		yu.setProvider(null);
		yu.setRole(Role.ANON);
		
		User hg = userRepo.save(yu);
		
		if (mailService.sendEmailValidation(user.getName(), user.getEmail())) {
			UserInfoDTO bg = new UserInfoDTO();
			bg.setId(hg.getId());
			bg.setImage(hg.getImage());
			bg.setImage_url(hg.getImage_url());
			bg.setName(hg.getName());
			bg.setEmail(hg.getEmail());
			bg.setRole(hg.getRole().toString());
			return bg;
		};
		res.sendError(500);
		return null;
	}
	
	public UserInfoDTO validateUserOAuth(String name, String email, int id, HttpServletResponse res) throws IOException {
		User user = userRepo.findById((long) id).get();
		if(user.getName().equals(name) && user.getEmail().equals(email)) {
			if(tokenTools.createToken(user.getName(), user.getEmail(), user.getRole(), res)) {
				UserInfoDTO bg = new UserInfoDTO();
				bg.setId(user.getId());
				bg.setImage(user.getImage());
				bg.setImage_url(user.getImage_url());
				bg.setName(user.getName());
				bg.setEmail(user.getEmail());
				bg.setRole(user.getRole().toString());
				return bg;
			}
		}
		res.sendError(403, "User not permitted !!!"); 
		return null;
	}
	
	public UserInfoDTO validateUser(String token, HttpServletResponse res) throws IOException {
		return mailService.emailValidation(token, res);
	}
	
	@PreAuthorize("hasAnyAuthority('ADMINISTRATIF','MANAGER','USER','SELLER')")
	public boolean validatePassword(String email, String password) {
		User user = userRepo.findByEmail(email).get();
		return new BCryptPasswordEncoder().matches(password, user.getPassword());
	}
	
	@PreAuthorize("hasAuthority('USER')")
	public boolean modifyUser(String email, String nama) throws IOException {
		User hg = userRepo.getByNameAndEmail(nama, email);
		hg.setRole(Role.SELLER);
		
		userRepo.save(hg);
		return true;
	}
	
	@PreAuthorize("hasAuthority('MANAGER')")
	public boolean modifyUserAdmin(String email, String nama) throws IOException {
		User hg = userRepo.getByNameAndEmail(nama, email);
		hg.setRole(Role.ADMINISTRATIF);
		
		userRepo.save(hg);
		return true;
	}

//	public void deleteAdmin(String name, String email) {
//		User user = userRepo.getByNameAndEmail(name, email);
//		for (Book book : user.getBook()) {
//			book.removeUser(user);
//		}
//		userRepo.delete(user);
//	}
}

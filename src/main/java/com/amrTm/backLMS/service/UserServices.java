package com.amrTm.backLMS.service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.amrTm.backLMS.DTO.UserDTO;
import com.amrTm.backLMS.DTO.UserInfoDTO;
import com.amrTm.backLMS.entity.Book;
import com.amrTm.backLMS.entity.Role;
import com.amrTm.backLMS.entity.User;
import com.amrTm.backLMS.repository.UserRepo;

@Service
public class UserServices {
	@Autowired
	private UserRepo userRepo;
	
	@PreAuthorize("hasAnyAuthority('USER','SELLER','ADMINISTRATIF','MANAGER')")
	public String getUser() {
		return "validate";
	}
	
	@PreAuthorize("hasAnyAuthority('ADMINISTRATIF','MANAGER')")
	public List<UserInfoDTO> getAllUser(){
		return userRepo.findAll().stream().map(a -> {
			UserInfoDTO user = new UserInfoDTO();
			user.setId(a.getId());
			user.setName(a.getName());
			user.setEmail(a.getEmail());
			user.setRole(a.getRole().toString());
			user.setImage(a.getImage());
			user.setImage_url(a.getImage_url());
			return user;
		}).collect(Collectors.toList());
	}
	
	@PreAuthorize("hasAnyAuthority('USER','SELLER','ADMINISTRATIF','MANAGER')")
	public void modifyUser(String name, String email, UserDTO userModel) throws IOException {
		User user = userRepo.getByNameAndEmail(name, email);
		user.setName(userModel.getName());
		user.setEmail(userModel.getEmail());
		if(!userModel.getImage().isEmpty()) user.setImage(userModel.getImage());
		user.setPassword(new BCryptPasswordEncoder().encode(userModel.getPassword()));
		
		userRepo.save(user);
	}
	
	@PreAuthorize("hasAnyAuthority('USER','SELLER','ADMINISTRATIF')")
	public void deleteUser(String name, String email) {
		User user = userRepo.getByNameAndEmail(name, email);
		if(user.getRole().equals(Role.SELLER) || user.getRole().equals(Role.USER)) {
			for (Book book : user.getMyBook()) {
				book.setBookuser(null);
			}
			for (Book book : user.getFavorite()) {
				book.removeFavorite(user);
			}
			userRepo.delete(user);
		}
	}
	
	@PreAuthorize("hasAuthority('MANAGER')")
	public void deleteAdmin(String name, String email) {
		User user = userRepo.getByNameAndEmail(name, email);
		if(user.getRole().equals(Role.ADMINISTRATIF)) {
			for (Book book : user.getMyBook()) {
				book.setBookuser(null);
			}
			for (Book book : user.getFavorite()) {
				book.removeFavorite(user);
			}
			userRepo.delete(user);
		}
	}
}

package com.amrTm.backLMS.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.amrTm.backLMS.DTO.UserDTO;
import com.amrTm.backLMS.DTO.UserInfoDTO;
import com.amrTm.backLMS.configuration.FileConfig;
import com.amrTm.backLMS.entity.Book;
import com.amrTm.backLMS.entity.Role;
import com.amrTm.backLMS.entity.User;
import com.amrTm.backLMS.repository.UserRepo;

@Service
public class UserServices {
	@Autowired
	private UserRepo userRepo;
	
	private List<Long> userOnline = new ArrayList<>();
	
	@PreAuthorize("hasAnyAuthority('USER','SELLER','ADMINISTRATIF','MANAGER')")
	public String getUser() {
		return "validate";
	}
	
	@PreAuthorize("hasAnyAuthority('USER','SELLER','ADMINISTRATIF','MANAGER')")
	public byte[] getImageUser(String path) throws IOException {
		ClassPathResource resource = new ClassPathResource("image/user/"+path);
		return resource.getInputStream().readAllBytes();
	}
	
	@PreAuthorize("hasAnyAuthority('ADMINISTRATIF','MANAGER')")
	public List<UserInfoDTO> getAllUser(){
		return userRepo.findAllByRoleIn(Arrays.asList(Role.ANON,Role.SELLER,Role.USER)).stream().map(a -> {
			UserInfoDTO user = new UserInfoDTO();
			user.setId(a.getId());
			user.setName(a.getName());
			user.setEmail(a.getEmail());
			user.setRole(a.getRole().toString());
			user.setImage_url(a.getImage_url());
			return user;
		}).collect(Collectors.toList());
	}
	
	@PreAuthorize("hasAuthority('MANAGER')")
	public List<UserInfoDTO> getAllAdmin(){
		return userRepo.findAllByRoleIn(Arrays.asList(Role.ADMINISTRATIF)).stream().map(a -> {
			UserInfoDTO user = new UserInfoDTO();
			user.setId(a.getId());
			user.setName(a.getName());
			user.setEmail(a.getEmail());
			user.setRole(a.getRole().toString());
			user.setImage_url(a.getImage_url());
			return user;
		}).collect(Collectors.toList());
	}
	
	@PreAuthorize("hasAnyAuthority('USER','SELLER','ADMINISTRATIF','MANAGER')")
	public void modifyUser(String name, String email, UserDTO userModel) throws IOException {
		User user = userRepo.getByNameAndEmail(name, email);
		user.setName(userModel.getName());
		user.setEmail(userModel.getEmail());
		if(!userModel.getImage().isEmpty()) 
			user.setImage_url(FileConfig.saveImageUser(Base64.getDecoder().decode(userModel.getImage()), user.getImage_url()));
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
	public List<Long> getUserOnline(){
		return userOnline;
	}
	public void deleteUserOnline(Long id) {
		userOnline.remove(id);
	}
	public void addUserOnline(Long id) {
		userOnline.add(id);
	}
}

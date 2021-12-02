package com.amrTm.backLMS.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amrTm.backLMS.DTO.UserDTO;
import com.amrTm.backLMS.DTO.UserInfoDTO;
import com.amrTm.backLMS.configuration.FileConfig;
import com.amrTm.backLMS.entity.Book;
import com.amrTm.backLMS.entity.Role;
import com.amrTm.backLMS.entity.User;
import com.amrTm.backLMS.repository.BookRepo;
import com.amrTm.backLMS.repository.UserRepo;

@Service
public class UserServices {
	@Autowired
	private UserRepo userRepo;
	@Autowired
	private BookRepo bookRepo;
	
	private List<Long> userOnline = new ArrayList<>();
	
	@PreAuthorize("hasAnyAuthority('ANON','USER','SELLER','ADMINISTRATIF','MANAGER')")
	public byte[] getImageUser(String path) throws IOException {
		ClassPathResource resource = new ClassPathResource("static/image/user/"+path);
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
	
	@PreAuthorize("hasAnyAuthority('ANON','USER','SELLER','ADMINISTRATIF','MANAGER')")
	public UserInfoDTO modifyUser(String name, String email, UserDTO userModel, MultipartFile image) throws IOException {
		User user = userRepo.getByNameAndEmail(name, email);
		user.setName(userModel.getName());
		user.setEmail(userModel.getEmail().toLowerCase());
		if(image != null) {
			user.setImage_url(FileConfig.modifyImageUser(image,user.getImage_url()));
		}
		User us = userRepo.save(user);
		UserInfoDTO user1 = new UserInfoDTO();
		user1.setId(us.getId());
		user1.setName(us.getName());
		user1.setEmail(us.getEmail());
		user1.setRole(us.getRole().toString());
		user1.setImage_url(us.getImage_url());
		return user1;
	}
	
	@PreAuthorize("hasAuthority('ADMINISTRATIF')")
	public void deleteUser(String name, String email) {
		User user = userRepo.getByNameAndEmail(name, email);
		if(user.getRole().equals(Role.SELLER) || user.getRole().equals(Role.USER) || user.getRole().equals(Role.ANON)) {
			if(user.getRole().equals(Role.SELLER)) {
				for (Book book : user.getMyBook()) {
					FileConfig.deleteBooksFile(book.getFile());
					FileConfig.deleteBooksImage(book.getImage());
					bookRepo.delete(book);
				}
			}
			FileConfig.deleteUserImage(user.getImage_url());
			userRepo.delete(user);
		}
	}
	
	@PreAuthorize("hasAuthority('MANAGER')")
	public void deleteAdmin(String name, String email) {
		User user = userRepo.getByNameAndEmail(name, email);
		if(user.getRole().equals(Role.ADMINISTRATIF)) {
			FileConfig.deleteUserImage(user.getImage_url());
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

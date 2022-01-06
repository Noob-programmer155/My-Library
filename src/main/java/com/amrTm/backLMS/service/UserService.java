package com.amrTm.backLMS.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amrTm.backLMS.DTO.UserDTO;
import com.amrTm.backLMS.DTO.UserInfoDTO;
import com.amrTm.backLMS.DTO.UserResponse;
import com.amrTm.backLMS.configuration.FileConfig;
import com.amrTm.backLMS.entity.Book;
import com.amrTm.backLMS.entity.Role;
import com.amrTm.backLMS.entity.StatusReport;
import com.amrTm.backLMS.entity.User;
import com.amrTm.backLMS.entity.UserReport;
import com.amrTm.backLMS.repository.BookRepo;
import com.amrTm.backLMS.repository.UserRepo;
import com.amrTm.backLMS.repository.UserReportRepo;

@Service
public class UserService {
	@Autowired
	private UserRepo userRepo;
	@Autowired
	private BookRepo bookRepo;
	@Autowired
	private UserReportRepo userReportRepo;
	
	private List<Long> userOnline = new ArrayList<>();
	
	@PreAuthorize("hasAnyAuthority('ANON','USER','SELLER','ADMINISTRATIF','MANAGER')")
	public byte[] getImageUser(String path, HttpServletResponse res) throws IOException {
		ClassPathResource resource = new ClassPathResource("static/image/user/"+path);
		byte[] data = null;
		try {
			data = resource.getInputStream().readAllBytes();
		} catch (IOException e) {
			res.sendError(500, "there`s some error when fetching data");
		}
		return data;
	}
	
	@PreAuthorize("hasAnyAuthority('ADMINISTRATIF','MANAGER')")
	public UserResponse getAllUser(int page, int size, HttpServletResponse res) throws IOException{
		try {
			Pageable data = PageRequest.of(page, size);
			Page<User> dataUsers = userRepo.findAllByRoleIn(Arrays.asList(Role.ANON,Role.SELLER,Role.USER), data);
			List<UserInfoDTO> userInfo = dataUsers.getContent().stream().map(a -> {
				UserInfoDTO user = new UserInfoDTO();
				user.setId(a.getId());
				user.setName(a.getName());
				user.setEmail(a.getEmail());
				user.setRole(a.getRole().toString());
				user.setImage_url(a.getImage_url());
				user.setStatus(userOnline.contains(a.getId()));
				return user;
			}).collect(Collectors.toList());
			UserResponse dataRespon = new UserResponse();
			dataRespon.setSizeAllData((int)dataUsers.getTotalElements());
			dataRespon.setData(userInfo);
			return dataRespon;
		}catch(Exception e) {
			res.sendError(500, "there`s some error when fetching data");
			return null;
		}
	}
	
	@PreAuthorize("hasAuthority('MANAGER')")
	public UserResponse getAllAdmin(int page, int size, HttpServletResponse res) throws IOException{
		try {
			Pageable data = PageRequest.of(page, size);
			Page<User> dataUsers = userRepo.findAllByRoleIn(Arrays.asList(Role.ADMINISTRATIF), data);
			List<UserInfoDTO> userInfo = dataUsers.getContent().stream().map(a -> {
				UserInfoDTO user = new UserInfoDTO();
				user.setId(a.getId());
				user.setName(a.getName());
				user.setEmail(a.getEmail());
				user.setRole(a.getRole().toString());
				user.setImage_url(a.getImage_url());
				user.setStatus(userOnline.contains(a.getId()));
				return user;
			}).collect(Collectors.toList());
			UserResponse dataRespon = new UserResponse();
			dataRespon.setSizeAllData((int)dataUsers.getTotalElements());
			dataRespon.setData(userInfo);
			return dataRespon;
		}catch(Exception e) {
			res.sendError(500, "there`s some error when fetching data");
			return null;
		}
	}
	
	@PreAuthorize("hasAnyAuthority('ADMINISTRATIF','MANAGER')")
	public UserResponse searchUser(int page, int size, String words, HttpServletResponse res) throws IOException {
		try {	
			List<UserInfoDTO> userInfo = null;
			Pageable data = PageRequest.of(page, size);
			Page<User> dataUsers = userRepo.findAllByNameLikeOrEmailLike("%"+words+"%", "%"+words+"%", data);
			userInfo = dataUsers.getContent().stream().map(a -> {
				UserInfoDTO user = new UserInfoDTO();
				user.setId(a.getId());
				user.setName(a.getName());
				user.setEmail(a.getEmail());
				user.setRole(a.getRole().toString());
				user.setImage_url(a.getImage_url());
				user.setStatus(userOnline.contains(a.getId()));
				return user;
			}).collect(Collectors.toList());
			UserResponse dataRespon = new UserResponse();
			dataRespon.setSizeAllData((int)dataUsers.getTotalElements());
			dataRespon.setData(userInfo);
			return dataRespon;
		}catch(Exception e) {
			res.sendError(500, "there`s some error when fetching data");
			return null;
		}
	}
	
	@PreAuthorize("hasAnyAuthority('ANON','USER','SELLER','ADMINISTRATIF','MANAGER')")
	public UserInfoDTO modifyUser(UserDTO userModel, MultipartFile image, HttpServletResponse res) throws IOException {
		UserInfoDTO user1 = null;
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			User user = userRepo.findByEmail(auth.getName()).get();
			user.setName(userModel.getName());
			user.setEmail(userModel.getEmail().toLowerCase());
			if(image != null) {
				user.setImage_url(FileConfig.modifyImageUser(image,user.getImage_url()));
			}
			User us = userRepo.save(user);
			user1 = new UserInfoDTO();
			user1.setId(us.getId());
			user1.setName(us.getName());
			user1.setEmail(us.getEmail());
			user1.setRole(us.getRole().toString());
			user1.setImage_url(us.getImage_url());
			user1.setStatus(true);
			return user1;
		}catch(DataIntegrityViolationException e) {
			res.sendError(400, "We found account with same email, please use another email");
		}
		catch(Exception e) {
			res.sendError(500, "there`s some error when fetching data");
		}
		return user1;
	}
	
	@PreAuthorize("hasAuthority('ADMINISTRATIF')")
	public void deleteUser(String email, HttpServletResponse res) throws IOException {
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if(auth != null) {
				User user = userRepo.findByEmail(email).get();
				long idUser = user.getId();
				if(user.getRole().equals(Role.SELLER) || user.getRole().equals(Role.USER) || user.getRole().equals(Role.ANON)) {
					User userAdmin = userRepo.findByEmail(auth.getName()).get();
					String name = userAdmin.getName();
					if(user.getRole().equals(Role.SELLER)) {
						for (Book book : user.getMyBook()) {
							FileConfig.deleteBooksFile(book.getFile());
							FileConfig.deleteBooksImage(book.getImage());
							bookRepo.delete(book);
						}
					}
					FileConfig.deleteUserImage(user.getImage_url());
					userRepo.delete(user);
					
					UserReport ur = new UserReport();
					ur.setIdUser(idUser);
					ur.setUsername(name);
					ur.setEmail(email);
					ur.setIdAdmin(userAdmin.getId());
					ur.setAdminName(userAdmin.getName());
					ur.setAdminEmail(userAdmin.getEmail());
					ur.setStatusReport(StatusReport.OUT);
					ur.setDateReport(new Date());
					userReportRepo.save(ur);
				}
			}
			else {
				res.sendError(403, "Request credential`s not permitted to access it");
			}
		}catch(Exception e) {
			res.sendError(500, "there`s some error when fetching data");
		}
	}
	
	@PreAuthorize("hasAuthority('MANAGER')")
	public void deleteAdmin(String email, HttpServletResponse res) throws IOException {
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if(auth != null) {
				User user = userRepo.findByEmail(email).get();
				String name = user.getName();
				long idUser = user.getId();
				if(user.getRole().equals(Role.ADMINISTRATIF)) {
					User manager = userRepo.findByEmail(auth.getName()).get();
					FileConfig.deleteUserImage(user.getImage_url());
					userRepo.delete(user);
					
					UserReport ur = new UserReport();
					ur.setIdUser(idUser);
					ur.setUsername(name);
					ur.setEmail(email);
					ur.setIdAdmin(manager.getId());
					ur.setAdminName(manager.getName());
					ur.setAdminEmail(manager.getEmail());
					ur.setStatusReport(StatusReport.OUT);
					ur.setDateReport(new Date());
					userReportRepo.save(ur);
				}
			}else {
				res.sendError(403, "Request credential`s not permitted to access it");
			}
		}catch(Exception e) {
			res.sendError(500, "there`s some error when fetching data");
		}
	}
	
	public void deleteUserOnline(Long id) {
		userOnline.remove(id);
	}
	public void addUserOnline(Long id) {
		userOnline.add(id);
	}
}

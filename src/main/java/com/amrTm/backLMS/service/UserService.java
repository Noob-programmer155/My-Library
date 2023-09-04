package com.amrTm.backLMS.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
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
	@Autowired
	private FileConfig fileConfig;
	@Value("${filestorage}")
	private String storage;
	
	private Set<Long> userOnline = new HashSet<>();
	
	@PreAuthorize("hasAnyAuthority('ANON','USER','SELLER','ADMINISTRATIF','MANAGER')")
	public byte[] getImageUser(String path, HttpServletResponse res) throws IOException {
		FileInputStream resource = new FileInputStream(storage+"/image/user/"+path);
		try {
			return resource.readAllBytes();
		} catch (IOException e) {
			res.sendError(500, "there`s some error when fetching data");
			return new byte[]{};
		}
	}
	
//	@PreAuthorize("hasAnyAuthority('ADMINISTRATIF','MANAGER')")
//	public UserResponse getAllUser(int page, int size, HttpServletResponse res) throws IOException{
//		try {
//			Pageable data = PageRequest.of(page, size, Sort.by("name"));
//			Page<User> dataUsers = userRepo.findAllByRoleIn(Arrays.asList(Role.ANON,Role.SELLER,Role.USER), data);
//			List<UserInfoDTO> userInfo = dataUsers.getContent().stream().map(a -> {
//				UserInfoDTO user = new UserInfoDTO();
//				user.setId(a.getId());
//				user.setName(a.getName());
//				user.setEmail(a.getEmail());
//				user.setRole(a.getRole().toString());
//				user.setImage_url(a.getImage_url());
//				user.setStatus(userOnline.contains(a.getId()));
//				return user;
//			}).collect(Collectors.toList());
//			UserResponse dataRespon = new UserResponse();
//			dataRespon.setSizeAllData((int)dataUsers.getTotalElements());
//			dataRespon.setData(userInfo);
//			return dataRespon;
//		}catch(Exception e) {
//			res.sendError(500, "there`s some error when fetching data");
//			return null;
//		}
//	}
//	
//	@PreAuthorize("hasAuthority('MANAGER')")
//	public UserResponse getAllAdmin(int page, int size, HttpServletResponse res) throws IOException{
//		try {
//			Pageable data = PageRequest.of(page, size, Sort.by("name"));
//			Page<User> dataUsers = userRepo.findAllByRoleIn(Arrays.asList(Role.ADMINISTRATIF), data);
//			List<UserInfoDTO> userInfo = dataUsers.getContent().stream().map(a -> {
//				UserInfoDTO user = new UserInfoDTO();
//				user.setId(a.getId());
//				user.setName(a.getName());
//				user.setEmail(a.getEmail());
//				user.setRole(a.getRole().toString());
//				user.setImage_url(a.getImage_url());
//				user.setStatus(userOnline.contains(a.getId()));
//				return user;
//			}).collect(Collectors.toList());
//			UserResponse dataRespon = new UserResponse();
//			dataRespon.setSizeAllData((int)dataUsers.getTotalElements());
//			dataRespon.setData(userInfo);
//			return dataRespon;
//		}catch(Exception e) {
//			res.sendError(500, "there`s some error when fetching data");
//			return null;
//		}
//	}
	
	@PreAuthorize("hasAnyAuthority('ADMINISTRATIF','MANAGER')")
	public UserResponse searchUser(int page, int size, String words, Collection<Role> role, HttpServletResponse res) throws IOException {
		try {	
			List<UserInfoDTO> userInfo = null;
			Pageable data = PageRequest.of(page, size, Sort.by("name"));
			Page<User> dataUsers = userRepo.findSearchUser("%"+words+"%", "%"+words+"%", role, data);
			userInfo = dataUsers.getContent().stream().map(item -> {
				UserInfoDTO user = new UserInfoDTO();
				user.setId(item.getId());
				user.setName(item.getName());
				user.setEmail(item.getEmail());
				user.setRole(item.getRole().toString());
				user.setImage_url(item.getImage_url());
				user.setStatus(userOnline.contains(item.getId()));
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
	@Transactional(isolation=Isolation.REPEATABLE_READ)
	public UserInfoDTO modifyUser(UserDTO userModel, MultipartFile image, HttpServletResponse res) throws IOException {
		UserInfoDTO resUser = null;
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			User user = userRepo.findByEmail(((User)auth.getPrincipal()).getEmail()).get();
			user.setName(userModel.getName());
			user.setEmail(userModel.getEmail().toLowerCase());
			if(image != null) {
				user.setImage_url(fileConfig.modifyImageUser(image,user.getImage_url()));
			}
			User modUser = userRepo.save(user);
			resUser = new UserInfoDTO();
			resUser.setId(modUser.getId());
			resUser.setName(modUser.getName());
			resUser.setEmail(modUser.getEmail());
			resUser.setRole(modUser.getRole().toString());
			resUser.setImage_url(modUser.getImage_url());
			resUser.setStatus(true);
			return resUser;
		}catch(DataIntegrityViolationException e) {
			res.sendError(400, "We found account with same email, please use another email");
		}
		catch(Exception e) {
			res.sendError(500, "there`s some error when fetching data");
		}
		return resUser;
	}
	
	@PreAuthorize("hasAnyAuthority('ADMINISTRATIF','MANAGER')")
	@Transactional(isolation=Isolation.REPEATABLE_READ)
	public void deleteUser(String email, HttpServletResponse res) throws IOException {
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if(auth != null) {
				User user = userRepo.findByEmail(email).get();
				long idUser = user.getId();
				if(user.getRole().equals(Role.SELLER) || user.getRole().equals(Role.USER) || user.getRole().equals(Role.ANON)) {
					User userAdmin = userRepo.findByEmail(((User)auth.getPrincipal()).getEmail()).get();
					String name = userAdmin.getName();
					if(user.getRole().equals(Role.SELLER)) {
						for (Book book : user.getMyBook()) {
							fileConfig.deleteBooksFile(book.getFile());
							fileConfig.deleteBooksImage(book.getImage());
							book.getTypeBooks().forEach(re -> {
								re.removeBook(book);
							});
							bookRepo.delete(book);
						}
					}
					fileConfig.deleteUserImage(user.getImage_url());
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
					User manager = userRepo.findByEmail(((User)auth.getPrincipal()).getEmail()).get();
					fileConfig.deleteUserImage(user.getImage_url());
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

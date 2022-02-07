package com.amrTm.backLMS.service;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Calendar;
import java.util.Date;

import javax.mail.MessagingException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.amrTm.backLMS.DTO.UserDTO;
import com.amrTm.backLMS.DTO.UserInfoDTO;
import com.amrTm.backLMS.configuration.CookieConfig;
import com.amrTm.backLMS.configuration.CustomCookie;
import com.amrTm.backLMS.configuration.CustomCookie.sameSite;
import com.amrTm.backLMS.configuration.FileConfig;
import com.amrTm.backLMS.entity.Role;
import com.amrTm.backLMS.entity.StatusReport;
import com.amrTm.backLMS.entity.User;
import com.amrTm.backLMS.entity.UserReport;
import com.amrTm.backLMS.repository.BookReportRepo;
import com.amrTm.backLMS.repository.UserRepo;
import com.amrTm.backLMS.repository.UserReportRepo;
import com.amrTm.backLMS.service.token.TokenTools;

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
	
	@Autowired
	private UserReportRepo userReportRepo;
	
	@Autowired
	private BookReportRepo bookReportRepo;
	
	public UserInfoDTO getInfoAdmin(HttpServletResponse res) throws IOException {
		try {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if(auth != null) {
			String email = auth.getName();
			return userRepo.findByEmail(email).map(user -> {
				UserInfoDTO uid = new UserInfoDTO();
				uid.setId(user.getId());
				uid.setImage_url(user.getImage_url());
				uid.setName(user.getName());
				uid.setEmail(user.getEmail());
				uid.setRole(user.getRole().toString());
				return uid;
			}).get();
		}
		else {
			res.sendError(403, "need`s authentication to view this page");
			return null;
		}}catch(Exception e) {
			res.sendError(500, "There`s some error when connect to the server, try to connect again");
			return null;
		}
	}
	
	public UserInfoDTO standardLogin(String username, String password, HttpServletResponse res) throws IOException {
		try {
			Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username,password));
			User user = userRepo.findByEmail(auth.getName()).get();
			if (tokenTools.createToken(user.getName(), user.getEmail().toLowerCase(), user.getRole(), res)) {
				UserInfoDTO uid = new UserInfoDTO();
				uid.setId(user.getId());
				uid.setImage_url(user.getImage_url());
				uid.setName(user.getName());
				uid.setEmail(user.getEmail());
				uid.setRole(user.getRole().toString());
				return uid;
			}
			res.sendError(500, "There`s some error when fetching data");
			return null;
		}catch(AuthenticationException e ) {
			res.sendError(401, "Invalid credential`s, please check your credential");
			return null;
		}
		catch(Exception e) {
			res.sendError(500, "There`s some error when connect to the server, try to connect again");
			return null;
		}
	}
	
	@Transactional(isolation=Isolation.REPEATABLE_READ)
	public void standardSignup(UserDTO userModel, HttpServletResponse res, MultipartFile image) throws IOException, MessagingException {
		try {
			User user = new User();
			user.setClientId(null);
			user.setEmail(userModel.getEmail().toLowerCase());
			if(image != null) {
				user.setImage_url(FileConfig.saveImageUser(image, new SimpleDateFormat("ddMMyyyyhhmmssSSS").format(new Date())));
			}
			user.setName(userModel.getName());
			user.setPassword(new BCryptPasswordEncoder().encode(userModel.getPassword()));
			user.setProvider(null);
			user.setRole(Role.ANON);
			User userResp = userRepo.save(user);
			if (mailService.sendEmailValidation(userResp.getName(), userResp.getEmail())) {
				UserInfoDTO uid = new UserInfoDTO();
				uid.setId(userResp.getId());
				uid.setImage_url(userResp.getImage_url());
				uid.setName(userResp.getName());
				uid.setEmail(userResp.getEmail());
				uid.setRole(userResp.getRole().toString());
				
				UserReport ur = new UserReport();
				ur.setIdUser(userResp.getId());
				ur.setUsername(userResp.getName());
				ur.setEmail(userResp.getEmail());
				ur.setIdAdmin(null);
				ur.setAdminName(null);
				ur.setAdminEmail(null);
				ur.setStatusReport(StatusReport.IN_STANDARD);
				ur.setDateReport(new Date());
				userReportRepo.save(ur);
			};
			res.setStatus(204);
		}catch(Exception e) {
			res.sendError(500, "There`s some error when fetching data");
		}
	}
	
	@PreAuthorize("hasAnyAuthority('ANON','ADMINISTRATIF','MANAGER','USER','SELLER')")
	public void Logout(HttpServletRequest req, HttpServletResponse res) throws ServletException, ParseException, IOException {
		try {
			CustomCookie cookie = CookieConfig.getCustomCookie(req, "JLMS_TOKEN");
			cookie.setMaxAge(0);
			cookie.setValue(null);
			cookie.setDomain("localhost");
			cookie.setPath("/");
			cookie.setHttpOnly(true);
			cookie.setSecure(true);
			cookie.setSameSite(sameSite.NONE);
			CookieConfig.buildCookie(res, cookie);
//			CustomCookie cookie1 = CookieConfig.getCustomCookie(req, "JSESSIONID");
//			cookie1.setMaxAge(0);
//			cookie1.setValue(null);
//			cookie1.setDomain("localhost");
//			cookie1.setPath("/");
//			cookie1.setHttpOnly(true);
//			CookieConfig.buildCookie(res, cookie1);
			req.logout();
		}catch(Exception e) {
			res.sendError(500, "There`s some error when fetching data");
		}
	}
	
	public UserInfoDTO validateUserOAuth(String name, String email, int id, HttpServletResponse res) throws IOException {
		try {
			User user = userRepo.findById((long) id).get();
			if(user.getName().equals(new String(Base64.getDecoder().decode(name))) && user.getEmail().equals(new String(Base64.getDecoder().decode(email)))) {
				if(tokenTools.createToken(user.getName(), user.getEmail(), user.getRole(), res)) {
					UserInfoDTO userResp = new UserInfoDTO();
					userResp.setId(user.getId());
					userResp.setImage_url(user.getImage_url());
					userResp.setName(user.getName());
					userResp.setEmail(user.getEmail());
					userResp.setRole(user.getRole().toString());
					
					UserReport ur = new UserReport();
					ur.setIdUser(user.getId());
					ur.setUsername(user.getName());
					ur.setEmail(user.getEmail());
					ur.setIdAdmin(null);
					ur.setAdminName(null);
					ur.setAdminEmail(null);
					ur.setStatusReport(StatusReport.IN_OAUTH);
					ur.setDateReport(new Date());
					userReportRepo.save(ur);
					return userResp;
				}
			}
			res.sendError(403, "Wrong Token, Credential invalid!!!"); 
			return null;
		}catch(Exception e) {
			res.sendError(500, "There`s some error when fetching data");
			return null;
		}
	}
	
	public void validateUser(String token, HttpServletResponse res) throws IOException {
		UserInfoDTO userResp = mailService.emailValidation(token, res);
		if(userResp != null) {
			UserReport ur = new UserReport();
			ur.setIdUser(userResp.getId());
			ur.setUsername(userResp.getName());
			ur.setEmail(userResp.getEmail());
			ur.setIdAdmin(null);
			ur.setAdminName(null);
			ur.setAdminEmail(null);
			ur.setStatusReport(StatusReport.VALIDATED);
			ur.setDateReport(new Date());
			userReportRepo.save(ur);
		}
	}
	
	@PreAuthorize("hasAnyAuthority('ADMINISTRATIF','MANAGER','USER','SELLER')")
	public boolean validatePassword(String password, HttpServletResponse res) throws IOException {
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			User user = userRepo.findByEmail(auth.getName()).get();
			return new BCryptPasswordEncoder().matches(password, user.getPassword());
		}catch(Exception e) {
			res.sendError(500, "There`s some error when fetching data");
			return false;
		}
	}
	
	@PreAuthorize("hasAnyAuthority('USER','SELLER','ADMINISTRATIF','MANAGER')")
	@Transactional(isolation=Isolation.REPEATABLE_READ)
	public boolean modifyUserPassword(String oldPass, String newPass, HttpServletResponse res) throws IOException {
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			User user = userRepo.findByEmail(auth.getName()).get();
			if(new BCryptPasswordEncoder().matches(oldPass, user.getPassword())) {
				user.setPassword(new BCryptPasswordEncoder().encode(newPass));
				userRepo.save(user);
				return true;
			}
			res.sendError(400, "Your password doesn`t match");
			return false;
		}catch(Exception e) {
			res.sendError(500, "There`s some error when fetching data");
			return false;
		}
	}
	
	@PreAuthorize("hasAuthority('USER')")
	@Transactional(isolation=Isolation.REPEATABLE_READ)
	public boolean promotingUser(HttpServletResponse res) throws IOException {
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			User user = userRepo.findByEmail(auth.getName()).get();
			user.setRole(Role.SELLER);
			User modUser = userRepo.save(user);
			
			UserReport ur = new UserReport();
			ur.setIdUser(modUser.getId());
			ur.setUsername(modUser.getName());
			ur.setEmail(modUser.getEmail());
			ur.setIdAdmin(null);
			ur.setAdminName(null);
			ur.setAdminEmail(null);
			ur.setStatusReport(StatusReport.PROMOTED_SELLER);
			ur.setDateReport(new Date());
			userReportRepo.save(ur);
			
			tokenTools.createToken(modUser.getName(), modUser.getEmail(), modUser.getRole(), res);
			return true;
		}catch(Exception e) {
			res.sendError(500, "There`s some error when fetching data");
			return false;
		}
	}
	
	@PreAuthorize("hasAuthority('MANAGER')")
	public boolean prodemUserAdmin(String email, boolean delete, HttpServletResponse res) throws IOException {
		try {
			User user = userRepo.findByEmail(email).get();
			if(delete) {
				user.setRole(Role.USER);
				User modUser = userRepo.save(user);
				
				UserReport ur = new UserReport();
				ur.setIdUser(modUser.getId());
				ur.setUsername(modUser.getName());
				ur.setEmail(modUser.getEmail());
				ur.setIdAdmin(null);
				ur.setAdminName(null);
				ur.setAdminEmail(null);
				ur.setStatusReport(StatusReport.DEMOTED_USER);
				ur.setDateReport(new Date());
				userReportRepo.save(ur);
			}
			else {
				user.setRole(Role.ADMINISTRATIF);
				User modUser = userRepo.save(user);
				
				UserReport ur = new UserReport();
				ur.setIdUser(modUser.getId());
				ur.setUsername(modUser.getName());
				ur.setEmail(modUser.getEmail());
				ur.setIdAdmin(null);
				ur.setAdminName(null);
				ur.setAdminEmail(null);
				ur.setStatusReport(StatusReport.PROMOTED_ADMIN);
				ur.setDateReport(new Date());
				userReportRepo.save(ur);
			}
			return true;
		}catch(Exception e) {
			res.sendError(500, "There`s some error when fetching data");
			return false;
		}
	}
	
	@PreAuthorize("hasAnyAuthority('ADMINISTRATIF','MANAGER')")
	public byte[] getFileReport(Date start, Date end, HttpServletResponse res) throws IOException {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(end);
		calendar.add(Calendar.DAY_OF_MONTH, 1);
		return FileConfig.getReportFile(userReportRepo, bookReportRepo, start, calendar.getTime(), res);
	}
//	public void deleteAdmin(String name, String email) {
//		User user = userRepo.getByNameAndEmail(name, email);
//		for (Book book : user.getBook()) {
//			book.removeUser(user);
//		}
//		userRepo.delete(user);
//	}
}

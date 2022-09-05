package com.amrTm.backLMS.restApi;

import java.io.IOException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Base64;
import java.util.Date;
import javax.mail.MessagingException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.amrTm.backLMS.DTO.UserDTO;
import com.amrTm.backLMS.DTO.UserInfoDTO;
import com.amrTm.backLMS.DTO.UserResponse;
import com.amrTm.backLMS.entity.Role;
import com.amrTm.backLMS.service.AdminService;
import com.amrTm.backLMS.service.UserService;

@CrossOrigin
@RestController
@RequestMapping("/user")
public class UserRest {
	
	@Autowired
	private UserService userServices; 
	
	@Autowired
	private AdminService adminService;
	
	//success
	@GetMapping("/get")
	public UserInfoDTO getUser(HttpServletResponse res) throws IOException {
		return adminService.getInfoUser(res);
	}
	
	//success
	@GetMapping(path="/image/{path}", produces= {MediaType.IMAGE_JPEG_VALUE,MediaType.IMAGE_PNG_VALUE})
	public byte[] getImage(@PathVariable String path, HttpServletResponse res) throws IOException {
		return userServices.getImageUser(path, res);
	}
	
//	//success
//	@GetMapping("/getalluser")
//	public UserResponse getAllUser(@RequestParam Integer page, @RequestParam Integer size, HttpServletResponse res) throws IOException{
//		return userServices.getAllUser(page, size, res);
//	}
//	
//	//success
//	@GetMapping("/getalladmin")
//	public UserResponse getAllAdmin(@RequestParam Integer page, @RequestParam Integer size, HttpServletResponse res) throws IOException{
//		return userServices.getAllAdmin(page, size, res);
//	}
	
	//success
	@GetMapping("/search")
	public UserResponse searchUser(@RequestParam Integer page, @RequestParam Integer size, @RequestParam String words, HttpServletResponse res) throws IOException {
		return userServices.searchUser(page, size, words, Arrays.asList(Role.ANON,Role.SELLER,Role.USER), res);
	}
	
	@GetMapping("/search/manager")
	public UserResponse searchUserAdmin(@RequestParam Integer page, @RequestParam Integer size, @RequestParam String words, HttpServletResponse res) throws IOException {
		return userServices.searchUser(page, size, words, Arrays.asList(Role.ADMINISTRATIF), res);
	}
	
	@PostMapping(path="/getReport", consumes= {MediaType.MULTIPART_FORM_DATA_VALUE})
	public String getReport(@RequestParam String start, @RequestParam String end, HttpServletResponse res) throws IOException {
		DateFormat format = new SimpleDateFormat("M/d/yyyy");
		try {
			Date str = format.parse(start);
			Date ed = format.parse(end);
			return Base64.getEncoder().encodeToString(adminService.getFileReport(str, ed, res));
		} catch (ParseException e) {
			res.sendError(400, "Wrong format date, please use same format");
			return null;
		}
	}
	
	//success
	@PostMapping(path="/verify", consumes= {MediaType.MULTIPART_FORM_DATA_VALUE})
	public void validate(@RequestParam(value="tkid") String token, HttpServletResponse res) throws IOException {
		adminService.validateUser(token, res);
	}
	
	//success
	@PostMapping(path="/verify-oauth", consumes= {MediaType.MULTIPART_FORM_DATA_VALUE})
	public void verifyOAuth(@RequestParam String email, @RequestParam String username, @RequestParam Integer id, HttpServletResponse res) throws IOException {
		adminService.validateUserOAuth(username, email, id, res);
	}
	
	//success
	@PostMapping(path="/login", consumes= {MediaType.MULTIPART_FORM_DATA_VALUE})
	public void login(@RequestParam String email, @RequestParam String password, HttpServletResponse res) throws IOException {
		adminService.standardLogin(email,password,res);
	}
	
	//success
	@PostMapping(path="/signup", consumes= {MediaType.MULTIPART_FORM_DATA_VALUE})
	public void signUp(UserDTO user, @RequestPart(required=false) MultipartFile image, HttpServletResponse res) throws IOException, MessagingException {
		try {
			adminService.standardSignup(user,res,image);
		}catch(OptimisticLockingFailureException e) {
			res.sendError(409, "Please Try Again");
		}
	}
	
	//success
	@PostMapping("/logout")
	public String logout(HttpServletRequest req, HttpServletResponse res) throws ServletException, ParseException, IOException {
		adminService.Logout(req,res);
		return "Success";
	}
	
	//success
	@PostMapping(path="/password", consumes= {MediaType.MULTIPART_FORM_DATA_VALUE})
	public String validatePassword(@RequestParam String password, HttpServletResponse res) throws IOException {
		if(adminService.validatePassword(password, res)) 
			return "Success";
		res.sendError(400, "Your Password wrong");
		return null;
	}
	
	//success
	@PostMapping(path="/password/change", consumes= {MediaType.MULTIPART_FORM_DATA_VALUE})
	public String changePasswordUser(@RequestParam String oldPassword, @RequestParam String newPassword,
			HttpServletResponse res) throws IOException {
		try {
			if(adminService.modifyUserPassword(oldPassword, newPassword, res)) 
				return "Success";
			return null;
		}catch(OptimisticLockingFailureException e) {
			res.sendError(409, "Please Try Again");
			return null;
		}
	}
	
	//success
	@PostMapping("/modify/seller")
	public String modifySeller(HttpServletResponse res) throws IOException {
		try {
			adminService.promotingUser(res);
			return "Success";
		}catch(OptimisticLockingFailureException e) {
			res.sendError(409, "Please Try Again");
			return null;
		}
	}
	
	//success
	@PostMapping(path="/modify/admin", consumes= {MediaType.MULTIPART_FORM_DATA_VALUE})
	public String modifyAdmin(@RequestParam String email, @RequestParam boolean delete, HttpServletResponse res) throws IOException {
		adminService.prodemUserAdmin(email, delete, res);
		return "Success";
	}
	
	//success
	@PostMapping(path="/adduseronline", consumes= {MediaType.MULTIPART_FORM_DATA_VALUE})
	public String addUserOnline(@RequestParam Long id) {
		userServices.addUserOnline(id);
		return "Success";
	}
	
	//success
	@PutMapping(path="/modify", consumes= {MediaType.MULTIPART_FORM_DATA_VALUE})
	public UserInfoDTO modifyUser(UserDTO userModel, @RequestPart(required=false) MultipartFile image, HttpServletResponse res) throws IOException {
		try {
			return userServices.modifyUser(userModel, image, res);
		}catch(OptimisticLockingFailureException e) {
			res.sendError(409, "Please Try Again");
			return null;
		}
	}
	
	//success
	@DeleteMapping("/delete")
	public String deleteUser(@RequestParam String email, HttpServletResponse res) throws IOException {
		try {
			userServices.deleteUser(email, res);
			return "Success";
		}catch(OptimisticLockingFailureException e) {
			res.sendError(409, "Please Try Again");
			return null;
		}
	}
	
	//success
	@DeleteMapping("/delete/admin")
	public String deleteAdmin(@RequestParam String email, HttpServletResponse res) throws IOException {
		userServices.deleteAdmin(email, res);
		return "Success";
	}
	
	//success
	@DeleteMapping("/delete/useronline")
	public String deleteUserOnline(@RequestParam Long id) {
		userServices.deleteUserOnline(id);
		return "Success";
	}
}

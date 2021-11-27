package com.amrTm.backLMS.restApi;

import java.io.IOException;
import java.text.ParseException;
import java.util.List;

import javax.mail.MessagingException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
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
import com.amrTm.backLMS.service.AdminService;
import com.amrTm.backLMS.service.UserServices;

@CrossOrigin
@RestController
@RequestMapping("/user")
public class UserRest {
	
	@Autowired
	private UserServices userServices; 
	
	@Autowired
	private AdminService adminService;
	
	@GetMapping("/get")
	public UserInfoDTO getAdmin() {
		return adminService.getInfoAdmin();
	}
	
	@GetMapping(path="/image/{path}", produces= {MediaType.IMAGE_JPEG_VALUE,MediaType.IMAGE_PNG_VALUE})
	public byte[] getImage(@PathVariable String path) throws IOException {
		return userServices.getImageUser(path);
	}
	
	@GetMapping("/getalluser")
	public List<UserInfoDTO> getAllUser(){
		return userServices.getAllUser();
	}
	
	@GetMapping("/getalladmin")
	public List<UserInfoDTO> getAllAdmin(){
		return userServices.getAllAdmin();
	}
	
	@GetMapping("/getuseronline")
	public List<Long> getUserOnline(){
		return userServices.getUserOnline();
	}
	
	@PostMapping(path="/validate", consumes= {MediaType.MULTIPART_FORM_DATA_VALUE})
	public void validate(@RequestParam(value="tkid") String token, HttpServletResponse res) throws IOException {
		adminService.validateUser(token, res);
	}
	
	@PostMapping(path="/verify-oauth", consumes= {MediaType.MULTIPART_FORM_DATA_VALUE})
	public void verifyOAuth(@RequestParam String email, @RequestParam String username, @RequestParam int id, HttpServletResponse res) throws IOException {
		adminService.validateUserOAuth(username, email, id, res);
	}
	
	@PostMapping(path="/login", consumes= {MediaType.MULTIPART_FORM_DATA_VALUE})
	public void login(@RequestParam String email, @RequestParam String password, HttpServletResponse res) throws IOException {
		adminService.standardLogin(email,password,res);
	}
	
	@PostMapping(path="/signup", consumes= {MediaType.MULTIPART_FORM_DATA_VALUE})
	public void signUp(UserDTO user, @RequestPart(required=false) MultipartFile image, HttpServletResponse res) throws IOException, MessagingException {
		adminService.standardSignup(user,res,image);
	}
	
	@PostMapping("/logout")
	public String logout(HttpServletRequest req, HttpServletResponse res) throws ServletException, ParseException {
		adminService.Logout(req,res);
		return "Success";
	}
	
	@PostMapping(path="/password", consumes= {MediaType.MULTIPART_FORM_DATA_VALUE})
	public String validatePassword(@RequestParam String email, @RequestParam String pass) {
		if(adminService.validatePassword(email, pass)) return "Success";
		throw new BadCredentialsException("Your Password not Match");
	}
	
	@PostMapping(path="/password/change", consumes= {MediaType.MULTIPART_FORM_DATA_VALUE})
	public String changePasswordUser(@RequestParam String email, @RequestParam String name, @RequestParam String oldPassword, @RequestParam String newPassword) {
		if(adminService.modifyUserPassword(name, email, oldPassword, newPassword)) return "Success";
		throw new BadCredentialsException("Your Password not Match");
	}
	
	@PostMapping(path="/modify/seller", consumes= {MediaType.MULTIPART_FORM_DATA_VALUE})
	public String modifySeller(@RequestParam String name, @RequestParam String email) throws IOException {
		adminService.modifyUser(email, name);
		return "Success";
	}
	
	@PostMapping(path="/modify/admin", consumes= {MediaType.MULTIPART_FORM_DATA_VALUE})
	public String modifyAdmin(@RequestParam String name, @RequestParam String email, @RequestParam boolean delete) throws IOException {
		adminService.modifyUserAdmin(email, name, delete);
		return "Success";
	}
	
	@PostMapping(path="/adduseronline", consumes= {MediaType.MULTIPART_FORM_DATA_VALUE})
	public String addUserOnline(@RequestParam Long id) {
		userServices.addUserOnline(id);
		return "Success";
	}
	
	@PutMapping(path="/modify", consumes= {MediaType.MULTIPART_FORM_DATA_VALUE})
	public UserInfoDTO modifyUser(@RequestParam String nameOld, @RequestParam String emailOld, UserDTO userModel, 
			@RequestPart(required=false) MultipartFile image) throws IOException {
		return userServices.modifyUser(nameOld, emailOld, userModel, image);
	}
	
	@DeleteMapping("/delete")
	public String deleteUser(@RequestParam String name, @RequestParam String email) {
		userServices.deleteUser(name, email);
		return "Success";
	}
	
	@DeleteMapping("/delete/admin")
	public String deleteAdmin(@RequestParam String name, @RequestParam String email) {
		userServices.deleteAdmin(name, email);
		return "Success";
	}
	
	@DeleteMapping("/delete/useronline")
	public String deleteUser(@RequestParam Long id) {
		userServices.deleteUserOnline(id);
		return "Success";
	}
}

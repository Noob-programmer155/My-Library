package com.amrTm.backLMS.restApi;

import java.io.IOException;
import java.util.List;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.amrTm.backLMS.DTO.UserDTO;
import com.amrTm.backLMS.DTO.UserInfoDTO;
import com.amrTm.backLMS.service.AdminService;
import com.amrTm.backLMS.service.BookServices;
import com.amrTm.backLMS.service.UserServices;

@CrossOrigin
@RestController
@RequestMapping("/user")
public class UserRest {
	
	@Autowired
	private UserServices userServices; 
	
	@Autowired
	private AdminService adminService;
	
	@Autowired
	private BookServices bookServices; 
	
	@GetMapping("/get")
	public String getUser() {
		return userServices.getUser();
	}
	
	@GetMapping("/getall")
	public List<UserInfoDTO> getAllUser(){
		return userServices.getAllUser();
	}
	
	@PostMapping(path="/validate", consumes= {MediaType.APPLICATION_FORM_URLENCODED_VALUE})
	public UserInfoDTO validate(@RequestParam(value="tkid") String token, HttpServletResponse res) throws IOException {
		return adminService.validateUser(token, res);
	}
	
	@GetMapping("/get/tg5YVtsj6M")
	public UserInfoDTO getAdmin() {
		return adminService.getInfoAdmin();
	}
	
	@PostMapping(path="/verify-oauth", consumes= {MediaType.APPLICATION_FORM_URLENCODED_VALUE})
	public UserInfoDTO verifyOAuth(@RequestParam String email, @RequestParam String username, @RequestParam int id, HttpServletResponse res) throws IOException {
		return adminService.validateUserOAuth(username, email, id, res);
	}
	
	@PostMapping(path="/login", consumes= {MediaType.APPLICATION_FORM_URLENCODED_VALUE})
	public UserInfoDTO login(@RequestParam String email, @RequestParam String password, HttpServletResponse res) throws IOException {
		return adminService.standardLogin(email,password,res);
	}
	
	@PostMapping(path="/signup", consumes= {MediaType.MULTIPART_FORM_DATA_VALUE})
	public UserInfoDTO signUp(UserDTO user, HttpServletResponse res) throws IOException, MessagingException {
		return adminService.standardSignup(user, res);
	}
	
	@PostMapping(path="/password", consumes= {MediaType.APPLICATION_FORM_URLENCODED_VALUE})
	public String validatePassword(@RequestParam String email, @RequestParam String pass) {
		if(adminService.validatePassword(email, pass)) return "Success";
		return null;
	}
	
	@PostMapping(path="/modify/seller", consumes= {MediaType.APPLICATION_FORM_URLENCODED_VALUE})
	public String modifySeller(@RequestParam String name, @RequestParam String email) throws IOException {
		adminService.modifyUser(email, name);
		return "Success";
	}
	
	@PostMapping(path="/modify/admin", consumes= {MediaType.APPLICATION_FORM_URLENCODED_VALUE})
	public String modifyAdmin(@RequestParam String name, @RequestParam String email) throws IOException {
		adminService.modifyUserAdmin(email, name);
		return "Success";
	}
	
	@PutMapping(path="/modify", consumes= {MediaType.APPLICATION_FORM_URLENCODED_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
	public String modifyUser(@RequestParam String name, @RequestParam String email, UserDTO userModel) throws IOException {
		userServices.modifyUser(name, email, userModel);
		return "Success";
	}
	
	@PutMapping(path="/modify/book", consumes= {MediaType.APPLICATION_FORM_URLENCODED_VALUE})
	public String modifyUserBook(@RequestParam int idU, @RequestParam String idB, @RequestParam boolean del) {
		bookServices.modifyBookFav(idB,idU,del);
		return "Success";
	}
	
	@DeleteMapping(path="/delete", consumes= {MediaType.APPLICATION_FORM_URLENCODED_VALUE})
	public String deleteUser(@RequestParam String name, @RequestParam String email) {
		userServices.deleteUser(name, email);
		return "Success";
	}
	
	@DeleteMapping(path="/delete/admin", consumes= {MediaType.APPLICATION_FORM_URLENCODED_VALUE})
	public String deleteAdmin(@RequestParam String name, @RequestParam String email) {
		userServices.deleteAdmin(name, email);
		return "Success";
	}
}

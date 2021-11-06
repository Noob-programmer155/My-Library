package com.amrTm.backLMS.service;

import java.io.IOException;
import java.util.Base64;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.amrTm.backLMS.DTO.UserInfoDTO;
import com.amrTm.backLMS.entity.Role;
import com.amrTm.backLMS.entity.User;
import com.amrTm.backLMS.repository.UserRepo;
import com.amrTm.backLMS.service.token.TokenTools;

@Service
public class MailService {
	@Autowired
	private JavaMailSender javaMailSender;
	
	@Autowired
	private TokenTools tokenTools; 
	
	@Autowired
	private UserRepo userRepo;
	
	private final String head = "<html> <head> <meta charset='utf-8'> <meta name='viewport' content='width=device-width, initial-scale=1'> "
			+ "<style>.root {width:100vw;height:100vh;display:flex;display:-webkit-flex;display:-ms-flex;align-items:center;justify-content:center;}"
			+ ".subroot {max-width:'70vw';display:flex;display:-webkit-flex;display:-ms-flex;align-items:center;justify-content:center;"
			+ "flex-wrap:wrap;background-color:#99ffcc;border:5px solid #00e699;border-radius:20px;}"
			+ "h3 {padding:15px;color:#00995c;width:100%;text-align:center;margin-top:35px;}"
			+ "p {color:#00995c;width:100%;text-align:center;}"
			+ "button {background-color:#ff6600;color:#ffff;border:3px solid #ff3300;border-radius:20px;padding:8px;margin-bottom:40px;}</style> </head> <body>"
			+ "<div class='root'><div class='subroot'><h3>Assalamu`alaikum, ";
	
	private final String footer = "</h3><br/><p>Please verify if that you. By pressing the button bellow means you are verified :</p>"
			+ "<button type='a' rel='noreferer noopener' href='http://localhost:3000/validate?tk=";
	
	private final String end = "' target='_blank'>click me</button></div></div></body></html>";
	
	public boolean sendEmailValidation(String username, String email) throws MessagingException {
		MimeMessage msg = javaMailSender.createMimeMessage();
		MimeMessageHelper help = new MimeMessageHelper(msg);
		help.setTo(email);
		help.setSubject("Email Validation");
		help.setText(head+username+footer+Base64.getEncoder().encodeToString(email.getBytes())+end, true);
		javaMailSender.send(msg);
		return true;
	}
	
	public UserInfoDTO emailValidation(String token, HttpServletResponse res) throws IOException {
		String email = new String(Base64.getDecoder().decode(token));
		if(userRepo.findByEmail(email).isPresent()) {
			User user = userRepo.findByEmail(email).get();
			user.setRole(Role.USER);
			User yt = userRepo.save(user);
			if (tokenTools.createToken(yt.getName(), yt.getEmail(), yt.getRole(), res)) {
				UserInfoDTO bg = new UserInfoDTO();
				bg.setId(yt.getId());
				bg.setImage_url(yt.getImage_url());
				bg.setName(yt.getName());
				bg.setEmail(yt.getEmail());
				bg.setRole(yt.getRole().toString());
				return bg;
			}
		}
		res.sendError(500);
		return null;
	}
}

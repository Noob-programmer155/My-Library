package com.amrTm.backLMS.service;

import java.io.IOException;
import java.io.StringWriter;
import java.util.Base64;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletResponse;

import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.exception.MethodInvocationException;
import org.apache.velocity.exception.ParseErrorException;
import org.apache.velocity.exception.ResourceNotFoundException;
import org.apache.velocity.runtime.RuntimeConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
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
	
	@Value("classpath:/static/mailTemplate.vm")
	private Resource mailTemplate;
	
	@Autowired
	private UserRepo userRepo;
	
	public boolean sendEmailValidation(String username, String email) throws MessagingException, ResourceNotFoundException, ParseErrorException, MethodInvocationException, IOException {
		MimeMessage msg = javaMailSender.createMimeMessage();
		MimeMessageHelper help = new MimeMessageHelper(msg);
		help.setTo(email);
		help.setSubject("Email Validation");
		VelocityContext cntx = new VelocityContext();
		cntx.put("name", username);
		cntx.put("token", Base64.getEncoder().encodeToString(email.getBytes()));
		StringWriter writer = new StringWriter();
		VelocityEngine ve = new VelocityEngine();
		ve.setProperty(RuntimeConstants.RESOURCE_LOADER, "class");
		ve.setProperty("class.resource.loader.class", "org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader");
		ve.init();
		Template hg = ve.getTemplate("templates/mailTemplate.vm");
		hg.merge(cntx, writer);
		help.setText(writer.toString(), true);
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

package com.amrTm.backLMS;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@SpringBootApplication
@EnableJpaRepositories("com.amrTm.backLMS.repository")
public class LibraryBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(LibraryBackendApplication.class, args);
	}
	
	@Bean
	public JavaMailSender javaMailSender() {
		return new JavaMailSenderImpl();
	} 
}

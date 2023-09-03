package com.amrTm.backLMS.security;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.amrTm.backLMS.service.UserDetailService;
import com.amrTm.backLMS.service.UserOAuth2Service;
import com.amrTm.backLMS.service.token.TokenFilter;
import com.amrTm.backLMS.service.token.TokenTools;

@Profile("production")
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled=true)
public class SecurityMainProduction extends WebSecurityConfigurerAdapter{
	
	@Autowired
	private UserDetailService userDetailServ;
	
	@Autowired
	private UserOAuth2Service userOAuth2Service; 
	
	@Autowired
	private TokenTools tokenTools;
	
	@Autowired
	private UserOAuth2SuccessHandler userOAuth2SuccessHandler;
	
	@Autowired
	private UserOAuth2FailureHandler userOAuth2FailureHandler;
	
	@Value("${listpathurl}")
	private List<String> ignoresPath;
	
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userDetailServ).passwordEncoder(new BCryptPasswordEncoder());
	}

	@Override
	public void configure(WebSecurity web) throws Exception {
		web.ignoring().antMatchers("/user/verify","/user/login","/user/login/**","/user/signup","/user/verify-oauth");
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http
//			.requiresChannel()
//				.anyRequest().requiresSecure()
//			.and()
			.csrf()
				.disable()
			.cors()
			.and()
			.httpBasic().disable()
			.authorizeRequests()
				.antMatchers("/user/**","/book/**").permitAll()
				.anyRequest()
					.anonymous();
//			.and()
//				.oauth2Login()
//					.userInfoEndpoint()
//						.userService(userOAuth2Service).and()
//					.authorizationEndpoint().baseUri("/login/auth")
//			.and()
//				.successHandler(userOAuth2SuccessHandler)
//				.failureHandler(userOAuth2FailureHandler);
//				.and()
//					.logout()
//						.logoutUrl("/user/logout")
//						.clearAuthentication(true)
//						.invalidateHttpSession(true)
//						.deleteCookies("JSESSIONID","JLMS_TOKEN")
//						.permitAll();

		http.addFilterBefore( new TokenFilter(tokenTools,ignoresPath),UsernamePasswordAuthenticationFilter.class);
	}
	
	@Bean
	@Override
	protected AuthenticationManager authenticationManager() throws Exception {
		return super.authenticationManager();
	}
}

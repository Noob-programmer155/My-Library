package com.amrTm.backLMS.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.amrTm.backLMS.token_service.TokenFilter;
import com.amrTm.backLMS.token_service.TokenTools;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled=true)
public class SecurityMain extends WebSecurityConfigurerAdapter{
	
	@Autowired
	private UserDetailServ userDetailServ;
	
	@Autowired
	private UserOAuth2Service userOAuth2Service; 
	
	@Autowired
	private TokenTools tokenTools;
	
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userDetailServ).passwordEncoder(new BCryptPasswordEncoder());
	}

	@Override
	public void configure(WebSecurity web) throws Exception {
		web.ignoring().antMatchers("/user/validate","/user/login","/user/signup","/login/auth/**","/user/verify-oauth");
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
			.authorizeRequests()
				.antMatchers("/user/**","/book/**","/login/auth/**").permitAll()
				.anyRequest()
					.authenticated()
			.and()
				.oauth2Login()
					.userInfoEndpoint()
						.userService(userOAuth2Service).and()
						.authorizationEndpoint().baseUri("/login/auth")
			.and()
				.successHandler(new UserOAuth2SuccessHandler())
				.failureHandler(new UserOAuth2FailureHandler())
			.and()
				.logout()
					.logoutUrl("/user/logout")
					.clearAuthentication(true)
					.invalidateHttpSession(true)
					.deleteCookies("JSESSIONID","JLMS_TOKEN")
					.permitAll();
				
		http.addFilterBefore( new TokenFilter(tokenTools),UsernamePasswordAuthenticationFilter.class);
	}
	
	@Bean
	@Override
	protected AuthenticationManager authenticationManager() throws Exception {
		return super.authenticationManager();
	}
}

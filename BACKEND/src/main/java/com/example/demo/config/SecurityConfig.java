package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.demo.config.AppConfig;
import com.example.demo.JWT.JwtAuthFilter;


import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
	
	private final JwtAuthFilter jwtAuthFilter;
	private final AuthenticationProvider authProvider;
	
	@Bean
	public SecurityFilterChain secFilterChain(HttpSecurity http) throws Exception
	{
		{
			return http
					.csrf(csrf ->
						csrf
						.disable())
					.authorizeHttpRequests(authRequest ->
					 authRequest
					 	.anyRequest().permitAll()
							)
						.sessionManagement(sessionManager ->
								sessionManager
									.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
						.authenticationProvider(authProvider)
						.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
						.build();
		}

	}

}


/*

return http
.csrf(csrf ->
	csrf
	.disable())
.authorizeHttpRequests(authRequest ->
 authRequest
 	.requestMatchers("/auth/**").permitAll()
 	.anyRequest().authenticated()
		)
	.sessionManagement(sessionManager ->
			sessionManager
				.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
	.authenticationProvider(authProvider)
	.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
	.build();


*/
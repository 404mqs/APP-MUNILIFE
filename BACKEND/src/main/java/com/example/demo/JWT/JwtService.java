package com.example.demo.JWT;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity2.Usuario;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
	
	private static final String SECRET_KEY = "sj3+OpYfvZZ2vAZ/KuaDCF0pvOec+PPMCnYFhuXmIA0=";

	public String getToken(Usuario usuario) {
		return getToken(new HashMap<>(), usuario);

}

	private String getToken(Map<String,Object> extraClaims, Usuario usuario) {
		
	    extraClaims.put("rol", usuario.getRole().name()); // Asume que Rol es un enum y tiene un método name()

		return Jwts
				.builder()
				.setClaims(extraClaims)
				.setSubject(usuario.getUsername())
				.setIssuedAt(new Date(System.currentTimeMillis()))
				.setIssuedAt(new Date(System.currentTimeMillis()+1000*60*24))
				.signWith(getKey(), SignatureAlgorithm.HS256)
				.compact();

	}

	private Key getKey() {
		byte[] keyBytes=Decoders.BASE64.decode(SECRET_KEY);
		return Keys.hmacShaKeyFor(keyBytes);
	}
}

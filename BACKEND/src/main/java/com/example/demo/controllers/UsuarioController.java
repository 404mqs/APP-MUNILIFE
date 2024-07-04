package com.example.demo.controllers;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Optional;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.auth.AuthService;
import com.example.demo.model.entity2.FotoBase64Request;
import com.example.demo.model.entity2.FotoUsuarioDTO;
import com.example.demo.model.entity2.Usuario;
import com.example.demo.services.UsuarioService;
import com.example.demo.services.VecinoService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;

@RestController
@RequestMapping("/system")
public class UsuarioController {

	@Autowired
	VecinoService vecinoService;
	
	@Autowired
	UsuarioService usuarioService;
	
	@Autowired
	AuthService authService;
	
    private final int EXPIRATION_TIME_IN_MIN = 40;

    
    @GetMapping("/usuarios")
    public ResponseEntity<ArrayList<Usuario>> obtenerUsuarios() {
        ArrayList<Usuario> defects = usuarioService.findAllUsuarios();
        return new ResponseEntity<>(defects, HttpStatus.OK);
    }
    
    @GetMapping(path = "/usuarios/yo")
	public ResponseEntity<Usuario> user_info(@RequestHeader("Authorization") String token) {
    	
    	 String secretKeyBase64 = "sj3+OpYfvZZ2vAZ/KuaDCF0pvOec+PPMCnYFhuXmIA0="; // Reemplaza esto con tu clave secreta real
         SecretKey secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKeyBase64));

         // Extraer email del token JWT
         String email;
         
         try {
             Claims claims = Jwts.parserBuilder()
                 .setSigningKey(secretKey)
                 .build()
                 .parseClaimsJws(token.replace("Bearer ", ""))
                 .getBody();
             
             email = claims.getSubject();
         } catch (SignatureException e) {
             return ResponseEntity.status(401).build();
         }

         // Buscar usuario por email
         Optional<Usuario> usuarioOptional = usuarioService.findUsuarioByEmail(email);
         if (!usuarioOptional.isPresent()) {
             return ResponseEntity.status(404).build();
         }
         
         Usuario usuario = usuarioOptional.get();
		
         return ResponseEntity.ok(usuario);
         
	}
    
    @PostMapping("/subir-foto")
    public ResponseEntity<?> subirFoto(@RequestParam("foto") MultipartFile foto, @RequestHeader("Authorization") String token) {
    	
    	 String secretKeyBase64 = "sj3+OpYfvZZ2vAZ/KuaDCF0pvOec+PPMCnYFhuXmIA0="; // Reemplaza esto con tu clave secreta real
         SecretKey secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKeyBase64));

         // Extraer email del token JWT
         String email;
         
         try {
             Claims claims = Jwts.parserBuilder()
                 .setSigningKey(secretKey)
                 .build()
                 .parseClaimsJws(token.replace("Bearer ", ""))
                 .getBody();
             
             email = claims.getSubject();
         } catch (SignatureException e) {
             return ResponseEntity.status(401).build();
         }
         
        if (email != null && !email.isEmpty() && foto != null && !foto.isEmpty()) {
            try {
                FotoUsuarioDTO fotoUsuarioDTO = new FotoUsuarioDTO();
                fotoUsuarioDTO.setEmail(email);
                try {
					fotoUsuarioDTO.setFoto(foto.getBytes());
				} catch (IOException e) {
					e.printStackTrace();
				}
                authService.actualizarFotoUsuario(fotoUsuarioDTO);
                return ResponseEntity.ok("Foto de usuario actualizada correctamente");
            } catch (RuntimeException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email y foto son requeridos");
    }
    
    @PostMapping("/subir-foto-base64")
    public ResponseEntity<?> subirFotoBase64(@RequestBody FotoBase64Request request, @RequestHeader("Authorization") String token) {
        String secretKeyBase64 = "sj3+OpYfvZZ2vAZ/KuaDCF0pvOec+PPMCnYFhuXmIA0="; // Reemplaza esto con tu clave secreta real
        SecretKey secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKeyBase64));

        // Extraer email del token JWT
        String email;

        try {
            Claims claims = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token.replace("Bearer ", ""))
                .getBody();

            email = claims.getSubject();
        } catch (SignatureException e) {
            return ResponseEntity.status(401).build();
        }

        if (email != null && !email.isEmpty() && request.getFotoBase64() != null && !request.getFotoBase64().isEmpty()) {
            try {
                byte[] fotoBytes = Base64.getDecoder().decode(request.getFotoBase64());

                FotoUsuarioDTO fotoUsuarioDTO = new FotoUsuarioDTO();
                fotoUsuarioDTO.setEmail(email);
                fotoUsuarioDTO.setFoto(fotoBytes);
                authService.actualizarFotoUsuario(fotoUsuarioDTO);

                return ResponseEntity.ok("Foto de usuario actualizada correctamente");
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Formato de base64 inválido");
            } catch (RuntimeException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email y foto son requeridos");
    }
    
    @GetMapping("/usuarios/{id}/foto")
    public ResponseEntity<byte[]> obtenerFotoComercio(@PathVariable Long id) {
        Optional<Usuario> comercioOpt = usuarioService.findUsuarioById(id);
        if (!comercioOpt.isPresent() || comercioOpt.get().getFoto() == null) {
            return ResponseEntity.status(404).build();
        }
        
        Usuario comercio = comercioOpt.get();
        byte[] foto = comercio.getFoto();
        
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(foto);
    }
	
   

}

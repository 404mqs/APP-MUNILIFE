package com.example.demo.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.JWT.JwtService;
import com.example.demo.model.entity2.LoginDTO;
import com.example.demo.model.entity2.Usuario;
import com.example.demo.model.entity2.UsuarioDTO;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final PasswordEncoder encoder;

    @Autowired
    AuthService authService;

    @Autowired
    JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        try {
            AuthResponse response = authService.login(loginDTO.getMail(), loginDTO.getContraseña());
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Las contraseñas no coinciden");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error en el servidor");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UsuarioDTO request) {
        if (request.getEmail() != null && request.getDni() != null) {
            Usuario usuario = authService.registrarUsuario(request);
            AuthResponse response = authService.register(usuario);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email y DNI son requeridos");
    }
    
    @PostMapping("/solicitar-nueva-contrasena")
    public ResponseEntity<?> solicitarNuevaContrasena(@RequestBody UsuarioDTO request) {
        if (request.getEmail() != null && request.getDni() != null) {
            try {
                authService.generarNuevaContrasena(request);
                return ResponseEntity.ok("Nueva contraseña generada y enviada por correo electrónico");
            } catch (RuntimeException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email y DNI son requeridos");
    }
    
   

}

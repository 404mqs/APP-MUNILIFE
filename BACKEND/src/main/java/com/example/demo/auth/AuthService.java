package com.example.demo.auth;

import java.io.IOException;
import java.util.Optional;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestHeader;

import com.example.demo.JWT.JwtService;
import com.example.demo.config.PasswordGenerator;
import com.example.demo.model.entity2.FotoUsuarioDTO;
import com.example.demo.model.entity2.Role;
import com.example.demo.model.entity2.Usuario;
import com.example.demo.model.entity2.UsuarioDTO;
import com.example.demo.model.entity2.Vecino;
import com.example.demo.model.repos.DAOUsuarioCRUD;
import com.example.demo.services.EmailService;
import com.example.demo.services.UsuarioService;
import com.example.demo.services.VecinoService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    @Autowired
    UsuarioService usuarioService;

    @Autowired
    DAOUsuarioCRUD daoRepository;

    @Autowired
    AuthenticationManager authManager;

    private BCryptPasswordEncoder bCryptPasswordEncoder;

    private final JwtService jwtService;

    private final VecinoService vecinoService;

    private final EmailService emailService;

    @Autowired
    public AuthService(BCryptPasswordEncoder bCryptPasswordEncoder, JwtService jwtService, VecinoService vecinoService, EmailService emailService) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.jwtService = jwtService;
        this.vecinoService = vecinoService;
        this.emailService = emailService;
    }

    public AuthResponse login(String mail, String contraseña) throws BadCredentialsException {
        Optional<Usuario> userDetails = usuarioService.findUsuarioByEmail(mail);
        if (userDetails == null || !bCryptPasswordEncoder.matches(contraseña, userDetails.get().getContrasena())) {
            throw new BadCredentialsException("Las contraseñas no coinciden");
        }
        return AuthResponse.builder()
                .token(jwtService.getToken(userDetails.get()))
                .role(userDetails.get().getRole())
                .build();
    }

    public Usuario registrarUsuario(UsuarioDTO usuarioDTO) {
        // Verificar si el usuario ya existe
        Optional<Usuario> existingUser = usuarioService.findUsuarioByEmail(usuarioDTO.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("El usuario ya existe");
        }
        
        Usuario usuario = new Usuario();
        usuario.setUsername(usuarioDTO.getEmail()); // Asigna el email como username
        usuario.setDni(Integer.parseInt(usuarioDTO.getDni()));

        // Generar contraseña aleatoria de 4 dígitos
        String randomPassword = PasswordGenerator.generateRandomPassword(4);
        usuario.setContrasena(bCryptPasswordEncoder.encode(randomPassword));

        // Enviar la contraseña por correo electrónico
        String emailText = "Su contraseña es: " + randomPassword;
        emailService.sendEmail(usuarioDTO.getEmail(), "Registro exitoso", emailText);

        // Busca el vecino por DNI
        String dniString = usuarioDTO.getDni();
        Long dniLongObject = Long.valueOf(dniString);
        long dniLong = dniLongObject;

        Vecino vecino = vecinoService.findVecinoById(dniLong)
                .orElseThrow(() -> new RuntimeException("Vecino no encontrado"));

        if (vecino != null) {
            usuario.setNombre(vecino.getNombre());
            usuario.setApellido(vecino.getApellido());
            usuario.setRole(Role.VECINO);
        }

        // Guardar el usuario en la base de datos
        daoRepository.save(usuario);

        return usuario;
    }
    
    public void generarNuevaContrasena(UsuarioDTO request) {
        // Buscar el usuario por email
        Usuario usuario = usuarioService.findUsuarioByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar si el DNI proporcionado coincide con el del usuario
        if (usuario.getDni() != (Integer.parseInt(request.getDni()))) {
            throw new RuntimeException("El DNI no coincide con el registrado para el usuario");
        }

        // Generar nueva contraseña aleatoria de 4 dígitos
        String nuevaContrasena = PasswordGenerator.generateRandomPassword(4);
        usuario.setContrasena(bCryptPasswordEncoder.encode(nuevaContrasena));

        // Enviar la nueva contraseña por correo electrónico
        String emailText = "Su nueva contraseña es: " + nuevaContrasena;
        emailService.sendEmail(request.getEmail(), "Nueva contraseña generada", emailText);

        // Actualizar el usuario en la base de datos
        daoRepository.save(usuario);
    }

    public AuthResponse register(Usuario usuario) {
        daoRepository.save(usuario);
        return AuthResponse.builder()
                .token(jwtService.getToken(usuario))
                .role(usuario.getRole())
                .build();
    }
    
    public void actualizarFotoUsuario(FotoUsuarioDTO fotoUsuarioDTO) {
        // Buscar el usuario por email
        Usuario usuario = usuarioService.findUsuarioByEmail(fotoUsuarioDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Actualizar la foto del usuario
		usuario.setFoto(fotoUsuarioDTO.getFoto());

		// Guardar los cambios en la base de datos
		daoRepository.save(usuario);
    }
    
    
    
   
    
}


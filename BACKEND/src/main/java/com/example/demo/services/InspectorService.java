package com.example.demo.services;

import java.util.Optional;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity2.Personal;
import com.example.demo.model.entity2.Role;
import com.example.demo.model.entity2.Usuario;
import com.example.demo.model.repos.DAOPersonalCRUD;
import com.example.demo.model.repos.DAOUsuarioCRUD;

import jakarta.annotation.PostConstruct;

@Service
public class InspectorService {

    private static final Logger logger = Logger.getLogger(InspectorService.class.getName());
	
    @Autowired
    private DAOPersonalCRUD personalRepository;

    @Autowired
    private DAOUsuarioCRUD usuarioRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostConstruct
    public void verifyAndCreateInspectors() {
        logger.info("Verifying and creating inspectors...");
        Iterable<Personal> allInspectors = personalRepository.findAll();

        for (Personal inspector : allInspectors) {
            logger.info("Processing inspector with documento: " + inspector.getDocumento());
            Optional<Usuario> existingUser = usuarioRepository.findByDni(inspector.getDocumento());
            if (!existingUser.isPresent()) {
                logger.info("Creating new user for inspector with legajo: " + inspector.getLegajo());
                Usuario newUser = new Usuario();
                newUser.setDni(inspector.getDocumento());
                newUser.setUsername(inspector.getLegajo().toString());
                newUser.setNombre(inspector.getNombre());
                newUser.setApellido(inspector.getApellido());
                newUser.setContrasena(passwordEncoder.encode("1234"));
                newUser.setRole(Role.INSPECTOR);
                usuarioRepository.save(newUser);
            } else {
                logger.info("User already exists for inspector with legajo: " + inspector.getLegajo());
            }
        }
    }
}

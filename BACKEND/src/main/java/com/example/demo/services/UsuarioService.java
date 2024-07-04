package com.example.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity2.Usuario;
import com.example.demo.model.repos.DAOUsuarioCRUD;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Optional;

@Service
public class UsuarioService {

    private final DAOUsuarioCRUD daoRepository;

    @Autowired
    public UsuarioService(DAOUsuarioCRUD daoRepository) {
        this.daoRepository = daoRepository;
    }
    
    public Optional<Usuario> findUsuarioByDni(int dni) {
        return daoRepository.findByDni(dni);
    }
    
    public Optional<Usuario> findUsuarioByEmail(String mail) {
        return daoRepository.findByUsername(mail);
    }

    public ArrayList<Usuario> findAllUsuarios() {
        return (ArrayList<Usuario>) daoRepository.findAll();
    }
    

    public Optional<Usuario> findUsuarioById(Long id) {
        return daoRepository.findById(id);
    }
    
    public Optional<Usuario> findUsuarioByMail(String username) {
        return daoRepository.findByUsername(username);
    }

    public Usuario saveUsuario(Usuario usuario) {
        return daoRepository.save(usuario);
    }

    public void deleteUsuarioById(Long id) {
        daoRepository.deleteById(id);
    }

    public long countUsuarios() {
        return daoRepository.count();
    }
    
    
}

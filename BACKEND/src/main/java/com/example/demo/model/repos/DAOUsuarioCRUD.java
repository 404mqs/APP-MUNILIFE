package com.example.demo.model.repos;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.demo.model.entity2.Usuario;

public interface DAOUsuarioCRUD extends CrudRepository<Usuario, Long> {
	
   Optional<Usuario> findByUsername (String username);
   Optional<Usuario> findByDni (int dni);

}
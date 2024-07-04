package com.example.demo.model.repos;


import com.example.demo.model.entity2.Servicio;
import com.example.demo.model.entity2.Usuario;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

public interface DAOServicioCRUD extends CrudRepository<Servicio, Long> {
	
	   Optional<Servicio> findByidServicio (Long id);

}

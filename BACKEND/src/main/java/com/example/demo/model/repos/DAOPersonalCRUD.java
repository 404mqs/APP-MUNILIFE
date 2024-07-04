package com.example.demo.model.repos;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.example.demo.model.entity2.Personal;

public interface DAOPersonalCRUD extends CrudRepository<Personal, Long>{

	Optional<Personal> findByDocumento(int documento);

}

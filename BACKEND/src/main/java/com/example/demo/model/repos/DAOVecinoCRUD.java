package com.example.demo.model.repos;

import org.springframework.data.repository.CrudRepository;

import com.example.demo.model.entity2.Usuario;
import com.example.demo.model.entity2.Vecino;

public interface DAOVecinoCRUD extends CrudRepository<Vecino, Long> {

}
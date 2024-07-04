package com.example.demo.model.repos;

import org.springframework.data.repository.CrudRepository;
import com.example.demo.model.entity2.Desperfecto;
import com.example.demo.model.entity2.Reclamo;
import com.example.demo.model.entity2.Usuario;

import java.util.ArrayList;

public interface DAOReclamoCRUD extends CrudRepository<Reclamo, Long> {

    ArrayList<Reclamo> findByDocumento(Usuario usuario);

    ArrayList<Reclamo> findByIdDesperfectoIn(ArrayList<Desperfecto> desperfectos); // Corregido el nombre del método
}

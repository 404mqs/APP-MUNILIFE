package com.example.demo.model.repos;

import java.util.ArrayList;

import org.springframework.data.repository.CrudRepository;

import com.example.demo.model.entity2.Desperfecto;
import com.example.demo.model.entity2.FotoReclamo;
import com.example.demo.model.entity2.Reclamo;
import com.example.demo.model.entity2.Rubro;
import com.example.demo.model.entity2.Usuario;

public interface DAOFotoReclamoCRUD extends CrudRepository<FotoReclamo, Long> {

    ArrayList<FotoReclamo> findByReclamo(Reclamo reclamo);

}

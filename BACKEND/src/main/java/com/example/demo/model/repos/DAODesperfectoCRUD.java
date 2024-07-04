package com.example.demo.model.repos;

import java.util.ArrayList;

import org.springframework.data.repository.CrudRepository;

import com.example.demo.model.entity2.Desperfecto;
import com.example.demo.model.entity2.Rubro;

public interface DAODesperfectoCRUD extends CrudRepository<Desperfecto, Long>{

    ArrayList<Desperfecto> findByRubro(Rubro rubro);

}

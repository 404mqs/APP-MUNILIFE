package com.example.demo.model.repos;

import java.util.ArrayList;

import org.springframework.data.repository.CrudRepository;

import com.example.demo.model.entity2.Desperfecto;
import com.example.demo.model.entity2.MovimientosReclamo;
import com.example.demo.model.entity2.Reclamo;
import com.example.demo.model.entity2.Rubro;

public interface DAOMovRecCRUD extends CrudRepository<MovimientosReclamo, Long>{

    ArrayList<MovimientosReclamo> findByReclamo(Reclamo reclamo);

}

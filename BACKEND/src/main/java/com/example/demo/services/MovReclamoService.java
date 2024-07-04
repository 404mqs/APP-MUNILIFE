package com.example.demo.services;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity2.Desperfecto;
import com.example.demo.model.entity2.MovimientosReclamo;
import com.example.demo.model.entity2.Reclamo;
import com.example.demo.model.repos.DAOMovRecCRUD;

@Service
public class MovReclamoService {

    @Autowired
    private DAOMovRecCRUD daoRepository;

    public ArrayList<MovimientosReclamo> obtenerTodos() {
        return (ArrayList<MovimientosReclamo>) daoRepository.findAll();
    }

    public MovimientosReclamo guardar(MovimientosReclamo movimiento) {
        return daoRepository.save(movimiento);
    }

    public Optional<MovimientosReclamo> obtenerPorId(Long id) {
        return daoRepository.findById(id);
    }
    
	public ArrayList<MovimientosReclamo> obtenerPorReclamo(Reclamo reclamo) {
        return daoRepository.findByReclamo(reclamo);
    }


}

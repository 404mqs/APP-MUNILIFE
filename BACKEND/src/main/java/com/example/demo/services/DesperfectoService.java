package com.example.demo.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity2.Desperfecto; // Asegúrate de importar la clase Desperfecto correcta
import com.example.demo.model.entity2.Rubro;
import com.example.demo.model.repos.DAODesperfectoCRUD; // Asegúrate de importar el repositorio correcto

@Service
public class DesperfectoService {

    @Autowired
    private DAODesperfectoCRUD daoRepository; // Asegúrate de inyectar el repositorio correcto

    public ArrayList<Desperfecto> obtenerDesperfectos() {
        return (ArrayList<Desperfecto>) daoRepository.findAll();
    }

    public Desperfecto guardarDesperfecto(Desperfecto desperfecto) {
        return daoRepository.save(desperfecto);
    }

    public Optional<Desperfecto> obtenerPorId(Long id) {
        return daoRepository.findById(id);
    }

    public ArrayList<Desperfecto> obtenerPorRubro(Rubro rubro) {
        return daoRepository.findByRubro(rubro);
    }
    

    // Puedes agregar otros métodos según tus necesidades

}
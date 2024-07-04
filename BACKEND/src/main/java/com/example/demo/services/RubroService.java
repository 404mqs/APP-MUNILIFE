package com.example.demo.services;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity2.Rubro;
import com.example.demo.model.repos.DAORubroCRUD;

@Service
public class RubroService {

    @Autowired
    private DAORubroCRUD daoRepository; // Asegúrate de inyectar el repositorio correcto

    public ArrayList<Rubro> obtenerRubros() {
        return (ArrayList<Rubro>) daoRepository.findAll();
    }

    public Rubro guardarRubro(Rubro rubro) {
        return daoRepository.save(rubro);
    }

    public Optional<Rubro> obtenerPorId(Long id) {
        return daoRepository.findById(id);
    }

    // Puedes agregar otros métodos según tus necesidades

}

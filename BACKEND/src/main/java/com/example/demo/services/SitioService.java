package com.example.demo.services;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity2.Sitio; // Asegúrate de importar la clase Sitio correcta
import com.example.demo.model.repos.DAOSitioCRUD; // Asegúrate de importar el repositorio correcto

@Service
public class SitioService {

    @Autowired
    private DAOSitioCRUD daoRepository; // Asegúrate de inyectar el repositorio correcto

    public ArrayList<Sitio> obtenerSitios() {
        return (ArrayList<Sitio>) daoRepository.findAll();
    }

    public Sitio guardarSitio(Sitio sitio) {
        return daoRepository.save(sitio);
    }

    public Optional<Sitio> obtenerPorId(Long id) {
        return daoRepository.findById(id);
    }

    // Puedes agregar otros métodos según tus necesidades

}

package com.example.demo.services;

import com.example.demo.model.entity2.Comercio;
import com.example.demo.model.entity2.Reclamo;
import com.example.demo.model.repos.DAOComercioCRUD;
import com.example.demo.model.repos.DAOReclamoCRUD;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class ComercioService {
    @Autowired
    private DAOComercioCRUD daoRepository;

    public ArrayList<Comercio> obtenerComercios() {
        return (ArrayList<Comercio>) daoRepository.findAll();
    }

    public Comercio guardarComercio(Comercio comercio) {
        return daoRepository.save(comercio);
    }
    
    public Optional<Comercio> getComerciobyId(Long id) {
    	return daoRepository.findById(id);
    }
}

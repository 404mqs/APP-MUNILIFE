package com.example.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity2.Vecino;
import com.example.demo.model.repos.DAOVecinoCRUD;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class VecinoService {

    private final DAOVecinoCRUD daoRepository;

    @Autowired
    public VecinoService(DAOVecinoCRUD daoRepository) {
        this.daoRepository = daoRepository;
    }

    public ArrayList<Vecino> findAllVecinos() {
        return (ArrayList<Vecino>) daoRepository.findAll();
    }
    

    public Optional<Vecino> findVecinoById(Long id) {
        return daoRepository.findById(id);
    }

    public Vecino saveVecino(Vecino usuario) {
        return daoRepository.save(usuario);
    }

    public void deleteVecinoById(Long id) {
        daoRepository.deleteById(id);
    }

    public long countVecinos() {
        return daoRepository.count();
    }
}

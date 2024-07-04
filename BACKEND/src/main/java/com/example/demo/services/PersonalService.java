package com.example.demo.services;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity2.Personal;
import com.example.demo.model.repos.DAOPersonalCRUD;

@Service
public class PersonalService {

	@Autowired
    private DAOPersonalCRUD daoRepository;
	
	 public ArrayList<Personal> obtenerPersonal() {
	        return (ArrayList<Personal>) daoRepository.findAll();
	    }

	    public Personal guardarPersonal(Personal personal) {
	        return daoRepository.save(personal);
	    }

	    public Optional<Personal> obtenerPorId(Long id) {
	        return daoRepository.findById(id);
	    }

	    public Optional<Personal> obtenerPorDocumento(int documento) {
	        return daoRepository.findByDocumento(documento);
	    }
	    // Puedes agregar otros métodos según tus necesidades

	}

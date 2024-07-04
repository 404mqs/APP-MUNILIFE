package com.example.demo.services;

import com.example.demo.model.entity2.Comercio;
import com.example.demo.model.entity2.FotoReclamo;
import com.example.demo.model.entity2.FotoReclamoDTO;
import com.example.demo.model.entity2.Reclamo;
import com.example.demo.model.entity2.Servicio;
import com.example.demo.model.repos.DAOServicioCRUD;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ServicioService {

	@Autowired
	private DAOServicioCRUD servicioRepository;

	public ArrayList<Servicio> obtenerServicios() {
		return (ArrayList<Servicio>) servicioRepository.findAll();
	}

	public Servicio guardarServicio(Servicio servicio) {
		return servicioRepository.save(servicio);
	}

	public Optional<Servicio> obtenerPorId(Long id) {
		return servicioRepository.findById(id);
	}


}

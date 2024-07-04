package com.example.demo.services;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity2.Desperfecto;
import com.example.demo.model.entity2.FotoReclamo;
import com.example.demo.model.entity2.FotoReclamoDTO;
import com.example.demo.model.entity2.Reclamo;
import com.example.demo.model.entity2.Rubro;
import com.example.demo.model.entity2.Usuario;
import com.example.demo.model.repos.DAOFotoReclamoCRUD;
import com.example.demo.model.repos.DAOReclamoCRUD;

@Service
public class ReclamoService {

	@Autowired
	private DAOReclamoCRUD daoRepository;

	@Autowired
	private DAOFotoReclamoCRUD daoFotoRepository;
	
	public ArrayList<Reclamo> obtenerReclamos() {
		return (ArrayList<Reclamo>) daoRepository.findAll();
	}

	public Reclamo guardarReclamo(Reclamo reclamo) {
		/*if (reclamo.getDepartamento() == null && reclamo.getEspacioComun() == null) {
			throw new IllegalArgumentException("Debe proporcionar al menos un Departamento o un EspacioComun");
		}*/
		return daoRepository.save(reclamo);
	}

	public Optional<Reclamo> obtenerPorId(Long id) {
		return daoRepository.findById(id);
	}

	public ArrayList<Reclamo> obtenerPorDocumento(Usuario usuario) {
	    return daoRepository.findByDocumento(usuario);
	}

	public ArrayList<Reclamo> obtenerPorDesperfecto(ArrayList<Desperfecto> desperfectos) {
        return daoRepository.findByIdDesperfectoIn(desperfectos);
    }
	
	public void actualizarFotoReclamo(FotoReclamoDTO fotoReclamoDTO) {
		
		FotoReclamo foto = new FotoReclamo();
		
		foto.setFoto(fotoReclamoDTO.getFoto());
		foto.setReclamo(obtenerPorId(fotoReclamoDTO.getId()).get());

		daoFotoRepository.save(foto);
    }
	
	public ArrayList<FotoReclamo> obtenerFotosPorReclamo(Reclamo reclamo) {
        return daoFotoRepository.findByReclamo(reclamo);
    }

	/*public boolean eliminarReclamo(Long id) {
		try {
			daoRepository.deleteById(id);
			return true;
		} catch (Exception err) {
			return false;
		}
	}*/
}
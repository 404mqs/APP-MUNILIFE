package com.example.demo.services;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity2.Denuncia; // Asegúrate de importar la clase Denuncia correcta
import com.example.demo.model.entity2.FotoDenuncia;
import com.example.demo.model.entity2.FotoDenunciaDTO;
import com.example.demo.model.entity2.FotoReclamo;
import com.example.demo.model.entity2.Usuario;
import com.example.demo.model.repos.DAODenunciaCRUD; // Asegúrate de importar el repositorio correcto
import com.example.demo.model.repos.DAOFotoDenunciaCRUD;

@Service
public class DenunciaService {

    @Autowired
    private DAODenunciaCRUD daoRepository; // Asegúrate de inyectar el repositorio correcto

    @Autowired
    private DAOFotoDenunciaCRUD daoFotoRepository; // Asegúrate de inyectar el repositorio correcto

    public ArrayList<Denuncia> obtenerDenuncias() {
        return (ArrayList<Denuncia>) daoRepository.findAll();
    }

    public Denuncia guardarDenuncia(Denuncia denuncia) {
        return daoRepository.save(denuncia);
    }

    public Optional<Denuncia> obtenerPorId(Long id) {
        return daoRepository.findById(id);
    }

	public ArrayList<Denuncia> findBydenunciante(Usuario usuario) {
	    return daoRepository.findBydenunciante(usuario);
	}
	
	public void actualizarFotoDenuncia(FotoDenunciaDTO fotoDenunciaDTO) {
		
		FotoDenuncia foto = new FotoDenuncia();
		
		foto.setFoto(fotoDenunciaDTO.getFoto());
		foto.setDenuncia(obtenerPorId(fotoDenunciaDTO.getId()).get());

		daoFotoRepository.save(foto);
    }
	
	public ArrayList<FotoDenuncia> obtenerFotosPorDenuncia(Denuncia denuncia) {
        return daoFotoRepository.findByDenuncia(denuncia);
    }


}

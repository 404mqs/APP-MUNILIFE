package com.example.demo.services;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity2.Denuncia;
import com.example.demo.model.entity2.DenunciaObjetivo; // Asegúrate de importar la clase DenunciaObjetivo correcta
import com.example.demo.model.entity2.Usuario;
import com.example.demo.model.repos.DAODenObjetivoCRUD;

@Service
public class DenObjetivoService {

    @Autowired
    private DAODenObjetivoCRUD daoRepository; // Asegúrate de inyectar el repositorio correcto

    public ArrayList<DenunciaObjetivo> obtenerDenunciaObjetivos() {
        return (ArrayList<DenunciaObjetivo>) daoRepository.findAll();
    }

    public DenunciaObjetivo guardarDenunciaObjetivo(DenunciaObjetivo denunciaObjetivo) {
        return daoRepository.save(denunciaObjetivo);
    }

    public Optional<DenunciaObjetivo> obtenerPorId(Long id) {
        return daoRepository.findById(id);
    }
    
    public ArrayList<DenunciaObjetivo> obtenerPorObjetivoIdYTipo(Long objetivoId, int tipoObjetivo) {
        return daoRepository.findByObjetivoIdAndTipoObjetivo(objetivoId, tipoObjetivo);
    }

	public DenunciaObjetivo obtenerPorDenuncia(Denuncia denuncia) {
        return daoRepository.findByDenuncia(denuncia);

	}
    
    

    // Puedes agregar otros métodos según tus necesidades

}

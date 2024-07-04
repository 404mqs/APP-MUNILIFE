package com.example.demo.model.repos;
import com.example.demo.model.entity2.Denuncia;
import com.example.demo.model.entity2.DenunciaObjetivo;
import com.example.demo.model.entity2.Usuario;

import java.util.ArrayList;

import org.springframework.data.repository.CrudRepository;
public interface DAODenObjetivoCRUD extends CrudRepository<DenunciaObjetivo, Long>{
	
    ArrayList<DenunciaObjetivo> findByObjetivoIdAndTipoObjetivo(Long objetivoId, int tipoObjetivo);

	DenunciaObjetivo findByDenuncia(Denuncia denuncia);

	
}

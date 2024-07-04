package com.example.demo.model.repos;
import com.example.demo.model.entity2.Denuncia;
import com.example.demo.model.entity2.Reclamo;
import com.example.demo.model.entity2.Usuario;

import java.util.ArrayList;

import org.springframework.data.repository.CrudRepository;
public interface DAODenunciaCRUD extends CrudRepository<Denuncia, Long>{
	
    ArrayList<Denuncia> findBydenunciante(Usuario usuario);

    
}

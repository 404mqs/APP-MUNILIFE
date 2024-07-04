package com.example.demo.model.repos;

import java.util.ArrayList;

import org.springframework.data.repository.CrudRepository;

import com.example.demo.model.entity2.Denuncia;
import com.example.demo.model.entity2.FotoDenuncia;

public interface DAOFotoDenunciaCRUD extends CrudRepository<FotoDenuncia, Long> {

    ArrayList<FotoDenuncia> findByDenuncia(Denuncia denuncia);

}

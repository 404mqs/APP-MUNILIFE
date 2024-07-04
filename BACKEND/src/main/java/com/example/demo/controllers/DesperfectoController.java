package com.example.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.entity2.Desperfecto;
import com.example.demo.model.entity2.Sitio;
import com.example.demo.services.DesperfectoService;

@RestController
@RequestMapping("/system")
public class DesperfectoController {
    @Autowired
    private DesperfectoService desperfectoService;

    @GetMapping("/desperfectos")
    public ResponseEntity<List<Desperfecto>> obtenerDesperfectos() {
        List<Desperfecto> defects = desperfectoService.obtenerDesperfectos();
        return new ResponseEntity<>(defects, HttpStatus.OK);
    }
    
    @PostMapping("/desperfectos")
    public ResponseEntity<Desperfecto> crearDesperfecto(@RequestBody Desperfecto desperfecto) {
    	Desperfecto nuevoDesperfecto = desperfectoService.guardarDesperfecto(desperfecto);
        return new ResponseEntity<>(nuevoDesperfecto, HttpStatus.CREATED);
    }
}
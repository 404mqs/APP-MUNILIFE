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


import com.example.demo.model.entity2.Sitio;
import com.example.demo.services.SitioService;

@RestController
@RequestMapping("/system")
public class SitioController {

    @Autowired
    private SitioService sitioService;

    @GetMapping("/sitios")
    public ResponseEntity<List<Sitio>> obtenerSitios() {
        List<Sitio> defects = sitioService.obtenerSitios();
        return new ResponseEntity<>(defects, HttpStatus.OK);
    }
    
    @PostMapping("/sitios")
    public ResponseEntity<Sitio> crearSitio(@RequestBody Sitio sitio) {
        Sitio nuevoSitio = sitioService.guardarSitio(sitio);
        return new ResponseEntity<>(nuevoSitio, HttpStatus.CREATED);
    }
}
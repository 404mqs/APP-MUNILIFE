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

import com.example.demo.model.entity2.Rubro;
import com.example.demo.services.RubroService;



@RestController
@RequestMapping("/system")
public class RubroController {

    @Autowired
    private RubroService rubroService;

    @GetMapping("/rubros")
    public ResponseEntity<List<Rubro>> obtenerRubros() {
        List<Rubro> rubros = rubroService.obtenerRubros();
        return new ResponseEntity<>(rubros, HttpStatus.OK);
    }
    
    @PostMapping("/rubros")
    public ResponseEntity<Rubro> crearRubro(@RequestBody Rubro rubro) {
        Rubro nuevoRubro = rubroService.guardarRubro(rubro);
        return new ResponseEntity<>(nuevoRubro, HttpStatus.CREATED);
    }
}
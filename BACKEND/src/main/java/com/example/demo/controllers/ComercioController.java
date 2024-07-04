package com.example.demo.controllers;


import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.entity2.Comercio;
import com.example.demo.model.entity2.ComercioDTO;
import com.example.demo.model.entity2.Servicio;
import com.example.demo.model.entity2.ServicioDTO;
import com.example.demo.model.entity2.Usuario;
import com.example.demo.services.ComercioService;
import com.example.demo.services.UsuarioService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;

@RestController
@RequestMapping("/system")
public class ComercioController {

    @Autowired
    private ComercioService comercioService;
    
    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/comercios")
    public ResponseEntity<List<Comercio>> getAllComercios() {
        List<Comercio> comercios = comercioService.obtenerComercios();
        if (comercios.isEmpty()) {
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.ok(comercios);
    }

    @GetMapping("/comercios/{id}/foto")
    public ResponseEntity<byte[]> obtenerFotoComercio(@PathVariable Long id) {
        Optional<Comercio> comercioOpt = comercioService.getComerciobyId(id);
        if (!comercioOpt.isPresent() || comercioOpt.get().getFoto() == null) {
            return ResponseEntity.status(404).build();
        }
        
        Comercio comercio = comercioOpt.get();
        byte[] foto = comercio.getFoto();
        
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(foto);
    }

    
    @PostMapping(value = "/comercios")
    public ResponseEntity<Comercio> crearComercio(@RequestBody ComercioDTO comercioDTO, @RequestHeader("Authorization") String token) {
        if (comercioDTO == null || comercioDTO.getNombreComercio() == null || comercioDTO.getDireccion() == null || comercioDTO.getApertura() == null || comercioDTO.getDescripcion() == null) {
            return ResponseEntity.status(400).build();
        }

        String secretKeyBase64 = "sj3+OpYfvZZ2vAZ/KuaDCF0pvOec+PPMCnYFhuXmIA0="; // Reemplaza esto con tu clave secreta real
        SecretKey secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKeyBase64));

        String email;
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token.replace("Bearer ", ""))
                    .getBody();

            email = claims.getSubject();
        } catch (SignatureException e) {
            return ResponseEntity.status(401).build();
        }

        Usuario usuario = usuarioService.findUsuarioByEmail(email).orElse(null);
        if (usuario == null) {
            return ResponseEntity.status(404).build();
        }

        Comercio nuevoComercio = new Comercio();
        nuevoComercio.setDueno_comercio(usuario);
        nuevoComercio.setNombreComercio(comercioDTO.getNombreComercio());
        nuevoComercio.setDescripcion(comercioDTO.getDescripcion());
        nuevoComercio.setApertura(comercioDTO.getApertura());
        nuevoComercio.setDireccion(comercioDTO.getDireccion());
        nuevoComercio.setFoto(null);

        comercioService.guardarComercio(nuevoComercio);

        return ResponseEntity.status(201).body(nuevoComercio);
    }
    
    @PutMapping("/comercios/upd/{id}")
   	public ResponseEntity<Comercio> fotoComercio(@RequestHeader("Authorization") String token, @PathVariable("id") Long id, @RequestBody ComercioDTO comercioDTO) {
   		
   		String secretKeyBase64 = "sj3+OpYfvZZ2vAZ/KuaDCF0pvOec+PPMCnYFhuXmIA0="; // Reemplaza esto con tu clave secreta real
           SecretKey secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKeyBase64));
   		
           String email;
           
           try {
               Claims claims = Jwts.parserBuilder()
                   .setSigningKey(secretKey)
                   .build()
                   .parseClaimsJws(token.replace("Bearer ", ""))
                   .getBody();
               
               email = claims.getSubject();
           } catch (Exception e) {
               // Maneja la excepción apropiadamente
               throw new RuntimeException("Token inválido");
           }
           
           Usuario usuario = usuarioService.findUsuarioByEmail(email).get();
           
   	    try {
   	        // Fetch the existing Reclamo object
   	        Optional<Comercio> existingComercioOptional = comercioService.getComerciobyId(id);

   	        // If the Reclamo object doesn't exist, return an appropriate HTTP status code
   	        if (!existingComercioOptional.isPresent()) {
   	            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
   	        }
   	        
   	        byte[] fotoBytes = Base64.getDecoder().decode(comercioDTO.getFotoBase64());         
      
   	        Comercio existingComercio =  existingComercioOptional.get();
   	        existingComercio.setFoto(fotoBytes);
   	      
            comercioService.guardarComercio(existingComercio);


   	        // Return the updated Reclamo object
   	        return new ResponseEntity<>(existingComercio, HttpStatus.OK);
   	    } catch (Exception e) {
   	        // Log the exception and return an appropriate HTTP status code
   	        return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
   	    }
    }
}

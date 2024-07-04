package com.example.demo.controllers;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.entity2.Comercio;
import com.example.demo.model.entity2.FotoReclamoDTO;
import com.example.demo.model.entity2.MovimientosReclamo;
import com.example.demo.model.entity2.Reclamo;
import com.example.demo.model.entity2.Servicio;
import com.example.demo.model.entity2.ServicioDTO;
import com.example.demo.model.entity2.UpdateReclamoDTO;
import com.example.demo.model.entity2.Usuario;
import com.example.demo.services.ServicioService;
import com.example.demo.services.UsuarioService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;

@RestController
@RequestMapping("/system")
public class ServicioController {

    @Autowired
    private ServicioService servicioService;
    
    @Autowired
	private UsuarioService usuarioService;

    @GetMapping("/servicios")
    public ResponseEntity<List<Servicio>> obtenerServicios() {
    	 List<Servicio> servicios = servicioService.obtenerServicios();
         if (servicios.isEmpty()) {
             return ResponseEntity.status(404).build();
         }
         return ResponseEntity.ok(servicios);
     }

    @PostMapping("/servicios")
    public ResponseEntity<Servicio> crearServicio(@RequestBody ServicioDTO servicioDTO, @RequestHeader("Authorization") String token) {
        if (servicioDTO == null || 
            servicioDTO.getRubro() == null || 
            servicioDTO.getContacto() == null || 
            servicioDTO.getDescripcion() == null || 
            servicioDTO.getNombreServicio() == null) {
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

        Optional<Usuario> usuarioOpt = usuarioService.findUsuarioByEmail(email);
        if (!usuarioOpt.isPresent()) {
            return ResponseEntity.status(404).build();
        }

        Usuario usuario = usuarioOpt.get();

        byte[] fotoBytes = null;
        if (servicioDTO.getFotoBase64() != null && !servicioDTO.getFotoBase64().isEmpty()) {
            try {
                fotoBytes = Base64.getDecoder().decode(servicioDTO.getFotoBase64().split(",")[1]); // Considerando que la cadena Base64 tiene el prefijo 'data:image/jpeg;base64,'
            } catch (IllegalArgumentException e) {
                return null;
            }
        }

        Servicio servicio = new Servicio();
        servicio.setNombre(usuario.getNombre());
        servicio.setApellido(usuario.getApellido());
        servicio.setAutor(usuario);
        servicio.setContacto(servicioDTO.getContacto());
        servicio.setRubro(servicioDTO.getRubro());
        servicio.setNombreServicio(servicioDTO.getNombreServicio());
        servicio.setDescripcion(servicioDTO.getDescripcion());
        servicio.setImagen(fotoBytes);

        Servicio nuevoServicio = servicioService.guardarServicio(servicio);
        return ResponseEntity.status(201).body(nuevoServicio);
    }
    
    @PutMapping("/servicios/upd/{id}")
	public ResponseEntity<Servicio> fotoReclamo(@RequestHeader("Authorization") String token, @PathVariable("id") Long id, @RequestBody ServicioDTO servicioDTO) {
		
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
	        Optional<Servicio> existingReclamoOptional = servicioService.obtenerPorId(id);

	        // If the Reclamo object doesn't exist, return an appropriate HTTP status code
	        if (!existingReclamoOptional.isPresent()) {
	            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	        }
	        
	        byte[] fotoBytes = Base64.getDecoder().decode(servicioDTO.getFotoBase64());
            
           
	        Servicio existingServicio =  existingReclamoOptional.get();
	        existingServicio.setImagen(fotoBytes);
	      
            servicioService.guardarServicio(existingServicio);


	        // Return the updated Reclamo object
	        return new ResponseEntity<>(existingServicio, HttpStatus.OK);
	    } catch (Exception e) {
	        // Log the exception and return an appropriate HTTP status code
	        return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}

 }

    

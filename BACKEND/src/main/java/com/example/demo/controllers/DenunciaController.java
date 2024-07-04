package com.example.demo.controllers;

import java.util.ArrayList;
import java.util.Base64;
import java.util.Optional;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.entity2.Comercio;
import com.example.demo.model.entity2.Denuncia;
import com.example.demo.model.entity2.DenunciaDTO;
import com.example.demo.model.entity2.DenunciaObjetivo;
import com.example.demo.model.entity2.FotoBase64Request;
import com.example.demo.model.entity2.FotoDenuncia;
import com.example.demo.model.entity2.FotoDenunciaDTO;
import com.example.demo.model.entity2.Sitio;
import com.example.demo.model.entity2.Usuario;
import com.example.demo.services.ComercioService;
import com.example.demo.services.DenObjetivoService;
import com.example.demo.services.DenunciaService;
import com.example.demo.services.MovReclamoService;
import com.example.demo.services.PersonalService;
import com.example.demo.services.SitioService;
import com.example.demo.services.UsuarioService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;

@RestController
@RequestMapping("/system")
public class DenunciaController {

	@Autowired
	DenunciaService denunciaService;

	@Autowired
	DenObjetivoService denObjetivoService;

	@Autowired
	MovReclamoService movServices;

	@Autowired
	UsuarioService usuarioService;

	@Autowired
	ComercioService comService;

	@Autowired
	SitioService sitioService;

	@Autowired
	PersonalService personalService;

	@PostMapping("/denuncias")
	public ResponseEntity<String> guardarDenuncia(@RequestBody DenunciaDTO denunciaDTO,
			@RequestHeader("Authorization") String token) {
		// Extraer email del token JWT
		String secretKeyBase64 = "sj3+OpYfvZZ2vAZ/KuaDCF0pvOec+PPMCnYFhuXmIA0="; // Reemplaza esto con tu clave secreta
																					// real
		SecretKey secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKeyBase64));

		String email;
		try {
			Claims claims = Jwts.parserBuilder().setSigningKey(secretKey).build()
					.parseClaimsJws(token.replace("Bearer ", "")).getBody();

			email = claims.getSubject();
		} catch (SignatureException e) {
			return ResponseEntity.status(401).build();
		}

		// Buscar usuario por email
		Optional<Usuario> usuarioOptional = usuarioService.findUsuarioByEmail(email);
		if (!usuarioOptional.isPresent()) {
			return ResponseEntity.status(404).body("Usuario no encontrado");
		}

		// Obtener el nombre de usuario autenticado
		Usuario usuario = usuarioOptional.get();
		Optional<Sitio> sitioOptional = sitioService.obtenerPorId(denunciaDTO.getSitio());
		if (!sitioOptional.isPresent()) {
			return ResponseEntity.status(404).body("Sitio no encontrado");
		}

		Sitio sitio = sitioOptional.get();

		// Crear una nueva entidad Denuncia
		Denuncia denuncia = new Denuncia();
		denuncia.setDenunciante(usuario);
		denuncia.setDescripcion(denunciaDTO.getDescripcion());
		denuncia.setSitio(sitio);
		denuncia.setEstado(1);
		denuncia.setAceptaResponsabilidad(denunciaDTO.isAceptaRespo());

		denunciaService.guardarDenuncia(denuncia);

		// Crear una nueva entidad DenunciaObjetivo
		DenunciaObjetivo objetivo = new DenunciaObjetivo();
		objetivo.setDenuncia(denuncia);

		if (denunciaDTO.getTipoDenuncia() == 1) {
			Optional<Usuario> vecino = usuarioService.findUsuarioById(denunciaDTO.getDenunciado());
			if (!vecino.isPresent()) {
				return ResponseEntity.status(404).body("Vecino no encontrado");
			}
			objetivo.setObjetivoId(vecino.get().getId());
			objetivo.setTipoObjetivo(1); // Tipo de objetivo 'VECINO'

		} else if (denunciaDTO.getTipoDenuncia() == 2) {
			Optional<Comercio> comercio = comService.getComerciobyId(denunciaDTO.getDenunciado());
			if (!comercio.isPresent()) {
				return ResponseEntity.status(404).body("Comercio no encontrado");
			}
			objetivo.setObjetivoId(comercio.get().getIdComercio());
			objetivo.setTipoObjetivo(2); // Tipo de objetivo 'COMERCIO'
		} else {
			return ResponseEntity.status(400).body(null);
		}

		denObjetivoService.guardarDenunciaObjetivo(objetivo);

		return ResponseEntity.status(HttpStatus.CREATED).body("Denuncia guardada exitosamente");
	}

	@GetMapping("/misdenuncias")
	public ArrayList<Denuncia> obtenerMisDenuncias(@RequestHeader("Authorization") String token) {
		String secretKeyBase64 = "sj3+OpYfvZZ2vAZ/KuaDCF0pvOec+PPMCnYFhuXmIA0="; // Reemplaza esto con tu clave secreta
																					// real
		SecretKey secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKeyBase64));

		String email;
		try {
			Claims claims = Jwts.parserBuilder().setSigningKey(secretKey).build()
					.parseClaimsJws(token.replace("Bearer ", "")).getBody();

			email = claims.getSubject();
		} catch (Exception e) {
			// Maneja la excepción apropiadamente
			throw new RuntimeException("Token inválido");
		}

		// Buscar usuario por email
		Usuario usuario = usuarioService.findUsuarioByEmail(email).get();
		// Obtener los reclamos del usuario por email
		return denunciaService.findBydenunciante(usuario);

	}

	@GetMapping("/denunciaobjetivo/{id}")
	public DenunciaObjetivo obtenerDenunciado(@PathVariable("id") Long id, @RequestHeader("Authorization") String token) {
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
	Denuncia denuncia = denunciaService.obtenerPorId(id).get();
	DenunciaObjetivo objetivo = denObjetivoService.obtenerPorDenuncia(denuncia);

	// Obtener los reclamos del usuario por email

	return objetivo;

	}

	@GetMapping("/fuidenunciado")
	public ArrayList<DenunciaObjetivo> obtenerDenunciasHaciaMi(@RequestHeader("Authorization") String token) {
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

	    // Buscar usuario por email
	    Usuario usuario = usuarioService.findUsuarioByEmail(email)
	        .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

	    // Obtener las denuncias del usuario por ID y tipo de objetivo
	    int tipoObjetivoUsuario = 1; // Asumiendo que 1 es el tipo para "Usuario"
	    return denObjetivoService.obtenerPorObjetivoIdYTipo(usuario.getId(), tipoObjetivoUsuario);
	}
	
	@PostMapping("/denuncias/subir-foto-base64/{id}")
    public ResponseEntity<?> subirFotoBase64(@RequestBody FotoBase64Request request, @RequestHeader("Authorization") String token, @PathVariable("id") Long id) {
        String secretKeyBase64 = "sj3+OpYfvZZ2vAZ/KuaDCF0pvOec+PPMCnYFhuXmIA0="; // Reemplaza esto con tu clave secreta real
        SecretKey secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKeyBase64));

        // Extraer email del token JWT
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

        if (email != null && !email.isEmpty() && request.getFotoBase64() != null && !request.getFotoBase64().isEmpty()) {
            try {
            	
                byte[] fotoBytes = Base64.getDecoder().decode(request.getFotoBase64());
                
                FotoDenunciaDTO fotoDenunciaDTO = new FotoDenunciaDTO();
                fotoDenunciaDTO.setFoto(fotoBytes);
                fotoDenunciaDTO.setEmail(id);
                
                denunciaService.actualizarFotoDenuncia(fotoDenunciaDTO);
                

                return ResponseEntity.ok("Foto de reclamo agregada correctamente");
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Formato de base64 inválido");
            } catch (RuntimeException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email y foto son requeridos");
    }
	
	 @GetMapping(path = "/denuncias/fotos/{id}")
		public ResponseEntity<ArrayList<FotoDenuncia>> denuncia_fotos(@RequestHeader("Authorization") String token, @PathVariable("id") Long id) {
	    	
	    	 String secretKeyBase64 = "sj3+OpYfvZZ2vAZ/KuaDCF0pvOec+PPMCnYFhuXmIA0="; // Reemplaza esto con tu clave secreta real
	         SecretKey secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKeyBase64));

	         // Extraer email del token JWT
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

	         // Buscar usuario por email
	         Optional<Usuario> usuarioOptional = usuarioService.findUsuarioByEmail(email);
	         if (!usuarioOptional.isPresent()) {
	             return ResponseEntity.status(404).build();
	         }
	         
	         ArrayList<FotoDenuncia> resp = denunciaService.obtenerFotosPorDenuncia(denunciaService.obtenerPorId(id).get());

		        
		     return new ResponseEntity<>(resp, HttpStatus.OK);
	         
	         
		}

}

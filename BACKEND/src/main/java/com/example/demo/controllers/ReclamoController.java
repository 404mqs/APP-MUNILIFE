package com.example.demo.controllers;

import java.time.LocalDateTime;
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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.entity2.Desperfecto;
import com.example.demo.model.entity2.FotoBase64Request;
import com.example.demo.model.entity2.FotoReclamo;
import com.example.demo.model.entity2.FotoReclamoDTO;
import com.example.demo.model.entity2.MovimientosReclamo;
import com.example.demo.model.entity2.Personal;
import com.example.demo.model.entity2.Reclamo;
import com.example.demo.model.entity2.ReclamoDTO;
import com.example.demo.model.entity2.Sitio;
import com.example.demo.model.entity2.UpdateReclamoDTO;
import com.example.demo.model.entity2.Usuario;
import com.example.demo.services.DesperfectoService;
import com.example.demo.services.MovReclamoService;
import com.example.demo.services.PersonalService;
import com.example.demo.services.ReclamoService;
import com.example.demo.services.SitioService;
import com.example.demo.services.UsuarioService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;

@RestController
@RequestMapping("/system")
public class ReclamoController {

	@Autowired
	ReclamoService reclamoService;
	
	@Autowired
	MovReclamoService movServices;

	@Autowired
	UsuarioService usuarioService;
	
	@Autowired
	DesperfectoService despService;
	
	@Autowired
	SitioService sitioService;
	
	@Autowired
	PersonalService personalService;
	
	
	@GetMapping("/reclamos")
	public ArrayList<Reclamo> obtenerReclamos() {
		return reclamoService.obtenerReclamos();
	}

	@GetMapping(path = "reclamos/{id}")
	public Optional<Reclamo> obtenerReclamoId(@PathVariable("id") Long id, @RequestHeader("Authorization") String token) {
		return this.reclamoService.obtenerPorId(id);
	}

	/*@PostMapping("/reclamos")
	public ResponseEntity<Reclamo> generarReclamo(@RequestBody Reclamo reclamo) {
		if (reclamo == null || reclamo.getDescripcion() == null || reclamo.getSitio() == null || reclamo.getDesperfecto() == null) {
			return ResponseEntity.status(400).build();
		}
		Reclamo nuevoReclamo = reclamoService.guardarReclamo(reclamo);
		return ResponseEntity.status(201).body(nuevoReclamo);
	}*/

	@GetMapping("/misreclamos")
	public ArrayList<Reclamo> obtenerMisReclamos(@RequestHeader("Authorization") String token) {
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
	        Usuario usuario = usuarioService.findUsuarioByEmail(email).get();
	        // Obtener los reclamos del usuario por email
	        return reclamoService.obtenerPorDocumento(usuario);
	}
	
	@GetMapping("/reclamos/inspector")
	public ArrayList<Reclamo> obtReclamosInspector(@RequestHeader("Authorization") String token) {
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
	        Usuario usuario = usuarioService.findUsuarioByEmail(email).get();
	        //	 Obtener los reclamos del usuario por email
	        
	        Personal inspector = personalService.obtenerPorDocumento(usuario.getDni()).get();
	        
	        ArrayList<Desperfecto> desperfecto = despService.obtenerPorRubro(inspector.getSector());
	        
	        return reclamoService.obtenerPorDesperfecto(desperfecto);
	        
	} 
	
	@PutMapping("/reclamos/upd/{id}")
	public ResponseEntity<Reclamo> actualizarEstadoReclamo(@RequestHeader("Authorization") String token, @PathVariable("id") Long id, @RequestBody UpdateReclamoDTO uReclamoDTO) {
		
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
	        Optional<Reclamo> existingReclamoOptional = reclamoService.obtenerPorId(id);

	        // If the Reclamo object doesn't exist, return an appropriate HTTP status code
	        if (!existingReclamoOptional.isPresent()) {
	            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	        }

	        // Use get() to retrieve the Reclamo object from the Optional
	        Reclamo existingReclamo = existingReclamoOptional.get();

	        existingReclamo.setEstado(uReclamoDTO.getEstado());

	        reclamoService.guardarReclamo(existingReclamo);
	        
	        MovimientosReclamo mov = new MovimientosReclamo();
	        
	        mov.setCausa(uReclamoDTO.getCausa()); 
	        mov.setEstado(uReclamoDTO.getEstado());
	        mov.setFecha(LocalDateTime.now().toString());
	        mov.setReclamo(existingReclamoOptional.get());
	        mov.setResponsable(usuario.getNombre() + " " +usuario.getApellido());
	        
	        movServices.guardar(mov);

	        // Return the updated Reclamo object
	        return new ResponseEntity<>(existingReclamo, HttpStatus.OK);
	    } catch (Exception e) {
	        // Log the exception and return an appropriate HTTP status code
	        return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}

	@GetMapping("/reclamos/his/{id}")
	public ResponseEntity<ArrayList<MovimientosReclamo>> obtenerEstadosReclamo(@RequestHeader("Authorization") String token, @PathVariable("id") Long id) {
		
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
	        Optional<Reclamo> existingReclamoOptional = reclamoService.obtenerPorId(id);

	        // If the Reclamo object doesn't exist, return an appropriate HTTP status code
	        if (!existingReclamoOptional.isPresent()) {
	            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	        }

	        // Use get() to retrieve the Reclamo object from the Optional
	        Reclamo existingReclamo = existingReclamoOptional.get();

	        ArrayList<MovimientosReclamo> resp = movServices.obtenerPorReclamo(existingReclamo);
	        
	        return new ResponseEntity<>(resp, HttpStatus.OK);
	    } catch (Exception e) {
	        // Log the exception and return an appropriate HTTP status code
	        return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
	@PostMapping("/reclamos")
    public ResponseEntity<Reclamo> generarReclamo(@RequestBody ReclamoDTO reclamoDTO, @RequestHeader("Authorization") String token) {
        // Validar reclamo
        if (reclamoDTO == null || reclamoDTO.getDescripcion() == null || reclamoDTO.getSitio() == null || reclamoDTO.getTipo() == null) {
            return ResponseEntity.status(400).build();
        }

        // Extraer email del token JWT
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
        Usuario usuario = usuarioOptional.get();
        
        Sitio sitio = sitioService.obtenerPorId(reclamoDTO.getSitio()).get();
        Desperfecto desperfecto = despService.obtenerPorId(reclamoDTO.getTipo()).get();
        
        
		Reclamo reclamo = new Reclamo();
        reclamo.setDenunciante(usuario);
        reclamo.setDescripcion(reclamoDTO.getDescripcion());
        reclamo.setDesperfecto(desperfecto);
        reclamo.setEstado(1);
        reclamo.setSitio(sitio);

        // Guardar reclamo
        Reclamo nuevoReclamo = reclamoService.guardarReclamo(reclamo);
        return ResponseEntity.status(201).body(nuevoReclamo);
    }
	
	@PostMapping("/reclamos/subir-foto-base64/{id}")
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
                
                FotoReclamoDTO fotoReclamoDTO = new FotoReclamoDTO();
                fotoReclamoDTO.setFoto(fotoBytes);
                fotoReclamoDTO.setEmail(id);
                
                reclamoService.actualizarFotoReclamo(fotoReclamoDTO);
                

                return ResponseEntity.ok("Foto de reclamo agregada correctamente");
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Formato de base64 inválido");
            } catch (RuntimeException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email y foto son requeridos");
    }
	
	 @GetMapping(path = "/reclamos/fotos/{id}")
		public ResponseEntity<ArrayList<FotoReclamo>> reclamo_fotos(@RequestHeader("Authorization") String token, @PathVariable("id") Long id) {
	    	
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
	         
	         ArrayList<FotoReclamo> resp = reclamoService.obtenerFotosPorReclamo(reclamoService.obtenerPorId(id).get());

		        
		     return new ResponseEntity<>(resp, HttpStatus.OK);
	         
	         
		}

	
	
	/*@PostMapping("/reclamos")
	public ResponseEntity<?> guardarReclamo(@RequestBody ReclamoDTO reclamoDTO) {
		if(reclamoDTO.getUsuario() != null && reclamoDTO.getDescripcion() != null && reclamoDTO.getSitio() != null){

		}
	}*/

	/*@PostMapping("/reclamos/deptos")
	public ResponseEntity<?> guardarReclamo(@RequestBody ReclamoDTO reclamoDTO) {
		// Verificar si el reclamo tiene un usuario, depto, y edificio
		if (reclamoDTO.getUsuario() != null && reclamoDTO.getDepartamento() != null
				&& reclamoDTO.getEdificio() != null) {

			Optional<Edificio> edificioOptional = edificioService.findById(reclamoDTO.getEdificio());
			Optional<Usuario> usuarioOptional = usuarioService.obtenerPorId(reclamoDTO.getUsuario());
			Optional<Departamento> deptoOptional = departamentoService.obtenerPorId(reclamoDTO.getDepartamento());

			// Verificación 1: El DEPTO pertenece al edificio y al usuario
			if (deptoOptional.isPresent() && edificioOptional.isPresent() && usuarioOptional.isPresent()) {
				Departamento departamento = deptoOptional.get();
				Edificio edificio = edificioOptional.get();
				Usuario usuario = usuarioOptional.get();

				if (departamento.getEdificio().getIdEdificio().equals(edificio.getIdEdificio())
	                    && (departamento.getPropietario().getId().equals(usuario.getId())
	                            || departamento.getInquilinos().contains(usuario))) {

					Reclamo reclamo = RDEPTOconvertToEntity(reclamoDTO);
					reclamo.setEdificio(edificio);
					reclamo.setUsuario(usuario);
					reclamo.setDepartamento(departamento);
					reclamoService.guardarReclamo(reclamo);
					usuario.agregarReclamo(reclamo);
					departamento.agregarReclamo(reclamo);
					departamentoService.guardarEspacioComun(departamento);
					usuarioService.guardarEspacioComun(usuario);
					ReclamoDTO nuevoReclamoDTO = RDEPTOconvertToDTO(reclamo);

					return new ResponseEntity<>(nuevoReclamoDTO, HttpStatus.CREATED);
				} else {
					return new ResponseEntity<>(
							"El edificio, el propietario o el usuario no pueden ser nulos o el usuario no está en el edificio",
							HttpStatus.BAD_REQUEST);
				}
			} else {
				// Agregar el retorno para este caso
				return new ResponseEntity<>(
						"Al menos uno de los elementos (usuario, departamento, espacio común) no fue encontrado",
						HttpStatus.BAD_REQUEST);
			}
		} else {
			// Manejar la situación de error si el usuario o el departamento es nulo
			return new ResponseEntity<>("El usuario y el departamento o espacio común deben ser proporcionados",
					HttpStatus.BAD_REQUEST);
		}
	}

	@PostMapping("/reclamos/espacioscomunes")
	public ResponseEntity<?> guardarReclamo2(@RequestBody ReclamoDTO reclamoDTO) {
		// Verificar si el reclamo tiene un usuario, depto, y edificio
		if (reclamoDTO.getEspacioComun() != null && reclamoDTO.getEdificio() != null) {

			Optional<Edificio> edificioOptional = edificioService.findById(reclamoDTO.getEdificio());
			Optional<EspacioComun> espacioOptional = espacioComunService.obtenerPorId((reclamoDTO.getEspacioComun()));
			Optional<Usuario> usuarioOptional = usuarioService.obtenerPorId(reclamoDTO.getUsuario());

			// Verificación 1: El DEPTO pertenece al edificio y al usuario
			if (espacioOptional.isPresent() && edificioOptional.isPresent() && usuarioOptional.isPresent()) {
				Edificio edificio = edificioOptional.get();
				EspacioComun espacio = espacioOptional.get();
				Usuario usuario = usuarioOptional.get();

				if (espacio.getEdificio().getIdEdificio().equals(edificio.getIdEdificio())
						&& usuario.getEdificio().getIdEdificio().equals(edificio.getIdEdificio())) {

					Reclamo reclamo = RESPconvertToEntity(reclamoDTO);
					reclamo.setEdificio(edificio);
					reclamo.setUsuario(usuario);
					reclamo.setEspacioComun(espacio);
					reclamoService.guardarReclamo(reclamo);
					usuario.agregarReclamo(reclamo);
					espacio.agregarReclamo(reclamo);
					espacioComunService.guardarEspacioComun(espacio);
					usuarioService.guardarEspacioComun(usuario);
					ReclamoDTO nuevoReclamoDTO = RESPconvertToDTO(reclamo);

					return new ResponseEntity<>(nuevoReclamoDTO, HttpStatus.CREATED);
				} else {
					return new ResponseEntity<>(
							"El edificio, el propietario o el usuario no pueden ser nulos o el usuario no está en el edificio",
							HttpStatus.BAD_REQUEST);
				}
			} else {
				// Agregar el retorno para este caso
				return new ResponseEntity<>(
						"Al menos uno de los elementos (usuario, departamento, espacio común) no fue encontrado",
						HttpStatus.BAD_REQUEST);
			}
		} else {
			// Manejar la situación de error si el usuario o el departamento es nulo
			return new ResponseEntity<>("El usuario y el departamento o espacio común deben ser proporcionados",
					HttpStatus.BAD_REQUEST);
		}
	}

	@DeleteMapping(path = "/reclamos/{id}/delete")
	public ResponseEntity<String> eliminarReclamo(@PathVariable("id") Long id) {
	    try {
	        reclamoService.eliminarReclamo(id);
	        String mensaje = "Reclamo eliminado exitosamente";
	        return ResponseEntity.ok(mensaje);
	    } catch (Exception e) {
	        // Manejar excepciones si es necesario y devolver un ResponseEntity con un mensaje de error
	        String mensajeError = "Error al eliminar el reclamo: " + e.getMessage();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(mensajeError);
	    }
	}
	@PutMapping("/reclamos/{id}")
	public ResponseEntity<Reclamo> actualizarReclamo(@PathVariable("id") Long id, @RequestBody Reclamo nuevoReclamo) {
	    try {
	        // Fetch the existing Reclamo object
	        Optional<Reclamo> existingReclamoOptional = reclamoService.obtenerPorId(id);

	        // If the Reclamo object doesn't exist, return an appropriate HTTP status code
	        if (!existingReclamoOptional.isPresent()) {
	            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	        }

	        // Use get() to retrieve the Reclamo object from the Optional
	        Reclamo existingReclamo = existingReclamoOptional.get();

	        // Update the existing Reclamo object with the new data (if not null in the JSON)
	        if (nuevoReclamo.getDescripcion() != null) {
	            existingReclamo.setDescripcion(nuevoReclamo.getDescripcion());
	        }
	        if (nuevoReclamo.getFoto() != null) {
	            existingReclamo.setFoto(nuevoReclamo.getFoto());
	        }
	        if (nuevoReclamo.getEstadoReclamo() != null) {
	            existingReclamo.setEstadoReclamo(nuevoReclamo.getEstadoReclamo());
	        }
	        // Update other fields as needed

	        // Save the updated Reclamo object to the database
	        reclamoService.guardarReclamo(existingReclamo);

	        // Return the updated Reclamo object
	        return new ResponseEntity<>(existingReclamo, HttpStatus.OK);
	    } catch (Exception e) {
	        // Log the exception and return an appropriate HTTP status code
	        return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
	@PostMapping("/reclamos/{id}/foto")
	public ResponseEntity<?> subirFoto(@PathVariable("id") Long id, @RequestParam("foto") MultipartFile foto) {
	   Optional<Reclamo> reclamoOptional = reclamoService.obtenerPorId(id);
	   if (reclamoOptional.isPresent()) {
	       Reclamo reclamo = reclamoOptional.get();
	       try {
	           reclamo.setFoto(foto.getBytes());
	           reclamoService.guardarReclamo(reclamo);
	           return new ResponseEntity<>(HttpStatus.OK);
	       } catch (IOException e) {
	           return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	       }
	   } else {
	       return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	   }
	}
	
	@GetMapping("/reclamos/{id}/foto")
	public ResponseEntity<?> obtenerFoto(@PathVariable("id") Long id) {
	   Optional<Reclamo> reclamoOptional = reclamoService.obtenerPorId(id);
	   if (reclamoOptional.isPresent()) {
	       Reclamo reclamo = reclamoOptional.get();
	       return ResponseEntity.ok()
	               .contentType(MediaType.IMAGE_JPEG)
	               .body(reclamo.getFoto());
	   } else {
	       return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	   }
	}
	
	@DeleteMapping("/reclamos/{id}/foto")
	public ResponseEntity<?> borrarFoto(@PathVariable("id") Long id) {
	  Optional<Reclamo> reclamoOptional = reclamoService.obtenerPorId(id);
	  if (reclamoOptional.isPresent()) {
	      Reclamo reclamo = reclamoOptional.get();
	      reclamo.setFoto(null);
	      reclamoService.guardarReclamo(reclamo);
	      return new ResponseEntity<>(HttpStatus.OK);
	  } else {
	      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	  }
	}

	public Reclamo RDEPTOconvertToEntity(ReclamoDTO reclamoDTO) {
		Reclamo reclamo = new Reclamo();
		reclamo.setDescripcion(reclamoDTO.getDescripcion());
		reclamo.setEstadoReclamo("Pendiente a responder");
		reclamo.setEspacioComun(null);
		reclamo.setRespuesta(null);

		Long idDepartamento = reclamoDTO.getDepartamento();

		Optional<Departamento> departamento = departamentoService.obtenerPorId(idDepartamento);

		reclamo.setDepartamento(departamento.get());

		Long usuarioId = reclamoDTO.getUsuario();

		Optional<Usuario> propietario = usuarioService.obtenerPorId(usuarioId);

		reclamo.setUsuario(propietario.get());

		Long edificioId = reclamoDTO.getEdificio();

		Optional<Edificio> edificio = edificioService.findById(edificioId);

		reclamo.setEdificio(edificio.get());
		
		return reclamo;
	}

	public Reclamo RESPconvertToEntity(ReclamoDTO reclamoDTO) {
		Reclamo reclamo = new Reclamo();
		reclamo.setDescripcion(reclamoDTO.getDescripcion());
		reclamo.setEstadoReclamo("Pendiente a responder");
		reclamo.setDepartamento(null);
		reclamo.setRespuesta(null);

		Long idEspacio = reclamoDTO.getEspacioComun();

		Optional<EspacioComun> espacio = espacioComunService.obtenerPorId(idEspacio);

		reclamo.setEspacioComun(espacio.get());

		Long usuarioId = reclamoDTO.getUsuario();

		Optional<Usuario> propietario = usuarioService.obtenerPorId(usuarioId);

		reclamo.setUsuario(propietario.get());

		Long edificioId = reclamoDTO.getEdificio();

		Optional<Edificio> edificio = edificioService.findById(edificioId);

		reclamo.setEdificio(edificio.get());

		return reclamo;
	}

	public ReclamoDTO RDEPTOconvertToDTO(Reclamo reclamo) {
		ReclamoDTO reclamoDTO = new ReclamoDTO();
		reclamoDTO.setDepartamento(reclamo.getDepartamento().getId());
		reclamoDTO.setDescripcion(reclamo.getDescripcion());
		reclamoDTO.setEdificio(reclamo.getEdificio().getIdEdificio());
		reclamoDTO.setEspacioComun(null);
		reclamoDTO.setRespuesta(null);
		reclamoDTO.setUsuario(reclamo.getUsuario().getId());

		return reclamoDTO;
	}

	public ReclamoDTO RESPconvertToDTO(Reclamo reclamo) {
		ReclamoDTO reclamoDTO = new ReclamoDTO();
		reclamoDTO.setDepartamento(null);
		reclamoDTO.setDescripcion(reclamo.getDescripcion());
		reclamoDTO.setEdificio(reclamo.getEdificio().getIdEdificio());
		reclamoDTO.setEspacioComun(reclamo.getEspacioComun().getId());
		reclamoDTO.setRespuesta(null);
		reclamoDTO.setUsuario(reclamo.getUsuario().getId());

		return reclamoDTO;
	}*/


}
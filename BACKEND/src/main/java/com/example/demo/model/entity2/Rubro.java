package com.example.demo.model.entity2;

import java.time.LocalTime;

import jakarta.persistence.*;

@Entity
@Table(name = "Rubro")
public class Rubro {
    
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
    private Long idRubro;

    @Column(name="descripcion")
    private String descripcion;

    // Getters y setters
    
    public Rubro(Long idRubro, String descripcion) {
    	super();
        this.descripcion = descripcion;
        this.idRubro = idRubro;
    }
    
 // Constructor que acepta un valor entero
    public Rubro(Long idRubro) {
        this.idRubro = idRubro;
    }
    
    public Rubro() {
    	
    }
    

    public Long getIdRubro() {
        return idRubro;
    }

    public void setIdRubro(Long idRubro) {
        this.idRubro = idRubro;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}

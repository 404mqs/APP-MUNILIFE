package com.example.demo.model.entity2;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Entity
@Table(name = "Personal")
public class Personal {

    @Id
    @Column(name = "legajo", nullable = false)
    private Long legajo;

    private String nombre;
    private String apellido;
    private String categoria;
    private int documento;
    private String password;

    @ManyToOne
    @JoinColumn(name = "sector", referencedColumnName = "id")
    private Rubro sector;

    @Column(name = "fechaIngreso")
    private String fechaIngreso;

    // Getters y setters

    public Long getLegajo() {
        return legajo;
    }

    public void setLegajo(Long legajo) {
        this.legajo = legajo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public int getDocumento() {
        return documento;
    }

    public void setDocumento(int documento) {
        this.documento = documento;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Rubro getSector() {
        return sector;
    }

    public void setSector(Rubro sector) {
        this.sector = sector;
    }

    public String getFechaIngreso() {
        return fechaIngreso;
    }

    public void setFechaIngreso(String fechaIngreso) {
        this.fechaIngreso = fechaIngreso;
    }

	public String getCategoria() {
		return categoria;
	}

	public void setCategoria(String categoria) {
		this.categoria = categoria;
	}
}
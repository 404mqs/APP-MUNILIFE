package com.example.demo.model.entity2;

import java.util.HashSet;
import java.util.Random;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "Reclamo")
public class Reclamo {

	@Id
	@Column(name = "id", nullable = false)
	private Integer idReclamo;
	
	private static HashSet<Integer> idsGenerados = new HashSet<>();

    @PrePersist
    public void onPrePersist() {
        Random rand = new Random();
        int nuevoId;
        do {
            nuevoId = 1000 + rand.nextInt(9000); // Esto generará un número aleatorio de 4 dígitos.
        } while(idsGenerados.contains(nuevoId));
        idReclamo = nuevoId;
        idsGenerados.add(nuevoId);
    }

	@ManyToOne
	@JoinColumn(name = "usuario_id", referencedColumnName = "id")
	private Usuario documento;

	@ManyToOne
	@JoinColumn(name = "sitio_id", referencedColumnName = "id")
	private Sitio idSitio;

	@ManyToOne
	@JoinColumn(name = "despefecto_id", referencedColumnName = "id")
	private Desperfecto idDesperfecto;

	private String descripcion;

	private int estado;
	

	@ManyToOne
	@JoinColumn(name = "personal_id", referencedColumnName = "legajo")
	private Personal legajo;

	public Reclamo() {
	}

	public Reclamo(Integer idReclamo, Usuario documento, Sitio idSitio, Desperfecto idDesperfecto, String descripcion,
			int estado, Personal legajo) {
		super();
		this.idReclamo = idReclamo;
		this.documento = documento;
		this.idSitio = idSitio;
		this.idDesperfecto = idDesperfecto;
		this.descripcion = descripcion;
		this.estado = estado;
		this.legajo = legajo;
	}

	public Integer getIdReclamo() {
		return idReclamo;
	}

	public void setIdReclamo(Integer idReclamo) {
		this.idReclamo = idReclamo;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public Sitio getSitio() {
		return idSitio;
	}

	public void setSitio(Sitio idSitio) {
		this.idSitio = idSitio;
	}

	public int getEstado() {
		return estado;
	}

	public void setEstado(int estado) {
		this.estado = estado;
	}

	public Desperfecto getDesperfecto() {
		return idDesperfecto;
	}

	public void setDesperfecto(Desperfecto desperfecto) {
		this.idDesperfecto = desperfecto;
	}

	public Usuario getDenunciante() {
		return documento;
	}

	public void setDenunciante(Usuario denunciante) {
		this.documento = denunciante;
	}

}

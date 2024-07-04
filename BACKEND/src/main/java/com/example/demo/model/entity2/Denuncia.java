package com.example.demo.model.entity2;

import com.example.demo.model.entity2.Usuario;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "Denuncia")
public class Denuncia {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@PrimaryKeyJoinColumn
	@Column(name="id", nullable=false)
	private Long idDenuncia;
	
	@ManyToOne
    @JoinColumn(name = "usuario_id", referencedColumnName = "id")
	private Usuario denunciante;
	
	@ManyToOne
    @JoinColumn(name = "sitio_id", referencedColumnName = "id")
	private Sitio idSitio;
		
	private int estado;
	
	private String descripcion;

	private boolean aceptaResponsabilidad;


	public Long getIdDenuncia() {
		return idDenuncia;
	}

	public void setIdDenuncia(Long idDenuncia) {
		this.idDenuncia = idDenuncia;
	}


	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}


	public Usuario getDenunciante() {
		return denunciante;
	}

	public void setDenunciante(Usuario denunciante) {
		this.denunciante = denunciante;
	}

	public Sitio getSitio() {
		return idSitio;
	}

	public void setSitio(Sitio sitio) {
		this.idSitio = sitio;
	}

	public int getEstado() {
		return estado;
	}

	public void setEstado(int estado) {
		this.estado = estado;
	}

	public boolean isAceptaResponsabilidad() {
		return aceptaResponsabilidad;
	}

	public void setAceptaResponsabilidad(boolean aceptaResponsabilidad) {
		this.aceptaResponsabilidad = aceptaResponsabilidad;
	}

	public Denuncia(Long idDenuncia, Usuario denunciante, Sitio sitio, int estado, String descripcion,
			boolean aceptaResponsabilidad) {
		super();
		this.idDenuncia = idDenuncia;
		this.denunciante = denunciante;
		this.idSitio = sitio;
		this.estado = estado;
		this.descripcion = descripcion;
		this.aceptaResponsabilidad = aceptaResponsabilidad;
	}

	public Denuncia() {
		super();
	}

}





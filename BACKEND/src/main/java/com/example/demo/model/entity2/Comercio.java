package com.example.demo.model.entity2;

import java.util.Arrays;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "Comercio")
public class Comercio {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@PrimaryKeyJoinColumn
	@Column(name="id", nullable=false)
	private Long idComercio;
		
	private String nombreComercio;
	
	private String direccion;
	
	private String apertura;
	
	private String descripcion;

	@Lob
	@Column(columnDefinition = "LONGBLOB")
	private byte[] foto;
	
	@ManyToOne
    @JoinColumn(name = "usuario_id", referencedColumnName = "id")
	@JsonIgnore
	private Usuario dueno_comercio;

	public Long getIdComercio() {
		return idComercio;
	}

	public void setIdComercio(Long idComercio) {
		this.idComercio = idComercio;
	}

	public String getNombreComercio() {
		return nombreComercio;
	}

	public void setNombreComercio(String nombreComercio) {
		this.nombreComercio = nombreComercio;
	}

	public String getDireccion() {
		return direccion;
	}

	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}

	public String getApertura() {
		return apertura;
	}

	public void setApertura(String apertura) {
		this.apertura = apertura;
	}

	public byte[] getFoto() {
		return foto;
	}

	public void setFoto(byte[] foto) {
		this.foto = foto;
	}

	public Usuario getDueno_comercio() {
		return dueno_comercio;
	}

	public void setDueno_comercio(Usuario dueno_comercio) {
		this.dueno_comercio = dueno_comercio;
	}

	@Override
	public String toString() {
		return "Comercio [idComercio=" + idComercio + ", nombreComercio=" + nombreComercio + ", direccion=" + direccion
				+ ", apertura=" + apertura + ", foto=" + Arrays.toString(foto) + ", dueno_comercio=" + dueno_comercio
				+ "]";
	}

	public Comercio(Long idComercio, String nombreComercio, String direccion, String apertura, byte[] foto,
			Usuario dueno_comercio) {
		super();
		this.idComercio = idComercio;
		this.nombreComercio = nombreComercio;
		this.direccion = direccion;
		this.apertura = apertura;
		this.foto = foto;
		this.dueno_comercio = dueno_comercio;
	}

	public Comercio() {
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

}




/*

ID - int (pk)

NombreComercio - string

Descripcion - string

Direccion - string

Apertura - string

Clausura - string

Imagen - foto

Autor - string (FK de usuario)


*/
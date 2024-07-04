package com.example.demo.model.entity2;

public class ReclamoDTO {

	private Long sitio;
	private Long tipo;
	private String descripcion;
	private String foto;
	private int estado;


	public ReclamoDTO() {
		super();
		// TODO Auto-generated constructor stub
	}


	public Long getSitio() {
		return sitio;
	}


	public void setSitio(Long sitio) {
		this.sitio = sitio;
	}


	public Long getTipo() {
		return tipo;
	}


	public void setTipo(Long tipo) {
		this.tipo = tipo;
	}


	public String getDescripcion() {
		return descripcion;
	}


	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}


	public String getFoto() {
		return foto;
	}


	public void setFoto(String foto) {
		this.foto = foto;
	}


	public ReclamoDTO(Long usuario, Long sitio, Long tipo, String descripcion, String foto) {
		super();
		this.sitio = sitio;
		this.tipo = tipo;
		this.descripcion = descripcion;
		this.foto = foto;
	}


	public int getEstado() {
		return estado;
	}


	public void setEstado(int estado) {
		this.estado = estado;
	}




}
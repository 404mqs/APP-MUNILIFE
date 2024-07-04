package com.example.demo.model.entity2;

public class DenunciaDTO {

	private String descripcion;
	private Long sitio;
	private boolean aceptaRespo;
	private int tipoDenuncia;
	private Long denunciado;

	// Constructor vacío (puedes agregar otros constructores según tus necesidades)
	public DenunciaDTO() {
	}

	// Getters y setters (puedes generarlos automáticamente en tu IDE)
	public Long getDenunciado() {
		return denunciado;
	}

	public void setDenunciado(Long denunciado) {
		this.denunciado = denunciado;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public Long getSitio() {
		return sitio;
	}

	public void setSitio(Long sitio) {
		this.sitio = sitio;
	}

	public boolean isAceptaRespo() {
		return aceptaRespo;
	}

	public void setAceptaRespo(boolean aceptaRespo) {
		this.aceptaRespo = aceptaRespo;
	}

	public int getTipoDenuncia() {
		return tipoDenuncia;
	}

	public void setTipoDenuncia(int tipoDenuncia) {
		this.tipoDenuncia = tipoDenuncia;
	}

}

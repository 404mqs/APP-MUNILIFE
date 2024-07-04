package com.example.demo.model.entity2;

public class UpdateReclamoDTO {

	private int estado;
    private Long reclamo; // FK de reclamo
    private String fecha;
    private Long responsable;
    private String causa;
    
	public int getEstado() {
		return estado;
	}
	public void setEstado(int estado) {
		this.estado = estado;
	}
	public Long getReclamo() {
		return reclamo;
	}
	public void setReclamo(Long reclamo) {
		this.reclamo = reclamo;
	}
	public String getFecha() {
		return fecha;
	}
	public void setFecha(String fecha) {
		this.fecha = fecha;
	}
	public Long getResponsable() {
		return responsable;
	}
	public void setResponsable(Long responsable) {
		this.responsable = responsable;
	}
	public String getCausa() {
		return causa;
	}
	public void setCausa(String causa) {
		this.causa = causa;
	}
    
    
}



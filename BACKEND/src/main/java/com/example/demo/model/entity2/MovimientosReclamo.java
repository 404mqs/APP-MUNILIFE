package com.example.demo.model.entity2;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "ReclamosHistorial")
public class MovimientosReclamo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private int id;

    @ManyToOne
    @JoinColumn(name = "reclamo_id", referencedColumnName = "id")
    private Reclamo reclamo; // FK de reclamo

    private String fecha;
    
    private String responsable;
    
    private String causa;
    
    private int estado;

    public int getId() {
		return id;
	}



	public void setId(int id) {
		this.id = id;
	}



	public Reclamo getReclamo() {
		return reclamo;
	}



	public void setReclamo(Reclamo reclamo) {
		this.reclamo = reclamo;
	}



	public int getEstado() {
		return estado;
	}



	public void setEstado(int estado) {
		this.estado = estado;
	}



	public String getFecha() {
		return fecha;
	}



	public void setFecha(String fecha) {
		this.fecha = fecha;
	}



	public String getCausa() {
		return causa;
	}



	public void setCausa(String causa) {
		this.causa = causa;
	}

	public MovimientosReclamo(int id, Reclamo reclamo, String fecha, String responsable, String causa) {
		super();
		this.id = id;
		this.reclamo = reclamo;
		this.fecha = fecha;
		this.responsable = responsable;
		this.causa = causa;
	}



	public MovimientosReclamo() {
		// TODO Auto-generated constructor stub
	}



	public String getResponsable() {
		return responsable;
	}



	public void setResponsable(String responsable) {
		this.responsable = responsable;
	}




}

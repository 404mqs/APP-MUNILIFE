package com.example.demo.model.entity2;

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
@Table(name = "Desperfecto")
public class Desperfecto {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@PrimaryKeyJoinColumn
	@Column(name = "id", nullable = false)
	private Long idDesperfecto;

	private String descripcion;

	@ManyToOne
	@JoinColumn(name = "rubro_id", referencedColumnName = "id")
	private Rubro rubro;

	public Long getIdDesperfecto() {
		return idDesperfecto;
	}

	public void setIdDesperfecto(Long idDesperfecto) {
		this.idDesperfecto = idDesperfecto;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public Rubro getRubro() {
		return rubro;
	}

	public void setRubro(Rubro rubro) {
		this.rubro = rubro;
	}

	public Desperfecto() {
    }
	
	public Desperfecto(Long idDesperfecto, String descripcion, Rubro rubro) {
		super();
		this.idDesperfecto = idDesperfecto;
		this.descripcion = descripcion;
		this.rubro = rubro;
	}

}

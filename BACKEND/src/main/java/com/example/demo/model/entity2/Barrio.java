package com.example.demo.model.entity2;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrimaryKeyJoinColumn;

@Entity
public class Barrio {

	@Id
	@PrimaryKeyJoinColumn
	@Column(name="id", nullable=false)
	private Long idBarrio;
	
	private String nameBarrio;

	public Barrio(String nameBarrio) {
		this.nameBarrio = nameBarrio;
	}

	public Long getIdBarrio() {
		return idBarrio;
	}

	public void setIdBarrio(Long idBarrio) {
		this.idBarrio = idBarrio;
	}

	public String getNameBarrio() {
		return nameBarrio;
	}

	public void setNameBarrio(String nameBarrio) {
		this.nameBarrio = nameBarrio;
	}

	public Barrio(Long idBarrio, String nameBarrio) {
		super();
		this.idBarrio = idBarrio;
		this.nameBarrio = nameBarrio;
	}

	public Barrio() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	
}

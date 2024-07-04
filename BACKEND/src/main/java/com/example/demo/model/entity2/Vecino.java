package com.example.demo.model.entity2;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Vecino")
public class Vecino {
	
	@Id
	@Column(name = "documento", nullable = false) // Cambio de nombre de columna
	private Long documento;
	
	@Column(name = "nombre")
	private String nombre;
	
	@Column(name = "apellido")
	private String apellido;
	
	@Column(name = "direccion")
	private String direccion;
	
	@ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "codigoBarrio", referencedColumnName = "id")
    private Barrio barrio;

	// Agrega los getters y setters para cada campo

	// Constructor vacío (puedes agregar otros constructores según tus necesidades)
	public Vecino() {
	}

	public Long getDocumento() {
		return documento;
	}

	public void setDocumento(Long documento) {
		this.documento = documento;
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

	public String getDireccion() {
		return direccion;
	}

	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}

	public Barrio getCodigoBarrio() {
		return barrio;
	}

	public void setCodigoBarrio(Barrio codigoBarrio) {
		this.barrio = codigoBarrio;
	}

	public Vecino(Long documento, String nombre, String apellido, String direccion, Barrio codigoBarrio) {
		super();
		this.documento = documento;
		this.nombre = nombre;
		this.apellido = apellido;
		this.direccion = direccion;
		this.barrio = codigoBarrio;
	}

	
}

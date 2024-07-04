package com.example.demo.model.entity2;

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
@Table(name = "Servicio")
public class Servicio {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@PrimaryKeyJoinColumn
	@Column(name="id", nullable=false)
	private Long idServicio;

	private String nombre;
	
	private String apellido;
	
	private String nombreServicio;
	
	private String direccion;
	
	private String contacto;
	
	private String rubro;
	
	private String descripcion;
	
	public String getDescripcion() {
		return descripcion;
	}


	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	@Lob
	@Column(columnDefinition = "LONGBLOB")
	private byte[] imagen;
	
	@ManyToOne
    @JoinColumn(name = "usuario_id", referencedColumnName = "id")
	@JsonIgnore
    private Usuario autor;

	public Servicio(Long idServicio, String nombre, String apellido, String nombreServicio, String direccion,
			String contacto, String rubro, byte[] imagen, Usuario autor) {
		super();
		this.idServicio = idServicio;
		this.nombre = nombre;
		this.apellido = apellido;
		this.nombreServicio = nombreServicio;
		this.direccion = direccion;
		this.contacto = contacto;
		this.rubro = rubro;
		this.imagen = imagen;
		this.autor = autor;
	}


	public Long getIdServicio() {
		return idServicio;
	}


	public void setIdServicio(Long idServicio) {
		this.idServicio = idServicio;
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


	public String getNombreServicio() {
		return nombreServicio;
	}


	public void setNombreServicio(String nombreServicio) {
		this.nombreServicio = nombreServicio;
	}


	public String getDireccion() {
		return direccion;
	}


	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}


	public String getContacto() {
		return contacto;
	}


	public void setContacto(String contacto) {
		this.contacto = contacto;
	}


	public String getRubro() {
		return rubro;
	}


	public void setRubro(String rubro) {
		this.rubro = rubro;
	}


	public byte[] getImagen() {
		return imagen;
	}


	public void setImagen(byte[] imagen) {
		this.imagen = imagen;
	}


	public Usuario getAutor() {
		return autor;
	}


	public void setAutor(Usuario autor) {
		this.autor = autor;
	}

	public Servicio() {
	}

	

}


/*

### Servicios

ID - int (pk)

Nombre - string

Apellido - string

NombreServicio - string

Descripcion - string

Contacto - string

Rubro - string

Imagen - foto

Autor - string (FK de usuario)


*/
package com.example.demo.model.entity2;

public class ServicioDTO {

    private String nombreServicio;
    private String descripcion;
    private String contacto;
    private String rubro;
    private String fotoBase64;
    
	public String getFotoBase64() {
		return fotoBase64;
	}

	public void setFotoBase64(String fotoBase64) {
		this.fotoBase64 = fotoBase64;
	}

	public String getNombreServicio() {
		return nombreServicio;
	}

	public void setNombreServicio(String nombreServicio) {
		this.nombreServicio = nombreServicio;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
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

	public String getImagen() {
		return imagen;
	}

	public void setImagen(String imagen) {
		this.imagen = imagen;
	}

	public String getAutor() {
		return autor;
	}

	public void setAutor(String autor) {
		this.autor = autor;
	}

	private String imagen; // Foto
    private String autor; // Usuario

    // Constructor vacío (puedes agregar otros constructores según tus necesidades)
    public ServicioDTO() {
    }

    // Getters y setters (puedes generarlos automáticamente en tu IDE)
    // ...

    // Otros métodos o lógica específica según tus requerimientos
}

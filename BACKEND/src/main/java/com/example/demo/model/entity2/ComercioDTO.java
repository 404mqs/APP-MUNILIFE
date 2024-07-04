package com.example.demo.model.entity2;

import org.springframework.web.multipart.MultipartFile;

public class ComercioDTO {

    private String nombreComercio;
    private String descripcion;
    private String direccion;
    private String apertura;
    private String fotoBase64;
	
    public String getFotoBase64() {
		return fotoBase64;
	}


	public void setFotoBase64(String fotoBase64) {
		this.fotoBase64 = fotoBase64;
	}


	// Constructor vacío (puedes agregar otros constructores según tus necesidades)
    public ComercioDTO() {
    }


    public String getNombreComercio() {
        return nombreComercio;
    }

    public void setNombreComercio(String nombreComercio) {
        this.nombreComercio = nombreComercio;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
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


}
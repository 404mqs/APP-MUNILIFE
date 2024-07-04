package com.example.demo.model.entity2;

import org.springframework.web.multipart.MultipartFile;

public class FotoReclamoDTO {
	

	public byte[] getFoto() {
		return foto;
	}

	public void setFoto(byte[] foto) {
		this.foto = foto;
	}

	public Long getId() {
		return id;
	}

	public void setEmail(Long id) {
		this.id = id;
	}

	private byte[] foto;
    private Long id;

}

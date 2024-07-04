package com.example.demo.model.entity2;

import org.springframework.web.multipart.MultipartFile;

public class FotoUsuarioDTO {
	

	public byte[] getFoto() {
		return foto;
	}

	public void setFoto(byte[] foto) {
		this.foto = foto;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	private byte[] foto;
    private String email;

}

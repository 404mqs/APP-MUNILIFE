package com.example.demo.model.entity2;

public class FotoDenunciaDTO {


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

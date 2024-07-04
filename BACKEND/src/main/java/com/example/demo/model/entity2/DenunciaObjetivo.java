package com.example.demo.model.entity2;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "DenunciaObjetivo")
public class DenunciaObjetivo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @PrimaryKeyJoinColumn
    @Column(name = "id", nullable = false)
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "idDenuncia", referencedColumnName = "id")
    private Denuncia denuncia;

    @Column(name = "objetivo_id", nullable = false)
    private Long objetivoId;
 
    @Column(name = "tipo_objetivo", nullable = false)
    private int tipoObjetivo; // Puede ser 'VECINO, 1' o 'COMERCIO, 2'

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Denuncia getDenuncia() {
		return denuncia;
	}

	public void setDenuncia(Denuncia denuncia) {
		this.denuncia = denuncia;
	}

	public Long getObjetivoId() {
		return objetivoId;
	}

	public void setObjetivoId(Long objetivoId) {
		this.objetivoId = objetivoId;
	}

	public int getTipoObjetivo() {
		return tipoObjetivo;
	}

	public void setTipoObjetivo(int tipoObjetivo) {
		this.tipoObjetivo = tipoObjetivo;
	}
    

   
}

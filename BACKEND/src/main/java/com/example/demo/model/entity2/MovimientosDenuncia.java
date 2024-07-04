package com.example.demo.model.entity2;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "HistDenuncias")
public class MovimientosDenuncia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private int id;

    @ManyToOne
    @JoinColumn(name = "denuncia_id", referencedColumnName = "id")
    private Denuncia denuncia; // FK de denuncia

    private String estado;

    public MovimientosDenuncia(int id, Denuncia denuncia, String estado) {
		super();
		this.id = id;
		this.denuncia = denuncia;
		this.estado = estado;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Denuncia getDenuncia() {
		return denuncia;
	}

	public void setDenuncia(Denuncia denuncia) {
		this.denuncia = denuncia;
	}

	public String getEstado() {
		return estado;
	}

	public void setEstado(String estado) {
		this.estado = estado;
	}

	// Constructor vacío (puedes agregar otros constructores según tus necesidades)
    public MovimientosDenuncia() {
    }

    // Getters y setters (puedes generarlos automáticamente en tu IDE)
    // ...

    // Otros métodos o lógica específica según tus requerimientos
}

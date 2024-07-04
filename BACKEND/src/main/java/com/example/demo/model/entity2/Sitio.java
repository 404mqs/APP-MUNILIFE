package com.example.demo.model.entity2;

import jakarta.persistence.*;

import java.time.LocalTime;

@Entity
@Table(name = "Sitio")
public class Sitio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @PrimaryKeyJoinColumn
    @Column(name="id", nullable=false)
    private Long idSitio;
    private String latitud;
    private int longitud;
    private String calle;
    private int numero;
    private String entreCalleA;
    private String entreCalleB;
    private String descripcion;
    private String aCargoDe;
    private LocalTime apertura;
    private LocalTime cierre;
    private String comentarios;

    public Sitio(String latitud, int longitud, String calle, int numero, String entreCalleA, String entreCalleB, String descripcion, String aCargoDe, LocalTime apertura, LocalTime cierre, String comentarios) {
        this.latitud = latitud;
        this.longitud = longitud;
        this.calle = calle;
        this.numero = numero;
        this.entreCalleA = entreCalleA;
        this.entreCalleB = entreCalleB;
        this.descripcion = descripcion;
        this.aCargoDe = aCargoDe;
        this.apertura = apertura;
        this.cierre = cierre;
        this.comentarios = comentarios;
    }
    
    public Sitio() {
    	
    }

    public Long getIdSitio() {
        return idSitio;
    }

    public void setIdSitio(Long idSitio) {
        this.idSitio = idSitio;
    }

    public String getLatitud() {
        return latitud;
    }

    public void setLatitud(String latitud) {
        this.latitud = latitud;
    }

    public int getLongitud() {
        return longitud;
    }

    public void setLongitud(int longitud) {
        this.longitud = longitud;
    }

    public String getCalle() {
        return calle;
    }

    public void setCalle(String calle) {
        this.calle = calle;
    }

    public int getNumero() {
        return numero;
    }

    public void setNumero(int numero) {
        this.numero = numero;
    }

    public String getEntreCalleA() {
        return entreCalleA;
    }

    public void setEntreCalleA(String entreCalleA) {
        this.entreCalleA = entreCalleA;
    }

    public String getEntreCalleB() {
        return entreCalleB;
    }

    public void setEntreCalleB(String entreCalleB) {
        this.entreCalleB = entreCalleB;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getaCargoDe() {
        return aCargoDe;
    }

    public void setaCargoDe(String aCargoDe) {
        this.aCargoDe = aCargoDe;
    }

    public LocalTime getApertura() {
        return apertura;
    }

    public void setApertura(LocalTime apertura) {
        this.apertura = apertura;
    }

    public LocalTime getCierre() {
        return cierre;
    }

    public void setCierre(LocalTime cierre) {
        this.cierre = cierre;
    }

    public String getComentarios() {
        return comentarios;
    }

    public void setComentarios(String comentarios) {
        this.comentarios = comentarios;
    }
}

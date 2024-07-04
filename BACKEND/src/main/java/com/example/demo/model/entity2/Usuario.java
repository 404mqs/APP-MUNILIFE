package com.example.demo.model.entity2;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Basic;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "Usuario", uniqueConstraints = { @UniqueConstraint(columnNames = { "username" }) })
public class Usuario implements UserDetails{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@PrimaryKeyJoinColumn
	@Column(name = "id", nullable = false)
	private Long id;
	@Basic
	@Column(nullable = false)
	private String username;
	private String nombre;
	private String apellido;
    @Column(nullable = false, unique = true)
	private int dni;
	private String contrasena;
	@Enumerated(EnumType.STRING)
	private Role role;
	
	@Lob
	@Column(columnDefinition = "LONGBLOB")
	private byte[] foto;

	@OneToMany(mappedBy = "documento", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<Reclamo> reclamos = new ArrayList<>();
	
	@OneToMany(mappedBy = "denunciante", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<Denuncia> denuncias = new ArrayList<>();
	
	@OneToMany(mappedBy = "autor", cascade = CascadeType.ALL)
	private List<Servicio> servicios = new ArrayList<>();
	
	@OneToMany(mappedBy = "dueno_comercio", cascade = CascadeType.ALL)
	private List<Comercio> comercios  = new ArrayList<>();

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
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

	public int getDni() {
		return dni;
	}

	public void setDni(int dni) {
		this.dni = dni;
	}

	public String getContrasena() {
		return contrasena;
	}

	public void setContrasena(String contrasena) {
		this.contrasena = contrasena;
	}

	public List<Reclamo> getReclamos() {
		return reclamos;
	}

	public void setReclamos(List<Reclamo> reclamos) {
		this.reclamos = reclamos;
	}

	public List<Denuncia> getDenuncias() {
		return denuncias;
	}

	public void setDenuncias(List<Denuncia> denuncias) {
		this.denuncias = denuncias;
	}

	public List<Servicio> getServicios() {
		return servicios;
	}

	public void setServicios(List<Servicio> servicios) {
		this.servicios = servicios;
	}

	public List<Comercio> getComercios() {
		return comercios;
	}

	public void setComercios(List<Comercio> comercios) {
		this.comercios = comercios;
	}

	@Override
	public String toString() {
		return "Usuario [id=" + id + ", username=" + username + ", nombre=" + nombre + ", apellido=" + apellido
				+ ", dni=" + dni + ", contrasena=" + contrasena + ", denuncias=" + denuncias + ", comercios="
				+ comercios + "]";
	}

	public Usuario() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
	    return Collections.singletonList(new SimpleGrantedAuthority(role.name()));

	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	public byte[] getFoto() {
		return foto;
	}

	public void setFoto(byte[] foto) {
		this.foto = foto;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;

	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;

	}

	@Override
	public boolean isEnabled() {
		return true;

	}

	@Override
	public String getPassword() {
		// TODO Auto-generated method stub
		return null;
	}







}

package com.example.demo.model.entity2;

public class UsuarioDTO {

    private String email;
    private String dni;
    private String contraseña;

    // Constructor vacío (puedes agregar otros constructores según tus necesidades)
    public UsuarioDTO() {
    }

    // Getters y setters (puedes generarlos automáticamente en tu IDE)
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getContrasena() {
        return contraseña;
    }

    public void setContraseña(String contraseña) {
        this.contraseña = contraseña;
    }

}

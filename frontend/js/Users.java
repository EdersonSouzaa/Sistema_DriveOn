package com.driveon.entity;

import javax.persistence.*;

@Entity
@Table(name = "users") // Nome da tabela no banco de dados
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incremento para a chave primária
    private Long id;

    @Column(nullable = false, unique = true) // Garante que o email é único e não nulo
    private String email;

    @Column(nullable = false)
    private String senha; // Senha já codificada

    @Column(nullable = false)
    private String nome;

    @Column(name = "tipo_usuario", nullable = false)
    private String tipoUsuario;

    @Column(unique = true) // CPF pode ser único, mas pode ser nulo para administradores
    private String cpf;

    @Column // CNH pode ser nulo para administradores
    private String cnh;

    @Column // Telefone pode ser nulo para administradores
    private String telefone;

    // Construtor padrão (necessário para JPA)
    public Users() {
    }

    // Getters e Setters para todos os campos
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTipoUsuario() {
        return this.tipoUsuario;
    }

    public void setTipoUsuario(String tipoUsuario) {
        this.tipoUsuario = tipoUsuario;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getCnh() {
        return cnh;
    }

    public void setCnh(String cnh) {
        this.cnh = cnh;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }
}

package com.fitpro.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Trainer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String trainerName;
    private String phone;
    private String specialization;

    private boolean active = true; 

    @OneToOne
    @JoinColumn(name = "user_id")
    private AppUser user;

    
    @OneToMany(mappedBy = "trainer")
    @JsonIgnore
    private List<Member> members;
}
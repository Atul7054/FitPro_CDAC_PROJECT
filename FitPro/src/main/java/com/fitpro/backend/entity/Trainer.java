package com.fitpro.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Trainer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String trainerName;

    private String specialization;

    private String phone;

    @OneToOne
    @JoinColumn(name = "user_id")
    private AppUser user;
    
}

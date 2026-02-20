package com.fitpro.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class MembershipPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String planName; 

    private Double price;    
    private Integer durationInDays; 
}

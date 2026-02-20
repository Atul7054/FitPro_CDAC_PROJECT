package com.fitpro.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MemberRegistrationRequest {

   
    private String email;
    private String password;

   
    private String name;
    private String phone;
    private String address;

    
    private Long planId;    
    private Long trainerId; 

}

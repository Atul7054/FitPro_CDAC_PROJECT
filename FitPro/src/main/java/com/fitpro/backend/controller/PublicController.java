package com.fitpro.backend.controller;

import com.fitpro.backend.entity.MembershipPlan;
import com.fitpro.backend.entity.Trainer;
import com.fitpro.backend.repository.MembershipPlanRepository;
import com.fitpro.backend.repository.TrainerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    @Autowired
    private MembershipPlanRepository planRepo;
    @Autowired
    private TrainerRepository trainerRepo;

    @GetMapping("/plans")
    public List<MembershipPlan> getAllPlans() {
        return planRepo.findAll();
    }

    @GetMapping("/trainers")
    public List<Trainer> getAllTrainers() {
        return trainerRepo.findAll();
    }
}

package com.fitpro.backend.controller;

import com.fitpro.backend.dto.MemberRegistrationRequest;
import com.fitpro.backend.entity.Member;
import com.fitpro.backend.entity.MembershipPlan;
import com.fitpro.backend.entity.Trainer;
import com.fitpro.backend.service.AdminService;
import com.fitpro.backend.service.MemberService;
import com.fitpro.backend.service.TrainerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private MemberService memberService;

    @Autowired
    private TrainerService trainerService;

    // =======================================================
    // 1. DASHBOARD & PLANS
    // =======================================================

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        return adminService.getDashboardStats();
    }

    @PostMapping("/plans")
    public MembershipPlan createPlan(@RequestBody MembershipPlan plan) {
        return adminService.createPlan(plan);
    }

    @PutMapping("/plans/{id}")
    public MembershipPlan updatePlan(@PathVariable Long id, @RequestBody MembershipPlan plan) {
        return adminService.updatePlan(id, plan);
    }

    @DeleteMapping("/plans/{id}")
    public String deletePlan(@PathVariable Long id) {
        adminService.deletePlan(id);
        return "Plan deleted successfully";
    }

    // =======================================================
    // 2. MEMBER MANAGEMENT
    // =======================================================

    // Admin sees ALL members
    @GetMapping("/members")
    public List<Member> getAllMembers() {
        return memberService.getAllMembers();
    }

    // Admin Creates a Member (Walk-in Client)
    @PostMapping("/members")
    public Member createMember(@RequestBody MemberRegistrationRequest request) {
        return memberService.registerMember(request);
    }

    // Admin Bans/Deletes Member (Now calls the Safe Delete)
    @DeleteMapping("/members/{id}")
    public String deleteMember(@PathVariable Long id) {
        memberService.deleteMember(id);
        return "Member deleted successfully";
    }

    // =======================================================
    // 3. TRAINER MANAGEMENT
    // =======================================================

    // Admin sees ALL trainers
    @GetMapping("/trainers")
    public List<Trainer> getAllTrainers() {
        return trainerService.getAllTrainers();
    }

    // Admin Hires a Trainer
    // 👇 FIXED: Accepts Map to handle Password + Profile creation
    @PostMapping("/trainers")
    public Trainer createTrainer(@RequestBody Map<String, Object> trainerData) {
        return trainerService.createTrainer(trainerData);
    }

    // Admin Updates Trainer Info
    @PutMapping("/trainers/{id}")
    public Trainer updateTrainer(@PathVariable Long id, @RequestBody Trainer trainer) {
        return trainerService.updateTrainer(id, trainer);
    }

    // Admin Fires a Trainer
    @DeleteMapping("/trainers/{id}")
    public String deleteTrainer(@PathVariable Long id) {
        trainerService.deleteTrainer(id);
        return "Trainer deleted";
    }
}
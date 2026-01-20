package com.fitpro.backend.controller;

import com.fitpro.backend.dto.MemberRegistrationRequest;
import com.fitpro.backend.entity.Member;
import com.fitpro.backend.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "http://localhost:5173") // Allow React (Vite) to talk to us
public class MemberController {

    @Autowired
    private MemberService memberService;

    @PostMapping("/register")
    public Member register(@RequestBody MemberRegistrationRequest request) {
        return memberService.registerMember(request);
    }

    // 2. READ ALL (GET)
    @GetMapping
    public List<Member> getAllMembers() {
        return memberService.getAllMembers();
    }

    // 3. READ ONE (GET)
    @GetMapping("/{id}")
    public Member getMemberById(@PathVariable Long id) {
        return memberService.getMemberById(id);
    }

    // 4. UPDATE FULL (PUT)
    @PutMapping("/{id}")
    public Member updateMember(@PathVariable Long id, @RequestBody Member memberDetails) {
        return memberService.updateMember(id, memberDetails);
    }

    // 5. UPDATE PARTIAL (PATCH)
    // Body example: { "phone": "555-0000" }
    @PatchMapping("/{id}")
    public Member patchMember(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        return memberService.patchMember(id, updates);
    }

    // 6. DELETE (DELETE)
    @DeleteMapping("/{id}")
    public String deleteMember(@PathVariable Long id) {
        memberService.deleteMember(id);
        return "Member deleted successfully with ID: " + id;
    }

    
}
package com.fitpro.backend.controller;

import com.fitpro.backend.entity.Attendance;
import com.fitpro.backend.repository.AttendanceRepository;
import com.fitpro.backend.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private AttendanceRepository attendanceRepo;

   
    @PostMapping
    public Attendance markAttendance(@RequestParam Long memberId,
                                     @RequestParam String status) {
        return attendanceService.markAttendance(memberId, status);
    }

    
    @GetMapping("/member/{memberId}")
    public List<Attendance> getMemberAttendance(@PathVariable Long memberId) {
        return attendanceRepo.findByMemberId(memberId);
    }
}
package com.fitpro.backend.controller;

import com.fitpro.backend.entity.Attendance;
import com.fitpro.backend.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*") // Allows Frontend to access this
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    // 1. MARK ATTENDANCE (Admin)
    // URL: POST http://localhost:8080/api/attendance?memberId=1&status=Present
    @PostMapping
    public Attendance markAttendance(@RequestParam Long memberId,
                                     @RequestParam String status) {
        return attendanceService.markAttendance(memberId, status);
    }

    // 2. VIEW HISTORY (Member)
    // FIX: Changed path from "/{memberId}" to "/member/{memberId}" to match Frontend
    @GetMapping("/member/{memberId}")
    public List<Attendance> getHistory(@PathVariable Long memberId) {
        return attendanceService.getAttendanceHistory(memberId);
    }
}
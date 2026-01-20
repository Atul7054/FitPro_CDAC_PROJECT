package com.fitpro.backend.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleStatusException(ResponseStatusException ex) {
        Map<String, Object> errorResponse = new HashMap<>();

        // 1. The Status Code (e.g., 404 NOT_FOUND)
        errorResponse.put("status", ex.getStatusCode().value());

        // 2. The Custom Message (e.g., "Member not found with ID: 999")
        errorResponse.put("message", ex.getReason());

        // 3. Timestamp (Optional, looks professional)
        errorResponse.put("timestamp", System.currentTimeMillis());

        return new ResponseEntity<>(errorResponse, ex.getStatusCode());
    }
}
package com.robspecs.live_streaming_app.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:5173") // Allow requests from Vite dev server
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Backend is running!";
    }

    @GetMapping("/api/hello")
    public String hello() {
        return "Hello from Spring Boot Backend!";
    }
}
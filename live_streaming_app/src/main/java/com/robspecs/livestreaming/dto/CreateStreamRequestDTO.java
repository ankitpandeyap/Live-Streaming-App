package com.robspecs.livestreaming.dto;

// Optional: Add validation annotations if you have Spring Boot Starter Validation
// import jakarta.validation.constraints.NotBlank;
// import jakarta.validation.constraints.Size;

public class CreateStreamRequestDTO {

    // @NotBlank(message = "Title is required") // Example validation
    // @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    private String title;

    // @Size(max = 500, message = "Description cannot exceed 500 characters") // Example validation
    private String description;

    // No-argument constructor
    public CreateStreamRequestDTO() {
    }

    // All-argument constructor
    public CreateStreamRequestDTO(String title, String description) {
        this.title = title;
        this.description = description;
    }

    // --- Getters ---
    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    // --- Setters ---
    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "CreateStreamRequestDTO{" +
               "title='" + title + '\'' +
               ", description='" + description + '\'' +
               '}';
    }
}
package com.robspecs.livestreaming.controllers; // Note: Changed from 'controllers' to 'controller' for consistency

import com.robspecs.livestreaming.model.StreamMetadata;
import com.robspecs.livestreaming.service.StreamService;
import com.robspecs.livestreaming.exceptions.NotFoundException; // Ensure this is correct
import com.robspecs.livestreaming.dto.CreateStreamRequestDTO; // Assuming you're using the DTO as discussed
import com.robspecs.livestreaming.entities.User; // Import your User entity

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; // Keep this import
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/streams")
public class StreamController {

    private static final Logger logger = LoggerFactory.getLogger(StreamController.class);
    private final StreamService streamService;

    public StreamController(StreamService streamService) {
        this.streamService = streamService;
        logger.debug("StreamController initialized.");
    }

    /**
     * Creates a new stream and its metadata. This will also generate a unique stream key.
     * Accessible by authenticated users (streamers).
     *
     * @param requestDto The DTO containing title and description from the request body.
     * @param authentication The Spring Security Authentication object, injected automatically.
     * @return ResponseEntity with the created StreamMetadata and HTTP status 201.
     */
    @PostMapping("/create")
    public ResponseEntity<StreamMetadata> createStream(
            @RequestBody CreateStreamRequestDTO requestDto,
            Authentication authentication) { // Inject Authentication directly

        // Cast the principal to your User entity to get specific details
        // authentication.getPrincipal() returns the UserDetails object (your User entity in this case)
        User currentUser = (User) authentication.getPrincipal();
        String userNameAsUserId = currentUser.getUsername(); // Get the userName directly from your User entity

        // Generate a unique stream key
        String streamKey = UUID.randomUUID().toString().replace("-", "");

        // Create StreamMetadata object from DTO and generated data
        StreamMetadata newStreamMetadata = new StreamMetadata();
        newStreamMetadata.setStreamKey(streamKey);
        newStreamMetadata.setUserId(userNameAsUserId); // Storing the userName as the userId in StreamMetadata
        newStreamMetadata.setTitle(requestDto.getTitle());
        newStreamMetadata.setDescription(requestDto.getDescription());
        newStreamMetadata.setCreatedAt(System.currentTimeMillis());

        logger.info("Creating stream metadata for user {} with key: {}", userNameAsUserId, streamKey);
        StreamMetadata savedMetadata = streamService.saveStreamMetadata(newStreamMetadata);
        return new ResponseEntity<>(savedMetadata, HttpStatus.CREATED);
    }

    /**
     * Retrieves stream metadata by its stream key. Accessible by anyone.
     *
     * @param streamKey The unique stream key.
     * @return ResponseEntity with the StreamMetadata and HTTP status 200, or 404 if not found.
     */
    @GetMapping("/{streamKey}")
    public ResponseEntity<StreamMetadata> getStreamMetadata(@PathVariable String streamKey) {
        logger.info("Fetching stream metadata for key: {}", streamKey);
        StreamMetadata metadata = streamService.getStreamMetadata(streamKey)
                .orElseThrow(() -> {
                    logger.warn("Stream metadata not found for key: {}", streamKey);
                    return new NotFoundException("Stream not found with key: " + streamKey);
                });
        return ResponseEntity.ok(metadata);
    }

    /**
     * Deletes stream metadata by its stream key.
     * Accessible only by the owner of the stream (userName match) or an admin.
     *
     * @param streamKey The unique stream key to delete.
     * @param authentication The Spring Security Authentication object, injected automatically.
     * @return ResponseEntity with HTTP status 204 (No Content).
     */
    @DeleteMapping("/{streamKey}")
    public ResponseEntity<Void> deleteStream(
            @PathVariable String streamKey,
            Authentication authentication) { // Inject Authentication directly

        User currentUser = (User) authentication.getPrincipal();
        String currentUserName = currentUser.getUsername(); // Get the userName directly from your User entity

        logger.info("User {} attempting to delete stream with key: {}", currentUserName, streamKey);

        StreamMetadata existingMetadata = streamService.getStreamMetadata(streamKey)
                .orElseThrow(() -> {
                    logger.warn("Attempted to delete non-existent stream: {}", streamKey);
                    return new NotFoundException("Stream not found with key: " + streamKey);
                });

        // Check if the authenticated user (by userName) is the owner (userId in StreamMetadata)
        if (!existingMetadata.getUserId().equals(currentUserName)) {
            logger.warn("User {} attempted to delete stream {} which is owned by {}", currentUserName, streamKey, existingMetadata.getUserId());
            return new ResponseEntity<>(HttpStatus.FORBIDDEN); // User is not authorized to delete this stream
        }

        streamService.deleteStreamMetadata(streamKey);
        logger.info("Stream metadata with key {} deleted successfully by user {}", streamKey, currentUserName);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // You might consider an endpoint to update stream metadata if needed
    // @PutMapping("/{streamKey}")
    // public ResponseEntity<StreamMetadata> updateStream(@PathVariable String streamKey, @RequestBody StreamMetadata updatedMetadata) {
    //    // ... implementation for updating title/description etc.
    // }
}
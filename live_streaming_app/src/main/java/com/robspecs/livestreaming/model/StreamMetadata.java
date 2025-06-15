package com.robspecs.livestreaming.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import java.io.Serializable;

@RedisHash("StreamMetadata") // This tells Spring Data Redis to store objects of this type in a Redis Hash named "StreamMetadata"
public class StreamMetadata implements Serializable {

    @Id // This annotation marks 'streamKey' as the primary key for Redis.
    private String streamKey; // A unique identifier for each stream.
    private String title; // The title of the stream.
    private String description; // A brief description.
    private String thumbnailUrl; // URL for a thumbnail image.
    private String userId; // The ID of the user who owns this stream.
    private long createdAt; // Timestamp when the stream metadata was created.

    // No-argument constructor
    public StreamMetadata() {
    }

    // All-argument constructor
    public StreamMetadata(String streamKey, String title, String description, String thumbnailUrl, String userId, long createdAt) {
        this.streamKey = streamKey;
        this.title = title;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
        this.userId = userId;
        this.createdAt = createdAt;
    }

    // --- Getters ---
    public String getStreamKey() {
        return streamKey;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public String getUserId() {
        return userId;
    }

    public long getCreatedAt() {
        return createdAt;
    }

    // --- Setters ---
    public void setStreamKey(String streamKey) {
        this.streamKey = streamKey;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setCreatedAt(long createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "StreamMetadata{" +
               "streamKey='" + streamKey + '\'' +
               ", title='" + title + '\'' + 
                ", description='" + description + '\'' +
               ", thumbnailUrl='" + thumbnailUrl + '\'' +
               ", userId='" + userId + '\'' +
               ", createdAt=" + createdAt +
               '}';
    }
}
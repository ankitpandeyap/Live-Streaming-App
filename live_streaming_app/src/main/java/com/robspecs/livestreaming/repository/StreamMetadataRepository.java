package com.robspecs.livestreaming.repository;

import com.robspecs.livestreaming.model.StreamMetadata;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StreamMetadataRepository extends CrudRepository<StreamMetadata, String> {
    // Spring Data Redis will automatically implement this based on @RedisHash and @Id in StreamMetadata
}
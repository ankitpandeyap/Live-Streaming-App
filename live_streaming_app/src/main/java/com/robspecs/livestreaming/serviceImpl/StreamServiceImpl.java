package com.robspecs.livestreaming.serviceImpl;

import com.robspecs.livestreaming.model.StreamMetadata;
import com.robspecs.livestreaming.repository.StreamMetadataRepository;
import com.robspecs.livestreaming.service.StreamService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StreamServiceImpl implements StreamService {

    private static final Logger logger = LoggerFactory.getLogger(StreamServiceImpl.class);
    private final StreamMetadataRepository streamMetadataRepository;

    public StreamServiceImpl(StreamMetadataRepository streamMetadataRepository) {
        this.streamMetadataRepository = streamMetadataRepository;
        logger.debug("StreamServiceImpl initialized.");
    }

    @Override
    public StreamMetadata saveStreamMetadata(StreamMetadata streamMetadata) {
        logger.info("Saving stream metadata for key: {}", streamMetadata.getStreamKey());
        StreamMetadata savedMetadata = streamMetadataRepository.save(streamMetadata);
        logger.debug("Stream metadata saved successfully for key: {}", savedMetadata.getStreamKey());
        return savedMetadata;
    }

    @Override
    public Optional<StreamMetadata> getStreamMetadata(String streamKey) {
        logger.info("Attempting to retrieve stream metadata for key: {}", streamKey);
        Optional<StreamMetadata> metadata = streamMetadataRepository.findById(streamKey);
        if (metadata.isPresent()) {
            logger.debug("Stream metadata found for key: {}", streamKey);
        } else {
            logger.warn("No stream metadata found for key: {}", streamKey);
        }
        return metadata;
    }

    @Override
    public void deleteStreamMetadata(String streamKey) {
        logger.info("Attempting to delete stream metadata for key: {}", streamKey);
        if (streamMetadataRepository.existsById(streamKey)) {
            streamMetadataRepository.deleteById(streamKey);
            logger.debug("Stream metadata deleted successfully for key: {}", streamKey);
        } else {
            logger.warn("Attempted to delete non-existent stream metadata for key: {}", streamKey);
        }
    }

    @Override
    public boolean streamExists(String streamKey) {
        boolean exists = streamMetadataRepository.existsById(streamKey);
        logger.debug("Stream metadata existence check for key {}: {}", streamKey, exists);
        return exists;
    }
}
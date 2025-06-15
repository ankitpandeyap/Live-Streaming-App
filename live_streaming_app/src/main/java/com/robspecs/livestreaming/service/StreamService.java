package com.robspecs.livestreaming.service;

import com.robspecs.livestreaming.model.StreamMetadata;
import java.util.Optional;

public interface StreamService {

    /**
     * Creates or updates stream metadata.
     * @param streamMetadata The StreamMetadata object to save.
     * @return The saved StreamMetadata object.
     */
    StreamMetadata saveStreamMetadata(StreamMetadata streamMetadata);

    /**
     * Retrieves stream metadata by its unique stream key.
     * @param streamKey The unique key of the stream.
     * @return An Optional containing the StreamMetadata if found, otherwise empty.
     */
    Optional<StreamMetadata> getStreamMetadata(String streamKey);

    /**
     * Deletes stream metadata by its unique stream key.
     * @param streamKey The unique key of the stream to delete.
     */
    void deleteStreamMetadata(String streamKey);

    /**
     * Checks if stream metadata exists for a given key.
     * @param streamKey The unique key of the stream.
     * @return True if metadata exists, false otherwise.
     */
    boolean streamExists(String streamKey);
}
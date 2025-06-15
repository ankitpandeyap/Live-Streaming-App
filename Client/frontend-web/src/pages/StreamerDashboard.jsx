import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance'; // Use your configured axiosInstance
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner'; // Assuming this is your general spinner
import Header from "../components/Header"; // Assuming you want a header on this page
import Sidebar from "../components/Sidebar"; // Assuming you want a sidebar on this page

export default function StreamerDashboard() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [streamKey, setStreamKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    // You already have ProtectedRoute handling authentication, so a redirect here is redundant
    // but you might keep it for explicit clarity or if the page could be accessed directly without AuthProvider
    // In your current setup, ProtectedRoute handles this well.

    const handleCreateStream = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // axiosInstance automatically includes the Authorization header via its interceptor
            const response = await axiosInstance.post('/streams/create', {
                title,
                description
            });

            if (response.status !== 201) { // Check for HTTP 201 Created status
                throw new Error(response.data.message || 'Failed to create stream.');
            }

            const data = response.data;
            setStreamKey(data.streamKey);
            setSuccess('Stream created successfully! Here is your unique stream key:');
            toast.success("Stream created successfully!");
            setTitle(''); // Clear form
            setDescription(''); // Clear form

        } catch (err) {
            console.error('Error creating stream:', err.response?.data || err.message);
            // Enhanced error message extraction
            let errorMessage = 'An unexpected error occurred.';
            if (err.response && err.response.data) {
                if (typeof err.response.data === 'string') {
                    errorMessage = err.response.data;
                } else if (err.response.data.message) {
                    errorMessage = err.response.data.message;
                } else if (err.response.data.error) {
                    errorMessage = err.response.data.error;
                }
            }
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-layout"> {/* Assuming you have a main layout div */}
            <Header />
            <Sidebar />
            <div className="content-area"> {/* Assuming content area for main content */}
                <div style={styles.container}>
                    <h2 style={styles.heading}>Go Live! Create a New Stream</h2>

                    {!streamKey && ( // Only show the form if a stream key hasn't been generated yet
                        <form onSubmit={handleCreateStream} style={styles.form}>
                            <div style={styles.formGroup}>
                                <label htmlFor="title" style={styles.label}>Stream Title:</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    style={styles.input}
                                    placeholder="e.g., My Awesome Gaming Session"
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label htmlFor="description" style={styles.label}>Description:</label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    style={styles.textarea}
                                    placeholder="Tell your viewers what your stream is about..."
                                ></textarea>
                            </div>
                            {error && <p style={styles.error}>{error}</p>}
                            <button type="submit" disabled={loading} style={styles.button}>
                                {loading ? <LoadingSpinner className="button-spinner" /> : 'Create Stream'}
                            </button>
                        </form>
                    )}

                    {streamKey && ( // Only show the stream key if it has been generated
                        <div style={styles.streamKeyDisplay}>
                            <h3>{success}</h3>
                            <p style={styles.keyText}>{streamKey}</p>
                            <p style={styles.instructions}>
                                Copy this key and paste it into your streaming software (e.g., OBS Studio)
                                as your **Stream Key**.
                                <br />
                                Your RTMP Server URL will typically be: **`rtmp://localhost/live`** (or your server's IP/domain).
                            </p>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(streamKey);
                                    toast.info('Stream key copied to clipboard!');
                                }}
                                style={styles.copyButton}
                            >
                                Copy Key
                            </button>
                            <button onClick={() => setStreamKey('')} style={styles.button}>
                                Create Another Stream
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Inline styles for quick application. Consider moving to CSS modules or a dedicated CSS file.
const styles = {
    mainLayout: {
        display: 'flex',
        minHeight: '100vh',
    },
    contentArea: {
        flexGrow: 1,
        padding: '20px',
        backgroundColor: '#f0f2f5',
    },
    container: {
        maxWidth: '700px',
        margin: '50px auto',
        padding: '30px',
        border: '1px solid #ddd',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        backgroundColor: '#ffffff',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    heading: {
        textAlign: 'center',
        color: '#2c3e50',
        marginBottom: '35px',
        fontSize: '2.2em',
        fontWeight: '600',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    formGroup: {
        marginBottom: '10px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 'bold',
        color: '#34495e',
        fontSize: '1.1em',
    },
    input: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxSizing: 'border-box',
        fontSize: '1em',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    },
    inputFocus: {
        borderColor: '#007bff',
        boxShadow: '0 0 0 0.2rem rgba(0, 123, 255, 0.25)',
    },
    textarea: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxSizing: 'border-box',
        fontSize: '1em',
        minHeight: '100px',
        resize: 'vertical',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    },
    textareaFocus: {
        borderColor: '#007bff',
        boxShadow: '0 0 0 0.2rem rgba(0, 123, 255, 0.25)',
    },
    button: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '15px 25px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1.1em',
        fontWeight: '600',
        marginTop: '15px',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonHover: {
        backgroundColor: '#0056b3',
        transform: 'translateY(-2px)',
    },
    copyButton: {
        backgroundColor: '#28a745',
        color: 'white',
        padding: '15px 25px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1.1em',
        fontWeight: '600',
        marginRight: '15px',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
    },
    copyButtonHover: {
        backgroundColor: '#218838',
        transform: 'translateY(-2px)',
    },
    error: {
        color: '#dc3545',
        textAlign: 'center',
        marginTop: '10px',
        fontSize: '0.95em',
        fontWeight: 'bold',
    },
    success: {
        color: '#28a745',
        textAlign: 'center',
        marginTop: '10px',
        fontSize: '0.95em',
        fontWeight: 'bold',
    },
    streamKeyDisplay: {
        backgroundColor: '#e9ecef',
        padding: '30px',
        borderRadius: '12px',
        border: '2px dashed #007bff',
        textAlign: 'center',
        marginTop: '30px',
    },
    keyText: {
        fontSize: '2.5em',
        fontWeight: 'bold',
        color: '#007bff',
        wordBreak: 'break-all',
        marginBottom: '20px',
        letterSpacing: '1px',
    },
    instructions: {
        fontSize: '1em',
        color: '#555',
        marginBottom: '25px',
        lineHeight: '1.6',
    },
};
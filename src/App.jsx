import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { removeBackground } from '@imgly/background-removal';
import './Css/App.css';

function App() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);

    useEffect(() => {
        return () => {
            images.forEach(img => {
                URL.revokeObjectURL(img.original);
                URL.revokeObjectURL(img.result);
            });
        };
    }, [images]);

    const processImages = useCallback(async (files) => {
        setError(null);
        setLoading(true);
        abortControllerRef.current = new AbortController();

        try {
            if (files.length > 5) {
                throw new Error("Maximum 5 files allowed at once");
            }

            const results = await Promise.allSettled(
                files.map(async (file) => {
                    if (!file.type.startsWith('image/')) {
                        throw new Error("Only image files are allowed.");
                    }
                    if (file.size > 5 * 1024 * 1024) {
                        throw new Error("File size should be under 5MB.");
                    }

                    const originalImageUrl = URL.createObjectURL(file);
                    const resultBlob = await removeBackground(file, {
                        signal: abortControllerRef.current.signal
                    });
                    const resultImageUrl = URL.createObjectURL(resultBlob);

                    return {
                        id: crypto.randomUUID(),
                        original: originalImageUrl,
                        result: resultImageUrl
                    };
                })
            );

            const newImages = results
                .filter(result => result.status === 'fulfilled')
                .map(result => result.value);

            const errors = results
                .filter(result => result.status === 'rejected')
                .map(result => result.reason.message);

            if (errors.length > 0) {
                setError(`Some files failed: ${errors.join(', ')}`);
            }

            setImages((prevImages) => [...prevImages, ...newImages]);
        } catch (err) {
            if (err.name === "AbortError") {
                console.log("Processing canceled.");
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const handleFileChange = useCallback((e) => {
        const files = Array.from(e.target.files);
        processImages(files);
    }, [processImages]);

    // Fixed dependencies here
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        processImages(files);
    }, [processImages]);

    const cancelProcessing = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setLoading(false);
        }
    }, []);



const renderedImages = useMemo(() => (
    images.map((img) => (
        <div key={img.id} className="image-container">
            <div>
                <h2>Original</h2>
                <img src={img.original} alt="Original" className="image-preview" loading="lazy" />
            </div>
            <div>
                <h2>Without Background</h2>
                <img src={img.result} alt="Background Removed" className="image-preview" loading="lazy" />
                <a href={img.result} download={`background_removed_${img.id}.png`}>
                    <button className="download-btn">Download</button>
                </a>
            </div>
        </div>
    ))
), [images]);

return (
    <div className="container">
        <h1>Background Remover</h1>

        <div
            className="drop-area"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            role="region"
            aria-label="File drop area"
        >
            <p>Drag & Drop images here or click below</p>
            <label className="upload-label">
                Click to Upload
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden-input"
                    disabled={loading}
                />
            </label>
            <p className="file-limits">(Max 5 files, 5MB each)</p>
        </div>

        {loading && <div className="spinner"></div>}
        {error && <p className="error">{error}</p>}

        {loading && (
            <button className="cancel-btn" onClick={cancelProcessing}>
                Cancel Processing
            </button>
        )}

        <div className="image-grid">
            {renderedImages}
        </div>
    </div>
);
}

export default App;
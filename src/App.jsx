import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { removeBackground } from '@imgly/background-removal';
import './Css/App.css';

function App() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const abortControllerRef = useRef(null);
    const dragDepth = useRef(0);
    const inputRef = useRef(null);

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
        e.target.value = '';
    }, [processImages]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        dragDepth.current = 0;
        setDragActive(false);
        const files = Array.from(e.dataTransfer.files);
        processImages(files);
    }, [processImages]);

    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        dragDepth.current += 1;
        setDragActive(true);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        dragDepth.current -= 1;
        if (dragDepth.current <= 0) {
            dragDepth.current = 0;
            setDragActive(false);
        }
    }, []);

    const openFilePicker = useCallback(() => {
        if (!loading && inputRef.current) {
            inputRef.current.click();
        }
    }, [loading]);

    const handleAreaClick = useCallback((e) => {
        if (e.target.closest('.upload-label')) return;
        openFilePicker();
    }, [openFilePicker]);

    const cancelProcessing = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setLoading(false);
        }
    }, []);

    const renderedImages = useMemo(() => (
        images.map((img, index) => (
            <div
                key={img.id}
                className="image-container"
                style={{ animationDelay: `${Math.min(index, 4) * 60}ms` }}
            >
                <div>
                    <h2>Original</h2>
                    <img src={img.original} alt="Original" className="image-preview" loading="lazy" />
                </div>
                <div>
                    <h2>Without Background</h2>
                    <img src={img.result} alt="Background Removed" className="image-preview" loading="lazy" />
                    <a href={img.result} download={`background_removed_${img.id}.png`} className="download-btn">
                        Download
                    </a>
                </div>
            </div>
        ))
    ), [images]);

    return (
        <div className="container">
            <h1>Background Remover</h1>

            <div
                className={`drop-area ${dragActive ? 'drag-over' : ''}`}
                onClick={handleAreaClick}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                role="region"
                aria-label="File drop area. Drag and drop images here, or use the upload button."
            >
                <svg className="drop-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <p className="drop-title">Drag & drop images here, or click anywhere</p>
                <label className={`upload-label ${loading ? 'disabled' : ''}`}>
                    Click to Upload
                    <input
                        ref={inputRef}
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

            {loading && (
                <div className="loading-state" role="status" aria-live="polite">
                    <div className="spinner"></div>
                    <p className="loading-text">Removing backgrounds…</p>
                </div>
            )}
            {error && <p className="error" role="alert">{error}</p>}

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
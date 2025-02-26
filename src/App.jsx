import React, { useState, useRef, useCallback, useMemo } from 'react';
import { removeBackground } from '@imgly/background-removal';
import './Css/App.css';

function App() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);

    const handleFileChange = useCallback((e) => {
        const files = Array.from(e.target.files);
        processImages(files);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        processImages(files);
    }, []);

    const processImages = useCallback(async (files) => {
        setError(null);
        setLoading(true);
        abortControllerRef.current = new AbortController();

        try {
            const newImages = await Promise.all(
                files.map(async (file) => {
                    if (!file.type.startsWith('image/')) {
                        throw new Error("Only image files are allowed.");
                    }
                    if (file.size > 5 * 1024 * 1024) { // 5MB limit
                        throw new Error("File size should be under 5MB.");
                    }

                    const originalImageUrl = URL.createObjectURL(file);
                    const resultBlob = await removeBackground(file, { signal: abortControllerRef.current.signal });
                    const resultImageUrl = URL.createObjectURL(resultBlob);

                    return { original: originalImageUrl, result: resultImageUrl };
                })
            );

            setImages((prevImages) => [...prevImages, ...newImages]);
        } catch (err) {
            if (err.name === "AbortError") {
                console.log("Processing canceled.");
            } else {
                setError(err.message);
            }
        }

        setLoading(false);
    }, []);

    const cancelProcessing = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setLoading(false);
        }
    }, []);

    const renderedImages = useMemo(() => (
        images.map((img, index) => (
            <div key={index} className="image-container">
                <div>
                    <h2>Original</h2>
                    <img src={img.original} alt="Original" className="image-preview" loading="lazy" />
                </div>
                <div>
                    <h2>Without Background</h2>
                    <img src={img.result} alt="Background Removed" className="image-preview" loading="lazy" />
                    <a href={img.result} download={`background_removed_${index}.png`}>
                        <button className="download-btn">Download</button>
                    </a>
                </div>
            </div>
        ))
    ), [images]);

    return (
        <>
            <div className="container">
                <h1>Background Remover</h1>

                <div 
                    className="drop-area" 
                    onDragOver={(e) => e.preventDefault()} 
                    onDrop={handleDrop}
                >
                    <p>Drag & Drop images here or click below</p>
                    <input type="file"  accept="image/*" multiple onChange={handleFileChange} />
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
        </>
    );
}

export default App;

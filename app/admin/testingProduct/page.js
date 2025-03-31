'use client';

import { useState } from 'react';

export default function ProductForm() {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [gif, setGif] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content) return alert('Content is required');

        const formData = new FormData();
        formData.append('content', content);
        formData.append('userId', '1'); // Example user ID
        if (image) formData.append('image', image);
        if (gif) formData.append('gif', gif);

        try {
            setLoading(true);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json(); // ✅ Catch backend errors
                throw new Error(errorData.error);
            }

            const data = await response.json();

            alert('✅ Successfully uploaded!');
            console.log('Uploaded Data:', data);
        } catch (error) {
            console.error('❌ Upload failed:', error.message);
            alert(`Failed to upload file: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter content..."
                required
            />

            <input
                type="file"
                accept="image/jpeg, image/png, image/webp"
                onChange={(e) => setImage(e.target.files[0])}
            />
            <input
                type="file"
                accept="image/gif"
                onChange={(e) => setGif(e.target.files[0])}
            />

            <button type="submit" disabled={loading}>
                {loading ? 'Uploading...' : 'Upload'}
            </button>
        </form>
    );
}

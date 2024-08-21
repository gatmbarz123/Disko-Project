import React, { useState } from 'react';
import All from './All'; 

export function CopyImageForm({ cluster }: { cluster: string }) {
    const [formData, setFormData] = useState({
        images: [] as string[],
        new_registry: '',
        tag: '',
        username: '',
        password: '',
        target_username: '',
        target_password: '',
    });

    const [availableImages, setAvailableImages] = useState<string[]>([]);
    const [message, setMessage] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleImagesFetched = (images: string[]) => {
        setAvailableImages(images);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, selectedOptions } = e.target as HTMLSelectElement;
        if (type === "select-multiple" && name === "images") {
            const selectedImages = Array.from(selectedOptions as HTMLOptionsCollection).map(
                (option) => option.value
            );
            setFormData({
                ...formData,
                images: selectedImages,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('');

        const query = new URLSearchParams(formData as any).toString();

        try {
            const response = await fetch(`/api/copyimage?${query}`, {
                method: 'GET',
            });

            if (response.ok) {
                const result = await response.json();
                setMessage('Success: Image(s) copied successfully!');
            } else {
                setMessage('Error in response');
            }
        } catch (error) {
            setMessage('Network error');
        }
    };

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <div>
            <button
                onClick={openModal}
                style={{ backgroundColor: 'blue', color: 'white', padding: '10px', border: 'none', borderRadius: '5px' }}
            >
                Open Copy Image Form
            </button>

            {isOpen && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <button onClick={closeModal} style={styles.closeButton}>X</button>
                        <h1>Copy Image</h1>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="images">Images:</label>
                                <select
                                    id="images"
                                    name="images"
                                    multiple
                                    value={formData.images}
                                    onChange={handleChange}
                                >
                                    {availableImages.map((image) => (
                                        <option key={image} value={image}>
                                            {image}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="new_registry">New Registry URL:</label>
                                <input
                                    type="text"
                                    id="new_registry"
                                    name="new_registry"
                                    value={formData.new_registry}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="target_username">Target Username:</label>
                                <input
                                    type="text"
                                    id="target_username"
                                    name="target_username"
                                    value={formData.target_username}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="target_password">Target Password:</label>
                                <input
                                    type="password"
                                    id="target_password"
                                    name="target_password"
                                    value={formData.target_password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="tag">Tag:</label>
                                <input
                                    type="text"
                                    id="tag"
                                    name="tag"
                                    value={formData.tag}
                                    onChange={handleChange}
                                />
                            </div>
                            <button type="submit">Submit</button>
                        </form>
                        {message && <p>{message}</p>}
                    </div>
                </div>
            )}

            
            <All cluster={cluster} onImagesFetched={handleImagesFetched} />
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed' as 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        position: 'relative' as 'relative',
    },
    closeButton: {
        position: 'absolute' as 'absolute',
        top: '10px',
        right: '10px',
        background: 'red',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
    },
};

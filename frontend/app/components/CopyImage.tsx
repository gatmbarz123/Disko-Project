"use client";
import { useState } from 'react';

export function CopyImageForm() {
  const [formData, setFormData] = useState({
    images: [] as string[],
    new_registry: '',
    tag: '',
    username: '',
    password: '',
    target_username: '',
    target_password: '',
    source_username: '',  // Add this line
    source_password: '',  // Add this line
  });

  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Handle form data change
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
  

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(''); // Clear any previous messages

    try {
      const response = await fetch('/api/copyimage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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

  // Open and close modal handlers
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div>
      {/* Button to open the CopyImageForm modal */}
      <button
        onClick={openModal}
        style={{ backgroundColor: 'blue', color: 'white', padding: '10px', border: 'none', borderRadius: '5px' }}
      >
        Open Copy Image Form
      </button>

      {/* Modal for CopyImageForm */}
      {isOpen && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <button onClick={closeModal} style={styles.closeButton}>X</button>
            <h1>Copy Image</h1>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="source_username">Source Username:</label>
                <input
                  type="text"
                  id="source_username"
                  name="source_username"
                  value={formData.source_username}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="source_password">Source Password:</label>
                <input
                  type="password"
                  id="source_password"
                  name="source_password"
                  value={formData.source_password}
                  onChange={handleChange}
                />
              </div>
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
                <label htmlFor="new_registry">New Registry:</label>
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
    </div>
  );
}

// Modal styles
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
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    textAlign: 'center' as 'center',
    lineHeight: '30px',
    cursor: 'pointer',
  },
};

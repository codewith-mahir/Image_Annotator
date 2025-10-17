import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';

const UploadPanel = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const queryClient = useQueryClient();

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files || []));
    setMessage(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (selectedFiles.length === 0) {
      setMessage({ type: 'error', text: 'Please select files to upload.' });
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('files', file);
    });

    try {
      setIsUploading(true);
      setMessage(null);
      await apiClient.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSelectedFiles([]);
      setMessage({ type: 'success', text: 'Files uploaded successfully.' });
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to upload files. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="panel">
      <h2>Upload Files</h2>
      <form className="upload-form" onSubmit={handleSubmit}>
        <label className="file-input">
          <span>Select files to upload</span>
          <input type="file" multiple onChange={handleFileChange} />
        </label>

        {selectedFiles.length > 0 && (
          <ul className="file-list">
            {selectedFiles.map((file) => (
              <li key={file.name}>
                {file.name} <small>({Math.round(file.size / 1024)} KB)</small>
              </li>
            ))}
          </ul>
        )}

        <button type="submit" className="primary" disabled={isUploading}>
          {isUploading ? 'Uploading…' : 'Upload Files'}
        </button>
      </form>

      {message && <p className={`message ${message.type}`}>{message.text}</p>}
    </section>
  );
};

export default UploadPanel;

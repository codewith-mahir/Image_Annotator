import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';

const fetchAssignments = async () => {
  const response = await apiClient.get('/media/assignments');
  return response.data.items;
};

const AnnotatePanel = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const {
    data: items = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['assignments'],
    queryFn: fetchAssignments
  });

  const hasItems = items.length > 0;
  const selectedItem = hasItems ? items[selectedIndex] : null;

  return (
    <section className="panel annotate">
      <div className="annotate-header">
        <h2>Annotate Files</h2>
        <button type="button" className="secondary" onClick={() => refetch()}>
          Refresh
        </button>
      </div>

      {isLoading && <p>Loading assignments…</p>}
      {isError && <p className="message error">Failed to load assignments.</p>}

      {!isLoading && !isError && !hasItems && <p>No files assigned to you yet.</p>}

      {hasItems && (
        <div className="annotate-content">
          <aside className="annotate-list">
            <ul>
              {items.map((item, index) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={index === selectedIndex ? 'list-item active' : 'list-item'}
                    onClick={() => setSelectedIndex(index)}
                  >
                    <span>{item.originalName}</span>
                    <small>{item.mimeType}</small>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div className="annotate-viewer">
            {selectedItem?.mimeType?.startsWith('image/') ? (
              <img src={selectedItem.url} alt={selectedItem.originalName} />
            ) : (
              <div className="non-image">
                <p>This file type is not previewable. Download it to review.</p>
                <a href={selectedItem?.url} target="_blank" rel="noreferrer" className="primary">
                  Download {selectedItem?.originalName}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default AnnotatePanel;

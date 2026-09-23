import { useState, type DragEvent } from 'react';
import { useImageLoader } from '../hooks/useImageLoader';
import { useChannelVisibility } from '../hooks/useChannelVisibility';
import { CanvasViewer } from './CanvasViewer/CanvasViewer';
import { FileToolbar } from './FileToolbar/FileToolbar';
import { StatusBar } from './StatusBar/StatusBar';
import { ChannelsPanel } from './ChannelsPanel/ChannelsPanel';
import styles from './App.module.css';

function App() {
  const { image, fileName, error, loadFile } = useImageLoader();
  const { profile, visibility, toggle, displayPixels } = useChannelVisibility(image);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      loadFile(file);
    }
  };

  return (
    <div className="app">
      <header className={styles.header}>
        <FileToolbar image={image} onFileSelected={loadFile} />
      </header>
      <main className={styles.main}>
        <div
          className={`${styles.canvasArea} ${isDragging ? styles.canvasAreaDragging : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CanvasViewer image={image} displayPixels={displayPixels} />
        </div>
        <aside className={styles.sidebar}>
          {image && profile ? (
            <ChannelsPanel image={image} profile={profile} visibility={visibility} onToggle={toggle} />
          ) : (
            <div className={styles.sidebarHint}>Панель каналов появится после загрузки изображения</div>
          )}
        </aside>
      </main>
      <footer className={styles.footer}>
        <StatusBar image={image} fileName={fileName} error={error} />
      </footer>
    </div>
  );
}

export default App;

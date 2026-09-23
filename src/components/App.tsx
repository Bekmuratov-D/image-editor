import { useState, type DragEvent } from 'react';
import { useImageLoader } from '../hooks/useImageLoader';
import { CanvasViewer } from './CanvasViewer/CanvasViewer';
import { FileToolbar } from './FileToolbar/FileToolbar';
import { StatusBar } from './StatusBar/StatusBar';
import styles from './App.module.css';

function App() {
  const { image, fileName, error, loadFile } = useImageLoader();
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
      <main
        className={`${styles.main} ${isDragging ? styles.mainDragging : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CanvasViewer image={image} />
      </main>
      <footer className={styles.footer}>
        <StatusBar image={image} fileName={fileName} error={error} />
      </footer>
    </div>
  );
}

export default App;

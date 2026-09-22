import { useImageLoader } from '../hooks/useImageLoader';
import { CanvasViewer } from './CanvasViewer/CanvasViewer';
import { FileToolbar } from './FileToolbar/FileToolbar';
import { StatusBar } from './StatusBar/StatusBar';
import styles from './App.module.css';

function App() {
  const { image, fileName, error, loadFile } = useImageLoader();

  return (
    <div className="app">
      <header className={styles.header}>
        <FileToolbar onFileSelected={loadFile} />
      </header>
      <main className={styles.main}>
        <CanvasViewer image={image} />
      </main>
      <footer className={styles.footer}>
        <StatusBar image={image} fileName={fileName} error={error} />
      </footer>
    </div>
  );
}

export default App;

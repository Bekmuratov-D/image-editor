import { useState, type DragEvent } from 'react';
import { useImageLoader } from '../hooks/useImageLoader';
import { useChannelVisibility } from '../hooks/useChannelVisibility';
import { useEyedropper } from '../hooks/useEyedropper';
import { useLevelsDialog } from '../hooks/useLevelsDialog';
import { useResizeDialog } from '../hooks/useResizeDialog';
import { useZoom } from '../hooks/useZoom';
import { CanvasViewer } from './CanvasViewer/CanvasViewer';
import { FileToolbar } from './FileToolbar/FileToolbar';
import { StatusBar } from './StatusBar/StatusBar';
import { ChannelsPanel } from './ChannelsPanel/ChannelsPanel';
import { EyedropperButton } from './EyedropperTool/EyedropperButton';
import { EyedropperReadout } from './EyedropperTool/EyedropperReadout';
import { LevelsButton } from './LevelsTool/LevelsButton';
import { LevelsDialog } from './LevelsTool/LevelsDialog';
import { ResizeButton } from './ResizeTool/ResizeButton';
import { ResizeDialog } from './ResizeTool/ResizeDialog';
import styles from './App.module.css';

function App() {
  const { image, fileName, error, loadFile, replaceImage } = useImageLoader();
  const levels = useLevelsDialog(image, { onApply: replaceImage });
  const resize = useResizeDialog(image, { onApply: replaceImage });
  const { profile, visibility, toggle, displayPixels } = useChannelVisibility(image, levels.previewPixels);
  const zoom = useZoom(image, displayPixels);
  const eyedropper = useEyedropper(image);
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
        <EyedropperButton active={eyedropper.active} disabled={!image} onToggle={eyedropper.toggle} />
        <LevelsButton disabled={!image} onOpen={levels.open} />
        <ResizeButton disabled={!image} onOpen={resize.open} />
      </header>
      <main className={styles.main}>
        <div
          ref={zoom.containerRef}
          className={`${styles.canvasArea} ${isDragging ? styles.canvasAreaDragging : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CanvasViewer
            image={image}
            displayPixels={zoom.zoomedPixels}
            canvasWidth={zoom.canvasWidth}
            canvasHeight={zoom.canvasHeight}
            eyedropperActive={eyedropper.active}
            onPixelPick={eyedropper.pickAt}
          />
        </div>
        <aside className={styles.sidebar}>
          {image && profile ? (
            <>
              <ChannelsPanel image={image} profile={profile} visibility={visibility} onToggle={toggle} />
              <EyedropperReadout active={eyedropper.active} result={eyedropper.result} />
            </>
          ) : (
            <div className={styles.sidebarHint}>Панель каналов появится после загрузки изображения</div>
          )}
        </aside>
      </main>
      <footer className={styles.footer}>
        <StatusBar
          image={image}
          fileName={fileName}
          error={error}
          zoomPercent={zoom.zoomPercent}
          onZoomChange={zoom.setZoomPercent}
        />
      </footer>
      <LevelsDialog image={image} levels={levels} />
      <ResizeDialog image={image} resize={resize} />
    </div>
  );
}

export default App;

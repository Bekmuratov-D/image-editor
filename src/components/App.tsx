import styles from './App.module.css';

function App() {
  return (
    <div className="app">
      <header className={styles.header}>{/* сюда встанет FileToolbar */}</header>
      <main className={styles.main}>{/* сюда встанет CanvasViewer */}</main>
      <footer className={styles.footer}>{/* сюда встанет StatusBar */}</footer>
    </div>
  );
}

export default App;

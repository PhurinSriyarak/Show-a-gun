import React, { useState, useCallback } from 'react';
import Viewer from './components/Viewer';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  const [selectedParts, setSelectedParts] = useState({});
  const [baseColor, setBaseColor] = useState('#222');
  const [cameraPreset, setCameraPreset] = useState('overview');

  const handleSelectPart = (category, part) => {
    setSelectedParts(prev => ({
      ...prev,
      [category]: part
    }));
  };

  const takeScreenshot = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `ar15_build_${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  }, []);

  return (
    <div className="app-container">
      <Sidebar
        onSelectPart={handleSelectPart}
        selectedParts={selectedParts}
        onTakeScreenshot={takeScreenshot}
      />

      <main className="viewer-container">
        <Viewer
          selectedParts={selectedParts}
          baseColor={baseColor}
          cameraPreset={cameraPreset}
        />

        {/* Floating Controls Overlay */}
        <div className="overlay-controls">
          <div className="camera-presets">
            <button onClick={() => setCameraPreset('overview')}>OVERVIEW</button>
            <button onClick={() => setCameraPreset('front')}>FRONT</button>
            <button onClick={() => setCameraPreset('rear')}>REAR</button>
            <button onClick={() => setCameraPreset('side')}>SIDE</button>
          </div>

          <div className="color-selector">
            <button style={{ background: '#222' }} onClick={() => setBaseColor('#222')} title="Black" />
            <button style={{ background: '#4b4b4b' }} onClick={() => setBaseColor('#4b4b4b')} title="Gray" />
            <button style={{ background: '#7f7158' }} onClick={() => setBaseColor('#7f7158')} title="FDE" />
            <button style={{ background: '#4a5340' }} onClick={() => setBaseColor('#4a5340')} title="OD Green" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

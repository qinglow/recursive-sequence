import React, { useState, useEffect } from 'react';

interface SequenceMasterProps {
  appId: string;
  onRenameWindow: (id: string, newTitle: string) => void;
  onOpenApp: (baseApp: string, title: string, iconType: string, content?: string) => void;
}

const SequenceMaster: React.FC<SequenceMasterProps> = ({ appId, onRenameWindow, onOpenApp }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const totalBlocks = 20;
  const activeBlocks = Math.floor((loadingProgress / 100) * totalBlocks);

  // Manage internal loading state & trigger window rename
  useEffect(() => {
    if (loadingProgress < 100) {
      const timer = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev + 3 >= 100) {
            clearInterval(timer);
            setTimeout(() => {
              setIsLoaded(true);
              onRenameWindow(appId, 'main_menu.exe'); // Rename the window!
            }, 400);
            return 100;
          }
          return prev + 3;
        });
      }, 150);
      return () => clearInterval(timer);
    }
  }, [loadingProgress, appId, onRenameWindow]);

  if (!isLoaded) {
    return (
      <div className="window-content sequence-app">
        <h1 className="main-title">SEQUENCE MASTER</h1>
        <hr />
        <div className="text-content">
          <h3>Recursion</h3>
          <p>A sequence a1, a2, a3, ..., an, ... is called a recursive sequence if it is defined as follows:</p>
          <ul>
            <li>A number of terms of the sequence a1, a2, ..., ar are given. These are called the <span className="highlight">initial values</span>.</li>
            <li>A rule called the recursion is given, which explains how an is computed in terms of previous terms in the sequence, <span className="highlight">if n &gt; r</span>.</li>
            <li>The terms of a recursive sequence can be numbers, graphs, or other objects.</li>
          </ul>
        </div>
        <div className="loading-section">
          <div className="segmented-progress-bar">
            {[...Array(totalBlocks)].map((_, i) => (
              <div key={i} className={`progress-block ${i < activeBlocks ? 'filled' : ''}`}></div>
            ))}
          </div>
          <p className="loading-text">LOADING...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="window-content sequence-app menu-view">
      <h1 className="main-title">SEQUENCE MASTER</h1>
      <hr />
      
      <div className="menu-buttons-container">
         {/* Open Fibonacci App */}
        <button 
          className="sequence-menu-btn" 
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => onOpenApp('fibonacci', 'fibonacci.exe', 'terminal')}
        >
          <span style={{ color: '#0055a4', fontSize: '16px' }}>▤</span> FIBONACCI SEQUENCE
        </button>
        
        {/* Open Lucas App */}
        <button 
          className="sequence-menu-btn" 
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => onOpenApp('lucas', 'lucas.exe', 'terminal')}
        >
          <span style={{ color: '#b48600', fontSize: '16px', fontWeight: 'bold' }}>Σ</span> LUCAS SEQUENCE
        </button>
        
       {/* Open Tribonacci App */}
        <button 
          className="sequence-menu-btn" 
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => onOpenApp('tribonacci', 'tribonacci.exe', 'terminal')}
        >
          <span style={{ color: '#2e8b57', fontSize: '16px', fontWeight: 'bold' }}>#</span> TRIBONACCI SEQUENCE
        </button>
      </div>
    </div>
  );
};

export default SequenceMaster;
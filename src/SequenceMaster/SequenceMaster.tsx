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

  // 1. The Animation Ticker (Runs completely independently)
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 3;
      });
    }, 150);
    
    // Cleanup the interval if the user closes the window early
    return () => clearInterval(timer);
  }, []); // <--- EMPTY DEPENDENCY ARRAY: The timer will never be interrupted!

  // 2. The Completion Trigger
  useEffect(() => {
    if (loadingProgress >= 100 && !isLoaded) {
      const finishTimer = setTimeout(() => {
        setIsLoaded(true);
        onRenameWindow(appId, 'main_menu.exe'); // Rename the window!
      }, 400);
      
      return () => clearTimeout(finishTimer);
    }
  }, [loadingProgress, isLoaded, appId, onRenameWindow]);

  if (!isLoaded) {
    return (
      <div className="window-content sequence-app" style={{ padding: '20px', fontFamily: 'monospace' }}>
        <h1 className="main-title" style={{ color: '#0000aa', textAlign: 'center' }}>SEQUENCE MASTER</h1>
        <hr style={{ border: '1px solid #ccc', marginBottom: '20px' }} />
        
        <div className="text-content" style={{ lineHeight: '1.6' }}>
          <h3 style={{ color: '#0000aa' }}>Recursion</h3>
          <p>A sequence a1, a2, a3, ..., an, ... is called a recursive sequence if it is defined as follows:</p>
          <ul style={{ paddingLeft: '20px' }}>
            <li style={{ marginBottom: '10px' }}>A number of terms of the sequence a1, a2, ..., ar are given. These are called the <span style={{ fontWeight: 'bold', color: '#0000aa' }}>initial values</span>.</li>
            <li style={{ marginBottom: '10px' }}>A rule called the recursion is given, which explains how an is computed in terms of previous terms in the sequence, <span style={{ fontWeight: 'bold', color: '#0000aa' }}>if n &gt; r</span>.</li>
            <li>The terms of a recursive sequence can be numbers, graphs, or other objects.</li>
          </ul>
        </div>

        {/* --- FIXED LOADING SECTION --- */}
        <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '3px', border: '3px solid #0000aa', padding: '3px', width: '80%', maxWidth: '300px', height: '24px', backgroundColor: '#fff' }}>
            {[...Array(totalBlocks)].map((_, i) => (
              <div 
                key={i} 
                style={{ 
                  flex: 1, 
                  backgroundColor: i < activeBlocks ? '#0000aa' : 'transparent',
                  transition: 'background-color 0.1s' 
                }} 
              />
            ))}
          </div>
          <p style={{ marginTop: '15px', color: '#0000aa', fontWeight: 'bold', letterSpacing: '1px' }}>LOADING...</p>
        </div>

      </div>
    );
  }

  return (
    <div className="window-content sequence-app menu-view" style={{ padding: '20px', textAlign: 'center' }}>
      <h1 className="main-title" style={{ color: '#0000aa' }}>SEQUENCE MASTER</h1>
      <hr style={{ border: '1px solid #ccc', marginBottom: '30px' }} />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
         {/* Open Fibonacci App */}
        <button 
          style={{ width: '80%', padding: '15px', border: '2px solid #000', backgroundColor: '#eee', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'monospace' }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => onOpenApp('fibonacci', 'fibonacci.exe', 'terminal')}
        >
          <span style={{ color: '#0055a4', fontSize: '16px', marginRight: '10px' }}>▤</span> FIBONACCI SEQUENCE
        </button>
        
        {/* Open Lucas App */}
        <button 
          style={{ width: '80%', padding: '15px', border: '2px solid #000', backgroundColor: '#eee', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'monospace' }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => onOpenApp('lucas', 'lucas.exe', 'terminal')}
        >
          <span style={{ color: '#b48600', fontSize: '16px', fontWeight: 'bold', marginRight: '10px' }}>Σ</span> LUCAS SEQUENCE
        </button>
        
       {/* Open Tribonacci App */}
        <button 
          style={{ width: '80%', padding: '15px', border: '2px solid #000', backgroundColor: '#eee', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'monospace' }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => onOpenApp('tribonacci', 'tribonacci.exe', 'terminal')}
        >
          <span style={{ color: '#2e8b57', fontSize: '16px', fontWeight: 'bold', marginRight: '10px' }}>#</span> TRIBONACCI SEQUENCE
        </button>
      </div>
    </div>
  );
};

export default SequenceMaster;
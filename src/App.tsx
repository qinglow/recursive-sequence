import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import SequenceMaster from './SequenceMaster';
import LucasSequence from './LucasSequence';
import FibonacciSequence from './FibonacciSequence';
import TribonacciSequence from './TribonacciSequence';
import LinuxCLI from './LinuxCLI';     
import MusicPlayer from './MusicPlayer'; 

// ==========================================
// IMAGE IMPORTS 
// ==========================================
import bgImg from './assets/bg.png';
import donutIcon from './assets/donut.png';
import dewberIcon from './assets/Dewber.png';
import cakeIcon from './assets/Cake.png';
import hambrgIcon from './assets/Hambrg.png';
import pieIcon from './assets/Pie.png';
import avocadoIcon from './assets/Avocado.png';
import shakeIcon from './assets/Shake.png';
import mySequencesIcon from './assets/Seperate sprites/app.png';
import iceCreamIcon from './assets/IceCream.png';
import trashIcon from './assets/Seperate sprites/recycle bin.png';
import musicIconImg from './assets/Seperate sprites/video player.png';   
import stickyIconImg from './assets/Seperate sprites/note.png'; 
import docIconImg from './assets/Seperate sprites/word document.png';      
// ==========================================

const BACKGROUNDS = [
  `url(${bgImg})`, 
  '#008080', // Classic Windows 95 Teal
  '#3a6ea5', // Deep OS Blue
  '#55aa55'  // Retro Green
];

// --- CUSTOM SVG ICONS FOR TASKBAR ---
const StartIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="7" height="7" fill="white" />
    <rect x="8" y="0" width="7" height="7" fill="white" />
    <rect x="0" y="8" width="7" height="7" fill="white" />
    <rect x="8" y="8" width="7" height="7" fill="white" />
  </svg>
);

const TerminalIcon: React.FC = () => (
  <svg width="14" height="12" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="16" height="14" fill="black" stroke="black" strokeWidth="1" />
    <rect x="0" y="0" width="16" height="4" fill="white" />
    <path d="M2 6L5 8.5L2 11" stroke="white" strokeWidth="1.5" />
    <line x1="6" y1="11" x2="10" y2="11" stroke="white" strokeWidth="1.5" />
  </svg>
);

const AsciiAnimation: React.FC<{ content: string }> = ({ content }) => {
  const [frameIndex, setFrameIndex] = useState(0);

  const frames = [
    `\n  (\\_/) \n ( •_•) \n />[${content}]\n`,
    `\n  (\\_/) \n ( >_<) \n />[${content}] *nom*\n`,
    `\n  (\\_/) \n ( •_•) \n />[${content}]\n`,
    `\n  (\\_/) \n ( ^_^) \n />[  ] *burp!*\n`
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIndex(prev => (prev + 1) % frames.length);
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <pre style={{ fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.2', color: '#000', marginTop: '15px', textAlign: 'left' }}>
      {frames[frameIndex]}
    </pre>
  );
};

const SpeakerIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 6V10H5L9 14V2L5 6H2Z" fill="black" />
    <path d="M11 5C12.5 6.5 12.5 9.5 11 11" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M13 3C15.5 5.5 15.5 10.5 13 13" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const renderIcon = (type: string) => {
  switch (type) {
    case 'terminal': return <TerminalIcon />;
    case 'doc': return <img src={docIconImg} alt="doc" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />;
    case 'sticky': return <img src={stickyIconImg} alt="notes" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />;
    case 'music': return <img src={musicIconImg} alt="music" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />;
    default: return <img src={docIconImg} alt="doc" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />;
  }
};

interface AppWindow {
  id: string;
  baseApp: string;
  title: string;
  iconType: string;
  isActive: boolean;
  isMinimized: boolean;
  x: number;
  y: number;
  content?: string;
}

interface SysStats {
  cpu: number;
  ram: string;
  temp: number;
}

function App() {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [sysStats, setSysStats] = useState<SysStats>({ cpu: 133, ram: '16.00', temp: 34 });
  
  // Volume state
  const [globalVolume, setGlobalVolume] = useState<number>(0.5); 
  const [showVolumeMenu, setShowVolumeMenu] = useState<boolean>(false);

  const [bgIndex, setBgIndex] = useState(0);
  const [customBg, setCustomBg] = useState<string | null>(null); 
  const [contextMenu, setContextMenu] = useState<{ show: boolean, x: number, y: number }>({ show: false, x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // UPDATED: Dynamically calculate starting positions
  const [openWindows, setOpenWindows] = useState<AppWindow[]>(() => {
    // Get screen width safely
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    
    return [
      // Linux CLI positioned next to 2nd column of icons (x: 200) and middle of screen vertically (y: 150)
      { id: 'linux-cli-init', baseApp: 'linus-cli', title: 'hi!@FakeOS:~', iconType: 'terminal', isActive: false, isMinimized: false, x: 200, y: 150 },
      // System Stats perfectly aligned to top right
      { id: 'stats-init', baseApp: 'stats', title: 'SYSTEM_STATS.LOG', iconType: 'terminal', isActive: true, isMinimized: false, x: Math.max(screenWidth - 270, 500), y: 20 }
    ];
  });

  const [stickyText, setStickyText] = useState<string>(() => {
    return localStorage.getItem('desktopStickyNote') || 'Type your notes here...';
  });

  const dragInfo = useRef<{ id: string | null; offsetX: number; offsetY: number }>({
    id: null,
    offsetX: 0,
    offsetY: 0
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const isStatsOpen = openWindows.some(w => w.baseApp === 'stats' && !w.isMinimized);
    if (isStatsOpen) {
      const interval = setInterval(() => {
        setSysStats({
          cpu: Math.floor(130 + Math.random() * 8),
          ram: (16 + (Math.random() * 0.4 - 0.2)).toFixed(2),
          temp: Math.floor(34 + Math.random() * 3)
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [openWindows]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragInfo.current.id) {
        const { id, offsetX, offsetY } = dragInfo.current;
        setOpenWindows(prev => prev.map(w =>
          w.id === id ? { ...w, x: e.clientX - offsetX, y: e.clientY - offsetY } : w
        ));
      }
    };
    const handleMouseUp = () => dragInfo.current.id = null;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleOpenApp = (baseApp: string, appTitle: string, iconType: string, content?: string) => {
    setOpenWindows(prev => {
      const existingApp = prev.find(w => w.baseApp === baseApp && w.title === appTitle);
      if (existingApp) {
        return prev.map(w =>
          (w.baseApp === baseApp && w.title === appTitle) ? { ...w, isActive: true, isMinimized: false } : { ...w, isActive: false }
        );
      } else {
        const uniqueId = `${baseApp}-${Date.now()}`;
        const offset = prev.length * 30;
        return [
          ...prev.map(w => ({ ...w, isActive: false })),
          { id: uniqueId, baseApp, title: appTitle, iconType, isActive: true, isMinimized: false, x: 150 + offset, y: 100 + offset, content }
        ];
      }
    });
  };

  const handleRenameWindow = (appId: string, newTitle: string) => setOpenWindows(prev => prev.map(w => w.id === appId ? { ...w, title: newTitle } : w));
  const handleCloseApp = (appId: string) => setOpenWindows(openWindows.filter(w => w.id !== appId));
  const handleMinimizeApp = (appId: string) => setOpenWindows(prev => prev.map(w => w.id === appId ? { ...w, isMinimized: true, isActive: false } : w));
  
  const handleTaskbarClick = (appId: string) => {
    setOpenWindows(prev => prev.map(w => {
      if (w.id === appId) return (w.isActive && !w.isMinimized) ? { ...w, isMinimized: true, isActive: false } : { ...w, isMinimized: false, isActive: true };
      return { ...w, isActive: false };
    }));
  };

  const handleWindowInteraction = (appId: string) => setOpenWindows(prev => prev.map(w => ({ ...w, isActive: w.id === appId })));

  const startDrag = (e: React.MouseEvent, appId: string) => {
    const win = openWindows.find(w => w.id === appId);
    if (!win) return;
    dragInfo.current = { id: appId, offsetX: e.clientX - win.x, offsetY: e.clientY - win.y };
    handleWindowInteraction(appId);
  };

  const handleStickyNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStickyText(e.target.value);
    localStorage.setItem('desktopStickyNote', e.target.value);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault(); 
    const target = e.target as HTMLElement;
    if (target.classList.contains('desktop-container') || target.classList.contains('icons-grid')) {
      setContextMenu({ show: true, x: e.pageX, y: e.pageY });
    }
  };

  const closeContextMenu = () => {
    if (contextMenu.show) setContextMenu({ show: false, x: 0, y: 0 });
  };

  const cycleWallpaper = () => {
    setCustomBg(null);
    setBgIndex(prev => (prev + 1) % BACKGROUNDS.length);
    closeContextMenu();
  };

  const handleCustomWallpaperClick = () => {
    fileInputRef.current?.click();
    closeContextMenu();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCustomBg(`url(${imageUrl})`); 
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div 
      className="desktop-container" 
      style={{ background: customBg || BACKGROUNDS[bgIndex], backgroundSize: 'cover', backgroundPosition: 'center' }}
      onContextMenu={handleContextMenu}
      onClick={closeContextMenu}
    >

      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        style={{ display: 'none' }} 
      />

      {contextMenu.show && (
        <div style={{
          position: 'absolute',
          top: contextMenu.y,
          left: contextMenu.x,
          background: '#c0c0c0',
          border: '2px solid #fff',
          borderRightColor: '#000',
          borderBottomColor: '#000',
          padding: '2px',
          zIndex: 9999,
          minWidth: '170px',
          boxShadow: '2px 2px 0px rgba(0,0,0,0.5)'
        }}>
          <div 
            onClick={cycleWallpaper}
            style={{ padding: '6px 12px', cursor: 'pointer', fontSize: '12px', userSelect: 'none' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#0000a8'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#000'; }}
          >
            Next Preset Background
          </div>
          <div 
            onClick={handleCustomWallpaperClick}
            style={{ padding: '6px 12px', cursor: 'pointer', fontSize: '12px', userSelect: 'none' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#0000a8'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#000'; }}
          >
            Set Custom Wallpaper...
          </div>
        </div>
      )}

      {/* Desktop Icons */}
      <div className="icons-grid">
        <div className="desktop-icon" onClick={() => handleOpenApp('food', 'Donut.exe', 'doc', 'Donut')}><img src={donutIcon} alt="Donut" /><span>Donut</span></div>
        <div className="desktop-icon" onClick={() => handleOpenApp('food', 'Dewber.exe', 'doc', 'Dewber')}><img src={dewberIcon} alt="Dewber" /><span>Dewber</span></div>
        <div className="desktop-icon" onClick={() => handleOpenApp('food', 'Cake.exe', 'doc', 'Cake')}><img src={cakeIcon} alt="Cake" /><span>Cake</span></div>
        <div className="desktop-icon" onClick={() => handleOpenApp('food', 'Hambrg.exe', 'doc', 'Hambrg')}><img src={hambrgIcon} alt="Hambrg" /><span>Hambrg</span></div>
        <div className="desktop-icon" onClick={() => handleOpenApp('food', 'Pie.exe', 'doc', 'Pie')}><img src={pieIcon} alt="Pie" /><span>Pie</span></div>
        <div className="desktop-icon" onClick={() => handleOpenApp('stats', 'SYSTEM_STATS.LOG', 'terminal')}><img src={avocadoIcon} alt="Avocado.txt" /><span>Sys Stats</span></div>
        <div className="desktop-icon" onClick={() => handleOpenApp('food', 'Shake.exe', 'doc', 'Shake')}><img src={shakeIcon} alt="Shake" /><span>Shake</span></div>

        <div className="desktop-icon" onClick={() => handleOpenApp('loading', 'system_loading.exe', 'doc')}>
          <img src={mySequencesIcon} alt="My Sequences" /><span>My Sequences</span>
        </div>

        <div className="desktop-icon" onClick={() => handleOpenApp('music', 'Media Player', 'music')}>
          <img src={musicIconImg} alt="Music" /><span>Music</span>
        </div>

        <div className="desktop-icon" onClick={() => handleOpenApp('sticky', 'Sticky Notes', 'sticky')}>
          <img src={stickyIconImg} alt="Notes" /><span>Notes</span>
        </div>
        <div className="desktop-icon" onClick={() => handleOpenApp('food', 'Ice_Cream.exe', 'doc', 'Ice Cream')}><img src={iceCreamIcon} alt="Ice Cream" /><span>Ice Cream</span></div>
        <div className="desktop-icon trash-icon"><img src={trashIcon} alt="Trash" /><span>Trash</span></div>
      </div>

    {/* Render All Open Windows */}
      {openWindows.map(app => {
        return (
          <div
            key={app.id}
            className={`os-window ${app.isActive ? 'active-window' : ''}`}
            style={{
              display: app.isMinimized ? 'none' : undefined, 
              
              left: `${app.x}px`,
              top: `${app.y}px`,
              zIndex: app.isActive ? 10 : 5,
              width: app.baseApp === 'stats' ? '250px' : app.baseApp === 'linus-cli' ? '500px' : undefined
            }}
            onMouseDown={(e) => startDrag(e, app.id)}
          >
            <div className="window-header">
              <div className="window-title">
                <span className="window-icon">
                  {app.baseApp === 'lucas' ? <span style={{ fontWeight: 'bold', color: '#000' }}>Σ</span> :
                    app.baseApp === 'tribonacci' ? <span style={{ fontWeight: 'bold', color: '#fff' }}>#</span> :
                      renderIcon(app.iconType)}
                </span>
                {app.title}
              </div>
              <div className="window-controls" onMouseDown={(e) => e.stopPropagation()}>
                <button className="ctrl-btn min" onClick={(e) => { e.stopPropagation(); handleMinimizeApp(app.id); }}>_</button>
                <button className="ctrl-btn max">□</button>
                {app.baseApp !== 'linus-cli' && (
                  <button className="ctrl-btn close-red" onClick={(e) => { e.stopPropagation(); handleCloseApp(app.id); }}>×</button>
                )}
              </div>
            </div>

            {/* Application Rendering Router */}
            {app.baseApp === 'food' && (
              <div className="window-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100px' }}>
                <h3 style={{ margin: 0, color: 'var(--os-blue)', textAlign: 'center' }}>I love that {app.content} ♥ ദ്ദി ˉ͈̀꒳ˉ͈́ )✧</h3>
                <AsciiAnimation content={app.content || 'Snack'} />
              </div>
            )}

            {app.baseApp === 'stats' && (
              <div className="stats-body terminal-style">
                <p>CPU: {sysStats.cpu} MHz</p><p>RAM: {sysStats.ram} MB</p><p>DISK: 500 MB</p>
                <p>TEMP: {sysStats.temp} C</p><p className="blinking">STATUS: RUNNING...</p><p>--</p><p>ALGO_ID: LUG-04</p>
              </div>
            )}

            {app.baseApp === 'loading' && <SequenceMaster appId={app.id} onRenameWindow={handleRenameWindow} onOpenApp={handleOpenApp} />}
            {app.baseApp === 'lucas' && <LucasSequence />}
            {app.baseApp === 'fibonacci' && <FibonacciSequence />}
            {app.baseApp === 'tribonacci' && <TribonacciSequence />}
            {app.baseApp === 'linus-cli' && <LinuxCLI />}
            
            {/* Added globalVolume prop right here */}
            {app.baseApp === 'music' && <MusicPlayer globalVolume={globalVolume} />}

            {app.baseApp === 'sticky' && (
              <div className="window-content sticky-content">
                <textarea className="sticky-textarea" value={stickyText} onChange={handleStickyNoteChange} onMouseDown={(e) => e.stopPropagation()} placeholder="Write your desktop notes here..." />
              </div>
            )}
          </div>
        );
      })}

      {/* Bottom Taskbar */}
      <div className="taskbar">
        <div className="start-button"><StartIcon /> Start</div>
        <div className="taskbar-apps" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {openWindows.map(app => (
            <div key={app.id} className={`taskbar-item ${app.isActive && !app.isMinimized ? 'active' : ''}`} onClick={() => handleTaskbarClick(app.id)}>
              <span className="task-icon">
                {app.baseApp === 'lucas' ? <span style={{ fontWeight: 'bold' }}>Σ</span> :
                  app.baseApp === 'tribonacci' ? <span style={{ fontWeight: 'bold' }}>#</span> :
                    renderIcon(app.iconType)}
              </span> {app.title}
            </div>
          ))}
        </div>
        <div className="taskbar-spacer"></div>
        
       {/* TRAY WITH VOLUME CONTROL */}
        <div className="tray">
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            
           {/* Clickable Speaker Icon */}
            <div 
              onClick={() => setShowVolumeMenu(!showVolumeMenu)} 
              style={{ cursor: 'pointer', display: 'flex', padding: '2px' }}
            >
              <SpeakerIcon />
            </div>

            {/* Vertical Volume Popup Menu */}
            {showVolumeMenu && (
              <div style={{
                position: 'absolute',
                bottom: '100%',
                right: '0',
                background: '#c0c0c0',
                border: '2px solid #fff',
                borderRightColor: '#000',
                borderBottomColor: '#000',
                padding: '10px',
                marginBottom: '4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                zIndex: 9999,
                boxShadow: '2px 2px 0px rgba(0,0,0,0.5)'
              }}>
                <input 
                  type="range" 
                  orient="vertical" /* <-- THIS FIXES FIREFOX & DRAG BEHAVIOR */
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={globalVolume}
                  onChange={(e) => setGlobalVolume(parseFloat(e.target.value))}
                  style={{ 
                    cursor: 'pointer',
                    appearance: 'slider-vertical', 
                    WebkitAppearance: 'slider-vertical', 
                    width: '20px', 
                    height: '100px', 
                    margin: '0'
                  }}
                />
                <SpeakerIcon />
              </div>
            )}
          </div>
          
          <span className="time">{currentTime}</span>
        </div>
      </div>
    </div>
  );
}

export default App;
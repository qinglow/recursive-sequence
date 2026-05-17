import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { SleepIcon, PowerIcon, RestartIcon } from './SystemIcons';
import SequenceMaster from './SequenceMaster/SequenceMaster';
import LucasSequence from './SequenceMaster/LucasSequence';
import FibonacciSequence from './SequenceMaster/FibonacciSequence';
import TribonacciSequence from './SequenceMaster/TribonacciSequence';
import LinuxCLI from './LinuxCLI';
import MusicPlayer from './MusicPlayer';
import CollatzSequence from './CollatzSequence';
import DivisionQuest from './DivisionQuest/DivisionQuest';
import { ShutdownScreen, SleepScreen, LoginScreen } from './OSScreens';

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
import calculatorIcon from './assets/Seperate sprites/calculator.png'
import collatzIconImg from './assets/bread-export.gif';
// ==========================================

const BACKGROUNDS = [
  `url(${bgImg})`,
  '#008080',
  '#3a6ea5',
  '#55aa55'
];

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
    <pre className="ascii-animation">
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
    case 'collatz': return <img src={collatzIconImg} alt="collatz" className="icon-small" />;
    case 'doc': return <img src={docIconImg} alt="doc" className="icon-small" />;
    case 'sticky': return <img src={stickyIconImg} alt="notes" className="icon-small" />;
    case 'music': return <img src={musicIconImg} alt="music" className="icon-small" />;
    default: return <img src={docIconImg} alt="doc" className="icon-small" />;
  }
};

interface AppWindow {
  id: string;
  baseApp: string;
  title: string;
  iconType: string;
  isActive: boolean;
  isMinimized: boolean;
  isMaximized?: boolean;
  x: number;
  y: number;
  content?: string;
}

interface SysStats {
  cpu: number;
  ram: string;
  temp: number;
}

// --- EXTRACTED DEFAULT STARTUP WINDOWS ---
const getDefaultWindows = (): AppWindow[] => {
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 768;

  const statsX = Math.max(screenWidth - 270, 500);
  const statsY = 20;

  const cliWidth = 500;
  const cliHeight = 350;
  const cliX = Math.max(screenWidth - cliWidth - 20, 100);
  const cliY = Math.max(screenHeight - cliHeight - 60, 100);

  // Using Date.now() ensures unique IDs even upon restart
  const runId = Date.now();

  return [
    { id: `stats-init-${runId}`, baseApp: 'stats', title: 'SYSTEM_STATS.LOG', iconType: 'terminal', isActive: false, isMinimized: false, x: statsX, y: statsY },
    { id: `linux-cli-init-${runId}`, baseApp: 'linus-cli', title: 'hi!@FakeOS:~', iconType: 'terminal', isActive: true, isMinimized: false, x: cliX, y: cliY }
  ];
};

function App() {
  // --- OS STATE LOGIC ---
  const [osState, setOsState] = useState<'login' | 'desktop' | 'sleep' | 'shutdown'>('login');
  const [showStartMenu, setShowStartMenu] = useState(false);

  const [currentTime, setCurrentTime] = useState<string>('');
  const [sysStats, setSysStats] = useState<SysStats>({ cpu: 133, ram: '16.00', temp: 34 });

  const [globalVolume, setGlobalVolume] = useState<number>(0.5);
  const [showVolumeMenu, setShowVolumeMenu] = useState<boolean>(false);

  const [bgIndex, setBgIndex] = useState(0);
  const [customBg, setCustomBg] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ show: boolean, x: number, y: number }>({ show: false, x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [openWindows, setOpenWindows] = useState<AppWindow[]>(getDefaultWindows());

  const [stickyText, setStickyText] = useState<string>(() => {
    return localStorage.getItem('desktopStickyNote') || 'Type your notes here...';
  });

  const dragInfo = useRef<{ id: string | null; offsetX: number; offsetY: number }>({
    id: null, offsetX: 0, offsetY: 0
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
    if (isStatsOpen && osState === 'desktop') {
      const interval = setInterval(() => {
        setSysStats({
          cpu: Math.floor(130 + Math.random() * 8),
          ram: (16 + (Math.random() * 0.4 - 0.2)).toFixed(2),
          temp: Math.floor(34 + Math.random() * 3)
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [openWindows, osState]);

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (dragInfo.current.id) {
        const { id, offsetX, offsetY } = dragInfo.current;

        // Check if it's a touch event or mouse event
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        setOpenWindows(prev => prev.map(w =>
          w.id === id ? { ...w, x: clientX - offsetX, y: clientY - offsetY } : w
        ));
      }
    };

    const handleUp = () => dragInfo.current.id = null;

    // Listen for both mouse and touch
    document.addEventListener('mousemove', handleMove as EventListener);
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('touchmove', handleMove as EventListener, { passive: false });
    document.addEventListener('touchend', handleUp);

    return () => {
      document.removeEventListener('mousemove', handleMove as EventListener);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchmove', handleMove as EventListener);
      document.removeEventListener('touchend', handleUp);
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

        const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
        const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 768;

        let wWidth = 500;
        let wHeight = 350;

        if (baseApp === 'collatz') {
          wWidth = 700;
          wHeight = 550;
        } else if (baseApp === 'loading') {
          wWidth = 500;
          wHeight = 350;
        } else if (baseApp === 'stats') {
          wWidth = 250;
          wHeight = 350;
        } else if (baseApp === 'lucas' || baseApp === 'fibonacci' || baseApp === 'tribonacci') {
          wWidth = 500;
          wHeight = 400;
        }

        const centerX = Math.max((screenWidth - wWidth) / 2, 0);
        const centerY = Math.max((screenHeight - wHeight) / 2 - 20, 0);
        const autoMaximize = baseApp === 'division-rpg';

        return [
          ...prev.map(w => ({ ...w, isActive: false })),
          {
            id: uniqueId,
            baseApp,
            title: appTitle,
            iconType,
            isActive: true,
            isMinimized: false,
            isMaximized: autoMaximize,
            x: centerX,
            y: centerY,
            content
          }
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

  const handleMaximizeApp = (appId: string) => {
    setOpenWindows(prev => prev.map(w =>
      w.id === appId ? { ...w, isMaximized: !w.isMaximized } : w
    ));
  };

  const handleWindowInteraction = (appId: string) => setOpenWindows(prev => prev.map(w => ({ ...w, isActive: w.id === appId })));

  const startDrag = (e: React.MouseEvent | React.TouchEvent, appId: string) => {
    const win = openWindows.find(w => w.id === appId);
    if (!win) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    dragInfo.current = { id: appId, offsetX: clientX - win.x, offsetY: clientY - win.y };
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

  const handleDesktopClick = () => {
    closeContextMenu();
    setShowStartMenu(false);
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

  // --- RESTART LOGIC ---
  const handleRestart = () => {
    setShowStartMenu(false);
    setOpenWindows(getDefaultWindows()); // Restores your default Terminals!
    setOsState('login');
  };

  // ==========================================
  // OS FULLSCREEN VIEWS (Power, Login, Sleep)
  // ==========================================

  if (osState === 'shutdown') {
    return <ShutdownScreen onPowerOn={() => setOsState('login')} />;
  }

  if (osState === 'sleep') {
    return <SleepScreen onWake={() => setOsState('login')} />;
  }

  if (osState === 'login') {
    return <LoginScreen onLogin={() => setOsState('desktop')} bgImage={customBg || BACKGROUNDS[bgIndex]} />;
  }

  // ==========================================
  // DESKTOP VIEW
  // ==========================================

  return (
    // eslint-disable-next-line no-inline-styles
    <div
      className="desktop-container"
      style={{
        '--bg-image': `${customBg || BACKGROUNDS[bgIndex]}`,
      } as React.CSSProperties & Record<string, string>}
      onContextMenu={handleContextMenu}
      onClick={handleDesktopClick}
    >
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden-file-input" aria-label="Upload wallpaper image" />

      {contextMenu.show && (
        // eslint-disable-next-line no-inline-styles
        <div
          className="context-menu"
          style={{
            '--menu-top': `${contextMenu.y}px`,
            '--menu-left': `${contextMenu.x}px`,
          } as React.CSSProperties & Record<string, string>}
        >
          <div className="context-menu-item" onClick={cycleWallpaper}>
            Next Preset Background
          </div>
          <div className="context-menu-item" onClick={handleCustomWallpaperClick}>
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

        <div className="desktop-icon" onClick={() => handleOpenApp('collatz', 'Collatz Serve', 'collatz')}>
          <img src={collatzIconImg} alt="Collatz" /><span>Collatz Serve</span>
        </div>

        <div className="desktop-icon" onClick={() => handleOpenApp('division-rpg', 'Division Quest', 'doc')}>
          <img src={calculatorIcon} alt="Division RPG" /><span>Division Quest</span>
        </div>

        <div className="desktop-icon" onClick={() => handleOpenApp('loading', 'system_loading.exe', 'doc')}>
          <img src={mySequencesIcon} alt="My Sequences" /><span>Sequence Master</span>
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
          // eslint-disable-next-line no-inline-styles
          <div
            key={app.id}
            className={`os-window ${app.isActive ? 'active-window' : ''}`}
            style={{
              display: app.isMinimized ? 'none' : 'flex',
              '--window-left': app.isMaximized ? '0px' : `${app.x}px`,
              '--window-top': app.isMaximized ? '0px' : `${app.y}px`,
              '--window-width': app.isMaximized ? '100%' : (app.baseApp === 'stats' ? '250px' : app.baseApp === 'collatz' ? '700px' : app.baseApp === 'division-rpg' ? '680px' : '500px'),
              '--window-height': app.isMaximized ? 'calc(100vh - 35px)' : (app.baseApp === 'collatz' ? '550px' : app.baseApp === 'division-rpg' ? '480px' : 'auto'),
              '--window-max-height': app.isMaximized ? 'none' : 'none',
              '--window-z-index': app.isActive ? '10' : '5',
            } as React.CSSProperties & Record<string, string>}
            onMouseDown={(e) => startDrag(e, app.id)}
            onTouchStart={(e) => startDrag(e, app.id)}
          >
            <div className="window-header">
              <div className="window-title">
                <span className="window-icon">
                  {app.baseApp === 'lucas' ? <span className="window-icon-text">Σ</span> :
                    app.baseApp === 'tribonacci' ? <span className="window-icon-text white">#</span> :
                      renderIcon(app.iconType)}
                </span>
                {app.title}
              </div>
              <div className="window-controls" onMouseDown={(e) => e.stopPropagation()}>
                <button className="ctrl-btn min" onClick={(e) => { e.stopPropagation(); handleMinimizeApp(app.id); }}>_</button>
                <button className="ctrl-btn max" onClick={(e) => { e.stopPropagation(); handleMaximizeApp(app.id); }}>□</button>
                {app.baseApp !== 'linus-cli' && (
                  <button className="ctrl-btn close-red" onClick={(e) => { e.stopPropagation(); handleCloseApp(app.id); }}>×</button>
                )}
              </div>
            </div>

            {/* Application Rendering Router */}
            {app.baseApp === 'food' && (
              <div className="window-content food-display">
                <h3>I love that {app.content} ♥ ദ്ദി ˉ͈̀꒳ˉ͈́ ✧</h3>
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
            {app.baseApp === 'collatz' && <CollatzSequence />}

            {app.baseApp === 'division-rpg' && <DivisionQuest />}

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

        {/* --- START MENU BUTTON AND DROPDOWN --- */}
        <div style={{ position: 'relative' }}>
          {showStartMenu && (
            <div style={{
              position: 'absolute',
              bottom: '100%',
              left: '0',
              backgroundColor: '#c0c0c0',
              border: '2px solid #fff',
              borderRightColor: '#888',
              borderBottomColor: '#888',
              padding: '2px',
              display: 'flex',
              flexDirection: 'column',
              width: '180px',
              zIndex: 1000,
              boxShadow: '2px 2px 5px rgba(0,0,0,0.5)'
            }}>
              <div style={{ backgroundColor: '#0000aa', color: 'white', padding: '10px', fontWeight: 'bold', fontFamily: 'sans-serif' }}>
                FakeOS
              </div>
              <div
                onClick={() => { setShowStartMenu(false); setOsState('sleep'); }}
                style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #999', display: 'flex', gap: '10px', alignItems: 'center' }}
              >
                <SleepIcon /> Sleep
              </div>
              <div
                onClick={handleRestart}
                style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #999', display: 'flex', gap: '10px', alignItems: 'center' }}
              >
                <RestartIcon /> Restart
              </div>
              <div
                onClick={() => { setShowStartMenu(false); setOsState('shutdown'); }}
                style={{ padding: '10px', cursor: 'pointer', display: 'flex', gap: '10px', alignItems: 'center' }}
              >
                <PowerIcon /> Shut Down
              </div>
            </div>
          )}
          <div className="start-button" onClick={(e) => { e.stopPropagation(); setShowStartMenu(!showStartMenu); }}>
            <StartIcon /> Start
          </div>
        </div>

        <div className="taskbar-apps">
          {openWindows.map(app => (
            <div key={app.id} className={`taskbar-item ${app.isActive && !app.isMinimized ? 'active' : ''}`} onClick={() => handleTaskbarClick(app.id)}>
              <span className="task-icon">
                {app.baseApp === 'lucas' ? <span className="window-icon-text">Σ</span> :
                  app.baseApp === 'tribonacci' ? <span className="window-icon-text">#</span> :
                    renderIcon(app.iconType)}
              </span> {app.title}
            </div>
          ))}
        </div>
        <div className="taskbar-spacer"></div>

        {/* TRAY WITH VOLUME CONTROL */}
        <div className="tray">
          <div className="tray-volume-container">
            <div className="tray-volume-icon" onClick={() => setShowVolumeMenu(!showVolumeMenu)}>
              <SpeakerIcon />
            </div>
            {showVolumeMenu && (
              <div className="volume-menu">
                <input type="range" {...{ orient: "vertical" }} min="0" max="1" step="0.01" value={globalVolume} onChange={(e) => setGlobalVolume(parseFloat(e.target.value))}
                  className="volume-slider"
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
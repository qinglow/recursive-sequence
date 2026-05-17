import React, { useState } from 'react';
import SleepingGif1 from './assets/8-export.gif';
import SleepingGif2 from './assets/catSleeping-export.gif';

// ==========================================
// SHUTDOWN SCREEN
// ==========================================
interface ShutdownScreenProps {
  onPowerOn: () => void;
}
export const ShutdownScreen: React.FC<ShutdownScreenProps> = ({ onPowerOn }) => {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '40px' }}>
      
      {/* SHRUNK GIF & ADDED FLOATING ANIMATION */}
      <img 
        src={SleepingGif2} 
        alt="Power Off" 
        className="floating-element"
        style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }} 
      />

      <button 
        onClick={onPowerOn}
        style={{ padding: '20px 40px', fontSize: '24px', cursor: 'pointer', backgroundColor: '#222', color: 'white', border: '4px solid #555', borderRadius: '10px', fontFamily: '"Press Start 2P", monospace' }}
      >
        POWER ON
      </button>

      {/* FLOAT CSS */}
      <style>{`
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0px); } }
        .floating-element { animation: float 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

// ==========================================
// SLEEP SCREEN
// ==========================================
interface SleepScreenProps {
  onWake: () => void;
}
export const SleepScreen: React.FC<SleepScreenProps> = ({ onWake }) => {
  return (
    <div 
      onClick={onWake} 
      style={{ width: '100vw', height: '100vh', backgroundColor: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#888', cursor: 'pointer', fontFamily: 'monospace', fontSize: '40px', gap: '20px' }}
    >
      
      {/* SHRUNK GIF & ADDED FLOATING ANIMATION */}
      <img 
        src={SleepingGif1} 
        alt="Sleeping" 
        className="floating-element"
        style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }} 
      />

      <div className="floating-element" style={{ textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>zZzZz...</div>
      
      {/* FLOAT CSS */}
      <style>{`
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0px); } }
        .floating-element { animation: float 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

// ==========================================
// LOGIN SCREEN
// ==========================================
interface LoginScreenProps {
  onLogin: () => void;
  bgImage: string;
}
export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, bgImage }) => {
  const [password, setPassword] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPassword('');
    onLogin();
  };

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#2e3440', backgroundImage: bgImage, backgroundSize: 'cover', backgroundBlendMode: 'multiply', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: 'rgba(0,0,0,0.6)', padding: '50px', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', backdropFilter: 'blur(5px)', border: '2px solid rgba(255,255,255,0.1)' }}>
        
        {/* PIXEL ART STAR SVG */}
        <div style={{ marginBottom: '20px', backgroundColor: '#fff', borderRadius: '50%', width: '120px', height: '120px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
          <svg width="60" height="60" viewBox="0 0 14 14" fill="#222" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
            <rect x="6" y="1" width="2" height="2" />
            <rect x="6" y="3" width="2" height="2" />
            <rect x="2" y="5" width="10" height="2" />
            <rect x="4" y="7" width="6" height="2" />
            <rect x="3" y="9" width="2" height="2" />
            <rect x="9" y="9" width="2" height="2" />
            <rect x="2" y="11" width="2" height="2" />
            <rect x="10" y="11" width="2" height="2" />
          </svg>
        </div>

        <h2 style={{ marginBottom: '30px', fontSize: '24px', letterSpacing: '1px', fontFamily: '"Press Start 2P", cursive', textShadow: '2px 2px 0px #000' }}>
          User
        </h2>
        
        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input 
            type="password" 
            placeholder="Enter Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            style={{ padding: '12px 20px', fontSize: '16px', borderRadius: '25px', border: 'none', textAlign: 'center', width: '250px', outline: 'none', boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.3)' }}
          />
          <button type="submit" style={{ marginTop: '20px', padding: '10px 30px', borderRadius: '20px', border: 'none', backgroundColor: '#89b4fa', color: '#111', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
            ➔
          </button>
        </form>
      </div>
    </div>
  );
};
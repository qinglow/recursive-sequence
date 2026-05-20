import React, { useState, useEffect, useRef } from 'react';

// --- BACKGROUNDS & UI ---
import curtainLeftImg from '../assets/CollatzOmakase/cirtainLeft.png';
import curtainRightImg from '../assets/CollatzOmakase/cirtainRight.png';
import bgImg from '../assets/CollatzOmakase/bg.png'; 

// --- MUSIC IMPORT ---
import bgmSfx from '../assets/CollatzOmakase/Cooking Mama 3 Music - What Shall We Cook Today _.mp3';

// --- SUSHI IMPORTS ---
import firstWin from '../assets/CollatzOmakase/Sushi/FirstWin.png';
import secondWin from '../assets/CollatzOmakase/Sushi/SecondWin.png';
import thirdWin from '../assets/CollatzOmakase/Sushi/ThirdWin.png';
import forthWin from '../assets/CollatzOmakase/Sushi/ForthWin.png';
import fifthWin from '../assets/CollatzOmakase/Sushi/FifthWin.png';
import sixthWin from '../assets/CollatzOmakase/Sushi/SixthWin.png';
import seventhWin from '../assets/CollatzOmakase/Sushi/SeventhWin.png';

// --- DESSERT IMPORTS ---
import d1 from '../assets/CollatzOmakase/Desserts/BakewellTart.png';
import d2 from '../assets/CollatzOmakase/Desserts/BananaSplit.png';
import d3 from '../assets/CollatzOmakase/Desserts/BanoffeePot 1.png';
import d4 from '../assets/CollatzOmakase/Desserts/BerryWaffles.png';
import d5 from '../assets/CollatzOmakase/Desserts/BlueJelly.png';
import d6 from '../assets/CollatzOmakase/Desserts/CarrotCake.png';
import d7 from '../assets/CollatzOmakase/Desserts/Cheesecake.png';
import d8 from '../assets/CollatzOmakase/Desserts/ChocolateCake.png';
import d9 from '../assets/CollatzOmakase/Desserts/ChocolateDonut.png';
import d10 from '../assets/CollatzOmakase/Desserts/ChocolateSwissRoll.png';
import d11 from '../assets/CollatzOmakase/Desserts/Cinnamonroll.png';
import d12 from '../assets/CollatzOmakase/Desserts/CookieCheesecake.png';
import d13 from '../assets/CollatzOmakase/Desserts/Croissant 2.png';
import d14 from '../assets/CollatzOmakase/Desserts/FrenchFancies.png';
import d15 from '../assets/CollatzOmakase/Desserts/IceCreamWaffles.png';
import d16 from '../assets/CollatzOmakase/Desserts/LemonCake.png';
import d17 from '../assets/CollatzOmakase/Desserts/Macrons.png';
import d18 from '../assets/CollatzOmakase/Desserts/Pancakes 2.png';
import d19 from '../assets/CollatzOmakase/Desserts/RainbowCake.png';
import d20 from '../assets/CollatzOmakase/Desserts/RedVelvetCake.png';
import d21 from '../assets/CollatzOmakase/Desserts/StrawberryDonut.png';
import d22 from '../assets/CollatzOmakase/Desserts/Tirimasu.png';
import d23 from '../assets/CollatzOmakase/Desserts/Waffles.png';

const SUSHI_MENU = [firstWin, secondWin, thirdWin, forthWin, fifthWin, sixthWin, seventhWin];
const DESSERT_MENU = [d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17, d18, d19, d20, d21, d22, d23];

type GameStage = 'CLOSED' | 'TITLE' | 'LOADING' | 'ORDER' | 'REWARD' | 'DONE';
type MenuType = 'SUSHI' | 'DESSERT';

const CollatzSequence: React.FC = () => {
  const [stage, setStage] = useState<GameStage>('CLOSED');
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  
  // Math & Logic State
  const [inputValue, setInputValue] = useState<string>('');
  const [sequence, setSequence] = useState<number[]>([]);
  const [menuType, setMenuType] = useState<MenuType>('SUSHI'); 
  
  // Receipt & Game Tracking State
  const [receiptToken, setReceiptToken] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [playCount, setPlayCount] = useState<number>(0);

  // --- AUDIO CONTROLS ---
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    bgmRef.current = new Audio(bgmSfx);
    bgmRef.current.loop = true;
    bgmRef.current.volume = 0.4;
    
    // Attempt to play immediately on open
    bgmRef.current.play().catch(() => console.log("Waiting for user click to start BGM..."));

    return () => {
      // Pause and clean up the audio when the app is closed
      bgmRef.current?.pause();
    };
  }, []);

  // Guarantee the music starts upon any mouse click if the browser blocked the initial autoplay
  useEffect(() => {
    const startAudio = () => {
      if (bgmRef.current?.paused) {
        bgmRef.current?.play().catch(() => {});
      }
    };
    document.addEventListener('click', startAudio);
    return () => document.removeEventListener('click', startAudio);
  }, []);

  // 1. Curtain Opening Animation
  useEffect(() => {
    if (stage === 'CLOSED') {
      const timer = setTimeout(() => setStage('TITLE'), 2000); 
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // 2. Loading Bar Animation
  useEffect(() => {
    if (stage === 'LOADING') {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 15) {
            clearInterval(interval);
            setTimeout(() => {
              generateReceiptData();
              setStage('ORDER');
            }, 500); 
            return 15;
          }
          return prev + 1;
        });
      }, 200); 
      return () => clearInterval(interval);
    }
  }, [stage]);

  // 3. AUTO-CALCULATE LOGIC
  useEffect(() => {
    // If the input value is empty, clear the sequence and return early
    if (inputValue === '') {
      setSequence([]);
      return;
    }

    

    // Parse the input string to an integer base 10
    const current = parseInt(inputValue, 10);
    
    // Check for invalid input: if not a number or not positive, set sequence to [-1] representing 'INVALID'
    if (isNaN(current) || current <= 0) {
      setSequence([-1]); // -1 represents 'INVALID'
      return;
    }

    if(current % 2 == 0){
      setSequence([-1]);
      return;
    }
    
    // Calculate valid sequence
    // Initialize the sequence array with the starting number
    let tempSequence: number[] = [current];
    // Start with the input number
    let num = current;
    // Loop until we reach 1 (the termination point of the Collatz sequence)
    while (num !== 1) {
      // If the current number is even, divide it by 2
      if (num % 2 === 0) num = num / 2;
      // If the current number is odd, apply the rule: multiply by 3 and add 1
      else num = (num * 3) + 1;
      // Add the new number to the sequence
      tempSequence.push(num);
    }
    
    // Update the sequence state with the calculated Collatz sequence
    setSequence(tempSequence);
  }, [inputValue]); 

  const generateReceiptData = () => {
    const now = new Date();
    setCurrentDate(now.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }));
    setReceiptToken(`${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`);
  };

  const handleStart = (): void => setStage('LOADING');

  const handleServe = (): void => {
    setPlayCount(prev => prev + 1);
    setStage('REWARD');
  };

  const handleContinue = (): void => {
    setInputValue('');
    setSequence([]);
    generateReceiptData();
    setStage('ORDER');
  };

  const handleDelete = (): void => {
    setInputValue('');
  };

  const resetGame = (): void => {
    setPlayCount(0);
    handleContinue();
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: '#000', overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '550px' }}>
      
      {/* CSS STYLES */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
          .pixel-font { font-family: 'Press Start 2P', cursive; }
          .standard-font { font-family: 'Courier Prime', monospace; }
          
          @keyframes smoothEntrance {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-entrance { animation: smoothEntrance 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
          
          .receipt-paper {
            background-color: #fff;
            position: relative;
            padding-bottom: 20px;
          }
          .receipt-paper::after {
            content: "";
            position: absolute;
            bottom: -10px;
            left: 0;
            right: 0;
            height: 10px;
            background-size: 20px 20px;
            background-image: 
              linear-gradient(45deg, #fff 25%, transparent 25%), 
              linear-gradient(-45deg, #fff 25%, transparent 25%);
            background-position: 0 0, 10px 0;
          }

          /* Custom Scrollbar for Receipt */
          .receipt-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .receipt-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .receipt-scroll::-webkit-scrollbar-thumb {
            background-color: #ccc;
            border-radius: 4px;
          }

          .arcade-btn {
            background-color: #cc0000;
            color: #fff;
            border: 4px solid #800000;
            cursor: pointer;
            box-shadow: 3px 3px 0px rgba(0,0,0,0.3);
            text-align: center;
          }
          .arcade-btn:active:not(:disabled) {
            transform: translate(2px, 2px);
            box-shadow: 1px 1px 0px rgba(0,0,0,0.3);
          }
          .arcade-btn:disabled {
            background-color: #555;
            border-color: #333;
            color: #888;
            cursor: not-allowed;
          }

          /* Responsive Flex Layout */
          .responsive-order-panel {
            display: flex;
            gap: 40px;
            align-items: flex-start;
            justify-content: center;
            width: 100%;
            max-width: 800px;
            margin: auto;
            flex-wrap: wrap; /* Enables stacking on mobile */
            padding: 20px;
            box-sizing: border-box;
          }

          @media (max-width: 650px) {
            .title-text { font-size: 28px !important; }
            .responsive-order-panel { gap: 20px; }
          }
        `}
      </style>

      {/* --- BACKGROUND IMAGE --- */}
      <img src={bgImg} alt="Background" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />

      {/* --- CURTAINS --- */}
      {stage !== 'ORDER' && stage !== 'REWARD' && stage !== 'DONE' && (
        <>
          <img src={curtainLeftImg} alt="Left" style={{ 
            position: 'absolute', left: 0, top: 0, height: '100%', width: '55%', zIndex: 20, 
            objectFit: 'cover', objectPosition: 'right',
            transition: 'transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)', 
            transform: stage === 'CLOSED' ? 'translateX(0)' : 'translateX(-100%)' 
          }} />
          <img src={curtainRightImg} alt="Right" style={{ 
            position: 'absolute', right: 0, top: 0, height: '100%', width: '55%', zIndex: 20, 
            objectFit: 'cover', objectPosition: 'left',
            transition: 'transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)', 
            transform: stage === 'CLOSED' ? 'translateX(0)' : 'translateX(100%)' 
          }} />
        </>
      )}

      {/* --- TITLE SCREEN --- */}
      {stage === 'TITLE' && (
        <div className="animate-entrance" style={{ zIndex: 10, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto' }}>
          <h1 className="pixel-font title-text" style={{ fontSize: '38px', color: '#b30000', textShadow: '4px 4px 0px #fff, -4px -4px 0px #fff, 4px -4px 0px #fff, -4px 4px 0px #fff, 0px 4px 0px #fff, 0px -4px 0px #fff, 4px 0px 0px #fff, -4px 0px 0px #fff', margin: '0 0 40px 0', lineHeight: '1.4' }}>
            COLLATZ<br/>EATS
          </h1>
          <button className="pixel-font arcade-btn" onClick={handleStart} style={{ border: '6px solid #fff', borderRadius: '15px', padding: '18px 35px', fontSize: '24px' }}>START</button>
        </div>
      )}

      {/* --- LOADING SCREEN --- */}
      {stage === 'LOADING' && (
        <div className="animate-entrance" style={{ 
          zIndex: 10, 
          position: 'relative', 
          width: '90%', 
          maxWidth: '600px', 
          backgroundColor: '#e6d5b8',
          border: '6px solid #c9b29b',
          boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          padding: '40px 30px',
          boxSizing: 'border-box', 
          color: '#4a3b2c',
          margin: 'auto'
        }}>
          
          <h2 className="pixel-font" style={{ textAlign: 'center', fontSize: '14px', letterSpacing: '2px', marginBottom: '25px', color: '#63533e' }}>
            COLLATZ EATS
          </h2>
          
          <div className="standard-font" style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'left', width: '100%' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Collatz Sequence</p>
            <p style={{ marginBottom: '10px' }}>A sequence is called a Collatz sequence if it is defined as follows:</p>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              <li style={{ marginBottom: '6px' }}>An initial value 'x' is given.</li>
              <li style={{ marginBottom: '6px' }}>If the previous term is odd, use <span style={{ color: '#b30000', fontWeight: 'bold' }}>3x + 1</span>. If the previous term is even, divide it by 2.</li>
              <li>The sequence will terminate if ever it reaches a value of 1.</li>
            </ul>
          </div>
          
          <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', gap: '2px', border: '3px solid #8c6b4a', padding: '2px', width: '100%', maxWidth: '250px', height: '22px', backgroundColor: '#fff', boxSizing: 'border-box' }}>
              {[...Array(15)].map((_, i) => <div key={i} style={{ flex: 1, backgroundColor: i < loadingProgress ? '#8c6b4a' : 'transparent' }} />)}
            </div>
            <p className="pixel-font" style={{ marginTop: '15px', color: '#8c6b4a', fontSize: '10px' }}>LOADING...</p>
          </div>

        </div>
      )}

      {/* --- GAME STAGE: RECEIPT & ORDER PANEL --- */}
      {stage === 'ORDER' && (
        <div className="animate-entrance responsive-order-panel" style={{ zIndex: 10 }}>
          
          {/* RECEIPT */}
          <div className="receipt-paper standard-font" style={{ width: '100%', maxWidth: '320px', padding: '30px 20px', color: '#000', boxShadow: '0px 15px 25px rgba(0,0,0,0.4)', boxSizing: 'border-box' }}>
            <h3 className="pixel-font" style={{ textAlign: 'center', margin: '0 0 10px 0', fontSize: '12px', color: '#000' }}>COLLATZ EATS</h3>
            <p style={{ textAlign: 'center', fontSize: '9px', margin: '0 0 20px 0' }}>{currentDate}</p>
            
            <div style={{ border: '1px dashed #000', padding: '15px 10px', textAlign: 'center', marginBottom: '20px', borderRadius: '5px' }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '10px' }}>Token</p>
              <p className="pixel-font" style={{ margin: 0, fontSize: '10px' }}>{receiptToken}</p>
            </div>
            
            <p style={{ fontSize: '10px', marginBottom: '20px', lineHeight: '1.5', color: '#333' }}>This program will find all the terms of the Collatz sequence.</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', borderBottom: '1px dotted #ccc', paddingBottom: '10px', marginBottom: '10px' }}>
              <span>Input Initial Value</span>
              <strong>{inputValue ? parseInt(inputValue, 10).toLocaleString('en-US') : '---'}</strong>
            </div>

            <div style={{ minHeight: '60px' }}>
              {sequence.length > 0 && sequence[0] === -1 && (
                <p style={{ color: 'red', fontWeight: 'bold', fontSize: '12px', textAlign: 'center', marginTop: '20px' }}>INVALID OUTPUT</p>
              )}
              {sequence.length > 0 && sequence[0] !== -1 && (
                <div style={{ fontSize: '11px' }}>
                  <p style={{ margin: '10px 0 10px 0' }}>The Collatz sequence are:</p>
                  
                  {/* FIXED: Scrollable area with word-break for long sequences + formatting */}
                  <div className="receipt-scroll" style={{ maxHeight: '120px', overflowY: 'auto', paddingRight: '5px' }}>
                    <p className="pixel-font" style={{ textAlign: 'right', lineHeight: '1.8', fontSize: '9px', wordBreak: 'break-word', margin: 0 }}>
                      {sequence.map(num => num.toLocaleString('en-US')).join(', ')}
                    </p>
                  </div>

                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', borderTop: '1px dotted #ccc', paddingTop: '10px', marginTop: '20px' }}>
              <span>Operator</span>
              <strong>User</strong>
            </div>
          </div>

          {/* ORDER PANEL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', maxWidth: '280px' }}>
            <div style={{ backgroundColor: '#4a2f3f', padding: '25px 20px', width: '100%', border: '6px solid #1c1118', boxSizing: 'border-box', boxShadow: '5px 5px 0px rgba(0,0,0,0.3)' }}>
              
              {/* --- MENU TOGGLE --- */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button 
                  onClick={() => setMenuType('SUSHI')}
                  style={{ flex: 1, padding: '8px', backgroundColor: menuType === 'SUSHI' ? '#cc0000' : 'transparent', color: '#fff', border: menuType === 'SUSHI' ? '2px solid #fff' : '2px solid #888', fontFamily: '"Press Start 2P", cursive', fontSize: '8px', cursor: 'pointer' }}>
                  🍣 SUSHI
                </button>
                <button 
                  onClick={() => setMenuType('DESSERT')}
                  style={{ flex: 1, padding: '8px', backgroundColor: menuType === 'DESSERT' ? '#cc0000' : 'transparent', color: '#fff', border: menuType === 'DESSERT' ? '2px solid #fff' : '2px solid #888', fontFamily: '"Press Start 2P", cursive', fontSize: '8px', cursor: 'pointer' }}>
                  🍰 DESSERT
                </button>
              </div>

              <p className="standard-font" style={{ color: '#dcc7af', margin: '0 0 15px 0', fontSize: '12px', textAlign: 'right', letterSpacing: '1px' }}>INPUT AMOUNT</p>
              <div style={{ display: 'flex', alignItems: 'center', color: '#fff', borderBottom: '2px solid #fff', paddingBottom: '5px' }}>
                <span className="pixel-font" style={{ fontSize: '28px', marginRight: '10px' }}>$</span>
                <input 
                  type="text" 
                  inputMode="numeric"
                  value={inputValue ? parseInt(inputValue, 10).toLocaleString('en-US') : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    // Strip commas to get the raw number
                    const rawValue = e.target.value.replace(/,/g, '');
                    
                    // Only allow digits, and prevent absurdly long numbers from freezing the browser limits
                    if (/^\d*$/.test(rawValue) && rawValue.length <= 15) {
                      setInputValue(rawValue);
                    }
                  }}
                  className="pixel-font"
                  style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', fontSize: '28px', width: '100%', outline: 'none' }}
                  placeholder="0"
                />
                <span style={{ width: '12px', height: '28px', backgroundColor: '#fff', animation: 'blink 1s infinite' }}></span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={handleServe}
                disabled={sequence.length === 0 || sequence[0] === -1} 
                className="arcade-btn"
                style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <span className="pixel-font" style={{ fontSize: '20px' }}>SERVE</span>
                <span className="standard-font" style={{ fontSize: '10px', color: (sequence.length === 0 || sequence[0] === -1) ? '#888' : '#ff9999' }}>PRESS START</span>
              </button>
              <button 
                onClick={handleDelete}
                className="arcade-btn"
                style={{ width: '70px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                <span style={{ fontSize: '16px' }}>⌫</span>
                <span className="pixel-font" style={{ fontSize: '10px' }}>DEL</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- FOOD REWARD STAGE --- */}
      {stage === 'REWARD' && (
        <div className="animate-entrance" style={{ zIndex: 10, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto', padding: '20px' }}>
          
          <img 
            src={menuType === 'SUSHI' 
              ? SUSHI_MENU[Math.max(0, Math.min(playCount - 1, SUSHI_MENU.length - 1))] 
              : DESSERT_MENU[Math.max(0, Math.min(playCount - 1, DESSERT_MENU.length - 1))]} 
            alt={`Served ${menuType} Sequence ${playCount}`} 
            style={
              menuType === 'SUSHI' 
                ? { width: '90%', maxWidth: '700px', objectFit: 'contain', filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.5))' }
                : { width: '100%', maxWidth: '250px', maxHeight: '250px', objectFit: 'contain', imageRendering: 'pixelated', filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.5))' }
            } 
          />

          <div style={{ display: 'flex', gap: '30px', marginTop: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={handleContinue} className="pixel-font arcade-btn" style={{ padding: '20px 40px', fontSize: '16px', borderRadius: '10px' }}>CONTINUE</button>
            <button onClick={() => setStage('DONE')} className="pixel-font arcade-btn" style={{ padding: '20px 40px', fontSize: '16px', borderRadius: '10px', backgroundColor: '#333', borderColor: '#111' }}>END</button>
          </div>

        </div>
      )}

      {/* --- DONE STAGE: THANK YOU --- */}
      {stage === 'DONE' && (
        <div className="animate-entrance" style={{ zIndex: 10, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto' }}>
          <h2 className="pixel-font" style={{ color: '#fff', fontSize: '36px', textShadow: '4px 4px 0px #000', marginBottom: '40px', letterSpacing: '2px', textAlign: 'center' }}>THANK YOU!</h2>

          <button 
            onClick={resetGame}
            style={{ backgroundColor: '#cc0000', border: '6px solid #fff', borderRadius: '50%', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: '36px', boxShadow: '0px 6px 15px rgba(0,0,0,0.6)' }}>
            ↺
          </button>
        </div>
      )}
    </div>
  );
};

export default CollatzSequence;


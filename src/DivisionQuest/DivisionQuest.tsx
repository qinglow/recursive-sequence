import React, { useState, useEffect, useRef } from 'react';
import RunnerEngine from '../RunnerEngine';
import '../DivisionQuest.css';

// --- ASSET IMPORTS ---
import skyImg from '../assets/BeachAssets/sky_ 1.png';
import waveImg from '../assets/BeachAssets/wave.png';
import groundImg from '../assets/BeachAssets/Ground.png';

// --- SFX IMPORTS ---
import bgmSfx from '../assets/BeachSfx/retro-bgm-chan-home-at-night-516298.mp3'; 
import powerUpSfx from '../assets/BeachSfx/power_up.wav';
import hurtSfx from '../assets/BeachSfx/hurt.wav';

type AppStage = 'MENU' | 'LOADING_DIV' | 'LOADING_EUC' | 'GAME_RUNNING' | 'GAME_OVER' | 'GAME_WIN';
type GameMode = 'division' | 'euclidian';

const DivisionQuest: React.FC = () => {
  const [stage, setStage] = useState<AppStage>('MENU');
  const [gameMode, setGameMode] = useState<GameMode>('division');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [blocksSolved, setBlocksSolved] = useState(0);
  
  // --- LAB EXERCISE MODAL STATE ---
  const [isGamePaused, setIsGamePaused] = useState(false); 
  const [isModalActive, setIsModalActive] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  
  // User Inputs
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  
  // Calculated Math Data
  const [mathProblem, setMathProblem] = useState({
    m: 0, n: 0, q: 0, r: 0, gcd: 0, lcm: 0, steps: [] as string[]
  });

  // --- AUDIO REFS & CONTINUOUS PLAY LOGIC ---
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    bgmRef.current = new Audio(bgmSfx);
    bgmRef.current.loop = true;
    bgmRef.current.volume = 0.4; 
    
    bgmRef.current.play().catch(() => console.log("Waiting for user click to start BGM..."));

    return () => {
      bgmRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    const startAudio = () => {
      if (!isGamePaused && bgmRef.current?.paused) {
        bgmRef.current?.play().catch(() => {});
      }
    };
    document.addEventListener('click', startAudio);
    return () => document.removeEventListener('click', startAudio);
  }, [isGamePaused]);

  useEffect(() => {
    if (!isGamePaused) {
      bgmRef.current?.play().catch(() => {});
    } else {
      bgmRef.current?.pause();
    }
  }, [isGamePaused]);

  const isInputInvalid = (input1 !== '' && parseInt(input1, 10) <= 0) || (input2 !== '' && parseInt(input2, 10) <= 0);
  const isComputeDisabled = input1 === '' || input2 === '' || isInputInvalid;

  const preventInvalidChars = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['e', 'E', '+', '-', '.'].includes(e.key)) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'p' || e.key === 'P' || e.key === 'Escape') && stage === 'GAME_RUNNING') {
        setIsGamePaused(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage]);

  useEffect(() => {
    if (stage === 'LOADING_DIV' || stage === 'LOADING_EUC') {
      setLoadingProgress(0);
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 15) {
            clearInterval(interval);
            setTimeout(() => setStage('GAME_RUNNING'), 500); 
            return 15;
          }
          return prev + 1;
        });
      }, 150); 
      return () => clearInterval(interval);
    }
  }, [stage]);

  const triggerMathEncounter = () => {
    new Audio(powerUpSfx).play().catch(() => {}); 
    setIsModalActive(true);
    setShowSolution(false);
    setInput1('');
    setInput2('');
  };

  const triggerGameOver = () => {
    new Audio(hurtSfx).play().catch(() => {}); 
    setStage('GAME_OVER');
  }

  const handleCompute = (e: React.FormEvent) => {
    e.preventDefault();
    
    const val1 = parseInt(input1, 10);
    const val2 = parseInt(input2, 10);

    if (isNaN(val1) || isNaN(val2) || val1 <= 0 || val2 <= 0) return;

    const m = Math.max(val1, val2);
    const n = Math.min(val1, val2);

    if (gameMode === 'division') {
      const q = Math.floor(m / n);
      const r = m % n;
      setMathProblem({ m, n, q, r, gcd: 0, lcm: 0, steps: [] });
    } else {
      let tempM = m;
      let tempN = n;
      let steps = [];
      
      while (tempN > 0) {
        const q = Math.floor(tempM / tempN);
        const r = tempM % tempN;
        if (r === 0) {
          steps.push(`${tempM} = ${tempN}(${q})`);
        } else {
          steps.push(`${tempM} = ${tempN}(${q}) + ${r}`);
        }
        tempM = tempN;
        tempN = r;
      }
      
      const gcd = tempM;
      const lcm = (m * n) / gcd;
      setMathProblem({ m, n, q: 0, r: 0, gcd, lcm, steps });
    }

    setBlocksSolved(prev => prev + 1);
    setShowSolution(true); 
  };

  const resumeRun = () => {
    if (blocksSolved >= 10) {
      setIsModalActive(false);
      setStage('GAME_WIN');
    } else {
      setIsModalActive(false);
      setShowSolution(false);
    }
  };

  // --- NEW: MASTER RESET FUNCTION ---
  // Wipes all memory and returns to the start menu cleanly
  const resetToMainMenu = () => {
    setIsGamePaused(false);
    setIsModalActive(false);
    setShowSolution(false);
    setBlocksSolved(0);
    setInput1('');
    setInput2('');
    setMathProblem({ m: 0, n: 0, q: 0, r: 0, gcd: 0, lcm: 0, steps: [] });
    setStage('MENU');
  };

  return (
    <div className="division-quest-container" style={{ '--bg-sky': `url('${skyImg}')`, '--bg-waves': `url('${waveImg}')`, '--bg-ground': `url('${groundImg}')` } as React.CSSProperties & Record<string, string>}>
      
      {stage !== 'GAME_RUNNING' && (
        <>
          <div className="bg-sky" style={{ backgroundImage: `url('${skyImg}')` }}></div>
          <div className="bg-waves" style={{ backgroundImage: `url('${waveImg}')` }}></div>
          <div className="bg-ground-static" style={{ backgroundImage: `url('${groundImg}')` }}></div>
        </>
      )}

      {stage === 'GAME_RUNNING' && (
        <div className="hud-top">
          <span className={`pixel-font hud-objective ${blocksSolved >= 10 ? 'completed' : ''}`}>
            OBJECTIVE: {blocksSolved} / 10 BLOCKS
          </span>
          <div className="hud-controls">
            <button className="pixel-font hud-button" onClick={() => setIsGamePaused(true)}>PAUSE</button>
          </div>
        </div>
      )}

      <div className="content-wrapper">
        
        {stage === 'MENU' && (
          <div className="retro-modal animate-entrance">
            <div className="retro-modal-inner">
              <h1 className="pixel-font menu-heading">
                MAIN MENU
              </h1>
              <button className="pixel-font menu-btn" onClick={() => { setGameMode('division'); setStage('LOADING_DIV'); }}>DIVISION ALGORITHM</button>
              <button className="pixel-font menu-btn" onClick={() => { setGameMode('euclidian'); setStage('LOADING_EUC'); }}>EUCLIDIAN ALGORITHM</button>
              <p className="pixel-font menu-controls-text">Controls: JUMP = UP/SPACE<br/>PAUSE = P/ESC</p>
            </div>
          </div>
        )}

        {stage === 'LOADING_DIV' && (
          <div className="retro-modal animate-entrance">
            <div className="retro-modal-inner left-align">
              <h2 className="pixel-font loading-heading">DIVISION ALGORITHM</h2>
              <div className="standard-font loading-description">
                <p className="desc-paragraph bold">The Division Algorithm</p>
                <p className="desc-paragraph">Let m and n be positive integers. There are non-negative integers q and r, where 0 ≤ r &lt; n, such that:</p>
                <p className="desc-paragraph bold indented">m = nq + r</p>
                <p>The integer q is the quotient obtained when m is divided by n, while r is the remainder.</p>
              </div>
              <div className="loading-footer">
                <div className="progress-bar">
                  {[...Array(15)].map((_, i) => <div key={i} className={`progress-block ${i < loadingProgress ? 'filled' : ''}`} />)}
                </div>
                <p className="pixel-font loading-text">LOADING...</p>
              </div>
            </div>
          </div>
        )}

        {stage === 'LOADING_EUC' && (
          <div className="retro-modal animate-entrance">
            <div className="retro-modal-inner left-align">
              <h2 className="pixel-font loading-heading">EUCLIDIAN ALGORITHM</h2>
              <div className="standard-font loading-description euclidian">
                <p className="desc-paragraph bold">The Euclidean Algorithm</p>
                <p className="desc-paragraph">Let m and n be positive integers with n ≤ m. Let</p>
                <div className="desc-formula">
                  <p>m = nq₁ + r₁</p>
                  <p>n = r₁q₂ + r₂</p>
                  <p>r₁ = r₂q₃ + r₃</p>
                  <p>...</p>
                  <p>rN-1 = rNqN</p>
                </div>
                <p className="desc-paragraph">be the result of iterating the Division Algorithm, where rN is the last non-zero remainder. Then: <strong>gcd(m,n) = rN</strong></p>
                <p className="desc-paragraph">The greatest common divisor and the least common multiple are related by the formula: <strong>lcm(m,n) = (m * n) / gcd(m,n)</strong></p>
              </div>
              <div className="loading-footer euclidian">
                <div className="progress-bar">
                  {[...Array(15)].map((_, i) => <div key={i} className={`progress-block ${i < loadingProgress ? 'filled' : ''}`} />)}
                </div>
                <p className="pixel-font loading-text">LOADING...</p>
              </div>
            </div>
          </div>
        )}

        {/* --- GAME OVER & WIN MODALS (USING NEW RESET LOGIC) --- */}
        {stage === 'GAME_OVER' && (
          <div className="retro-modal animate-entrance">
            <div className="retro-modal-inner">
              <h1 className="pixel-font modal-heading gameover">GAME OVER</h1>
              <p className="pixel-font modal-text">You hit an obstacle!<br/><br/>Blocks Solved: {blocksSolved}/10</p>
              <button className="pixel-font menu-btn" onClick={resetToMainMenu}>MAIN MENU</button>
            </div>
          </div>
        )}

        {stage === 'GAME_WIN' && (
          <div className="retro-modal animate-entrance win">
            <div className="retro-modal-inner">
              <h1 className="pixel-font modal-heading">VICTORY!</h1>
              <p className="pixel-font modal-text">You solved all 10 Algorithm Blocks!<br/><br/>Laboratory Exercise Complete.</p>
              <button className="pixel-font menu-btn" onClick={resetToMainMenu}>MAIN MENU</button>
            </div>
          </div>
        )}

        {stage === 'GAME_RUNNING' && (
          <div className="game-area">
            
            {!isModalActive && !isGamePaused && blocksSolved === 0 && (
              <div className="pixel-font animate-entrance instructions-overlay" style={{ color: '#ffcc00' }}>
                JUMP (SPACE/UP) TO AVOID OBSTACLES<br/><br/>HIT MYSTERY BLOCKS (?) TO ANSWER!
              </div>
            )}

            <RunnerEngine isPaused={isModalActive || isGamePaused} onHitBox={triggerMathEncounter} onGameOver={triggerGameOver} />

            {/* --- PAUSE MENU MODAL (USING NEW RESET LOGIC) --- */}
            {isGamePaused && (
              <div className="modal-overlay pause" style={{ zIndex: 100 }}>
                <div className="retro-modal animate-entrance pause-modal">
                  <div className="retro-modal-inner custom-padding">
                    <h1 className="pixel-font pause-heading">PAUSED</h1>
                    <button className="pixel-font menu-btn" onClick={() => setIsGamePaused(false)}>RESUME</button>
                    <button className="pixel-font menu-btn" onClick={resetToMainMenu}>EXIT TO MENU</button>
                  </div>
                </div>
              </div>
            )}

            {/* --- LAB EXERCISE MODAL --- */}
            {isModalActive && !isGamePaused && (
              <div className="modal-overlay lab">
                <div className={`retro-modal animate-entrance ${gameMode === 'division' ? 'lab-division' : 'lab-euclidian'}`}>
                  <div className="retro-modal-inner lab-padding">
                    
                    {!showSolution ? (
                      <>
                        <h3 className="pixel-font lab-heading">
                          PROGRAM: {gameMode === 'division' ? 'Division Algorithm' : 'Euclidean Algorithm'}
                        </h3>
                        <form onSubmit={handleCompute} className="lab-form">
                          
                          <div className="lab-inputs-container">
                            <div className="lab-input-group">
                              <span className="pixel-font lab-input-label">Enter first integer:</span>
                              <input type="number" min="1" value={input1} onKeyDown={preventInvalidChars} onChange={(e) => setInput1(e.target.value)} className="pixel-font math-input" autoFocus required title="First integer input" aria-label="First integer" />
                            </div>
                            <div className="lab-input-group">
                              <span className="pixel-font lab-input-label">Enter second integer:</span>
                              <input type="number" min="1" value={input2} onKeyDown={preventInvalidChars} onChange={(e) => setInput2(e.target.value)} className="pixel-font math-input" required title="Second integer input" aria-label="Second integer" />
                            </div>
                          </div>

                          {isInputInvalid && <span className="pixel-font input-error">* Inputs must be positive (&gt; 0)</span>}

                          <button type="submit" className="pixel-font menu-btn compute-btn" disabled={isComputeDisabled}>
                            COMPUTE
                          </button>
                        </form>
                      </>
                    ) : (
                      <div className="standard-font solution-text">
                        <h3 className="solution-heading">SOLUTION:</h3>
                        
                        {gameMode === 'division' ? (
                          <>
                            <p className="solution-formula">{mathProblem.m} = {mathProblem.n}({mathProblem.q}) + {mathProblem.r}</p>
                            <p>The dividend is {mathProblem.m}</p>
                            <p>The divisor is {mathProblem.n}</p>
                            <p>The quotient is {mathProblem.q} and the remainder is {mathProblem.r}</p>
                          </>
                        ) : (
                          <>
                            {mathProblem.steps.map((step, idx) => <p key={idx} className="solution-formula">{step}</p>)}
                            <br/>
                            <p>The integers are {mathProblem.m} and {mathProblem.n}</p>
                            <p>The greatest common divisor of {mathProblem.m} and {mathProblem.n} is {mathProblem.gcd}</p>
                            <p>The least common multiple of {mathProblem.m} and {mathProblem.n} is {mathProblem.lcm}.</p>
                          </>
                        )}

                        <div className="solution-footer">
                          <button onClick={resumeRun} className="pixel-font menu-btn small">CONTINUE</button>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default DivisionQuest;
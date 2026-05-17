import React, { useEffect, useRef, useState } from 'react';

// --- SPRITE IMPORTS ---
import runSprite from './assets/BeachAssets/Run (32x32) 1.png';
import jumpSprite from './assets/BeachAssets/Jump (32x32) 1.png';
import fallSprite from './assets/BeachAssets/Fall (32x32) 1.png';
import doubleJumpSprite from './assets/BeachAssets/Double Jump (32x32) 1.png';
import groundImg from './assets/BeachAssets/Ground.png';
import skyImg from './assets/BeachAssets/sky_ 1.png';
import waveImg from './assets/BeachAssets/wave.png';
import palmImg from './assets/BeachAssets/staticObjects_ 1.png';
import bushImg from './assets/BeachAssets/staticObjects_ 2.png';
import boxImg from './assets/BeachAssets/eventBlock_ 1.png'; 

// --- SFX IMPORTS ---
import jumpSfx from './assets/BeachSfx/jump.wav';

interface Props {
  isPaused: boolean;
  onHitBox: () => void;
  onGameOver: () => void;
}

const RunnerEngine: React.FC<Props> = ({ isPaused, onHitBox, onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const images = useRef<{ [key: string]: HTMLImageElement }>({});

  const gameState = useRef({
    player: { x: 100, y: 300, vy: 0, width: 64, height: 64, frame: 0, ticks: 0, jumpCount: 0 },
    obstacles: [] as { type: string; x: number; y: number; width: number; height: number; hit?: boolean }[],
    groundScrollX: 0,
    waveScrollX: 0,
    skyScrollX: 0,
    frames: 0,
    speed: 6 
  });

  // --- 1. LOAD IMAGES ---
  useEffect(() => {
    const sources = { 
      run: runSprite, jump: jumpSprite, fall: fallSprite, doubleJump: doubleJumpSprite, 
      ground: groundImg, sky: skyImg, wave: waveImg, 
      palm: palmImg, bush: bushImg, box: boxImg 
    };
    let loaded = 0;
    const total = Object.keys(sources).length;

    Object.entries(sources).forEach(([key, src]) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loaded++;
        if (loaded === total) setAssetsLoaded(true);
      };
      img.onerror = () => {
        console.error(`Missing image asset: ${src}`);
        loaded++;
        if (loaded === total) setAssetsLoaded(true); 
      };
      images.current[key] = img;
    });
  }, []);

  // --- 2. DOUBLE JUMP MECHANIC ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault(); 
        if (!isPaused) {
          const p = gameState.current.player;
          if (p.jumpCount < 2) {
            p.vy = -13.5; 
            p.jumpCount++;
            p.ticks = 0; 
            
            // --- PLAY JUMP SFX ---
            const jumpSound = new Audio(jumpSfx);
            jumpSound.play().catch(err => {}); 
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused]);

  // --- 3. MAIN GAME LOOP ---
  useEffect(() => {
    if (!assetsLoaded) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.imageSmoothingEnabled = false;
    let animationId: number;

    const render = () => {
      // --- DYNAMIC RESOLUTION FIX ---
      // This forces the Canvas to re-calculate its own width and height to match its container exactly!
      if (canvas.parentElement) {
        if (canvas.width !== canvas.parentElement.clientWidth) canvas.width = canvas.parentElement.clientWidth;
        if (canvas.height !== canvas.parentElement.clientHeight) canvas.height = canvas.parentElement.clientHeight;
      }

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      const gHeight = 120; 
      const groundY = canvasHeight - gHeight; 
      const floorY = groundY + 20; 

      if (!isPaused) {
        const state = gameState.current;
        const p = state.player;

        // Player Physics
        p.y += p.vy;
        p.vy += 0.7; 
        
        if (p.y >= floorY - p.height) {
          p.y = floorY - p.height;
          p.vy = 0;
          p.jumpCount = 0; 
        }

        p.ticks++;
        state.frames++;

        const sImg = images.current['sky'];
        const wImg = images.current['wave'];
        const gImg = images.current['ground'];

        // --- PERFECT ASPECT RATIO SCROLLING ---
        if (sImg) {
          const skyScale = canvasHeight / sImg.height;
          const sWidth = sImg.width * skyScale;
          state.skyScrollX -= state.speed * 0.1; 
          if (state.skyScrollX <= -sWidth) state.skyScrollX = 0;
        }

        if (wImg) {
          const waveH = 50;
          const waveW = wImg.width * (waveH / wImg.height);
          state.waveScrollX -= state.speed * 0.4; 
          if (state.waveScrollX <= -waveW) state.waveScrollX = 0;
        }

        if (gImg) {
          const gW = gImg.width * (gHeight / gImg.height);
          state.groundScrollX -= state.speed;
          if (state.groundScrollX <= -gW) state.groundScrollX = 0;
        }

        // Spawning Objects based on DYNAMIC Canvas Width
        if (state.frames % 110 === 0) { 
          const rand = Math.random();
          if (rand < 0.3) {
            state.obstacles.push({ type: 'box', x: canvasWidth + 50, y: floorY - 170, width: 64, height: 64 });
          } else if (rand < 0.6) {
            state.obstacles.push({ type: 'bush', x: canvasWidth + 50, y: floorY - 80, width: 35, height: 80 });
          } else {
            state.obstacles.push({ type: 'palm', x: canvasWidth + 50, y: floorY - 160, width: 100, height: 160 });
          }
        }

        // Move and Collide
        for (let i = state.obstacles.length - 1; i >= 0; i--) {
          const obs = state.obstacles[i];
          obs.x -= state.speed;

          const padding = 15;
          if (
            p.x + padding < obs.x + obs.width - padding &&
            p.x + p.width - padding > obs.x + padding &&
            p.y + padding < obs.y + obs.height - padding &&
            p.y + p.height - padding > obs.y + padding
          ) {
            if (obs.type === 'box' && !obs.hit) {
              obs.hit = true; 
              onHitBox();
            } else if (obs.type !== 'box') {
              onGameOver();
            }
          }

          if (obs.x < -200) state.obstacles.splice(i, 1);
        }
      }

      // --- DRAWING ---
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      const state = gameState.current;

      // 1. Draw Sky dynamically filling entire width
      const sImg = images.current['sky'];
      if (sImg) {
        const skyScale = canvasHeight / sImg.height;
        const sWidth = sImg.width * skyScale;
        for(let i=0; i < Math.ceil(canvasWidth / sWidth) + 1; i++){
           ctx.drawImage(sImg, state.skyScrollX + (i * sWidth), 0, sWidth, canvasHeight);
        }
      }

      // 2. Draw Waves dynamically filling entire width
      const wImg = images.current['wave'];
      if (wImg) {
        const waveH = 50;
        const waveW = wImg.width * (waveH / wImg.height);
        for(let i=0; i < Math.ceil(canvasWidth / waveW) + 1; i++){
          ctx.drawImage(wImg, state.waveScrollX + (i * waveW), groundY - waveH + 15, waveW, waveH);
        }
      }

      // 3. Draw Ground dynamically filling entire width
      const gImg = images.current['ground'];
      if (gImg) {
        const gW = gImg.width * (gHeight / gImg.height);
        for(let i = 0; i < Math.ceil(canvasWidth / gW) + 1; i++) {
          ctx.drawImage(gImg, state.groundScrollX + (i * gW), groundY, gW, gHeight);
        }
      }

      // 4. Draw Obstacles
      state.obstacles.forEach(obs => {
        if (obs.type === 'box' && !obs.hit && images.current['box']) {
          const boxFrame = Math.floor(state.frames / 10) % 7;
          ctx.drawImage(images.current['box'], boxFrame * 64, 0, 64, 64, obs.x, obs.y, obs.width, obs.height);
        } else if (obs.type === 'bush' && images.current['bush']) {
          ctx.drawImage(images.current['bush'], obs.x, obs.y, obs.width, obs.height);
        } else if (obs.type === 'palm' && images.current['palm']) {
          ctx.drawImage(images.current['palm'], obs.x, obs.y, obs.width, obs.height);
        }
      });

      // 5. Draw Player
      const p = state.player;
      let activeImg = images.current['run'];
      let srcX = (Math.floor(p.ticks / 3) % 12) * 64; 

      if (p.vy < 0) {
        if (p.jumpCount === 2 && images.current['doubleJump']) {
          activeImg = images.current['doubleJump'];
          srcX = (Math.floor(p.ticks / 4) % 6) * 64; 
        } else {
          activeImg = images.current['jump'];
          srcX = 0;
        }
      } else if (p.vy > 0 && p.y < floorY - p.height) {
        activeImg = images.current['fall'];
        srcX = 0;
      }

      if (activeImg) {
        ctx.drawImage(activeImg, srcX, 0, 64, 64, p.x, p.y, p.width, p.height);
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [assetsLoaded, isPaused, onHitBox, onGameOver]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {!assetsLoaded && <div className="pixel-font" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff' }}>Loading Sprites...</div>}
      <canvas 
        ref={canvasRef} 
        style={{ width: '100%', height: '100%', display: 'block', imageRendering: 'pixelated' }} 
      />
    </div>
  );
};

export default RunnerEngine;
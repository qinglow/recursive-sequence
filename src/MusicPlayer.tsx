import React, { useState, useRef, useEffect } from 'react';
import music1 from './assets/just friends.mp3';
import music2 from './assets/bossa uh.mp3';
import music3 from './assets/runaway.mp3';
import music4 from './assets/pixel galaxy.mp3';

// 1. Update the Song interface to include the real audio source
interface Song {
  title: string;
  artist: string;
  src: string; // The path to the actual audio file
}

// 2. Add the volume prop interface
interface MusicPlayerProps {
  globalVolume: number;
}

// 3. Add real MP3 variables
const PLAYLIST: Song[] = [
  { 
    title: "just friends", 
    artist: "Potsu", 
    src: music1 
  },
  { 
    title: "bossa uh", 
    artist: "Potsu", 
    src: music2
  },
  { 
    title: "runaway", 
    artist: "Potsu", 
    src: music3
  },
  { 
    title: "pixel galaxy", 
    artist: "Ujico*/Snail's House", 
    src: music4
  }
];

const MusicPlayer: React.FC<MusicPlayerProps> = ({ globalVolume }) => {
  // We use this ref to talk directly to the hidden <audio> HTML element
  const audioRef = useRef<HTMLAudioElement>(null);

  const [playing, setPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("0:00");
  const [durationStr, setDurationStr] = useState<string>("0:00");
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);

  const currentSong = PLAYLIST[currentSongIndex];

  // Auto-play the new song when the track changes (if the player was already running)
  useEffect(() => {
    if (playing && audioRef.current) {
      // Browsers require a promise catch for audio autoplay policies
      audioRef.current.play().catch(err => console.log("Playback prevented:", err));
    }
  }, [currentSongIndex]);

  // Update the audio element's volume whenever globalVolume changes from App.tsx
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = globalVolume;
    }
  }, [globalVolume]);

  // Formats seconds into M:SS style text
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Called 100 times a second by the <audio> tag as it plays
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const { currentTime, duration } = audioRef.current;
      if (duration) {
        setProgress((currentTime / duration) * 100);
        setCurrentTimeStr(formatTime(currentTime));
        setDurationStr(formatTime(duration));
      }
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  const handleNext = () => {
    setCurrentSongIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  const handlePrev = () => {
    setCurrentSongIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  const selectSong = (index: number) => {
    setCurrentSongIndex(index);
    setPlaying(true);
  };

  return (
    <div className="music-app-container">
      
      {/* Hidden Audio Element that does the actual playing */}
      <audio 
        ref={audioRef} 
        src={currentSong.src} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext} // Auto-next when song finishes
      />

      {/* Player Display Screen */}
      <div className="music-screen">
        <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', letterSpacing: '1px' }}>--- MEDIA PLAYER ---</h3>
        
        <div style={{ textAlign: 'center', fontSize: '12px', background: '#000', padding: '8px', width: '100%', boxSizing: 'border-box', border: '1px solid #fff', borderRightColor: '#808080', borderBottomColor: '#808080' }}>
          <div style={{ color: '#00ff00', marginBottom: '5px' }}>
            {playing ? '▶ PLAYING' : '⏸ PAUSED'}
          </div>
          <div className={playing ? 'blinking-cursor' : ''} style={{ color: '#fff' }}>
            {currentSong.artist} - {currentSong.title}.mp3
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="music-controls">
        
        {/* Real Progress Bar */}
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <span style={{ fontSize: '10px', width: '35px' }}>{currentTimeStr}</span>
          <div style={{ flex: 1, height: '12px', background: '#fff', border: '1px solid #808080', borderRightColor: '#fff', borderBottomColor: '#fff' }}>
            <div style={{ height: '100%', background: '#0000a8', width: `${progress}%`, transition: 'width 0.1s linear' }} />
          </div>
          <span style={{ fontSize: '10px', width: '35px', textAlign: 'right' }}>{durationStr}</span>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button className="lucas-btn" onClick={handlePrev}>
            |◀
          </button>
          <button className="lucas-btn" onClick={togglePlayPause} style={{ width: '60px', justifyContent: 'center' }}>
            {playing ? '⏸' : '▶'}
          </button>
          <button className="lucas-btn" onClick={handleNext}>
            ▶|
          </button>
        </div>
      </div>

      {/* Playlist Section */}
      <div className="music-playlist">
        <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '5px', color: '#000' }}>PLAYLIST.TXT</div>
        <div style={{ overflowY: 'auto', fontSize: '11px', color: '#000', height: '100%' }}>
          {PLAYLIST.map((song, index) => (
            <div 
              key={index} 
              onClick={() => selectSong(index)}
              style={{ 
                padding: '5px', 
                cursor: 'pointer',
                background: currentSongIndex === index ? '#0000a8' : 'transparent',
                color: currentSongIndex === index ? '#fff' : '#000'
              }}
            >
              {index + 1}. {song.title}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default MusicPlayer;
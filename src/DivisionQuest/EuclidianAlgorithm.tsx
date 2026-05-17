import React, { useState } from 'react';

interface Props {
  onBack: () => void;
}

const EuclidianAlgorithm: React.FC<Props> = ({ onBack }) => {
  const [playerHP, setPlayerHP] = useState(100);
  const [monsterHP, setMonsterHP] = useState(100);
  const [streak, setStreak] = useState(0);
  
  const [valM, setValM] = useState(48);
  const [valN, setValN] = useState(18);
  const [playerAnswer, setPlayerAnswer] = useState('');
  const [battleMessage, setBattleMessage] = useState('A wild Algorithm Golem appears! What is the GCD?');

  const calcGCD = (a: number, b: number): number => {
    return b === 0 ? a : calcGCD(b, a % b);
  };

  const generateNewProblem = () => {
    const a = Math.floor(Math.random() * 50) + 10;
    const b = Math.floor(Math.random() * 50) + 10;
    setValM(Math.max(a, b));
    setValN(Math.min(a, b));
    setPlayerAnswer('');
  };

  const handleAttack = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAnswer = parseInt(playerAnswer, 10);
    const correctAnswer = calcGCD(valM, valN);

    if (parsedAnswer === correctAnswer) {
      setMonsterHP(prev => Math.max(0, prev - 25));
      setStreak(prev => prev + 1);
      if (monsterHP - 25 <= 0) {
        setBattleMessage("Critical Hit! You defeated the golem!");
        setTimeout(() => {
          setMonsterHP(100);
          setBattleMessage("A new golem approaches! Prepare your math!");
          generateNewProblem();
        }, 2000);
      } else {
        setBattleMessage(`Direct Hit! GCD of ${valM} and ${valN} is ${correctAnswer}!`);
        generateNewProblem();
      }
    } else {
      setPlayerHP(prev => Math.max(0, prev - 20));
      setBattleMessage(`Miss! The golem counter-attacks for 20 DMG!`);
      setStreak(0);
      setPlayerAnswer('');
      if (playerHP - 20 <= 0) {
         setBattleMessage("You blacked out... The algorithm was too strong.");
      }
    }
  };

  return (
    <>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#111', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', borderBottom: '4px solid #333', zIndex: 20 }}>
        <span className="pixel-font" style={{ color: playerHP > 30 ? '#55ff55' : '#ff5555', fontSize: '12px' }}>HERO HP: {playerHP}/100</span>
        <span className="pixel-font" style={{ color: '#ffff55', fontSize: '12px' }}>STREAK: {streak}</span>
      </div>
      
      <div className="retro-modal animate-entrance" style={{ maxWidth: '600px', backgroundColor: '#006600', marginTop: 'auto', marginBottom: '20px' }}>
        <div className="retro-modal-inner" style={{ padding: '20px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '20px' }}>
            <span className="pixel-font" style={{ fontSize: 'clamp(10px, 2vw, 14px)', lineHeight: '1.5' }}>{battleMessage}</span>
            <span className="pixel-font" style={{ color: '#ff5555', fontSize: '12px', textAlign: 'right', marginLeft: '10px' }}>MONSTER HP: {monsterHP}/100</span>
          </div>

          {playerHP > 0 ? (
            <form onSubmit={handleAttack} style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%' }}>
              <span className="pixel-font" style={{ fontSize: 'clamp(12px, 2vw, 16px)', color: '#ffff55', whiteSpace: 'nowrap' }}>GCD({valM}, {valN}) = </span>
              <input 
              aria-label='xe'
                type="number" 
                value={playerAnswer} 
                onChange={(e) => setPlayerAnswer(e.target.value)} 
                className="pixel-font" 
                style={{ flex: 1, minWidth: '50px', padding: '10px', fontSize: '20px', backgroundColor: '#000', border: '4px solid #fff', color: '#fff', outline: 'none' }}
                autoFocus
              />
              <button type="submit" className="pixel-font" style={{ padding: '10px 15px', fontSize: '14px', backgroundColor: '#cc0000', color: '#fff', border: '4px solid #fff', cursor: 'pointer' }}>ATTACK</button>
            </form>
          ) : (
            <button onClick={() => { setPlayerHP(100); setMonsterHP(100); setStreak(0); generateNewProblem(); setBattleMessage('A wild Algorithm Golem appears! What is the GCD?'); }} className="pixel-font" style={{ width: '100%', padding: '15px 20px', fontSize: '16px', backgroundColor: '#55aa55', color: '#fff', border: '4px solid #fff', cursor: 'pointer' }}>
              RESPAWN
            </button>
          )}

          <button onClick={onBack} className="pixel-font" style={{ marginTop: '20px', padding: '10px', fontSize: '12px', backgroundColor: 'transparent', color: '#fff', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>
            Escape Battle (Back)
          </button>
        </div>
      </div>
    </>
  );
};

export default EuclidianAlgorithm;
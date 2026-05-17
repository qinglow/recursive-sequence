import React, { useState } from 'react';

interface Props {
    onBack: () => void;
}

const DivisionAlgorithm: React.FC<Props> = ({ onBack }) => {
    const [playerHP, setPlayerHP] = useState(100);
    const [monsterHP, setMonsterHP] = useState(100);
    const [streak, setStreak] = useState(0);

    const [dividend, setDividend] = useState(144);
    const [divisor, setDivisor] = useState(12);
    const [playerAnswer, setPlayerAnswer] = useState('');
    const [battleMessage, setBattleMessage] = useState('A wild Math Slime appears! Solve to attack!');

    const generateNewProblem = () => {
        const newDivisor = Math.floor(Math.random() * 11) + 2;
        const newQuotient = Math.floor(Math.random() * 12) + 2;
        setDivisor(newDivisor);
        setDividend(newDivisor * newQuotient);
        setPlayerAnswer('');
    };

    const handleAttack = (e: React.FormEvent) => {
        e.preventDefault();
        const parsedAnswer = parseInt(playerAnswer, 10);
        const correctAnswer = dividend / divisor;

        if (parsedAnswer === correctAnswer) {
            setMonsterHP(prev => Math.max(0, prev - 25));
            setStreak(prev => prev + 1);
            if (monsterHP - 25 <= 0) {
                setBattleMessage("Critical Hit! You defeated the monster!");
                setTimeout(() => {
                    setMonsterHP(100);
                    setBattleMessage("A new monster approaches! Prepare your math!");
                    generateNewProblem();
                }, 2000);
            } else {
                setBattleMessage(`Direct Hit! ${dividend} ÷ ${divisor} is ${correctAnswer}!`);
                generateNewProblem();
            }
        } else {
            setPlayerHP(prev => Math.max(0, prev - 20));
            setBattleMessage(`Miss! The monster counter-attacks for 20 DMG!`);
            setStreak(0);
            setPlayerAnswer('');
            if (playerHP - 20 <= 0) {
                setBattleMessage("You blacked out... The division was too strong.");
            }
        }
    };

    return (
        <>
            {/* Top Status Bar Overlaid on the Beach */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#111', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', borderBottom: '4px solid #333', zIndex: 20 }}>
                <span className="pixel-font" style={{ color: playerHP > 30 ? '#55ff55' : '#ff5555', fontSize: '12px' }}>HERO HP: {playerHP}/100</span>
                <span className="pixel-font" style={{ color: '#ffff55', fontSize: '12px' }}>STREAK: {streak}</span>
            </div>

            {/* Game UI Centered Over Beach */}
            <div className="retro-modal animate-entrance" style={{ maxWidth: '600px', backgroundColor: '#0000aa', marginTop: 'auto', marginBottom: '20px' }}>
                <div className="retro-modal-inner" style={{ padding: '20px' }}>

                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '20px' }}>
                        <span className="pixel-font" style={{ fontSize: 'clamp(10px, 2vw, 14px)', lineHeight: '1.5' }}>{battleMessage}</span>
                        <span className="pixel-font" style={{ color: '#ff5555', fontSize: '12px', textAlign: 'right', marginLeft: '10px' }}>MONSTER HP: {monsterHP}/100</span>
                    </div>

                    {playerHP > 0 ? (
                        <form onSubmit={handleAttack} style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%' }}>
                            <span className="pixel-font" style={{ fontSize: 'clamp(14px, 3vw, 20px)', color: '#ffff55', whiteSpace: 'nowrap' }}>{dividend} ÷ {divisor} = </span>
                            <input
                                aria-label='hu'
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
                        <button onClick={() => { setPlayerHP(100); setMonsterHP(100); setStreak(0); generateNewProblem(); setBattleMessage('A wild Slime appears! Solve to attack!'); }} className="pixel-font" style={{ width: '100%', padding: '15px 20px', fontSize: '16px', backgroundColor: '#55aa55', color: '#fff', border: '4px solid #fff', cursor: 'pointer' }}>
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

export default DivisionAlgorithm;
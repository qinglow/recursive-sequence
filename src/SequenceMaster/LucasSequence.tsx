import React, { useState } from 'react';
import portraitImg from '../assets/Elucas_1.png';

const LucasSequence: React.FC = () => {
    // Changed state to targetTerm to reflect the specific n-th term
    const [targetTerm, setTargetTerm] = useState<number>(10);
    const [computedSequence, setComputedSequence] = useState<string>('');
    const [isComputing, setIsComputing] = useState<boolean>(false);

    const handleCompute = () => {
        setIsComputing(true);
        setComputedSequence('');

        // Simulate a tiny processing delay for that retro feel
        setTimeout(() => {
            let seq: number[] = [];
            
            // Adjusted initial pushes to account for L_0
            if (targetTerm >= 0) seq.push(2);
            if (targetTerm >= 1) seq.push(1);

            // Loop now includes the targetTerm (<=) instead of stopping before it (<)
            for (let i = 2; i <= targetTerm; i++) {
                seq.push(seq[i - 1] + seq[i - 2]);
            }

            setComputedSequence(seq.join(', '));
            setIsComputing(false);
        }, 400);
    };

    return (
        <div className="window-content lucas-app">

            {/* Top Header Information Box */}
            <div className="lucas-header-box">
                <div className="lucas-portrait">
                    <img
                        src={portraitImg}
                        alt="Lucas Portrait" // Fixed from "Fibonacci Portrait"
                        style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                    />
                </div>
                <div className="lucas-info">
                    <h2 style={{ margin: '0 0 5px 0', color: '#1a56b6' }}>The Lucas Sequence</h2>
                    <p style={{ margin: '0 0 10px 0', fontSize: '11px', lineHeight: '1.2' }}>
                        The Lucas Numbers L<sub>n</sub> follow the exact same recursive rule as the Fibonacci sequence, but start with different seed values.
                    </p>
                    <div style={{ fontSize: '11px', color: '#0022a8', fontWeight: 'bold' }}>
                        <div>Initial values: L<sub>0</sub> = 2, L<sub>1</sub> = 1</div>
                        <div>Recursion: L<sub>n</sub> = L<sub>n-1</sub> + L<sub>n-2</sub></div>
                        <div>Condition: If n ≥ 2</div>
                    </div>
                </div>
            </div>

            {/* Controls Section */}
            <div className="lucas-controls">
                <span>Sequence Term (n):</span>
                <input
                aria-label='ede'
                    type="number"
                    value={targetTerm}
                    onChange={(e) => setTargetTerm(Number(e.target.value))}
                    min="0" // Changed min to 0 to allow L_0
                    max="100"
                    className="lucas-input"
                />
                <button className="lucas-btn" onClick={handleCompute} disabled={isComputing}>
                    <span style={{ fontSize: '10px' }}>▶</span> Compute
                </button>
            </div>

            {/* Terminal Output Section */}
            <div className="lucas-terminal-container">
                <div className="lucas-terminal">
                    <div style={{ color: '#0022a8', fontWeight: 'bold' }}>C:\SYSTEM\LUCAS.EXE --RUN</div>
                    <div style={{ color: '#4caf50', margin: '5px 0' }}>{'>'} Initializing calculation...</div>

                    {computedSequence && (
                        <div style={{ marginTop: '10px' }}>
                            <div>The Lucas sequence up to term {targetTerm}:</div>
                            <div style={{ marginTop: '5px', wordWrap: 'break-word', lineHeight: '1.4' }}>
                                {computedSequence}
                            </div>
                        </div>
                    )}
                    <div className="blinking-cursor" style={{ marginTop: '10px' }}>█</div>
                </div>
            </div>

        </div>
    );
};

export default LucasSequence;
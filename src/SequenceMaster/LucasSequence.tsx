import React, { useState } from 'react';
import portraitImg from '../assets/Elucas_1.png';

const LucasSequence: React.FC = () => {
    const [targetTerm, setTargetTerm] = useState<number>(10);
    const [computedSequence, setComputedSequence] = useState<string>('');
    const [isComputing, setIsComputing] = useState<boolean>(false);
    const [isInvalid, setIsInvalid] = useState<boolean>(false);

    const handleCompute = () => {
        // Check if input is invalid (less than 2)
        if (targetTerm < 2) {
            setIsInvalid(true);
            setComputedSequence('');
            return;
        }
        
        setIsInvalid(false);
        // Set the loading state to true to disable the button and show processing UI
        setIsComputing(true);
        // Clear the previous computed sequence to make room for the new result
        setComputedSequence('');

        // Simulate a tiny processing delay for that retro feel
        setTimeout(() => {
            // Updated to BigInt array to prevent precision loss or exponential layout breaking
            let seq: bigint[] = [];
            
            // If the target term is 0 or greater, push the first Lucas number (2)
            if (targetTerm >= 0) seq.push(2n);
            // If the target term is 1 or greater, push the second Lucas number (1)
            if (targetTerm >= 1) seq.push(1n);

            // Loop from index 2 up to and including the target term to generate the rest of the sequence
            for (let i = 2; i <= targetTerm-1; i++) {
                // Each new number is the sum of the previous two numbers in the sequence
                seq.push(seq[i - 1] + seq[i - 2]);
            }

            // Map each BigInt to a string without thousand/millions commas
            setComputedSequence(seq.map(num => num.toString()).join(', '));
            // Set the loading state to false to re-enable the button and indicate processing is complete
            setIsComputing(false);
        }, 400);
    };

    return (
        <div className="window-content lucas-app" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '400px' }}>

            {/* Top Header Information Box */}
            <div className="lucas-header-box" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                <div className="lucas-portrait">
                    <img
                        src={portraitImg}
                        alt="Lucas Portrait"
                        style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                    />
                </div>
                <div className="lucas-info" style={{ flex: 1, minWidth: '200px' }}>
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
            <div className="lucas-controls" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginTop: '15px' }}>
                <span>Sequence Term:</span>
                <input
                    aria-label='Target Term'
                    type="number"
                    value={targetTerm}
                    onChange={(e) => {
                        const val = Number(e.target.value);
                        // Upper bounds limit to shield browser engine from thread-locking loops
                        if (val <= 1000) setTargetTerm(val);
                    }}
                    min="0" 
                    max="1000"
                    className="lucas-input"
                    style={{ maxWidth: '80px' }}
                />
                <button className="lucas-btn" onClick={handleCompute} disabled={isComputing}>
                    <span style={{ fontSize: '10px' }}>▶</span> Compute
                </button>
            </div>

            {/* Terminal Output Section */}
            <div className="lucas-terminal-container" style={{ marginTop: '15px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div className="lucas-terminal" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ color: '#0022a8', fontWeight: 'bold' }}>C:\SYSTEM\LUCAS.EXE --RUN</div>
                    <div style={{ color: '#4caf50', margin: '5px 0' }}>{'>'} Initializing calculation...</div>

                    {isInvalid && (
                        <div style={{ marginTop: '10px', color: 'red', fontWeight: 'bold' }}>
                            INVALID OUTPUT
                        </div>
                    )}
                    {computedSequence && (
                        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <div>The Lucas sequence are:</div>
                            
                            {/* Scrollable containing box safely handles high counts */}
                            <div style={{ 
                                marginTop: '5px', 
                                wordBreak: 'break-word', 
                                lineHeight: '1.4',
                                maxHeight: '150px',
                                overflowY: 'auto',
                                paddingRight: '10px',
                                paddingBottom: '10px'
                            }}>
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
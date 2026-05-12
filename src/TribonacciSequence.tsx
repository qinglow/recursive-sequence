import React, { useState } from 'react';

const TribonacciSequence: React.FC = () => {
  const [targetTerm, setTargetTerm] = useState<number>(10);
  const [computedSequence, setComputedSequence] = useState<string>('');
  const [isComputing, setIsComputing] = useState<boolean>(false);

  const handleCompute = () => {
    setIsComputing(true);
    setComputedSequence('');

    // Simulate the retro processing delay
    setTimeout(() => {
      let seq: number[] = [];
      
      // Tribonacci requires 3 initial values
      if (targetTerm >= 0) seq.push(0);
      if (targetTerm >= 1) seq.push(0);
      if (targetTerm >= 2) seq.push(1);
      
      // Loop starts at 3, adds the previous THREE terms
      for (let i = 3; i <= targetTerm; i++) {
        seq.push(seq[i - 1] + seq[i - 2] + seq[i - 3]);
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
          <span style={{fontSize: '40px'}}>📜</span>
        </div>
        <div className="lucas-info">
          <h2 style={{ margin: '0 0 5px 0', color: '#1a56b6' }}>The Tribonacci Sequence</h2>
          <p style={{ margin: '0 0 10px 0', fontSize: '11px', lineHeight: '1.2' }}>
            The Tribonacci Numbers T<sub>n</sub> are a recursive sequence where each term is the sum of the previous three.
          </p>
          <div style={{ fontSize: '11px', color: '#0022a8', fontWeight: 'bold' }}>
            <div>Initial values: T<sub>0</sub> = 0, T<sub>1</sub> = 0, T<sub>2</sub> = 1</div>
            <div>Recursion: T<sub>n</sub> = T<sub>n-1</sub> + T<sub>n-2</sub> + T<sub>n-3</sub></div>
            <div>Condition: If n ≥ 3</div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="lucas-controls">
        <span>Sequence Term (n):</span>
        <input 
          type="number" 
          value={targetTerm} 
          onChange={(e) => setTargetTerm(Number(e.target.value))}
          min="0"
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
          <div style={{ color: '#0022a8', fontWeight: 'bold' }}>C:\SYSTEM\TRIBONACCI.EXE --RUN</div>
          <div style={{ color: '#4caf50', margin: '5px 0' }}>{'>'} Initializing calculation...</div>
          
          {computedSequence && (
            <div style={{ marginTop: '10px' }}>
              <div>The Tribonacci sequence up to term {targetTerm}:</div>
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

export default TribonacciSequence;
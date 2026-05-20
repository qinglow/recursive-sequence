import React, { useState } from 'react';

const TribonacciSequence: React.FC = () => {
  const [targetTerm, setTargetTerm] = useState<number>(10);
  const [computedSequence, setComputedSequence] = useState<string>('');
  const [isComputing, setIsComputing] = useState<boolean>(false);
  const [isInvalid, setIsInvalid] = useState<boolean>(false);

  const handleCompute = () => {
    // Check if input is invalid (less than 3)
    if (targetTerm < 3) {
      setIsInvalid(true);
      setComputedSequence('');
      return;
    }
    
    setIsInvalid(false);
    // Set the loading state to true to disable the button and show processing UI
    setIsComputing(true);
    // Clear the previous computed sequence to make room for the new result
    setComputedSequence('');

    // Simulate the retro processing delay
    setTimeout(() => {
      // Use BigInt array because Tribonacci scales aggressively fast
      let seq: bigint[] = [];
      
      // Tribonacci requires 3 initial values using BigInt notations
      // If the target term is 0 or greater, push the first Tribonacci number (0)
      if (targetTerm >= 0) seq.push(0n);
      // If the target term is 1 or greater, push the second Tribonacci number (0)
      if (targetTerm >= 1) seq.push(0n);
      // If the target term is 2 or greater, push the third Tribonacci number (1)
      if (targetTerm >= 2) seq.push(1n);
      
      // Loop starts at 3, adds the previous THREE terms safely
      for (let i = 3; i <= targetTerm-1; i++) {
        // Each new number is the sum of the previous three numbers in the sequence
        seq.push(seq[i - 1] + seq[i - 2] + seq[i - 3]);
      }
      
      // Maps terms through toString to get plain numbers
      setComputedSequence(seq.map(num => num.toString()).join(', '));
      // Set the loading state to false to re-enable the button and indicate processing is complete
      setIsComputing(false);
    }, 400);
  };

  return (
    // FIX 3: Added flex column layout constraints to match the others and prevent layout collapses
    <div className="window-content lucas-app" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '400px' }}>
      
      {/* Top Header Information Box */}
      <div className="lucas-header-box" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
        <div className="lucas-portrait">
          <span style={{ fontSize: '40px' }}>📜</span>
        </div>
        <div className="lucas-info" style={{ flex: 1, minWidth: '200px' }}>
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
      <div className="lucas-controls" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginTop: '15px' }}>
        <span>Sequence Term:</span>
        <input 
          aria-label='Target Term'
          type="number" 
          value={targetTerm} 
          onChange={(e) => {
            const val = Number(e.target.value);
            // Safety guard check to keep the UI smooth and responsive
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
          <div style={{ color: '#0022a8', fontWeight: 'bold' }}>C:\SYSTEM\TRIBONACCI.EXE --RUN</div>
          <div style={{ color: '#4caf50', margin: '5px 0' }}>{'>'} Initializing calculation...</div>
          
          {isInvalid && (
            <div style={{ marginTop: '10px', color: 'red', fontWeight: 'bold' }}>
              INVALID OUTPUT
            </div>
          )}
          {computedSequence && (
            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div>The Tribonacci sequence are:</div>
              
              {/* FIX 4: Added max-height scrollbox bounding box and text line-breaking rules */}
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

export default TribonacciSequence;
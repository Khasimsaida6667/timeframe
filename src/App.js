

import React, { useState } from 'react';
import Chart from './Chart';
import './App.css';

const App = () => {
  const [timeframe, setTimeframe] = useState('daily');

  return (
    <div className="App">
      <h1>Chart Application</h1>
      <div className="timeframe-buttons">
        <button onClick={() => setTimeframe('daily')} aria-label="Show daily data">Daily</button>
        <button onClick={() => setTimeframe('weekly')} aria-label="Show weekly data">Weekly</button>
        <button onClick={() => setTimeframe('monthly')} aria-label="Show monthly data">Monthly</button>
      </div>
      <Chart timeframe={timeframe} />
    </div>
  );
};

export default App;

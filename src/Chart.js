import React, { useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import html2canvas from 'html2canvas';
import data from './data.json';
import './Chart.css';

const Chart = ({ timeframe }) => {
  const [left, setLeft] = useState('dataMin');
  const [right, setRight] = useState('dataMax');
  const [refAreaLeft, setRefAreaLeft] = useState('');
  const [refAreaRight, setRefAreaRight] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);
  const chartRef = useRef(null);

  const aggregateData = (data, timeframe) => {
    if (timeframe === 'daily') return data;

    const aggregated = {};
    data.forEach((point) => {
      const date = new Date(point.timestamp);
      let key;

      if (timeframe === 'weekly') {
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
        key = weekStart.toISOString().split('T')[0];
      } else {
        key = date.toISOString().slice(0, 7); // YYYY-MM
      }

      if (!aggregated[key]) {
        aggregated[key] = { timestamp: key, value: 0 };
      }
      aggregated[key].value += point.value;
    });

    return Object.values(aggregated);
  };

  const aggregatedData = aggregateData(data, timeframe);

  const handleClick = (data) => {
    alert(`Timestamp: ${data.timestamp}, Value: ${data.value}`);
  };

  const exportChart = (format) => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        const link = document.createElement('a');
        link.download = `chart.${format}`;
        link.href = canvas.toDataURL(`image/${format}`);
        link.click();
      });
    }
  };

  const zoom = () => {
    if (refAreaLeft === refAreaRight || refAreaRight === '') {
      setRefAreaLeft('');
      setRefAreaRight('');
      return;
    }

    let newLeft = refAreaLeft;
    let newRight = refAreaRight;
    if (refAreaLeft > refAreaRight) {
      [newLeft, newRight] = [refAreaRight, refAreaLeft];
    }

    setLeft(newLeft);
    setRight(newRight);
    setRefAreaLeft('');
    setRefAreaRight('');
    setIsZoomed(true);
  };

  const zoomOut = () => {
    setLeft('dataMin');
    setRight('dataMax');
    setRefAreaLeft('');
    setRefAreaRight('');
    setIsZoomed(false);
  };

  return (
    <div className="chart-container">
      <div ref={chartRef} className="chart">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={aggregatedData}
            onMouseDown={(e) => e && setRefAreaLeft(e.activeLabel)}
            onMouseMove={(e) => e && refAreaLeft && setRefAreaRight(e.activeLabel)}
            onMouseUp={zoom}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timestamp" 
              allowDataOverflow={true}
              domain={isZoomed ? [left, right] : ['dataMin', 'dataMax']}
            />
            <YAxis allowDataOverflow={true} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ onClick: handleClick }} />
            {refAreaLeft && refAreaRight ? (
              <ReferenceArea x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} />
            ) : null}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {isZoomed && (
        <button onClick={zoomOut} className="zoom-out-btn">Zoom Out</button>
      )}
      <div className="export-buttons">
        <button onClick={() => exportChart('png')} aria-label="Export chart as PNG">Export as PNG</button>
        <button onClick={() => exportChart('jpg')} aria-label="Export chart as JPG">Export as JPG</button>
      </div>
    </div>
  );
};

export default Chart;

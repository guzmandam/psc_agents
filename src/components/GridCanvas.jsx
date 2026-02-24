import React, { useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { lerpColor } from '../core/config';

export const GridCanvas = ({ width = 500, height = 500, gridCols = 50, gridRows = 50 }) => {
  const canvasRef = useRef(null);
  const agents = useStore((s) => s.agents);
  const darkMode = useStore((s) => s.darkMode);
  const getActiveColors = useStore((s) => s.getActiveColors);

  const cellWidth = width / gridCols;
  const cellHeight = height / gridRows;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { colorA, colorB } = getActiveColors();

    ctx.fillStyle = darkMode ? '#0f172a' : '#1e293b';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = darkMode ? '#1e293b' : '#334155';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= width; x += cellWidth) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += cellHeight) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    agents.forEach((agent) => {
      const centerX = agent.x * cellWidth + cellWidth / 2;
      const centerY = agent.y * cellHeight + cellHeight / 2;

      const baseRadius = Math.min(cellWidth, cellHeight) / 2 * 0.8;
      const radius = Math.min(
        baseRadius * (1 + Math.log10(Math.max(1, agent.status))),
        cellWidth / 2
      );

      const t = (agent.ideology + 1) / 2;
      const [r, g, b] = lerpColor(colorA, colorB, t);

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fill();

      if (agent.isDissatisfied) {
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });
  }, [agents, width, height, cellWidth, cellHeight, darkMode, getActiveColors]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`rounded-lg shadow-lg border ${darkMode ? 'border-gray-800' : 'border-slate-700'}`}
    />
  );
};

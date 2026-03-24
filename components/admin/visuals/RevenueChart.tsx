'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface RevenueChartProps {
  data: number[];
  labels: string[];
  height?: number;
}

export default function RevenueChart({ data, labels, height = 200 }: RevenueChartProps) {
  const max = Math.max(...data, 1);
  const padding = 20;
  const chartWidth = 500;
  const chartHeight = height;

  const points = data.map((val, i) => ({
    x: (i / (data.length - 1)) * (chartWidth - padding * 2) + padding,
    y: chartHeight - ((val / max) * (chartHeight - padding * 2) + padding)
  }));

  const pathD = `M ${points[0].x} ${points[0].y} ` + 
    points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');

  const areaD = `${pathD} L ${points[points.length-1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

  return (
    <div className="w-full h-full relative group">
      <svg 
        viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
      >
        {/* Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
          <line 
            key={i}
            x1={padding}
            y1={chartHeight - (p * (chartHeight - padding * 2) + padding)}
            x2={chartWidth - padding}
            y2={chartHeight - (p * (chartHeight - padding * 2) + padding)}
            className="stroke-black/5 dark:stroke-white/5"
            strokeWidth="1"
          />
        ))}

        {/* Area Gradient */}
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c8b99a" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#c8b99a" stopOpacity="0" />
          </linearGradient>
        </defs>

        <motion.path
          d={areaD}
          fill="url(#chartGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Path Line */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="#c8b99a"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Points */}
        {points.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            className="fill-white dark:fill-black stroke-[#c8b99a]"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 + i * 0.1 }}
            whileHover={{ scale: 1.5 }}
          />
        ))}
      </svg>

      {/* Tooltip Simulation on labels */}
      <div className="flex justify-between mt-4 px-2">
         {labels.map((label, i) => (
           <span key={i} className="text-[8px] font-bold uppercase tracking-widest text-black/30 dark:text-white/30">
             {label}
           </span>
         ))}
      </div>
    </div>
  );
}

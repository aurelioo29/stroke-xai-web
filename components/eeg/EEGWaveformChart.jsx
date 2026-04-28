"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceDot,
} from "recharts";

export default function EEGWaveformChart({
  data = [],
  importantSegments = [],
  predictionLabel,
}) {
  const getSegmentY = (segment) => {
    const points = data.slice(segment.start, segment.end);

    if (!points.length) return 0;

    return Math.max(...points.map((item) => Number(item.value || 0)));
  };

  return (
    <div className="h-[460px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

          <XAxis
            dataKey="sample"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            label={{
              value: "Sample / titik sinyal EEG",
              position: "insideBottom",
              offset: -5,
              fill: "#94a3b8",
            }}
          />

          <YAxis
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            label={{
              value: "Amplitudo sinyal",
              angle: -90,
              position: "insideLeft",
              fill: "#94a3b8",
            }}
          />

          <Tooltip
            contentStyle={{
              background: "#020617",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 12,
              color: "#fff",
            }}
            labelFormatter={(value) => `Sample ${value}`}
          />

          {importantSegments?.map((seg, index) => (
            <ReferenceArea
              key={`area-${index}`}
              x1={seg.start}
              x2={seg.end}
              strokeOpacity={0}
              fill={seg.color || "#ef4444"}
              fillOpacity={0.18}
            />
          ))}

          {importantSegments?.map((seg, index) => {
            const mid = Math.floor((seg.start + seg.end) / 2);
            const y = getSegmentY(seg);

            return (
              <ReferenceDot
                key={`label-${index}`}
                x={mid}
                y={y}
                r={4}
                fill={seg.color || "#ef4444"}
                stroke="none"
                label={{
                  value: `${predictionLabel} • ${seg.label}`,
                  position: "top",
                  fill: "#fff",
                  fontSize: 11,
                }}
              />
            );
          })}

          <Line
            type="monotone"
            dataKey="value"
            name="EEG Signal"
            dot={false}
            strokeWidth={1.8}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

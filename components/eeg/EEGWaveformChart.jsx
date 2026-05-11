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
  ReferenceLine,
} from "recharts";

const DEFAULT_SECTION_COLOR = "#2563eb";

function getSectionColor(section, importantSegments = []) {
  const exact = importantSegments.find(
    (seg) =>
      seg.name === section.name ||
      seg.section === section.name ||
      seg.label === section.name,
  );

  if (exact?.color) return exact.color;

  const overlap = importantSegments.find((seg) => {
    const segStart = seg.start ?? seg.start_sample ?? 0;
    const segEnd = seg.end ?? seg.end_sample ?? 0;

    return segStart <= section.end_sample && segEnd >= section.start_sample;
  });

  return overlap?.color || DEFAULT_SECTION_COLOR;
}

function buildSectionLabel(section) {
  return `${section.name} (${section.start_sample}-${section.end_sample})`;
}

export default function EEGWaveformChart({
  data = [],
  graphSections = [],
  importantSegments = [],
}) {
  return (
    <div className="w-full">
      {graphSections.length > 0 && (
        <div className="mb-4 grid gap-3 md:grid-cols-4">
          {graphSections.map((section) => {
            const color = getSectionColor(section, importantSegments);

            return (
              <div
                key={section.name}
                className="rounded-xl border bg-black/20 p-3"
                style={{
                  borderColor: `${color}55`,
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <p className="text-sm font-semibold text-white">
                    {section.name}
                  </p>
                </div>
                <p className="mt-1 text-xs text-white/50">
                  {section.start_sample} - {section.end_sample}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div className="h-[420px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.12} />

            <XAxis
              dataKey="sample"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              label={{
                value: "Sample",
                position: "insideBottom",
                offset: -5,
                fill: "#94a3b8",
              }}
            />

            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              label={{
                value: "Amplitude",
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
              formatter={(value, name, props) => [
                Number(value).toFixed(4),
                props?.payload?.section || "EEG Signal",
              ]}
            />

            {graphSections.map((section, index) => {
              const color = getSectionColor(section, importantSegments);

              return (
                <ReferenceArea
                  key={`section-${section.name}`}
                  x1={section.start_sample}
                  x2={section.end_sample}
                  fill={color}
                  fillOpacity={0.08}
                  strokeOpacity={0}
                />
              );
            })}

            {graphSections.map((section, index) => (
              <ReferenceLine
                key={`line-${section.name}`}
                x={section.start_sample}
                stroke="rgba(255,255,255,0.15)"
                strokeDasharray="4 4"
                label={{
                  value: section.name,
                  position: "insideTopLeft",
                  fill: "#cbd5e1",
                  fontSize: 12,
                }}
              />
            ))}

            {graphSections.length > 0 && (
              <ReferenceLine
                x={graphSections[graphSections.length - 1].end_sample}
                stroke="rgba(255,255,255,0.15)"
                strokeDasharray="4 4"
              />
            )}

            <Line
              type="monotone"
              dataKey="value"
              name="EEG Signal"
              dot={false}
              stroke="#e2e8f0"
              strokeWidth={1.7}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

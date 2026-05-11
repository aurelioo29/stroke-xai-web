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
} from "recharts";

function getSectionStatusText(section) {
  if (!section) return "-";

  return `${section.label} • ${section.importance_percent ?? 0}%`;
}

export default function EEGSectionCharts({ sections = [] }) {
  if (!sections.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-black/30 p-5 text-sm text-white/60">
        Tidak ada data section EEG yang dapat ditampilkan.
      </div>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      {sections.map((section, index) => {
        const data = section.data || [];
        const color = section.color || "#2563eb";

        return (
          <div
            key={section.name || index}
            className="rounded-2xl border border-white/10 bg-black/30 p-4"
          >
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">
                  {section.name} — EEG Signal Section
                </h3>

                <p className="mt-1 text-xs text-white/50">{section.title}</p>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs font-medium text-white/80">
                  {getSectionStatusText(section)}
                </span>
              </div>
            </div>

            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

                  <XAxis
                    dataKey="sample"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    label={{
                      value: "Sample",
                      position: "insideBottom",
                      offset: -5,
                      fill: "#94a3b8",
                    }}
                  />

                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} width={45} />

                  <Tooltip
                    contentStyle={{
                      background: "#020617",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 12,
                      color: "#fff",
                    }}
                    labelFormatter={(value) => `Sample ${value}`}
                  />

                  <ReferenceArea
                    x1={section.start_sample}
                    x2={section.end_sample}
                    strokeOpacity={0}
                    fill={color}
                    fillOpacity={0.16}
                  />

                  <Line
                    type="monotone"
                    dataKey="value"
                    name={section.name}
                    dot={false}
                    stroke={color}
                    strokeWidth={2}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-black/40 p-3">
              <p className="text-xs leading-5 text-white/55">
                {section.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

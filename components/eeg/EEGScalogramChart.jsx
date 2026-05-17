"use client";

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function mixColor(c1, c2, t) {
  const a = c1.match(/\w\w/g).map((x) => parseInt(x, 16));
  const b = c2.match(/\w\w/g).map((x) => parseInt(x, 16));

  const mixed = [
    Math.round(lerp(a[0], b[0], t)),
    Math.round(lerp(a[1], b[1], t)),
    Math.round(lerp(a[2], b[2], t)),
  ];

  return `rgb(${mixed[0]}, ${mixed[1]}, ${mixed[2]})`;
}

/**
 * EEG heatmap palette:
 * blue -> cyan -> green -> yellow -> orange -> red
 */
function getHeatColor(value) {
  const t = clamp(value);

  if (t <= 0.2) return mixColor("0b1f8a", "1d4ed8", t / 0.2);
  if (t <= 0.4) return mixColor("1d4ed8", "06b6d4", (t - 0.2) / 0.2);
  if (t <= 0.6) return mixColor("06b6d4", "fde047", (t - 0.4) / 0.2);
  if (t <= 0.8) return mixColor("fde047", "f97316", (t - 0.6) / 0.2);

  return mixColor("f97316", "dc2626", (t - 0.8) / 0.2);
}

export default function EEGScalogramChart({
  plot,
  title = "Scalogram Time-Frequency Plot",
  annotationLabel = "Abnormal Spatio-Temporal Event Detected",
}) {
  if (!plot) return null;

  const frequencyLabels = plot.frequency_labels || [];
  const timeLabels = plot.time_labels || [];
  const matrix = plot.matrix || [];

  const rows = frequencyLabels.length;
  const cols = timeLabels.length;

  const highlight = plot.highlight_region || null;

  const hasData =
    rows > 0 &&
    cols > 0 &&
    Array.isArray(matrix) &&
    matrix.length === rows &&
    matrix.every((row) => Array.isArray(row) && row.length === cols);

  if (!hasData) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/30 p-5 text-sm text-white/60">
        Scalogram data is not available yet.
      </div>
    );
  }

  const cellWidthPercent = 100 / cols;
  const cellHeightPercent = 100 / rows;

  const highlightLeft = highlight
    ? `${highlight.xStart * cellWidthPercent}%`
    : "0%";
  const highlightTop = highlight
    ? `${highlight.yStart * cellHeightPercent}%`
    : "0%";
  const highlightWidth = highlight
    ? `${(highlight.xEnd - highlight.xStart + 1) * cellWidthPercent}%`
    : "0%";
  const highlightHeight = highlight
    ? `${(highlight.yEnd - highlight.yStart + 1) * cellHeightPercent}%`
    : "0%";

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="mb-3 text-center text-xl font-semibold text-white">
          {title}
        </div>

        <div className="flex gap-3">
          {/* Y Axis label */}
          <div className="flex items-center justify-center">
            <div className="-rotate-90 whitespace-nowrap text-sm font-medium text-white/75">
              Frequency (Hz)
            </div>
          </div>

          <div className="flex-1">
            <div className="flex">
              {/* Left frequency ticks */}
              <div className="mr-3 flex flex-col justify-between py-1 text-xs text-white/70">
                {frequencyLabels.map((label, idx) => (
                  <div
                    key={`freq-${idx}`}
                    className="h-[24px] flex items-center justify-end"
                  >
                    {label}
                  </div>
                ))}
              </div>

              {/* Heatmap */}
              <div className="flex-1">
                <div className="relative overflow-hidden rounded-xl border border-white/10 bg-slate-950">
                  <div
                    className="grid"
                    style={{
                      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                      gridTemplateRows: `repeat(${rows}, 24px)`,
                    }}
                  >
                    {matrix.flatMap((row, rowIndex) =>
                      row.map((value, colIndex) => (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          style={{
                            backgroundColor: getHeatColor(value),
                            filter: "saturate(1.1)",
                          }}
                          className="border-[0.5px] border-white/[0.03]"
                        />
                      )),
                    )}
                  </div>

                  {/* Highlight box */}
                  {highlight && (
                    <>
                      <div
                        className="pointer-events-none absolute rounded-2xl border-[4px] border-white shadow-[0_0_0_2px_rgba(255,255,255,0.15)]"
                        style={{
                          left: highlightLeft,
                          top: highlightTop,
                          width: highlightWidth,
                          height: highlightHeight,
                        }}
                      />

                      <div
                        className="absolute z-10 rounded-2xl border border-black/20 bg-white px-4 py-3 text-sm font-semibold leading-5 text-black shadow-lg"
                        style={{
                          top: `calc(${highlightTop} + ${highlightHeight} / 2 - 22px)`,
                          left: `calc(${highlightLeft} + ${highlightWidth} + 12px)`,
                          maxWidth: "220px",
                        }}
                      >
                        {annotationLabel}
                      </div>
                    </>
                  )}
                </div>

                {/* X axis ticks */}
                <div className="mt-2 flex justify-between text-xs text-white/70">
                  {timeLabels.map((label, idx) => (
                    <span key={`time-${idx}`}>{label}</span>
                  ))}
                </div>

                <div className="mt-2 text-center text-sm font-medium text-white/75">
                  Time (s)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-5">
          <div className="h-3 w-full rounded-full bg-[linear-gradient(90deg,#0b1f8a_0%,#1d4ed8_20%,#06b6d4_40%,#fde047_60%,#f97316_80%,#dc2626_100%)]" />
          <div className="mt-2 flex justify-between text-[11px] text-white/60">
            <span>Low</span>
            <span>Observation</span>
            <span>Warning</span>
            <span>High</span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

const BAND_ORDER = ["gamma_low", "beta", "alpha", "theta", "delta"];

function getCell(cells = [], sectionId, bandKey) {
  return cells.find(
    (cell) => cell.section_id === sectionId && cell.band_key === bandKey,
  );
}

function getBandDescription(bandKey) {
  const map = {
    delta: "Deep slow-wave activity",
    theta: "4–8 Hz rhythm activity",
    alpha: "Relaxed cortical rhythm",
    beta: "Fast active rhythm",
    gamma_low: "High-frequency activity",
  };

  return map[bandKey] || "Frequency activity";
}

function getPowerOpacity(powerPercent = 0) {
  const value = Number(powerPercent || 0);

  if (value >= 75) return 1;
  if (value >= 50) return 0.88;
  if (value >= 25) return 0.76;

  return 0.62;
}

export default function EEGFrequencyPanel({ frequencyAnalysis }) {
  if (!frequencyAnalysis) {
    return (
      <div className="rounded-xl border border-white/10 bg-black/30 p-5 text-sm text-white/60">
        No frequency analysis available.
      </div>
    );
  }

  const sections = frequencyAnalysis.sections || [];
  const bands = frequencyAnalysis.bands || [];
  const cells = frequencyAnalysis.heatmap_cells || [];
  const dominant = frequencyAnalysis.dominant_frequency;

  const orderedBands = BAND_ORDER.map((key) =>
    bands.find((band) => band.key === key),
  ).filter(Boolean);

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
          <p className="text-xs uppercase tracking-wider text-white/50">
            Dominant Frequency
          </p>

          {dominant ? (
            <>
              <div className="mt-3 flex items-center gap-3">
                <span
                  className="h-4 w-4 rounded-full shadow-lg"
                  style={{ backgroundColor: dominant.color }}
                />

                <p className="text-xl font-semibold text-white">
                  {dominant.band_label}
                </p>
              </div>

              <p className="mt-2 text-sm text-white/60">
                {dominant.range_label} • {dominant.section_name} •{" "}
                {dominant.power_percent}%
              </p>
            </>
          ) : (
            <p className="mt-3 text-sm text-white/60">
              No dominant frequency detected.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
          <p className="text-xs uppercase tracking-wider text-white/50">
            Frequency Explanation
          </p>

          <p className="mt-3 text-sm leading-7 text-white/75">
            {frequencyAnalysis.explanation ||
              "Frequency explanation is not available."}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
        <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Scalogram-style Frequency Map
            </h3>

            <p className="mt-1 text-xs text-white/50">
              Warna menunjukkan kekuatan power frekuensi pada tiap section
              P1–P4. Merah berarti power paling dominan.
            </p>
          </div>

          <p className="text-xs text-white/40">
            Sampling rate: {frequencyAnalysis.sampling_rate} Hz
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <div className="mb-3 flex items-center justify-between text-xs text-white/50">
              <span>Frequency</span>
              <span>Time / Section</span>
            </div>

            <div
              className="grid min-w-[720px] gap-1"
              style={{
                gridTemplateColumns: `88px repeat(${sections.length}, minmax(0, 1fr))`,
              }}
            >
              <div />

              {sections.map((section) => (
                <div
                  key={section.section_id}
                  className="rounded-t-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-center"
                >
                  <p className="text-xs font-semibold text-white">
                    {section.section_name}
                  </p>
                  <p className="mt-1 text-[10px] text-white/40">
                    s{section.start_sample}–s{section.end_sample}
                  </p>
                </div>
              ))}

              {orderedBands.map((band) => (
                <div key={band.key} className="contents">
                  <div className="flex items-center border border-white/10 bg-white/[0.04] px-3 py-3">
                    <div>
                      <p className="text-xs font-semibold text-white">
                        {band.label}
                      </p>
                      <p className="mt-1 text-[10px] text-white/40">
                        {band.range_label}
                      </p>
                    </div>
                  </div>

                  {sections.map((section) => {
                    const cell = getCell(cells, section.section_id, band.key);
                    const power = cell?.power_percent ?? 0;
                    const opacity = getPowerOpacity(power);

                    return (
                      <div
                        key={`${section.section_id}-${band.key}`}
                        className="relative min-h-[86px] overflow-hidden border border-black/40 p-3"
                        style={{
                          backgroundColor: cell?.color || "#111827",
                          opacity,
                        }}
                        title={`${band.label} ${section.section_name}: ${power}%`}
                      >
                        <div
                          className="absolute inset-0 opacity-25"
                          style={{
                            background:
                              "radial-gradient(circle at center, rgba(255,255,255,0.35), transparent 58%)",
                          }}
                        />

                        {power >= 75 && (
                          <div className="absolute inset-2 rounded-full bg-white/10 blur-xl" />
                        )}

                        <div className="relative z-10">
                          <p className="text-sm font-bold text-white drop-shadow">
                            {power}%
                          </p>

                          <p className="mt-1 text-[10px] font-medium text-white/90 drop-shadow">
                            {cell?.label || "-"}
                          </p>

                          <p className="mt-2 text-[10px] text-white/75 drop-shadow">
                            {getBandDescription(band.key)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full border border-white/10 bg-black">
              <div className="h-full w-full bg-gradient-to-r from-blue-600 via-green-500 via-yellow-400 to-red-500" />
            </div>

            <div className="mt-2 flex justify-between text-[10px] text-white/45">
              <span>Low</span>
              <span>Observation</span>
              <span>Warning</span>
              <span>High</span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {(frequencyAnalysis.color_legend || []).map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-2"
            >
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-white/70">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import SectionCard from "@/components/shared/SectionCard";
import InfoStatCard from "@/components/shared/InfoStatCard";
import EEGWaveformChart from "@/components/eeg/EEGWaveformChart";
import EEGColorLegend from "@/components/eeg/EEGColorLegend";

export default function EEGResultPanel({ result }) {
  return (
    <div className="mt-8 grid gap-6">
      <SectionCard>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">EEG Signal Graph</h2>
            <p className="mt-1 text-sm text-white/50">
              Grafik ini menampilkan sinyal EEG dari file CSV. Area berwarna
              menunjukkan bagian sinyal yang paling memengaruhi prediksi model.
            </p>
          </div>

          {result.uploaded_filename && (
            <p className="text-xs text-white/40">{result.uploaded_filename}</p>
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
          <EEGWaveformChart
            data={result.graph_data || []}
            importantSegments={result.important_segments || []}
            predictionLabel={result.prediction_label}
          />
        </div>
      </SectionCard>

      <SectionCard>
        <h2 className="text-2xl font-semibold">Color Explanation</h2>
        <p className="mt-1 text-sm text-white/50">
          Warna tidak berarti diagnosis langsung. Warna menunjukkan tingkat
          kontribusi bagian sinyal terhadap keputusan model.
        </p>

        <div className="mt-5">
          <EEGColorLegend legends={result.color_legend || []} />
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard>
          <h2 className="text-2xl font-semibold">Prediction</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <InfoStatCard
              label="Label"
              value={result.prediction_label}
              valueClassName="text-purple-400"
            />
            <InfoStatCard
              label="Confidence"
              value={`${(result.confidence * 100).toFixed(2)}%`}
            />
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-5">
            <p className="text-xs uppercase tracking-wider text-white/50">
              Explanation
            </p>
            <p className="mt-3 text-sm leading-7 text-white/80">
              {result.explanation_text}
            </p>
          </div>
        </SectionCard>

        <SectionCard>
          <h2 className="text-2xl font-semibold">Detected Signal Areas</h2>

          <div className="mt-6 grid gap-4">
            {result.important_segments?.map((seg, index) => (
              <div
                key={index}
                className="rounded-xl border border-white/10 bg-black/30 p-4"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: seg.color }}
                  />
                  <p className="text-sm font-medium text-white">
                    Area {index + 1} — {seg.label}
                  </p>
                </div>

                <p className="mt-2 text-xs leading-5 text-white/50">
                  {seg.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-6 text-sm text-white/70">
                  <p>
                    Start: <span className="text-white">{seg.start}</span>
                  </p>
                  <p>
                    End: <span className="text-white">{seg.end}</span>
                  </p>
                  <p>
                    Contribution:{" "}
                    <span className="text-white">
                      {seg.importance_percent?.toFixed
                        ? seg.importance_percent.toFixed(2)
                        : seg.importance_percent}
                      %
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

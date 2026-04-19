import SectionCard from "@/components/shared/SectionCard";
import InfoStatCard from "@/components/shared/InfoStatCard";

export default function EEGResultPanel({ result }) {
  return (
    <div className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
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
        <h2 className="text-2xl font-semibold">Important Segments</h2>

        <div className="mt-6 grid gap-4">
          {result.important_segments?.map((seg, index) => (
            <div
              key={index}
              className="rounded-xl border border-white/10 bg-black/30 p-4"
            >
              <p className="text-sm font-medium text-white">
                Segment {index + 1}
              </p>
              <div className="mt-2 flex flex-wrap gap-6 text-sm text-white/70">
                <p>
                  Start: <span className="text-white">{seg.start}</span>
                </p>
                <p>
                  End: <span className="text-white">{seg.end}</span>
                </p>
                <p>
                  Importance:{" "}
                  <span className="text-white">
                    {(seg.importance * 100).toFixed(2)}%
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

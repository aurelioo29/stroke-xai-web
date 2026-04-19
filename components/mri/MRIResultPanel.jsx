import SectionCard from "@/components/shared/SectionCard";
import InfoStatCard from "@/components/shared/InfoStatCard";

export default function MRIResultPanel({ result, apiBaseUrl }) {
  return (
    <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_1fr]">
      <SectionCard>
        <h2 className="text-2xl font-semibold">Prediction</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <InfoStatCard
            label="Label"
            value={result.prediction_label}
            valueClassName="text-blue-400"
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
        <h2 className="text-2xl font-semibold">Heatmap Overlay</h2>

        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-3">
          <img
            src={`${apiBaseUrl}${result.overlay_url}`}
            alt="MRI Overlay"
            className="w-full rounded-xl object-cover"
          />
        </div>
      </SectionCard>
    </div>
  );
}

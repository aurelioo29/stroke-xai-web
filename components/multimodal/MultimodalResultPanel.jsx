import SectionCard from "@/components/shared/SectionCard";
import InfoStatCard from "@/components/shared/InfoStatCard";

export default function MultimodalResultPanel({ result, apiBaseUrl }) {
  return (
    <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <SectionCard>
        <h2 className="text-2xl font-semibold">Diagnosis Result</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <InfoStatCard
            label="Final Prediction"
            value={result.fusion_result.prediction_label}
            valueClassName="text-emerald-400"
          />
          <InfoStatCard
            label="Confidence"
            value={`${(result.fusion_result.confidence * 100).toFixed(2)}%`}
          />
          <InfoStatCard
            label="Fusion Method"
            value={
              result.fusion_result.fusion_method_label ??
              result.fusion_result.fusion_method
            }
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

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs uppercase tracking-wider text-white/50">
              MRI Result
            </p>
            <p className="mt-2 font-medium">
              {result.mri_result.prediction_label}
            </p>
            <p className="mt-1 text-sm text-white/70">
              {(result.mri_result.confidence * 100).toFixed(2)}%
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs uppercase tracking-wider text-white/50">
              EEG Result
            </p>
            <p className="mt-2 font-medium">
              {result.eeg_result.prediction_label}
            </p>
            <p className="mt-1 text-sm text-white/70">
              {(result.eeg_result.confidence * 100).toFixed(2)}%
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <h2 className="text-2xl font-semibold">MRI Explainability</h2>
        <p className="mt-3 text-sm leading-7 text-white/70">
          Visualization of important MRI areas using{" "}
          <span className="font-medium text-white">
            {result.xai_result.xai_method}
          </span>
          .
        </p>

        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-3">
          <img
            src={`${apiBaseUrl}${result.xai_result.overlay_url}`}
            alt="MRI XAI Overlay"
            className="w-full rounded-xl object-cover"
          />
        </div>
      </SectionCard>
    </div>
  );
}

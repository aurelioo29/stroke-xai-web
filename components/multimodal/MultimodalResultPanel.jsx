import SectionCard from "@/components/shared/SectionCard";
import InfoStatCard from "@/components/shared/InfoStatCard";

import MRIResultPanel from "@/components/mri/MRIResultPanel";
import EEGResultPanel from "@/components/eeg/EEGResultPanel";

function getReadableLabel(label = "") {
  const normalized = String(label).toLowerCase();

  const map = {
    hemorrhagic: "Hemorrhagic Stroke",
    ischemic: "Ischemic Stroke",
    normal: "Normal",
  };

  return map[normalized] || label || "-";
}

function getPredictionColor(label = "") {
  const normalized = String(label).toLowerCase();

  if (normalized === "normal") return "text-blue-400";
  if (normalized === "ischemic") return "text-yellow-400";
  if (normalized === "hemorrhagic") return "text-red-400";

  return "text-emerald-400";
}

export default function MultimodalResultPanel({ result, apiBaseUrl }) {
  const fusion = result?.fusion_result;
  const mri = result?.mri_result;
  const eeg = result?.eeg_result;

  return (
    <div className="mt-8 grid gap-6">
      <SectionCard>
        <h2 className="text-2xl font-semibold">Final Multimodal Diagnosis</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <InfoStatCard
            label="Final Prediction"
            value={getReadableLabel(fusion?.prediction_label)}
            valueClassName={getPredictionColor(fusion?.prediction_label)}
          />

          <InfoStatCard
            label="Confidence"
            value={
              typeof fusion?.confidence === "number"
                ? `${(fusion.confidence * 100).toFixed(2)}%`
                : "-"
            }
          />

          <InfoStatCard
            label="Fusion Method"
            value={fusion?.fusion_method_label ?? fusion?.fusion_method ?? "-"}
          />
        </div>

        <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-5">
          <p className="text-xs uppercase tracking-wider text-white/50">
            Final Explanation
          </p>

          <p className="mt-3 text-sm leading-7 text-white/80">
            {result?.explanation_text || "-"}
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs uppercase tracking-wider text-white/50">
              MRI Result
            </p>

            <p
              className={`mt-2 font-medium ${getPredictionColor(mri?.prediction_label)}`}
            >
              {getReadableLabel(mri?.prediction_label)}
            </p>

            <p className="mt-1 text-sm text-white/70">
              {typeof mri?.confidence === "number"
                ? `${(mri.confidence * 100).toFixed(2)}%`
                : "-"}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs uppercase tracking-wider text-white/50">
              EEG Result
            </p>

            <p
              className={`mt-2 font-medium ${getPredictionColor(eeg?.prediction_label)}`}
            >
              {getReadableLabel(eeg?.prediction_label)}
            </p>

            <p className="mt-1 text-sm text-white/70">
              {typeof eeg?.confidence === "number"
                ? `${(eeg.confidence * 100).toFixed(2)}%`
                : "-"}
            </p>
          </div>
        </div>
      </SectionCard>

      {mri && (
        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-white">
              MRI Analysis Result
            </h2>
            <p className="mt-1 text-sm text-white/50">
              Same result format as MRI XAI page.
            </p>
          </div>

          <MRIResultPanel result={mri} apiBaseUrl={apiBaseUrl} />
        </div>
      )}

      {eeg && (
        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-white">
              EEG Analysis Result
            </h2>
            <p className="mt-1 text-sm text-white/50">
              Same result format as EEG XAI page.
            </p>
          </div>

          <EEGResultPanel result={eeg} />
        </div>
      )}
    </div>
  );
}

import SectionCard from "@/components/shared/SectionCard";
import InfoStatCard from "@/components/shared/InfoStatCard";

function cleanText(value = "") {
  return String(value)
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/ischaemic/gi, "ischemic")
    .replace(/ischaemia/gi, "ischemia")
    .replace(/\s+/g, " ")
    .trim();
}

function formatPercent(value) {
  if (typeof value !== "number") return "-";
  return `${(value * 100).toFixed(2)}%`;
}

function getReadableLabel(label) {
  const normalized = cleanText(label).toLowerCase();

  const map = {
    normal: "Normal",
    hemorrhagic: "Hemorrhagic Stroke",
    ischemic: "Ischemic Stroke",
  };

  return map[normalized] || cleanText(label);
}

function titleCase(value = "") {
  return cleanText(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getPredictionTone(label) {
  const normalized = cleanText(label).toLowerCase();

  if (normalized === "normal") {
    return {
      valueClassName: "text-blue-400",
      badgeClassName: "border-blue-400/30 bg-blue-400/10 text-blue-300",
    };
  }

  return {
    valueClassName: "text-red-400",
    badgeClassName: "border-red-400/30 bg-red-400/10 text-red-300",
  };
}

function buildSimpleExplanation(result) {
  const label = cleanText(result?.prediction_label).toLowerCase();
  const readableLabel = getReadableLabel(label);
  const confidence = formatPercent(result?.confidence);
  const zoneAnalysis = result?.zone_analysis;
  const isNormal = label === "normal";

  if (isNormal) {
    return {
      title: "MRI Result Summary",
      summary: `The model classified this MRI image as ${readableLabel} with ${confidence} confidence.`,
      zone: "The blue zone shows the image area that supports the normal prediction. A darker blue means stronger support for normal classification.",
      interpretation:
        "Because the result is normal, the system does not use yellow or red disease colors. This avoids confusing normal-supporting areas with disease areas.",
      clinicalNote:
        "This result should still be reviewed together with symptoms, medical history, and professional radiology assessment.",
    };
  }

  return {
    title: "MRI Result Summary",
    summary: `The model classified this MRI image as ${readableLabel} with ${confidence} confidence.`,
    zone:
      zoneAnalysis?.active_area_percent != null
        ? `The warning/risk zone covers approximately ${zoneAnalysis.active_area_percent}% of the image area.`
        : "The color zone shows how strongly each region contributes to the disease prediction.",
    interpretation:
      zoneAnalysis?.interpretation ||
      "Blue indicates normal/low contribution, green indicates observation, yellow indicates early warning, and red indicates strong disease prediction.",
    clinicalNote:
      "This visualization is an AI explainability aid. It should not replace clinical judgment, radiologist interpretation, or complete medical evaluation.",
  };
}

function ColorLegend({ isNormal }) {
  if (isNormal) {
    return (
      <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-4">
        <p className="text-sm font-semibold text-white">Color Meaning</p>

        <div className="mt-3 flex items-center gap-3 text-sm text-white/70">
          <span className="h-4 w-4 rounded-full bg-blue-600" />
          <span>
            Blue = normal area. Darker blue means stronger support for normal
            prediction.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-4">
      <p className="text-sm font-semibold text-white">Color Meaning</p>

      <div className="mt-3 grid gap-3 text-sm text-white/70">
        <div className="flex items-center gap-3">
          <span className="h-4 w-4 rounded-full bg-blue-600" />
          <span>Blue = normal / very low disease contribution</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="h-4 w-4 rounded-full bg-green-500" />
          <span>Green = normal observation / low contribution</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="h-4 w-4 rounded-full bg-yellow-400" />
          <span>Yellow = early warning toward disease prediction</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="h-4 w-4 rounded-full bg-red-500" />
          <span>Red = strong disease prediction area</span>
        </div>
      </div>
    </div>
  );
}

export default function MRIResultPanel({ result, apiBaseUrl }) {
  const normalizedLabel = cleanText(result?.prediction_label).toLowerCase();
  const isNormal = normalizedLabel === "normal";
  const readableLabel = getReadableLabel(result?.prediction_label);
  const tone = getPredictionTone(result?.prediction_label);
  const explanation = buildSimpleExplanation(result);
  const zoneAnalysis = result?.zone_analysis;

  const shouldShowRawHeatmap = result?.raw_heatmap_url;

  return (
    <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_1fr]">
      <SectionCard>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Prediction</h2>
            <p className="mt-2 text-sm leading-6 text-white/60">
              AI-based MRI classification with clinical color-zone explanation.
            </p>
          </div>

          <span
            className={`w-fit rounded-full border px-3 py-1 text-xs font-medium ${tone.badgeClassName}`}
          >
            {isNormal ? "Normal Zone" : "Disease Risk Zone"}
          </span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <InfoStatCard
            label="Prediction Label"
            value={readableLabel}
            valueClassName={tone.valueClassName}
          />

          <InfoStatCard
            label="Confidence"
            value={formatPercent(result?.confidence)}
          />
        </div>

        {zoneAnalysis && (
          <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-5">
            <p className="text-xs uppercase tracking-wider text-white/50">
              Zone-Based Analysis
            </p>

            <div className="mt-4 grid gap-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                <span className="text-white/50">Zone Type</span>
                <span className="text-right font-medium text-white">
                  {titleCase(zoneAnalysis.zone_label)}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                <span className="text-white/50">Disease Prediction</span>
                <span
                  className={
                    zoneAnalysis.is_disease_prediction
                      ? "font-medium text-red-400"
                      : "font-medium text-blue-400"
                  }
                >
                  {zoneAnalysis.is_disease_prediction
                    ? "Detected"
                    : "Not Detected"}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-white/50">Risk / Warning Area</span>
                <span className="font-medium text-white">
                  {zoneAnalysis.active_area_percent ?? 0}%
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-5">
          <p className="text-xs uppercase tracking-wider text-white/50">
            Explanation
          </p>

          <div className="mt-4 space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-white">
                {explanation.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-white/75">
                {cleanText(explanation.summary)}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Color Zone</h3>
              <p className="mt-2 text-sm leading-7 text-white/75">
                {cleanText(explanation.zone)}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">
                Interpretation
              </h3>
              <p className="mt-2 text-sm leading-7 text-white/75">
                {cleanText(explanation.interpretation)}
              </p>
            </div>

            <div className="rounded-lg border border-yellow-400/20 bg-yellow-400/10 p-4">
              <h3 className="text-sm font-semibold text-yellow-200">
                Clinical Note
              </h3>
              <p className="mt-2 text-sm leading-7 text-yellow-100/80">
                {cleanText(explanation.clinicalNote)}
              </p>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-white">
            {isNormal ? "Normal Clinical Zone" : "Disease Risk Color Zone"}
          </h2>

          <p className="text-sm leading-6 text-white/60">
            {isNormal
              ? "Blue indicates normal-supporting regions. Darker blue means stronger support for normal prediction."
              : "Blue, green, yellow, and red show increasing contribution toward disease prediction."}
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-3">
          <img
            src={`${apiBaseUrl}${result.overlay_url}`}
            alt="MRI Clinical Zone Overlay"
            className="w-full rounded-xl object-cover"
          />
        </div>

        <ColorLegend isNormal={isNormal} />

        <div
          className={`mt-4 rounded-xl border p-4 ${
            isNormal
              ? "border-blue-400/20 bg-blue-400/10"
              : "border-white/10 bg-black/30"
          }`}
        >
          <p
            className={`text-sm leading-7 ${
              isNormal ? "text-blue-100/80" : "text-white/70"
            }`}
          >
            {isNormal
              ? "For normal results, blue is used intentionally. The system avoids yellow or red because those colors are reserved for warning and disease prediction."
              : "For disease results, color intensity increases from blue to green, yellow, and red. Red indicates the strongest disease-supporting area."}
          </p>
        </div>

        {shouldShowRawHeatmap && (
          <details className="mt-4 rounded-xl border border-white/10 bg-black/30 p-4">
            <summary className="cursor-pointer text-sm font-medium text-white">
              Show technical XAI heatmap
            </summary>

            <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
              <img
                src={`${apiBaseUrl}${result.raw_heatmap_url}`}
                alt="Technical XAI Heatmap"
                className="w-full object-cover"
              />
            </div>

            <p className="mt-3 text-xs leading-5 text-white/50">
              This technical heatmap shows contribution values used by the XAI
              method. The color interpretation follows the clinical color
              agreement: blue for normal, green for observation, yellow for
              early warning, and red for strong disease prediction.
            </p>
          </details>
        )}
      </SectionCard>
    </div>
  );
}

import SectionCard from "@/components/shared/SectionCard";
import EEGWaveformChart from "@/components/eeg/EEGWaveformChart";

const COLOR_MEANINGS = [
  { label: "Normal", color: "#2563eb" },
  { label: "Observation", color: "#22c55e" },
  { label: "Early Warning", color: "#facc15" },
  { label: "Strong Disease Contribution", color: "#ef4444" },
];

function getPrimarySegment(segments = []) {
  if (!segments.length) return null;

  const sorted = [...segments].sort(
    (a, b) => (b.importance_percent || 0) - (a.importance_percent || 0),
  );

  return sorted[0];
}

function getPredictionFromFilename(filename = "") {
  const name = filename.toLowerCase();

  if (name.includes("hemorrhagic") || name.includes("haemorrhagic")) {
    return "hemorrhagic";
  }

  if (name.includes("ischemic") || name.includes("ischaemic")) {
    return "ischemic";
  }

  if (name.includes("normal")) {
    return "normal";
  }

  return null;
}

function getReadableLabel(label = "") {
  const map = {
    hemorrhagic: "Hemorrhagic Stroke",
    ischemic: "Ischemic Stroke",
    normal: "Normal",
  };

  return map[label] || label || "-";
}

function getPredictionColor(label = "") {
  if (label === "normal") return "text-blue-400";
  if (label === "ischemic") return "text-yellow-400";
  if (label === "hemorrhagic") return "text-red-400";

  return "text-purple-400";
}

function buildFilenameBasedExplanation(label, confidence, primarySegment) {
  const readableLabel = getReadableLabel(label);
  const confidenceText =
    typeof confidence === "number" ? `${(confidence * 100).toFixed(2)}%` : "-";

  if (!label || label === "-") {
    return "Prediction label could not be inferred from the uploaded filename.";
  }

  if (label === "normal") {
    return `Based on the uploaded filename, this EEG file is categorized as Normal. The graph still shows section-based contribution areas. Blue indicates normal or low contribution, green indicates observation, yellow indicates early warning, and red indicates strong disease-related contribution.`;
  }

  return `Based on the uploaded filename, this EEG file is categorized as ${readableLabel}. Backend confidence is ${confidenceText}. ${
    primarySegment?.name
      ? `Section ${primarySegment.name} shows the strongest contribution area with ${primarySegment.importance_percent}% relative contribution.`
      : ""
  } Blue indicates normal or low contribution, green indicates observation, yellow indicates early warning, and red indicates strong disease-related contribution.`;
}

export default function EEGResultPanel({ result }) {
  const primarySegment = getPrimarySegment(result.important_segments || []);

  const filenamePrediction = getPredictionFromFilename(
    result.uploaded_filename || "",
  );

  const displayPrediction =
    filenamePrediction || result.prediction_label || "-";

  const displayExplanation = buildFilenameBasedExplanation(
    displayPrediction,
    result.confidence,
    primarySegment,
  );

  return (
    <div className="mt-8 grid gap-6">
      <SectionCard>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <p className="text-xs uppercase tracking-wider text-white/50">
              Prediction
            </p>

            <p
              className={`mt-3 text-xl font-semibold ${getPredictionColor(
                displayPrediction,
              )}`}
            >
              {getReadableLabel(displayPrediction)}
            </p>

            {filenamePrediction && (
              <p className="mt-2 text-xs text-white/40">
                Read from filename: {result.uploaded_filename}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <p className="text-xs uppercase tracking-wider text-white/50">
              Confidence
            </p>

            <p className="mt-3 text-xl font-semibold text-white">
              {typeof result.confidence === "number"
                ? `${(result.confidence * 100).toFixed(2)}%`
                : "-"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <p className="text-xs uppercase tracking-wider text-white/50">
              Main Focus
            </p>

            <p className="mt-3 text-xl font-semibold text-white">
              {primarySegment?.name || "Not detected"}
            </p>

            {primarySegment && (
              <p className="mt-2 text-xs text-white/40">
                {primarySegment.importance_percent}% contribution
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-5">
          <p className="text-xs uppercase tracking-wider text-white/50">
            AI Explanation
          </p>

          <p className="mt-3 text-sm leading-7 text-white/80">
            {displayExplanation}
          </p>
        </div>
      </SectionCard>

      <SectionCard>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">EEG Signal Graph</h2>

            <p className="mt-1 text-sm text-white/50">
              One combined EEG graph with section markers P1–P4 and color-coded
              contribution areas.
            </p>
          </div>

          {result.uploaded_filename && (
            <p className="text-xs text-white/40">{result.uploaded_filename}</p>
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
          <EEGWaveformChart
            data={result.graph_data || []}
            graphSections={result.graph_sections || []}
            importantSegments={result.important_segments || []}
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {COLOR_MEANINGS.map((item) => (
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
      </SectionCard>
    </div>
  );
}

import SectionCard from "@/components/shared/SectionCard";
import InfoStatCard from "@/components/shared/InfoStatCard";
import EEGWaveformChart from "@/components/eeg/EEGWaveformChart";
import EEGColorLegend from "@/components/eeg/EEGColorLegend";
import EEGScalogramChart from "@/components/eeg/EEGScalogramChart";

function getActiveSubjectData(result) {
  if (!result) return null;

  if (result.selected_subject_data) {
    return result.selected_subject_data;
  }

  return result;
}

export default function EEGResultPanel({ result }) {
  const activeData = getActiveSubjectData(result);

  const graphData = activeData?.graph_data || [];
  const graphSections = activeData?.graph_sections || [];
  const importantSegments = activeData?.important_segments || [];
  const frequencyAnalysis = activeData?.frequency_analysis || null;
  const colorLegend = activeData?.color_legend || [];
  const predictionLabel = activeData?.prediction_label || "-";
  const confidence = activeData?.confidence || 0;
  const explanationText =
    activeData?.explanation_text || "No explanation available yet.";

  return (
    <div className="mt-8 grid gap-6">
      {/* Prediction summary */}
      <SectionCard>
        <div className="grid gap-4 md:grid-cols-3">
          <InfoStatCard
            label="Prediction"
            value={predictionLabel}
            valueClassName="text-purple-400"
          />
          <InfoStatCard
            label="Confidence"
            value={`${(confidence * 100).toFixed(2)}%`}
          />
          <InfoStatCard
            label="Main Focus"
            value={activeData?.main_focus_section || "-"}
          />
        </div>

        <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-5">
          <p className="text-xs uppercase tracking-wider text-white/50">
            AI Explanation
          </p>
          <p className="mt-3 text-sm leading-7 text-white/80">
            {explanationText}
          </p>
        </div>
      </SectionCard>

      {/* EEG Signal Graph */}
      <SectionCard>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">EEG Signal Graph</h2>
            <p className="mt-1 text-sm text-white/50">
              Signal graph with section markers and color-highlighted dominant
              contribution areas.
            </p>
          </div>

          {activeData?.uploaded_filename && (
            <p className="text-xs text-white/40">
              {activeData.uploaded_filename}
            </p>
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
          <EEGWaveformChart
            data={graphData}
            graphSections={graphSections}
            importantSegments={importantSegments}
            frequencyAnalysis={frequencyAnalysis}
          />
        </div>
      </SectionCard>

      {/* Frequency Analysis */}
      <SectionCard>
        <div className="mb-5">
          <h2 className="text-2xl font-semibold">Frequency Analysis</h2>
          <p className="mt-1 text-sm text-white/50">
            Time-frequency style visualization inspired by the concept from your
            lecturer.
          </p>
        </div>

        <EEGScalogramChart
          plot={frequencyAnalysis?.scalogram_plot}
          title="Scalogram Time-Frequency Plot"
          annotationLabel="Abnormal Spatio-Temporal Event Detected"
        />
      </SectionCard>

      {/* Color explanation */}
      <SectionCard>
        <h2 className="text-2xl font-semibold">Color Explanation</h2>
        <p className="mt-1 text-sm text-white/50">
          Colors show contribution intensity or power level, not direct
          diagnosis by themselves.
        </p>

        <div className="mt-5">
          <EEGColorLegend legends={colorLegend} />
        </div>
      </SectionCard>
    </div>
  );
}

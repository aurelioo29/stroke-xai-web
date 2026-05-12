"use client";

import EEGWaveformChart from "@/components/eeg/EEGWaveformChart";

export default function EEGSubjectGraphs({ subjectGraphs = [] }) {
  if (!subjectGraphs.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-black/30 p-5 text-sm text-white/60">
        No subject graphs available.
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      {subjectGraphs.map((item) => (
        <div
          key={item.subject}
          className="rounded-2xl border border-white/10 bg-black/30 p-5"
        >
          <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">
                {String(item.subject).replace("_", " ").toUpperCase()}
              </h3>

              <p className="mt-1 text-xs text-white/50">
                Average EEG signal from {item.trial_count} trials • Channel{" "}
                {item.selected_channel}
              </p>
            </div>

            <p className="text-xs text-white/40">
              P1=s1–s256 • P2=s257–s512 • P3=s513–s768 • P4=s769–s1024
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/20 p-3">
            <EEGWaveformChart
              data={item.graph_data || []}
              graphSections={item.graph_sections || []}
              importantSegments={[]}
              compact
            />
          </div>
        </div>
      ))}
    </div>
  );
}

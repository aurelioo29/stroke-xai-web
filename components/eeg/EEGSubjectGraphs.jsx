"use client";

import { useState } from "react";
import EEGWaveformChart from "@/components/eeg/EEGWaveformChart";

function formatSubjectName(subject = "") {
  return String(subject).replace("_", " ").toUpperCase();
}

export default function EEGSubjectGraphs({ subjectGraphs = [] }) {
  const [selectedSubject, setSelectedSubject] = useState(
    subjectGraphs?.[0]?.subject || "",
  );

  if (!subjectGraphs.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-black/30 p-5 text-sm text-white/60">
        No subject graphs available.
      </div>
    );
  }

  const activeGraph =
    subjectGraphs.find((item) => item.subject === selectedSubject) ||
    subjectGraphs[0];

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-white">Select Subject</p>
          <p className="mt-1 text-xs text-white/50">
            Each subject graph is averaged from all available trials.
          </p>
        </div>

        <select
          value={activeGraph.subject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
        >
          {subjectGraphs.map((item) => (
            <option key={item.subject} value={item.subject}>
              {formatSubjectName(item.subject)}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
        <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {formatSubjectName(activeGraph.subject)}
            </h3>

            <p className="mt-1 text-xs text-white/50">
              Average EEG signal from {activeGraph.trial_count} trials • Channel{" "}
              {activeGraph.selected_channel}
            </p>
          </div>

          <p className="text-xs text-white/40">
            P1=s1–s256 • P2=s257–s512 • P3=s513–s768 • P4=s769–s1024
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
          <EEGWaveformChart
            data={activeGraph.graph_data || []}
            graphSections={activeGraph.graph_sections || []}
            importantSegments={[]}
            compact
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import API from "@/lib/api";
import PageHeader from "@/components/shared/PageHeader";
import SectionCard from "@/components/shared/SectionCard";
import PrimaryButton from "@/components/shared/PrimaryButton";
import EmptyState from "@/components/shared/EmptyState";
import EEGResultPanel from "@/components/eeg/EEGResultPanel";

export default function EEGPage() {
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState("");

  const [graphChannel, setGraphChannel] = useState(1);
  const [sectionCount, setSectionCount] = useState(4);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    setWarning("");
    setResult(null);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const isCsv =
      selectedFile.type === "text/csv" ||
      selectedFile.name.toLowerCase().endsWith(".csv");

    if (!isCsv) {
      setFile(null);
      setWarning("Invalid file. Please upload EEG data in .csv format.");
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (!file) {
      setWarning("Please upload an EEG CSV file first.");
      return;
    }

    setLoading(true);
    setResult(null);
    setWarning("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("graph_channel", String(graphChannel));
      formData.append("section_count", String(sectionCount));

      const res = await API.post("/predict/eeg-xai-csv", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(res.data.data);
    } catch (error) {
      console.error(error);

      const message =
        error?.response?.data?.detail ||
        "Failed to process EEG CSV. Please check the file format and backend response.";

      setWarning(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="EEG XAI Analysis"
        description="Upload EEG CSV and review a single section-marked signal graph with concise AI explanation."
      />

      <SectionCard>
        <div className="grid gap-5 md:grid-cols-[1.3fr_0.7fr]">
          <div>
            <label className="text-sm font-medium text-white">
              Upload EEG CSV
            </label>

            <div className="mt-3 flex flex-col gap-4 rounded-2xl border border-dashed border-white/15 bg-black/30 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-white/80">
                  Accepted format: <span className="font-semibold">.csv</span>
                </p>
                <p className="mt-1 text-xs text-white/50">
                  Example columns: ch1_s1, ch1_s2, ch1_s3, ...
                </p>

                {file && (
                  <p className="mt-3 text-sm text-emerald-300">
                    Selected: {file.name}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <input
                  ref={inputRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-white hover:bg-white/10"
                >
                  Choose CSV
                </button>

                <PrimaryButton onClick={handleSubmit} disabled={loading}>
                  {loading ? "Analyzing..." : "Run EEG XAI"}
                </PrimaryButton>
              </div>
            </div>

            {warning && (
              <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                {warning}
              </div>
            )}
          </div>

          <div className="grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <label className="text-xs uppercase tracking-wider text-white/50">
                Channel
              </label>
              <select
                value={graphChannel}
                onChange={(e) => setGraphChannel(Number(e.target.value))}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none"
              >
                {Array.from({ length: 16 }, (_, i) => i + 1).map((ch) => (
                  <option key={ch} value={ch}>
                    Channel {ch}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <label className="text-xs uppercase tracking-wider text-white/50">
                Sections
              </label>
              <select
                value={sectionCount}
                onChange={(e) => setSectionCount(Number(e.target.value))}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none"
              >
                <option value={4}>4 Sections (P1–P4)</option>
              </select>
            </div>
          </div>
        </div>
      </SectionCard>

      {!result && !loading && (
        <div className="mt-8">
          <EmptyState
            title="No analysis yet"
            description="Upload EEG CSV to generate a single section-based EEG graph and concise AI explanation."
          />
        </div>
      )}

      {result && <EEGResultPanel result={result} />}
    </>
  );
}

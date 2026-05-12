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

  // Fixed setting:
  // P1 = ch1_s1   - ch1_s256
  // P2 = ch1_s257 - ch1_s512
  // P3 = ch1_s513 - ch1_s768
  // P4 = ch1_s769 - ch1_s1024
  const sectionCount = 4;
  const sectionSize = 256;
  const cycleCount = 1;

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
      setWarning("File tidak valid. Upload hanya menerima file .csv.");
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (!file) {
      setWarning("Silakan upload file EEG CSV terlebih dahulu.");
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
      formData.append("section_size", String(sectionSize));
      formData.append("cycle_count", String(cycleCount));

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
        error?.response?.data?.message ||
        "Gagal memproses EEG CSV. Cek format CSV atau backend response.";

      setWarning(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="EEG XAI Analysis"
        description="Upload EEG CSV and view one combined graph marked by P1–P4 sections."
      />

      <SectionCard>
        <div className="grid gap-5 md:grid-cols-[1.4fr_0.6fr]">
          <div>
            <label className="text-sm font-medium text-white">
              Upload EEG CSV
            </label>

            <div className="mt-3 flex flex-col gap-4 rounded-2xl border border-dashed border-white/15 bg-black/30 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-white/80">
                  Accepted format:{" "}
                  <span className="font-semibold text-white">.csv</span>
                </p>

                <p className="mt-1 text-xs leading-5 text-white/50">
                  Section format: P1=s1–s256, P2=s257–s512, P3=s513–s768,
                  P4=s769–s1024.
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
              <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm leading-6 text-red-200">
                {warning}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <label className="text-xs uppercase tracking-wider text-white/50">
              EEG Channel
            </label>

            <select
              value={graphChannel}
              onChange={(e) => setGraphChannel(Number(e.target.value))}
              className="mt-3 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
            >
              {Array.from({ length: 16 }, (_, index) => {
                const channel = index + 1;

                return (
                  <option key={channel} value={channel}>
                    Channel {channel}
                  </option>
                );
              })}
            </select>

            <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-3">
              <p className="text-xs leading-5 text-white/50">
                Fixed section: 1 cycle × 4 sections. Each section contains 256
                samples.
              </p>
            </div>
          </div>
        </div>
      </SectionCard>

      {!result && !loading && (
        <div className="mt-8">
          <EmptyState
            title="No analysis yet"
            description="Upload EEG CSV to generate one graph with P1–P4 section markers."
          />
        </div>
      )}

      {result && <EEGResultPanel result={result} />}
    </>
  );
}

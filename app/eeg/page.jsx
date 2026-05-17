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

  /**
   * Final EEG section setting:
   *
   * P1 = ch1_s1   - ch1_s256
   * P2 = ch1_s257 - ch1_s512
   * P3 = ch1_s513 - ch1_s768
   * P4 = ch1_s769 - ch1_s1024
   */
  const sectionCount = 4;
  const sectionSize = 256;
  const cycleCount = 1;

  /**
   * Important:
   * Change this only if your EEG dataset uses another sampling rate.
   */
  const samplingRate = 256;

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

  const handleClearFile = () => {
    setFile(null);
    setResult(null);
    setWarning("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
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
      formData.append("sampling_rate", String(samplingRate));

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
        "Gagal memproses EEG CSV. Cek format CSV, backend response, atau package backend.";

      setWarning(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="EEG XAI Analysis"
        description="Upload EEG CSV to review patient-based signal graph, P1–P4 section markers, and scalogram-style frequency analysis."
      />

      <SectionCard>
        <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          {/* Upload Area */}
          <div>
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-medium text-white">
                Upload EEG CSV
              </label>

              {file && (
                <button
                  type="button"
                  onClick={handleClearFile}
                  className="text-xs font-medium text-red-300 hover:text-red-200"
                >
                  Clear file
                </button>
              )}
            </div>

            <div className="mt-3 rounded-2xl border border-dashed border-white/15 bg-black/30 p-5">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-white/80">
                    Accepted format:{" "}
                    <span className="font-semibold text-white">.csv</span>
                  </p>

                  <p className="mt-2 text-xs leading-5 text-white/50">
                    Dataset format should contain columns like{" "}
                    <span className="text-white/70">ch1_s1</span>,{" "}
                    <span className="text-white/70">ch1_s2</span>, ...,{" "}
                    <span className="text-white/70">ch1_s1024</span>, plus{" "}
                    <span className="text-white/70">subject</span> and{" "}
                    <span className="text-white/70">trial</span> when available.
                  </p>

                  {file ? (
                    <p className="mt-3 text-sm text-emerald-300">
                      Selected: {file.name}
                    </p>
                  ) : (
                    <p className="mt-3 text-sm text-white/40">
                      No CSV selected yet.
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
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
            </div>

            {warning && (
              <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm leading-6 text-red-200">
                {warning}
              </div>
            )}
          </div>

          {/* Settings Area */}
          <div className="grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
              <label className="text-xs uppercase tracking-wider text-white/50">
                EEG Channel
              </label>

              <select
                value={graphChannel}
                onChange={(e) => setGraphChannel(Number(e.target.value))}
                disabled={loading}
                className="mt-3 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-50"
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
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
              <p className="text-xs uppercase tracking-wider text-white/50">
                Section Setting
              </p>

              <div className="mt-4 grid gap-2 text-xs leading-5 text-white/55">
                <p>
                  <span className="font-semibold text-white/80">P1</span> =
                  s1–s256
                </p>
                <p>
                  <span className="font-semibold text-white/80">P2</span> =
                  s257–s512
                </p>
                <p>
                  <span className="font-semibold text-white/80">P3</span> =
                  s513–s768
                </p>
                <p>
                  <span className="font-semibold text-white/80">P4</span> =
                  s769–s1024
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
              <p className="text-xs uppercase tracking-wider text-white/50">
                Frequency Setting
              </p>

              <p className="mt-3 text-xs leading-5 text-white/55">
                Sampling rate:{" "}
                <span className="font-semibold text-white">
                  {samplingRate} Hz
                </span>
                . This is used for the scalogram-style frequency analysis.
              </p>
            </div>
          </div>
        </div>
      </SectionCard>

      {!result && !loading && (
        <div className="mt-8">
          <EmptyState
            title="No analysis yet"
            description="Upload EEG CSV to generate patient-based waveform and scalogram-style frequency map."
          />
        </div>
      )}

      {loading && (
        <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-6">
          <p className="text-sm font-medium text-white">Processing EEG...</p>
          <p className="mt-2 text-sm text-white/50">
            Reading CSV, splitting P1–P4, generating patient graphs, and
            building frequency analysis. Basically making the data do cardio.
          </p>
        </div>
      )}

      {result && !loading && <EEGResultPanel result={result} />}
    </>
  );
}

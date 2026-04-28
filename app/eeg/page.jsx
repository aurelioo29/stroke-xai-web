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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    setWarning("");
    setResult(null);

    if (!selectedFile) return;

    const isCsv =
      selectedFile.type === "text/csv" ||
      selectedFile.name.toLowerCase().endsWith(".csv");

    if (!isCsv) {
      setFile(null);
      setWarning(
        "File tidak valid. Upload hanya menerima file .csv untuk data EEG.",
      );
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (!file) {
      setWarning("Silakan upload file EEG berformat .csv terlebih dahulu.");
      return;
    }

    setLoading(true);
    setResult(null);
    setWarning("");

    try {
      const formData = new FormData();
      formData.append("file", file);

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
        "Gagal memproses EEG. Cek format CSV kamu, jangan sampai CSV-nya pura-pura sehat.";

      setWarning(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="EEG XAI Analysis"
        description="Upload EEG CSV, review waveform graph, prediction result, and highlighted influential signal segments."
      />

      <SectionCard>
        <div className="grid gap-5">
          <div>
            <label className="text-sm font-medium text-white">
              Upload EEG CSV
            </label>

            <div className="mt-3 flex flex-col gap-4 rounded-2xl border border-dashed border-white/15 bg-black/30 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-white/80">
                  Format wajib:{" "}
                  <span className="font-semibold text-white">.csv</span>
                </p>
                <p className="mt-1 text-xs text-white/50">
                  Kolom yang dibutuhkan: p1, p2, p3, p4
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
        </div>
      </SectionCard>

      {!result && !loading && (
        <div className="mt-8">
          <EmptyState
            title="No analysis yet"
            description="Upload EEG CSV to generate waveform visualization, prediction result, and important signal segments."
          />
        </div>
      )}

      {result && <EEGResultPanel result={result} />}
    </>
  );
}

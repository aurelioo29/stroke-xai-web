"use client";

import { useRef, useState } from "react";
import API from "@/lib/api";

import PageHeader from "@/components/shared/PageHeader";
import SectionCard from "@/components/shared/SectionCard";
import PrimaryButton from "@/components/shared/PrimaryButton";
import EmptyState from "@/components/shared/EmptyState";

import MRIResultPanel from "@/components/mri/MRIResultPanel";
import EEGResultPanel from "@/components/eeg/EEGResultPanel";
import MultimodalResultPanel from "@/components/multimodal/MultimodalResultPanel";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

function isImageFile(file) {
  return file?.type?.startsWith("image/");
}

function isCsvFile(file) {
  return (
    file?.type === "text/csv" || file?.name?.toLowerCase().endsWith(".csv")
  );
}

export default function MultimodalPage() {
  const mriInputRef = useRef(null);
  const eegInputRef = useRef(null);

  const [mriFile, setMriFile] = useState(null);
  const [eegFile, setEegFile] = useState(null);

  const [result, setResult] = useState(null);
  const [resultType, setResultType] = useState("");
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState("");

  const [graphChannel, setGraphChannel] = useState(1);

  const sectionCount = 4;
  const sectionSize = 256;
  const cycleCount = 1;
  const samplingRate = 256;

  const handleMriFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    setWarning("");
    setResult(null);
    setResultType("");

    if (!selectedFile) {
      setMriFile(null);
      return;
    }

    if (!isImageFile(selectedFile)) {
      setMriFile(null);
      setWarning(
        "File MRI harus berupa gambar, misalnya .jpg, .jpeg, atau .png.",
      );
      e.target.value = "";
      return;
    }

    setMriFile(selectedFile);
  };

  const handleEegFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    setWarning("");
    setResult(null);
    setResultType("");

    if (!selectedFile) {
      setEegFile(null);
      return;
    }

    if (!isCsvFile(selectedFile)) {
      setEegFile(null);
      setWarning("File EEG harus berformat .csv.");
      e.target.value = "";
      return;
    }

    setEegFile(selectedFile);
  };

  const handleClear = () => {
    setMriFile(null);
    setEegFile(null);
    setResult(null);
    setResultType("");
    setWarning("");

    if (mriInputRef.current) mriInputRef.current.value = "";
    if (eegInputRef.current) eegInputRef.current.value = "";
  };

  const buildEegFormData = () => {
    const formData = new FormData();

    formData.append("file", eegFile);
    formData.append("graph_channel", String(graphChannel));
    formData.append("section_count", String(sectionCount));
    formData.append("section_size", String(sectionSize));
    formData.append("cycle_count", String(cycleCount));
    formData.append("sampling_rate", String(samplingRate));

    return formData;
  };

  const buildMultimodalFormData = () => {
    const formData = new FormData();

    formData.append("mri_file", mriFile);
    formData.append("eeg_file", eegFile);

    formData.append("graph_channel", String(graphChannel));
    formData.append("section_count", String(sectionCount));
    formData.append("section_size", String(sectionSize));
    formData.append("cycle_count", String(cycleCount));
    formData.append("sampling_rate", String(samplingRate));

    return formData;
  };

  const handleSubmit = async () => {
    if (!mriFile && !eegFile) {
      setWarning("Upload minimal 1 file: MRI image atau EEG CSV.");
      return;
    }

    setLoading(true);
    setResult(null);
    setResultType("");
    setWarning("");

    try {
      // MRI only
      if (mriFile && !eegFile) {
        const formData = new FormData();
        formData.append("file", mriFile);

        const res = await API.post("/predict/mri-xai", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setResultType("mri");
        setResult(res.data.data);
        return;
      }

      // EEG only
      if (!mriFile && eegFile) {
        const formData = buildEegFormData();

        const res = await API.post("/predict/eeg-xai-csv", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setResultType("eeg");
        setResult(res.data.data);
        return;
      }

      // MRI + EEG CSV
      if (mriFile && eegFile) {
        const formData = buildMultimodalFormData();

        const res = await API.post("/predict/multimodal-csv", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setResultType("multimodal");
        setResult(res.data.data);
      }
    } catch (error) {
      console.error(error);

      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Terjadi error saat memproses data multimodal.";

      setWarning(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Multimodal Stroke Diagnosis"
        description="Upload MRI image, EEG CSV, or both. The result view follows the existing MRI and EEG analysis templates."
      />

      <SectionCard>
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr_0.7fr]">
          {/* MRI Upload */}
          <div>
            <p className="text-sm font-medium text-white">MRI Image</p>

            <div className="mt-3 rounded-2xl border border-dashed border-white/15 bg-black/30 p-5">
              <p className="text-sm text-white/80">
                Accepted:{" "}
                <span className="font-semibold">.jpg, .jpeg, .png</span>
              </p>

              <p className="mt-2 text-xs leading-5 text-white/50">
                Upload MRI image to run MRI XAI or multimodal fusion.
              </p>

              {mriFile ? (
                <p className="mt-3 text-sm text-emerald-300">
                  Selected: {mriFile.name}
                </p>
              ) : (
                <p className="mt-3 text-sm text-white/40">No MRI selected.</p>
              )}

              <input
                ref={mriInputRef}
                type="file"
                accept="image/*"
                onChange={handleMriFileChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => mriInputRef.current?.click()}
                className="mt-4 rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-white hover:bg-white/10"
              >
                Choose MRI
              </button>
            </div>
          </div>

          {/* EEG Upload */}
          <div>
            <p className="text-sm font-medium text-white">EEG CSV</p>

            <div className="mt-3 rounded-2xl border border-dashed border-white/15 bg-black/30 p-5">
              <p className="text-sm text-white/80">
                Accepted: <span className="font-semibold">.csv</span>
              </p>

              <p className="mt-2 text-xs leading-5 text-white/50">
                EEG CSV result will use the same template as the EEG XAI page.
              </p>

              {eegFile ? (
                <p className="mt-3 text-sm text-emerald-300">
                  Selected: {eegFile.name}
                </p>
              ) : (
                <p className="mt-3 text-sm text-white/40">No EEG selected.</p>
              )}

              <input
                ref={eegInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleEegFileChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => eegInputRef.current?.click()}
                className="mt-4 rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-white hover:bg-white/10"
              >
                Choose EEG CSV
              </button>
            </div>
          </div>

          {/* Settings */}
          <div className="grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
              <p className="text-xs uppercase tracking-wider text-white/50">
                EEG Channel
              </p>

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
                Section
              </p>

              <p className="mt-3 text-xs leading-5 text-white/55">
                P1=s1–s256, P2=s257–s512, P3=s513–s768, P4=s769–s1024.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <PrimaryButton onClick={handleSubmit} disabled={loading}>
                {loading ? "Running..." : "Run Analysis"}
              </PrimaryButton>

              {(mriFile || eegFile || result) && (
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={loading}
                  className="rounded-xl border border-red-400/20 px-5 py-3 text-sm font-medium text-red-200 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {warning && (
          <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm leading-6 text-red-200">
            {warning}
          </div>
        )}
      </SectionCard>

      {!result && !loading && (
        <div className="mt-8">
          <EmptyState
            title="No analysis yet"
            description="Upload MRI image, EEG CSV, or both to generate the correct analysis template."
          />
        </div>
      )}

      {loading && (
        <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-6">
          <p className="text-sm font-medium text-white">Processing...</p>
          <p className="mt-2 text-sm text-white/50">
            Running analysis based on uploaded file type. Because apparently one
            page now has to do three jobs. Fair enough.
          </p>
        </div>
      )}

      {result && !loading && resultType === "mri" && (
        <MRIResultPanel result={result} apiBaseUrl={API_BASE_URL} />
      )}

      {result && !loading && resultType === "eeg" && (
        <EEGResultPanel result={result} />
      )}

      {result && !loading && resultType === "multimodal" && (
        <MultimodalResultPanel result={result} apiBaseUrl={API_BASE_URL} />
      )}
    </>
  );
}

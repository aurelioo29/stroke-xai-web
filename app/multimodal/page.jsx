"use client";

import { useState } from "react";
import API from "@/lib/api";
import PageHeader from "@/components/shared/PageHeader";
import SectionCard from "@/components/shared/SectionCard";
import PrimaryButton from "@/components/shared/PrimaryButton";
import EmptyState from "@/components/shared/EmptyState";
import MultimodalResultPanel from "@/components/multimodal/MultimodalResultPanel";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export default function MultimodalPage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file) {
      alert("Upload file MRI terlebih dahulu");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const eeg = Array.from({ length: 1500 }, () => Math.random());

      const formData = new FormData();
      formData.append("file", file);
      formData.append("eeg_json", JSON.stringify(eeg));

      const res = await API.post("/predict/multimodal", formData);
      setResult(res.data.data);
    } catch (error) {
      console.error(error);
      alert("Terjadi error saat memproses data multimodal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Multimodal Stroke Diagnosis"
        description="Upload citra MRI dan jalankan analisis multimodal untuk memperoleh hasil prediksi akhir, visual explainability, dan explanation text."
      />

      <SectionCard>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-black"
          />

          <PrimaryButton onClick={handleSubmit} disabled={loading}>
            {loading ? "Running..." : "Run Multimodal Analysis"}
          </PrimaryButton>
        </div>
      </SectionCard>

      {!result && !loading && (
        <div className="mt-8">
          <EmptyState
            title="No analysis yet"
            description="Upload MRI image and run the multimodal pipeline to see fusion result, MRI explainability, and final explanation."
          />
        </div>
      )}

      {result && (
        <MultimodalResultPanel result={result} apiBaseUrl={API_BASE_URL} />
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import API from "@/lib/api";
import PageHeader from "@/components/shared/PageHeader";
import SectionCard from "@/components/shared/SectionCard";
import PrimaryButton from "@/components/shared/PrimaryButton";
import EmptyState from "@/components/shared/EmptyState";
import MRIResultPanel from "@/components/mri/MRIResultPanel";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export default function MRIPage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file) {
      alert("Upload MRI file first");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await API.post("/predict/mri-xai", formData);
      setResult(res.data.data);
    } catch (error) {
      console.error(error);
      alert("Failed to process MRI");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="MRI XAI Analysis"
        description="Upload MRI images to obtain prediction results and visual explainability using occlusion sensitivity."
      />

      <SectionCard>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-black"
          />

          <PrimaryButton onClick={handleSubmit} disabled={loading}>
            {loading ? "Predicting..." : "Run MRI XAI"}
          </PrimaryButton>
        </div>
      </SectionCard>

      {!result && !loading && (
        <div className="mt-8">
          <EmptyState
            title="No analysis yet"
            description="Upload an MRI image and run the model to see prediction results and heatmap overlay."
          />
        </div>
      )}

      {result && <MRIResultPanel result={result} apiBaseUrl={API_BASE_URL} />}
    </>
  );
}

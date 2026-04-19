"use client";

import { useState } from "react";
import API from "@/lib/api";
import PageHeader from "@/components/shared/PageHeader";
import SectionCard from "@/components/shared/SectionCard";
import PrimaryButton from "@/components/shared/PrimaryButton";
import EmptyState from "@/components/shared/EmptyState";
import EEGResultPanel from "@/components/eeg/EEGResultPanel";

export default function EEGPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);

    try {
      const eeg = Array.from({ length: 1500 }, () => Math.random());
      const res = await API.post("/predict/eeg-xai", eeg);
      setResult(res.data.data);
    } catch (error) {
      console.error(error);
      alert("Failed to process EEG");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="EEG XAI Analysis"
        description="Run EEG analysis to review prediction results, explanation text, and the most influential signal segments."
      />

      <SectionCard>
        <PrimaryButton onClick={handleSubmit} disabled={loading}>
          {loading ? "Analyzing..." : "Run EEG XAI"}
        </PrimaryButton>
      </SectionCard>

      {!result && !loading && (
        <div className="mt-8">
          <EmptyState
            title="No analysis yet"
            description="Run the EEG module to generate prediction results and important signal segments."
          />
        </div>
      )}

      {result && <EEGResultPanel result={result} />}
    </>
  );
}

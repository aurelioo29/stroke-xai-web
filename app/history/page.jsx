"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import HistoryCard from "@/components/history/HistoryCard";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export default function HistoryPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/predict/history")
      .then((res) => setData(res.data.data))
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <PageHeader
        title="History"
        description="Saved multimodal analysis results from the database."
      />

      {data.length === 0 ? (
        <EmptyState
          title="No history yet"
          description="Once analysis results are saved, they will appear here."
        />
      ) : (
        <div className="grid gap-5">
          {data.map((item) => (
            <HistoryCard key={item.id} item={item} apiBaseUrl={API_BASE_URL} />
          ))}
        </div>
      )}
    </>
  );
}

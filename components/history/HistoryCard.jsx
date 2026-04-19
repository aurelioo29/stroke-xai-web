export default function HistoryCard({ item, apiBaseUrl }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-white/50">
            Final Prediction
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-emerald-400">
            {item.fusion_prediction_label}
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Confidence: {(item.fusion_confidence * 100).toFixed(2)}%
          </p>
        </div>

        {item.overlay_url && (
          <img
            src={`${apiBaseUrl}${item.overlay_url}`}
            alt="History MRI Overlay"
            className="h-28 w-28 rounded-xl border border-white/10 object-cover"
          />
        )}
      </div>

      <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4">
        <p className="text-xs uppercase tracking-wider text-white/50">
          Explanation
        </p>
        <p className="mt-3 text-sm leading-7 text-white/80">
          {item.explanation_text}
        </p>
      </div>
    </div>
  );
}

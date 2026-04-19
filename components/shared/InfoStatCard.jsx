export default function InfoStatCard({ label, value, valueClassName = "" }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-4">
      <p className="text-xs uppercase tracking-wider text-white/50">{label}</p>
      <p className={`mt-2 text-lg font-semibold ${valueClassName}`}>{value}</p>
    </div>
  );
}

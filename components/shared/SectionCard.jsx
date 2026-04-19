export default function SectionCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/5 p-6 ${className}`}
    >
      {children}
    </div>
  );
}

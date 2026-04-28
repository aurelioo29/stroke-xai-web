export default function EEGColorLegend({ legends = [] }) {
  if (!legends.length) return null;

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {legends.map((item, index) => (
        <div
          key={index}
          className="rounded-xl border border-white/10 bg-black/30 p-4"
        >
          <div className="flex items-center gap-3">
            <span
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <div>
              <p className="text-sm font-semibold text-white">
                {item.level} — {item.label}
              </p>
              <p className="mt-1 text-xs leading-5 text-white/55">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

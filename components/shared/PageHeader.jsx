export default function PageHeader({ badge, title, description }) {
  return (
    <div className="mb-8">
      {badge && (
        <p className="mb-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70">
          {badge}
        </p>
      )}
      <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
      {description && (
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70 md:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

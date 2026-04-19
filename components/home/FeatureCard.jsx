import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FeatureCard({ item }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className="group relative flex min-h-[320px] overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-60`}
      />

      <div className="relative z-10 flex h-full w-full flex-col">
        <div
          className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 ${item.iconBg}`}
        >
          <Icon className={`h-7 w-7 ${item.iconColor}`} />
        </div>

        <h2 className="min-h-[64px] text-2xl font-semibold leading-snug">
          {item.title}
        </h2>

        <p className="mt-4 text-sm leading-7 text-white/70">
          {item.description}
        </p>

        <div className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-medium text-white">
          Open Module
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

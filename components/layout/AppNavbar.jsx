"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainCircuit } from "lucide-react";
import { navigationItems } from "@/data/navigation";

export default function AppNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <BrainCircuit className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <p className="text-sm font-semibold">Stroke XAI Platform</p>
            <p className="text-xs text-white/50">Clinical Decision Support</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navigationItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-4 py-2 text-sm transition ${
                  active
                    ? "bg-white text-black"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

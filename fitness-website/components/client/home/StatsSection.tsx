import { Users, Award, TrendingUp, Star } from "lucide-react";
import type { Stat } from "@/types";

const stats: Stat[] = [
  { icon: Users, label: "Active Members", value: "50K+" },
  { icon: Award, label: "Certified Trainers", value: "200+" },
  { icon: TrendingUp, label: "Success Stories", value: "10K+" },
  { icon: Star, label: "Programs Launched", value: "120+" },
];

export default function StatsSection() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Trusted Momentum
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950">
            Measured growth, softer experience.
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[1.75rem] border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-6 text-center shadow-sm"
            >
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <stat.icon className="h-8 w-8" />
              </div>
              <div className="mb-2 text-3xl font-bold text-slate-950">
                {stat.value}
              </div>
              <div className="text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

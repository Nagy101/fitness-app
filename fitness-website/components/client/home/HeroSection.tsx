import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Play,
  ArrowRight,
  TrendingUp,
  Dumbbell,
  Sparkles,
  Heart,
  ShieldCheck,
  Users,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_48%,#f4fbf5_100%)] pb-20 pt-16 lg:pb-28 lg:pt-24">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-8%] top-0 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
          <div className="space-y-8">
            <div className="space-y-5">
              <Badge className="rounded-full border border-primary/15 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary shadow-sm hover:bg-white">
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                Calm, guided fitness
              </Badge>
              <h1 className="max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                A quieter, more thoughtful way to build
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {" "}
                  strength and balance
                </span>
                .
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-600">
                Discover expert-led programs, supportive products, and practical
                wellness guidance designed to feel elegant, steady, and
                genuinely useful every day.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="rounded-full border border-white/80 bg-white/90 px-4 py-2 shadow-sm">
                Guided courses
              </span>
              <span className="rounded-full border border-white/80 bg-white/90 px-4 py-2 shadow-sm">
                Trusted products
              </span>
              <span className="rounded-full border border-white/80 bg-white/90 px-4 py-2 shadow-sm">
                Gentle progress tracking
              </span>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/courses">
                <Button
                  size="lg"
                  className="rounded-full bg-primary px-8 text-base text-white shadow-sm hover:bg-[#0056b3] transition-colors duration-200"
                >
                  Explore Programs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-slate-200 bg-white px-8 text-base text-slate-800 hover:bg-secondary hover:text-white hover:border-secondary transition-colors duration-200"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Learn Our Approach
                </Button>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-white/80 bg-white/90 p-4 shadow-sm">
                <div className="text-2xl font-bold text-slate-950">50K+</div>
                <p className="mt-1 text-sm text-slate-600">
                  Members building healthier routines
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/80 bg-white/90 p-4 shadow-sm">
                <div className="text-2xl font-bold text-slate-950">200+</div>
                <p className="mt-1 text-sm text-slate-600">
                  Experts supporting each phase
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/80 bg-white/90 p-4 shadow-sm">
                <div className="text-2xl font-bold text-slate-950">4.9</div>
                <p className="mt-1 text-sm text-slate-600">
                  Average experience rating
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-[linear-gradient(160deg,#0f172a_0%,#12314f_52%,#163b2a_100%)] shadow-[0_30px_90px_rgba(15,23,42,0.18)]">
              <div className="h-1.5 w-full bg-[linear-gradient(90deg,#007BFF,#32CD32)]" />
              <div className="grid gap-8 p-8 sm:p-10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
                      Wellness dashboard
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                      Designed for clarity, not pressure.
                    </h2>
                  </div>
                  <div className="rounded-full bg-white/10 p-3 text-white backdrop-blur">
                    <Dumbbell className="h-6 w-6" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
                    <div className="mb-5 flex items-center justify-between text-white/70">
                      <span className="text-sm">Weekly rhythm</span>
                      <span className="text-sm">Steady progress</span>
                    </div>
                    <div className="space-y-4">
                      {[
                        {
                          label: "Strength",
                          value: "92%",
                          width: "92%",
                          color: "bg-primary",
                        },
                        {
                          label: "Recovery",
                          value: "78%",
                          width: "78%",
                          color: "bg-secondary",
                        },
                        {
                          label: "Mobility",
                          value: "66%",
                          width: "66%",
                          color: "bg-white/70",
                        },
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="mb-1.5 flex items-center justify-between text-sm text-white/75">
                            <span>{item.label}</span>
                            <span>{item.value}</span>
                          </div>
                          <div className="h-2 rounded-full bg-white/10">
                            <div
                              className={`h-2 rounded-full ${item.color}`}
                              style={{ width: item.width }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
                      <div className="mb-3 inline-flex rounded-full bg-secondary/20 p-2 text-secondary">
                        <Heart className="h-4 w-4" />
                      </div>
                      <p className="text-sm text-white/65">
                        Recovery-first structure
                      </p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        Smarter, calmer training flow
                      </p>
                    </div>
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
                      <div className="mb-3 inline-flex rounded-full bg-primary/20 p-2 text-primary-foreground">
                        <ShieldCheck className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-sm text-white/65">
                        Expert-led guidance
                      </p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        Clear instruction at every level
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-white/80">
                  <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur">
                    Progress tracking
                  </span>
                  <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur">
                    Tailored learning
                  </span>
                  <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur">
                    Balanced wellness
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 left-6 hidden rounded-[1.5rem] border border-white/80 bg-white/95 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.10)] sm:block">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-secondary/15 p-3 text-secondary">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950">
                    Quiet consistency wins
                  </p>
                  <p className="text-sm text-slate-500">
                    Daily habits with less friction
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 top-10 hidden rounded-[1.5rem] border border-white/70 bg-white/95 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.10)] lg:block">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950">
                    50K+ active members
                  </p>
                  <p className="text-sm text-slate-500">
                    Trusted by a growing community
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

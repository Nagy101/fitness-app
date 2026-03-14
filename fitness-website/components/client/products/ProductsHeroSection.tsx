import type { ProductsHeroSectionProps } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, ShieldCheck, ShoppingBag, Sparkles } from "lucide-react";

export default function ProductsHeroSection({
  className = "",
}: ProductsHeroSectionProps) {
  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-b from-white to-gray-50 pb-12 pt-12 sm:pb-14 lg:pb-16 lg:pt-16 ${className}`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-6%] top-0 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
          <div className="max-w-xl space-y-5 pt-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Curated Collection
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Premium products that support a calmer, more consistent routine.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Discover trusted equipment and supplements selected to
                complement training without clutter.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
                Quality-first picks
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
                Practical essentials
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
                Reliable delivery
              </span>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-primary px-6 text-white hover:bg-secondary"
              >
                <Link href="#product-catalog">
                  Shop Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-slate-300 bg-white px-6 text-slate-800 hover:bg-slate-50"
              >
                <Link href="/favorites">View Favorites</Link>
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-[linear-gradient(160deg,#0f172a_0%,#12314f_52%,#163b2a_100%)] shadow-[0_30px_90px_rgba(15,23,42,0.18)]">
            <div className="h-1.5 w-full bg-[linear-gradient(90deg,#007BFF,#32CD32)]" />
            <div className="grid gap-8 p-8 sm:p-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Store dashboard
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                    Better choices, simpler checkout flow.
                  </h3>
                </div>
                <div className="rounded-full bg-primary/20 p-3 text-primary-foreground">
                  <ShoppingBag className="h-6 w-6" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
                  <div className="mb-5 flex items-center justify-between text-white/70">
                    <span className="text-sm">Shopping rhythm</span>
                    <span className="text-sm">Smart picks</span>
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
                    <p className="text-sm text-white/65">Expert-led guidance</p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      Clear instruction at every level
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="rounded-full bg-slate-100 px-4 py-2">
                  Quick filters
                </span>
                <span className="rounded-full bg-slate-100 px-4 py-2">
                  Trusted products
                </span>
                <span className="rounded-full bg-slate-100 px-4 py-2">
                  Smooth checkout
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

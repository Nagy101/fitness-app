import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="bg-[linear-gradient(135deg,#0f172a_0%,#12314f_55%,#1d4332_100%)] py-20 text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/50">
          Start Gently, Stay Consistent
        </p>
        <h2 className="mb-6 text-3xl font-bold text-white lg:text-4xl">
          Build a calmer routine that still delivers real results.
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-xl leading-8 text-white/80">
          Explore programs, products, and coaching built to reduce friction and
          make your next step feel clear.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/courses">
            <Button
              size="lg"
              className="rounded-full bg-white px-8 text-lg text-slate-950 hover:bg-secondary hover:text-white"
            >
              Explore Courses
            </Button>
          </Link>
          <Link href="/services">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-white/40 bg-white/5 px-8 text-lg text-white hover:bg-white hover:text-slate-950"
            >
              View Coaching
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

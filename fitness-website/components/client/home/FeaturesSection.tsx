import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  ShoppingCart,
  BookOpen,
  Heart,
  Dumbbell,
} from "lucide-react";
import type { Feature } from "@/types";

const features: Feature[] = [
  {
    icon: ShoppingCart,
    title: "Elevated Store",
    description:
      "A quieter shopping experience for premium supplements, equipment, and everyday wellness essentials.",
    href: "/products",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: BookOpen,
    title: "Guided Courses",
    description:
      "Thoughtfully structured training programs that help users move with more confidence and consistency.",
    href: "/courses",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Heart,
    title: "Wellness Journal",
    description:
      "Calm, practical reads on recovery, nutrition, mindset, and better long-term routines.",
    href: "/blog",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Dumbbell,
    title: "Personal Coaching",
    description:
      "Work with experienced trainers in a more focused, supportive coaching environment.",
    href: "/services",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Thoughtful Ecosystem
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-950 lg:text-4xl">
            One fitness platform, designed to feel clean, supportive, and easy
            to return to.
          </h2>
          <p className="text-lg leading-8 text-slate-600">
            Move between learning, shopping, reading, and coaching without the
            usual clutter. Everything is shaped to feel useful and steady.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group rounded-[1.75rem] border border-slate-200/80 bg-white/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
            >
              <CardHeader className="text-center p-6">
                <div className="mb-5 flex justify-center">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-full ${feature.bgColor}`}
                  >
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                </div>
                <CardTitle className="text-xl text-slate-950 transition-colors group-hover:text-primary">
                  {feature.title}
                </CardTitle>
                <CardDescription className="leading-7 text-slate-600">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-6 text-center">
                <Link href={feature.href}>
                  <Button
                    variant="outline"
                    className="inline-flex items-center justify-center gap-2 rounded-full border-slate-200 bg-white px-5 hover:bg-secondary hover:text-white hover:border-secondary transition-all duration-300"
                  >
                    Explore
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

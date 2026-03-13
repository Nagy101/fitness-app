"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  ArrowRight,
  BookOpen,
  Sparkles,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";
import type { BlogHeroSectionProps } from "@/types";
import { getProxyImageUrl } from "@/lib/images";

const BlogHeroSection = React.memo<BlogHeroSectionProps>(
  ({ featuredPost, onCategoryClick }) => {
    const [imageOk, setImageOk] = React.useState(true);
    const imageSrc = React.useMemo(
      () =>
        featuredPost?.featuredImage
          ? getProxyImageUrl(featuredPost.featuredImage)
          : null,
      [featuredPost?.featuredImage],
    );
    const featuredSummary = React.useMemo(() => {
      if (!featuredPost) return "";
      if (featuredPost.excerpt?.trim()) return featuredPost.excerpt.trim();
      return String(featuredPost.content || "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }, [featuredPost]);
    const featuredDate = React.useMemo(() => {
      if (!featuredPost?.createdAt) return "Recently";
      const parsed = new Date(featuredPost.createdAt);
      return isNaN(parsed.getTime()) ? "Recently" : parsed.toLocaleDateString();
    }, [featuredPost?.createdAt]);

    return (
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 pb-12 pt-12 sm:pb-14 lg:pb-16 lg:pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-[-10%] top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute right-[-6%] top-0 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
            <div className="max-w-xl space-y-5 pt-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary shadow-sm backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Balqis Journal
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                  Stories, ideas, and practical insight for better fitness.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                  Explore thoughtful training advice, recovery guidance, and
                  lifestyle notes designed to feel useful, calm, and worth
                  reading.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="rounded-full bg-white/85 px-4 py-2 shadow-sm">
                  Expert-backed articles
                </span>
                <span className="rounded-full bg-white/85 px-4 py-2 shadow-sm">
                  Clean reading experience
                </span>
                <span className="rounded-full bg-white/85 px-4 py-2 shadow-sm">
                  Video-supported posts
                </span>
              </div>
            </div>

            {featuredPost && (
              <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur">
                <div className="grid gap-0 md:grid-cols-[1.05fr_0.95fr]">
                  <div className="relative min-h-[300px] overflow-hidden bg-slate-100">
                    {imageSrc && imageOk ? (
                      <img
                        src={imageSrc}
                        alt={featuredPost.title}
                        width={1400}
                        height={900}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          setImageOk(false);
                          try {
                            (e.currentTarget as HTMLImageElement).src =
                              "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
                          } catch {}
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen className="h-14 w-14 text-primary" />
                      </div>
                    )}
                    <div className="absolute left-5 top-5">
                      <Badge className="border-0 bg-white/95 px-3 py-1 text-sm font-medium text-slate-900 shadow-sm">
                        {featuredPost.categoryName || "General"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between p-6 sm:p-7">
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-500">
                        <Calendar className="h-4 w-4 text-primary" />
                        {featuredDate}
                      </div>

                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                          Featured story
                        </p>
                        <h2 className="text-2xl font-bold leading-tight text-slate-950 sm:text-3xl break-words">
                          {featuredPost.title}
                        </h2>
                      </div>

                      <p className="line-clamp-4 text-sm leading-7 text-slate-600 sm:text-base">
                        {featuredSummary}
                      </p>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button
                        asChild
                        size="lg"
                        className="rounded-full bg-primary px-6 text-white shadow-sm hover:bg-primary/90"
                      >
                        <Link href={`/blog/${featuredPost.id}`}>
                          Read Feature
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      {featuredPost.videoUrl && (
                        <Button
                          asChild
                          variant="outline"
                          size="lg"
                          className="rounded-full border-slate-200 bg-white px-6 text-slate-800 hover:bg-slate-50"
                        >
                          <Link href={`/blog/${featuredPost.id}?watch=1#video`}>
                            <PlayCircle className="mr-2 h-4 w-4" />
                            Watch Story
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  },
);

BlogHeroSection.displayName = "BlogHeroSection";

export default BlogHeroSection;

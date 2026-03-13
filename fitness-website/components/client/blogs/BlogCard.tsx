"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, BookOpen, PlayCircle } from "lucide-react";
import Link from "next/link";
import type { BlogCardProps } from "@/types";
import { getProxyImageUrl } from "@/lib/images";

const BlogCard = React.memo<BlogCardProps>(
  ({ blog, categoryName, featured = false, onCategoryClick }) => {
    const displayCategoryName = categoryName || blog.categoryName || "General";
    const [imageOk, setImageOk] = React.useState(true);
    const imageSrc = React.useMemo(
      () => (blog.featuredImage ? getProxyImageUrl(blog.featuredImage) : null),
      [blog.featuredImage],
    );
    const safeDate = React.useMemo(() => {
      const val = blog.createdAt as any;
      if (!val) return "Recently";
      const tryFmt = (s: string) => {
        const d = new Date(s);
        return isNaN(d.getTime()) ? null : d.toLocaleDateString();
      };
      // direct
      let out = tryFmt(String(val));
      if (out) return out;
      // try space to T (e.g., '2024-11-02 15:10:00')
      out = tryFmt(String(val).replace(" ", "T"));
      if (out) return out;
      return "Recently";
    }, [blog.createdAt]);
    const summary = React.useMemo(() => {
      if (blog.excerpt?.trim()) return blog.excerpt.trim();
      const plainText = String(blog.content || "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      return plainText || "Read the full article for the complete story.";
    }, [blog.excerpt, blog.content]);
    const readTime = React.useMemo(() => {
      const plainText = `${blog.excerpt || ""} ${String(blog.content || "").replace(/<[^>]+>/g, " ")}`;
      const words = plainText.trim().split(/\s+/).filter(Boolean).length;
      return `${Math.max(1, Math.ceil(words / 180))} min read`;
    }, [blog.excerpt, blog.content]);

    return (
      <Card
        className={`group relative overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)] ${featured ? "mb-16" : "h-full"}`}
      >
        <CardHeader className="p-0">
          <Link href={`/blog/${blog.id}`}>
            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-100 via-white to-blue-50">
              {imageSrc && imageOk ? (
                <img
                  src={imageSrc}
                  alt={blog.title}
                  width={1200}
                  height={720}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    // prevent infinite error loops by switching to a 1x1 transparent data URI
                    setImageOk(false);
                    try {
                      (e.currentTarget as HTMLImageElement).src =
                        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
                    } catch {}
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <BookOpen className="h-12 w-12 text-primary" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                <Badge className="border-0 bg-white/92 px-3 py-1 text-sm font-medium text-slate-900 shadow-sm">
                  {displayCategoryName}
                </Badge>
                {blog.videoUrl && (
                  <Badge className="border-0 bg-slate-900/90 px-3 py-1 text-sm font-medium text-white shadow-sm">
                    <PlayCircle className="mr-1.5 h-3.5 w-3.5" />
                    Video
                  </Badge>
                )}
              </div>
            </div>
          </Link>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex items-center gap-3 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-primary" />
              {safeDate}
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>{readTime}</span>
          </div>

          <Link href={`/blog/${blog.id}`}>
            <CardTitle className="text-xl font-bold leading-tight text-slate-900 transition-colors group-hover:text-primary line-clamp-2 break-words">
              {blog.title}
            </CardTitle>
          </Link>

          <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600 break-words">
            {summary}
          </p>

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              {featured ? "Editor's pick" : "Journal entry"}
            </span>
            <Button
              asChild
              size="sm"
              className="h-10 rounded-full bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-blue-700 hover:shadow-md"
            >
              <Link href={`/blog/${blog.id}`}>
                Read Story
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  },
);

BlogCard.displayName = "BlogCard";

export default BlogCard;

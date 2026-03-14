"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { formatNumber } from "@/lib/utils/format";
import type { BlogFilterSectionProps } from "@/types";

const BlogFilterSection = React.memo<BlogFilterSectionProps>(
  ({
    selectedCategory,
    searchTerm,
    sortBy,
    categories,
    onCategoryChange,
    onSearchChange,
    onSortChange,
    loading = false,
  }) => {
    const hasActiveFilters =
      Boolean(searchTerm.trim()) ||
      Boolean(selectedCategory) ||
      sortBy !== "latest";

    return (
      <section className="py-8 sm:py-10">
        <div className="rounded-[2rem] border border-slate-200/80 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  Journal Filters
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Find the right story faster
                  </h2>
                  <p className="mt-1 text-sm text-slate-600 sm:text-base">
                    Search by keyword, refine by topic, and sort the feed the
                    way you want.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <span>
                  {formatNumber(
                    categories.reduce(
                      (sum, category) => sum + category.count,
                      0,
                    ),
                  )}{" "}
                  published articles
                </span>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onSearchChange("");
                      onCategoryChange("");
                      onSortChange("latest");
                    }}
                    className="h-9 rounded-full px-4 text-slate-600 hover:bg-slate-500 hover:text-slate-900"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reset filters
                  </Button>
                )}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search blog titles, excerpts, or article content"
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="h-12 rounded-2xl border-slate-200 bg-slate-50 pl-12 pr-12 text-sm shadow-none focus-visible:border-primary focus-visible:ring-primary/20"
                  disabled={loading}
                />
                {loading && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
                <SlidersHorizontal className="h-4 w-4 text-slate-400" />
                <Select value={sortBy} onValueChange={onSortChange}>
                  <SelectTrigger className="h-12 border-0 bg-transparent px-0 shadow-none focus:ring-0">
                    <SelectValue placeholder="Sort articles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Latest first</SelectItem>
                    <SelectItem value="oldest">Oldest first</SelectItem>
                    <SelectItem value="title-asc">Title: A to Z</SelectItem>
                    <SelectItem value="title-desc">Title: Z to A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Button
                variant={selectedCategory ? "outline" : "default"}
                onClick={() => onCategoryChange("")}
                className={
                  selectedCategory
                    ? "rounded-full border-slate-200 bg-white text-slate-700 hover:bg-slate-500"
                    : "rounded-full bg-primary text-white hover:bg-primary/90"
                }
              >
                All Articles
              </Button>
              {categories.map((category, index) => (
                <Button
                  key={`${category.id || category.name || "category"}-${index}`}
                  variant={
                    selectedCategory === category.name ? "default" : "outline"
                  }
                  onClick={() => onCategoryChange(category.name)}
                  className={
                    selectedCategory === category.name
                      ? "rounded-full bg-primary text-white shadow-sm hover:bg-primary/90"
                      : "rounded-full border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-500"
                  }
                >
                  <span
                    className="mr-2 h-2 w-2 rounded-full"
                    style={{ backgroundColor: category.color || "#2563eb" }}
                  />
                  {category.name}
                  <span className="ml-2 text-xs opacity-80">
                    {formatNumber(category.count)}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

BlogFilterSection.displayName = "BlogFilterSection";

export default BlogFilterSection;

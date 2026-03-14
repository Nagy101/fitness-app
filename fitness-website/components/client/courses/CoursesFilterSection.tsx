"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";

interface CoursesFilterSectionProps {
  searchTerm: string;
  sortBy: string;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

const CoursesFilterSection = React.memo<CoursesFilterSectionProps>(
  ({ searchTerm, sortBy, onSearchChange, onSortChange }) => {
    return (
      <section className="py-8 sm:py-10 bg-[#f6f8f9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white px-4 sm:px-6 lg:px-8 py-5 sm:py-6 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
            <div className="flex flex-col gap-5">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  Course Filters
                </div>
                <p className="text-sm text-slate-600 sm:text-base">
                  Search by keyword and sort by the learning priority that fits
                  you best.
                </p>
              </div>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search courses by title, topic, or instructor"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-12 h-12 rounded-2xl bg-[#f4f6f8] border-slate-200 focus:border-primary focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#f4f6f8] px-4">
                  <SlidersHorizontal className="h-4 w-4 text-slate-400" />
                  <Select value={sortBy} onValueChange={onSortChange}>
                    <SelectTrigger className="h-12 border-0 bg-transparent px-0 shadow-none focus:ring-0">
                      <SelectValue placeholder="Sort courses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="students">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  },
);

CoursesFilterSection.displayName = "CoursesFilterSection";

export default CoursesFilterSection;

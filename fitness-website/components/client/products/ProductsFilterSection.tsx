"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, Heart, Sparkles } from "lucide-react";
import type { ProductsFilterSectionProps } from "@/types";

const ProductsFilterSection = React.memo<ProductsFilterSectionProps>(
  ({
    searchTerm,
    selectedCategory,
    sortBy,
    showFavoritesOnly,
    categories,
    onSearchChange,
    onCategoryChange,
    onSortChange,
    onFavoritesToggle,
  }) => {
    return (
      <section className="py-8 sm:py-10 bg-[#f6f8f9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white px-4 sm:px-6 lg:px-8 py-5 sm:py-6 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary w-fit">
                  <Sparkles className="h-3.5 w-3.5" />
                  Product Filters
                </div>
                <p className="text-sm text-slate-600">
                  {categories.length} categories available
                </p>
              </div>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px_auto]">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search products by name"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-12 h-12 rounded-2xl bg-[#f4f6f8] border-slate-200 focus:border-primary focus:ring-primary/20 transition-all"
                  />
                </div>

                <Select
                  value={selectedCategory || "all"}
                  onValueChange={(v) => onCategoryChange(v === "all" ? "" : v)}
                >
                  <SelectTrigger className="h-12 rounded-2xl bg-[#f4f6f8] border-slate-200 hover:border-primary/30 transition-colors">
                    <SlidersHorizontal className="h-4 w-4 mr-2 text-slate-500" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.category_id}
                        value={String(category.category_id)}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={onSortChange}>
                  <SelectTrigger className="h-12 rounded-2xl bg-[#f4f6f8] border-slate-200 hover:border-primary/30 transition-colors">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-asc">Name A-Z</SelectItem>
                    <SelectItem value="price-asc">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-desc">
                      Price: High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  variant={showFavoritesOnly ? "default" : "outline"}
                  className={`h-12 rounded-2xl ${
                    showFavoritesOnly
                      ? "bg-primary text-white hover:bg-secondary"
                      : "bg-white border-slate-300 hover:bg-slate-50"
                  }`}
                  onClick={onFavoritesToggle}
                >
                  <Heart
                    className={`w-4 h-4 mr-2 ${showFavoritesOnly ? "fill-current" : ""}`}
                  />
                  Favorites
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  },
);

ProductsFilterSection.displayName = "ProductsFilterSection";

export default ProductsFilterSection;

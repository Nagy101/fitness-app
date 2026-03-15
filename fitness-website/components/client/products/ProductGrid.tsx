"use client";

import React from "react";
import { Search } from "lucide-react";
import ProductCard from "./ProductCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { ProductGridProps } from "@/types";

const ProductGrid = React.memo<ProductGridProps>(
  ({
    products,
    categories,
    favorites,
    loading,
    onAddToCart,
    onToggleFavorite,
    onClearFilters,
  }) => {
    const handleClearFilters = React.useCallback(() => {
      onClearFilters();
    }, [onClearFilters]);

    if (loading) {
      return (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8">
          {Array(12)
            .fill(0)
            .map((_, index) => (
              <Card
                key={`skeleton-${index}`}
                className="overflow-hidden rounded-[1.75rem] border border-slate-200/70 bg-white shadow-sm"
              >
                <CardHeader className="p-0">
                  <Skeleton className="w-full h-52 rounded-none" />
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-9 w-24" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="col-span-full rounded-[2rem] border border-dashed border-slate-300 bg-white/80 text-center py-16 sm:py-20">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-primary/10 text-primary flex items-center justify-center">
              <Search className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-bold text-slate-950 mb-3">
              No products found
            </h3>
            <p className="text-slate-600 mb-6">
              Try adjusting your search terms or filters to find what you're
              looking for.
            </p>
            <Button
              onClick={handleClearFilters}
              variant="outline"
              className="rounded-xl border-slate-300 bg-white hover:bg-secondary hover:text-white hover:border-secondary"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8">
        {products.map((product, index) => (
          <ProductCard
            key={product.product_id}
            product={product}
            categories={categories}
            isFavorite={favorites.has(Number(product.product_id))}
            onAddToCart={onAddToCart}
            onToggleFavorite={(id) => onToggleFavorite(Number(id))}
            priority={index < 6} // First 6 products get priority loading
          />
        ))}
      </div>
    );
  },
);

ProductGrid.displayName = "ProductGrid";

export default ProductGrid;

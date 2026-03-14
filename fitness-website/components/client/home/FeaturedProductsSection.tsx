"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { ProtectedAction } from "@/components/auth/Protected-Route";
import { getFullImageUrl } from "@/lib/images";
import { formatNumber } from "@/lib/utils/format";
import type { FeaturedProductsSectionProps } from "@/types/home";

const FeaturedProductsSection = React.memo<FeaturedProductsSectionProps>(
  ({ products, isLoading, onAddToCart }) => {
    // Resolve best image URL for product with safe fallbacks (use direct URL)
    const resolveProductImage = (product: any): string => {
      const raw =
        product?.image || product?.image_url || product?.main_image_url || "";
      return raw ? getFullImageUrl(raw) : "/placeholder.svg";
    };

    return (
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                Featured Products
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 lg:text-4xl">
                Practical essentials that support a steadier routine.
              </h2>
            </div>
            <p className="max-w-xl text-lg leading-8 text-slate-600">
              Premium products selected to complement training without
              overwhelming the experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              // Loading skeletons using shared component
              Array(3)
                .fill(0)
                .map((_, index) => (
                  <Card
                    key={`skeleton-${index}`}
                    className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-sm"
                  >
                    <CardHeader className="p-0">
                      <Skeleton className="h-64 w-full rounded-none" />
                    </CardHeader>
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-10 w-32" />
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : products.length > 0 ? (
              products.map((product, index) => (
                <Card
                  key={`${product.id}-${index}`}
                  className="group overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)]"
                >
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden">
                      <Image
                        src={resolveProductImage(product)}
                        alt={product.name}
                        width={300}
                        height={300}
                        unoptimized
                        className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement;
                          img.onerror = null;
                          img.src = "/placeholder.svg";
                        }}
                      />
                      <div className="absolute right-4 top-4">
                        <Badge className="border-0 bg-white/95 text-slate-900 shadow-sm hover:bg-white">
                          Featured
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle className="mb-2 text-xl text-slate-950 group-hover:text-primary transition-colors">
                      {product.name}
                    </CardTitle>
                    {product.description ? (
                      <CardDescription className="mb-4 line-clamp-2 leading-7 text-slate-600">
                        {product.description}
                      </CardDescription>
                    ) : null}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-2xl font-bold text-primary">
                        {formatNumber(product.price || 0)} EGP
                      </span>
                      <ProtectedAction onAction={() => onAddToCart(product)}>
                        <Button className="rounded-full bg-primary text-white hover:bg-secondary">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </ProtectedAction>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">
                  No featured products available at the moment.
                </p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Link href="/products">
              <Button
                variant="outline"
                size="lg"
                className="inline-flex items-center gap-2 rounded-full border-slate-200 bg-white hover:bg-slate-50"
              >
                View All Products
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  },
);

FeaturedProductsSection.displayName = "FeaturedProductsSection";

export default FeaturedProductsSection;

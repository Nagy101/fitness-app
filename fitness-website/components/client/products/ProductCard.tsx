"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart } from "lucide-react";
import { ProtectedAction } from "@/components/auth/Protected-Route";
import { getProxyImageUrl } from "@/lib/images";
import type { ProductCardProps } from "@/types";

const isArabicText = (text: string) =>
  /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);

const ProductCard = React.memo<ProductCardProps>(
  ({
    product,
    categories,
    isFavorite,
    onAddToCart,
    onToggleFavorite,
    priority = false,
  }) => {
    const descriptionIsArabic = React.useMemo(
      () => isArabicText(product.description || ""),
      [product.description],
    );
    const priceNumber = React.useMemo(() => {
      const n = Number(product.price);
      return Number.isFinite(n) ? n : null;
    }, [product.price]);
    const inStock = Number(product.stock_quantity) > 0;
    const categoryName = React.useMemo(() => {
      const matched = categories.find(
        (category) =>
          Number(category.category_id) === Number(product.category_id),
      );
      return matched?.name || "Product";
    }, [categories, product.category_id]);

    const handleAddToCart = React.useCallback(() => {
      if (!inStock) return;
      onAddToCart(product);
    }, [product, onAddToCart, inStock]);

    const handleToggleFavorite = React.useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleFavorite(Number(product.product_id));
      },
      [product.product_id, onToggleFavorite],
    );

    return (
      <Card className="group overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
        <CardHeader className="p-0 relative">
          <Link href={`/products/${product.product_id}`}>
            <div className="relative aspect-[4/3] overflow-hidden cursor-pointer">
              <Image
                src={getProxyImageUrl(product.image_url) || "/placeholder.svg"}
                alt={product.name}
                fill
                priority={priority}
                unoptimized
                style={{ objectFit: "cover" }}
                className="group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0 opacity-80" />
            </div>
          </Link>

          <Badge className="absolute left-3 top-3 z-10 bg-white/90 text-slate-700 border border-slate-200/70 hover:bg-white">
            {categoryName}
          </Badge>

          <Button
            size="sm"
            variant="ghost"
            className="absolute top-3 right-3 z-10 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-sm opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
            onClick={handleToggleFavorite}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600 hover:text-red-500"
              }`}
            />
          </Button>

          {!inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 backdrop-blur-[1px]">
              <Badge
                variant="destructive"
                className="text-white font-semibold px-4 py-2 text-sm uppercase tracking-wider"
              >
                Out of Stock
              </Badge>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-5 flex flex-col flex-1">
          <div className="mb-4 space-y-2">
            <Link href={`/products/${product.product_id}`}>
              <CardTitle className="text-xl font-bold text-slate-950 break-words whitespace-normal group-hover:text-primary transition-colors cursor-pointer leading-snug">
                {product.name}
              </CardTitle>
            </Link>
            <CardDescription
              dir={descriptionIsArabic ? "rtl" : "ltr"}
              className={`text-sm text-slate-600 line-clamp-2 leading-relaxed ${descriptionIsArabic ? "text-right" : "text-left"}`}
            >
              {product.description}
            </CardDescription>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xl font-semibold text-primary">
                {priceNumber !== null
                  ? `${priceNumber.toFixed(2)} EGP`
                  : "Price unavailable"}
              </span>
              <Badge
                variant={
                  product.stock_quantity > 0 ? "secondary" : "destructive"
                }
                className={`px-2.5 py-1 text-xs rounded-full ${
                  product.stock_quantity > 0
                    ? "bg-emerald-100 text-emerald-800"
                    : ""
                }`}
              >
                {product.stock_quantity > 0 ? "In stock" : "Out of stock"}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mt-auto pt-4">
            <Link
              href={`/products/${product.product_id}`}
              className="col-span-2"
            >
              <Button
                className="w-full h-11 text-sm font-semibold rounded-xl border border-slate-300 bg-white text-slate-800 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all duration-300"
                size="lg"
              >
                View Details
              </Button>
            </Link>

            {inStock ? (
              <ProtectedAction onAction={handleAddToCart}>
                <Button
                  className="col-span-2 w-full h-11 text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-primary hover:bg-secondary text-white"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
              </ProtectedAction>
            ) : (
              <Button
                disabled
                className="col-span-2 w-full h-11 text-sm font-semibold rounded-xl shadow-sm transition-all duration-300 bg-gray-200 text-gray-500 cursor-not-allowed"
                size="lg"
              >
                Out of Stock
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  },
);

ProductCard.displayName = "ProductCard";

export default ProductCard;

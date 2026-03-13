"use client";

import React, { useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import type { BlogPageProps } from "@/types";
import { useBlogsData } from "@/hooks/client/use-blogs-data";

// Lazy load heavy components for better performance
const BlogHeroSection = dynamic(
  () => import("@/components/client/blogs/BlogHeroSection"),
  {
    loading: () => (
      <div className="h-96 bg-slate-200 animate-pulse rounded-lg" />
    ),
  },
);

const BlogFilterSection = dynamic(
  () => import("@/components/client/blogs/BlogFilterSection"),
  {
    loading: () => (
      <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />
    ),
  },
);

const BlogGrid = dynamic(() => import("@/components/client/blogs/BlogGrid"), {
  loading: () => (
    <div className="grid gap-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-lg" />
      ))}
    </div>
  ),
});

// Unified Pagination Component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  itemLabel?: string;
}

const UnifiedPagination = React.memo<PaginationProps>(
  ({
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [6, 12, 24, 48],
    itemLabel = "items",
  }) => {
    const pageNumbers = useMemo(() => {
      const pages: (number | string)[] = [];
      const maxVisiblePages = 5;
      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else {
        if (currentPage <= 3) {
          pages.push(1, 2, 3, 4, "...", totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(
            1,
            "...",
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages,
          );
        } else {
          pages.push(
            1,
            "...",
            currentPage - 1,
            currentPage,
            currentPage + 1,
            "...",
            totalPages,
          );
        }
      }
      return pages;
    }, [currentPage, totalPages]);

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);
    const handlePageSizeChange = useCallback(
      (value: string) => onPageSizeChange(Number(value)),
      [onPageSizeChange],
    );

    if (totalPages <= 1 && totalItems <= pageSize) return null;

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-600 font-medium">
          Showing{" "}
          <span className="text-gray-900 font-semibold">{startItem}</span> to{" "}
          <span className="text-gray-900 font-semibold">{endItem}</span> of{" "}
          <span className="text-gray-900 font-semibold">{totalItems}</span>{" "}
          {itemLabel}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="border-gray-300 bg-white hover:bg-primary/5 hover:border-primary/30 disabled:opacity-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Prev</span>
          </Button>
          <div className="flex items-center gap-1">
            {pageNumbers.map((page, index) => (
              <React.Fragment key={page === "..." ? `ellipsis-${index}` : page}>
                {page === "..." ? (
                  <div className="px-2 py-2">
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </div>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(page as number)}
                    className={`min-w-[36px] h-9 transition-all ${currentPage === page ? "bg-primary hover:bg-primary/90 text-white shadow-sm" : "border-gray-300 bg-white hover:bg-primary/5 hover:border-primary/30"}`}
                  >
                    {page}
                  </Button>
                )}
              </React.Fragment>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="border-gray-300 bg-white hover:bg-primary/5 hover:border-primary/30 disabled:opacity-50 transition-colors"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="w-24 h-9 border-gray-300 hover:border-blue-300 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  },
);

UnifiedPagination.displayName = "UnifiedPagination";

const BlogClientPage = React.memo<BlogPageProps>(
  ({ initialBlogs = [], initialCategories = [] }) => {
    const {
      blogs,
      categories,
      loading,
      error,
      selectedCategory,
      searchTerm,
      sortBy,
      filteredBlogs,
      paginatedBlogs,
      featuredPost,
      categoryStats,
      currentPage,
      pageSize,
      totalPages,
      actions: {
        setSearchTerm,
        setSortBy,
        handleCategorySelect,
        setCurrentPage,
        setPageSize,
        refresh,
      },
    } = useBlogsData({ blogs: initialBlogs, categories: initialCategories });

    // Memoized handlers
    const handleRefresh = useCallback(async () => {
      try {
        await refresh();
      } catch (error) {
        // Silent error handling
      }
    }, [refresh]);

    // Loading State
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex items-center space-x-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-gray-700 text-lg font-medium">
              Loading blog content...
            </span>
          </div>
        </div>
      );
    }

    // Error State
    if (error && (blogs?.length || 0) > 0 && (categories?.length || 0) > 0) {
      return (
        <div className="flex items-center justify-center p-4 min-h-[50vh]">
          <Card className="w-full max-w-md shadow-2xl">
            <CardContent className="p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Unable to Load Blog Content
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="space-y-3">
                <Button
                  onClick={handleRefresh}
                  className="px-6 bg-primary hover:bg-primary/90"
                >
                  Retry Loading
                </Button>
                <p className="text-sm text-gray-500">
                  Please check your internet connection or try again later
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <>
        <BlogHeroSection
          featuredPost={featuredPost}
          onCategoryClick={handleCategorySelect}
        />

        <section className="bg-[linear-gradient(180deg,#ffffff_0%,#fbfaf7_100%)] py-12 sm:py-14 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BlogFilterSection
              selectedCategory={selectedCategory}
              searchTerm={searchTerm}
              sortBy={sortBy}
              categories={categoryStats}
              onCategoryChange={handleCategorySelect}
              onSearchChange={setSearchTerm}
              onSortChange={setSortBy}
              loading={loading}
            />

            <div className="mb-8 mt-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Blog archive
                </p>
                <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  {selectedCategory
                    ? `${selectedCategory} stories`
                    : "Latest articles and practical reads"}
                </h2>
                <p className="text-base text-slate-600">
                  {filteredBlogs.length} article
                  {filteredBlogs.length !== 1 ? "s" : ""} available
                </p>
              </div>

              {(searchTerm || selectedCategory) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    handleCategorySelect("");
                    setSortBy("latest");
                  }}
                  className="rounded-full border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                >
                  Clear current view
                </Button>
              )}
            </div>

            {filteredBlogs.length === 0 && !loading ? (
              <div className="rounded-[2rem] border border-slate-200 bg-white py-20 text-center shadow-sm">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  {searchTerm || selectedCategory
                    ? "No matching articles found"
                    : "No articles available"}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
                  {searchTerm || selectedCategory
                    ? "Try adjusting your search or filter criteria."
                    : "Check back later for new articles."}
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    handleCategorySelect("");
                    setSortBy("latest");
                    handleRefresh();
                  }}
                  className="border-slate-200 bg-white text-primary hover:bg-primary/5 hover:text-primary"
                >
                  {searchTerm || selectedCategory ? "Clear Filters" : "Refresh"}
                </Button>
              </div>
            ) : (
              <>
                <BlogGrid
                  blogs={paginatedBlogs}
                  loading={loading}
                  onCategoryClick={handleCategorySelect}
                />

                {filteredBlogs.length > 0 && (
                  <UnifiedPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalItems={filteredBlogs.length}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={setPageSize}
                    pageSizeOptions={[6, 12, 18, 24]}
                    itemLabel="articles"
                  />
                )}
              </>
            )}
          </div>
        </section>
      </>
    );
  },
);

BlogClientPage.displayName = "BlogClientPage";

export default BlogClientPage;

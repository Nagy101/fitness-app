"use client";

import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  ArrowLeft,
  BookOpen,
  AlertCircle,
  Play,
  Loader2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useBlogDetails } from "@/hooks/client/use-blog-details";
import BlogCard from "@/components/client/blogs/BlogCard";

interface BlogPostClientPageProps {
  blogId: string;
  shouldAutoWatch: boolean;
}

const BlogPostClientPage = React.memo<BlogPostClientPageProps>(
  ({ blogId, shouldAutoWatch }) => {
    const router = useRouter();
    const [loadVideo, setLoadVideo] = React.useState(false);

    const {
      blog,
      relatedBlogs,
      loading,
      error,
      showVideoModal,
      getCategoryName,
      getImageUrl,
      formatDate,
      renderVideo,
      setShowVideoModal,
      setWatchRequested,
    } = useBlogDetails(blogId, shouldAutoWatch);

    // Memoized handlers for better performance
    const onWatchClick = useCallback(() => {
      setWatchRequested(true);
      setShowVideoModal(true);
      setLoadVideo(true); // defer iframe load until user opens modal
    }, [setWatchRequested, setShowVideoModal]);

    const handleCloseModal = useCallback(() => {
      setShowVideoModal(false);
    }, [setShowVideoModal]);

    // Memoized calculations
    const blogStats = useMemo(
      () => ({
        hasVideo: !!blog?.videoUrl,
        hasContent: !!blog?.content,
        hasRelated: relatedBlogs.length > 0,
        categoryName: blog ? getCategoryName(blog.categoryId) : "",
        formattedDate: blog ? formatDate(blog.createdAt) : "",
      }),
      [blog, relatedBlogs, getCategoryName, formatDate],
    );

    const videoEmbedSrc = useMemo(() => {
      if (!blog?.videoUrl) return "";
      return renderVideo(blog.videoUrl, true);
    }, [blog?.videoUrl, renderVideo]);

    const videoEmbedSrcNoAutoplay = useMemo(() => {
      if (!blog?.videoUrl) return "";
      return renderVideo(blog.videoUrl, false);
    }, [blog?.videoUrl, renderVideo]);

    const getYouTubeId = (url: string) => {
      if (!url) return null;
      const match = url.match(
        /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/,
      );
      return match ? match[1] : null;
    };

    const videoThumbnail = useMemo(() => {
      const vid = getYouTubeId(blog?.videoUrl || "");
      return vid ? `https://img.youtube.com/vi/${vid}/hqdefault.jpg` : null;
    }, [blog?.videoUrl]);

    const summaryText = useMemo(() => {
      if (!blog) return "";
      if (blog.excerpt?.trim()) return blog.excerpt.trim();
      return String(blog.content || "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }, [blog]);

    const readTime = useMemo(() => {
      if (!blog) return "1 min read";
      const plainText = `${blog.excerpt || ""} ${String(blog.content || "").replace(/<[^>]+>/g, " ")}`;
      const words = plainText.trim().split(/\s+/).filter(Boolean).length;
      return `${Math.max(1, Math.ceil(words / 180))} min read`;
    }, [blog]);

    if (loading) {
      return (
        <div className="min-h-screen bg-slate-50 pt-20">
          <div className="flex items-center justify-center min-h-screen">
            <div className="flex items-center space-x-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-gray-700 text-lg font-medium">
                Loading blog post...
              </span>
            </div>
          </div>
        </div>
      );
    }

    if (error || !blog) {
      return (
        <div className="min-h-screen bg-slate-50 pt-20 flex items-center justify-center">
          <Card className="shadow-2xl max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Blog Post Not Found
              </h2>
              <p className="text-gray-600 mb-4">
                {error || "The blog post you're looking for doesn't exist."}
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  className="border-slate-200 bg-white text-primary hover:bg-slate-50"
                >
                  Go Back
                </Button>
                <Link href="/blog">
                  <Button className="bg-primary hover:bg-[#0056b3] text-white">
                    Browse All Blogs
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/blog")}
            className="rounded-full px-4 text-primary hover:bg-primary/5 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to articles
          </Button>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
          <Card className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
            <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="relative min-h-[300px] overflow-hidden bg-gradient-to-br from-slate-100 via-white to-primary/5 lg:min-h-[520px]">
                {blog.featuredImage ? (
                  <img
                    src={getImageUrl(blog.featuredImage) || ""}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      try {
                        (e.currentTarget as HTMLImageElement).src =
                          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
                      } catch {}
                    }}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <BookOpen className="h-20 w-20 text-primary" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                <div className="absolute left-6 top-6">
                  <Badge className="border-0 bg-white/95 px-4 py-2 text-sm font-medium text-slate-900 shadow-sm">
                    {blogStats.categoryName}
                  </Badge>
                </div>
              </div>

              <CardContent className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5">
                      <Calendar className="h-4 w-4 text-primary" />
                      {blogStats.formattedDate}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5">
                      <BookOpen className="h-4 w-4 text-primary" />
                      {readTime}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                      Balqis Journal
                    </p>
                    <h1 className="text-4xl font-bold leading-tight text-slate-950 lg:text-5xl break-words">
                      {blog.title}
                    </h1>
                    {summaryText && (
                      <p className="text-base leading-8 text-slate-600 sm:text-lg">
                        {summaryText}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  {blogStats.hasVideo && (
                    <>
                      <Button
                        className="rounded-full bg-primary px-6 text-white shadow-sm hover:bg-[#0056b3]"
                        onClick={onWatchClick}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Watch Video
                      </Button>
                      {blog.videoUrl && (
                        <a
                          href={blog.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Open video link
                        </a>
                      )}
                    </>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => router.push("/blog")}
                    className="rounded-full border-slate-200 bg-white px-6 text-slate-800 hover:bg-slate-50"
                  >
                    Browse more articles
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>

          {blogStats.hasVideo && videoEmbedSrcNoAutoplay && (
            <Card className="mt-6 overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-sm">
              <CardContent className="p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                    <Play className="h-3.5 w-3.5" />
                    Watch Video
                  </div>
                  {blog.videoUrl && (
                    <a
                      href={blog.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open original
                    </a>
                  )}
                </div>
                <div className="aspect-video w-full overflow-hidden rounded-xl bg-primary/5">
                  <iframe
                    className="h-full w-full"
                    src={videoEmbedSrcNoAutoplay}
                    title={`${blog.title} – video`}
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
            <Card className="rounded-[1.75rem] border border-slate-200/80 bg-white shadow-sm">
              <CardContent className="p-6 sm:p-8 lg:p-10">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  Article body
                </div>
                {blog.content ? (
                  <div
                    className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-p:text-slate-700 prose-a:text-primary prose-strong:text-slate-900 prose-img:rounded-2xl prose-img:shadow-sm overflow-x-hidden break-words"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
                ) : (
                  <p className="text-base leading-8 text-slate-700 break-words">
                    {summaryText}
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <Card className="rounded-[1.75rem] border border-slate-200/80 bg-white shadow-sm">
                <CardContent className="p-6 space-y-5">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Article snapshot
                    </p>
                    <h2 className="text-xl font-bold text-slate-950">
                      Quick overview
                    </h2>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-500">Category</span>
                      <span className="font-medium text-slate-900 text-right">
                        {blogStats.categoryName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-500">Published</span>
                      <span className="font-medium text-slate-900 text-right">
                        {blogStats.formattedDate}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-500">Reading time</span>
                      <span className="font-medium text-slate-900 text-right">
                        {readTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-500">Video</span>
                      <span className="font-medium text-slate-900 text-right">
                        {blogStats.hasVideo ? "Available" : "Not included"}
                      </span>
                    </div>
                  </div>

                  {blogStats.hasVideo && (
                    <div className="space-y-2">
                      <Button
                        className="w-full rounded-full bg-primary text-white hover:bg-[#0056b3]"
                        onClick={onWatchClick}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Watch in player
                      </Button>
                      {blog?.videoUrl && (
                        <a
                          href={blog.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 text-sm text-slate-500 hover:text-primary transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Open original link
                        </a>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Video Modal */}
        {showVideoModal && blog?.videoUrl && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
              <div className="aspect-video w-full bg-primary/5">
                {loadVideo && videoEmbedSrc ? (
                  <iframe
                    className="w-full h-full rounded-lg"
                    src={videoEmbedSrc}
                    title="Blog video"
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <button
                    type="button"
                    className="relative w-full h-full"
                    onClick={() => setLoadVideo(true)}
                  >
                    {videoThumbnail ? (
                      <img
                        src={videoThumbnail}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-6 bg-primary/10">
                        <Play className="w-10 h-10 text-primary" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex items-center gap-2 text-white bg-black/60 px-4 py-2 rounded-full">
                        <Play className="w-5 h-5" />
                        <span className="font-semibold">Load & Play</span>
                      </div>
                    </div>
                  </button>
                )}
              </div>
              <div className="p-4 flex justify-end">
                <Button
                  variant="outline"
                  onClick={handleCloseModal}
                  className="border-slate-200 bg-white text-primary hover:bg-slate-50"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {relatedBlogs.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Keep reading
                </p>
                <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                  Related articles
                </h3>
              </div>
              <p className="text-sm text-slate-500">
                More entries from the journal that pair well with this topic.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {relatedBlogs.map((p) => (
                <BlogCard
                  key={p.id}
                  blog={p}
                  categoryName={getCategoryName(p.categoryId)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    );
  },
);

BlogPostClientPage.displayName = "BlogPostClientPage";

export default BlogPostClientPage;

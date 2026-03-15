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
import { ProtectedAction } from "@/components/auth/Protected-Route";
import { getProxyImageUrl } from "@/lib/images";
import { formatNumber } from "@/lib/utils/format";
import type { FeaturedCoursesSectionProps } from "@/types/home";

import { Play, ArrowRight, Star, Users } from "lucide-react";

const FeaturedCoursesSection = React.memo<FeaturedCoursesSectionProps>(
  ({ courses, isLoading, onEnrollment }) => {
    // Resolve best image URL for course with safe fallbacks (use proxy URL)
    const resolveCourseImage = (course: any): string => {
      const raw =
        course?.image || course?.image_url || course?.main_image_url || "";
      return raw ? getProxyImageUrl(raw) : "/placeholder.svg";
    };

    return (
      <section className="bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                Featured Courses
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 lg:text-4xl">
                Structured programs for people who want clarity, not chaos.
              </h2>
            </div>
            <p className="max-w-xl text-lg leading-8 text-slate-600">
              Each course is designed to feel easier to follow, easier to trust,
              and easier to finish.
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
                      <Skeleton className="h-56 w-full rounded-none" />
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
            ) : courses.length > 0 ? (
              courses.map((course, index) => (
                <Card
                  key={`${course.id}-${index}`}
                  className="group overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)]"
                >
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden">
                      <Image
                        unoptimized
                        src={resolveCourseImage(course)}
                        alt={course.title}
                        width={300}
                        height={200}
                        className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement;
                          // Prevent infinite loop if placeholder also fails
                          img.onerror = null;
                          img.src = "/placeholder.svg";
                        }}
                      />
                      <div className="absolute left-4 top-4">
                        <Badge className="border-0 bg-white/95 text-slate-900 shadow-sm hover:bg-white">
                          {course.category}
                        </Badge>
                      </div>
                      <div className="absolute right-4 top-4">
                        <Badge className="border-0 bg-slate-950/80 text-white shadow-sm hover:bg-slate-950/80">
                          {course.rating && course.rating > 0
                            ? `${course.rating} ★`
                            : "New"}
                        </Badge>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent p-4">
                        <div className="flex flex-wrap gap-2 text-sm text-white">
                          <span className="rounded-full bg-white/15 px-3 py-1.5 backdrop-blur">
                            {course.category}
                          </span>
                          <span className="rounded-full bg-white/15 px-3 py-1.5 backdrop-blur">
                            Expert-led
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle className="mb-2 text-xl text-slate-950 group-hover:text-primary transition-colors">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="mb-4 leading-7 text-slate-600">
                      by {course.instructor} • designed for steady, more
                      confident progress
                    </CardDescription>
                    <div className="mb-5 flex flex-wrap gap-3 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5">
                        <Users className="h-4 w-4 text-primary" />
                        {formatNumber(course.students || 0)} students
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        {course.rating && course.rating > 0
                          ? course.rating
                          : "New"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-2xl font-bold text-primary">
                        {formatNumber(course.price)} EGP
                      </span>
                      <ProtectedAction onAction={() => onEnrollment(course)}>
                        <Button className="rounded-full bg-primary text-white hover:bg-[#0056b3] transition-colors duration-200">
                          <Play className="h-4 w-4 mr-2" />
                          Enroll Now
                        </Button>
                      </ProtectedAction>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">
                  No featured courses available at the moment.
                </p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Link href="/courses">
              <Button
                variant="outline"
                size="lg"
                className="inline-flex items-center gap-2 rounded-full border-slate-200 bg-white hover:bg-secondary hover:text-white hover:border-secondary transition-colors duration-200"
              >
                View All Courses
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  },
);

FeaturedCoursesSection.displayName = "FeaturedCoursesSection";

export default FeaturedCoursesSection;

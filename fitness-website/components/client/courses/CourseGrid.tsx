"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
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
import { getProxyImageUrl } from "@/lib/images";
import { formatNumber } from "@/lib/utils/format";
import { Clock, Users, Star, BookOpen, ArrowRight } from "lucide-react";

interface Course {
  course_id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  image_url?: string;
  main_image_url?: string;
  thumbnail?: string;
  instructor?: string;
  duration?: string;
  level?: string;
  students_count?: number;
  rating?: number;
  created_at: string;
}

interface CourseGridProps {
  courses: Course[];
  loading: boolean;
}

const CourseGrid = React.memo<CourseGridProps>(({ courses, loading }) => {
  // Resolve best image URL for course with safe fallbacks
  const resolveCourseImage = (course: Course): string => {
    // Try multiple possible image field names from the API
    const raw =
      course?.image ||
      course?.image_url ||
      course?.main_image_url ||
      course?.thumbnail ||
      "";

    return getProxyImageUrl(raw);
  };

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <Card
              key={`skeleton-${index}`}
              className="border-0 shadow-md bg-white"
            >
              <CardHeader className="p-0">
                <Skeleton className="w-full h-48 rounded-t-lg" />
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
          ))}
      </div>
    );
  }

  const displayCourses = courses;

  if (displayCourses.length === 0 && !loading) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No courses available
          </h3>
          <p className="text-muted-foreground mb-6">
            We're currently updating our course catalog. Please check back later
            for exciting new fitness courses!
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {displayCourses.map((course, index) => (
        <Card
          key={String(course?.course_id ?? `course-${index}`)}
          className="group relative overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white rounded-lg border-0 flex flex-col h-full"
        >
          <CardHeader className="p-0 relative">
            <Link href={`/courses/${course.course_id}`}>
              <div className="relative aspect-[4/3] overflow-hidden cursor-pointer">
                <Image
                  src={resolveCourseImage(course) || "/placeholder.svg"}
                  alt={
                    course?.title && String(course.title).trim()
                      ? String(course.title)
                      : "Course image"
                  }
                  fill
                  unoptimized
                  style={{ objectFit: "cover" }}
                  className="group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  priority={index < 6}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                <div className="absolute bottom-3 left-3">
                  <Badge
                    variant="secondary"
                    className="bg-white/90 text-foreground"
                  >
                    {course.level || "All Levels"}
                  </Badge>
                </div>
              </div>
            </Link>
          </CardHeader>

          <CardHeader className="p-4 pb-1.5">
            <CardTitle
              className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 break-words leading-snug"
              title={course.title}
            >
              {course.title}
            </CardTitle>
            <CardDescription
              className="text-sm text-muted-foreground line-clamp-2 leading-relaxed break-words"
              title={course.description}
            >
              {course.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-4 pb-4 pt-0 flex flex-col flex-1">
            {course.instructor && (
              <p className="text-sm text-muted-foreground mb-2.5">
                by {course.instructor}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              {course.duration && (
                <div className="flex items-center gap-1.5 min-w-0">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span className="truncate">{course.duration}</span>
                </div>
              )}

              {course.students_count && (
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-primary" />
                  <span>{formatNumber(course.students_count)}</span>
                </div>
              )}

              {course.rating && course.rating > 0 && (
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{course.rating}</span>
                </div>
              )}
            </div>

            <div className="pt-3 mt-auto border-t border-border flex items-center justify-between gap-3">
              <div className="shrink-0">
                <div className="text-xs text-muted-foreground">Price</div>
                <div className="text-xl font-bold text-primary">
                  {formatNumber(course.price)} EGP
                </div>
              </div>

              <Button
                asChild
                size="sm"
                className="h-10 px-4 text-sm font-semibold rounded-md shadow-sm hover:shadow-md transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Link href={`/courses/${course.course_id}`}>
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});

CourseGrid.displayName = "CourseGrid";

export default CourseGrid;

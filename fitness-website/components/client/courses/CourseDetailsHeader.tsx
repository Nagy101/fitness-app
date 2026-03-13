import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Home, Users, Clock, BookOpen } from "lucide-react";
import { getProxyImageUrl } from "@/lib/images";
import type { Course } from "@/types/course";

interface CourseDetailsHeaderProps {
  course: Course;
}

export default function CourseDetailsHeader({
  course,
}: CourseDetailsHeaderProps) {
  if (!course) return null;

  const imageUrl = getProxyImageUrl(course.image_url || course.featuredImage);
  const hasImage = imageUrl && imageUrl !== "/placeholder.svg";
  const summary = course.excerpt || course.description;
  const hasQuickStats = Boolean(
    (course.modules && course.modules.length > 0) ||
    course.duration ||
    course.instructor,
  );

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500 overflow-x-auto whitespace-nowrap pb-2">
        <Link
          href="/"
          className="hover:text-primary transition-colors flex items-center"
        >
          <Home className="w-3.5 h-3.5 mr-1" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4 mx-2 text-gray-300" />
        <Link href="/courses" className="hover:text-primary transition-colors">
          Courses
        </Link>
        <ChevronRight className="w-4 h-4 mx-2 text-gray-300" />
        <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-xs">
          {course.title}
        </span>
      </nav>

      {/* Hero: Image + Course Info */}
      <div
        className={`overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm ${hasImage ? "grid md:grid-cols-5" : "block"}`}
      >
        {/* Course Image */}
        {hasImage && (
          <div
            className={`md:col-span-2 relative aspect-[4/3] md:aspect-auto overflow-hidden bg-slate-100 ${summary || hasQuickStats ? "md:min-h-[280px]" : "md:min-h-[220px]"}`}
          >
            <Image
              src={imageUrl}
              alt={course.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
              priority
            />
          </div>
        )}

        {/* Course Info */}
        <div
          className={`flex flex-col justify-center gap-3 p-5 sm:p-6 lg:p-7 ${hasImage ? "md:col-span-3 md:border-l border-slate-100" : ""}`}
        >
          <div className="flex flex-wrap gap-2 items-center">
            {course.categoryName && (
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                {course.categoryName}
              </Badge>
            )}
            {(course.level || course.difficulty) && (
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                {course.level || course.difficulty}
              </Badge>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-[2.35rem] font-bold text-gray-900 leading-tight break-words">
            {course.title}
          </h1>

          {summary && (
            <p className="text-base text-gray-600 leading-relaxed line-clamp-3">
              {summary}
            </p>
          )}

          {/* Quick Stats Row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-sm text-gray-500">
            {course.modules && course.modules.length > 0 && (
              <span className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5">
                <BookOpen className="w-4 h-4" />
                {course.modules.length} modules
              </span>
            )}
            {course.duration && (
              <span className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5">
                <Clock className="w-4 h-4" />
                {course.duration}
              </span>
            )}
            {course.instructor && (
              <span className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5">
                <Users className="w-4 h-4" />
                {course.instructor}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

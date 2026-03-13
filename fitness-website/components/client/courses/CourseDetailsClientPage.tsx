"use client";

import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, AlertCircle, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useCourseDetails } from "@/hooks/client/use-course-details";
import { useCourseRequests } from "@/hooks/client/use-course-requests";
import CourseDetailsHeader from "@/components/client/courses/CourseDetailsHeader";
import CourseDetailsInfo from "@/components/client/courses/CourseDetailsInfo";
import CourseModulesSection from "@/components/client/courses/CourseModulesSection";
import CourseEnrollmentSection from "@/components/client/courses/CourseEnrollmentSection";
import { Course as CourseType } from "@/types/course";

// Static imports here are fine: this entire page is already lazily loaded by the server shell
// and these components are required for a complete render.

interface CourseDetailsClientPageProps {
  courseId: string;
}

const CourseDetailsClientPage = React.memo<CourseDetailsClientPageProps>(
  ({ courseId }) => {
    const router = useRouter();

    const { state, handleEnrollment } = useCourseDetails(courseId);

    const { getCourseRequestStatus } = useCourseRequests();

    // Get enrollment status for this course
    const { isSubscribed, status } = state.course
      ? getCourseRequestStatus(state.course.course_id)
      : { isSubscribed: false, status: null };

    // Memoized handlers for better performance
    const handleBack = useCallback(() => {
      router.back();
    }, [router]);

    const handleCoursesRedirect = useCallback(() => {
      router.push("/courses");
    }, [router]);

    const courseForHeader = useMemo(() => {
      if (!state.course) return null;
      return {
        ...(state.course as any),
        image_url: (state.course as any)?.image_url ?? "",
      } as CourseType;
    }, [state.course]);

    if (state.loading) {
      return (
        <div className="min-h-screen bg-slate-50 pt-20">
          <div className="flex items-center justify-center min-h-screen">
            <div className="flex items-center space-x-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="text-gray-700 text-lg font-medium">
                Loading course details...
              </span>
            </div>
          </div>
        </div>
      );
    }

    if (!state.course || state.error) {
      const isAuthError =
        state.error?.includes("log in") ||
        state.error?.includes("authentication");

      return (
        <div className="min-h-screen bg-slate-50 pt-20 flex items-center justify-center p-4">
          <Card className="shadow-2xl max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              {isAuthError ? (
                <>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Authentication Required
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Please log in to view course details and access the learning
                    materials.
                  </p>
                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={() => router.push("/auth/login")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Log In to Continue
                    </Button>
                    <Button onClick={handleCoursesRedirect} variant="outline">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Courses
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Course Not Found
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {state.error ||
                      "The course you are looking for does not exist or has been removed."}
                  </p>
                  <Button
                    onClick={handleCoursesRedirect}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Courses
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-slate-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={handleBack}
            className="mb-6 text-gray-600 hover:text-gray-900 border-gray-200 hover:border-gray-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>

          <div className="grid gap-5 mb-8 items-start lg:grid-cols-[minmax(0,2fr)_340px]">
            <div className="space-y-4 min-w-0">
              {courseForHeader && (
                <CourseDetailsHeader course={courseForHeader} />
              )}
              <CourseDetailsInfo course={state.course} />
            </div>

            <div className="lg:sticky lg:top-24">
              <CourseEnrollmentSection
                course={state.course}
                onEnrollment={handleEnrollment}
              />
            </div>
          </div>

          <div className="mb-8">
            <CourseModulesSection
              modules={state.course.modules || []}
              courseId={courseId}
              isEnrolled={isSubscribed}
              enrollmentStatus={status}
            />
          </div>
        </div>
      </div>
    );
  },
);

CourseDetailsClientPage.displayName = "CourseDetailsClientPage";

export default CourseDetailsClientPage;

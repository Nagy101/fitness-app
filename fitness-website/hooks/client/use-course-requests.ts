"use client";

import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchCourseRequests } from "@/lib/api/fetchers";

interface CourseRequest {
  request_id: number;
  course_id: number;
  user_id: number;
  gender: string;
  job: string;
  age: number;
  status: "pending" | "approved" | "cancelled";
  promo_code_used?: string;
  original_total: number;
  discount_value: number;
  net_total: number;
  created_at: string;
}

export function useCourseRequests() {
  const queryClient = useQueryClient();

  const hasToken =
    typeof window !== "undefined" && !!sessionStorage.getItem("token");

  const { data, isLoading, error, refetch } = useQuery<CourseRequest[]>({
    queryKey: queryKeys.user.courseRequests,
    queryFn: fetchCourseRequests as () => Promise<CourseRequest[]>,
    enabled: hasToken,
  });

  const requests = data ?? [];

  // Get request status for a specific course
  const getCourseRequestStatus = useCallback(
    (courseId: number) => {
      const request = requests
        .filter((req) => Number(req.course_id) === Number(courseId))
        .sort((a, b) => {
          const aTime = new Date(a.created_at || 0).getTime();
          const bTime = new Date(b.created_at || 0).getTime();
          return bTime - aTime;
        })[0];
      return {
        isSubscribed: !!request,
        status: request ? (String(request.status).toLowerCase() as any) : null,
        request: request || null,
      };
    },
    [requests],
  );

  // Check if user can enroll in a course
  const canEnroll = useCallback(
    (courseId: number) => {
      const { isSubscribed, status } = getCourseRequestStatus(courseId);

      if (!isSubscribed) return true;
      if (status === "cancelled") return true;
      return false;
    },
    [getCourseRequestStatus],
  );

  // Get enrollment button state
  const getEnrollmentButtonState = useCallback(
    (courseId: number) => {
      const { isSubscribed, status } = getCourseRequestStatus(courseId);

      if (!isSubscribed) {
        return {
          text: "Enroll Now",
          disabled: false,
          className:
            "w-full bg-primary hover:bg-[#0056b3] text-white font-semibold py-3 text-lg transition-colors duration-200",
          icon: "ShoppingCart",
        };
      }

      switch (status) {
        case "approved":
          return {
            text: "Enrolled",
            disabled: true,
            className:
              "w-full bg-green-600 text-white font-semibold py-3 text-lg cursor-not-allowed",
            icon: "CheckCircle",
          };
        case "pending":
          return {
            text: "Request Pending",
            disabled: true,
            className:
              "w-full bg-yellow-600 text-white font-semibold py-3 text-lg cursor-not-allowed",
            icon: "Eye",
          };
        case "cancelled":
          return {
            text: "Request Again",
            disabled: false,
            className:
              "w-full bg-primary hover:bg-[#0056b3] text-white font-semibold py-3 text-lg transition-colors duration-200",
            icon: "ShoppingCart",
          };
        default:
          return {
            text: "Enroll Now",
            disabled: false,
            className:
              "w-full bg-primary hover:bg-[#0056b3] text-white font-semibold py-3 text-lg transition-colors duration-200",
            icon: "ShoppingCart",
          };
      }
    },
    [getCourseRequestStatus],
  );

  return {
    requests,
    loading: isLoading,
    error: error?.message || null,
    refetch,
    getCourseRequestStatus,
    canEnroll,
    getEnrollmentButtonState,
  };
}

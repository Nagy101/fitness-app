"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { API_CONFIG } from "@/config/api";
import { useAuth } from "@/contexts/auth-context";
import { extractErrorMessage } from "@/lib/errors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays, Loader2 } from "lucide-react";

interface TrainingRequestDetails {
  status?: string;
  service_name?: string;
  trainer_name?: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  goal_description?: string;
  injury_details?: string;
  diseases_details?: string;
  age?: number | string;
  training_per_week?: number | string;
  weight?: number | string;
  height?: number | string;
  training_place?: string;
  [key: string]: any;
}

function toLabel(status: string | undefined): string {
  const s = (status || "pending").toLowerCase();
  if (s.includes("approve")) return "Approved";
  if (s.includes("cancel") || s.includes("reject")) return "Cancelled";
  return "Pending";
}

function statusClass(status: string | undefined): string {
  const s = (status || "pending").toLowerCase();
  if (s.includes("approve")) return "bg-green-100 text-green-800 border-green-200";
  if (s.includes("cancel") || s.includes("reject")) return "bg-red-100 text-red-800 border-red-200";
  return "bg-yellow-100 text-yellow-800 border-yellow-200";
}

function formatDate(date?: string): string {
  if (!date) return "-";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function calcTotalDays(start?: string, end?: string): string {
  if (!start || !end) return "-";
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return "-";
  const msPerDay = 24 * 60 * 60 * 1000;
  const diff = Math.floor((e.getTime() - s.getTime()) / msPerDay) + 1;
  if (diff <= 0) return "-";
  return `${diff} days`;
}

export default function TrainingRequestDetailsPage() {
  const { user } = useAuth();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const requestId = String(params?.id || "");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<TrainingRequestDetails | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!requestId || !/^\d+$/.test(requestId)) {
        setError("Invalid request id");
        setLoading(false);
        return;
      }

      let token: string | null = null;
      try {
        token = sessionStorage.getItem("token");
      } catch {
        token = null;
      }

      if (!token) {
        setError("You must be logged in.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          API_CONFIG.USER_FUNCTIONS.requests.training.showMyRequest(requestId),
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const data = res.data?.data || res.data || null;
        if (!data) {
          setError("Training request not found.");
          return;
        }
        setDetails(data);
      } catch (err: any) {
        const msg = extractErrorMessage(
          err,
          err?.response?.status === 404
            ? "Training request not found."
            : "Failed to load training request details.",
        );
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [requestId]);

  const totalDays = useMemo(
    () => calcTotalDays(details?.start_date, details?.end_date),
    [details?.start_date, details?.end_date],
  );

  const trainerDisplayName = useMemo(() => {
    return details?.trainer_name || user?.name || "-";
  }, [details?.trainer_name, user?.name]);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          {!loading && details ? (
            <Badge className={`${statusClass(details.status)} border`}>
              {toLabel(details.status)}
            </Badge>
          ) : null}
        </div>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl">Training Request Details</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-48 flex items-center justify-center text-gray-600">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Loading details...
              </div>
            ) : error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-4">
                {error}
              </div>
            ) : details ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-lg border bg-white p-4">
                    <p className="text-sm text-gray-500">Service</p>
                    <p className="font-semibold text-gray-900">
                      {details.service_name || "Training Service"}
                    </p>
                  </div>
                  <div className="rounded-lg border bg-white p-4">
                    <p className="text-sm text-gray-500">Trainer</p>
                    <p className="font-semibold text-gray-900">
                      {trainerDisplayName}
                    </p>
                  </div>
                  <div className="rounded-lg border bg-white p-4">
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-semibold text-gray-900">{formatDate(details.start_date)}</p>
                  </div>
                  <div className="rounded-lg border bg-white p-4">
                    <p className="text-sm text-gray-500">End Date</p>
                    <p className="font-semibold text-gray-900">{formatDate(details.end_date)}</p>
                  </div>
                  <div className="rounded-lg border bg-white p-4">
                    <p className="text-sm text-gray-500">Total Days</p>
                    <p className="font-semibold text-gray-900">{totalDays}</p>
                  </div>
                  <div className="rounded-lg border bg-white p-4">
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-semibold text-gray-900">{formatDate(details.created_at)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-lg border bg-white p-4">
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-semibold text-gray-900">{details.age ?? "-"}</p>
                  </div>
                  <div className="rounded-lg border bg-white p-4">
                    <p className="text-sm text-gray-500">Training / Week</p>
                    <p className="font-semibold text-gray-900">{details.training_per_week ?? "-"}</p>
                  </div>
                  <div className="rounded-lg border bg-white p-4">
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="font-semibold text-gray-900">{details.weight ?? "-"}</p>
                  </div>
                  <div className="rounded-lg border bg-white p-4">
                    <p className="text-sm text-gray-500">Height</p>
                    <p className="font-semibold text-gray-900">{details.height ?? "-"}</p>
                  </div>
                  <div className="rounded-lg border bg-white p-4 sm:col-span-2">
                    <p className="text-sm text-gray-500">Training Place</p>
                    <p className="font-semibold text-gray-900">{details.training_place || "-"}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg border bg-white p-4">
                    <p className="text-sm text-gray-500 mb-1">Goal Description</p>
                    <p className="text-gray-900">{details.goal_description || "-"}</p>
                  </div>
                  <div className="rounded-lg border bg-white p-4">
                    <p className="text-sm text-gray-500 mb-1">Injury Details</p>
                    <p className="text-gray-900">{details.injury_details || "-"}</p>
                  </div>
                  <div className="rounded-lg border bg-white p-4">
                    <p className="text-sm text-gray-500 mb-1">Diseases Details</p>
                    <p className="text-gray-900">{details.diseases_details || "-"}</p>
                  </div>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

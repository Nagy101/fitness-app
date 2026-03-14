"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users } from "lucide-react";
import { SectionCard } from "./SectionCard";
import { EmptyState } from "./EmptyState";
import { CardSkeleton } from "./LoadingSkeleton";

interface TrainingRequest {
  id: string;
  service_id?: string;
  service_name?: string;
  trainer_name?: string;
  status: string;
  created_at: string;
  start_date?: string;
  end_date?: string;
}

interface TrainingRequestsSectionProps {
  requests: TrainingRequest[];
  isLoading: boolean;
  onRefresh: () => void;
}

function toLabel(status: string): string {
  const normalized = (status || "pending").toLowerCase();
  if (normalized.includes("approve")) return "Approved";
  if (normalized.includes("cancel") || normalized.includes("reject")) return "Cancelled";
  return "Pending";
}

function getStatusColor(status: string): string {
  const normalized = (status || "pending").toLowerCase();
  if (normalized.includes("approve")) {
    return "bg-green-100 text-green-800 border-green-200";
  }
  if (normalized.includes("cancel") || normalized.includes("reject")) {
    return "bg-red-100 text-red-800 border-red-200";
  }
  return "bg-yellow-100 text-yellow-800 border-yellow-200";
}

function formatDate(dateString?: string): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function TrainingRequestsSection({
  requests,
  isLoading,
  onRefresh,
}: TrainingRequestsSectionProps) {
  return (
    <SectionCard
      title="Training Requests"
      icon={Users}
      iconColor="text-orange-600"
      count={requests.length}
      isLoading={isLoading}
      onRefresh={onRefresh}
    >
      {isLoading ? (
        <CardSkeleton />
      ) : requests.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No training requests"
          description="You have not submitted any training request yet."
          actionText="Browse services"
          actionHref="/services"
        />
      ) : (
        <ScrollArea className="h-[360px] pr-2">
          <div className="space-y-3">
            {requests.map((req) => (
              <div
                key={req.id}
                className="p-4 border rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900">
                        {req.service_name || "Training Service"}
                      </span>
                      <Badge className={`${getStatusColor(req.status)} border`}>
                        {toLabel(req.status)}
                      </Badge>
                    </div>
                    {req.trainer_name ? (
                      <p className="text-sm text-gray-600">Trainer: {req.trainer_name}</p>
                    ) : null}
                    <p className="text-sm text-gray-600">
                      Created: {formatDate(req.created_at)}
                    </p>
                    {(req.start_date || req.end_date) && (
                      <p className="text-sm text-gray-600">
                        Plan: {formatDate(req.start_date)} - {formatDate(req.end_date)}
                      </p>
                    )}
                  </div>
                  <div className="sm:self-start">
                    <Link href={`/dashboard/training-requests/${req.id}`}>
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                        Open Training Request
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </SectionCard>
  );
}

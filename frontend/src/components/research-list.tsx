"use client";

import { LoadingSpinner } from "@/components/loading-spinner";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useResearch } from "@/contexts/research-context";
import { formatDistanceToNow } from "date-fns";
import { Calendar, Eye, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ResearchList() {
  const { requests, loading, fetchRequests } = useResearch();
  const router = useRouter();

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleViewDetails = (id: string) => {
    router.push(`/research/${id}`);
  };

  if (loading && requests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Research Requests</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Your Research Requests
          </CardTitle>
          <CardDescription>
            Track your research requests and view results
          </CardDescription>
        </div>
        {loading && <LoadingSpinner size="sm" />}
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">No research requests yet</p>
            <p className="text-sm text-slate-500 mt-1">
              Submit your first research topic above to get started
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900 truncate">
                      {request.topic}
                    </h3>
                    <div className="flex items-center gap-4 mt-2">
                      <StatusBadge status={request.status} />
                      <div className="flex items-center text-sm text-slate-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDistanceToNow(new Date(request.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(request.id)}
                    className="ml-4"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

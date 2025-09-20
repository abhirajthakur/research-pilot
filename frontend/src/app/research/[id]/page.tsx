"use client";

import { AuthGuard } from "@/components/auth-guard";
import { LoadingSpinner } from "@/components/loading-spinner";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResearchProvider, useResearch } from "@/contexts/research-context";
import { ResearchRequest } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Clock, ExternalLink, FileText, Tag } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function ResearchDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { fetchRequestDetail } = useResearch();
  const [request, setRequest] = useState<ResearchRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRequest = async () => {
      if (!params.id || typeof params.id !== "string") return;

      setLoading(true);
      const result = await fetchRequestDetail(params.id);
      setRequest(result);
      setLoading(false);
    };

    loadRequest();
  }, [params.id, fetchRequestDetail]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-slate-600">Research request not found</p>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
              className="mt-4"
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-slate-900 truncate">
                  {request.topic}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={request.status} />
                  {(request.status === "pending" ||
                    request.status === "processing") && (
                    <LoadingSpinner size="sm" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Logs Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Workflow Logs
              </CardTitle>
              <CardDescription>
                Track the progress of your research request
              </CardDescription>
            </CardHeader>
            <CardContent>
              {request.logs && request.logs.length > 0 ? (
                <div className="space-y-4">
                  {request.logs.map((log, index) => (
                    <div
                      key={log.id}
                      className="flex gap-3 pb-4 border-b border-slate-100 last:border-b-0"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900">{log.step}</p>
                        <p className="text-sm text-slate-600 mt-1">
                          {log.message}
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                          {formatDistanceToNow(new Date(log.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No logs available yet</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Logs will appear as the research progresses
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Research Results
              </CardTitle>
              <CardDescription>
                {request.status === "completed"
                  ? "Your research results are ready"
                  : "Results will appear when research is complete"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {request.results && request.results.length > 0 ? (
                <div className="space-y-6">
                  {request.results.map((result) => (
                    <div key={result.id} className="space-y-4">
                      {/* Summary */}
                      <div>
                        <h3 className="font-medium text-slate-900 mb-2">
                          Summary
                        </h3>
                        <p className="text-slate-700 leading-relaxed">
                          {result.summary}
                        </p>
                      </div>

                      {/* Keywords */}
                      {result.keywords && result.keywords.length > 0 && (
                        <div>
                          <h3 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                            <Tag className="h-4 w-4" />
                            Keywords
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {result.keywords.map((keyword, index) => (
                              <Badge key={index} variant="secondary">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Articles */}
                      {result.articles && result.articles.length > 0 && (
                        <div>
                          <h3 className="font-medium text-slate-900 mb-3">
                            Related Articles
                          </h3>
                          <div className="space-y-3">
                            {result.articles.map((article, index) => (
                              <div
                                key={index}
                                className="border border-slate-200 rounded-lg p-3"
                              >
                                <h4 className="font-medium text-slate-900 mb-1">
                                  {article.title}
                                </h4>
                                <p className="text-sm text-slate-600 mb-2">
                                  {article.summary}
                                </p>
                                <a
                                  href={article.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
                                >
                                  Read more
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">
                    {request.status === "failed"
                      ? "Research failed to complete"
                      : "No results available yet"}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    {request.status === "failed"
                      ? "Please check the logs for more information"
                      : "Results will appear when the research is completed"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function ResearchDetailPage() {
  return (
    <AuthGuard>
      <ResearchProvider>
        <ResearchDetailContent />
      </ResearchProvider>
    </AuthGuard>
  );
}

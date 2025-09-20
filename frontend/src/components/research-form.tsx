"use client";

import { LoadingSpinner } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useResearch } from "@/contexts/research-context";
import { Search } from "lucide-react";
import { useState } from "react";

export function ResearchForm() {
  const [topic, setTopic] = useState("");
  const { submitResearch, loading } = useResearch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || loading) return;

    try {
      await submitResearch(topic.trim());
      setTopic("");
    } catch (error) {
      console.error("Error occured in research form submit handler: ", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-blue-600" />
          Submit Research Request
        </CardTitle>
        <CardDescription>
          Enter a research topic to get started with AI-powered research
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Climate change impacts on agriculture"
            className="flex-1"
            disabled={loading}
          />
          <Button type="submit" disabled={!topic.trim() || loading}>
            {loading && <LoadingSpinner size="sm" className="mr-2" />}
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

"use client";

import {
  submitResearch as apiSubmitResearch,
  getAllResearch,
  getResearchById,
} from "@/lib/api";
import { ResearchContextType, ResearchRequest } from "@/lib/types";
import React, { createContext, useContext, useState } from "react";
import { toast } from "sonner";

const ResearchContext = createContext<ResearchContextType | undefined>(
  undefined,
);

export function ResearchProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<ResearchRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitResearch = async (topic: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiSubmitResearch(topic);

      const newRequest: ResearchRequest = {
        id: response.id,
        topic: response.topic,
        status: response.status as any,
        createdAt: new Date().toISOString(),
      };

      setRequests((prev) => [newRequest, ...prev]);
      toast.success("Research request submitted successfully!");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to submit research";
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAllResearch();
      const formattedRequests: ResearchRequest[] = response.map((req) => ({
        id: req.id,
        topic: req.topic,
        status: req.status as any,
        createdAt: req.createdAt,
      }));

      setRequests(formattedRequests);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch requests";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequestDetail = async (
    id: string,
  ): Promise<ResearchRequest | null> => {
    try {
      const response = await getResearchById(id);
      return {
        id: response.id,
        topic: response.topic,
        status: response.status as any,
        createdAt: new Date().toISOString(), // API doesn't return createdAt in detail
        logs: response.logs,
        results: response.results,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch request details";
      toast.error(message);
      return null;
    }
  };

  return (
    <ResearchContext.Provider
      value={{
        requests,
        loading,
        error,
        submitResearch,
        fetchRequests,
        fetchRequestDetail,
      }}
    >
      {children}
    </ResearchContext.Provider>
  );
}

export function useResearch() {
  const context = useContext(ResearchContext);
  if (context === undefined) {
    throw new Error("useResearch must be used within a ResearchProvider");
  }
  return context;
}

"use client";

import { AuthGuard } from "@/components/auth-guard";
import { DashboardHeader } from "@/components/dashboard-header";
import { ResearchForm } from "@/components/research-form";
import { ResearchList } from "@/components/research-list";
import { ResearchProvider } from "@/contexts/research-context";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <ResearchProvider>
        <div className="min-h-screen bg-slate-50">
          <DashboardHeader />

          <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              <ResearchForm />
              <ResearchList />
            </div>
          </main>
        </div>
      </ResearchProvider>
    </AuthGuard>
  );
}

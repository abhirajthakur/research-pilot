export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ResearchRequest {
  id: string;
  topic: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
  logs?: WorkflowLog[];
  results?: ResearchResult[];
}

export interface WorkflowLog {
  id: number;
  step: string;
  message: string;
  createdAt: string;
}

export interface ResearchResult {
  id: number;
  summary: string;
  keywords: string[];
  articles: {
    title: string;
    url: string;
    summary: string;
  }[];
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface ResearchContextType {
  requests: ResearchRequest[];
  loading: boolean;
  error: string | null;
  submitResearch: (topic: string) => Promise<void>;
  fetchRequests: () => Promise<void>;
  fetchRequestDetail: (id: string) => Promise<ResearchRequest | null>;
}

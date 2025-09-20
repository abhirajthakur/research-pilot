const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem("auth_token");

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (response.status === 401) {
    localStorage.removeItem("auth_token");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "API request failed");
  }

  return await response.json();
}

export async function login(email: string, password: string) {
  return request<{ token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(name: string, email: string, password: string) {
  return request<{ id: string; name: string; email: string }>(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    },
  );
}

export async function submitResearch(topic: string) {
  return request<{ id: string; topic: string; status: string }>("/research", {
    method: "POST",
    body: JSON.stringify({ topic }),
  });
}

export async function getAllResearch() {
  return request<
    Array<{
      id: string;
      topic: string;
      status: string;
      createdAt: string;
    }>
  >("/research");
}

export async function getResearchById(id: string) {
  return request<{
    id: string;
    topic: string;
    status: string;
    logs: Array<{
      id: number;
      step: string;
      message: string;
      createdAt: string;
    }>;
    results: Array<{
      id: number;
      summary: string;
      keywords: string[];
      articles: Array<{
        title: string;
        url: string;
        summary: string;
      }>;
    }>;
  }>(`/research/${id}`);
}

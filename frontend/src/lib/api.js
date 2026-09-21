const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const authPaths = new Set([
  "/api/admin/login",
  "/api/admin/logout",
  "/api/admin/me",
]);

export async function apiRequest(path, options = {}) {
  const hasBody = options.body !== undefined;
  const url = authPaths.has(path) ? path : `${apiBaseUrl}${path}`;
  const response = await fetch(url, {
    credentials: "include",
    ...options,
    headers: {
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.message || "Request failed. Please try again.");
    error.status = response.status;
    throw error;
  }

  return data;
}

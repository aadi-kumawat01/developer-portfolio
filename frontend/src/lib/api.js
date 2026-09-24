const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export async function apiRequest(path, options = {}) {
  const hasBody = options.body !== undefined;
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  // Every CMS request, including login, must target the backend. This keeps the
  // HttpOnly admin cookie on the same domain that verifies it.
  const url = `${apiBaseUrl}${path}`;
  const response = await fetch(url, {
    credentials: "include",
    ...options,
    headers: {
      ...(hasBody && !isFormData ? { "Content-Type": "application/json" } : {}),
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

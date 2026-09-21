const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function forwardAdminRequest(request, endpoint) {
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  const cookie = request.headers.get("cookie");

  if (contentType) headers.set("content-type", contentType);
  if (cookie) headers.set("cookie", cookie);

  const hasBody = !["GET", "HEAD"].includes(request.method);
  const backendResponse = await fetch(`${backendUrl}/api/admin/${endpoint}`, {
    method: request.method,
    headers,
    body: hasBody ? await request.text() : undefined,
    cache: "no-store",
  });

  const responseHeaders = new Headers();
  const responseContentType = backendResponse.headers.get("content-type");
  const setCookie = backendResponse.headers.get("set-cookie");

  if (responseContentType) responseHeaders.set("content-type", responseContentType);
  if (setCookie) responseHeaders.set("set-cookie", setCookie);

  return new Response(await backendResponse.arrayBuffer(), {
    status: backendResponse.status,
    headers: responseHeaders,
  });
}

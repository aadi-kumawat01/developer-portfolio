export const authCookieName = "adminToken";
export const authCookieAge = 7 * 24 * 60 * 60 * 1000;

export function authCookieOptions() {
  const production = process.env.NODE_ENV === "production";
  const requestedSameSite = process.env.COOKIE_SAME_SITE?.toLowerCase();
  const sameSite = ["lax", "strict", "none"].includes(requestedSameSite)
    ? requestedSameSite
    : production ? "none" : "lax";

  return {
    httpOnly: true,
    sameSite,
    secure: production,
    path: "/",
    maxAge: authCookieAge,
  };
}

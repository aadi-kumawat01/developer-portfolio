function configuredFrontendOrigin() {
  return process.env.FRONTEND_URL || "http://localhost:3000";
}

export function corsOrigin(origin, callback) {
  if (!origin || origin === configuredFrontendOrigin()) {
    callback(null, true);
    return;
  }

  const error = new Error("Origin is not allowed");
  error.statusCode = 403;
  callback(error);
}

export function requireTrustedAdminOrigin(req, res, next) {
  if (!['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method)) {
    next();
    return;
  }

  const origin = req.get("origin");
  if (!origin || origin === configuredFrontendOrigin()) {
    next();
    return;
  }

  res.status(403).json({ success: false, message: "Origin is not allowed" });
}

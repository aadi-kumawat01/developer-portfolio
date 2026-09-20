export function errorHandler(error, req, res, next) {
  const statusCode = res.statusCode >= 400 ? res.statusCode : 500;
  const message = statusCode === 500 ? "Internal server error" : error.message;

  res.status(statusCode).json({
    success: false,
    message,
  });
}

export function errorHandler(error, req, res, next) {
  let statusCode = error.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  let message = statusCode === 500 ? "Internal server error" : error.message;

  if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource id";
  }

  if (error.name === "ValidationError") {
    statusCode = 400;
    message = "Invalid request data";
  }

  if (error.code === 11000) {
    statusCode = 409;
    message = "A record with this value already exists";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}

/**
 * Centralized, safe error handling middleware.
 * Prevents stack traces, database credentials, or secret leakage in responses.
 */
export const errorHandler = (err, req, res, next) => {
  // Safe console log without leaking sensitive customer payload
  console.error('[ServerError]', {
    method: req.method,
    path: req.originalUrl,
    error: err.message,
    status: err.status || 500,
  });

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors: messages,
    });
  }

  // Handle Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Malformed request identifier.',
    });
  }

  // Handle Payload Too Large
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'Request payload too large.',
    });
  }

  // Handle CORS Error
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      message: 'Origin not allowed by CORS policy.',
    });
  }

  const statusCode = err.status || 500;
  const isDev = process.env.NODE_ENV === 'development';

  return res.status(statusCode).json({
    success: false,
    message: err.userMessage || 'An unexpected server error occurred. Please try again later or reach out via WhatsApp.',
    ...(isDev ? { detail: err.message } : {}),
  });
};

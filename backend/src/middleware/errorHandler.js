// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    message,
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
};

// 404 Not Found middleware
export const notFound = (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
  });
};

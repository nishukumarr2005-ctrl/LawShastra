export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    errors: [{ path: req.originalUrl, message: 'This endpoint does not exist.' }],
  })
}

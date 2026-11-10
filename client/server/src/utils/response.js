export const sendSuccess = (res, message, data = null, status = 200) => {
  res.status(status).json({
    success: true,
    message,
    data,
  })
}

export const sendError = (res, message, errors = [], status = 400) => {
  res.status(status).json({
    success: false,
    message,
    errors,
  })
}

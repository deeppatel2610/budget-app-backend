const sendResponse = (
  res,
  statusCode = 200,
  success = true,
  data = null,
  error = null,
) => {
  return res.status(statusCode).json({
    success,
    data,
    error,
  });
};

module.exports = sendResponse;

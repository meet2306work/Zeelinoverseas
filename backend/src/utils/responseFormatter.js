const sendResponse = (res, statusCode, message, data = null, pagination = null) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination,
    errors: null,
    statusCode
  });
};

module.exports = sendResponse;

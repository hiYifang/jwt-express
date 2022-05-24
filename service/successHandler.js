const getHttpResponse = (data) => {
  const result = { status: 'success' };
  if (data) result.data = data;
  return result;
};

module.exports = getHttpResponse;
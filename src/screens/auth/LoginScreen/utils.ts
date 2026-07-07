export const parseBackendError = (error: any, defaultMsg: string) => {
  const responseData = error?.response?.data;
  if (responseData?.detail && Array.isArray(responseData.detail) && responseData.detail.length > 0) {
    return responseData.detail[0]?.msg || defaultMsg;
  }
  if (typeof responseData?.detail === 'string') {
    return responseData.detail;
  }
  return responseData?.message || defaultMsg;
};

export const formatForgotTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

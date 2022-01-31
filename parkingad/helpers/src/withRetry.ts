const withRetry = async <T = unknown>(
  promise: Function,
  attemps: number,
): Promise<T> => {
  try {
    return await promise();
  } catch {
    return await withRetry<T>(promise, attemps - 1);
  }
};

export { withRetry };

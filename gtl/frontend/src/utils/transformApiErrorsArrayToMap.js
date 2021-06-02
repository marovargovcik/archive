const transformApiErrorsArrayToMap = (error) => {
  if (error?.response.data.errors.length) {
    return error?.response.data.errors.reduce((acc, error) => {
      acc[error.source] = error.message;
      return acc;
    }, {});
  }
};

export { transformApiErrorsArrayToMap };

const logError = (error) => {
  if (error.response) {
    console.error('Error has occurred during server API call:', error.response);
  } else {
    console.error('Unexpected error has occurred:', error);
  }
  return error;
};

export { logError };

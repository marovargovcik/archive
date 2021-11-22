import { createResponse } from '@/utils/createResponse';
import { isExtendedHttpError } from '@/utils/types';
import type { ApiFieldError, ExtendedHttpError } from '@/utils/types';

const handleError = (error: Error | ExtendedHttpError) => {
  let errors: ApiFieldError[] = [];
  let message =
    'Whoops. We hit an unexpected error. Try again later. If the problem persists, contact support.';
  let status = 500;

  if (isExtendedHttpError(error)) {
    errors = error.errors;
    message = error.expose ? error.message : message;
    status = error.status;
  }

  return createResponse({
    errors,
    message,
    payload: undefined,
    status,
  });
};

export { handleError };

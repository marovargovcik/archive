import type { HttpError } from 'http-errors';
import createError from 'http-errors';

import config from './config';
import type { ApiFieldError } from './createResponsePayload';
import createResponsePayload from './createResponsePayload';

const isHttpError = (error: Error | HttpError): error is HttpError => {
  return createError.isHttpError(error);
};

export default (error: Error | HttpError) => {
  let errors: ApiFieldError[] = [];
  let message =
    'Whoops. We hit an unexpected error. Try again later. If the problem persists, contact support.';
  let payload: unknown;
  let status = 500;

  if (isHttpError(error)) {
    errors = error.errors;
    message = error.expose ? error.message : message;
    payload = error.payload;
    status = error.status;
  }

  return createResponsePayload({
    errors,
    message,
    payload,
    status,
  });
};

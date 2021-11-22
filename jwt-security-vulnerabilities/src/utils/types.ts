import { isHttpError } from 'http-errors';
import type { HttpError } from 'http-errors';

type ApiFieldError = {
  message: string;
  source: string;
};

type ExtendedHttpError = ExtendedHttpErrorProperties & HttpError;

type ExtendedHttpErrorProperties = {
  errors: ApiFieldError[];
  expose: boolean;
};

type User = {
  password: string;
  username: string;
};

const isApiFieldError = (object: {
  [key: string]: unknown;
}): object is ApiFieldError => {
  return (
    typeof object.message === 'string' && typeof object.source === 'string'
  );
};

const isExtendedHttpError = (
  error: Error | HttpError,
): error is ExtendedHttpError => {
  return (
    isHttpError(error) &&
    Array.isArray(error.errors) &&
    error.errors.every(isApiFieldError) &&
    typeof error.expose === 'boolean'
  );
};

export type {
  ApiFieldError,
  ExtendedHttpError,
  ExtendedHttpErrorProperties,
  User,
};
export { isApiFieldError, isExtendedHttpError };

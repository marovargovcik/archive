import type {
  ExtendedHttpError,
  ExtendedHttpErrorProperties,
} from '@repo/types/api/errors';
import _createError from 'http-errors';

type CreateError = (
  code: number,
  message: string,
  properties: ExtendedHttpErrorProperties,
) => ExtendedHttpError;

const createError: CreateError = (code, message, properties) =>
  _createError(code, message, properties) as ExtendedHttpError;

export { createError };

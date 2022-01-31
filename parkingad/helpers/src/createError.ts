import _createError from 'http-errors';

import type { ExtendedHttpError, ExtendedHttpErrorProperties } from '@/types';

type CreateError = (
  code: number,
  message: string,
  properties: ExtendedHttpErrorProperties,
) => ExtendedHttpError;

const createError: CreateError = (code, message, properties) =>
  _createError(code, message, properties) as ExtendedHttpError;

export { createError };

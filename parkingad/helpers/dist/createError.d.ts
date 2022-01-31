import type { ExtendedHttpError, ExtendedHttpErrorProperties } from './types';
declare type CreateError = (code: number, message: string, properties: ExtendedHttpErrorProperties) => ExtendedHttpError;
declare const createError: CreateError;
export { createError };
//# sourceMappingURL=createError.d.ts.map
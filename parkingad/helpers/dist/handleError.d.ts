import type { ApiFieldError, ExtendedHttpError } from './types';
declare const handleError: (error: Error | ExtendedHttpError) => {
    errors: ApiFieldError[];
    message: string;
    payload: undefined;
    status: number;
};
export { handleError };
//# sourceMappingURL=handleError.d.ts.map
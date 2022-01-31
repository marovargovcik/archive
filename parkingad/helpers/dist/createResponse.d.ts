import type { ApiFieldError } from './types';
declare type CreateResponse<Payload = null> = {
    errors: ApiFieldError[];
    message: string;
    payload: Payload;
    status: number;
};
declare const createResponse: <Payload = null>({ errors, message, payload, status, }: CreateResponse<Payload>) => {
    errors: ApiFieldError[];
    message: string;
    payload: Payload;
    status: number;
};
export { createResponse };
//# sourceMappingURL=createResponse.d.ts.map
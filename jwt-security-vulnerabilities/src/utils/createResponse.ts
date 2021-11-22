import type { ApiFieldError } from '@/utils/types';

type CreateResponse<Payload = unknown> = {
  errors: ApiFieldError[];
  message: string;
  payload: Payload;
  status: number;
};

const createResponse = <Payload = unknown>({
  errors,
  message,
  payload,
  status,
}: CreateResponse<Payload>) => {
  return {
    errors,
    message,
    payload,
    status,
  };
};

export { createResponse };

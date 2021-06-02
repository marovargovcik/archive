type ApiFieldError = {
  message: string;
  source: string;
};

type CreateJSONPayloadSignature<Payload = unknown> =
  | {
      errors?: ApiFieldError[];
      message?: string;
      payload?: Payload;
      status?: number;
    }
  | undefined;

export default <Payload = unknown>({
  errors = [],
  message = 'Ok',
  payload,
  status = 200,
}: CreateJSONPayloadSignature<Payload> = {}) => {
  return {
    errors,
    message,
    payload,
    status,
  };
};

export type { ApiFieldError, CreateJSONPayloadSignature };

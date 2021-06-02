import type { Request } from 'express';

type TLoginRequest = Request<
  {},
  {},
  {
    ssn: string;
    password: string;
  }
>;

type TLoginResponsePayload = {
  accessToken: string;
  refreshToken: string;
};

type TRefreshTokenRequest = Request<
  {},
  {},
  {
    refreshToken: string;
  }
>;

type TRefreshTokenResponsePayload = {
  accessToken: string;
};

export {
  TLoginRequest,
  TLoginResponsePayload,
  TRefreshTokenRequest,
  TRefreshTokenResponsePayload,
};

import type { Request } from 'express';

type TCheckRequestPayload = {
  childId: number;
};

type TCheckRequest = Request<{}, {}, TCheckRequestPayload>;

type TIsCheckedInRequestPayload = {
  childId: number;
};

type TIsCheckedInRequest = Request<{
  childId: string;
}>;

export type {
  TCheckRequest,
  TCheckRequestPayload,
  TIsCheckedInRequest,
  TIsCheckedInRequestPayload,
};

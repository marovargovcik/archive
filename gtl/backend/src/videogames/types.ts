import type { Request } from 'express';

import type { TLoan } from '../loans/types';

type TVideoGame = {
  _id: string;
  title: string;
  developer: string;
};

type TGetVideoGamesResponsePayload = TVideoGame[];

type TGetVideoGameAvailabilityRequest = Request<{
  _id: TVideoGame['_id'];
}>;

type TGetVideoGameAvailabilityResponsePayload = Array<{
  copyId: TLoan['copyId'];
  returnDate: TLoan['returnDate'];
  graceDate: TLoan['graceDate'];
}>;

export type {
  TVideoGame,
  TGetVideoGamesResponsePayload,
  TGetVideoGameAvailabilityRequest,
  TGetVideoGameAvailabilityResponsePayload,
};

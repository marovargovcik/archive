import { TStaffPersonWithoutPasswordHash } from './staff/types';
import { TConfig } from './utils/config';

declare global {
  namespace Express {
    interface Request {
      user: TStaffPersonWithoutPasswordHash
    }
  }
  namespace NodeJS {
    interface Global {
      CONFIG: TConfig;
      CHIEF_LIBRARIAN_ACCESS_TOKEN: string;
      CHIEF_LIBRARIAN_REFRESH_TOKEN: string;
      CHECK_OUT_STAFF_ACCESS_TOKEN: string;
      CHECK_OUT_STAFF_REFRESH_TOKEN: string;
    }
  }
}

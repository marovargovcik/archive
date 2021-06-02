import type { Request, Response } from 'express';
import { Router } from 'express';

import { createResponsePayload } from '../utils';

const router = Router();

router.post(
  '/internal/send-notices',
  async (request: Request, response: Response) => {
    response.json(createResponsePayload({ payload: request.body }));
  },
);

export default router;

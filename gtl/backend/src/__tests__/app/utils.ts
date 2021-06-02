import createError from 'http-errors';

import { handleError } from '../../utils';

describe('utils handleError func', () => {
  it('should respect expose property', () => {
    const response = handleError(
      createError(500, 'Sensitive stack trace', { expose: false }),
    );
    expect(response.message).not.toEqual('Sensitive stack trace');
    expect(response.status).toEqual(500);
  });
});

import { render, screen } from '@testing-library/react';

import { useAuth } from '../../hooks/stores/useAuth';
import { useDecodedJWT } from '../../hooks/useDecodedJWT';

jest.mock('../../hooks/stores/useAuth.js', () => ({
  useAuth: jest.fn(),
}));

const Component = () => {
  const { name } = useDecodedJWT();
  return name ? name : 'No token provided';
};

describe('hooks - useDecodedJWT', () => {
  it('should decode token with payload', () => {
    useAuth.mockReturnValueOnce(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    );

    render(<Component />);
    expect(screen.getByText(/John Doe/)).not.toBeNull();
  });

  it('should return empty object when token not provided', () => {
    useAuth.mockReturnValueOnce(null);

    render(<Component />);
    expect(screen.getByText(/No token provided/)).not.toBeNull();
  });
});

import { render, screen } from '@testing-library/react';

import { useIsAuthenticated } from '../../hooks/useIsAuthenticated';

jest.mock('../../hooks/stores/useAuth.js', () => ({
  useAuth: () => ({
    accessToken: 'validAccessToken',
    refreshToken: 'validRefreshToken',
  }),
}));

const Component = () => {
  const isAuthenticated = useIsAuthenticated();
  return isAuthenticated ? 'Yes' : 'No';
};

describe('hooks - useIsAuthenticated', () => {
  it('should display a "Yes" when authenticated', () => {
    render(<Component />);
    expect(screen.getByText(/Yes/)).not.toBeNull();
  });
});

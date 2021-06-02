import { render, screen } from '@testing-library/react';

import { withRoleRequired } from '../../../components/hoc/withRoleRequired';
import { useDecodedJWT } from '../../../hooks/useDecodedJWT';

jest.mock('../../../hooks/useDecodedJWT', () => ({
  useDecodedJWT: jest.fn(),
}));

const ProtectedComponent = withRoleRequired('chief librarian', () => {
  return <h1>Protected component</h1>;
});

describe('components - hoc - withRoleRequired', () => {
  it('should forbid displaying component', () => {
    useDecodedJWT.mockImplementation(() => ({
      role: 'reference librarian',
    }));
    render(<ProtectedComponent />);
    expect(screen.getByText(/Forbidden/)).not.toBeNull();
  });

  it('should display protected component', () => {
    useDecodedJWT.mockImplementation(() => ({
      role: 'chief librarian',
    }));
    render(<ProtectedComponent />);
    expect(screen.getByText(/Protected component/)).not.toBeNull();
  });
});

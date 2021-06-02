import { Navigate } from 'react-router-dom';

import { useIsAuthenticated } from '../../hooks/useIsAuthenticated';

const withLoginRequired =
  (Component) =>
  (...props) => {
    const isAuthenticated = useIsAuthenticated();

    if (isAuthenticated) {
      return <Component {...props} />;
    }
    return <Navigate to='/staff/login' />;
  };

export { withLoginRequired };

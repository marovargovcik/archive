import { useAuth } from './stores/useAuth';

const useIsAuthenticated = () => {
  const { accessToken, refreshToken } = useAuth();
  return accessToken && refreshToken;
};

export { useIsAuthenticated };

import { parseJWT } from '../utils/parseJWT';

import { useAuth } from './stores/useAuth';

const useDecodedJWT = () => {
  const refreshToken = useAuth((state) => state.refreshToken);
  return refreshToken ? parseJWT(refreshToken) : {};
};

export { useDecodedJWT };

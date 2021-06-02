import { useDecodedJWT } from '../../hooks/useDecodedJWT';
import { isPermitted } from '../../utils/rolesHierarchy';
import { Forbidden } from '../errors/Forbidden';

const withRoleRequired =
  (requiredRole, Component) =>
  (...props) => {
    const { role } = useDecodedJWT();

    if (role && isPermitted(requiredRole, role)) {
      return <Component {...props} />;
    }
    return <Forbidden />;
  };

export { withRoleRequired };

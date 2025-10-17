import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

const GuestRoute = ({ redirectPath = '/app' }) => {
  const token = useAuthStore((state) => state.token);

  if (token) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

GuestRoute.propTypes = {
  redirectPath: PropTypes.string
};

export default GuestRoute;

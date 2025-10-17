import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

const ProtectedRoute = ({ redirectPath = '/login' }) => {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

ProtectedRoute.propTypes = {
  redirectPath: PropTypes.string
};

export default ProtectedRoute;

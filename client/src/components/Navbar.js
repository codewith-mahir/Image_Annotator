import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const tabs = [
  { id: 'upload', label: 'Upload' },
  { id: 'annotate', label: 'Annotate' }
];

const Navbar = ({ activeTab, onChangeTab }) => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="brand">Thesis Image Annotator</span>
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={tab.id === activeTab ? 'tab active' : 'tab'}
              onClick={() => onChangeTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="navbar-right">
        {user && <span className="user-name">{user.name}</span>}
        <button type="button" className="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onChangeTab: PropTypes.func.isRequired
};

export default Navbar;

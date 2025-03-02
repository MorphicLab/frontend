import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import features from '../config/features';

const Layout: React.FC = () => {
  return (
    <div>
      <Navbar showAllPages={features.SHOW_ALL_PAGES} />
      <Outlet />
    </div>
  );
};

export default Layout; 
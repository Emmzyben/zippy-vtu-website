import { Outlet, useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import MobileNavigation from './MobileNavigation';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Paths where MobileNavigation should be hidden
  const hideMobileNavPaths = ['/login', '/register', '/landing'];

  const shouldShowMobileNav = !hideMobileNavPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-neutral-50">
      {isAuthenticated ? (
        <div className="lg:flex">
          <Navigation />
          <main className="flex-1 lg:ml-64">
            <div className="pb-16 lg:pb-0">
              <Outlet />
            </div>
          </main>
        </div>
      ) : (
        <Outlet />
      )}
      {shouldShowMobileNav && <MobileNavigation />}
    </div>
  );
};

export default Layout;

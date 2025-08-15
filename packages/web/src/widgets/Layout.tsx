import type {FC, ReactNode} from 'react';
import clsx from 'clsx';
import {Link, useLocation} from 'react-router-dom';
import {useUser} from '../hooks/useUser.js';
import {useToast} from './ToastProvider.js';

export type NavigationItem = {name: string; path: string; icon?: ReactNode};

type LayoutProps = {
  readonly children: ReactNode;
  readonly navigation: Array<NavigationItem>;
};

const Layout: FC<LayoutProps> = ({children, navigation}) => {
  const location = useLocation();
  const {user, logout} = useUser();
  const {safeAsync} = useToast();
  const computedNavigation: Array<NavigationItem> = [
    ...navigation,
    ...(user?.role === 'admin'
      ? [{name: 'Admin', path: '/admin', icon: '⚙️'}]
      : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">Gitterdun</h1>

              <span className="ml-2 text-sm text-gray-500">Chore Tracker</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Points:</span>

                <span className="font-semibold text-indigo-600">
                  {user?.points ?? 0}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Streak:</span>

                <span className="font-semibold text-orange-500">
                  {user?.streak_count ?? 0} 🔥
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">👤</span>

                <span className="text-sm font-medium text-gray-700">
                  {user?.username ?? 'User'}
                </span>
              </div>

              {user ? (
                <button
                  className="text-sm text-red-600 border px-2 py-1 rounded"
                  // TODO: handle promise rejection
                  onClick={safeAsync(async () => {
                    await logout();
                  }, 'Unable to log out. Please try again.')}
                  type="button"
                >
                  Logout
                </button>
              ) : (
                <Link className="text-sm text-indigo-600" to="/login">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              {computedNavigation.map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    className={clsx(
                      'group w-full flex items-center px-3 py-2 text-sm font-medium border-l-4 transition-colors duration-200',
                      isActive
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    )}
                    key={item.name}
                    to={item.path}
                  >
                    <span className="mr-3 flex-shrink-0 text-lg">
                      {item.icon}
                    </span>

                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;

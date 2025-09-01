import type {FC, ReactNode} from 'react';
import {useState} from 'react';
// no local state needed
import {useLocation} from 'react-router-dom';
import {useIntl} from 'react-intl';
import type {MessageDescriptor} from 'react-intl';
import {UserIcon} from './icons/index.js';
import {IconButton} from './IconButton.js';
import {UserMenuDrawer} from './UserMenuDrawer.js';
import {BottomNav} from './BottomNav.js';
import {useUser} from '../hooks/useUser.js';
import {useToast} from './ToastProvider.js';

export type NavigationItem = {
  message: MessageDescriptor;
  path: string;
  icon?: ReactNode;
};

type LayoutProps = {
  readonly children: ReactNode;
  readonly navigation: Array<NavigationItem>;
};

const Layout: FC<LayoutProps> = ({children, navigation}) => {
  const location = useLocation();
  const intl = useIntl();
  // locale controls moved to Settings page
  const {user, logout} = useUser();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const {safeAsync} = useToast();
  const menuLabel = intl.formatMessage({
    defaultMessage: 'Menu',
    id: 'widgets.Layout.menu',
  });
  const computedNavigation: Array<NavigationItem> = [...navigation];

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-end border-b bg-white px-4 py-3 shadow-sm">
        <IconButton
          aria-label={intl.formatMessage({
            defaultMessage: 'User Menu',
            id: 'widgets.Layout.userMenu',
          })}
          icon={<UserIcon size="sm" />}
          label={intl.formatMessage({
            defaultMessage: 'User Menu',
            id: 'widgets.Layout.userMenu',
          })}
          onClick={() => {
            setUserMenuOpen(true);
          }}
          variant="ghost"
        >
          User
        </IconButton>
        <UserMenuDrawer
          onClose={() => {
            setUserMenuOpen(false);
          }}
          onLogout={safeAsync(async () => {
            await logout();
          }, 'Unable to log out. Please try again.')}
          open={userMenuOpen}
          username={user?.username}
        />
      </header>

      <main className="flex-1 overflow-auto">{children}</main>

      <footer>
        <BottomNav
          ariaLabel={menuLabel}
          currentPath={location.pathname}
          items={computedNavigation}
        />
      </footer>
    </div>
  );
};

export default Layout;

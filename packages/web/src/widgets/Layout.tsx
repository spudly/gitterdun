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
import {useQuery} from '@tanstack/react-query';
import {familiesApi} from '../lib/api.js';

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
  const {data: myFamily} = useQuery({
    queryKey: ['family', 'mine', user?.id],
    queryFn: async () => familiesApi.myFamily(),
    enabled: Boolean(user),
    staleTime: 60_000,
  });
  const familyId = (myFamily?.data as {id?: number} | null | undefined)?.id;
  const {data: membersData} = useQuery({
    queryKey: ['family', familyId, 'members'],
    queryFn: async () => {
      if (familyId == null) {
        return {success: true, data: []} as const;
      }
      return familiesApi.listMembers(familyId);
    },
    enabled: familyId != null,
    staleTime: 30_000,
  });
  const isParent = (() => {
    if (user == null) {
      return false;
    }
    const fam = myFamily?.data as {owner_id?: unknown} | null | undefined;
    if (fam && typeof fam.owner_id === 'number' && fam.owner_id === user.id) {
      return true;
    }
    const members = membersData?.data as
      | ReadonlyArray<{user_id: number; role: string}>
      | undefined;
    if (!members) {
      return false;
    }
    return members.some(
      member => member.user_id === user.id && member.role === 'parent',
    );
  })();
  if (isParent) {
    computedNavigation.push({
      message: {defaultMessage: 'Approvals', id: 'widgets.Layout.approvals'},
      path: '/family/approvals',
      icon: '✅',
    });
  }

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

import type {FC, ReactNode} from 'react';
import clsx from 'clsx';
import {Link, useLocation} from 'react-router-dom';
import {FormattedMessage, useIntl} from 'react-intl';
import type {MessageDescriptor} from 'react-intl';
import {useI18n} from '../i18n/I18nProvider.js';
import {FlameIcon, GearIcon, UserIcon} from './icons/index.js';
import {LocaleSelector} from './LocaleSelector.js';
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
  const {locale, setLocale} = useI18n();
  const {user, logout} = useUser();
  const {safeAsync} = useToast();
  const computedNavigation: Array<NavigationItem> = [
    ...navigation,
    ...(user?.role === 'admin'
      ? [
          {
            message: {defaultMessage: 'Admin', id: 'layout.nav.admin'},
            path: '/admin',
            icon: <GearIcon size="sm" />,
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">
                <FormattedMessage
                  defaultMessage="Gitterdun"
                  id="widgets.Layout.gitterdun"
                />
              </h1>

              <span className="ml-2 text-sm text-gray-500">
                <FormattedMessage
                  defaultMessage="Chore Wrangler"
                  id="widgets.Layout.chore-wrangler"
                />
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {intl.formatMessage({
                    defaultMessage: 'Points',
                    id: 'widgets.Layout.points',
                  })}
                </span>

                <span className="font-semibold text-indigo-600">
                  {user?.points ?? 0}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {intl.formatMessage({
                    defaultMessage: 'Streak',
                    id: 'widgets.Layout.streak',
                  })}
                </span>

                <span className="flex flex-nowrap items-center gap-2 font-semibold text-orange-500">
                  {user?.streak_count ?? 0} <FlameIcon size="sm" />
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span aria-hidden className="text-sm text-gray-400">
                  <UserIcon size="sm" />
                </span>

                <span className="text-sm font-medium text-gray-700">
                  {user?.username
                    ?? intl.formatMessage({
                      defaultMessage: 'User',
                      id: 'widgets.Layout.user',
                    })}
                </span>
              </div>

              <div className="flex items-center">
                <LocaleSelector
                  onChange={value => {
                    setLocale(value);
                  }}
                  value={locale}
                />
              </div>

              {user ? (
                <button
                  className="rounded border px-2 py-1 text-sm text-red-600"
                  // TODO: handle promise rejection
                  onClick={safeAsync(async () => {
                    await logout();
                  }, 'Unable to log out. Please try again.')}
                  type="button"
                >
                  <FormattedMessage
                    defaultMessage="Logout"
                    id="widgets.Layout.logout"
                  />
                </button>
              ) : (
                <Link className="text-sm text-indigo-600" to="/login">
                  <FormattedMessage
                    defaultMessage="Login"
                    id="widgets.Layout.login"
                  />
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {/* Sidebar Navigation */}
          <div className="w-64 shrink-0">
            <nav className="space-y-1">
              {computedNavigation.map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    className={clsx(
                      'group flex w-full items-center border-l-4 px-3 py-2 text-sm font-medium transition-colors duration-200',
                      isActive
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    )}
                    key={item.path}
                    to={item.path}
                  >
                    <span className="mr-3 shrink-0 text-lg">{item.icon}</span>

                    <span>
                      <FormattedMessage {...item.message} />
                    </span>
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

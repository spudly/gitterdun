import {clsx} from 'clsx';
import type {FC} from 'react';
import {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {FormattedMessage} from 'react-intl';
import {CloseIcon} from './icons/CloseIcon.js';
import {Link} from 'react-router-dom';

type UserMenuDrawerProps = {
  readonly open: boolean;
  readonly username: string | null | undefined;
  readonly onClose: () => void;
  readonly onLogout: () => void;
};

export const UserMenuDrawer: FC<UserMenuDrawerProps> = ({
  open,
  username,
  onClose,
  onLogout,
}) => {
  const [visible, setVisible] = useState(false);
  const isClosingRef = useRef(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      return () => {
        setVisible(false);
      };
    }
    return () => {};
  }, [open]);

  const handleClose = () => {
    isClosingRef.current = true;
    setVisible(false);
  };

  const handleTransitionEnd = () => {
    if (isClosingRef.current) {
      isClosingRef.current = false;
      onClose();
    }
  };

  if (!open) {
    return null;
  }

  const dialog = (
    <dialog aria-label="User Menu" className="contents open:not-sr-only" open>
      <div className="fixed inset-0 z-50" role="none">
        <button
          aria-label="Close"
          className={clsx(
            'absolute inset-0 z-10 bg-black/50 transition-opacity duration-300',
            {'opacity-0': !visible},
          )}
          onClick={handleClose}
          type="button"
        />
        <div
          className={clsx(
            'absolute right-0 top-0 z-20 h-full w-72 bg-white shadow-xl transition-transform duration-300',
            visible ? 'translate-x-0' : 'translate-x-full',
          )}
          data-testid="user-menu-panel"
          onTransitionEnd={handleTransitionEnd}
        >
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="text-base font-semibold">
              <FormattedMessage
                defaultMessage="User Menu"
                id="widgets.UserMenuDrawer.title"
              />
            </h2>
            <button
              aria-label="Close"
              className="rounded p-2 text-gray-500 hover:bg-gray-100"
              onClick={handleClose}
              type="button"
            >
              <CloseIcon size="sm" />
            </button>
          </div>

          <div className="space-y-4 p-4">
            {username != null && username !== '' ? (
              <div>
                <div className="text-sm text-gray-600">
                  <FormattedMessage
                    defaultMessage="Signed in as"
                    id="widgets.UserMenuDrawer.signedInAs"
                  />
                </div>
                <div className="text-base font-medium text-gray-900">
                  {username}
                </div>
              </div>
            ) : null}

            <nav className="space-y-2">
              {username != null && username !== '' ? (
                <>
                  <Link
                    className="block rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={onClose}
                    to="/profile"
                  >
                    <FormattedMessage
                      defaultMessage="Profile"
                      id="widgets.UserMenuDrawer.profile"
                    />
                  </Link>
                  <Link
                    className="block rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={onClose}
                    to="/settings"
                  >
                    <FormattedMessage
                      defaultMessage="Settings"
                      id="widgets.UserMenuDrawer.settings"
                    />
                  </Link>
                  <button
                    className="w-full rounded px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    onClick={onLogout}
                    type="button"
                  >
                    <FormattedMessage
                      defaultMessage="Logout"
                      id="widgets.UserMenuDrawer.logout"
                    />
                  </button>
                </>
              ) : (
                <Link
                  className="block rounded px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50"
                  onClick={onClose}
                  to="/login"
                >
                  <FormattedMessage
                    defaultMessage="Login"
                    id="widgets.UserMenuDrawer.login"
                  />
                </Link>
              )}
            </nav>
          </div>
        </div>
      </div>
    </dialog>
  );

  return createPortal(dialog, document.body);
};

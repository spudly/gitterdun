import type {FC, ReactNode} from 'react';
import {Link} from 'react-router-dom';
import {FormattedMessage} from 'react-intl';
import type {MessageDescriptor} from 'react-intl';
import {clsx} from 'clsx';

type BottomNavItem = {
  readonly message: MessageDescriptor;
  readonly path: string;
  readonly icon?: ReactNode;
};

type BottomNavProps = {
  readonly items: ReadonlyArray<BottomNavItem>;
  readonly currentPath: string;
  readonly ariaLabel: string;
};

export const BottomNav: FC<BottomNavProps> = ({
  items,
  currentPath,
  ariaLabel,
}) => {
  return (
    <nav aria-label={ariaLabel} className="border-t bg-white md:hidden">
      <div className="flex flex-nowrap">
        {items.map(item => {
          const isActive = currentPath === item.path;
          return (
            <div className="flex min-w-0 flex-1" key={item.path}>
              <Link
                className={clsx(
                  'flex w-full min-w-0 flex-col items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium leading-none',
                  isActive
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-gray-900',
                )}
                to={item.path}
              >
                <span className="shrink-0 text-base">{item.icon}</span>
                <span className="max-w-full truncate whitespace-nowrap leading-none">
                  <FormattedMessage {...item.message} />
                </span>
              </Link>
            </div>
          );
        })}
      </div>
    </nav>
  );
};

// no default export to avoid duplicate export warnings

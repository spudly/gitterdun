import type {FC, KeyboardEvent as ReactKeyboardEvent} from 'react';
import {useEffect, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
import {GlobeIcon} from './icons/index.js';
import type {SupportedLocale} from '../i18n/messages/index.js';

type LocaleOption = {value: SupportedLocale; label: string};

const DEFAULT_OPTIONS: Array<LocaleOption> = [
  {value: 'en', label: 'English'},
  {value: 'pirate', label: 'Pirate'},
  {value: 'piglatin', label: 'Pig Latin'},
  {value: 'fr', label: 'Français'},
  {value: 'deseret', label: '𐐔𐐯𐐝𐐯𐐡𐐯𐐻'},
];

type LocaleSelectorProps = {
  readonly value: SupportedLocale;
  readonly onChange: (next: SupportedLocale) => void;
  readonly label?: string;
  readonly options?: Array<LocaleOption>;
};

export const LocaleSelector: FC<LocaleSelectorProps> = ({
  value,
  onChange,
  label,
  options = DEFAULT_OPTIONS,
}) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const ariaLabel =
    label
    ?? intl.formatMessage({
      defaultMessage: 'Language',
      id: 'widgets.Layout.language',
    });

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!open) {
        return;
      }
      const {target} = event;
      if (
        target instanceof Node
        && menuRef.current
        && !menuRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [open]);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={ariaLabel}
        className="rounded px-2 py-1 text-sm"
        onClick={() => {
          setOpen(prev => !prev);
        }}
        onKeyDown={handleKeyDown}
        type="button"
      >
        <span aria-hidden>
          <GlobeIcon size="sm" />
        </span>
      </button>

      {open ? (
        <div
          className="absolute right-0 top-full z-10 w-44 rounded border bg-white shadow"
          role="menu"
        >
          <ul>
            {options.map(option => {
              const isSelected = option.value === value;
              return (
                <li key={option.value}>
                  <button
                    aria-checked={isSelected}
                    className={`flex w-full items-center px-3 py-2 text-left text-sm hover:bg-gray-50${
                      isSelected ? 'font-semibold text-indigo-600' : ''
                    }`}
                    onClick={() => {
                      setOpen(false);
                      onChange(option.value);
                    }}
                    role="menuitemradio"
                    type="button"
                  >
                    {option.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

import type {ChangeEvent, FC} from 'react';
import {useEffect, useMemo, useRef, useState} from 'react';
import {clsx} from 'clsx';

type TypeaheadInputProps = {
  readonly id?: string;
  readonly value: string;
  readonly options: ReadonlyArray<string>;
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly error?: string | null;
  readonly onChange?: (value: string) => void;
};

export const TypeaheadInput: FC<TypeaheadInputProps> = ({
  id,
  value,
  options,
  placeholder,
  disabled = false,
  error,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClick = (evt: MouseEvent) => {
      if (
        containerRef.current
        && !containerRef.current.contains(evt.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (search === '') {
      // Limit the initial list to avoid giant popover
      return options.slice(0, 20);
    }
    return options
      .filter(option => option.toLowerCase().includes(search))
      .slice(0, 50);
  }, [options, query]);

  const baseInput =
    'w-full border rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500';
  const hasError = error !== undefined && error !== null && error !== '';
  const inputCls = clsx(
    baseInput,
    hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300',
  );

  return (
    <div ref={containerRef} className="relative">
      <input
        id={id}
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={id ? `${id}-listbox` : undefined}
        className={inputCls}
        disabled={disabled}
        onChange={(evt: ChangeEvent<HTMLInputElement>) => {
          const next = evt.target.value;
          setQuery(next);
          setIsOpen(true);
          onChange?.(next);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        role="combobox"
        type="text"
        value={query}
      />

      {isOpen && filtered.length > 0 ? (
        <ul
          id={id ? `${id}-listbox` : undefined}
          className="absolute z-10 max-h-60 w-full overflow-auto rounded border border-gray-200 bg-white pt-1 shadow"
        >
          {filtered.map(opt => (
            <li key={opt}>
              <button
                className={clsx(
                  'w-full px-3 py-2 text-left hover:bg-gray-100',
                  opt === value ? 'bg-gray-100' : '',
                )}
                onMouseDown={evt => {
                  evt.preventDefault();
                  setQuery(opt);
                  setIsOpen(false);
                  onChange?.(opt);
                }}
                type="button"
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {hasError ? (
        <div className="pt-1 text-xs text-red-600">{error}</div>
      ) : null}
    </div>
  );
};

import type {FC} from 'react';
import {FormattedMessage} from 'react-intl';
import {GearIcon, FlameIcon} from '../widgets/icons/index.js';

type Props = {
  readonly avatar: string;
  readonly onChoose: (value: string) => void;
  readonly onUpload: (file: File) => void;
  readonly options: ReadonlyArray<string>;
};

export const ProfileAvatarPicker: FC<Props> = ({
  avatar,
  onChoose,
  onUpload,
  options,
}) => {
  return (
    <div className="grid gap-2">
      <span className="text-sm">
        <span className="inline-flex items-center gap-2">
          <FormattedMessage defaultMessage="Avatar" id="pages.Profile.avatar" />
          <FlameIcon size="sm" />
        </span>
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map(icon => (
          <button
            className={
              icon === avatar
                ? 'rounded border-2 border-indigo-600 px-2 py-1'
                : 'rounded border px-2 py-1'
            }
            key={icon}
            onClick={() => {
              onChoose(icon);
            }}
            type="button"
          >
            <span aria-hidden>{icon}</span>
          </button>
        ))}
      </div>
      <div className="grid gap-1">
        <label className="text-sm" htmlFor="avatar-upload">
          <span className="inline-flex items-center gap-2">
            <FormattedMessage
              defaultMessage="Upload photo"
              id="pages.Profile.upload"
            />
            <GearIcon size="sm" />
          </span>
          <input
            accept="image/*"
            id="avatar-upload"
            onChange={event => {
              const file = event.target.files?.[0];
              if (file) {
                onUpload(file);
              }
            }}
            type="file"
          />
        </label>
      </div>
    </div>
  );
};

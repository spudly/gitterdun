import type {FC} from 'react';
import {IconButton} from '../IconButton.js';
import {CheckIcon, XIcon, TrashIcon, SettingsIcon} from './IconButtonIcons.js';

export const VariantsExample: FC = () => {
  return (
    <div className="flex flex-wrap gap-4">
      <IconButton icon={CheckIcon} label="Primary action" variant="primary" />
      <IconButton icon={XIcon} label="Secondary action" variant="secondary" />
      <IconButton icon={TrashIcon} label="Delete action" variant="danger" />
      <IconButton icon={SettingsIcon} label="Settings action" variant="ghost" />
    </div>
  );
};

export const SizesExample: FC = () => {
  return (
    <div className="flex flex-wrap gap-4">
      <IconButton icon={CheckIcon} label="Small button" size="sm" />
      <IconButton icon={CheckIcon} label="Medium button" size="md" />
      <IconButton icon={CheckIcon} label="Large button" size="lg" />
    </div>
  );
};

export const StatesExample: FC = () => {
  return (
    <div className="flex flex-wrap gap-4">
      <IconButton icon={CheckIcon} label="Normal state" />
      <IconButton disabled icon={CheckIcon} label="Disabled state" />
    </div>
  );
};

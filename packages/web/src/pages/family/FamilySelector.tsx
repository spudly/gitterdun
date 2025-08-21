import type {FC} from 'react';
import {SelectInput} from '../../widgets/SelectInput.js';
import {Button} from '../../widgets/Button.js';
import {TextInput} from '../../widgets/TextInput.js';
import {Toolbar} from '../../widgets/Toolbar.js';
import {Stack} from '../../widgets/Stack.js';
import {defineMessages, useIntl} from 'react-intl';

type Family = {id: number; name: string};

type FamilySelectorProps = {
  readonly families: Array<Family>;
  readonly selectedFamilyId: number | null;
  readonly newFamilyName: string;
  readonly onFamilySelect: (familyId: number | null) => void;
  readonly onNewFamilyNameChange: (name: string) => void;
  readonly onCreateFamily: () => void;
};

export const FamilySelector: FC<FamilySelectorProps> = ({
  families,
  selectedFamilyId,
  newFamilyName,
  onFamilySelect,
  onNewFamilyNameChange,
  onCreateFamily,
}) => {
  const intl = useIntl();
  const messages = defineMessages({
    chooseFamily: {
      defaultMessage: 'Choose a family',
      id: 'pages.family.FamilySelector.choose-a-family',
    },
    newFamilyPlaceholder: {
      defaultMessage: 'New family name',
      id: 'pages.family.FamilySelector.new-family-name',
    },
    create: {
      defaultMessage: 'Create',
      id: 'pages.family.FamilySelector.create',
    },
  });
  return (
    <Stack gap="md">
      <SelectInput
        onChange={val => {
          const parsed = Number(val);
          if (Number.isFinite(parsed)) {
            onFamilySelect(parsed);
          } else {
            onFamilySelect(null);
          }
        }}
        value={selectedFamilyId?.toString() ?? ''}
      >
        <option value="">{intl.formatMessage(messages.chooseFamily)}</option>
        {families.map(family => (
          <option key={family.id} value={family.id}>
            {family.name}
          </option>
        ))}
      </SelectInput>

      <Toolbar>
        <TextInput
          onChange={onNewFamilyNameChange}
          placeholder={intl.formatMessage(messages.newFamilyPlaceholder)}
          value={newFamilyName}
        />
        <Button
          onClick={() => {
            if (newFamilyName.trim() === '') {
              return;
            }
            onCreateFamily();
          }}
          type="button"
        >
          {intl.formatMessage(messages.create)}
        </Button>
      </Toolbar>
    </Stack>
  );
};

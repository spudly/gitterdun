import type {FC} from 'react';
import {SelectInput} from '../../widgets/SelectInput.js';
import {Button} from '../../widgets/Button.js';
import {TextInput} from '../../widgets/TextInput.js';
import {Toolbar} from '../../widgets/Toolbar.js';
import {Stack} from '../../widgets/Stack.js';

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
        <option value="">Choose a family</option>
        {families.map(family => (
          <option key={family.id} value={family.id}>
            {family.name}
          </option>
        ))}
      </SelectInput>

      <Toolbar>
        <TextInput
          onChange={onNewFamilyNameChange}
          placeholder="New family name"
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
          Create
        </Button>
      </Toolbar>
    </Stack>
  );
};

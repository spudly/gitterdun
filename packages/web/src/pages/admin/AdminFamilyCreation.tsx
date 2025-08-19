import type {FC} from 'react';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {familiesApi} from '../../lib/api.js';
import {Button} from '../../widgets/Button.js';
import {TextInput} from '../../widgets/TextInput.js';
import {Toolbar} from '../../widgets/Toolbar.js';
import {useToast} from '../../widgets/ToastProvider.js';

type AdminFamilyCreationProps = {
  readonly onMessageChange: (
    message: string | null,
    type: 'success' | 'error' | null,
  ) => void;
};

export const AdminFamilyCreation: FC<AdminFamilyCreationProps> = ({
  onMessageChange,
}) => {
  const [familyName, setFamilyName] = useState('');
  const navigate = useNavigate();
  const {safeAsync} = useToast();

  const handleSuccess = () => {
    onMessageChange('Family created. Redirecting...', 'success');
    setFamilyName('');
    setTimeout(() => {
      navigate('/family');
    }, 1200);
  };

  const handleCreateFamily = async () => {
    if (familyName.trim() === '') {
      return;
    }
    try {
      onMessageChange(null, null);
      const res = await familiesApi.create({name: familyName.trim()});
      if (res.success) {
        handleSuccess();
      } else {
        onMessageChange(res.error ?? 'Failed to create family', 'error');
      }
    } catch (_e) {
      onMessageChange('Failed to create family', 'error');
    }
  };

  return (
    <Toolbar>
      <TextInput
        onChange={value => {
          setFamilyName(value);
        }}
        placeholder="Family name"
        value={familyName}
      />

      <Button
        onClick={safeAsync(
          handleCreateFamily,
          'Could not create family. Please try again.',
        )}
        type="button"
      >
        Create Family
      </Button>
    </Toolbar>
  );
};

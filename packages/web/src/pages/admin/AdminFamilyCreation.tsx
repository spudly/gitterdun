import type {FC} from 'react';
import {useState} from 'react';
import {defineMessages, useIntl} from 'react-intl';
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
  const intl = useIntl();

  const messages = defineMessages({
    placeholder: {
      defaultMessage: 'Family name',
      id: 'pages.admin.AdminFamilyCreation.family-name',
    },
    createFamily: {
      defaultMessage: 'Create Family',
      id: 'pages.admin.AdminFamilyCreation.create-family',
    },
    success: {
      defaultMessage: 'Family created. Redirecting...',
      id: 'pages.admin.AdminFamilyCreation.family-created-redirecting',
    },
    error: {
      defaultMessage: 'Failed to create family',
      id: 'pages.admin.AdminFamilyCreation.failed-to-create-family',
    },
    toastError: {
      defaultMessage: 'Could not create family. Please try again.',
      id: 'pages.admin.AdminFamilyCreation.could-not-create-family-please',
    },
  });

  const handleSuccess = () => {
    onMessageChange(intl.formatMessage(messages.success), 'success');
    setFamilyName('');
    setTimeout(() => {
      safeAsync(async () => {
        await navigate('/family');
      }, 'Failed to redirect')();
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
        onMessageChange(
          res.error ?? intl.formatMessage(messages.error),
          'error',
        );
      }
    } catch (_e) {
      onMessageChange(intl.formatMessage(messages.error), 'error');
    }
  };

  return (
    <Toolbar>
      <TextInput
        onChange={value => {
          setFamilyName(value);
        }}
        placeholder={intl.formatMessage(messages.placeholder)}
        value={familyName}
      />

      <Button
        onClick={safeAsync(
          handleCreateFamily,
          intl.formatMessage(messages.toastError),
        )}
        type="button"
      >
        {intl.formatMessage(messages.createFamily)}
      </Button>
    </Toolbar>
  );
};

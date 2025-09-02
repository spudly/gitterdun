import type {FC} from 'react';
import {useEffect, useRef, useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {usersApi} from '../lib/api.js';
import {PageContainer} from '../widgets/PageContainer.js';
import {PageHeader} from '../widgets/PageHeader.js';
import {Section} from '../widgets/Section.js';
import {useToast} from '../widgets/ToastProvider.js';
import {ProfileAvatarPicker} from './ProfileAvatarPicker.js';
import {useUser} from '../hooks/useUser.js';

const DEFAULT_AVATARS = ['😀', '🦄', '🐱', '🐶', '🐼', '🐧', '🐸', '🦊'];

const Profile: FC = () => {
  const intl = useIntl();
  const {safeAsync} = useToast();
  const {user: me, isLoading, error} = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState<string>('');
  const userEditedNameRef = useRef(false);

  useEffect(() => {
    if (!me) {
      return;
    }
    if (!name && me.display_name != null) {
      setName(me.display_name ?? me.username);
    }
    if (!email && me.email != null) {
      setEmail(me.email);
    }
    if (!avatar && me.avatar_url != null) {
      setAvatar(me.avatar_url);
    }
  }, [avatar, email, me, name]);

  const onUpload = safeAsync(
    async (file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(typeof reader.result === 'string' ? reader.result : '');
      };
      reader.readAsDataURL(file);
    },
    intl.formatMessage({
      defaultMessage: 'Unable to upload avatar',
      id: 'pages.Profile.upload-error',
    }),
  );

  const onSave = () => {
    safeAsync(
      async () => {
        await usersApi.updateProfile({
          display_name: name,
          avatar_url: avatar === '' ? null : avatar,
          email,
        });
      },
      intl.formatMessage({
        defaultMessage: 'Unable to save profile',
        id: 'pages.Profile.save-error',
      }),
    )();
  };

  const onDelete = () => {
    safeAsync(
      async () => {
        await usersApi.deleteMe();
      },
      intl.formatMessage({
        defaultMessage: 'Unable to delete account',
        id: 'pages.Profile.delete-error',
      }),
    )();
  };

  if (isLoading || error) {
    return null; // TODO: loading spinner? error message? suspense maybe?
  }

  return (
    <PageContainer>
      <PageHeader
        title={intl.formatMessage({
          defaultMessage: 'Profile',
          id: 'pages.Profile.title',
        })}
      />

      <Section
        header={intl.formatMessage({
          defaultMessage: 'Edit Profile',
          id: 'pages.Profile.header',
        })}
      >
        <div className="grid gap-4">
          <label className="grid gap-1" htmlFor="profile-name">
            <span className="text-sm">
              <FormattedMessage defaultMessage="Name" id="pages.Profile.name" />
            </span>
            <input
              aria-label={intl.formatMessage({
                defaultMessage: 'Name',
                id: 'pages.Profile.name',
              })}
              className="rounded border px-2 py-1"
              id="profile-name"
              onChange={event => {
                userEditedNameRef.current = true;
                setName(event.target.value);
              }}
              onFocus={() => {
                userEditedNameRef.current = true;
              }}
              type="text"
              value={name}
            />
          </label>

          <label className="grid gap-1" htmlFor="profile-email">
            <span className="text-sm">
              <FormattedMessage
                defaultMessage="Email"
                id="pages.Profile.email"
              />
            </span>
            <input
              aria-label={intl.formatMessage({
                defaultMessage: 'Email',
                id: 'pages.Profile.email',
              })}
              className="rounded border px-2 py-1"
              id="profile-email"
              onChange={event => {
                setEmail(event.target.value);
              }}
              type="email"
              value={email}
            />
          </label>

          <ProfileAvatarPicker
            avatar={avatar}
            onChoose={val => {
              setAvatar(val);
            }}
            onUpload={onUpload}
            options={DEFAULT_AVATARS}
          />

          <div className="flex gap-2 pt-2">
            <button
              className="rounded bg-indigo-600 px-3 py-1 text-white"
              onClick={() => {
                onSave();
              }}
              type="button"
            >
              <FormattedMessage defaultMessage="Save" id="pages.Profile.save" />
            </button>
            <button
              className="rounded border border-red-600 px-3 py-1 text-red-600"
              onClick={() => {
                onDelete();
              }}
              type="button"
            >
              <FormattedMessage
                defaultMessage="Delete Account"
                id="pages.Profile.delete"
              />
            </button>
          </div>
        </div>
      </Section>
    </PageContainer>
  );
};

export default Profile;

import type {FC} from 'react';
import {useEffect, useRef, useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {usersApi} from '../lib/api.js';
import {PageContainer} from '../widgets/PageContainer.js';
import {PageHeader} from '../widgets/PageHeader.js';
import {Section} from '../widgets/Section.js';
import {useToast} from '../widgets/ToastProvider.js';
import {ProfileAvatarPicker} from './ProfileAvatarPicker.js';

const DEFAULT_AVATARS = ['😀', '🦄', '🐱', '🐶', '🐼', '🐧', '🐸', '🦊'];

const Profile: FC = () => {
  const intl = useIntl();
  const {safeAsync} = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState<string>('');
  const initializedRef = useRef(false);
  const userEditedNameRef = useRef(false);
  const [namePlaceholder, setNamePlaceholder] = useState('');

  useEffect(() => {
    (async () => {
      const me = await usersApi.getMe();
      const {success, data} = me;
      if (!success || data == null) {
        return;
      }
      if (initializedRef.current) {
        return;
      }
      // use `data` from destructuring above
      // Preload as placeholder so we never clobber user input
      if (namePlaceholder === '') {
        const {display_name: displayName, username} = data;
        setNamePlaceholder(displayName ?? username);
      }
      if (email === '') {
        const serverEmail =
          (data as {email: string | null | undefined}).email ?? '';
        setEmail(serverEmail);
      }
      if (avatar === '') {
        const avatarUrl = (data as {avatar_url?: string | null}).avatar_url;
        setAvatar(typeof avatarUrl === 'string' ? avatarUrl : '');
      }
      initializedRef.current = true;
    })();
    // run only once on mount (hydrate from server)
  }, []);

  const onUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(typeof reader.result === 'string' ? reader.result : '');
    };
    reader.readAsDataURL(file);
  };

  const onSave = safeAsync(
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
  );

  const onDelete = safeAsync(
    async () => {
      await usersApi.deleteMe();
    },
    intl.formatMessage({
      defaultMessage: 'Unable to delete account',
      id: 'pages.Profile.delete-error',
    }),
  );

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
              id="profile-name"
              aria-label={intl.formatMessage({
                defaultMessage: 'Name',
                id: 'pages.Profile.name',
              })}
              className="rounded border px-2 py-1"
              type="text"
              value={name}
              placeholder={namePlaceholder}
              onFocus={() => {
                userEditedNameRef.current = true;
              }}
              onChange={event => {
                userEditedNameRef.current = true;
                setName(event.target.value);
              }}
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
              id="profile-email"
              aria-label={intl.formatMessage({
                defaultMessage: 'Email',
                id: 'pages.Profile.email',
              })}
              className="rounded border px-2 py-1"
              type="email"
              value={email}
              onChange={event => {
                setEmail(event.target.value);
              }}
            />
          </label>

          <ProfileAvatarPicker
            avatar={avatar}
            onChoose={setAvatar}
            onUpload={onUpload}
            options={DEFAULT_AVATARS}
          />

          <div className="flex gap-2 pt-2">
            <button
              className="rounded bg-indigo-600 px-3 py-1 text-white"
              type="button"
              onClick={onSave}
            >
              <FormattedMessage defaultMessage="Save" id="pages.Profile.save" />
            </button>
            <button
              className="rounded border border-red-600 px-3 py-1 text-red-600"
              type="button"
              onClick={onDelete}
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

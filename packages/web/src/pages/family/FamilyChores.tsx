import type {FC} from 'react';
import {useQuery} from '@tanstack/react-query';
import {familiesApi, choresApi} from '../../lib/api.js';
import {useUser} from '../../hooks/useUser.js';
import {List} from '../../widgets/List.js';
import {ListRow} from '../../widgets/ListRow.js';
import {TextLink} from '../../widgets/TextLink.js';
import {PageLoading} from '../../widgets/PageLoading.js';
import {FormattedMessage, defineMessages, useIntl} from 'react-intl';
import {ChoreMeta} from '../chores/ChoreMeta.js';

const messages = defineMessages({
  choresHeader: {defaultMessage: 'Chores', id: 'pages.family.chores.header'},
  addChore: {defaultMessage: 'Add Chore', id: 'pages.family.chores.add-chore'},
  loading: {
    defaultMessage: 'Loading chores...',
    id: 'pages.family.chores.loading',
  },
});

export const FamilyChores: FC = () => {
  const {user} = useUser();
  const intl = useIntl();
  const {data: myFamily} = useQuery({
    queryKey: ['family', 'mine', user?.id],
    queryFn: async () => familiesApi.myFamily(),
    enabled: Boolean(user),
    staleTime: 60_000,
  });
  const selectedFamilyId = ((): number | null => {
    const fam = myFamily?.data;
    const candidate =
      fam && typeof (fam as {id?: unknown}).id === 'number'
        ? (fam as {id: number}).id
        : null;
    return candidate;
  })();
  const {data: membersData} = useQuery({
    queryKey: ['family', selectedFamilyId, 'members'],
    queryFn: async () => {
      if (selectedFamilyId == null) {
        return {success: true, data: []} as const;
      }
      return familiesApi.listMembers(selectedFamilyId);
    },
    enabled: selectedFamilyId != null,
    staleTime: 30_000,
  });
  const isFamilyParent = ((): boolean => {
    if (!user) {
      return false;
    }
    const fam = myFamily?.data as {owner_id?: unknown} | null | undefined;
    if (fam && typeof fam.owner_id === 'number' && fam.owner_id === user.id) {
      return true;
    }
    const members = membersData?.data as
      | ReadonlyArray<{user_id: number; role: string}>
      | undefined;
    if (!members) {
      return false;
    }
    return members.some(
      member => member.user_id === user.id && member.role === 'parent',
    );
  })();

  const {data: choresResponse, isLoading} = useQuery({
    queryKey: ['chores', user?.id, 'family'],
    queryFn: async () =>
      choresApi.getAll({
        user_id: isFamilyParent ? undefined : user?.id,
        sort_by: 'start_date',
        order: 'asc',
      }),
    enabled: Boolean(user),
  });

  if (isLoading) {
    return <PageLoading message={intl.formatMessage(messages.loading)} />;
  }

  const chores = choresResponse?.data ?? [];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        {isFamilyParent ? (
          <TextLink to="/family/chores/new">
            <FormattedMessage {...messages.addChore} />
          </TextLink>
        ) : null}
      </div>
      <List>
        {chores.map(chore => (
          <ListRow
            description={chore.description}
            key={chore.id}
            meta={<ChoreMeta chore={chore} />}
            title={chore.title}
          />
        ))}
      </List>
    </div>
  );
};

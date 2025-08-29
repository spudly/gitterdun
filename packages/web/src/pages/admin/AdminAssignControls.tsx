import type {FC} from 'react';
import {useState} from 'react';
import {useMutation, useQuery} from '@tanstack/react-query';
import {FormattedMessage, useIntl} from 'react-intl';
import {familiesApi} from '../../lib/familiesApi.js';
import {choresApi} from '../../lib/api.js';
// using native select here to satisfy a11y lint rules
import {Button} from '../../widgets/Button.js';

type AdminAssignControlsProps = {
  readonly choreId: number;
  readonly onAssigned: (username: string) => void;
};

export const AdminAssignControls: FC<AdminAssignControlsProps> = ({
  choreId,
  onAssigned,
}) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState<string>('');

  const myFamilyQuery = useQuery({
    queryKey: ['family', 'mine'],
    queryFn: async () => familiesApi.myFamily(),
  });
  const familyId = (myFamilyQuery.data?.data as {id?: unknown} | null)?.id;
  const membersQuery = useQuery({
    queryKey: ['family', familyId, 'members'],
    queryFn: async () =>
      typeof familyId === 'number'
        ? familiesApi.listMembers(familyId)
        : {success: true as const, data: [] as Array<unknown>},
    enabled: typeof familyId === 'number',
  });

  const assignMutation = useMutation({
    mutationFn: async (username: string) => {
      const members = (membersQuery.data?.data ?? []) as Array<{
        user_id: number;
        username: string;
        role: string;
      }>;
      const entry = members.find(member => member.username === username);
      if (entry) {
        await choresApi.assign(choreId, {userId: entry.user_id});
      }
    },
    onSuccess: async (_data, variables) => {
      onAssigned(variables);
      setIsOpen(false);
      setSelectedUsername('');
    },
  });

  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(open => !open);
        }}
        size="sm"
        variant="secondary"
      >
        <FormattedMessage
          defaultMessage="Assign"
          id="pages.admin.AdminChoresManagement.assign"
        />
      </Button>

      {isOpen ? (
        <>
          <label>
            {intl.formatMessage({
              defaultMessage: 'Assignee',
              id: 'pages.admin.AdminChoresManagement.assignee',
            })}
            <select
              onChange={event => {
                setSelectedUsername(event.target.value);
              }}
              value={selectedUsername}
            >
              <option value="" />
              {((membersQuery.data?.data ?? []) as Array<{
                user_id: number;
                username: string;
                role: string;
              }>)
                .filter(member => member.role === 'child')
                .map(member => (
                  <option key={member.user_id} value={member.username}>
                    {member.username}
                  </option>
                ))}
            </select>
          </label>
          <Button
            onClick={() => {
              if (selectedUsername !== '') {
                assignMutation.mutate(selectedUsername);
              }
            }}
            size="sm"
            variant="primary"
          >
            <FormattedMessage
              defaultMessage="Assign Chore"
              id="pages.admin.AdminChoresManagement.assign-chore"
            />
          </Button>
        </>
      ) : null}
    </>
  );
};


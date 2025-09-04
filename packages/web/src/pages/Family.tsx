import type {FC} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useEffect, useRef, useState} from 'react';
import {familiesApi} from '../lib/api.js';
import {PageContainer} from '../widgets/PageContainer.js';
import {FormSection} from '../widgets/FormSection.js';
import {GridContainer} from '../widgets/GridContainer.js';
import {Stack} from '../widgets/Stack.js';
import {TextInput} from '../widgets/TextInput.js';
import {Button} from '../widgets/Button.js';
import {useUser} from '../hooks/useUser';
import {FamilyMembers} from './family/FamilyMembers.js';
import {FamilyChores} from './family/FamilyChores.js';
// forms now rendered inside FamilyMembers
import {useFamilySetup} from './family/useFamilySetup.js';
import {TypeaheadInput} from '../widgets/TypeaheadInput.js';
import {FormField} from '../widgets/FormField.js';
import {useToast} from '../widgets/ToastProvider.js';

// moved to ./family/useFamilySetup

const Family: FC = () => {
  const intl = useIntl();
  const {safeAsync} = useToast();
  const {user} = useUser();
  const initialUserRef = useRef(user);
  const showLogin = initialUserRef.current == null;
  // removed unused showLoginRef helper
  // no messages used locally
  const {
    selectedFamilyId,
    newFamilyName,
    setNewFamilyName,
    createFamilyMutation,
    createChildMutation,
    inviteMutation,
    family,
    membersQuery,
    myFamilyQuery,
    tzQuery,
  } = useFamilySetup(user ?? null);

  const [selectedTimezone, setSelectedTimezone] = useState<string>('UTC');

  useEffect(() => {
    const familyTz = family?.timezone;
    if (familyTz != null && familyTz !== '') {
      setSelectedTimezone(familyTz);
      return;
    }
    try {
      const detected = new Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (typeof detected === 'string' && detected !== '') {
        setSelectedTimezone(detected);
      }
    } catch {
      // keep default
    }
  }, [family]);

  // local add-member toggle moved into FamilyMembers

  // user is guaranteed here

  return showLogin ? (
    <div>
      <FormattedMessage
        defaultMessage="Please log in to manage your family."
        id="pages.Family.please-log-in-to-manage-your-f"
      />
    </div>
  ) : (
    <PageContainer>
      <FormSection
        title={intl.formatMessage({
          defaultMessage: 'Your Family',
          id: 'pages.Family.your-family',
        })}
      >
        {family == null ? (
          <Stack gap="md">
            <div>
              <TextInput
                onChange={val => {
                  setNewFamilyName(val);
                }}
                placeholder={intl.formatMessage({
                  defaultMessage: 'New family name',
                  id: 'pages.family.FamilySelector.new-family-name',
                })}
                value={newFamilyName}
              />
            </div>
            <Button
              onClick={() => {
                if (newFamilyName.trim() === '') {
                  return;
                }
                createFamilyMutation.mutate({name: newFamilyName});
                setNewFamilyName('');
              }}
            >
              {intl.formatMessage({
                defaultMessage: 'Create',
                id: 'pages.family.FamilySelector.create',
              })}
            </Button>
          </Stack>
        ) : null}
        {family != null ? (
          <Stack gap="md">
            <div>
              <FormField
                htmlFor="family-timezone"
                label={intl.formatMessage({
                  defaultMessage: 'Timezone',
                  id: 'pages.Family.timezone',
                })}
              >
                <TypeaheadInput
                  id="family-timezone"
                  onChange={val => {
                    setSelectedTimezone(val);
                    const list = (tzQuery.data?.data ?? [
                      'UTC',
                    ]) as ReadonlyArray<string>;
                    if (!list.includes(val)) {
                      return; // don't persist until a valid option is selected
                    }
                    if (selectedFamilyId != null) {
                      safeAsync(
                        async () => {
                          await familiesApi.updateTimezone(selectedFamilyId, {
                            timezone: val,
                          });
                          await myFamilyQuery.refetch();
                        },
                        intl.formatMessage({
                          defaultMessage: 'Failed to update timezone',
                          id: 'pages.Family.update-timezone-failed',
                        }),
                      )();
                    }
                  }}
                  options={tzQuery.data?.data ?? ['UTC']}
                  placeholder={intl.formatMessage({
                    defaultMessage: 'Search timezone',
                    id: 'pages.Family.search-timezone',
                  })}
                  value={selectedTimezone}
                />
              </FormField>
            </div>
          </Stack>
        ) : null}
      </FormSection>

      {selectedFamilyId !== null ? (
        <GridContainer cols={2} gap="lg">
          <FormSection
            title={intl.formatMessage({
              defaultMessage: 'Members',
              id: 'pages.Family.members',
            })}
          >
            <FamilyMembers
              handleCreateChild={createChildMutation.mutate}
              handleInviteMember={inviteMutation.mutate}
              membersData={membersQuery.data?.data}
              selectedFamilyId={selectedFamilyId}
            />
          </FormSection>
          <FormSection
            title={intl.formatMessage({
              defaultMessage: 'Chores',
              id: 'pages.Family.chores',
            })}
          >
            <FamilyChores />
          </FormSection>
        </GridContainer>
      ) : null}
    </PageContainer>
  );
};

export default Family;

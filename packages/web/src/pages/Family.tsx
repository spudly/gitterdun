import {FC, useEffect, useMemo, useState} from 'react';
import {useQuery, useMutation} from '@tanstack/react-query';
import {familiesApi, invitationsApi} from '../lib/api.js';
import {useUser} from '../hooks/useUser.js';

const Family: FC = () => {
  const {user} = useUser();
  const [selectedFamilyId, setSelectedFamilyId] = useState<number | null>(null);
  const [newFamilyName, setNewFamilyName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'parent' | 'child'>('parent');
  const [childUsername, setChildUsername] = useState('');
  const [childEmail, setChildEmail] = useState('');
  const [childPassword, setChildPassword] = useState('');

  const myFamiliesQuery = useQuery({
    queryKey: ['families', 'mine'],
    queryFn: () => familiesApi.myFamilies(),
    enabled: !!user,
  });

  useEffect(() => {
    const first = myFamiliesQuery.data?.data?.[0];
    if (first && !selectedFamilyId) {
      setSelectedFamilyId(first.id);
    }
  }, [myFamiliesQuery.data, selectedFamilyId]);

  const membersQuery = useQuery({
    queryKey: ['families', selectedFamilyId, 'members'],
    queryFn: () => familiesApi.listMembers(selectedFamilyId as number),
    enabled: !!selectedFamilyId,
  });

  const createFamilyMutation = useMutation({
    mutationFn: familiesApi.create,
    onSuccess: () => myFamiliesQuery.refetch(),
  });

  const createChildMutation = useMutation({
    mutationFn: (p: {
      familyId: number;
      username: string;
      email: string;
      password: string;
    }) =>
      familiesApi.createChild(p.familyId, {
        username: p.username,
        email: p.email,
        password: p.password,
      }),
    onSuccess: () => membersQuery.refetch(),
  });

  const inviteMutation = useMutation({
    mutationFn: (p: {
      familyId: number;
      email: string;
      role: 'parent' | 'child';
    }) => invitationsApi.create(p.familyId, {email: p.email, role: p.role}),
  });

  if (!user) {
    return <div>Please log in to manage your family.</div>;
  }

  const familyOptions = myFamiliesQuery.data?.data ?? [];

  return (
    <div className="space-y-8">
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-lg font-semibold mb-3">Your Families</h2>
        <div className="flex gap-2 items-center">
          <select
            className="border px-2 py-1 rounded"
            value={selectedFamilyId ?? ''}
            onChange={e => setSelectedFamilyId(Number(e.target.value))}
          >
            <option value="" disabled>
              Select a family
            </option>
            {familyOptions.map(f => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
          <input
            placeholder="New family name"
            className="border px-2 py-1 rounded flex-1"
            value={newFamilyName}
            onChange={e => setNewFamilyName(e.target.value)}
          />
          <button
            className="bg-indigo-600 text-white px-3 py-1 rounded"
            onClick={() => {
              if (!newFamilyName.trim()) {
                return;
              }
              createFamilyMutation.mutate({name: newFamilyName.trim()});
              setNewFamilyName('');
            }}
          >
            Create
          </button>
        </div>
      </div>

      {selectedFamilyId && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold mb-2">Members</h3>
            <ul className="space-y-1">
              {(membersQuery.data?.data ?? []).map(m => (
                <li key={`${m.user_id}`} className="flex justify-between">
                  <span>
                    {m.username} ({m.email})
                  </span>
                  <span className="text-sm text-gray-500">{m.role}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 bg-white rounded shadow space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Create Child Account</h3>
              <div className="space-y-2">
                <input
                  className="border px-2 py-1 rounded w-full"
                  placeholder="Username"
                  value={childUsername}
                  onChange={e => setChildUsername(e.target.value)}
                />
                <input
                  className="border px-2 py-1 rounded w-full"
                  placeholder="Email"
                  type="email"
                  value={childEmail}
                  onChange={e => setChildEmail(e.target.value)}
                />
                <input
                  className="border px-2 py-1 rounded w-full"
                  placeholder="Password"
                  type="password"
                  value={childPassword}
                  onChange={e => setChildPassword(e.target.value)}
                />
                <button
                  className="bg-indigo-600 text-white px-3 py-1 rounded"
                  onClick={() => {
                    if (!childUsername || !childEmail || !childPassword) {
                      return;
                    }
                    createChildMutation.mutate({
                      familyId: selectedFamilyId,
                      username: childUsername,
                      email: childEmail,
                      password: childPassword,
                    });
                    setChildUsername('');
                    setChildEmail('');
                    setChildPassword('');
                  }}
                >
                  Create
                </button>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Invite Member</h3>
              <div className="flex gap-2 items-center">
                <input
                  className="border px-2 py-1 rounded flex-1"
                  placeholder="Email"
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                />
                <select
                  className="border px-2 py-1 rounded"
                  value={inviteRole}
                  onChange={e =>
                    setInviteRole(e.target.value as 'parent' | 'child')
                  }
                >
                  <option value="parent">Parent</option>
                  <option value="child">Child</option>
                </select>
                <button
                  className="bg-indigo-600 text-white px-3 py-1 rounded"
                  onClick={() => {
                    if (!inviteEmail) {
                      return;
                    }
                    inviteMutation.mutate({
                      familyId: selectedFamilyId,
                      email: inviteEmail,
                      role: inviteRole,
                    });
                    setInviteEmail('');
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Family;

import {FC, useState} from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom';
import {invitationsApi} from '../lib/api.js';

const AcceptInvitation: FC = () => {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const emailHint = '';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await invitationsApi.accept({token, username, password});
      if (res.success) {
        setMessage('Invitation accepted. You can now log in.');
        setTimeout(() => navigate('/login'), 1200);
      } else {
        setMessage('Failed to accept');
      }
    } catch (err) {
      setMessage('Failed to accept');
    }
  };

  if (!token) {
    return <div>Missing token.</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">Accept Invitation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            className="mt-1 w-full border rounded px-3 py-2"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        {message && <div className="text-sm text-gray-600">{message}</div>}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded"
        >
          Accept Invitation
        </button>
      </form>
    </div>
  );
};

export default AcceptInvitation;

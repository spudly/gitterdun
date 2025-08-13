import {FC, useState} from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom';
import {useUser} from '../hooks/useUser.js';

const ResetPassword: FC = () => {
  const {resetPassword} = useUser();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const token = params.get('token') || '';
    if (!token) {
      setMessage('Missing token');
      return;
    }
    if (password !== confirm) {
      setMessage('Passwords do not match');
      return;
    }
    try {
      await resetPassword(token, password);
      setMessage('Password reset successful. Redirecting...');
      setTimeout(() => navigate('/login'), 1200);
    } catch (_err) {
      setMessage('Reset failed');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            New Password
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
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            className="mt-1 w-full border rounded px-3 py-2"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            minLength={6}
          />
        </div>
        {message && <div className="text-sm text-gray-600">{message}</div>}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;

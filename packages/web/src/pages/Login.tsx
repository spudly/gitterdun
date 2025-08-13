import {FC, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useUser} from '../hooks/useUser.js';

const Login: FC = () => {
  const {login, isLoggingIn, loginError} = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    try {
      await login(email, password);
      navigate('/');
    } catch (_err) {
      setMessage('Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="email"
          >
            <span>Email</span>
            <input
              id="email"
              type="email"
              className="mt-1 w-full border rounded px-3 py-2"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="password"
          >
            <span>Password</span>
            <input
              id="password"
              type="password"
              className="mt-1 w-full border rounded px-3 py-2"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        {message && (
          <div className="text-sm text-red-600" role="alert">
            {message}
          </div>
        )}
        {loginError && (
          <div className="text-sm text-red-600" role="alert">
            {(loginError as Error).message}
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded disabled:opacity-60"
          disabled={isLoggingIn}
        >
          {isLoggingIn ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="mt-4 flex justify-between text-sm">
        <Link className="text-indigo-600" to="/forgot-password">
          Forgot password?
        </Link>
        <Link className="text-indigo-600" to="/admin">
          Register (Admin)
        </Link>
      </div>
    </div>
  );
};

export default Login;

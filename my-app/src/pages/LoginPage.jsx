import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ login }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:5555/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const { users } = await response.json();
      const user = users.find(user => user.email === email);

      if (!user) {
        setError('Invalid email or password');
        return;
      }

      const validPasswords = {
        'admin@example.com': 'adminpass',
        'teacher@example.com': 'teacherpass',
        'student@example.com': 'studentpass'
      };

      if (password !== validPasswords[email]) {
        setError('Invalid email or password');
        return;
      }

      const mockToken = 'mock-jwt-token';
      localStorage.setItem('access_token', mockToken);

      login(user.role);

      switch (user.role) {
        case 'Admin':
          navigate('/admin');
          break;
        case 'Teacher':
          navigate('/teacher');
          break;
        case 'Student':
          navigate('/student');
          break;
        default:
          setError('Invalid role');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-full max-w-md p-8 m-auto bg-white rounded-lg shadow-xl">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Welcome Back!</h2>
        <p className="text-center text-gray-500 mt-2">Enter your account details below</p>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="relative">
            <label className="sr-only" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Email Address"
              required
            />
          </div>

          <div className="relative">
            <label className="sr-only" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-2 rounded-lg font-bold shadow-md hover:bg-gray-800 transition duration-300"
          >
            Sign In
          </button>
        </form>

        <div className="text-center mt-4">
          <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
        </div>
      </div>

      <div
        className="hidden md:block md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/background-image.jpg')" }}
      />
    </div>
  );
};

export default LoginPage;


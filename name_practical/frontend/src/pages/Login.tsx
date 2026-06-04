import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Car, User, Lock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = (location.state as any)?.from?.pathname || '/customer/dashboard';
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', {
        username,
        password
      });
      const loggedInUser = res.data?.data?.user;
      login(loggedInUser);
      toast.success('Welcome back!');
      if (loggedInUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from, {
          replace: true
        });
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Failed to log in. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex bg-canvas">
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-24 xl:px-32">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/" className="flex items-center gap-2 mb-12 group w-fit">
            <div className="bg-ink text-white p-1.5 rounded-lg group-hover:bg-ink/90 transition-colors">
              <Car size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-ink">
              CarRental
            </span>
          </Link>

          <h2 className="text-3xl font-bold tracking-tight text-ink mb-2">
            Welcome back
          </h2>
          <p className="text-ink-muted mb-8">
            Enter your details to access your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error &&
            <div className="p-3 text-sm text-ink bg-canvas border border-danger/20 rounded-xl">
                {error}
              </div>
            }

            <Input
              label="Username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              leftIcon={<User size={18} />} />
            

            <div>
              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                leftIcon={<Lock size={18} />} />
              
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}>
              
              Sign in
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-ink-muted">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-accent hover:text-accent-hover">Create one</Link>
          </p>

        </div>
      </div>
    </div>);
}

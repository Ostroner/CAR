import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, User, Lock, Mail, Phone, MapPin, FileText } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    full_name: '', national_ID: '', phone: '', email: '', address: '',
    username: '', password: '', gender: 'male', role: 'customer'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const update = (field: string, value: string) => setForm({ ...form, [field]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      const user = res.data?.data?.user;
      login(user);
      toast.success('Account created successfully!');
      navigate(user.role === 'admin' ? '/admin' : '/customer/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-canvas">
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-24 xl:px-32">
        <div className="mx-auto w-full max-w-md">
          <Link to="/login" className="flex items-center gap-2 mb-8 group w-fit">
            <div className="bg-ink text-white p-1.5 rounded-lg group-hover:bg-ink/90 transition-colors">
              <Car size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-ink">CarRental</span>
          </Link>

          <h2 className="text-3xl font-bold tracking-tight text-ink mb-2">Create Account</h2>
          <p className="text-ink-muted mb-8">Fill in your details to get started.</p>

          {error && (
            <div className="p-3 mb-6 text-sm text-ink bg-canvas border border-danger/20 rounded-xl">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <Input label="Full Name" value={form.full_name} onChange={(e) => update('full_name', e.target.value)} required leftIcon={<User size={18} />} />
                <Input label="National ID" value={form.national_ID} onChange={(e) => update('national_ID', e.target.value)} required leftIcon={<FileText size={18} />} />
                <Input label="Phone" type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} leftIcon={<Phone size={18} />} />
                <Input label="Email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} leftIcon={<Mail size={18} />} />
                <Input label="Address" value={form.address} onChange={(e) => update('address', e.target.value)} leftIcon={<MapPin size={18} />} />
                <Button type="button" className="w-full" onClick={() => setStep(2)}>Next: Login Details</Button>
              </>
            )}

            {step === 2 && (
              <>
                <Input label="Username" value={form.username} onChange={(e) => update('username', e.target.value)} required leftIcon={<User size={18} />} />
                <Input label="Password" type="password" value={form.password} onChange={(e) => update('password', e.target.value)} required leftIcon={<Lock size={18} />} />
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Gender</label>
                  <select value={form.gender} onChange={(e) => update('gender', e.target.value)} className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                  <Button type="submit" className="flex-1" isLoading={isLoading}>Create Account</Button>
                </div>
              </>
            )}
          </form>

          <p className="mt-8 text-center text-sm text-ink-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-accent hover:text-accent-hover">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
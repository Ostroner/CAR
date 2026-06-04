import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { api } from '../../api/client';
import toast from 'react-hot-toast';

export function ProfileForm() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [form, setForm] = useState({ full_name: '', national_ID: '', phone: '', email: '', address: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/customers/profile');
        const cust = res.data?.data?.customer;
        setProfile(cust);
        if (cust) {
          setForm({ full_name: cust.full_name, national_ID: cust.national_ID, phone: cust.phone || '', email: cust.email || '', address: cust.address || '' });
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (profile) {
        await api.put(`/customers/${profile.customerId}`, form);
      } else {
        await api.post('/customers', form);
      }
      toast.success('Profile saved!');
      navigate('/customer/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />
      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>{profile ? 'Edit Profile' : 'Complete Profile'}</CardTitle>
            <p className="text-sm text-ink-muted mt-1">Provide your details to start renting cars.</p>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-ink-muted">Loading...</div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Full Name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
                <Input label="National ID" value={form.national_ID} onChange={(e) => setForm({ ...form, national_ID: e.target.value })} required />
                <Input label="Phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                <Button type="submit" className="w-full" isLoading={isSaving}>{profile ? 'Update' : 'Save'} Profile</Button>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

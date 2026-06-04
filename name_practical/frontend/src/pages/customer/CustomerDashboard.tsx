import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Car, CalendarDays, Plus, ArrowRight } from 'lucide-react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
  pending: 'default',
  confirmed: 'success',
  active: 'warning',
  completed: 'success',
  cancelled: 'danger'
};

export function CustomerDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const pRes = await api.get('/customers/profile');
        const cust = pRes.data?.data?.customer;
        setProfile(cust);
        if (cust) {
          const rRes = await api.get(`/reservations/my/${cust.customerId}`);
          setReservations(rRes.data?.data?.reservations ?? []);
        }
      } catch (err) {
        console.error('Failed to load dashboard', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-ink">My Dashboard</h1>
            <p className="text-ink-muted mt-1">Welcome back, {user?.username}!</p>
          </div>
          <Link to="/customer/book">
            <Button><Plus size={18} className="mr-2" />Book a Car</Button>
          </Link>
        </div>

        {!profile && !isLoading && (
          <Card className="mb-8">
            <CardContent className="p-8 text-center">
              <h2 className="text-lg font-semibold text-ink mb-2">Complete Your Profile</h2>
              <p className="text-ink-muted mb-4">Please provide your details to start booking cars.</p>
              <Link to="/customer/profile">
                <Button>Complete Profile</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <h2 className="text-xl font-semibold text-ink mb-4">My Reservations</h2>
        {isLoading ? (
          <div className="space-y-4">
            {[1,2,3].map((_, i) => <LoadingSkeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
        ) : reservations.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Car size={48} className="mx-auto text-ink-subtle mb-4" />
              <h3 className="text-lg font-semibold text-ink mb-2">No reservations yet</h3>
              <p className="text-ink-muted mb-6">Browse our available cars and make your first reservation.</p>
              <Link to="/customer/book"><Button>Browse Cars <ArrowRight size={18} className="ml-2" /></Button></Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reservations.map((r) => (
              <Card key={r.reserveId} hoverable>
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-canvas border border-border flex items-center justify-center">
                      <Car size={24} className="text-ink-subtle" />
                    </div>
                    <div>
                      <p className="font-semibold text-ink">{r.brand} {r.model}</p>
                      <p className="text-sm text-ink-muted">{r.plate_number} &middot; {new Date(r.start_date).toLocaleDateString()} - {new Date(r.end_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge variant={statusColors[r.reservation_status] || 'default'} className="capitalize">{r.reservation_status}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

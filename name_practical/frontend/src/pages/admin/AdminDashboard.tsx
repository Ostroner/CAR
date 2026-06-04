import React, { useEffect, useState } from 'react';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { AdminTopbar } from '../../components/layout/AdminTopbar';
import { StatsCard } from '../../components/shared/StatsCard';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle } from
'../../components/ui/Card';
import { Car, Users, CalendarDays, TrendingUp } from 'lucide-react';
import { api } from '../../api/client';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
export function AdminDashboard() {
  const [stats, setStats] = useState<any>({ vehicles: 0, customers: 0, reservations: 0, active: 0 });
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [vRes, cRes, rRes] = await Promise.all([
          api.get('/vehicles'),
          api.get('/customers'),
          api.get('/reservations')
        ]);
        const vehicles = vRes.data?.data?.vehicles?.length || 0;
        const customers = cRes.data?.data?.customers?.length || 0;
        const reservations = rRes.data?.data?.reservations || [];
        const active = reservations.filter((r: any) => r.reservation_status === 'active' || r.reservation_status === 'confirmed').length;
        setStats({ vehicles, customers, reservations: reservations.length, active });
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);
  return (
    <div className="min-h-screen flex bg-canvas">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-ink">Dashboard Overview</h1>
            <p className="text-ink-muted mt-1">
              Manage your car rental business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {isLoading ?
            Array(4).fill(0).map((_, i) =>
            <LoadingSkeleton key={i} className="h-32 rounded-2xl" />
            ) :
            <>
                <StatsCard title="Total Vehicles" value={stats.vehicles} icon={Car} />
                <StatsCard title="Total Customers" value={stats.customers} icon={Users} />
                <StatsCard title="Total Reservations" value={stats.reservations} icon={CalendarDays} />
                <StatsCard title="Active Rentals" value={stats.active} icon={TrendingUp} />
              </>
            }
          </div>
        </main>
      </div>
    </div>);
}

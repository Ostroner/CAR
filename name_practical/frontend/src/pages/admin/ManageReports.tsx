import React, { useEffect, useState } from 'react';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { AdminTopbar } from '../../components/layout/AdminTopbar';
import { StatsCard } from '../../components/shared/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Car, Users, CalendarDays, TrendingUp, Download, FileText } from 'lucide-react';
import { api } from '../../api/client';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import toast from 'react-hot-toast';

export function ManageReports() {
  const [overview, setOverview] = useState<any>(null);
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [exporting, setExporting] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ovRes, resRes] = await Promise.all([
          api.get('/reports/overview'),
          api.get('/reports/reservations')
        ]);
        setOverview(ovRes.data?.data);
        setReservations(resRes.data?.data?.reservations ?? []);
      } catch (error) {
        console.error('Failed to fetch reports', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExport = async (type: string) => {
    setExporting(type);
    try {
      const res = await api.get(`/reports/export?type=${type}`, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}-report-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} report downloaded`);
    } catch (error) {
      toast.error('Failed to export report');
    } finally {
      setExporting(null);
    }
  };

  const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
    pending: 'default',
    confirmed: 'success',
    active: 'warning',
    completed: 'success',
    cancelled: 'danger'
  };

  return (
    <div className="min-h-screen flex bg-canvas">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-ink">Reports</h1>
              <p className="text-ink-muted mt-1">Overview and analytics for your car rental business.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExport('reservations')} isLoading={exporting === 'reservations'}>
                <Download size={16} className="mr-2" />Reservations
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('customers')} isLoading={exporting === 'customers'}>
                <Download size={16} className="mr-2" />Customers
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('vehicles')} isLoading={exporting === 'vehicles'}>
                <Download size={16} className="mr-2" />Vehicles
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {Array(4).fill(0).map((_, i) => (
                <LoadingSkeleton key={i} className="h-32 rounded-2xl" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard title="Total Vehicles" value={overview?.totals?.vehicles ?? 0} icon={Car} />
                <StatsCard title="Total Customers" value={overview?.totals?.customers ?? 0} icon={Users} />
                <StatsCard title="Total Reservations" value={overview?.totals?.reservations ?? 0} icon={CalendarDays} />
                <StatsCard title="Active Rentals" value={overview?.totals?.activeRentals ?? 0} icon={TrendingUp} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Reservations by Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {overview?.reservationsByStatus?.length > 0 ? (
                        overview.reservationsByStatus.map((item: any) => (
                          <div key={item.reservation_status} className="flex items-center justify-between">
                            <Badge variant={statusColors[item.reservation_status] || 'default'} className="capitalize">{item.reservation_status}</Badge>
                            <span className="text-sm font-semibold text-ink">{item.count}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-ink-muted">No reservations yet.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Vehicles by Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {overview?.vehiclesByStatus?.length > 0 ? (
                        overview.vehiclesByStatus.map((item: any) => (
                          <div key={item.status} className="flex items-center justify-between">
                            <Badge variant={item.status === 'available' ? 'success' : item.status === 'rented' ? 'warning' : 'danger'} className="capitalize">{item.status}</Badge>
                            <span className="text-sm font-semibold text-ink">{item.count}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-ink-muted">No vehicles yet.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" onClick={() => handleExport('reservations')} isLoading={exporting === 'reservations'}>
                      <FileText size={16} className="mr-2" />Export Reservations CSV
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => handleExport('customers')} isLoading={exporting === 'customers'}>
                      <FileText size={16} className="mr-2" />Export Customers CSV
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => handleExport('vehicles')} isLoading={exporting === 'vehicles'}>
                      <FileText size={16} className="mr-2" />Export Vehicles CSV
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Reservations</CardTitle>
                </CardHeader>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-canvas/30">
                        <th className="px-6 py-4 text-xs font-semibold text-ink-muted uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-4 text-xs font-semibold text-ink-muted uppercase tracking-wider">Vehicle</th>
                        <th className="px-6 py-4 text-xs font-semibold text-ink-muted uppercase tracking-wider">Start</th>
                        <th className="px-6 py-4 text-xs font-semibold text-ink-muted uppercase tracking-wider">End</th>
                        <th className="px-6 py-4 text-xs font-semibold text-ink-muted uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-white">
                      {reservations.slice(0, 10).map((r: any) => (
                        <tr key={r.reserveId} className="hover:bg-canvas/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-ink">{r.customer_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-ink">{r.brand} {r.model} ({r.plate_number})</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">{new Date(r.start_date).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">{new Date(r.end_date).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={statusColors[r.reservation_status] || 'default'} className="capitalize">{r.reservation_status}</Badge>
                          </td>
                        </tr>
                      ))}
                      {reservations.length === 0 && (
                        <tr><td colSpan={5} className="px-6 py-12 text-center text-ink-muted">No reservations found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

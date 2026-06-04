import React, { useEffect, useState } from 'react';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { AdminTopbar } from '../../components/layout/AdminTopbar';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Trash2 } from 'lucide-react';
import { api } from '../../api/client';
import toast from 'react-hot-toast';

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
  pending: 'default',
  confirmed: 'success',
  active: 'warning',
  completed: 'success',
  cancelled: 'danger'
};

export function ManageReservations() {
  const [reservations, setReservations] = useState<any[]>([]);

  const loadReservations = async () => {
    const res = await api.get('/reservations');
    setReservations(res.data?.data?.reservations ?? []);
  };
  useEffect(() => { loadReservations(); }, []);

  const updateStatus = async (id: number, status: string) => {
    await api.patch(`/reservations/${id}/status`, { status });
    toast.success(`Reservation ${status}`);
    await loadReservations();
  };

  const deleteReservation = async (id: number) => {
    if (!confirm('Delete this reservation?')) return;
    await api.delete(`/reservations/${id}`);
    toast.success('Reservation deleted');
    await loadReservations();
  };

  return (
    <div className="min-h-screen flex bg-canvas">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-ink">Reservations Management</h1>
              <p className="text-ink-muted mt-1">View and manage all reservations.</p>
            </div>
          </div>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-canvas/30">
                    <th className="px-6 py-4 text-xs font-semibold text-ink-muted uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-xs font-semibold text-ink-muted uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-4 text-xs font-semibold text-ink-muted uppercase tracking-wider">Start</th>
                    <th className="px-6 py-4 text-xs font-semibold text-ink-muted uppercase tracking-wider">End</th>
                    <th className="px-6 py-4 text-xs font-semibold text-ink-muted uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-ink-muted uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-white">
                  {reservations.map((r) =>
                  <tr key={r.reserveId} className="hover:bg-canvas/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-ink">{r.customer_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink">{r.brand} {r.model} ({r.plate_number})</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">{new Date(r.start_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">{new Date(r.end_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={statusColors[r.reservation_status] || 'default'} className="capitalize">{r.reservation_status}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {r.reservation_status === 'pending' && (
                          <>
                            <button onClick={() => updateStatus(r.reserveId, 'confirmed')} className="text-xs px-2 py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 font-medium">Confirm</button>
                            <button onClick={() => updateStatus(r.reserveId, 'cancelled')} className="text-xs px-2 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-medium">Cancel</button>
                          </>
                        )}
                        {r.reservation_status === 'confirmed' && (
                          <button onClick={() => updateStatus(r.reserveId, 'active')} className="text-xs px-2 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium">Start</button>
                        )}
                        {r.reservation_status === 'active' && (
                          <button onClick={() => updateStatus(r.reserveId, 'completed')} className="text-xs px-2 py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 font-medium">Complete</button>
                        )}
                        <button onClick={() => deleteReservation(r.reserveId)} className="text-ink-subtle hover:text-danger p-1.5 rounded-lg hover:bg-canvas transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                  )}
                  {reservations.length === 0 &&
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-ink-muted">No reservations found.</td></tr>
                  }
                </tbody>
              </table>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}

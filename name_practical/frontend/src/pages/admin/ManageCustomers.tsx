import React, { useEffect, useState } from 'react';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { AdminTopbar } from '../../components/layout/AdminTopbar';
import { Card } from '../../components/ui/Card';
import { api } from '../../api/client';

export function ManageCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const res = await api.get('/customers');
        setCustomers(res.data?.data?.customers ?? []);
      } catch {
        // handled by interceptor
      } finally {
        setIsLoading(false);
      }
    };
    loadCustomers();
  }, []);

  return (
    <div className="min-h-screen flex bg-canvas">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-ink">Customers Management</h1>
            <p className="text-ink-muted mt-1">View all registered customers.</p>
          </div>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-canvas/30">
                    <th className="px-6 py-4 text-xs font-semibold text-ink-muted uppercase tracking-wider">Full Name</th>
                    <th className="px-6 py-4 text-xs font-semibold text-ink-muted uppercase tracking-wider">National ID</th>
                    <th className="px-6 py-4 text-xs font-semibold text-ink-muted uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-4 text-xs font-semibold text-ink-muted uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-xs font-semibold text-ink-muted uppercase tracking-wider">Username</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-white">
                  {isLoading ? (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-ink-muted">Loading...</td></tr>
                  ) : customers.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-ink-muted">No customers found.</td></tr>
                  ) : (
                    customers.map((c) =>
                      <tr key={c.customerId} className="hover:bg-canvas/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-ink">{c.full_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">{c.national_ID}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">{c.phone || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">{c.email || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">{c.username || '-'}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}

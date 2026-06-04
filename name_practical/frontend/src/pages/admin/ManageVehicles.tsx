import React, { useEffect, useState } from 'react';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { AdminTopbar } from '../../components/layout/AdminTopbar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Plus, Trash2, Edit3 } from 'lucide-react';
import { api } from '../../api/client';
import toast from 'react-hot-toast';

export function ManageVehicles() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ plate_number: '', brand: '', model: '', year: 2024, vehicle_type: '', purchase_price: 0, status: 'available' });

  const loadVehicles = async () => {
    const res = await api.get('/vehicles');
    setVehicles(res.data?.data?.vehicles ?? []);
  };
  useEffect(() => { loadVehicles(); }, []);

  const openCreate = () => {
    setEditId(null);
    setForm({ plate_number: '', brand: '', model: '', year: 2024, vehicle_type: '', purchase_price: 0, status: 'available' });
    setIsOpen(true);
  };

  const openEdit = (v: any) => {
    setEditId(v.vehicleId);
    setForm({ plate_number: v.plate_number, brand: v.brand, model: v.model, year: v.year, vehicle_type: v.vehicle_type, purchase_price: v.purchase_price, status: v.status });
    setIsOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, year: Number(form.year), purchase_price: Number(form.purchase_price) };
    if (editId) {
      await api.put(`/vehicles/${editId}`, payload);
      toast.success('Vehicle updated');
    } else {
      await api.post('/vehicles', payload);
      toast.success('Vehicle created');
    }
    setIsOpen(false);
    await loadVehicles();
  };

  const deleteVehicle = async (id: number) => {
    if (!confirm('Delete this vehicle?')) return;
    await api.delete(`/vehicles/${id}`);
    toast.success('Vehicle deleted');
    await loadVehicles();
  };

  const statusVariant = (s: string) => {
    if (s === 'available') return 'success' as const;
    if (s === 'rented') return 'warning' as const;
    return 'danger' as const;
  };

  return (
    <div className="min-h-screen flex bg-canvas">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-ink">Vehicles Management</h1>
              <p className="text-ink-muted mt-1">Manage your fleet of vehicles.</p>
            </div>
            <Button onClick={openCreate}><Plus size={18} className="mr-2" />Add Vehicle</Button>
          </div>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-canvas/30">
                    <th className="px-6 py-4 text-xs font-semibold text-ink-muted uppercase tracking-wider">Plate</th>
                    <th className="px-6 py-4 text-xs font-semibold text-ink-muted uppercase tracking-wider">Brand / Model</th>
                    <th className="px-6 py-4 text-xs font-semibold text-ink-muted uppercase tracking-wider">Year</th>
                    <th className="px-6 py-4 text-xs font-semibold text-ink-muted uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-xs font-semibold text-ink-muted uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-xs font-semibold text-ink-muted uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-ink-muted uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-white">
                  {vehicles.map((v) =>
                  <tr key={v.vehicleId} className="hover:bg-canvas/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-ink">{v.plate_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink">{v.brand} {v.model}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">{v.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">{v.vehicle_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">{Number(v.purchase_price).toLocaleString()} RWF</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={statusVariant(v.status)} className="capitalize">{v.status}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button onClick={() => openEdit(v)} className="text-ink-subtle hover:text-ink p-2 rounded-lg hover:bg-canvas transition-colors"><Edit3 size={18} /></button>
                      <button onClick={() => deleteVehicle(v.vehicleId)} className="text-ink-subtle hover:text-danger p-2 rounded-lg hover:bg-canvas transition-colors"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                  )}
                  {vehicles.length === 0 &&
                  <tr><td colSpan={7} className="px-6 py-12 text-center text-ink-muted">No vehicles found.</td></tr>
                  }
                </tbody>
              </table>
            </div>
          </Card>
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <form onSubmit={save} className="bg-white rounded-2xl border border-border p-6 shadow-card-hover space-y-4">
              <h2 className="text-xl font-semibold text-ink">{editId ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
              <Input label="Plate Number" value={form.plate_number} onChange={(e) => setForm({ ...form, plate_number: e.target.value })} required />
              <Input label="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
              <Input label="Model" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} required />
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1"><Input label="Year" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} required /></div>
                <div className="flex-1"><Input label="Type" value={form.vehicle_type} onChange={(e) => setForm({ ...form, vehicle_type: e.target.value })} required /></div>
              </div>
              <Input label="Purchase Price (RWF)" type="number" value={form.purchase_price} onChange={(e) => setForm({ ...form, purchase_price: Number(e.target.value) })} required />
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm">
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <Button type="submit" className="w-full">{editId ? 'Update' : 'Save'} Vehicle</Button>
            </form>
          </Modal>
        </main>
      </div>
    </div>
  );
}

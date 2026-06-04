import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Car, Calendar } from 'lucide-react';
import { api } from '../../api/client';
import toast from 'react-hot-toast';

export function BookCar() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [booking, setBooking] = useState({ start_date: '', end_date: '' });

  useEffect(() => {
    const load = async () => {
      try {
        const [vRes, pRes] = await Promise.all([
          api.get('/vehicles/available'),
          api.get('/customers/profile')
        ]);
        setVehicles(vRes.data?.data?.vehicles ?? []);
        setProfile(pRes.data?.data?.customer);
      } catch (err) {
        console.error('Failed to load', err);
      }
    };
    load();
  }, []);

  const handleBook = async (vehicle: any) => {
    if (!profile) {
      toast.error('Please complete your profile first.');
      navigate('/customer/profile');
      return;
    }
    if (!booking.start_date || !booking.end_date) {
      toast.error('Please select start and end dates.');
      return;
    }
    try {
      await api.post('/reservations', {
        customerId: profile.customerId,
        vehicleId: vehicle.vehicleId,
        start_date: booking.start_date,
        end_date: booking.end_date
      });
      toast.success('Car booked successfully!');
      navigate('/customer/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Booking failed.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-ink mb-2">Book a Car</h1>
        <p className="text-ink-muted mb-8">Choose from our available vehicles and reserve your rental.</p>

        {!profile && (
          <div className="p-4 mb-6 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
            Please <a href="/customer/profile" className="font-semibold underline">complete your profile</a> before booking.
          </div>
        )}

        {profile && (
          <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-white rounded-xl border border-border">
            <div className="flex-1">
              <label className="block text-sm font-medium text-ink mb-1">Start Date</label>
              <input type="date" value={booking.start_date} onChange={(e) => setBooking({ ...booking, start_date: e.target.value })} className="w-full h-11 rounded-xl border border-border bg-white px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ink" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-ink mb-1">End Date</label>
              <input type="date" value={booking.end_date} onChange={(e) => setBooking({ ...booking, end_date: e.target.value })} className="w-full h-11 rounded-xl border border-border bg-white px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ink" />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <Card key={v.vehicleId} hoverable className="flex flex-col">
              <CardContent className="p-6 flex flex-col flex-1">
                <div className="w-full h-36 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 border border-border flex items-center justify-center mb-4">
                  <Car size={56} className="text-ink-subtle" />
                </div>
                <h3 className="text-lg font-semibold text-ink">{v.brand} {v.model}</h3>
                <div className="mt-2 space-y-1 text-sm text-ink-muted flex-1">
                  <p>Plate: {v.plate_number}</p>
                  <p>Year: {v.year} &middot; Type: {v.vehicle_type}</p>
                  <p>Price: {Number(v.purchase_price).toLocaleString()} RWF</p>
                </div>
                <Badge variant="success" className="mb-4 w-fit capitalize">{v.status}</Badge>
                <Button className="w-full" onClick={() => handleBook(v)} disabled={!profile}>
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
          {vehicles.length === 0 && (
            <div className="col-span-full text-center py-12 text-ink-muted">
              No available vehicles found.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

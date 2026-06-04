import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Car,
  LayoutDashboard,
  Users,
  CalendarDays,
  BarChart3,
  LogOut,
  Menu,
  X } from
'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../ui/Button';
export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const navItems = [
  { name: 'Overview', path: '/admin', icon: LayoutDashboard },
  { name: 'Customers', path: '/admin/customers', icon: Users },
  { name: 'Vehicles', path: '/admin/vehicles', icon: Car },
  { name: 'Reservations', path: '/admin/reservations', icon: CalendarDays },
  { name: 'Reports', path: '/admin/reports', icon: BarChart3 }];

  const sidebar = (
    <aside className="flex flex-col h-full bg-white">
      <div className="h-16 flex items-center justify-between px-6 border-b border-border">
        <Link to="/admin" className="flex items-center gap-2 group">
          <div className="bg-ink text-white p-1.5 rounded-lg">
            <Car size={18} />
          </div>
          <span className="text-lg font-bold tracking-tight text-ink">
            AdminPanel
          </span>
        </Link>
        <button className="lg:hidden text-ink-muted hover:text-ink p-1" onClick={() => setIsOpen(false)}>
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-ink-subtle uppercase tracking-wider mb-4 px-2">
          Management
        </div>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                isActive ?
                'bg-canvas text-ink' :
                'text-ink-muted hover:text-ink hover:bg-canvas/50'
              )}>
              <item.icon size={18} className={isActive ? 'text-ink' : 'text-ink-subtle'} />
              {item.name}
            </Link>);
        })}
      </div>

      <div className="p-4 border-t border-border space-y-1">
        <Link to="/" className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-ink-muted hover:text-ink hover:bg-canvas transition-colors mb-1">
          <Car size={18} className="text-ink-subtle" />
          View Site
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-ink-muted hover:text-ink hover:bg-canvas transition-colors">
          <LogOut size={18} className="text-ink-subtle" />
          Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <button
        className="fixed bottom-4 left-4 z-50 lg:hidden bg-accent text-accent-ink p-3 rounded-full shadow-lg hover:bg-accent-hover transition-colors"
        onClick={() => setIsOpen(!isOpen)}>
        <Menu size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      <div className="hidden lg:flex w-64 flex-shrink-0 sticky top-0 h-screen border-r border-border">
        {sidebar}
      </div>

      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebar}
      </div>
    </>);
}

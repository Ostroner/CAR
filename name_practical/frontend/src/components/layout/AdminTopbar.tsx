import React from 'react';
import { useAuth } from '../../context/AuthContext';
export function AdminTopbar() {
  const { user } = useAuth();
  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-8 sticky top-0 z-10">
      <div>
        <h2 className="text-lg font-semibold text-ink">Admin Dashboard</h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 pl-6 border-l border-border">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-ink leading-none mb-1">
              {user?.username}
            </p>
            <p className="text-xs text-ink-muted leading-none capitalize">Admin</p>
          </div>
        </div>
      </div>
    </header>);
}

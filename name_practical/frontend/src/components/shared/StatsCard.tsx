import React from 'react';
import { Card, CardContent } from '../ui/Card';
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
}
export function StatsCard({ title, value, icon: Icon }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-ink-muted">{title}</p>
          <div className="p-2 bg-canvas rounded-lg">
            <Icon size={18} className="text-ink-subtle" />
          </div>
        </div>
        <h4 className="text-2xl font-bold text-ink">{value}</h4>
      </CardContent>
    </Card>);
}

import React from 'react';
import { cn } from './Button';
export function LoadingSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-border-strong/50', className)}
      {...props} />);


}
export function ScheduleCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-border p-6 shadow-soft">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-4">
            <LoadingSkeleton className="h-6 w-24" />
            <LoadingSkeleton className="h-4 w-16" />
            <LoadingSkeleton className="h-6 w-24" />
          </div>
          <LoadingSkeleton className="h-4 w-48" />
          <div className="flex gap-2">
            <LoadingSkeleton className="h-6 w-20 rounded-full" />
            <LoadingSkeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
        <div className="flex flex-col items-end justify-between gap-4 md:border-l md:border-border md:pl-6">
          <div className="text-right space-y-2">
            <LoadingSkeleton className="h-8 w-24 ml-auto" />
            <LoadingSkeleton className="h-4 w-32 ml-auto" />
          </div>
          <LoadingSkeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>
    </div>);

}
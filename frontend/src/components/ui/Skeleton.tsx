import clsx from 'clsx';

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={clsx('skeleton', className)} />
);

export const CardSkeleton = () => (
  <div className="card space-y-3">
    <Skeleton className="h-40 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <div className="flex justify-between pt-2">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-6 w-20" />
    </div>
  </div>
);

export const GridSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export default Skeleton;

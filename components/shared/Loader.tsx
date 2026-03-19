import { cn } from '@/lib/utils';

interface LoaderProps {
  label?: string;
  className?: string;
}

export default function Loader({ label = 'Loading...', className }: LoaderProps) {
  return (
    <div className={cn('flex items-center justify-center gap-3 py-8 text-muted-foreground', className)}>
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary/35 border-t-primary" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

import { AlertCircle, SearchX } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/cn';

/** Height-reserving placeholder so async sections never shift the layout. */
export function Skeleton({ className }: { className?: string }) {
    return (
        <div
            aria-hidden="true"
            className={cn('animate-pulse rounded-[14px] border border-border-subtle bg-surface', className)}
        />
    );
}

export function ErrorState({
    message,
    onRetry,
    className,
}: {
    message: string;
    onRetry?: () => void;
    className?: string;
}) {
    return (
        <div
            role="alert"
            className={cn(
                'flex flex-col items-center gap-3 rounded-[14px] border border-border-subtle bg-surface px-6 py-12 text-center',
                className,
            )}
        >
            <AlertCircle aria-hidden="true" className="size-5 text-danger" />
            <p className="text-sm text-text-secondary">{message}</p>
            {onRetry && (
                <Button variant="secondary" size="sm" onClick={onRetry}>
                    Try again
                </Button>
            )}
        </div>
    );
}

export function EmptyState({
    title,
    description,
    action,
    className,
}: {
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'flex flex-col items-center gap-3 rounded-[14px] border border-border-subtle bg-surface px-6 py-14 text-center',
                className,
            )}
        >
            <SearchX aria-hidden="true" className="size-5 text-text-muted" />
            <div>
                <p className="text-sm font-medium">{title}</p>
                {description && <p className="mt-1 text-sm text-text-muted">{description}</p>}
            </div>
            {action}
        </div>
    );
}

import { cn } from '@/lib/cn';

const TONES: Record<string, string> = {
    GET: 'text-info border-info/25 bg-info/10',
    POST: 'text-brand border-brand/25 bg-brand/10',
    DELETE: 'text-danger border-danger/25 bg-danger/10',
};

export function ApiMethodBadge({ method, className }: { method: string; className?: string }) {
    return (
        <span
            className={cn(
                'inline-flex w-14 shrink-0 justify-center rounded border px-1.5 py-0.5 font-mono text-[10.5px] uppercase tracking-wide',
                TONES[method] ?? 'text-text-muted border-border-subtle bg-surface',
                className,
            )}
        >
            {method}
        </span>
    );
}

import { cn } from '@/lib/cn';

type Tone = 'success' | 'warning' | 'danger' | 'info' | 'muted';

const TONES: Record<Tone, string> = {
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
    info: 'bg-info',
    muted: 'bg-text-muted',
};

/**
 * Status is never conveyed by colour alone — every caller pairs this dot with
 * a text label, and the dot itself carries no meaning for screen readers.
 */
export function StatusDot({ tone, pulse, className }: { tone: Tone; pulse?: boolean; className?: string }) {
    return (
        <span aria-hidden="true" className={cn('relative inline-flex size-2 shrink-0', className)}>
            {pulse && (
                <span
                    className={cn('absolute inline-flex size-full animate-ping rounded-full opacity-60', TONES[tone])}
                />
            )}
            <span className={cn('relative inline-flex size-2 rounded-full', TONES[tone])} />
        </span>
    );
}

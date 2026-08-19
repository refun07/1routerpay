import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

const TONES: Record<Tone, string> = {
    neutral: 'border-border-subtle bg-surface-raised text-text-secondary',
    brand: 'border-brand/30 bg-brand/10 text-brand',
    success: 'border-success/30 bg-success/10 text-success',
    warning: 'border-warning/30 bg-warning/10 text-warning',
    danger: 'border-danger/30 bg-danger/10 text-danger',
    info: 'border-info/30 bg-info/10 text-info',
};

export function Badge({
    children,
    tone = 'neutral',
    mono,
    className,
}: {
    children: ReactNode;
    tone?: Tone;
    mono?: boolean;
    className?: string;
}) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs leading-5',
                mono && 'font-mono tracking-tight',
                TONES[tone],
                className,
            )}
        >
            {children}
        </span>
    );
}

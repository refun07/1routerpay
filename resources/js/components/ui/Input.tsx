import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

const FIELD =
    'w-full rounded-[10px] border border-border-subtle bg-surface-raised px-3.5 text-[15px] text-text-primary ' +
    'placeholder:text-text-muted transition-colors duration-200 hover:border-border-strong ' +
    'focus:border-brand/50 focus:outline-none focus-visible:outline-2 focus-visible:outline-brand ' +
    'aria-[invalid=true]:border-danger/60';

export function Input({ className, ...rest }: ComponentProps<'input'>) {
    return <input className={cn(FIELD, 'h-11', className)} {...rest} />;
}

export function Textarea({ className, ...rest }: ComponentProps<'textarea'>) {
    return <textarea className={cn(FIELD, 'min-h-28 py-3 leading-relaxed', className)} {...rest} />;
}

export function Field({
    label,
    htmlFor,
    hint,
    error,
    children,
}: {
    label: string;
    htmlFor: string;
    hint?: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label htmlFor={htmlFor} className="block text-sm font-medium text-text-secondary">
                {label}
            </label>
            {children}
            {error ? (
                <p id={`${htmlFor}-error`} className="text-sm text-danger">
                    {error}
                </p>
            ) : hint ? (
                <p className="text-xs text-text-muted">{hint}</p>
            ) : null}
        </div>
    );
}

import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type CardProps = ComponentProps<'div'> & {
    children: ReactNode;
    /** Slightly lighter surface for panels sitting on top of a section. */
    raised?: boolean;
    interactive?: boolean;
};

export function Card({ children, raised, interactive, className, ...rest }: CardProps) {
    return (
        <div
            className={cn(
                // min-w-0 keeps code blocks and tables from widening their grid column.
                'min-w-0 rounded-[14px] border border-border-subtle',
                raised ? 'bg-surface-raised' : 'bg-surface',
                interactive &&
                    'transition-[colors,transform,box-shadow] duration-200 hover:-translate-y-0.5 ' +
                        'hover:border-border-strong hover:bg-surface-raised ' +
                        'hover:shadow-[0_12px_32px_-16px_rgba(0,0,0,0.9)] motion-reduce:hover:translate-y-0',
                className,
            )}
            {...rest}
        >
            {children}
        </div>
    );
}

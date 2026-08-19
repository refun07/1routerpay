import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** Page gutters: 18px mobile, 24px tablet, 32px desktop (spec section 8). */
export function PageContainer({
    children,
    wide,
    className,
}: {
    children: ReactNode;
    wide?: boolean;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'mx-auto w-full px-[18px] sm:px-6 lg:px-8',
                wide ? 'max-w-[1320px]' : 'max-w-[1220px]',
                className,
            )}
        >
            {children}
        </div>
    );
}

import type { ReactNode } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { cn } from '@/lib/cn';
import { PageContainer } from './PageContainer';

type SectionProps = {
    children: ReactNode;
    id?: string;
    className?: string;
    /** Renders a hairline above the section to separate dense blocks. */
    bordered?: boolean;
    wide?: boolean;
    /**
     * Alternating surfaces stop a long page reading as one flat wall.
     *   plain  — page background
     *   raised — a slightly lifted band
     *   glow   — raised, with a soft brand light behind it
     */
    tone?: 'plain' | 'raised' | 'glow';
    'aria-labelledby'?: string;
};

const TONES = {
    plain: '',
    raised: 'bg-surface/30',
    glow: 'bg-surface/30',
} as const;

export function Section({ children, id, className, bordered, wide, tone = 'plain', ...rest }: SectionProps) {
    const ref = useReveal<HTMLElement>();

    return (
        <section
            id={id}
            ref={ref}
            className={cn(
                'reveal relative isolate py-20 sm:py-24 lg:py-28',
                bordered && 'border-t border-border-subtle',
                TONES[tone],
                className,
            )}
            {...rest}
        >
            {tone === 'glow' && (
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[28rem] w-[60rem] -translate-x-1/2 rounded-full bg-brand/[0.045] blur-[120px]"
                />
            )}

            <PageContainer wide={wide}>{children}</PageContainer>
        </section>
    );
}

export function SectionHeading({
    eyebrow,
    title,
    description,
    id,
    align = 'left',
    className,
}: {
    eyebrow?: string;
    title: ReactNode;
    description?: ReactNode;
    id?: string;
    align?: 'left' | 'center';
    className?: string;
}) {
    return (
        <div
            className={cn(
                'max-w-2xl',
                align === 'center' && 'mx-auto text-center',
                className,
            )}
        >
            {eyebrow && (
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-text-muted">
                    {eyebrow}
                </p>
            )}
            <h2
                id={id}
                className="text-balance text-[30px] font-medium leading-[1.15] tracking-[-0.02em] sm:text-[38px] lg:text-[42px]"
            >
                {title}
            </h2>
            {description && (
                <p className="mt-4 text-[16px] leading-relaxed text-text-secondary sm:text-[17px]">
                    {description}
                </p>
            )}
        </div>
    );
}

import type { ReactNode } from 'react';
import { PageContainer } from './PageContainer';

export function PageHeader({
    eyebrow,
    title,
    description,
    actions,
    mark,
}: {
    eyebrow?: string;
    title: string;
    description?: ReactNode;
    actions?: ReactNode;
    /** Optional identity mark shown beside the title, e.g. a provider logo. */
    mark?: ReactNode;
}) {
    return (
        <header className="relative isolate overflow-hidden border-b border-border-subtle pb-12 pt-14 sm:pb-16 sm:pt-20">
            <div aria-hidden="true" className="bg-hero-grid pointer-events-none absolute inset-0 -z-10" />

            <PageContainer wide>
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <div className="max-w-2xl">
                        {eyebrow && (
                            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-text-muted">
                                {eyebrow}
                            </p>
                        )}
                        <div className="flex items-center gap-4">
                            {mark}
                            <h1 className="text-balance text-[34px] font-medium leading-[1.1] tracking-[-0.028em] sm:text-[46px]">
                                {title}
                            </h1>
                        </div>
                        {description && (
                            <p className="mt-4 text-[16px] leading-relaxed text-text-secondary sm:text-[17px]">
                                {description}
                            </p>
                        )}
                    </div>

                    {actions}
                </div>
            </PageContainer>
        </header>
    );
}

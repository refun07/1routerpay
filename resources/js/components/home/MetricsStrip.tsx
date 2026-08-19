import { PageContainer } from '@/components/layout/PageContainer';
import { brand } from '@/lib/brand';

/**
 * Launch-state metrics describe what the product *is*, not how much volume it
 * has processed. They come from config so they can become live figures later —
 * production numbers are never seeded as if they were real.
 */
export function MetricsStrip() {
    if (brand.heroMetrics.length === 0) return null;

    return (
        <section aria-label="Platform facts" className="border-y border-border-subtle bg-surface/30">
            <PageContainer wide>
                <dl className="grid grid-cols-2 divide-border-subtle sm:divide-x lg:grid-cols-4">
                    {brand.heroMetrics.map((metric, index) => (
                        <div
                            key={metric.label}
                            className={[
                                'px-0 py-6 sm:px-6 lg:py-7',
                                index % 2 === 1 ? 'border-l border-border-subtle pl-5 sm:pl-6' : '',
                                index < 2 ? 'border-b border-border-subtle sm:border-b-0' : '',
                                index === 0 ? 'sm:pl-0' : '',
                            ].join(' ')}
                        >
                            <dt className="sr-only">{metric.label}</dt>
                            <dd>
                                <span className="block font-mono text-[15px] uppercase tracking-[0.06em] text-brand sm:text-base">
                                    {metric.value}
                                </span>
                                <span className="mt-1.5 block text-sm text-text-muted">{metric.label}</span>
                            </dd>
                        </div>
                    ))}
                </dl>
            </PageContainer>
        </section>
    );
}

import { PageContainer } from '@/components/layout/PageContainer';
import { ButtonLink } from '@/components/ui/Button';
import { docs } from '@/lib/brand';
import { track } from '@/lib/analytics';
import { useReveal } from '@/hooks/useReveal';

export function FinalCTA() {
    const ref = useReveal<HTMLElement>();

    return (
        <section
            ref={ref}
            aria-labelledby="final-cta-heading"
            className="reveal relative isolate overflow-hidden border-t border-border-subtle py-24 sm:py-28"
        >
            <div aria-hidden="true" className="bg-hero-grid pointer-events-none absolute inset-0 -z-10" />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[26rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/[0.06] blur-[110px]"
            />

            <PageContainer>
                <div className="mx-auto max-w-2xl text-center">
                    <h2
                        id="final-cta-heading"
                        className="text-balance text-[32px] font-medium leading-[1.12] tracking-[-0.025em] sm:text-[44px]"
                    >
                        Build your payment stack once. Keep it flexible.
                    </h2>

                    <p className="mx-auto mt-5 max-w-[52ch] text-[16px] leading-relaxed text-text-secondary sm:text-[17px]">
                        Start with one API and keep your provider layer modular as your business grows.
                    </p>

                    <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                        <ButtonLink
                            to="/register"
                            size="lg"
                            onClick={() => track('hero_get_api_key_clicked', { from: 'final_cta' })}
                        >
                            Get API Key
                        </ButtonLink>
                        <ButtonLink
                            to={docs.href}
                            size="lg"
                            variant="secondary"
                            onClick={() => track('docs_clicked', { from: 'final_cta' })}
                        >
                            {docs.label}
                        </ButtonLink>
                    </div>
                </div>
            </PageContainer>
        </section>
    );
}

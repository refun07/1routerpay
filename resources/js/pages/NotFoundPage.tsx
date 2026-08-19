import { PageContainer } from '@/components/layout/PageContainer';
import { ButtonLink } from '@/components/ui/Button';
import { brand } from '@/lib/brand';
import { usePageMeta } from '@/app/usePageMeta';

export function NotFoundPage() {
    usePageMeta(`Page not found — ${brand.productName}`);

    return (
        <PageContainer className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
            <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-text-muted">404</p>
            <h1 className="mt-4 text-[32px] font-medium tracking-[-0.02em]">This route does not exist</h1>
            <p className="mt-3 max-w-[46ch] text-[15px] text-text-secondary">
                The page you were looking for has moved or was never here.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink to="/">Back to home</ButtonLink>
                <ButtonLink to="/developers" variant="secondary">
                    Developer reference
                </ButtonLink>
            </div>
        </PageContainer>
    );
}

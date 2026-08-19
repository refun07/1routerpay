import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HomePage } from '@/pages/HomePage';
import { ScrollToTop } from './ScrollToTop';

/*
 | The homepage ships in the initial bundle — it is what most visitors land on.
 | Every other public route is code-split so it costs nothing until visited.
 */
const ProvidersPage = lazy(() => import('@/pages/ProvidersPage').then((m) => ({ default: m.ProvidersPage })));
const ProviderDetailPage = lazy(() =>
    import('@/pages/ProviderDetailPage').then((m) => ({ default: m.ProviderDetailPage })),
);
const RoutingPage = lazy(() => import('@/pages/RoutingPage').then((m) => ({ default: m.RoutingPage })));
const PricingPage = lazy(() => import('@/pages/PricingPage').then((m) => ({ default: m.PricingPage })));
const DevelopersPage = lazy(() => import('@/pages/DevelopersPage').then((m) => ({ default: m.DevelopersPage })));
const StatusPage = lazy(() => import('@/pages/StatusPage').then((m) => ({ default: m.StatusPage })));
const RankingsPage = lazy(() => import('@/pages/RankingsPage').then((m) => ({ default: m.RankingsPage })));
const BenchmarksPage = lazy(() =>
    import('@/pages/BenchmarksPage').then((m) => ({ default: m.BenchmarksPage })),
);
const DocsPage = lazy(() => import('@/pages/DocsPage').then((m) => ({ default: m.DocsPage })));
const ContactSalesPage = lazy(() =>
    import('@/pages/ContactSalesPage').then((m) => ({ default: m.ContactSalesPage })),
);
const LoginPage = lazy(() => import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@/pages/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

/** Reserves viewport height while a route chunk loads, so nothing shifts. */
function RouteFallback() {
    return <div aria-hidden="true" className="min-h-[70vh]" />;
}

export function App() {
    return (
        <>
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-background"
            >
                Skip to content
            </a>

            <ScrollToTop />
            <Navbar />

            <main id="main">
                <Suspense fallback={<RouteFallback />}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/providers" element={<ProvidersPage />} />
                        <Route path="/providers/:slug" element={<ProviderDetailPage />} />
                        <Route path="/routing" element={<RoutingPage />} />
                        <Route path="/pricing" element={<PricingPage />} />
                        <Route path="/developers" element={<DevelopersPage />} />
                        <Route path="/status" element={<StatusPage />} />
                        <Route path="/rankings" element={<RankingsPage />} />
                        <Route path="/benchmarks" element={<BenchmarksPage />} />
                        <Route path="/docs" element={<DocsPage />} />
                        <Route path="/contact-sales" element={<ContactSalesPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </Suspense>
            </main>

            <Footer />
        </>
    );
}

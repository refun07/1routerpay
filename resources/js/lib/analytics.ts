/**
 * Analytics abstraction.
 *
 * Components call `track(...)` and never touch a vendor SDK directly, so the
 * provider can be swapped (or stay absent) without editing components.
 */

export type AnalyticsEvent =
    | 'hero_get_api_key_clicked'
    | 'hero_explore_providers_clicked'
    | 'docs_clicked'
    | 'pricing_viewed'
    | 'provider_viewed'
    | 'routing_demo_changed'
    | 'code_language_changed'
    | 'code_copied'
    | 'contact_sales_clicked'
    | 'signup_started'
    | 'signup_completed';

type Sink = (event: AnalyticsEvent, properties?: Record<string, unknown>) => void;

let sink: Sink | null = null;

/** Wire a real analytics provider here once one is chosen. */
export function registerAnalyticsSink(next: Sink): void {
    sink = next;
}

export function track(event: AnalyticsEvent, properties?: Record<string, unknown>): void {
    if (sink) {
        sink(event, properties);
        return;
    }

    if (import.meta.env.DEV) {
        console.debug('[analytics]', event, properties ?? {});
    }
}

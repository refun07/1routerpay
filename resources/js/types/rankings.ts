import type { ProviderType } from './provider';

/** Null means the metric was not measured — render an em dash, never a zero. */
export type MetricFigures = {
    availability: number | null;
    probes_total: number;
    payments_routed: number;
    success_rate: number | null;
    unknown_rate: number | null;
    decision_latency_p50: number | null;
};

type ProviderIdentity = {
    slug: string;
    name: string;
    legal_name: string | null;
    provider_type: ProviderType;
    logo_path: string | null;
};

export type RankedProvider = ProviderIdentity & MetricFigures;

export type RankedProviderByMethod = ProviderIdentity & {
    totals: MetricFigures;
    /** Keyed by method — a method absent here was never measured for this provider. */
    methods: Record<string, MetricFigures>;
};

export type RankingsView = 'overall' | 'by_method';

export type Rankings = {
    mode: 'live' | 'empty' | 'demo';
    view: RankingsView;
    window_days: number;
    measured_from: string | null;
    /** Column order for the by-method view. */
    methods: string[];
    providers: RankedProvider[] | RankedProviderByMethod[];
    note: string | null;
};

export const METHOD_LABELS: Record<string, string> = {
    bkash: 'bKash',
    nagad: 'Nagad',
    rocket: 'Rocket',
    upay: 'Upay',
    card: 'Cards',
    internet_banking: 'Internet banking',
    bank_transfer: 'Bank transfer',
    qr: 'QR',
};

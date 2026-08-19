export type IntegrationStatus =
    | 'available'
    | 'private_beta'
    | 'coming_soon'
    | 'merchant_connection_required';

export type ProviderHealth = 'operational' | 'degraded' | 'offline' | 'unknown';

export type ProviderCategory = 'mfs' | 'card' | 'bank' | 'internet_banking' | 'qr';

export type ConnectionType = 'direct' | 'merchant_credentials' | 'partner';

export type ProviderType = 'pso' | 'psp' | 'mfs' | 'bank' | 'scheme' | 'rail';

export type Provider = {
    slug: string;
    name: string;
    /** Registered entity name, when it differs from the trading brand. */
    legal_name: string | null;
    short_description: string;
    description: string | null;
    category: ProviderCategory;
    provider_type: ProviderType;
    /** Approved brand asset supplied by the product owner, or null. */
    logo_path: string | null;
    use_cases: string[];
    website: string | null;
    methods: string[];
    /** False until the provider's supported methods are confirmed in scoping. */
    methods_confirmed: boolean;
    /** Commercial partnership asserted by the product owner. */
    is_partner: boolean;
    currencies: string[];
    connection_type: ConnectionType;
    integration_status: IntegrationStatus;
    settlement_ownership: string;
    health: ProviderHealth;
};

export const INTEGRATION_STATUS_LABELS: Record<IntegrationStatus, string> = {
    available: 'Available',
    private_beta: 'Private beta',
    coming_soon: 'Coming soon',
    merchant_connection_required: 'Merchant connection required',
};

export const CATEGORY_LABELS: Record<ProviderCategory, string> = {
    mfs: 'MFS',
    card: 'Cards',
    bank: 'Bank payments',
    internet_banking: 'Internet banking',
    qr: 'QR / future rails',
};

export const CONNECTION_LABELS: Record<ConnectionType, string> = {
    direct: 'Direct',
    merchant_credentials: 'Merchant credentials',
    partner: 'Partner',
};

export const HEALTH_LABELS: Record<ProviderHealth, string> = {
    operational: 'Operational',
    degraded: 'Degraded',
    offline: 'Offline',
    unknown: 'Not monitored yet',
};

/**
 * How each company presents itself, not a statement about licensing.
 * Verify regulatory status with Bangladesh Bank before publishing.
 */
export const PROVIDER_TYPE_LABELS: Record<ProviderType, string> = {
    pso: 'Gateway / PSO',
    psp: 'Payment service provider',
    mfs: 'Mobile financial services',
    bank: 'Bank channel',
    scheme: 'Card scheme',
    rail: 'Payment rail',
};

export const PROVIDER_TYPE_SHORT: Record<ProviderType, string> = {
    pso: 'PSO',
    psp: 'PSP',
    mfs: 'MFS',
    bank: 'Bank',
    scheme: 'Card',
    rail: 'Rail',
};

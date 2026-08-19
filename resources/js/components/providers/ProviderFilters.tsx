import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/cn';

export type ProviderFilterState = {
    search: string;
    type: string;
    category: string;
    status: string;
    connection: string;
    currency: string;
    sort: string;
};

export const EMPTY_FILTERS: ProviderFilterState = {
    search: '',
    type: '',
    category: '',
    status: '',
    connection: '',
    currency: '',
    sort: '',
};

const SELECTS: {
    key: keyof ProviderFilterState;
    label: string;
    options: { value: string; label: string }[];
}[] = [
    {
        key: 'type',
        label: 'Provider type',
        options: [
            { value: '', label: 'All provider types' },
            { value: 'pso', label: 'Gateway / PSO' },
            { value: 'mfs', label: 'Mobile financial services' },
            { value: 'bank', label: 'Bank channel' },
            { value: 'scheme', label: 'Card scheme' },
            { value: 'rail', label: 'Payment rail' },
        ],
    },
    {
        key: 'category',
        label: 'Payment method',
        options: [
            { value: '', label: 'All methods' },
            { value: 'mfs', label: 'MFS' },
            { value: 'card', label: 'Cards' },
            { value: 'bank', label: 'Bank payments' },
            { value: 'internet_banking', label: 'Internet banking' },
            { value: 'qr', label: 'QR / future rails' },
        ],
    },
    {
        key: 'connection',
        label: 'Connection type',
        options: [
            { value: '', label: 'All connections' },
            { value: 'direct', label: 'Direct' },
            { value: 'merchant_credentials', label: 'Merchant credentials' },
            { value: 'partner', label: 'Partner' },
        ],
    },
    {
        key: 'status',
        label: 'Integration status',
        options: [
            { value: '', label: 'All statuses' },
            { value: 'available', label: 'Available' },
            { value: 'private_beta', label: 'Private beta' },
            { value: 'coming_soon', label: 'Coming soon' },
            { value: 'merchant_connection_required', label: 'Merchant connection required' },
        ],
    },
    {
        key: 'currency',
        label: 'Currency',
        options: [
            { value: '', label: 'All currencies' },
            { value: 'BDT', label: 'BDT' },
        ],
    },
    {
        key: 'sort',
        label: 'Sort',
        options: [
            { value: '', label: 'Recommended order' },
            { value: 'name', label: 'Name (A–Z)' },
        ],
    },
];

const SELECT_CLASS =
    'h-10 w-full appearance-none rounded-[10px] border border-border-subtle bg-surface-raised px-3 pr-8 text-[13.5px] ' +
    'text-text-secondary transition-colors duration-200 hover:border-border-strong focus:border-brand/50 focus:outline-none ' +
    "bg-[url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='%2368727C'><path d='M6 8.5 2 4h8z'/></svg>\")] " +
    'bg-[length:12px_12px] bg-[right_10px_center] bg-no-repeat';

export function ProviderFilters({
    filters,
    onChange,
    className,
}: {
    filters: ProviderFilterState;
    onChange: (filters: ProviderFilterState) => void;
    className?: string;
}) {
    const set = (key: keyof ProviderFilterState, value: string) =>
        onChange({ ...filters, [key]: value });

    return (
        <div className={cn('space-y-4', className)}>
            <div className="relative">
                <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-text-muted"
                />
                <label htmlFor="provider-search" className="sr-only">
                    Search providers
                </label>
                <Input
                    id="provider-search"
                    type="search"
                    className="pl-10"
                    placeholder="Search providers and payment methods"
                    value={filters.search}
                    onChange={(event) => set('search', event.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
                {SELECTS.map((select) => (
                    <div key={select.key}>
                        <label htmlFor={`filter-${select.key}`} className="sr-only">
                            {select.label}
                        </label>
                        <select
                            id={`filter-${select.key}`}
                            className={SELECT_CLASS}
                            value={filters[select.key]}
                            onChange={(event) => set(select.key, event.target.value)}
                        >
                            {select.options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
}

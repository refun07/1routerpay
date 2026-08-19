/** Format a minor-unit BDT amount (poisha) for display. */
export function formatBdt(minorUnits: number): string {
    return new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
        currencyDisplay: 'narrowSymbol',
        minimumFractionDigits: 0,
    }).format(minorUnits / 100);
}

export function formatTime(iso: string | null): string {
    if (!iso) return '—';
    return new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(iso));
}

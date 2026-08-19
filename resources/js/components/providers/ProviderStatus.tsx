import { Badge } from '@/components/ui/Badge';
import { StatusDot } from '@/components/ui/StatusDot';
import { healthTone } from '@/lib/status';
import { cn } from '@/lib/cn';
import {
    HEALTH_LABELS,
    INTEGRATION_STATUS_LABELS,
    type IntegrationStatus,
    type ProviderHealth,
} from '@/types/provider';

const STATUS_TONES: Record<IntegrationStatus, 'success' | 'info' | 'neutral' | 'warning'> = {
    available: 'success',
    private_beta: 'info',
    coming_soon: 'neutral',
    merchant_connection_required: 'warning',
};

/**
 * Observed health. Always paired with its text label — status is never
 * communicated by colour alone.
 */
export function ProviderHealthLabel({
    health,
    className,
}: {
    health: ProviderHealth;
    className?: string;
}) {
    return (
        <span className={cn('inline-flex items-center gap-1.5 font-mono text-text-secondary', className)}>
            <StatusDot tone={healthTone(health)} />
            {HEALTH_LABELS[health]}
        </span>
    );
}

/** Contractual/technical availability, which is separate from health. */
export function IntegrationStatusBadge({ status }: { status: IntegrationStatus }) {
    return <Badge tone={STATUS_TONES[status]}>{INTEGRATION_STATUS_LABELS[status]}</Badge>;
}

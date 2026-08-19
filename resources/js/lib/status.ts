import type { ComponentStatus } from '@/types/status';
import type { ProviderHealth } from '@/types/provider';

type Tone = 'success' | 'warning' | 'danger' | 'info' | 'muted';

const COMPONENT_TONES: Record<ComponentStatus, Tone> = {
    operational: 'success',
    degraded: 'warning',
    partial_outage: 'warning',
    major_outage: 'danger',
    maintenance: 'info',
    unknown: 'muted',
};

const HEALTH_TONES: Record<ProviderHealth, Tone> = {
    operational: 'success',
    degraded: 'warning',
    offline: 'danger',
    unknown: 'muted',
};

export function statusTone(status: ComponentStatus): Tone {
    return COMPONENT_TONES[status] ?? 'muted';
}

export function healthTone(health: ProviderHealth): Tone {
    return HEALTH_TONES[health] ?? 'muted';
}

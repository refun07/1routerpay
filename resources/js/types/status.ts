export type ComponentStatus =
    | 'operational'
    | 'degraded'
    | 'partial_outage'
    | 'major_outage'
    | 'maintenance'
    | 'unknown';

export type StatusComponent = {
    key: string;
    name: string;
    description: string | null;
    status: ComponentStatus;
    status_changed_at: string | null;
};

export type Incident = {
    title: string;
    summary: string;
    state: 'investigating' | 'identified' | 'monitoring' | 'resolved';
    impact: string;
    affected_components: string[];
    started_at: string | null;
    resolved_at: string | null;
};

export type PlatformStatus = {
    overall: ComponentStatus;
    components: StatusComponent[];
    incidents: Incident[];
    checked_at: string;
};

export const STATUS_LABELS: Record<ComponentStatus, string> = {
    operational: 'Operational',
    degraded: 'Degraded performance',
    partial_outage: 'Partial outage',
    major_outage: 'Major outage',
    maintenance: 'Maintenance',
    unknown: 'Unknown',
};
